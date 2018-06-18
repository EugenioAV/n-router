const Adapter = require('./Adapter');
const mysql = require('mysql');
const connection = require('./connection/MySQL');
const querystring = require('../qs');
const createSql = require('../sql');
const pathParse = require('../parsers/path');

class MySQL extends Adapter {
  constructor(path) {
    super(path);
    const {host, port, user, password, database} = pathParse(this.path);
    this.pool = mysql.createPool({
      connectionLimit : 10,
      host : host,
      port: port,
      user : user,
      password : password,
      database : database
    });
  }

  create(properties, callback) {
    const query = 'INSERT INTO ?? VALUES ?';
    callback(null, new connection['withBody']('insert', this.pool, query, properties.name));
  }

  read(properties, callback) {
    const sql = bindingSQL('SELECT * FROM ??', properties.qs);
    connection['withoutBody'](this.pool, sql.query, [properties.name, sql.value], callback);
  }

  update(properties, callback) {
    const query = 'UPDATE ?? SET ?';
    callback(null, new connection['withBody']('update', this.pool, query, properties.name));
  }

  delete(properties, callback) {
    const sql = bindingSQL('DELETE FROM ??', properties.qs);
    connection['withoutBody'](this.pool, sql.query, [properties.name, sql.value], callback);
  }
}

function bindingSQL(sentense, qs) {
  return createSql.get(sentense, querystring.parse(qs), () => { return '?';});
}

module.exports = MySQL;
