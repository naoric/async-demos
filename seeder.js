const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const _ = require('lodash/fp');

const FOLDER_NAME = './dummies';
const FILE_PREFIX = 'file';

function seeder(dirName = FOLDER_NAME, filesPrefix = FILE_PREFIX) {
  const folderPath = dummiesFolderPath(dirName);
  createFolderIfNotExists(folderPath);

  return {
    seedFiles(count) {
      _.times(item =>
        createFileWithPrefix(folderPath, filesPrefix + item))(count);
    },
    clear() {
      emptyFolder(folderPath);
    }
  }
}

function emptyFolder(folderPath) {
  fsExtra.emptyDirSync(folderPath);
}

function createFileWithPrefix(filePath, prefix) {
  fs.writeFileSync(path.resolve(filePath, `${prefix}.txt`));
}

function dummiesFolderPath(folderName) {
  return path.resolve(__dirname, `${folderName}`);
}

function createFolderIfNotExists(fullName) {
  if (!fs.existsSync(fullName)) {
    fs.mkdirSync(fullName);
  }
}

module.exports = {
  seeder,
  createFileWithPrefix,
  createFolderIfNotExists
};
