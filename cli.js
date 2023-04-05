#!/usr/bin/env node

const { program } = require('commander');
const perfInsight = require('./index');
const fs = require('fs');
const path = require('path');

function processFile(filePath, remove) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  let modifiedContent;

  if (remove) {
    modifiedContent = perfInsight.removePerformanceMarks(fileContent);
  } else {
    const fileName = path.basename(filePath, path.extname(filePath));
    modifiedContent = perfInsight.addPerformanceMarks(fileContent, fileName);
  }

  fs.writeFileSync(filePath, modifiedContent);
}

function processDirectory(directoryPath, remove) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath, remove);
    } else if (path.extname(file) === '.js') {
      processFile(filePath, remove);
    }
  });
}

program
  .option('-r, --remove', 'remove performance marks and measures')
  .arguments('<path>')
  .action((inputPath) => {
    const remove = program.opts().remove;
    const stats = fs.statSync(inputPath);

    if (stats.isDirectory()) {
      processDirectory(inputPath, remove);
    } else if (stats.isFile()) {
      processFile(inputPath, remove);
    } else {
      console.error('Invalid path. Please provide a valid file or directory path.');
      process.exit(1);
    }
  });

program.parse(process.argv);