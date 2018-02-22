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
eject.addArgument(['--sprite'], {
  action: 'storeTrue',
  help: 'Export only the SVG <symbol> sprite and not every single SVG',
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

const args = parser.parseArgs();

const copyIcons = dir => {
  const activeDir = path.resolve('./', dir);
  const destDir = `${activeDir}/airtame-icons`;
  const srcDir = path.resolve(require.resolve('airtame-icons'), '../');

  if (!fse.existsSync(activeDir)) {
    fse.mkdirSync(activeDir, err => console.log(err));
  }

  fse.mkdirSync(destDir, err => console.log(err));

  if (args.sprite) {
    fse
      .copy(`${srcDir}/airtame-icons-sprite.svg`, `${destDir}/airtame-icons-sprite.svg`)
      .then(() =>
        console.log(
          `SVG sprite copied successfuly into \x1b[34m\x1b[1m${destDir}/airtame-icons-sprite.svg`
        )
      )
      .catch(err => console.log(err));
  } else {
    const files = fse.readdirSync(srcDir);
    const promises = [];
    files.forEach(file => {
      if (file.includes('.svg')) {
        promises.push(fse.copy(`${srcDir}/${file}`, `${destDir}/${file}`));
      }
    });

    Promise.all(promises)
      .then(() => console.log(`SVG files copied successfuly into \x1b[34m\x1b[1m${destDir}\x1b[0m`))
      .catch(err => console.log(err));
  }
};

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
