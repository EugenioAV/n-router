const querystring = require('../qs');
const sql = require('../sql');
const systems = require('../../systems');

module.exports = function (req) {
  const [path, qs] = req.url.split('?');
  const [type, system, object = ''] = path.slice(1).split('/');

  if (!type || !system) {
    return;
  }
  
  var properties = (type == 'mysql' || type == 'pg') ? database(system, qs, req.method, object, type) : (type == 'web') ? web(system, qs) : undefined;
  if (!properties) return;

  properties.convertType = (req.headers['content-type'] == 'application/xml') ? 'xml' : (req.headers['content-type'] == 'application/json') ? 'json' : undefined;
  properties.method = req.method;
  properties.type = type;

  return properties;
};


function database(system, qs, http_method, object, type) {
  const [db_methodWithName, format] = object.split('.');
  const [db_method, name] = db_methodWithName.split(':');
  
  if (!systems[system]) {
    return;
  }

  var sqlStr;
  if (db_method == 'procedure') {
    sqlStr = 'CALL ' + name;
  } else {
    switch (http_method) {
    case 'GET':
      sqlStr = sql.get('SELECT * FROM ' + name + ' ', querystring.parse(qs), type);
      break;
    case 'PATCH':
      sqlStr = sql.get('UPDATE ' + name + ' SET ? ', querystring.parse(qs), type);
      break;
    case 'DELETE':
      sqlStr = sql.get('DELETE FROM ' + name + ' ', querystring.parse(qs), type);
      break;
    case 'POST':
      sqlStr = 'INSERT INTO ' + name + ' VALUES ?';
      break;
    }
  }

  return {
    name : name,
    format: format,
    path: systems[system],
    sql: sqlStr
  };
}

function web(object, qs) {
  const [system, format] = object.split('.');

  if (!system) {
    return;
  }
  
  return {
    path: systems[system],
    format: format,
    qs: qs
  };
}