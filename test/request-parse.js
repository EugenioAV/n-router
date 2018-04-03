const requestParse = require('../lib/request-parse');
const expect = require('chai').expect;


describe('Parse of request', function() {
  describe('then URL path without', function() {
    var req;

    it('type', function() {
      req = { url: '/system/name.format' };
    });

    it('system', function() {
      req = { url: '/type/name.format' };
    });

    it('name', function() {
      req = { url: '/type/system/.format' };
    }); 

    afterEach(function(done) {
      expect(requestParse.parse(req)).to.be.an('undefined');
      done();
    });
  });

  describe('then method is ', function() {
    var req = { url: '/type/system/name.format'};
    var sql;

    it('GET', function() {
      req.method = 'GET';
      sql = 'SELECT * FROM ??';
    });
    
    it('POST', function() {
      req.method = 'POST';
      sql = 'INSERT INTO ?? VALUES ?';
    });

    it('PATCH', function() {
      req.method = 'PATCH';
      sql = 'UPDATE ?? SET ?';
    });

    it('DELETE', function() {
      req.method = 'DELETE';
      sql = 'DELETE FROM ??';
    });

    afterEach(function(done) {
      expect(requestParse.parse(req).sql).to.equal(sql);
      done();
    });
  });

  describe('then header content-type is ', function() {
    var req = { url: '/type/system/name.format', headers: { 'content-type' : ''}, method: 'POST'};
    var format = '';

    it('application/xml', function() {
      req.headers['content-type'] = 'application/xml';
      format = 'xml';
    });
    
    it('application/json', function() {
      req.headers['content-type'] = 'application/json';
      format = 'json';
    });

    afterEach(function(done) {
      expect(requestParse.parse(req).body).to.equal(format);
      done();
    });
  });

  it('then the information is full', function(done) {
    const req = 
      { 
        url: '/type/system/name.format', 
        headers: { 'content-type' : 'application/xml'},
        method: 'GET'
      };
    expect(requestParse.parse(req).type).to.equal('type');
    expect(requestParse.parse(req).system).to.equal('system');
    expect(requestParse.parse(req).name).to.equal('name');
    expect(requestParse.parse(req).format).to.equal('format');
    expect(requestParse.parse(req).body).to.equal('xml');
    expect(requestParse.parse(req).method).to.equal('GET');
    done();
  });
});