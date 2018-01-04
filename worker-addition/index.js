const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const winston = require('winston');
const healthcheck = require('express-healthcheck');
const statusMonitor = require('express-status-monitor');

const Queue = require('bee-queue');

const pckg = require('./package');

const config = require('./config').get();

// define logger
const logger = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)({
      colorize: true,
    }),
  ],
});

if (config.env !== 'test') {
  logger.add(winston.transports.File, {
    filename: config.winston.file.filename,
    logstash: true,
    maxFiles: 3,
    maxsize: 2 * 1024 * 1024,
    tailable: true,
    zippedArchive: false,
  });
}

// define app
const app = express();

// define middlewares
app.use(helmet());
app.use(morgan('common'));
app.use(compression());
app.use(statusMonitor());
app.use('/healthcheck', healthcheck());
app.use(cors({
  methods: ['GET'],
}));

// define routes
app.get('/', (req, res) => {
  const { name, version } = pckg;

  res.json({
    name,
    version,
  });
});

// start server
const server = app.listen(config.port, () => {
  logger.info(config);

  const queue = new Queue('addition', {
    redis: {
      host: config.redis.host,
      port: config.redis.port,
    },
    isWorker: true,
  });

  queue.process(({ id, data }, done) => {
    logger.info(`Processing job ${id} with ${data.x}, ${data.y}`);

    setTimeout(() => done(null, data.x + data.y), 1000);
  });
});

module.exports = server;
