const Stream = require('stream');

class XMLConversion extends Stream.Transform {
  constructor() {
    super({ writableObjectMode: true });

    this.putElement = declaration;  
  }

  _transform(row, encoding, callback) {
    this.putElement(row);

    callback();
  }

  _flush(callback) {
    if (this.putElement == declaration)
      this.putElement();
    this.push('</rows>');

    callback();
  }
}

function declaration(row) {
  this.push('<?xml version="1.0"?>');
  this.push('<rows>');

  if (row) {
    this.putElement = putRow;
    this.putElement(row);
  }
}

function putRow(row) {
  var columnName = Object.keys(row);
  this.push('<row>');
  for (var i = 0; i < Object.keys(row).length; i++) {
    this.push('<' + columnName[i] + '>');
    this.push(JSON.stringify(row[columnName[i]]));
    this.push('</' + columnName[i] + '>');
  }
  this.push('</row>');
}

Object.defineProperty(XMLConversion, 'contentType', {
  value: 'application/xml',
  enumerable: true
});
module.exports = XMLConversion;
