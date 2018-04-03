'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;

var defaults = {
  allowDots: false,
  allowPrototypes: false,
  arrayLimit: 20,
  decoder: utils.decode,
  delimiter: '&',
  depth: 5,
  parameterLimit: 1000,
  plainObjects: false,
  strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
  var obj = {};
  var cleanStr = str;
  var limit = options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);

  for (var i = 0; i < parts.length; ++i) {
    var part = parts[i];

    var bracketEqualsPos = part.indexOf(']=');
    var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

    var key, val;
    key = options.decoder(part.slice(0, pos), defaults.decoder);
    val = options.decoder(part.slice(pos + 1), defaults.decoder);
    if (has.call(obj, key)) {
      obj[key] = [].concat(obj[key]).concat(val);
    } else {
      obj[key] = val;
    }
  }

  return obj;
};

var parseObject = function (chain, val) {
  var leaf = val;

  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];
    if (root === '[]') {
      obj = [];
      obj = obj.concat(leaf);
    } else {
      obj = {};

      var check = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' && chain.length==1 ? null : 0;
      var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;

      if (check === null ) {
        obj[check] = {};
        obj[check][cleanRoot] = leaf;
        check=0;
      } else {
        obj[cleanRoot] = leaf;
      }
    }
    leaf = obj;
  }

  return leaf;
};


var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
  // Transform dot notation to bracket notation
  var key = givenKey;

  // The regex chunks

  var brackets = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g;

  // Get the parent

  var segment = brackets.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key;

  // Stash the parent if it exists

  var keys = [];
  if (parent) {
    keys.push(parent);
  }

  // Loop through children appending to the array until we hit depth

  var i = 0;
  while ((segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;
    keys.push(segment[1]);
  }

  // If there's a remainder, just add whatever is left

  return parseObject(keys, val, options);
};

module.exports = function (str) {
  var options =  {};

  options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
  options.delimiter = defaults.delimiter;
  options.depth = defaults.depth;
  options.arrayLimit = defaults.arrayLimit;
  options.parseArrays = options.parseArrays !== false;
  options.decoder =  defaults.decoder;
  options.allowDots = defaults.allowDots;
  options.plainObjects =  defaults.plainObjects;
  options.allowPrototypes = defaults.allowPrototypes;
  options.parameterLimit =  defaults.parameterLimit;
  options.strictNullHandling = defaults.strictNullHandling;

  if (str === '' || str === null || typeof str === 'undefined') {
    return  {};
  }

  var tempObj = parseValues(str, options) ;
  var obj =  {};

  // Iterate over the keys and setup the new object

  var keys = Object.keys(tempObj);
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options);
    obj = utils.merge(obj, newObj, options);
  }

  return utils.compact(obj);
};
