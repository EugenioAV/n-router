module.exports = function (pool, query, value, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    const stream = conn.query(query, value).stream();

    stream.on('error', () => conn.release());
    stream.on('end', () => conn.release());

    callback(null, stream, conn);
  });
};
