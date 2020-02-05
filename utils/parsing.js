/* eslint-disable no-useless-escape */
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

const parseHTTPRequest = (log) => {
  const logParsed = RE_HTTP_REQUEST.exec(log);

  return logParsed ? logParsed.groups : null;
};

const extractSectionFromResource = (resource) => {
  const splitted = resource.split('/', 2);

  return splitted.length === 2 ? `/${resource.split('/', 2)[1]}/` : null;
};

const isStatusError = (status) => {
  const code = parseInt(status, 10);

  return code >= 400 && code <= 511;
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};

const getPercentage = (n, total) => `${Math.floor((n / total) * 100)} %`;

module.exports = {
  parseHTTPRequest,
  extractSectionFromResource,
  isStatusError,
  formatBytes,
  getPercentage,
};
