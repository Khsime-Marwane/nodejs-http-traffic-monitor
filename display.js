const {
  logger,
  parsing,
} = require('./utils');

/**
 * Displays the details of an entry.
 * @param {} entry entry
 */
const displayEntry = (entry) => {
  logger.info(`[${entry.section}]`);
  logger.info(`AMOUNT OF REQUESTS: ${entry.nbRequests}`);
  logger.info(`SUCCESS RATE: ${entry.successRate} (${parsing.getPercentage(entry.successRate, entry.nbRequests)})`);
  logger.info(`ERROR RATE: ${entry.errorRate} (${parsing.getPercentage(entry.errorRate, entry.nbRequests)})`);
  logger.info(`AMOUNT OF DATA: ${parsing.formatBytes(entry.totalBytes)}`);
  logger.info('\n');
};

/**
 * Display all the values of logQueue. The display is from first to last.
 * @param {Array} logQueue Logs
 */
const displayLogs = (logQueue) => {
  while (logQueue.length > 0) {
    const log = logQueue.shift();
    logger.info(log);
  }
};

/**
 * Displays details about the last PERIOD.
 * - All the entries (with their details)
 * - Global statistics (Total amount of requests, most viewed sections, etc.. )
 * @param {*} mEntries A map of entries
 */
const displayStats = (mEntries) => {
  if (mEntries.size) {
    let arrEntries = [];
    let nbTotalRequests = 0;
    let nbTotalErrors = 0;
    let nbTotalBytes = 0;
    let mostVisitedSections = [];

    mEntries.forEach((entry) => {
      arrEntries.push(entry);
    });
    arrEntries = arrEntries.sort((a, b) => b.nbRequests - a.nbRequests);

    logger.info('\n===========');
    logger.info('[ ENTRIES ]');
    logger.info('===========\n');

    arrEntries.forEach((entry) => {
      nbTotalRequests += entry.nbRequests;
      nbTotalErrors += entry.errorRate;
      nbTotalBytes += entry.totalBytes;
      displayEntry(entry);
    });

    mostVisitedSections = arrEntries.slice(0, 3).map((e) => e.section).join(',  ');

    logger.info('\n============');
    logger.info('[STATISTICS]');
    logger.info('============\n');
    logger.info(`TOTAL AMOUNT OF REQUESTS: ${nbTotalRequests}`);
    logger.info(`SUCCESSFUL REQUESTS: ${nbTotalRequests - nbTotalErrors} (${parsing.getPercentage(nbTotalRequests - nbTotalErrors, nbTotalRequests)})`);
    logger.info(`FAILED REQUESTS: ${nbTotalErrors} (${parsing.getPercentage(nbTotalErrors, nbTotalRequests)})`);
    logger.info(`AMOUNT OF DATA: ${parsing.formatBytes(nbTotalBytes)}`);
    logger.info(`MOST VIEWED SECTION: ${mostVisitedSections}`);
    logger.info('\n\n');
  }
};

module.exports = {
  displayLogs,
  displayStats,
};
