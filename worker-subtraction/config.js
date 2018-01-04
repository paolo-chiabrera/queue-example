const convict = require('convict');

const conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 9002,
    env: 'PORT',
  },
  redis: {
    host: {
      doc: 'The redis host.',
      default: '127.0.0.1',
      env: 'REDIS_HOST',
    },
    port: {
      doc: 'The redis port.',
      default: '6379',
      env: 'REDIS_PORT',
    },
  },
  winston: {
    file: {
      filename: {
        doc: 'The log filename.',
        default: './logs/express_app.log',
        env: 'NODE_WINSTON_FILENAME',
      },
    },
  },
});

conf.validate({ allowed: 'strict' });

module.exports = conf;
