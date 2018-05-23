const http = require('http');
const listener = require('./lib/listener');

const server = http.createServer(listener);

server.listen(process.env.PORT || 3000);