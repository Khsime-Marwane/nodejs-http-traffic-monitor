/* eslint-disable no-undef */
require('dotenv');

const assert = require('assert');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const program = require('../index');

const fsPromises = fs.promises;

const PROGRAM_OUTPUT = './output.txt';
const REF_FILE = './test/._should_be.txt';

describe('Test', () => {
  describe('Writing logs', () => {
    it('output.txt generated by the program should be the same than ./test/._should_be.txt', async () => {
      // runs before all tests in this block
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      console.log('Launching program...');
      await sleep(1000);

      console.log('writing the ._1.txt...');
      await exec('cat ./test/._1.txt >> ./logs/access.log');
      await sleep(11000); // wait for the monitor to display his results

      console.log('writing the ._2.txt...');
      await exec('cat ./test/._2.txt >> ./logs/access.log');
      await sleep(11000); // wait for the monitor to display his results

      const output = await fsPromises.readFile(PROGRAM_OUTPUT, 'binary'); // read the log file generated
      const shouldbe = await fsPromises.readFile(REF_FILE, 'binary'); // read the file containing the expected output

      program.unwatch();

      fs.unlinkSync(PROGRAM_OUTPUT);
      assert.equal(output === shouldbe, true);
    });
  });
});