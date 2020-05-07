"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const addWebpackProductionHash_1 = __importDefault(require("./addWebpackProductionHash"));
const isPathToFileMatches_1 = __importDefault(require("../../../helpers/isPathToFileMatches"));
const resolveDesiredBase_1 = __importDefault(require("../../../helpers/resolveDesiredBase"));
const resolvePathToProject_1 = __importDefault(require("../../../helpers/resolvePathToProject"));
const argv = yargs_1.default.argv;
const pathToProject = resolvePathToProject_1.default();
if (!pathToProject) {
    throw new Error('Unable to resolve path to project: does package.json exist in the project folder?');
}
/**
 * Merge custom webpack config with default ones.
 * @param source - webpack client options
 * @param options - { production: whether in production mode or not; template: expression for template file }
 */
function createWebpackClientConfig(source, options = {}) {
    const production = typeof options.production !== 'undefined'
        ? options.production : (argv.mode ? argv.mode === 'production' : false);
    const template = options.template || 'index.html';
    const base = resolveDesiredBase_1.default();
    return lodash_merge_1.default({
        entry: {
            client: path_1.default.resolve(pathToProject, 'src', 'client.js'),
        },
        target: 'web',
        node: {
            fs: 'empty',
            path: 'empty',
        },
        output: {
            path: path_1.default.resolve(pathToProject, 'build', 'client'),
            filename: addWebpackProductionHash_1.default('[name].js', production),
            sourceMapFilename: addWebpackProductionHash_1.default('[name].map', production),
        },
        devServer: {
            writeToDisk: (pathToFile) => isPathToFileMatches_1.default(pathToFile, template),
            contentBase: path_1.default.join(pathToProject, 'build', 'client'),
            overlay: true,
            compress: true,
            publicPath: base,
            historyApiFallback: {
                index: base,
            },
        },
    }, source);
}
exports.default = createWebpackClientConfig;
