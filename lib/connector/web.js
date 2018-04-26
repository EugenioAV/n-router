const request = require('request');

class Web {
  constructor(properties, data) {
    this.path = properties.path + '?' + properties.qs;
    this.data = data;
    this.connection = post;
    if (properties.method == 'GET') this.connection = get;
  }

  create() {
    return this.connection(this.path, this.data);
  }
}

function get(path) {
  return request.get(path);
}

function post(path, data) {
  return request.post(path, data);
}

module.exports = Web;