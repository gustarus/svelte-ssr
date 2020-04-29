import * as path from 'path';
import BaseBundler, { BaseBundlerSpace } from './BaseBundler';
import Command from '../models/Command';
import createCommand from '../helpers/createCommand';

export namespace WebpackBundlerSpace {
  export type Config = {};
}

export default class WebpackBundler extends BaseBundler<WebpackBundlerSpace.Config> {

  public get defaults(): any {
    return {
      ...super.defaults,
      pathToClientConfig: 'webpack.config.client.js',
      pathToServerConfig: 'webpack.config.server.js',
    };
  }

  protected get pathToWebpackServerExecutable() {
    return path.resolve(this.pathToProject, 'node_modules', 'webpack-dev-server', 'bin', 'webpack-dev-server.js');
  }

  protected get pathToWebpackExecutable() {
    return path.resolve(this.pathToProject, 'node_modules', 'webpack', 'bin', 'webpack.js');
  }

  public resolveConfig(pathToConfig: string, name: string) {
    if (!this.pathToClientConfig) {
      throw new Error(`Empty pass passed as 'pathToConfig' argument for '${name}' entry`);
    }

    const result = require(pathToConfig);
    const module = result.__esModule ? result.default : result;
    return typeof module === 'function' ? module({}, { mode: this.mode }) : module;
  }

  protected resolvePathToSource(pathToConfig: string, name: string, config: any): string {
    // TODO Implement better support.
    return path.basename(config.entry[name]);
  }

  protected resolvePathToSourceEntry(pathToConfig: string, name: string, config: any): string {
    return config.entry[name];
  }

  protected resolvePathToBuild(pathToConfig: string, name: string, config: any): string {
    return path.resolve(this.pathToProject, config.output.path);
  }

  protected resolvePathToBuildEntry(pathToConfig: string, name: string, config: any): string {
    // resolve path to target file
    const pathToFileTemplate = path.resolve(this.pathToProject, config.output.path, config.output.filename);

    // validate path template to the file
    if (pathToFileTemplate.indexOf('[hash]') !== -1 || pathToFileTemplate.indexOf('[contenthash]') !== -1) {
      throw new Error(`Please, do not use '[hash]' or '[contenthash]' inside 'output.filename' property of the webpack configuration ('${config.output.filename}') because it is not possible to start node js server for file with hash in the name: only '[name]' and '[ext]' are allowed.`);
    }

    return pathToFileTemplate.replace('[name]', name).replace('[ext]', 'js');
  }

  protected resolveBundlerCommandServer(pathToConfig: string, portToListen?: string): Command {
    const options = { mode: this.mode, config: pathToConfig, port: portToListen };
    return createCommand(['node', this.pathToWebpackServerExecutable, options]);
  }

  protected resolveBundlerCommandBuild(pathToConfig: string): Command {
    const options = { mode: this.mode, config: pathToConfig };
    return createCommand(['node', this.pathToWebpackExecutable, options]);
  }
};
