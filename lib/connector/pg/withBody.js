const Stream = require('stream');
const pgp = require('pg-promise')({ capSQL: true });

class PostgreSQL extends Stream.Transform {
  constructor(properties) {
    super({ writableObjectMode: true, readableObjectMode: true });
    this.name = properties.name;
    this.db = pgp(properties.path);
    this.query = (properties.method == 'POST') ? insert : update;
    this.sql = properties.sql;
    this.method = properties.method;
  }

  _transform(data, encoding, callback) {
    this.query(data, callback);
  }

  _flush(callback) {
    pgp.end();    
    callback();
  }
}

function makeUpdateQuery(data, sql) {
  let str = '';
  let i = sql.value.length;
  for(var k in data) {
    str += k + ' = $' + ++i + ', ';
    sql.value.push(data[k]);
  } 
  str = str.substring(0, str.lastIndexOf(','));
  sql.str = sql.str.replace('?', str);

  return sql;
}

function update(data, callback) {
  this.sql = makeUpdateQuery(data[0], this.sql);
  this.db.result(this.sql.str, this.sql.value, r => r.rowCount)
  .then(data => {
    this.push({ update : data});
    callback();
  })
  .catch(error => this.push(error));
}

function setColumn(data, name) {
  let keys = [];
  for(var k in data) keys.push(k);
  return new pgp.helpers.ColumnSet(keys, {table: name});
}

function insert(data, callback) {
  const query = pgp.helpers.insert(data, setColumn(data[0], this.name));
  this.db.result(query, r => r.rowCount)
  .then(data => {
    this.push(data);
    callback();
  })
  .catch(error => this.push(error));
}

module.exports = PostgreSQL;