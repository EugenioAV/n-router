const requestParse = require('../lib/request-parse');
const expect = require('chai').expect;


describe('Parse of request for database', function() {
  describe('then URL path without', function() {
    var req = {headers: { }};

    it('type', function() {
      req = { url: '/system/method:name.format' };
    });

    it('system', function() {
      req = { url: '/mysql/method:name.format' };
    });

    it('name', function() {
      req = { url: '/mysql/system/method:.format' };
    }); 

    afterEach(function(done) {
      expect(requestParse(req)).to.be.an('undefined');
      done();
    });
  });

  describe('then http method is ', function() {
    var req = { 
      url: '/mysql/system/method:name.format',
      headers: { 'content-type' : 'application/xml'}};
    var sql;

    it('GET', function() {
      req.method = 'GET';
      sql = 'SELECT * FROM name ';
    });
    
    it('POST', function() {
      req.method = 'POST';
      sql = 'INSERT INTO name VALUES ?';
    });

    it('PATCH', function() {
      req.method = 'PATCH';
      sql = 'UPDATE name SET ? ';
    });

    it('DELETE', function() {
      req.method = 'DELETE';
      sql = 'DELETE FROM name ';
    });

    afterEach(function(done) {
      expect(requestParse(req).sql.str).to.equal(sql);
      done();
    });
  });


  describe('then type of object in database is ', function() {
    var req = {headers: { }};
    var sql;

    it('table', function() {
      req.url = '/mysql/system/table:name.format';
      req.method = 'GET';
      sql = 'SELECT * FROM name ';
    });
    
    it('procedure MySQL', function() {
      req.url = '/mysql/system/procedure:name.format';
      req.method = 'GET';
      sql = 'CALL name()';
    });

    it('procedure PostgreSQL', function() {
      req.url = '/pg/system/procedure:name.format';
      req.method = 'GET';
      sql = 'SELECT name()';
    });

    it('function', function() {
      req.url = '/mysql/system/function:name.format';
      req.method = 'GET';
      sql = 'SELECT name()';
    });

    afterEach(function(done) {
      expect(requestParse(req).sql.str).to.equal(sql);
      done();
    });
  });

  describe('then header content-type is ', function() {
    var req = { url: '/mysql/system/method:name.format', headers: { 'content-type' : ''}, method: 'POST'};
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
      expect(requestParse(req).convertType).to.equal(format);
      done();
    });
  });

  it('then the information is full', function(done) {
    const req = 
      { 
        url: '/mysql/system/method:name.format', 
        headers: { 'content-type' : 'application/xml'},
        method: 'GET'
      };
    expect(requestParse(req).type).to.equal('mysql');
    expect(requestParse(req).name).to.equal('name');
    expect(requestParse(req).format).to.equal('format');
    expect(requestParse(req).convertType).to.equal('xml');
    expect(requestParse(req).method).to.equal('GET');
    done();
  });
});

describe('Parse of request for web service', function() {
  describe('then URL path without', function() {
    var req = { headers: { }};

    it('type', function() {
      req = { url: '/system/name.format' };
    });

    it('system', function() {
      req = { url: '/web/.format' };
    });

    afterEach(function(done) {
      expect(requestParse(req)).to.be.an('undefined');
      done();
    });
  });

  describe('then http method is ', function() {
    var req = { 
      url: '/web/system/name.format',
      headers: { 'content-type' : 'application/xml'}};
    var sql;

    it('GET', function() {
      req.method = 'GET';
    });
    
    it('POST', function() {
      req.method = 'POST';
    });

    afterEach(function(done) {
      expect(requestParse(req).method).to.equal(req.method);
      done();
    });
  });

  describe('then header content-type is ', function() {
    var req = { url: '/web/system.format', headers: { 'content-type' : ''}, method: 'POST'};
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
      expect(requestParse(req).convertType).to.equal(format);
      done();
    });
  });

  it('then the information is full', function(done) {
    const req = 
      { 
        url: '/mysql/system/method:name.format', 
        headers: { 'content-type' : 'application/xml'},
        method: 'GET'
      };
    expect(requestParse(req).type).to.equal('mysql');
    expect(requestParse(req).name).to.equal('name');
    expect(requestParse(req).format).to.equal('format');
    expect(requestParse(req).convertType).to.equal('xml');
    expect(requestParse(req).method).to.equal('GET');
    done();
  });
});
