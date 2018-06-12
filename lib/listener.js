const requestParse = require('./parsers/request');
const authorization = require('./authorization');
const adapters = require('./adapters');
const transformers = require('./transformes');
const converters = require('./converters');
const tokens = require('../systems')['tokens'];
const systems = require('../systems')['systems'];

const pool = {};

const methods = {
  'GET': 'read',
  'POST': 'create',
  'PATCH': 'update',
  'DELETE': 'delete'
};

function listener(req, res) {
  const access = auth(req.headers['x-n-router-token'], methods[req.method]);  
  if (access instanceof Error) return res.end(access.toString());

  const properties = requestParse(req);
  const uri = systems[properties.system];
  if (!uri) return res.end(`System ${properties.system} does not exist or URL wrong`);  
  const { protocol, path } = parseURI(uri);

  const Adapter = adapters[protocol];
  const adapter = pool[properties.system] || new Adapter(path);
  if (!pool[properties.system]) pool[properties.system] = adapter;

  connection(adapter, properties, protocol, req, res);
}

function auth(token, method) {
  if (!token) return new Error('Use token for perform the operation');
  const access = authorization(token, tokens);
  if(!(access instanceof Error) && !access[method]) return new Error('You do not have access rights to perform the operation');

  return access;
}

function parseURI(path) {
  const index = path.indexOf('://');
  return {
    protocol: path.slice(0, index),
    path: path.slice(index + 3)
  };
}

function connection(adapter, properties, protocol, req, res) {
  const method = methods[req.method];
  switch (protocol) {
    case 'http': 
      adapter[method](properties, (err, stream) => {
        if (err) return handleError(err, res);
        if (method == 'read' || method == 'delete') stream.pipe(res);
        if (method == 'update' || method == 'create') req.pipe(stream).pipe(res);
      });
      break;
    case 'mysql':
    case 'postgresql': {
      const Transformer = transformers[properties.format];
      if (!Transformer) return res.end('Unknown this format');
      res.writeHead(200, { 'Content-Type': Transformer.contentType });
      const transform = new Transformer();

      if (method == 'read' || method == 'delete') {
        adapter[method](properties, (err, stream) => {
          if (err) return handleError(err, res);
          stream.pipe(transform).pipe(res);
        });
      }

      if (method == 'update' || method == 'create') {
        const Converter = converters[req.headers['content-type']];
        if (!Converter) return res.end('Unknown this content-type');
        const convert = new Converter();

        req.pipe(convert);
        convert.on('data', (data) => {
          adapter[method](data, properties, (err, stream) => {
            if (err) return handleError(err, res);
            stream.on('data', (row) => {
              transform.write(row);
            });
            stream.on('end', () => transform.end());

            transform.pipe(res);
          });
        });
      }
      break;
    }
  }
}

function handleError(err, res) {
  res.status(500).send({ error: err});
}

module.exports = listener;