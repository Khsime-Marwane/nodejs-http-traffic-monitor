const { Tail } = require('tail');
const display = require('./display');
const {
  logger,
  parsing,
} = require('./utils');

// Options for Tail.
const tailOptions = {
  separator: /[\r]{0,1}\n/, // to handle linux/ mac(9 +) / windows
  // eslint-disable-next-line eqeqeq
  fromBeginning: process.env.READ_FILE_FROM_BEGINNING == 'true', // Need to check for true because dotenv consider the variable as a string
  fsWatchOptions: {},
  follow: true,
  logger: console,
  flushAtEOF: true, // Needed with tail to read all new entries even if there is no \n.
};

// entries (sections)
const entries = new Map();
// Logs
let logQueue = [];
// We use tail to read new lines written.
let tail;
// used to store the id of the interval
let intervalID;

/**
 * Read a file and display every `PERIOD` milliseconds the new entries.
 * @param {*} file path of the file to read.
 */
const watchFile = (file, programOptions) => {
  try {
    tail = new Tail(file, tailOptions);
  } catch (reason) {
    logger.error(reason);
    return;
  }

  // On new line
  tail.on('line', (data) => {
    // Parse the request.
    const logParsed = parsing.parseHTTPRequest(data);
    // If the log matches the w3 format.
    if (logParsed) {
      const section = parsing.getSectionFromResource(logParsed.resource);
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

  /**
   * When an error occurs.
   */
  tail.on('error', (reason) => {
    logger.error(reason);
  });

  /**
   * Set the interval of display.
   */
  intervalID = setInterval(() => {
    display.displayLogs(logQueue);

    if (!programOptions.raw) {
      display.displayStats(entries);
    }

    entries.clear();
    logQueue = [];
  }, process.env.PERIOD);
};

/**
 * Tell to Tail to stop.
 */
const unwatchFile = () => {
  tail.unwatch();
  clearInterval(intervalID);
};

module.exports = {
  watchFile,
  unwatchFile,
};
