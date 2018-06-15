const crypto = require('crypto');
const tokens = require('../systems')['tokens'];

module.exports = function(token) {
  const access = tokens[token];
  const key = access ? Buffer.from(token) : Buffer.alloc(32);
  if (crypto.timingSafeEqual(Buffer.from(token), key)) return access;
  else throw new Error('Access denied');
};