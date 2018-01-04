/* eslint-disable no-console, global-require */

const cluster = require('cluster');
const os = require('os');

const CPUS = os.cpus();

if (cluster.isMaster) {
  CPUS.forEach(() => cluster.fork());

  cluster.on('listening', (worker) => {
    console.log(`cluster connected: ${worker.process.pid}`);
  });

  cluster.on('disconnect', (worker) => {
    console.log(`cluster disconnect: ${worker.process.pid}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`cluster died: ${worker.process.pid}`);
    cluster.fork();
  });
} else {
  require('./index.js');
}
