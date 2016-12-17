const seeder = require('./seeder').seeder('dummies', 'file');
const program = require('commander');
const ajs = require('async');
const fs = require('fs');
const _ = require('lodash/fp');

program
  .version('1.0.0')
  .option('-c, --concat', 'Concat example')
  .option('-d, --detect', 'Detect example')
  .option('-e, --each', 'Each example')
  .option('-d, --eachOf', 'Each Of example')
  .option('--every', 'every example')
  .option('--filter', 'filter example')
  .option('--map', 'map example')
  .option('--map-values', 'map-values example')
  .option('--reduce', 'reduce example')
  .option('--reject', 'reject example')
  .parse(process.argv);

const existingFileNames = () => [
  './dummies/file1.txt',
  './dummies/file2.txt',
  './dummies/file3.txt'
];

const nonExistingFileNames = () => ['junk', 'nothing'];
const mixedFileNames = () =>
  _.shuffle(existingFileNames().concat(nonExistingFileNames()));

before();

if (program.concat) concat();
if (program.detect) detect();
if (program.each) each();
if (program.every) every();
if (program.filter) filter();
if (program.map) map();
if (program.reduce) reduce();
if (program.reject) reject();

setTimeout(after, 500);

function before() {
  seeder.seedFiles(10);
}

function after() {
  seeder.clear();
}

function concat() {
  ajs.concat(existingFileNames(),
    fs.stat,
    (err, results) => console.log(err, results));
}

function detect() {
  ajs.detect(mixedFileNames(),
    (file, callback) => fs.exists(file, isExists => callback(null, isExists)),
    (err, result) => console.log(result))
}

function each() {
  ajs.each(
    mixedFileNames(),

    (file, cb) =>
    fs.exists(file, exists =>
      !exists && cb(`File ${file} does not exist`)),

    err => console.log('something failed .. ', err)
  );
}

function every() {
  ajs.every(
    mixedFileNames(),
    (file, cb) => fs.exists(file, exists => cb(null, exists)),
    (err, result) => result ?
    console.log('all files exists') :
    console.log('some files are missing :(')
  );
}

function filter() {
  ajs.filter(
    mixedFileNames(),
    (file, cb) => fs.exists(file, exists => cb(null, exists)),
    (err, results) => console.log('existing files are', results)
  );
}

function map() {
  ajs.map(
    existingFileNames(),
    fs.stat,
    (err, results) => console.log(results)
  );
}

function reduce() {
  ajs.reduce(
    mixedFileNames(),
    [],
    (agg, file, cb) => fs.exists(file, exists => cb(null, exists ? agg.concat(file) : agg)),
    (err, result) => console.log('memo is ', result)
  );
}

function reject() {
  ajs.reject(
    mixedFileNames(),
    (file, cb) => fs.exists(file, exists => cb(null, exists)),
    (err, result) => console.log('non existing files are', result)
  );
}
