const Queue = require('bee-queue');
const { random } = require('lodash');

function init({ config = {}, logger = console }) {
  const queue = new Queue('subtraction', {
    redis: {
      host: config.redis.host,
      port: config.redis.port,
    },
    isWorker: false,
  });

  queue.on('error', err => logger.error(`subtractionQueue: ${err.message}`));

  queue.on('ready', () => {
    logger.info('subtractionQueue is ready');

    setInterval(async () => {
      const status = await queue.checkHealth();

      logger.info('subtractionQueue status', status);
    }, 10000);

    setInterval(() => {
      const job = queue.createJob({ x: random(0, 10), y: random(0, 10) });

      job
        .timeout(2000)
        .retries(2)
        .save()
        .catch(err => logger.error(err))
        .then(({ id }) => logger.info(`subtractionQueue, added job: ${id}`));
    }, 2000);
  });

  queue.on('succeeded', (job, result) => {
    logger.info(`Job subtraction ${job.id} succeeded with result: ${result}`);
  });
}

module.exports = {
  init,
};
