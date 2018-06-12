const requestParse = require('../lib/parsers/request');
const pathParse = require('../lib/parsers/path');
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

describe('Path parse', function() {
  it('when send all information', function(done) {
    const path = 'user:password@host:port/database';

    const {host, port, user, password, database} = pathParse(path);
    expect(host).to.equal('host');
    expect(port).to.equal('port');
    expect(user).to.equal('user');
    expect(password).to.equal('password');
    expect(database).to.equal('database');
    done();
  });

  it('when host without port', function(done) {
    const path = 'user:password@host/database';

    const {host, port, user, password, database} = pathParse(path);
    expect(host).to.equal('host');
    expect(port).to.equal(undefined);
    expect(user).to.equal('user');
    expect(password).to.equal('password');
    expect(database).to.equal('database');
    done();
  });
});
