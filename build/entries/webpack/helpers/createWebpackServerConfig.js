"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const constants_1 = require("../../../constants");
const isPathToFileMatches_1 = __importDefault(require("../../../helpers/isPathToFileMatches"));
const resolveDesiredBase_1 = __importDefault(require("../../../helpers/resolveDesiredBase"));
const argv = yargs_1.default.argv;
/**
 * Merge custom webpack config with default ones.
 * @param source - webpack client options
 * @param options - { production: whether in production mode or not; template: expression for template file }
 */
function createWebpackServerConfig(source, options = {}) {
    // eslint-disable-next-line
    // @ts-ignore
    const production = typeof options.production !== 'undefined'
        ? options.production : (argv.mode ? argv.mode === 'production' : false);
    const base = resolveDesiredBase_1.default();
    return lodash_merge_1.default({
        entry: {
            server: path_1.default.resolve(constants_1.PATH_PROJECT, 'src', 'server.js')
        },
        target: 'node',
        node: {
            __dirname: true,
            __filename: true,
        },
        output: {
            path: path_1.default.resolve(constants_1.PATH_PROJECT, 'build', 'server'),
            filename: '[name].js'
        },
        optimization: {
            minimize: false
        },
        devServer: {
            writeToDisk: (pathToFile) => isPathToFileMatches_1.default(pathToFile, 'server.js'),
            contentBase: path_1.default.join(constants_1.PATH_PROJECT, 'build', 'server'),
            overlay: true,
            compress: true,
            publicPath: base,
            historyApiFallback: {
                index: base,
            },
        }
    }, source);
}
exports.default = createWebpackServerConfig;
