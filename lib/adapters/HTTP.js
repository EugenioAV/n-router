const Adapter = require('./Adapter');
const request = require('request');
const transformers = require('../transformes');
const converters = require('../converters');

class WebService extends Adapter {
  constructor (path) {
    super(path);
    this.path = 'http://' + this.path;
  }

  create(properties, callback) {
    const Converter = converters[properties.convert_type];
    const Transformer = transformers[properties.accept_type];
    if (!Converter) return callback(`Unknown this format ${properties.convert_type} to convert`);    
    if (!Transformer) return callback(`Unknown this format ${properties.accept_type} to transform`);

    const stream = (new Transformer()).pipe(request.get(this._getPath(properties.qs))).pipe(new Converter());
    callback(null, stream);
  }

  read(properties, callback) {
    const Converter = converters[properties.convert_type];
    if (!Converter) return callback(`Unknown this format ${properties.convert_type} to convert`);

    const stream = request.get(this._getPath(properties.qs)).pipe(new Converter());
    callback(null, stream);
  }

  update(properties, callback) {
    const Converter = converters[properties.convert_type];
    const Transformer = transformers[properties.accept_type];
    if (!Converter) return callback(`Unknown this format ${properties.convert_type} to convert`);    
    if (!Transformer) return callback(`Unknown this format ${properties.accept_type} to transform`);

    const stream = (new Transformer()).pipe(request.patch(this._getPath(properties.qs))).pipe(new Converter());
    callback(null, stream);
  }

  delete(properties, callback) {
    const Converter = converters[properties.convert_type];
    if (!Converter) return callback(`Unknown this format ${properties.convert_type} to convert`);

    const stream = request.delete(this._getPath(properties.qs)).pipe(new Converter());
    callback(null, stream);
  }

  _getPath(qs) {
    return qs ? this.path + '?' + qs : this.path;
  }
}

module.exports = WebService;