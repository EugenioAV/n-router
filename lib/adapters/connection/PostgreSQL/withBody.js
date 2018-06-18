const Stream = require('stream');
const format = require('pg-format');
const QueryStream = require('pg-query-stream');

class ConnectionPG extends Stream.Transform {
  constructor(method, pool, sql, sentense) {
    super({ readableObjectMode: true, writableObjectMode: true });
    this.parse = (method == 'insert') ? insert : update;
    this.method = method;
    this.pool = pool; 
    this.sql = sql;
    this.sentense = sentense;
    this.values = sentense ? sentense.value : [];
  }

  _transform(data, encoding, callback) {

    this.parse(data);
    callback();
  }

  _flush(callback) {
    const query = (this.method == 'insert') ? 
      new QueryStream(format(this.sql, this.values)) : new QueryStream(this.sql + this.values.query, this.values.data);
    let that = this;
    this.pool.connect((err, client, release) => {
      if (err) {
        return callback(err);
      }      
      const stream = client.query(query);
      stream.on('data', (data) => that.push(data));
      stream.on('error', (err) => {
        that.push(err);
      });
      stream.on('end', () => {
        release();
        callback();
      });
    });
  }
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
  let value = this.sentense.value;
  for (var key in data) {
    str = str + ` ${key} = $${value.length + 1} `;
    value.push(data[key]);
  }

  this.values = {
    query: str + this.sentense.query,
    data: value
  };
}

module.exports = ConnectionPG;
