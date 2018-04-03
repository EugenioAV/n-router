const http = require('http');
const requestParse = require('./lib/request-parse');
const transformers = require('./lib/transformes');

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

  console.log(properties);

  /* transform: xml or json */
  const Transformer = transformers[properties.format || 'xml'];
  if (!Transformer)
    return res.end('Unknown this format');
  const transform = new Transformer();

  res.writeHead(200, {
    'Content-Type': Transformer.contentType
  });

  res.end('ok');

}

module.exports = server;