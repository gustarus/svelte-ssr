import Component from '../base/Component';
import path from 'path';
import colors from 'colors';
import * as fs from 'fs-extra';
import { ENTRY_CLIENT, ENTRY_SERVER } from '../constants';
import Command from '../models/Command';

export namespace BaseBundlerSpace {
  export type Modes = 'development' | 'production';

  export type Config = {
    mode: Modes;
    pathToProject: string;
    pathToClientConfig?: string;
    pathToServerConfig?: string;
    developmentPortClient?: string;
    developmentPortServer?: string;
  };
}

export default abstract class BaseBundler<C = {}> extends Component<BaseBundlerSpace.Config & C> {

  public mode: BaseBundlerSpace.Modes;

  private _pathToProject: string;

  private _pathToClientConfig: string;

  private _pathToServerConfig: string;

  public developmentPortClient?: string;

  public developmentPortServer?: string;

  private _configClient: any;

  private _configServer: any;

  public get defaults(): any {
    return {
      mode: 'development' as BaseBundlerSpace.Modes,
      developmentPortClient: '8080',
      developmentPortServer: '8081',
    };
  }

  public set pathToProject(value: string) {
    this._pathToProject = value && path.resolve(value);
  }

  public get pathToProject(): string {
    return this._pathToProject;
  }

  public set pathToClientConfig(value: string) {
    const resolved = value && path.resolve(this.pathToProject, value);
    if (this.validatePathToConfig(resolved, ENTRY_CLIENT)) {
      this._pathToClientConfig = resolved;
    }
  }

  public get pathToClientConfig(): string {
    return this._pathToClientConfig;
  }

  public set pathToServerConfig(value: string) {
    const resolved = value && path.resolve(this.pathToProject, value);
    if (this.validatePathToConfig(resolved, ENTRY_SERVER)) {
      this._pathToServerConfig = resolved;
    }
  }

  public get pathToServerConfig(): string {
    return this._pathToServerConfig;
  }

  public get configClient(): any {
    if (!this._configClient) {
      this._configClient = this.resolveConfig(this.pathToClientConfig, ENTRY_CLIENT);
      this.validateConfigObject(this.pathToClientConfig, ENTRY_CLIENT, this._configClient);
    }

    return this._configClient;
  }

  public get configServer(): any {
    if (!this._configServer) {
      this._configServer = this.resolveConfig(this.pathToServerConfig, ENTRY_SERVER);
      this.validateConfigObject(this.pathToClientConfig, ENTRY_SERVER, this._configServer);
    }

    return this._configServer;
  }

  public get pathToClientSource(): string {
    return this.resolvePathToSource(this.pathToClientConfig, ENTRY_CLIENT, this.configClient);
  }

  public get pathToClientSourceScript(): string {
    return this.resolvePathToSourceEntry(this.pathToClientConfig, ENTRY_CLIENT, this.configClient);
  }

  public get pathToClientBuild(): string {
    return this.resolvePathToBuild(this.pathToClientConfig, ENTRY_CLIENT, this.configClient);
  }

  public get pathToClientBuildScript(): string {
    return this.resolvePathToBuildEntry(this.pathToClientConfig, ENTRY_CLIENT, this.configClient);
  }

  public get pathToServerSource(): string {
    return this.resolvePathToSource(this.pathToServerConfig, ENTRY_SERVER, this.configServer);
  }

  public get pathToServerSourceScript(): string {
    return this.resolvePathToSourceEntry(this.pathToServerConfig, ENTRY_SERVER, this.configServer);
  }

  public get pathToServerBuild(): string {
    return this.resolvePathToBuild(this.pathToServerConfig, ENTRY_SERVER, this.configServer);
  }

  public get pathToServerBuildScript(): string {
    return this.resolvePathToBuildEntry(this.pathToServerConfig, ENTRY_SERVER, this.configServer);
  }

  public get bundlerCommandClientStart(): Command {
    return this.resolveBundlerCommandServer(this.pathToClientConfig, this.developmentPortClient);
  }

  public get bundlerCommandClientBuild(): Command {
    return this.resolveBundlerCommandBuild(this.pathToClientConfig);
  }

  public get bundlerCommandServerStart(): Command {
    return this.resolveBundlerCommandServer(this.pathToServerConfig, this.developmentPortServer);
  }

  public get bundlerCommandServerBuild(): Command {
    return this.resolveBundlerCommandBuild(this.pathToServerConfig);
  }

  protected configure(custom: Partial<BaseBundlerSpace.Config & C> = {}): this {
    // we have to assign path to root firstly
    const { pathToProject, ...rest } = custom;
    if (pathToProject) {
      this.pathToProject = pathToProject;
    }

    return super.configure(rest);
  }

  protected abstract resolveConfig(pathToConfig: string, name: string): any;

  protected abstract resolvePathToSource(pathToConfig: string, name: string, config: any): string;

  protected abstract resolvePathToSourceEntry(pathToConfig: string, name: string, config: any): string;

  protected abstract resolvePathToBuild(pathToConfig: string, name: string, config: any): string;

  protected abstract resolvePathToBuildEntry(pathToConfig: string, name: string, config: any): string;

  protected abstract resolveBundlerCommandServer(pathToConfig: string, portToListen?: string): Command;

  protected abstract resolveBundlerCommandBuild(pathToConfig: string): Command;

  protected validatePathToConfig(pathToConfig: string, name: string): boolean {
    if (!pathToConfig) {
      throw new Error(`Unable to resolve path to '${name}' configuration`);
    }

    if (!fs.existsSync(pathToConfig)) {
      throw new Error(`Unable to detect file for '${name}' configuration: looking for ${colors.italic(pathToConfig)}`);
    }

    return true;
  }

  protected validateConfigObject(pathToConfig: string, name: string, config: any) {
    if (!config.entry || !config.entry[name]) {
      throw new Error(`Invalid configuration passed: \'entry.${name}\' should be not empty inside server config '${pathToConfig}'`);
    }

    if (!config.output || !config.output.path) {
      throw new Error(`Invalid configuration passed: \'output.path\' should be not empty inside server config '${pathToConfig}'`);
    }

    if (!config.output || !config.output.filename) {
      throw new Error(`Invalid configuration passed: \'output.filename\' should be not empty inside server config '${pathToConfig}'`);
    }

    return true;
  }
};
