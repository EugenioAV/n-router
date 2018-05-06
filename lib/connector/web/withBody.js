const request = require('request');

class Web {
  constructor(properties) {
    this.path = properties.path + '?' + properties.qs;
  }

  create() {
    return request.post(this.path);
  }
}

module.exports = Web;