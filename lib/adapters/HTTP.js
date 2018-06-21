const Adapter = require('./Adapter');
const request = require('request');
const transformers = require('../transformes');
const converters = require('../converters');

class WebService extends Adapter {
  constructor (path, convert_type, accept_type) {
    super(path);
    this.path = 'http://' + this.path;
    this.convert_type = convert_type;
    this.accept_type = accept_type;
    this.Converter = converters[convert_type];
    this.Transformer = transformers[accept_type];
  }

  create(qs, callback) {    
    if (!this.Converter) return callback(`Unknown this format ${this.convert_type} to convert`);    
    if (!this.Transformer) return callback(`Unknown this format ${this.accept_type} to transform`);

    const stream = (new this.Transformer()).pipe(request.get(this._getPath(qs))).pipe(new this.Converter());
    callback(null, stream);
  }

  read(qs, callback) {
    if (!this.Converter) return callback(`Unknown this format ${this.convert_type} to convert`);

    const stream = request.get(this._getPath(qs)).pipe(new this.Converter());
    callback(null, stream);
  }

  update(qs, callback) {
    if (!this.Converter) return callback(`Unknown this format ${this.convert_type} to convert`);    
    if (!this.Transformer) return callback(`Unknown this format ${this.accept_type} to transform`);

    const stream = (new this.Transformer()).pipe(request.patch(this._getPath(qs))).pipe(new this.Converter());
    callback(null, stream);
  }

  delete(qs, callback) {
    if (!this.Converter) return callback(`Unknown this format ${this.convert_type} to convert`);

    const stream = request.delete(this._getPath(qs)).pipe(new this.Converter());
    callback(null, stream);
  }

  _getPath(qs) {
    return qs ? this.path + '?' + qs : this.path;
  }
}

module.exports = WebService;