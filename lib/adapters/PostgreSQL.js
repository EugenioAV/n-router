const Adapter = require('./Adapter');
const { Pool } = require('pg');
const QueryStream = require('pg-query-stream');
const format = require('pg-format');
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

  create(data, properties, callback) {
    const sql = format(`INSERT INTO ${properties.name} VALUES %L`, bindingValues(data));
    const query = new QueryStream(sql);
    this._connection(query, callback);
  }

  read(properties, callback) {
    const sql = bindingSQL(`SELECT * FROM ${properties.name}`, properties.qs);
    const query = new QueryStream(sql.query, sql.value);
    this._connection(query, callback);
  }

  update(data, properties, callback) {
    const set = bindingSet(data[0]);
    const sql = bindingSQL(`UPDATE ${properties.name} ${set.str}`, properties.qs, set.value);
    const query = new QueryStream(sql.query, sql.value);
    this._connection(query, callback);
  }

  delete(properties, callback) {
    const sql = bindingSQL(`DELETE FROM ${properties.name}`, properties.qs);
    const query = new QueryStream(sql.query, sql.value);
    this._connection(query, callback);
  }

  _connection(query, callback) {
    this.pool.connect((err, client, release) => {
      if (err) {
        return callback(err);
      }      
      const stream = client.query(query);

      stream.on('error', (err) => {
        callback(err);
        release();
      });

      stream.on('end', () => release());

      callback(null, stream);
    });
  }
}

function bindingSQL(sentense, qs, value) {
  const i = value ? value.length : 0;
  const sql = createSql.get(sentense, querystring.parse(qs), (n) => {
    return '$'+ (n+i);
  });

  return {
    query: sql.query,
    value: value ? value.concat(sql.value) : sql.value
  };
}

function bindingSet(data) {
  let str = ' SET';
  let value = [];
  let i = 1;
  for (var key in data) {
    str = str + ` ${key} = $${i} `;
    value.push(data[key]);
    i++;
  }

  return {
    str: str,
    value: value
  };
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

module.exports = PostgreSQL;