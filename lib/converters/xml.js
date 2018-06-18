'use strict';
const Stream = require('stream');
const expat = require('node-expat');
const parser = new expat.Parser('UTF-8');

let path = [];
let object = [];
let current = [];
let flag = true;
let last = '';

class XMLConverter extends Stream.Transform {
  constructor() {
    super({ writableObjectMode: true , readableObjectMode: true});
    path = [];
    current = {};
    last = '';
  }

  _transform(body, encoding, callback) {
    flag = true;
    object = [];

    parser.write(body.toString().replace(/\s/g,''));
    this.push(object);
    callback();
  }

  _flush(callback) {
    parser.reset();
    callback();
  }
}

parser.on('startElement', function (name) {
  flag = false;
  path.push(name);
});

parser.on('endElement', function () {
  flag = false;
  path.pop();
  if (path.length == 1) {
    object.push(current);
    current = {};
  }
});

parser.on('text', function (text) {
  if (flag) {
    text = last + text;
  }
  current[path[path.length-1]] = getValue(text);
  last = text;
});

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getValue(value) {
  const signification = (isNumeric(value)) ? Number.parseInt(value) : value;
  return signification;
} 

Object.defineProperty(XMLConverter, 'contentType', {
  value: 'text/plain',
  enumerable: true
});
module.exports = XMLConverter;
