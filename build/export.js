"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const { source, target } = yargs_1.default.options({
    source: { type: 'string', demandOption: true },
    target: { type: 'string', demandOption: true },
}).argv;
const pathToSource = path_1.default.resolve(source);
const pathToTarget = path_1.default.resolve(target);
const pathToRelative = path_1.default.relative(path_1.default.dirname(pathToTarget), path_1.default.dirname(pathToSource));
const sourceContent = fs_1.default.readFileSync(pathToSource).toString();
let targetContent;
if (pathToSource.match(/\.mjs/)) {
    targetContent = sourceContent.replace(/from\s+["'](.*?)["']/g, (match, pathToFileSource) => {
        const pathToFileTarget = path_1.default.normalize(`${pathToRelative}/${pathToFileSource}`);
        return `from "./${pathToFileTarget}"`;
    });
}
else if (pathToSource.match(/\.js/)) {
    targetContent = sourceContent.replace(/require\(["'](.*?)["']\)/g, (match, pathToFileSource) => {
        const pathToFileTarget = path_1.default.normalize(`${pathToRelative}/${pathToFileSource}`);
        return `require("./${pathToFileTarget}")`;
    });
}
else {
    throw new Error(`Unsupported file extension passed as path to source: ${pathToSource}`);
}
fs_1.default.writeFileSync(pathToTarget, targetContent);
