const expect = require('chai').expect;
const sql = require('../lib/sql');

describe('Create query for MySQL database', function() {
  let sqlStr = '';
  let str = 'SELECT * FROM ?? ';
  let obj = {};
  let value = [];

  context('when object has deep key', function() {
    it('eq', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a = ?';
      obj = { a : { eq:  1 }};
      value = [1];
    });

    it('ne', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a != ?';
      obj = { a : { ne:  1 }};
      value = [1];
    });

    it('gt', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a > ?';
      obj = { a : { gt:  1 }};
      value = [1];
    });

    it('lt', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a < ?';
      obj = { a : { lt:  1 }};
      value = [1];
    });

    it('gte', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a >= ?';
      obj = { a : { gte:  1 }};
      value = [1];
    });

    it('lte', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a <= ?';
      obj = { a : { lte:  1 }};
      value = [1];
    });

    it('limit', function() {
      sqlStr = 'SELECT * FROM ??  LIMIT 1';
      obj = { null : { limit:  1 }};
      value = [];
    });

    it('offset', function() {
      sqlStr = 'SELECT * FROM ??  OFFSET 1';
      obj = { null : { offset:  1 }};
      value = [];
    });

    afterEach(function(done) {
      const query = sql.get(str,obj, 'mysql', 'table');
      expect(query.str).to.equal(sqlStr);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });

  context('when object', function() {
    it('is empty', function() {
      sqlStr = 'SELECT * FROM ?? ';
      obj = {};
      value = [];
    });

    it('without deep keys', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a = ? && b = ?';
      obj = { a : 1 , b : 2 };
      value = [1, 2]; 
    });

    it('has different keys', function() {
      sqlStr = 'SELECT * FROM ?? WHERE x = ? && y != ? && b > ? && b <= ? LIMIT 5 OFFSET 6';
      obj = { 
        x : 1,
        y : { ne : 2 },
        b : { gt : 3, lte : 4 },
        c: { a: 1},
        null : { limit: 5, offset:  6 }};
      value = [1, 2, 3, 4];
    });

    afterEach(function(done) {
      const query = sql.get(str,obj, 'mysql', 'table');
      expect(query.str).to.equal(sqlStr);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });

  context('when query has procedure stored', function() {
    it('without arguments', function() {
      sqlStr = 'CALL test()';
      obj = {};
      value = [];
    });

    it('with arguments', function() {
      sqlStr = 'CALL test(?, ?)';
      obj = { a : 1 , b : 2 };
      value = [1, 2]; 
    });

    afterEach(function(done) {
      const query = sql.get('CALL test()',obj, 'mysql', 'procedure');
      expect(query.str).to.equal(sqlStr);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });

  context('when query has function stored', function() {
    it('without arguments', function() {
      sqlStr = 'SELECT test()';
      obj = {};
      value = [];
    });

    it('with arguments', function() {
      sqlStr = 'SELECT test(?, ?)';
      obj = { a : 1 , b : 2 };
      value = [1, 2]; 
    });

    afterEach(function(done) {
      const query = sql.get('SELECT test()',obj, 'mysql', 'function');
      expect(query.str).to.equal(sqlStr);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });
});

describe('Create query for PostgreSQL database', function() {
  let sqlStr = '';
  let str = 'SELECT * FROM ?? ';
  let obj = {};
  let value = [];

  context('when object has deep key', function() {
    it('eq', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a = $1';
      obj = { a : { eq:  1 }};
      value = [1];
    });

    it('ne', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a != $1';
      obj = { a : { ne:  1 }};
      value = [1];
    });

    it('gt', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a > $1';
      obj = { a : { gt:  1 }};
      value = [1];
    });

    it('lt', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a < $1';
      obj = { a : { lt:  1 }};
      value = [1];
    });

    it('gte', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a >= $1';
      obj = { a : { gte:  1 }};
      value = [1];
    });

    it('lte', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a <= $1';
      obj = { a : { lte:  1 }};
      value = [1];
    });

    it('limit', function() {
      sqlStr = 'SELECT * FROM ??  LIMIT 1';
      obj = { null : { limit:  1 }};
      value = [];
    });

    it('offset', function() {
      sqlStr = 'SELECT * FROM ??  OFFSET 1';
      obj = { null : { offset:  1 }};
      value = [];
    });

    afterEach(function(done) {
      const query = sql.get(str,obj, 'pg', 'table');
      expect(query.str).to.equal(sqlStr);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });

  context('when object', function() {
    it('is empty', function() {
      sqlStr = 'SELECT * FROM ?? ';
      obj = {};
      value = [];
    });

    it('without deep keys', function() {
      sqlStr = 'SELECT * FROM ?? WHERE a = $1 && b = $2';
      obj = { a : 1 , b : 2 };
      value = [1, 2]; 
    });

    it('has different keys', function() {
      sqlStr = 'SELECT * FROM ?? WHERE x = $1 && y != $2 && b > $3 && b <= $4 LIMIT 5 OFFSET 6';
      obj = { 
        x : 'temp',
        y : { ne : 2 },
        b : { gt : 3, lte : 4 },
        c: { a: 1},
        null : { limit: 5, offset:  6 }};
      value = ['temp', 2, 3, 4];
    });

    afterEach(function(done) {
      const query = sql.get(str,obj, 'pg', 'table');
      expect(query.str).to.equal(sqlStr);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });

  context('when query has procedure or function stored', function() {
    it('without arguments', function() {
      sqlStr = 'SELECT test()';
      obj = {};
      value = [];
    });

    it('with arguments', function() {
      sqlStr = 'SELECT test($1, $2)';
      obj = { a : 1 , b : 2 };
      value = [1, 2]; 
    });

    afterEach(function(done) {
      const query = sql.get('SELECT test()', obj, 'pg', 'procedure');
      expect(query.str).to.equal(sqlStr);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });
});
