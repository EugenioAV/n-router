const Adapter = require('./Adapter');

class MySQL extends Adapter {
  constructor(config) {
    super(config);
  }
}

module.exports = MySQL;