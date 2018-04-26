const mysql = require('mysql');

class MySQL {
  constructor(properties) {
    this.connection = mysql.createConnection(properties.path);
    this.sql = properties.sql;
    this.name = properties.name;
  }

  create() {
    return this.connection.query(this.sql, [this.name]).stream({highWaterMark: 5});
  }

  close() {
    this.connection.end();
  }
}

module.exports = MySQL;
