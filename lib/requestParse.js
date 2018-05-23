const systems = require('../systems')['systems'];

module.exports = function (req) {
  const [path, qs] = req.url.split('?');
  const [type, system, object] = path.slice(1).split('/');
  if (!type || !system) return new Error('Wrong URL address');
  const [name , format] = object.split('.');  
 

  const service = systems[system];
  if (!service) return new Error(`${system} does not exist`);

  return {
    protocol: parseProtocol(service),
    path: service,
    qs: qs,
    name: name,
    format: format || req.headers['accept-type'] || 'xml',
    type: type
  };
};

function parseProtocol(system) {
  return system.slice(0, system.indexOf('://'));
}