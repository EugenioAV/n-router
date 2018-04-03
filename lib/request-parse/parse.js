const querystring = require('../qs');
const sql = require('../sql');
const systems = require('../../systems');

exports.database = function (system, qs, method, object) {
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

exports.web = function (system, qs) {

  if (!system) {
    return;
  }
  
  return {
    path: systems[system],
    qs: qs
  };
};