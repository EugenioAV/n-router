const tokens = require('./support/test.systems')['tokens'];
const authorization = require('../lib/authorization');
const expect = require('chai').expect;

describe('Authorization', function() {
  it('other length token', function(done) {
    const access = authorization('eaaaaaaa', tokens);
    expect(access).to.be.an.instanceof(Error);
    done();
  });

  it('token not true', function(done) {
    const access = authorization('eaaaaaaa105c4f29a0f5117d2960926f', tokens);
    expect(access).to.be.an.instanceof(Error);
    done();
  });

  it('correct token', function(done) {
    const access = authorization('ea135929105c4f29a0f5117d2960926f', tokens);
    expect(access['create']).to.equal(true);
    expect(access['read']).to.equal(true);
    expect(access['update']).to.equal(false);
    expect(access['delete']).to.equal(false);
    done();
  });
});
