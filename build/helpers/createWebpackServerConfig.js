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
const yargs_1 = __importDefault(require("yargs"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const constants_1 = require("../constants");
const isPathToFileMatches_1 = __importDefault(require("./isPathToFileMatches"));
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
    return lodash_merge_1.default({
        entry: {
            server: path.resolve(constants_1.PATH_PROJECT, 'src', 'server.js')
        },
        target: 'node',
        node: {
            __dirname: true,
            __filename: true,
        },
        output: {
            path: path.resolve(constants_1.PATH_PROJECT, 'build', 'server'),
            filename: '[name].js'
        },
        optimization: {
            providedExports: true,
            sideEffects: true,
            minimize: false
        },
        devServer: {
            writeToDisk: (pathToFile) => isPathToFileMatches_1.default(pathToFile, 'server.js'),
            contentBase: path.join(constants_1.PATH_PROJECT, 'build', 'server'),
            overlay: true,
            compress: true,
        }
    }, source);
}
exports.default = createWebpackServerConfig;
