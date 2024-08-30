/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
const options = {
  //key: fs.readFileSync('G:/Pierian_New/Hitler/payroll_certificate/generated-private.key'),
  //cert: fs.readFileSync('G:/Pierian_New/Hitler/payroll_certificate/3ed928ffce5bb90e.crt'),
  //ca: [fs.readFileSync('G:/Pierian_New/Hitler/payroll_certificate/gd_bundle-g2-g1.crt')],
};

const option1 = {};

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
  /* server = https.createServer(option1 , app).listen(config.port, function () {
    logger.info(`Listening to the port ${config.port}`);
  }); */
});

app.get('/', (req, res) => {
  res.send('Hello from express server.');
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
