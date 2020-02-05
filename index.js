require('dotenv').config();

const programArgs = require('commander');
const parser = require('./parser');

programArgs
  .option('-f, --file <path>', 'File to watch')
  .option('-d, --demo', 'Run the programm with a fake log file')
  .parse(process.argv);

const file = programArgs.demo ? process.env.DEMO_FILE : programArgs.file || process.env.DEFAULT_FILE;

parser.watchFile(file);
