const Stream = require('stream');

class JSONStringify extends Stream.Transform {
  constructor() {
    super({ writableObjectMode: true });

    this.appendPrefix = openBracket;
  }

  _transform(row, encoding, callback) {
    this.appendPrefix();
    this.push(JSON.stringify(row));
    callback();
  }

  _flush(callback) {
    if (this.appendPrefix == openBracket)
      this.appendPrefix();
    this.push(']');

    callback();
  }
}

function openBracket() {
  this.push('[');
  this.appendPrefix = comma;
}

function comma() {
  this.push(',');
}

Object.defineProperty(JSONStringify, 'contentType', {
  value: 'application/json',
  enumerable: true
});
module.exports = JSONStringify;
