#!/usr/bin/env node
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
const path = __importStar(require("path"));
const colors_1 = __importDefault(require("colors"));
const commander_1 = __importDefault(require("commander"));
const build_1 = __importDefault(require("./cli/build"));
const development_1 = __importDefault(require("./cli/development"));
const production_1 = __importDefault(require("./cli/production"));
const constants_1 = require("./constants");
const Package_1 = __importDefault(require("./models/Package"));
const pathToPackage = path.resolve(constants_1.PATH_ROOT, 'package.json');
const that = new Package_1.default({ path: pathToPackage });
// display description
commander_1.default
    .version(that.version)
    .description('Tool to generate svelte documentation');
// bind commands
build_1.default(commander_1.default);
development_1.default(commander_1.default);
production_1.default(commander_1.default);
// listen to unhandled promises
process.on('unhandledRejection', (error) => {
    console.log(error);
    console.log(colors_1.default.red(error.message));
});
// parse arguments
commander_1.default.parse(process.argv);
// display help command
if (!process.argv.slice(2).length) {
    commander_1.default.help();
}
