const Adapter = require('./Adapter');
const mysql = require('mysql');
const DatabaseAdapter = require('./DatabaseAdapter');
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
    const query = `INSERT ${properties.name}  VALUES %L`;
    callback(null, new DatabaseAdapter('mysql', 'insert', this.pool, this._connection, buildingForm, query));
  }

  read(properties, callback) {
    const sql = bindingSQL('SELECT * FROM ??', properties.qs);
    const query = { sql: sql.sql, value: [properties.name, sql.value] };
    this._connection(query, callback);
  }

  update(properties, callback) {
    const query = `UPDATE ${properties.name}`;
    const sentense = bindingSQL('', properties.qs);
    callback(null, new DatabaseAdapter('mysql', 'update', this.pool, this._connection, buildingForm, query, sentense));
  }

  delete(properties, callback) {
    const sql = bindingSQL('DELETE FROM ??', properties.qs);
    const query = { sql: sql.sql, value: [properties.name, sql.value] };
    this._connection(query, callback);
  }

  _connection(query, callback) {    
    this.pool.getConnection(function (err, conn) {
      if (err) {
        return callback(err);
      }
      const stream = conn.query(query.sql, query.value).stream();

      stream.on('error', () => conn.release());
      stream.on('end', () => conn.release());

      callback(null, stream, conn);
    });
  }
}

function bindingSQL(sentense, qs) {
  return createSql.get(sentense, querystring.parse(qs), buildingForm);
}

function buildingForm() {
  return '?';
}

module.exports = MySQL;
