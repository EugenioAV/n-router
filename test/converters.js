const converters = require('../lib/converters');
const stream = require('stream');
const expect = require('chai').expect;

const { xml: XMLConverter } = converters;
const { json: JSONConverter } = converters; 

describe('Converters', function() { 
  describe('JSONConverter', function() {
    describe('contentType', function() {
      it('should not be writable', function() {
        expect(JSONConverter).to.have.ownPropertyDescriptor('contentType')
          .that.has.property('writable', false);
      });

      it('should be enumerable', function() {
        expect(JSONConverter).to.have.ownPropertyDescriptor('contentType')
          .that.has.property('enumerable', true);
      });
    });

    describe('stream interface', function() {
      var converter;

      beforeEach(function() {
        converter = new JSONConverter();
      });

      it('should be duplex stream', function() {
        expect(converter).to.be.instanceof(stream.Duplex);
      });

      context('converts empty object', function() {
        beforeEach(function(done) {
          converter.end(done);
        });

        it('push null', function() {
          expect(converter.read()).to.equal(null);
        });
      });

      context('converts one json object to array', function() {
        beforeEach(function(done) {
          converter.end('{ "a" : 1 }', done);
        });

        it('push array of data with all values', function() { 
          var data = converter.read();       
          expect(data).to.be.an('array');
          expect(data[0]).to.deep.equal({a: 1});
        });
      });

      context('converts several json objects to array', function() {
        beforeEach(function(done) {
          converter.end('[ { "a" : 1 } , { "b" : 2 }]', done);
        });

        it('push array of data with all values', function() { 
          var data = converter.read();       
          expect(data).to.be.an('array');
          expect(data[0]).to.deep.equal({a: 1});
          expect(data[1]).to.deep.equal({b: 2});
        });
      });

      context('converts not full json objects to arrays', function() {
        beforeEach(function(done) {
          converter.write('[{ "a" : 1 } , { "b"');
          converter.write(': 2 }');
          converter.end(done);
        });

        it('push first array with data', function() { 
          var data = converter.read();      
          expect(data[0]).to.deep.equal({a: 1});
        });

        it('push second array with data', function() { 
          var data = converter.read();
          data = converter.read();
          expect(data[0]).to.deep.equal({b: 2});
        });
      });
    });
  });

  describe('XMLConverter', function() {
    describe('contentType', function() {
      it('should not be writable', function() {
        expect(XMLConverter).to.have.ownPropertyDescriptor('contentType')
          .that.has.property('writable', false);
      });

      it('should be enumerable', function() {
        expect(XMLConverter).to.have.ownPropertyDescriptor('contentType')
          .that.has.property('enumerable', true);
      });
    });

    describe('stream interface', function() {
      var converter;

      beforeEach(function() {
        converter = new XMLConverter();
      });

      it('should be duplex stream', function() {
        expect(converter).to.be.instanceof(stream.Duplex);
      });

      context('converts empty object', function() {
        beforeEach(function(done) {
          converter.end(done);
        });

        it('push null', function() {
          expect(converter.read()).to.equal(null);
        });
      });

      context('converts one xml object to array', function() {
        beforeEach(function(done) {
          converter.end('<row><a>1</a></row>', done);
        });

        it('has all values', function() { 
          var data = converter.read();    
          expect(data[0]).to.deep.equal({a: 1});
        });
      });

      context('converts several xml objects to arrays', function() {
        beforeEach(function(done) {
          converter.write('<rows><row><a>1</a></row><row><b>2</b></row></rows>');
          converter.end(done);
        });

        it('push array of data with all values', function() { 
          var data = converter.read();       
          expect(data[0]).to.deep.equal({a: 1});
          expect(data[1]).to.deep.equal({b: 2});
        });

      });

      context('converts not full xml objects to js', function() {
        beforeEach(function(done) {
          converter.write('<rows><row><a>temp</a></row><row><b>2');
          converter.write('5</b></row></rows>'); 
          converter.end(done);
        });
        it('push first array with data', function() { 
          var data = converter.read();
          expect(data[0]).to.deep.equal({a: 'temp'});
        });

        it('push second array with data', function() { 
          converter.read();
          var data = converter.read();
          expect(data[0]).to.deep.equal({b: 25});
        });
      });
    });
  });
});