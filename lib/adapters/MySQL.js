const Adapter = require('./Adapter');
const mysql = require('mysql');
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

  create(data, properties, callback) {
    const values = bindingValues(data);
    const query = 'INSERT INTO ?? VALUES ?';
    this._connection(query, [properties.name, values], callback);
  }

  read(properties, callback) {
    const sql = bindingSQL('SELECT * FROM ??', properties.qs);
    this._connection(sql.query, [properties.name, sql.value], callback);
  }

  update(data, properties, callback) {
    const sql = bindingSQL('UPDATE ?? SET ?', properties.qs);
    this._connection(sql.query, [properties.name, data[0], sql.value], callback);
  }

  delete(properties, callback) {
    const sql = bindingSQL('DELETE FROM ??', properties.qs);
    this._connection(sql.query, [properties.name, sql.value], callback);
  }

  _connection(query, value, callback) {
    this.pool.getConnection(function (err, conn) {
      if (err) {
        return callback(err);
      }
      const stream = conn.query(query, value).stream();

      stream.on('error', (err) => {
        callback(err);
        conn.release();
      });

      stream.on('end', () => { conn.release();});

      callback(null, stream);
    });
  }
}

function bindingSQL(sentense, qs) {
  return createSql.get(sentense, querystring.parse(qs), () => { return '?';});
}

function bindingValues(data) {
  let values = [];
  for (let i = 0; i < data.length; i++) {
    values.push([]);
    for (let key in data[i]) {
      values[i].push(data[i][key]);
    }
  }

  return values;
}

module.exports = MySQL;