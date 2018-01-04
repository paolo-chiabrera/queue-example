const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const winston = require('winston');
const healthcheck = require('express-healthcheck');
const statusMonitor = require('express-status-monitor');

const subtractionQueue = require('./queues/subtraction');
const additionQueue = require('./queues/addition');

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

  additionQueue.init({ config, logger });
  subtractionQueue.init({ config, logger });
});

module.exports = server;
