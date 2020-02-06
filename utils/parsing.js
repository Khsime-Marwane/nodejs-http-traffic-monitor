/* eslint-disable no-useless-escape */

/**
 * Regex used to parse each line of log in order to check if it's w3-formatted.
 */
const RE_HTTP_REQUEST = new RegExp([
  '^',
  '(?<host>\\S+) ',
  '(?<rfc931>\\S+) ',
  '(?<authuser>\\S+) ',
  '\\[(?<date>[\\w:\\/]+\\s[+\\-]\\d{4})\\] ',
  '"(?<method>\\S+) ',
  '(?<resource>\\S+)\\s*',
  '(?<protocol>\\S+)?\\s*',
  '(?<status>\\d{3}) ',
  '(?<bytes>\\S+)',
].join(''));

/**
 * Parse the log (expected to be a line) with regex, using RE_HTTP_REQUEST
 * and check if it's w3c-formatted.
 * @param {*} log line of log.
 */
const parseHTTPRequest = (log) => {
  const logParsed = RE_HTTP_REQUEST.exec(log);

  if (logParsed) {
    if (logParsed.groups.bytes === '-') logParsed.groups.bytes = 0; // because bytes can be equl to '-'

    return logParsed.groups;
  }

  return null;
};

/**
 * Return the section from a resource.
 * A section is defined as being what's before the second / in the log line's resource section.
 * For example, the section for /pages/create is /pages.
 * @param {*} resource resource.
 */
const getSectionFromResource = (resource) => {
  if (resource === '/') return '/';

  const splitted = resource.split('/', 2);

  return splitted.length === 2 ? `/${resource.split('/', 2)[1]}/` : resource;
};

/**
 * Check the status code is an error status (code between 400 and 511)
 * @param {*} status code
 */
const isStatusError = (status) => {
  const code = parseInt(status, 10);

  return code >= 400 && code <= 511;
};

/**
 * Give a more user-friendly value of an amount of data (in bytes).
 * @param {*} bytes bytes
 * @param {*} decimals base
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Get the percentage of 'n' in 'total'.
 * @param {*} n number
 * @param {*} total total
 */
const getPercentage = (n, total) => `${Math.floor((n / total) * 100)} %`;

module.exports = {
  parseHTTPRequest,
  getSectionFromResource,
  isStatusError,
  formatBytes,
  getPercentage,
};
