const Adapter = require('./Adapter');

class PostgreSQL extends Adapter {
  constructor(config) {
    super(config);
  }
}

module.exports = PostgreSQL;