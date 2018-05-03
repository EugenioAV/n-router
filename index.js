const http = require('http');
const requestParse = require('./lib/request-parse');
const transformers = require('./lib/transformes');
const connectors = require('./lib/connector');
const converter = require('./lib/converter');

const server = http.createServer(listener);
server.listen(3000);

function listener(req, res) {
  /* get the information from req: type, system, name, format of output, sql, format of body */
  const properties = requestParse(req);
  if (!properties) {
    return res.end('This path is not correct');
  }

  if (!properties.path) 
    return res.end(`Unknown system ${properties.system}`);

  const Transformer = transformers[properties.format || 'xml'];
  if (!Transformer)
    return res.end('Unknown this format');
  res.writeHead(200, {
    'Content-Type': Transformer.contentType
  });
  const transform = new Transformer();

  if (properties.method == 'GET' || properties.method == 'DELETE') {    
    let connection = new connectors[properties.type]['withoutBody'](properties);
    let connect = connection.create();

    if (properties.type == 'web')
      connection.create().pipe(res);
    else {
      connect.pipe(transform).pipe(res);

      transform.on('end', () => {
        connection.close();
        res.end();
      });
    }
  } else {
    let convert = new converter[properties.convertType]();
    let connection = new connectors[properties.type]['withBody'](properties);
    req.pipe(convert).pipe(connection).pipe(transform).pipe(res);
    transform.on('end', () => {
      res.end();
    });
  }
}

module.exports = server;