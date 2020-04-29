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
const BaseBundler_1 = __importDefault(require("./BaseBundler"));
const createCommand_1 = __importDefault(require("../helpers/createCommand"));
class WebpackBundler extends BaseBundler_1.default {
    get defaults() {
        return {
            mode: 'development',
            pathToProject: '',
            pathToClientConfig: 'webpack.config.client.js',
            pathToServerConfig: 'webpack.config.server.js',
            serverPortClient: '8080',
            serverPortServer: '8081',
        };
    }
    get pathToWebpackServerExecutable() {
        return path.resolve(this.pathToProject, 'node_modules', 'webpack-dev-server', 'bin', 'webpack-dev-server.js');
    }
    get pathToWebpackExecutable() {
        return path.resolve(this.pathToProject, 'node_modules', 'webpack', 'bin', 'webpack.js');
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
        return path.basename(config.entry[name]);
    }
    resolvePathToSourceEntry(pathToConfig, name, config) {
        return config.entry[name];
    }
    resolvePathToBuild(pathToConfig, name, config) {
        return path.resolve(this.pathToProject, config.output.path);
    }
    resolvePathToBuildEntry(pathToConfig, name, config) {
        // resolve path to target file
        const pathToFileTemplate = path.resolve(this.pathToProject, config.output.path, config.output.filename);
        // validate path template to the file
        if (pathToFileTemplate.indexOf('[hash]') !== -1 || pathToFileTemplate.indexOf('[contenthash]') !== -1) {
            throw new Error(`Please, do not use '[hash]' or '[contenthash]' inside 'output.filename' property of the webpack configuration ('${config.output.filename}') because it is not possible to start node js server for file with hash in the name: only '[name]' and '[ext]' are allowed.`);
        }
        return pathToFileTemplate.replace('[name]', name).replace('[ext]', 'js');
    }
    resolveBundlerCommandServer(pathToConfig, portToListen) {
        const options = { mode: this.mode, config: pathToConfig, port: portToListen };
        return createCommand_1.default(['node', this.pathToWebpackServerExecutable, options]);
    }
    resolveBundlerCommandBuild(pathToConfig) {
        const options = { mode: this.mode, config: pathToConfig };
        return createCommand_1.default(['node', this.pathToWebpackExecutable, options]);
    }
}
exports.default = WebpackBundler;
;
