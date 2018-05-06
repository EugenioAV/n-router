const request = require('request');

class Web {
  constructor(properties) {
    this.path = properties.path + '?' + properties.qs;
  }

  create() {
    return request.get(this.path);
  }

  close() { }
}

module.exports = Web;