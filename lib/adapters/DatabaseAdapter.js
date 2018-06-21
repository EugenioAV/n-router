const Stream = require('stream');
const format = require('pg-format');
const QueryStream = require('pg-query-stream');

class DatabaseAdapter extends Stream.Transform {
  constructor(db, method, pool, connection, building, sql, sentense) {
    super({ readableObjectMode: true, writableObjectMode: true });
    this.db = db;
    this.pool = pool;
    this.connection = connection;
    this.buildingForm = building;
    this.sql = sql;
    this.sentense = sentense;
    this.values = sentense ? sentense.value : [];
    this.parse = method.localeCompare('insert') == 0 ? insert : update;
    this.buildingSQL = method.localeCompare('insert') == 0 ? buildingSQLInsert : buildingSOLUpdate;
  }

  _transform(data, encoding, callback) {
    this.parse(data, this.values);
    callback();
  }

  _flush(callback) {
    const sql = this.buildingSQL();
    const query = (this.db.localeCompare('mysql') == 0) ? sql : new QueryStream(sql.sql, sql.value);

    let that = this;
    this.connection(query, (err, stream) => {
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
  let value = ( this.db.localeCompare('mysql') == 0) ? [] : this.sentense.value;
  for (var key in data) {
    str = str + ` ${key} = ${this.buildingForm(value.length + 1)} `;
    value.push(data[key]);
  }
  this.values = {
    sql: str + this.sentense.sql,
    data: (this.db.localeCompare('mysql') == 0) ? value.concat(this.sentense.value) : value
  };
}

module.exports = DatabaseAdapter;