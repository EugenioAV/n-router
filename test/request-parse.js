const requestParse = require('../lib/parsers/request');
const expect = require('chai').expect;

describe('Request parse', function() {
  it('URL is full', function(done) {
    const req = { 
      url: '/dataset/system/name.format?value=1', 
      headers: { 'content-type' : 'application/xml'}
    };

    const properties = requestParse(req);
    expect(properties.type).to.equal('dataset');
    expect(properties.system).to.equal('system');
    expect(properties.name).to.equal('name');
    expect(properties.format).to.equal('format');
    expect(properties.qs).to.equal('value=1');
    done();
  });

  it('URL is not full', function(done) {
    const req = { 
      url: '/system/name.format?value=1', 
      headers: { 'content-type' : 'application/xml'}
    };

    const properties = requestParse(req);
    expect(properties.type).to.equal('system');
    expect(properties.system).to.equal('name.format');
    expect(properties.name).to.equal('');
    expect(properties.format).to.equal('xml');
    expect(properties.qs).to.equal('value=1');
    done();
  });

  it('get format from header accept-type', function(done) {
    const req = { 
      url: '/dataset/system/name?value=1', 
      headers: { 'content-type' : 'application/xml', 'accept-type' : 'format'}
    };

    const properties = requestParse(req);
    expect(properties.type).to.equal('dataset');
    expect(properties.system).to.equal('system');
    expect(properties.name).to.equal('name');
    expect(properties.format).to.equal('format');
    expect(properties.qs).to.equal('value=1');
    done();
  });
});
