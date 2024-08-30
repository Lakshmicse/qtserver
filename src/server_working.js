/* eslint-disable no-console */
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
// const app = require('./app');
// Import the express module
const express = require('express');

const app = express();

const config = require('./config/config');
const logger = require('./config/logger');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  https
    .createServer(
      // Provide the private and public key to the server by reading each
      // file's content with the readFileSync() method.
      {
        key: fs.readFileSync('/home/itadmin/self_ssl/key.pem'),
        cert: fs.readFileSync('/home/itadmin/self_ssl/cert.pem'),
      },
      app
    )
    .listen(4000, () => {
      console.log('serever is runing at port 4000');
    });
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
