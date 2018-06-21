const Adapter = require('./Adapter');
const mysql = require('mysql');
const WriteStream = require('./WriteStream');
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

  create({ name }, callback) {
    const query = `INSERT ${name}  VALUES %L`;
    callback(null, new WriteStream('insert', this.pool, this._connection, buildingForm, query));
  }

  read({ name , qs }, callback) {
    const sql = bindingSQL('SELECT * FROM ??', qs);
    const query = { sql: sql.sql, value: [name, sql.value] };
    this._connection(query, callback);
  }

  update({ name , qs }, callback) {
    const query = `UPDATE ${name}`;
    callback(null, new WriteStream('update', this.pool, this._connection, buildingForm, query, querystring.parse(qs)));
  }
 
  delete({ name , qs }, callback) {
    const sql = bindingSQL('DELETE FROM ??', qs);
    const query = { sql: sql.sql, value: [name, sql.value] };
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
