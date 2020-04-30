"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const addWebpackProductionHash_1 = __importDefault(require("./addWebpackProductionHash"));
const constants_1 = require("../constants");
const isPathToFileMatches_1 = __importDefault(require("./isPathToFileMatches"));
const argv = yargs_1.default.argv;
/**
 * Merge custom webpack config with default ones.
 * @param source - webpack client options
 * @param options - { production: whether in production mode or not; template: expression for template file }
 */
function createWebpackClientConfig(source, options = {}) {
    const production = typeof options.production !== 'undefined'
        ? options.production : (argv.mode ? argv.mode === 'production' : false);
    const template = options.template || 'index.html';
    return lodash_merge_1.default({
        entry: {
            client: path_1.default.resolve(constants_1.PATH_PROJECT, 'src', 'client.js'),
        },
        target: 'web',
        output: {
            path: path_1.default.resolve(constants_1.PATH_PROJECT, 'build', 'client'),
            filename: addWebpackProductionHash_1.default('[name].js', production),
            sourceMapFilename: addWebpackProductionHash_1.default('[name].map', production),
        },
        devServer: {
            writeToDisk: (pathToFile) => isPathToFileMatches_1.default(pathToFile, template),
            contentBase: path_1.default.join(constants_1.PATH_PROJECT, 'build', 'client'),
            overlay: true,
            compress: true,
        },
    }, source);
}
exports.default = createWebpackClientConfig;
