import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';

const { source, target } = yargs.options({
  source: { type: 'string', demandOption: true },
  target: { type: 'string', demandOption: true },
}).argv;

const pathToSource = path.resolve(source);
const pathToTarget = path.resolve(target);
const pathToRelative = path.relative(path.dirname(pathToTarget), path.dirname(pathToSource) );

const sourceContent = fs.readFileSync(pathToSource).toString();
const targetContent = sourceContent.replace(/require\(["'](.*?)["']\)/g, (match: string, pathToFileSource: string): string => {
  const pathToFileTarget = path.normalize(`${pathToRelative}/${pathToFileSource}`);
  return `require("./${pathToFileTarget}")`;
});

fs.writeFileSync(pathToTarget, targetContent);
