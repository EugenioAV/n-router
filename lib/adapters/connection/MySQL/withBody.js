const Stream = require('stream');

class ConnectionMySQl extends Stream.Transform {
  constructor(method, pool, query, name) {
    super({ readableObjectMode: true, writableObjectMode: true });
    this.parse = (method == 'insert') ? insert : update;
    this.pool = pool; 
    this.query = query;
    this.name = name;
    this.values = [];
  }

  _transform(data, encoding, callback) {
    this.parse(data);
    callback();
  }

  _flush(callback) {
    let that = this;
    this.pool.getConnection(function (err, conn) {
      if (err) {
        that.push(err);
        callback();
      }
      const stream = conn.query(that.query, [that.name, that.values]).stream();

      stream.on('data', (data) => that.push(data));
      stream.on('error', (err) => { 
        that.push(err);
      });
      stream.on('end', () => {
        conn.release();
        callback();
      });
    });    
  }
}

function insert(data) {
  let n = this.values.length;
  for (let i = 0; i < data.length; i++) {
    this.values.push([]);
    for (let key in data[i]) {
      this.values[i + n].push(data[i][key]);
    }
  }
}

function update(data) {
  this.values = data[0];
}

module.exports = ConnectionMySQl;
