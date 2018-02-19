#!/usr/bin/env node

/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');
const ArgumentParser = require('argparse').ArgumentParser;
const util = require('util');
require('util.promisify').shim();
const exec = util.promisify(require('child_process').exec);
const ncp = require('ncp').ncp;

const projectPackage = require('./package.json');
const SCRIPT_VERSION = projectPackage.version;

const parser = new ArgumentParser({
  version: SCRIPT_VERSION,
  addHelp: true,
  description: 'CLI tool to export Airtame Icons into your project',
});

const subparser = parser.addSubparsers({ title: 'commands', dest: 'command' });

const eject = subparser.addParser('eject', {
  addHelp: true,
  description: 'Copies the SVG files into a specified project directory',
});
eject.addArgument('directory', {
  action: 'store',
  help: 'The directory to copy the SVGs into',
});

const update = subparser.addParser('update', {
  addHelp: true,
  description: 'Updates your icons through npm',
});
update.addArgument(['--yarn'], {
  action: 'storeTrue',
  help: 'Use yarn for the update instead of npm',
});
update.addArgument('directory', {
  action: 'store',
  help: 'The directory to copy the SVGs into',
});

const copyIcons = dir => {
  const activeDir = path.resolve('./', dir);
  const destDir = `${activeDir}/airtame-icons`;
  const srcDir = path.resolve(require.resolve('airtame-icons'), '../');

  if (!fse.existsSync(activeDir)) {
    fse.mkdirSync(activeDir, err => console.log(err));
  }

  fse.mkdir(destDir, err => {
    if (err) {
      return console.log(err);
    }
    console.log('copying');
    ncp(
      srcDir,
      destDir,
      {
        filter: /^(.(?!.*\.js$|.*\.json|.*\.md))*$/,
      },
      err => {
        if (err) {
          return console.log(err);
        }

        return console.log(`SVG files copied successfuly into ${destDir}`);
      }
    );
  });
};

const args = parser.parseArgs();

if (args.command === 'update') {
  let command = 'npm install --save airtame-icons';
  if (args.yarn) {
    command = 'yarn add airtame-icons';
  }

  exec(command)
    .then(() => copyIcons(args.directory))
    .catch(err => console.log(`ERROR >>> ${err}`));
} else if (args.command === 'eject') {
  copyIcons(args.directory);
}
