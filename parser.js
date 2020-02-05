const { Tail } = require('tail');
const display = require('./display');
const {
  logger,
  parsing,
} = require('./utils');

const tailOptions = {
  separator: /[\r]{0,1}\n/,
  fromBeginning: true,
  fsWatchOptions: {},
  follow: true,
  logger: console,
  flushAtEOF: true,
};

const entries = new Map();
let logQueue = [];
let tail;

const watchFile = (file) => {
  try {
    tail = new Tail(file, tailOptions);
  } catch (reason) {
    logger.error(reason);
    return;
  }

  tail.on('line', (data) => {
    const logParsed = parsing.parseHTTPRequest(data);
    if (logParsed) {
      const section = parsing.extractSectionFromResource(logParsed.resource);
      const doesRequestFailed = parsing.isStatusError(logParsed.status);
      const bytes = parseInt(logParsed.bytes, 10);

      if (entries.has(section)) {
        entries.get(section).nbRequests += 1;
        entries.get(section).totalBytes += bytes;
        entries.get(section).errorRate += doesRequestFailed;
        entries.get(section).successRate += !doesRequestFailed;
      } else {
        entries.set(section, {
          nbRequests: 1,
          totalBytes: bytes,
          successRate: +!doesRequestFailed,
          errorRate: +doesRequestFailed,
          section,
        });
      }
      logQueue.push(data);
    }
  });

  tail.on('error', (reason) => {
    logger.error(reason);
  });

  setInterval(() => {
    display.displayLogs(logQueue);
    display.displayStats(entries);

    entries.clear();
    logQueue = [];
  }, 5000);
};

module.exports = {
  watchFile,
};
