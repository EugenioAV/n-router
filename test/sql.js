var expect = require('chai').expect;
const sql = require('../lib/sql');

describe('Create sql', function() {
  var select = '';
  var str = 'SELECT * FROM ??';
  var obj = {};

  context('when object has deep key', function() {
    it('eq', function() {
      select = 'SELECT * FROM ?? WHERE a=1';
      obj = { a : { eq:  1 }};
    });

    it('ne', function() {
      select = 'SELECT * FROM ?? WHERE a!=1';
      obj = { a : { ne:  1 }};
    });

    it('gt', function() {
      select = 'SELECT * FROM ?? WHERE a>1';
      obj = { a : { gt:  1 }};
    });

    it('lt', function() {
      select = 'SELECT * FROM ?? WHERE a<1';
      obj = { a : { lt:  1 }};
    });

    it('gte', function() {
      select = 'SELECT * FROM ?? WHERE a>=1';
      obj = { a : { gte:  1 }};
    });

    it('lte', function() {
      select = 'SELECT * FROM ?? WHERE a<=1';
      obj = { a : { lte:  1 }};
    });

    it('limit', function() {
      select = 'SELECT * FROM ?? LIMIT 1';
      obj = { null : { limit:  1 }};
    });

    it('offset', function() {
      select = 'SELECT * FROM ?? OFFSET 1';
      obj = { null : { offset:  1 }};
    });

    afterEach(function(done) {
      expect(sql.get(str,obj)).to.equal(select);
      done();
    });
  });

  context('when object', function() {
    it('is empty', function() {
      select = 'SELECT * FROM ??';
      obj = {};
    });

    it('without deep keys', function() {
      select = 'SELECT * FROM ?? WHERE a=1 && b=2';
      obj = { a : 1 , b : 2 };      
    });

    it('has different keys', function() {
      select = 'SELECT * FROM ?? WHERE x=1 && y!=2 && b>3 && b<=4 LIMIT 5 OFFSET 6';
      obj = { 
        x : 1,
        y : { ne : 2 },
        b : { gt : 3, lte : 4 },
        c: { a: 1},
        null : { limit: 5, offset:  6 }};
    });

    afterEach(function(done) {
      expect(sql.get(str,obj)).to.equal(select);
      done();
    });
  });
});
