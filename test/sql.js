const expect = require('chai').expect;
const sql = require('../lib/sql');

describe('Create sentence for query', function() {
  let sentence = '';
  let obj = {};
  let value = [];

  context('when object has deep key', function() {
    it('eq', function() {
      sentence = ' WHERE a = ?';
      obj = { a : { eq:  1 }};
      value = [1];
    });

    it('ne', function() {
      sentence = ' WHERE a != ?';
      obj = { a : { ne:  1 }};
      value = [1];
    });

    it('gt', function() {
      sentence = ' WHERE a > ?';
      obj = { a : { gt:  1 }};
      value = [1];
    });

    it('lt', function() {
      sentence = ' WHERE a < ?';
      obj = { a : { lt:  1 }};
      value = [1];
    });

    it('gte', function() {
      sentence = ' WHERE a >= ?';
      obj = { a : { gte:  1 }};
      value = [1];
    });

    it('lte', function() {
      sentence = ' WHERE a <= ?';
      obj = { a : { lte:  1 }};
      value = [1];
    });

    it('limit', function() {
      sentence = ' LIMIT 1';
      obj = { null : { limit:  1 }};
      value = [];
    });

    it('offset', function() {
      sentence = ' OFFSET 1';
      obj = { null : { offset:  1 }};
      value = [];
    });

    afterEach(function(done) {
      const query = sql.get('', obj, () => { return '?';});
      expect(query.query).to.equal(sentence);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });

  context('when object', function() {
    it('is empty', function() {
      sentence = '';
      obj = {};
      value = [];
    });

    it('without deep keys', function() {
      sentence = ' WHERE a = ? && b = ?';
      obj = { a : 1 , b : 2 };
      value = [1, 2]; 
    });

    it('has different keys', function() {
      sentence = ' WHERE x = ? && y != ? && b > ? && b <= ? LIMIT 5 OFFSET 6';
      obj = { 
        x : 'one',
        y : { ne : 2 },
        b : { gt : 3, lte : 4 },
        c: { a: 1},
        null : { limit: 5, offset:  6 }};
      value = ['one', 2, 3, 4];
    });

    afterEach(function(done) {
      const query = sql.get('', obj, () => { return '?';});
      expect(query.query).to.equal(sentence);
      expect(query.value).to.be.an('array').to.have.ordered.members(value);
      done();
    });
  });
});
