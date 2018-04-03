const qs = require('../lib/qs');
const expect = require('chai').expect;

describe('QueryString parse', function() {
  describe('empty string', function() {
    it('return empty object', function(done) {
      var string = '';
      expect(qs.parse(string)).to.be.an('object').that.is.empty;
      done();
    });
  });

  describe('not empty string', function() {
    var string;
    it('with the same keys', function(done) {      
      string = 'a=1&a=2';
      expect(qs.parse(string)).to.have.key('a');
      expect(qs.parse(string)['a']).to.be.an('array').that.includes('1','2');
      done();
    });

    it('with keys without sub-keys', function(done) {    
      string = 'a=1&b=2';
      expect(qs.parse(string)).to.have.all.keys('a', 'b');
      expect(qs.parse(string)['a']).to.equal('1');
      expect(qs.parse(string)['b']).to.equal('2');
      done();
    });

    it('with empty square brackets ', function(done) {    
      string = 'a[]=1&b[]=2';
      expect(qs.parse(string)).to.have.all.keys('a','b');
      expect(qs.parse(string)['a']).to.include('1');
      expect(qs.parse(string)['b']).to.include('2');
      done();
    });

    it('with sub-keys', function(done) {    
      var string = 'a[b]=1&c[d]=2';
      expect(qs.parse(string)).to.have.keys('a','c');
      expect(qs.parse(string)).to.have.deep.property('a', { b : '1' });
      expect(qs.parse(string)).to.have.deep.property('c', { d : '2' });
      done();
    });

    it('string with [limit]', function(done) {    
      var string = '[limit]=1';
      expect(qs.parse(string)).to.have.key(null);
      expect(qs.parse(string)).to.have.deep.property(null, { limit : '1' });
      done();
    });

    it('string with [offset]', function(done) {    
      var string = '[offset]=1';
      expect(qs.parse(string)).to.have.key(null);
      expect(qs.parse(string)).to.have.deep.property(null, { offset : '1' });
      done();
    });

    it('string with different things', function(done) {    
      var string = 'a[b]=1&a[c]=2&[limit]=3&[offset]=4&d=5';
      expect(qs.parse(string)).to.have.keys(null, 'a','d');
      expect(qs.parse(string)).to.have.deep.property('a', { b: '1' , c : '2' });
      expect(qs.parse(string)).to.have.deep.property(null, { limit : '3', offset: '4'});
      done();
    });
  });
});
