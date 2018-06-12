module.exports = function (path) {
  const [object, db] = path.split('/');
  const [secret, address] = object.split('@');
  const [host, port] = address.split(':') || [address, undefined];
  const [user, password] = secret.split(':');

  return {
    host: host,
    port: port,
    user: user,
    password: password,
    database: db
  };
};