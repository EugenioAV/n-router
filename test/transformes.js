const transformers = require('../lib/transformes');
const stream = require('stream');
const expect = require('chai').expect;

const { json: JSONStringify } = transformers;
const { xml: XMLConversion } = transformers;

describe('Transformers', function() {
  describe('JSONStringify', function() {
    describe('contentType', function() {
      it('should be application/json', function() {
        expect(JSONStringify).to
          .have.own.property('contentType', 'application/json');
      });

      it('should not be writable', function() {
        expect(JSONStringify).to.have.ownPropertyDescriptor('contentType')
          .that.has.property('writable', false);
      });

      it('should be enumerable', function() {
        expect(JSONStringify).to.have.ownPropertyDescriptor('contentType')
          .that.has.property('enumerable', true);
      });
    });

    describe('stream interface', function() {
      var transformer;

      beforeEach(function() {
        transformer = new JSONStringify();
      });

      it('should be duplex stream', function() {
        expect(transformer).to.be.instanceof(stream.Duplex);
      });

      context('empty', function() {
        beforeEach(function(done) {
          transformer.end(done);
        });

        it('should transform empty array', function() {
          expect(read(transformer)).to.equal('[]');
        });
      });

      context('one object', function() {
        beforeEach(function(done) {
          transformer.write({ a: 1 }, done);
        });

        it('converts object to json array', function() {
          expect(read(transformer)).to.equal('[{"a":1}');
        });

        it('should close json array after end', function(done) {
          transformer.end(function() {
            expect(read(transformer)).to.equal('[{"a":1}]');
            done();
          });
        });
      });

      context('several objects', function() {
        beforeEach(function(done) {
          transformer.write({ a: 1 }, done);
        });

        it('should write several objects to json array', function(done) {
          transformer.write({ b: 2 }, function(err) {
            expect(read(transformer)).to.equal('[{"a":1},{"b":2}');
            done(err);
          });
        });

        it('should close json array after end', function(done) {
          transformer.end({ c: 3, d: 4 }, function(err) {
            expect(read(transformer)).to.equal('[{"a":1},{"c":3,"d":4}]');
            done(err);
          });
        });
      });
    });
  });

  describe('XMLConversion', function() {
    describe('contentType', function() {
      it('should be application/xml', function() {
        expect(XMLConversion).to.
          have.own.property('contentType', 'application/xml');
      });

      it('should not be writable', function() {
        expect(XMLConversion).to.have.ownPropertyDescriptor('contentType')
          .that.has.property('writable', false);
      });

      it('should be enumerable', function() {
        expect(XMLConversion).to.have.ownPropertyDescriptor('contentType')
          .that.has.property('enumerable', true);
      });
    });

    describe('stream interface', function() {
      var transformer;

      beforeEach(function() {
        transformer = new XMLConversion();
      });

      it('should be duplex stream', function() {
        expect(transformer).to.be.instanceof(stream.Duplex);
      });

      context('empty', function() {
        beforeEach(function(done) {
          transformer.end(done);
        });

        it('should transform empty', function() {
          expect(read(transformer)).to.equal('<?xml version="1.0"?><rows></rows>');
        });
      });

      context('one object', function() {
        beforeEach(function(done) {
          transformer.write({ a: 1 }, done);
        });

        it('converts object to xml', function() {
          expect(read(transformer))
            .to.equal('<?xml version="1.0"?><rows><row><a>1</a></row>');
        });

        it('should close rows after end', function(done) {
          transformer.end(function() {
            expect(read(transformer))
              .to.equal('<?xml version="1.0"?><rows><row><a>1</a></row></rows>');
            done();
          });
        });
      });

      context('several objects', function() {
        beforeEach(function(done) {
          transformer.write({ a: 1 }, done);
        });

        it('should write different several objects to xml', function(done) {
          transformer.write({ c: 3, d: 4 }, function() {
            expect(read(transformer))
              .to.equal('<?xml version="1.0"?><rows><row><a>1</a></row><row><c>3</c><d>4</d></row>');
            done();
          });
        });

        it('should close rows after end', function(done) {
          transformer.end({ c: 3, d: 4 }, function() {
            expect(read(transformer))
              .to.equal('<?xml version="1.0"?><rows><row><a>1</a></row><row><c>3</c><d>4</d></row></rows>');
            done();
          });
        });
      });
    });
  });
});



function read(transformer) {
  return transformer.read().toString();
}
