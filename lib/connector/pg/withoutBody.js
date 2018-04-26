const pg = require('pg');
const { Readable } = require('stream');

class PostgreSQL extends Readable {
  constructor(properties) {
    super();
    this.client = new pg.Client(properties.path);
  }

  _read() {
    this.client.connect();
    this.client.query('SELECT * FROM test', (err, results) => {
      this.push(results.rows);
    });
  }
}

module.exports = PostgreSQL;