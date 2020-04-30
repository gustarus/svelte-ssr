import path from 'path';
import BaseBundler from './BaseBundler';
import createCommand from '../helpers/createCommand';
export default class WebpackBundler extends BaseBundler {
    get defaults() {
        return Object.assign(Object.assign({}, super.defaults), { pathToClientConfig: 'webpack.config.client.js', pathToServerConfig: 'webpack.config.server.js' });
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
        return createCommand(['node', this.pathToWebpackServerExecutable, options]);
    }
    resolveBundlerCommandBuild(pathToConfig) {
        const options = { mode: this.mode, config: pathToConfig };
        return createCommand(['node', this.pathToWebpackExecutable, options]);
    }
}
;
