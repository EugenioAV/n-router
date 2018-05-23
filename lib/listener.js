const requestParse = require('./requestParse');
const authorization = require('./authorization');

const pool = {};

const methods = {
  'GET': 'read',
  'POST': 'create',
  'PATCH': 'update',
  'DELETE': 'delete'
};

function listener(req, res) {
  const properties = requestParse(req);
  if (properties instanceof Error) res.end(properties.toString());
  const access = authorization(req.headers['x-n-router-token']);

  if (access instanceof Error) res.end(access.toString());
  if(!access[methods[req.method]]) res.end('You do not have access rights to perform the operation');

  res.end();
}

module.exports = listener;