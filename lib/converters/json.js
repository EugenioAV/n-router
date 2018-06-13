const Stream = require('stream');

class JSONConverter extends Stream.Transform {
  constructor() {
    super({ writableObjectMode: true, readableObjectMode: true });
    this.next = '';
    this.data = [];
  }

  _transform(body, encoding, callback) { 
    let data = this.next.concat(body.toString());
    let obj = JSON.parse('[' + data.substring(data.indexOf('{'), data.lastIndexOf('}')+1) + ']');
    this.next = data.substring(data.lastIndexOf('}')+1);

    this.data = this.data.concat(obj);
    callback();
  }

  _flush(callback) {
    this.push(this.data);
    callback();
  }
}

Object.defineProperty(JSONConverter, 'contentType', {
  value: 'text/plain',
  enumerable: true
});
module.exports = JSONConverter;
