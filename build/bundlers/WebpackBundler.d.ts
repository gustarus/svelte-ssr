import Bundler from './../models/Bundler';
import Command from '../models/Command';
export declare namespace WebpackBundlerSpace {
    type Config = {};
}
export default class WebpackBundler extends Bundler<WebpackBundlerSpace.Config> {
    get defaults(): any;
    protected get pathToWebpackServerExecutable(): string;
    protected get pathToWebpackExecutable(): string;
    resolveConfig(pathToConfig: string, name: string): any;
    protected resolvePathToSource(pathToConfig: string, name: string, config: any): string;
    protected resolvePathToSourceEntry(pathToConfig: string, name: string, config: any): string;
    protected resolvePathToBuild(pathToConfig: string, name: string, config: any): string;
    protected resolvePathToBuildEntry(pathToConfig: string, name: string, config: any): string;
    protected resolveBundlerCommandServer(pathToConfig: string, portToListen?: number): Command;
    protected resolveBundlerCommandBuild(pathToConfig: string): Command;
}
