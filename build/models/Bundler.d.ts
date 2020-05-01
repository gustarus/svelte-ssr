import Component from '../base/Component';
import Command from '../models/Command';
export declare namespace BundlerSpace {
    type Modes = 'development' | 'production';
    type Config = {
        mode?: Modes;
        base?: string;
        pathToProject: string;
        pathToClientConfig?: string;
        pathToServerConfig?: string;
        developmentPortClient?: number;
        developmentPortServer?: number;
    };
}
export default abstract class Bundler<C = {}> extends Component<BundlerSpace.Config & C> {
    mode: BundlerSpace.Modes;
    base: string;
    private _pathToProject;
    private _pathToClientConfig;
    private _pathToServerConfig;
    developmentPortClient?: number;
    developmentPortServer?: number;
    private _configClient;
    private _configServer;
    get defaults(): any;
    set pathToProject(value: string);
    get pathToProject(): string;
    set pathToClientConfig(value: string);
    get pathToClientConfig(): string;
    set pathToServerConfig(value: string);
    get pathToServerConfig(): string;
    get configClient(): any;
    get configServer(): any;
    get pathToClientSource(): string;
    get pathToClientSourceScript(): string;
    get pathToClientBuild(): string;
    get pathToClientBuildScript(): string;
    get pathToServerSource(): string;
    get pathToServerSourceScript(): string;
    get pathToServerBuild(): string;
    get pathToServerBuildScript(): string;
    get bundlerCommandClientStart(): Command;
    get bundlerCommandClientBuild(): Command;
    get bundlerCommandServerStart(): Command;
    get bundlerCommandServerBuild(): Command;
    protected configure(custom?: Partial<BundlerSpace.Config & C>): this;
    protected abstract resolveConfig(pathToConfig: string, name: string): any;
    protected abstract resolvePathToSource(pathToConfig: string, name: string, config: any): string;
    protected abstract resolvePathToSourceEntry(pathToConfig: string, name: string, config: any): string;
    protected abstract resolvePathToBuild(pathToConfig: string, name: string, config: any): string;
    protected abstract resolvePathToBuildEntry(pathToConfig: string, name: string, config: any): string;
    protected abstract resolveBundlerCommandServer(pathToConfig: string, portToListen?: number): Command;
    protected abstract resolveBundlerCommandBuild(pathToConfig: string): Command;
    protected validatePathToConfig(pathToConfig: string, name: string): boolean;
    protected validateConfigObject(pathToConfig: string, name: string, config: any): boolean;
}
