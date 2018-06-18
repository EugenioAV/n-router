const Adapter = require('./Adapter');
const { Pool } = require('pg');
const connection = require('./connection/PostgreSQL');
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
    //const sql = format(`INSERT INTO ${properties.name} VALUES %L`, bindingValues(data));
    callback(null, new connection['withBody']('insert', this.pool, `INSERT INTO ${properties.name} VALUES %L`));
  }

  read(properties, callback) {
    const sql = bindingSQL(`SELECT * FROM ${properties.name}`, properties.qs);
    const query = new QueryStream(sql.query, sql.value);
    connection['withoutBody'](this.pool, query, callback);
  }

  update(properties, callback) {
    const sentense = bindingSQL('', properties.qs);
    callback(null, new connection['withBody']('update', this.pool, `UPDATE ${properties.name}`, sentense));
  }

  delete(properties, callback) {
    const sql = bindingSQL(`DELETE FROM ${properties.name}`, properties.qs);
    const query = new QueryStream(sql.query, sql.value);
    connection['withoutBody'](this.pool, query, callback);
  }
}

function bindingSQL(sentense, qs) {
  return createSql.get(sentense, querystring.parse(qs), (n) => { return '$'+ n; });
}

module.exports = PostgreSQL;
