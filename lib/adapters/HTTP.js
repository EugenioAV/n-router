const Adapter = require('./Adapter');
const request = require('request');

class WebService extends Adapter {
  constructor (path) {
    super(path);
    this.path = 'http://' + this.path;
  }

  create(properties, callback) {
    callback(null, request.post(this._getPath(properties.qs)));
  }

  read(properties, callback) {
    callback(null, request.get(this._getPath(properties.qs)));
  }

  update(properties, callback) {
    callback(null, request.patch(this._getPath(properties.qs)));
  }

  delete(properties, callback) {
    callback(null, request.delete(this._getPath(properties.qs)));
  }

  _getPath(qs) {
    return qs ? this.path + '?' + qs : this.path;
  }
}

module.exports = WebService;