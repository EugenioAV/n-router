const pg = require('pg');
const QueryStream = require('pg-query-stream');

class PostgreSQL {
  constructor(properties) {
    this.client = new pg.Client(properties.path);
    this.sql = properties.sql;
  }

  create() {
    this.client.connect();
    const query = new QueryStream(this.sql.str, this.sql.value);
    return this.client.query(query);
  }

  close() {
    this.client.end();
  }
}

module.exports = PostgreSQL;