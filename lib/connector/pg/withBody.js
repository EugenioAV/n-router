const Stream = require('stream');
const mysql = require('mysql');

class MySQL extends Stream.Transform {
  constructor(properties) {
    super({ writableObjectMode: true, readableObjectMode: true });
    this.connection = mysql.createConnection(properties.path);
    this.sql = properties.sql;
    this.name = properties.name;
    this.parse = (properties.method == 'POST') ? parsePOST : parsePATCH;
  }

  _transform(data, encoding, callback) { 
    const str = this.parse(data);

    const connect = this.connection.query(this.sql, [this.name, str]).stream({highWaterMark: 5});
    connect.on('data', (data) => {
      this.push(data);
      callback();
    });

    connect.on('error', (err) => this.push(err));    
  }

  _flush(callback) {
    this.connection.end();
    callback();
  }
}

function parsePOST(data) {
  let str = [];
  let k = -1;

  for (let i = 0; i < data.length; i++) {
    str.push([]);
    k++;
    for (var key in data[i]) {
      str[k].push(data[i][key]);
    }
  }

  return str;
}

function parsePATCH(data) {
  return data[0];
}

module.exports = MySQL;