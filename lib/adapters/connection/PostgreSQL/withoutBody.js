module.exports = function(pool, query, callback) {
  pool.connect((err, client, release) => {
    if (err) {
      return callback(err);
    }      
    const stream = client.query(query);

    stream.on('error', () => release());
    stream.on('end', () => release());

    callback(null, stream);
  });
};
