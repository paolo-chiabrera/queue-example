const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

global.expect = chai.expect;
