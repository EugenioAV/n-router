const querystring = require('../qs');
const sql = require('../sql');
const systems = require('../../systems');

module.exports = function (req) {
  const [path, qs] = req.url.split('?');
  const [type, system, object = ''] = path.slice(1).split('/');

  if (!type || !system) {
    return;
  }
  
  var properties = (type == 'database') ? parse.database(system, qs, req.method, object) : (type == 'web') ? parse.web(system, qs) : undefined;
  if (!properties) return;
  var contentType;
  if (req.headers) {
    contentType = (req.headers['content-type'] == 'application/xml') ? 'xml' : (req.headers['content-type'] == 'application/json') ? 'json' : undefined;
  }
  properties.contentType = contentType;
  properties.method = req.method;

  return properties;
};


function database(system, qs, method, object) {
  const [name, format] = object.split('.');

  if (!name) {
    return;
  }

  var sqlStr;
  switch (method) {
  case 'GET':
    sqlStr = 'SELECT * FROM ??';
    break;
  case 'PATCH':
    sqlStr = 'UPDATE ?? SET ?';
    break;
  case 'DELETE':
    sqlStr = 'DELETE FROM ??';
    break;
  }
  
  return {
    path: systems[system],
    name: name,
    format: format,
    sql: (method == 'POST') ? 'INSERT INTO ?? VALUES ?' : sql.get(sqlStr,querystring.parse(qs))
  };
};

function web(system, qs) {

  if (!system) {
    return;
  }
  
  return {
    path: systems[system],
    qs: qs
  };
};