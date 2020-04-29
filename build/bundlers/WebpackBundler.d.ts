import BaseBundler, { BaseBundlerSpace } from './BaseBundler';
import Command from '../models/Command';
export declare namespace WebpackBundlerSpace {
    type Config = {};
}
export default class WebpackBundler extends BaseBundler<WebpackBundlerSpace.Config> {
    get defaults(): {
        mode: BaseBundlerSpace.Modes;
        pathToProject: string;
        pathToClientConfig: string;
        pathToServerConfig: string;
        serverPortClient: string;
        serverPortServer: string;
    };
    protected get pathToWebpackServerExecutable(): string;
    protected get pathToWebpackExecutable(): string;
    resolveConfig(pathToConfig: string, name: string): any;
    protected resolvePathToSource(pathToConfig: string, name: string, config: any): string;
    protected resolvePathToSourceEntry(pathToConfig: string, name: string, config: any): string;
    protected resolvePathToBuild(pathToConfig: string, name: string, config: any): string;
    protected resolvePathToBuildEntry(pathToConfig: string, name: string, config: any): string;
    protected resolveBundlerCommandServer(pathToConfig: string, portToListen?: string): Command;
    protected resolveBundlerCommandBuild(pathToConfig: string): Command;
}
