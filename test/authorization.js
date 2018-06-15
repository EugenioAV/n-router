const authorization = require('../lib/authorization');
const expect = require('chai').expect;

describe('Authorization', function() {
  it('token not true', function(done) {
    try {
      authorization('ee135929105c4f29a0f5117d2960926f');
    } catch (ex) {
      expect(ex.message).to.equal('Access denied');
      done();
    }    
  });

  it('correct token', function(done) {
    const access = authorization('ea135929105c4f29a0f5117d2960926f');
    expect(access['create']).to.equal(true);
    expect(access['read']).to.equal(true);
    expect(access['update']).to.equal(true);
    expect(access['delete']).to.equal(true);
    done();
  });
});
