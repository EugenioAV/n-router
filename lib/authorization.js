const tokens = require('../systems')['tokens'];
const crypto = require('crypto');

module.exports = function (token) {
  if (!token) return new Error('Use the token to execute the request');
  let access;
  try {
    for(let key in tokens) {
      if (crypto.timingSafeEqual(Buffer.from(key, 'utf-8'), Buffer.from(token, 'utf-8'))){
        access = tokens[key];
        break;
      }
    }
  } catch (ex) {
    return new Error('The token is not true');
  }
  

  return access || new Error('You do not have access rights to perform the operation');
};