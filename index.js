const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { addPerformanceMarks, removePerformanceMarks } = require('./perfinsight-core');

function processFiles(filePaths, mode, config) {
  const ignoreSet = new Set(config.ignore ? config.ignore.map(p => path.resolve(p)) : []);
  console.log('Ignore set:', ignoreSet);

  filePaths.forEach((filePath) => {
    const resolvedFilePath = path.resolve(filePath);
    console.log('Resolved file path:', resolvedFilePath);
    if (ignoreSet.has(resolvedFilePath)) {
      return;
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log('Original content:', fileContent);
    let updatedContent = null;
    if (mode === 'add') {
      updatedContent = addPerformanceMarks(fileContent, resolvedFilePath);
    } else if (mode === 'remove') {
      updatedContent = removePerformanceMarks(fileContent, resolvedFilePath);
    }
    if (updatedContent) {
      console.log('Updated content:', updatedContent);
      fs.writeFileSync(filePath, updatedContent);
    }
  });
}

function processDirectory(directory, operation, config = {}) {
  if (typeof directory !== 'string') {
    throw new Error('The "directory" parameter should be a string.');
  }

  const files = glob.sync(path.join(directory, '**/*.js'));

  processFiles(files, operation, config);
}

module.exports = {
  processFiles,
  processDirectory,
};