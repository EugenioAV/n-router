const Adapter = require('./Adapter');
const request = require('request');

class WebService extends Adapter {
  create() {
  	return request.post(this.path + '?' + this.qs);
  }

  read() {
  	return request.get(this.path + '?' + this.qs);
  }

  update() {
    return request.patch(this.path + '?' + this.qs);
  }

  destroy() {
    return request.delete(this.path + '?' + this.qs);
  }
}

module.exports = WebService;