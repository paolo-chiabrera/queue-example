const chai = require('chai');

const { name } = require('../package.json');

const server = require('../index');

describe(`given ${name} app`, () => {
  after(() => {
    server.close();
  });

  describe('when calling /', () => {
    it('should return 200', (done) => {
      chai
        .request(server).get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);

          done();
        });
    });
  });
});
