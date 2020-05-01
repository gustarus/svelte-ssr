"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const Bundler_1 = __importDefault(require("./../models/Bundler"));
const createCommand_1 = __importDefault(require("../helpers/createCommand"));
class WebpackBundler extends Bundler_1.default {
    get defaults() {
        return Object.assign(Object.assign({}, super.defaults), { pathToClientConfig: 'webpack.config.client.js', pathToServerConfig: 'webpack.config.server.js' });
    }
    get pathToWebpackServerExecutable() {
        return path_1.default.resolve(this.pathToProject, 'node_modules', 'webpack-dev-server', 'bin', 'webpack-dev-server.js');
    }
    get pathToWebpackExecutable() {
        return path_1.default.resolve(this.pathToProject, 'node_modules', 'webpack', 'bin', 'webpack.js');
    }
    resolveConfig(pathToConfig, name) {
        if (!this.pathToClientConfig) {
            throw new Error(`Empty pass passed as 'pathToConfig' argument for '${name}' entry`);
        }
        const result = require(pathToConfig);
        const module = result.__esModule ? result.default : result;
        return typeof module === 'function' ? module({}, { mode: this.mode }) : module;
    }
    resolvePathToSource(pathToConfig, name, config) {
        // TODO Implement better support.
        return path_1.default.basename(config.entry[name]);
    }
    resolvePathToSourceEntry(pathToConfig, name, config) {
        return config.entry[name];
    }
    resolvePathToBuild(pathToConfig, name, config) {
        return path_1.default.resolve(this.pathToProject, config.output.path);
    }
    resolvePathToBuildEntry(pathToConfig, name, config) {
        // resolve path to target file
        const pathToFileTemplate = path_1.default.resolve(this.pathToProject, config.output.path, config.output.filename);
        // validate path template to the file
        if (pathToFileTemplate.indexOf('[hash]') !== -1 || pathToFileTemplate.indexOf('[contenthash]') !== -1) {
            throw new Error(`Please, do not use '[hash]' or '[contenthash]' inside 'output.filename' property of the webpack configuration ('${config.output.filename}') because it is not possible to start node js server for file with hash in the name: only '[name]' and '[ext]' are allowed.`);
        }
        return pathToFileTemplate.replace('[name]', name).replace('[ext]', 'js');
    }
    resolveBundlerCommandServer(pathToConfig, portToListen) {
        const options = { mode: this.mode, config: pathToConfig, port: portToListen, base: this.base };
        return createCommand_1.default(['node', this.pathToWebpackServerExecutable, options]);
    }
    resolveBundlerCommandBuild(pathToConfig) {
        const options = { mode: this.mode, config: pathToConfig, base: this.base };
        return createCommand_1.default(['node', this.pathToWebpackExecutable, options]);
    }
}
exports.default = WebpackBundler;
;
