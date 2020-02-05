const winston = require('winston');
const moment = require('moment');

const { printf } = winston.format;

const myFormat = printf(({
  timestamp, level, message, meta,
}) => {
  switch (level) {
    case 'info':
      return `${message}`;

    default:
      return `[${moment(timestamp).format('DD/MMM/YYYY HH:mm')}][${level.toUpperCase()}]: ${message};${meta ? JSON.stringify(meta) : ''}`;
  }
});

const {
  splat,
  combine,
  timestamp,
} = winston.format;

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    splat(),
    myFormat,
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
