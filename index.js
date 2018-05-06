const http = require('http');
const requestParse = require('./lib/request-parse');
const transformers = require('./lib/transformes');
const connectors = require('./lib/connector');
const converter = require('./lib/converter');

const server = http.createServer(listener);
server.listen(3000);

function listener(req, res) {
  /* get the information from request*/
  const properties = requestParse(req);
  if (!properties) return res.end('This path is not correct');

  const Connector = connectors[properties.type];
  if (!Connector) return res.end(`Unknown this type of service ${properties.type}`);
  const connection = new Connector[properties.method](properties);

  if (!properties.path) return res.end(`Unknown system ${properties.system}`);

  const Transformer = transformers[properties.format || 'xml'];
  if (!Transformer) return res.end('Unknown this format');
  res.writeHead(200, {
    'Content-Type': Transformer.contentType
  });
  const transform = new Transformer();

  switch (properties.method) {
    case 'GET': 
    case 'DELETE': {
      const connect = connection.create();
      if (properties.type == 'web')
        connect.pipe(res);
      else {
        connect.pipe(transform).pipe(res);

        transform.on('end', () => {
          connection.close();
          res.end();
        });
      }
      break;
    }
    case 'POST': 
    case 'PATCH': {
      const convert = new converter[properties.convertType]();

      if (properties.type != 'web') {
        req.pipe(convert).pipe(connection).pipe(transform).pipe(res);
        transform.on('end', () => {
          res.end();
        });
      } else {
        req.pipe(connection.create()).pipe(res);   
      }
      break;    
    }
    default: {
      return res.end(`This request method ${properties.method} not supported`);
    }
  }
}

module.exports = server;