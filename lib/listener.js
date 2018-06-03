const requestParse = require('./requestParse');
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
  const method = methods[req.method];

  const access = auth(req.headers['x-n-router-token'], method);  
  if (access instanceof Error) return res.end(access.toString());

  const config = requestParse(req);
  config.path = systems[config.system];
  if (!config.path) return res.end(`System ${config.system} does not exist or URL wrong`);

  const Adapter = adapters[getProtocol(config.path)];
  const adapter = pool[config.system] || new Adapter(config);
  if (!pool[config.system]) pool[config.system] = adapter;

  let stream = adapter[method]();

  stream.pipe(res);
}

function auth(token, method) {
  if (!token) return new Error('Use token for perform the operation');
  const access = authorization(token, tokens);
  if(!(access instanceof Error) && !access[method]) return new Error('You do not have access rights to perform the operation');

  return access;
}

function getProtocol(path) {
  return path.slice(0, path.indexOf('://'));
}

module.exports = listener;