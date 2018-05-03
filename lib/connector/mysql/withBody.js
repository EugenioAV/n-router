const Stream = require('stream');
const mysql = require('mysql');

class MySQL extends Stream.Transform {
  constructor(properties) {
    super({ writableObjectMode: true, readableObjectMode: true });
    this.connection = mysql.createConnection(properties.path);
    this.sql = properties.sql;
    this.parse = (properties.method == 'POST') ? parsePOST : parsePATCH;
    this.number = 0;
  }

  _transform(data, encoding, callback) { 
    const str = this.parse(data);
    this.number += data.length;

    const connect = this.connection.query(this.sql.str, [str]).stream({highWaterMark: 5});
    connect.on('error', (err) => this.push(err));
    callback();
  }

  _flush(callback) {
    this.connection.end();

    if (this.properties.method == 'PATCH') this.number = 1;
    this.push({ number : this.number});

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