require('dotenv').config();

const programArgs = require('commander');
const parser = require('./parser');

programArgs
  .option('-f, --file <path>', 'File to watch')
  .option('-d, --demo', 'Run the programm with a fake log file')
  .option('-r, --raw', 'Display raw logs (only new entries')
  .parse(process.argv);

/**
 * If the user asked for a demo, we use the value of DEMO_FILE defined in the .env file.
 * If not, we use either the value of the file given as parameter, either DEFAULT_FILE defined in the .env file
 * which is the default value.
 */
const file = programArgs.demo ? process.env.DEMO_FILE : programArgs.file || process.env.DEFAULT_FILE;

parser.watchFile(file,
  // Options
  {
    raw: programArgs.raw,
  });
