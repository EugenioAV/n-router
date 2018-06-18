const requestParse = require('./parsers/request');
const authorization = require('./authorization');
const adapters = require('./adapters');
const transformers = require('./transformes');
const converters = require('./converters');
const systems = require('../systems')['systems'];

const pool = {};

const methods = {
  'GET': 'read',
  'POST': 'create',
  'PATCH': 'update',
  'DELETE': 'delete'
};

function listener(req, res) {
  const action = methods[req.method];
  try { auth(req.headers['x-n-router-token'], action); } catch (err) { return res.end(err.message); }

  const { type, system, qs, name, format } = requestParse(req);
  const uri = systems[system];
  if (!uri) return res.end(`System ${system} does not exist or URL wrong`);  
  const { protocol, path } = parseURI(uri);

  const Adapter = adapters[protocol];
  const Transformer = transformers[format];
  if (!Adapter) return res.end('Unknown this adapter to connection');  
  if (!Transformer) return res.end('Unknown this format to respone');
  res.writeHead(200, { 'Content-Type': Transformer.contentType });
  
  const adapter = pool[system] || new Adapter(path);
  if (!pool[system]) pool[system] = adapter;

  let body;
  try { body = parseBody(req); } catch (err) { return res.end(err.message); }
  adapter[action]({type, name, qs}, (err, stream) => {
    if (err) return handleError(err, res);
    const transformer = new Transformer();
    const result = body ? body.pipe(stream) : stream;
  
    result.pipe(transformer).pipe(res);
  });
}

function auth(token, method) {
  if (!token) throw new Error('Use token for perform the operation');

  const access = authorization(token);
  if(!access[method]) throw new Error('You do not have access rights to perform the operation');

  return access;
}

function parseURI(path) {
  const index = path.indexOf('://');
  return {
    protocol: path.slice(0, index),
    path: path.slice(index + 3)
  };
}

function parseBody(req) {
  if (req.method != 'POST' && req.method != 'PATCH') return;

  const format = req.headers['content-type'];
  const Parser = converters[format];
  if (!Parser) throw new Error('Unknown this format from body');

  return req.pipe(new Parser());
}

function handleError(err, res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end(err.toString());
}

module.exports = listener;