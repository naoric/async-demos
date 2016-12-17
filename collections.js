const seeder = require('./seeder').seeder('dummies', 'file');
const program = require('commander');
const ajs = require('async');
const fs = require('fs');

program
  .version('1.0.0')
  .option('-c, --concat', 'Concat example')
  .option('-d, --detect', 'Detect example')
  .parse(process.argv);

before();

if (program.concat) concat();
if (program.detect) {
  detect();
}

after();

function before() {
  seeder.seedFiles(10);
}

function after() {
  seeder.clear();
}

function concat() {
  ajs.concat(['./dummies/file1.txt', './dummies/file2.txt', './dummies/file3.txt'],
      fs.stat,
      (err, results) => console.log(err, results));
}

function detect() {
  ajs.detect(['nothing', 'dummies/file1.txt', 'dummies/file2.txt'],
      (file, callback) => fs.exists(file, isExists => callback(null, isExists)),
      (err, result) => console.log(result));
}
