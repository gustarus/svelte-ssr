"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const { source, target } = yargs_1.default.options({
    source: { type: 'string', demandOption: true },
    target: { type: 'string', demandOption: true },
}).argv;
const pathToSource = path.resolve(source);
const pathToTarget = path.resolve(target);
const pathToRelative = path.relative(path.dirname(pathToTarget), path.dirname(pathToSource));
const sourceContent = fs.readFileSync(pathToSource).toString();
const targetContent = sourceContent.replace(/require\(["'](.*?)["']\)/g, (match, pathToFileSource) => {
    const pathToFileTarget = path.normalize(`${pathToRelative}/${pathToFileSource}`);
    return `require("./${pathToFileTarget}")`;
});
fs.writeFileSync(pathToTarget, targetContent);
