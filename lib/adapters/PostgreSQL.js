const Adapter = require('./Adapter');
const { Pool } = require('pg');
const DatabaseAdapter = require('./DatabaseAdapter');
const QueryStream = require('pg-query-stream');
const querystring = require('../qs');
const createSql = require('../sql');
const pathParse = require('../parsers/path');

class PostgreSQL extends Adapter {
  constructor(path) {
    super(path);
    const {host, port, user, password, database} = pathParse(this.path);
    this.pool = new Pool({
      max: 10,
      host : host,
      port: port,
      user : user,
      password : password,
      database : database
    });
  }

  create(properties, callback) {
    const query = `INSERT ${properties.name}  VALUES %L`;
    callback(null, new DatabaseAdapter('pg', 'insert', this.pool, this._connection, buildingForm, query));
  }

  read(properties, callback) {
    const sql = bindingSQL(`SELECT * FROM ${properties.name}`, properties.qs);
    const query = new QueryStream(sql.sql, sql.value);
    this._connection(query, callback);
  }

  update(properties, callback) {
    const sentense = bindingSQL('', properties.qs);
    const query = `UPDATE ${properties.name}`;
    callback(null, new DatabaseAdapter('pg', 'update', this.pool, this._connection, buildingForm, query, sentense));
  }

  delete(properties, callback) {
    const sql = bindingSQL(`DELETE FROM ${properties.name}`, properties.qs);
    const query = new QueryStream(sql.sql, sql.value);
    this._connection(query, callback);
  }

  _connection(query, callback) {
    this.pool.connect((err, client, release) => {
      if (err) {
        return callback(err);
      }
      const stream = client.query(query);

      stream.on('error', () => release());
      stream.on('end', () => release());

      callback(null, stream);
    });
  }
}

function bindingSQL(sentense, qs) {
  return createSql.get(sentense, querystring.parse(qs), buildingForm);
}

function buildingForm(n) {
  return '$'+ n;
}



module.exports = PostgreSQL;
