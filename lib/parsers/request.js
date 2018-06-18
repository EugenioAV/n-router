module.exports = function (req) {
  const [path, qs] = req.url.split('?');
  const [type, system, object] = path.slice(1).split('/');
  const [name, format] = object ? object.split('.') : ['',''];

  return {
    type: type,
    system: system,
    qs: qs,
    name: name,
    format: format || 'xml',
    accept_type: req.headers['accept-type'],
    convert_type: req.headers['convert-type']
  };
};
