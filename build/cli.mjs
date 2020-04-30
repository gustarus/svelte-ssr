#!/usr/bin/env node
import * as path from 'path';
import colors from 'colors';
import program from 'commander';
import build from './cli/build';
import development from './cli/development';
import production from './cli/production';
import { PATH_ROOT } from './constants';
import Package from './models/Package';
const pathToPackage = path.resolve(PATH_ROOT, 'package.json');
const that = new Package({ path: pathToPackage });
// display description
program
    .version(that.version)
    .description('Tool to generate svelte documentation');
// bind commands
build(program);
development(program);
production(program);
// listen to unhandled promises
process.on('unhandledRejection', (error) => {
    console.log(error);
    console.log(colors.red(error.message));
});
// parse arguments
program.parse(process.argv);
// display help command
if (!process.argv.slice(2).length) {
    program.help();
}
