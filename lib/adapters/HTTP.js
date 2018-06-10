const Adapter = require('./Adapter');
const request = require('request');

class WebService extends Adapter {
  constructor (path) {
    super(path);
    this.path = 'http://' + this.path;
  }

  create(properties, callback) {
    callback(null, request.post(this.path + '?' + properties.qs));
  }

  read(properties, callback) {
    callback(null, request.get(this.path + '?' + properties.qs));
  }

  update(properties, callback) {
    callback(null, request.patch(this.path + '?' + properties.qs));
  }

  delete(properties, callback) {
    callback(request.delete(this.path + '?' + properties.qs));
  }
}

module.exports = WebService;