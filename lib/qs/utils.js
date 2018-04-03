'use strict';

var has = Object.prototype.hasOwnProperty;

var compactQueue = function compactQueue(queue) {
  var obj;

  while (queue.length) {
    var item = queue.pop();
    obj = item.obj[item.prop];

    if (Array.isArray(obj)) {
      var compacted = [];

      for (var j = 0; j < obj.length; ++j) {
        compacted.push(obj[j]);
      }

      item.obj[item.prop] = compacted;
    }
  }

  return obj;
};

exports.merge = function merge(target, source, options) {
  var mergeTarget = target;

  return Object.keys(source).reduce(function (acc, key) {
    var value = source[key];

    if (has.call(acc, key)) {
      acc[key] = exports.merge(acc[key], value, options);
    } else {
      acc[key] = value;
    }
    return acc;
  }, mergeTarget);
};

exports.decode = function (str) {
  return decodeURIComponent(str.replace(/\+/g, ' '));
};


exports.compact = function compact(value) {
  var queue = [{ obj: { o: value }, prop: 'o' }];
  var refs = [];

  for (var i = 0; i < queue.length; ++i) {
    var item = queue[i];
    var obj = item.obj[item.prop];

    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; ++j) {
      var key = keys[j];
      var val = obj[key];
      if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
        queue.push({ obj: obj, prop: key });
        refs.push(val);
      }
    }
  }

  return compactQueue(queue);
};