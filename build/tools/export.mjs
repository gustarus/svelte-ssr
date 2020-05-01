import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
const { source, target } = yargs.options({
    source: { type: 'string', demandOption: true },
    target: { type: 'string', demandOption: true },
}).argv;
const pathToSource = path.resolve(source);
const pathToTarget = path.resolve(target);
const pathToRelative = path.relative(path.dirname(pathToTarget), path.dirname(pathToSource));
const sourceContent = fs.readFileSync(pathToSource).toString();
let targetContent;
if (pathToSource.match(/\.mjs/)) {
    targetContent = sourceContent.replace(/from\s+["'](.*?)["']/g, (match, pathToFileSource) => {
        const pathToFileTarget = path.normalize(`${pathToRelative}/${pathToFileSource}`);
        return `from "./${pathToFileTarget}"`;
    });
}
else if (pathToSource.match(/\.js/)) {
    targetContent = sourceContent.replace(/require\(["'](.*?)["']\)/g, (match, pathToFileSource) => {
        const pathToFileTarget = path.normalize(`${pathToRelative}/${pathToFileSource}`);
        return `require("./${pathToFileTarget}")`;
    });
}
else {
    throw new Error(`Unsupported file extension passed as path to source: ${pathToSource}`);
}
fs.writeFileSync(pathToTarget, targetContent);
