const Adapter = require('./Adapter');
const { Pool } = require('pg');
const WriteStream = require('./WriteStream');
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

  create({ name }, callback) {
    const query = `INSERT ${name}  VALUES %L`;
    callback(null, new WriteStream('insert', this.pool, this._connection, buildingForm, query));
  }

  read({ name , qs }, callback) {
    const query = bindingSQL(`SELECT * FROM ${name}`, qs);
    this._connection(query, callback);
  }

  update({ name , qs }, callback) {
    const query = `UPDATE ${name}`;
    callback(null, new WriteStream('update', this.pool, this._connection, buildingForm, query, querystring.parse(qs)));
  }

  delete({ name , qs }, callback) {
    const query = bindingSQL(`DELETE FROM ${name}`, qs);
    this._connection(query, callback);
  }

  _connection(query, callback) {
    const QueryStream = require('pg-query-stream');
    this.pool.connect((err, client, release) => {
      if (err) {
        return callback(err);
      }
      const stream = client.query(new QueryStream(query.sql, query.value));

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
