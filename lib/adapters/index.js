const postgresql = require('./PostgreSQL');
const mysql = require('./MySQL');
const http = require('./HTTP');

exports.mysql = mysql;
exports.postgresql = postgresql;
exports.http = http;