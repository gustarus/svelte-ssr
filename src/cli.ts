#!/usr/bin/env node

import path from 'path';
import colors from 'colors';
import program from 'commander';
import build from './cli/build';
import development from './cli/development';
import production from './cli/production';
import Package from './models/Package';
import resolvePathToRoot from './helpers/resolvePathToRoot';

const pathToRoot = resolvePathToRoot();
if (!pathToRoot) {
  throw new Error('Unable to resolve path to root: try to reinstall the package');
}

const pathToPackage = path.resolve(pathToRoot, 'package.json');
const that = new Package({ path: pathToPackage });

// display description
program
  .version(that.version)
  .description('Tool to launch server side rendering service');

// bind commands
build(program);
development(program);
production(program);

// listen to unhandled promises
process.on('unhandledRejection' as any, (error: Error) => {
  console.log(error);
  console.log(colors.red(error.message));
});

// parse arguments
program.parse(process.argv);

// display help command
if (!process.argv.slice(2).length) {
  program.help();
}
