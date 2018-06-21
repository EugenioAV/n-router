const Stream = require('stream');
const format = require('pg-format');
const createSql = require('../sql');

class WriteStream extends Stream.Transform {
  constructor(method, pool, connection, building, sql, qs) {
    super({ readableObjectMode: true, writableObjectMode: true });
    this.pool = pool;
    this.connection = connection;
    this.buildingForm = building;
    this.sql = sql;
    this.qs = qs;
    this.values = [];
    this.parse = method.localeCompare('insert') == 0 ? insert : update;
    this.buildingSQL = method.localeCompare('insert') == 0 ? buildingSQLInsert : buildingSOLUpdate;
  }

  _transform(data, encoding, callback) {
    this.parse(data, this.values);
    callback();
  }

  _flush(callback) {
    const sql = this.buildingSQL();
    let that = this;
    this.connection(sql, (err, stream) => {
      if (err) {
        this.push(err);
        callback();
      }

      stream.on('data', (data) => that.push(data));
      stream.on('error', (err) =>  that.push(err));
      stream.on('end', () => callback());
    });
  }
}

function buildingSQLInsert() {
  return { sql: format(this.sql, this.values)};
}

function buildingSOLUpdate() {
  return {
    sql: this.sql + this.values.sql,
    value: this.values.data
  };
}

function insert(data) {
  let n = this.values.length;
  this.values.push([]);
  for (let key in data) {
    this.values[n].push(data[key]);
  }
}

function update(data) {
  let str = ' SET';
  
  let value = [];
  for (var key in data) {
    str = str + ` ${key} = ${this.buildingForm(value.length + 1)} `;
    value.push(data[key]);
  }

  const sentense = createSql.get('', this.qs, this.buildingForm, value.length);
  
  this.values = {
    sql: str + sentense.sql,
    data: value.concat(sentense.value)
  };
}

module.exports = WriteStream;