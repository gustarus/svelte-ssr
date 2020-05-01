"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../base/Component"));
const path_1 = __importDefault(require("path"));
const colors_1 = __importDefault(require("colors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const constants_1 = require("../constants");
class Bundler extends Component_1.default {
    get defaults() {
        return {
            mode: 'development',
            base: '/',
        };
    }
    set pathToProject(value) {
        this._pathToProject = value && path_1.default.resolve(value);
    }
    get pathToProject() {
        return this._pathToProject;
    }
    set pathToClientConfig(value) {
        const resolved = value && path_1.default.resolve(this.pathToProject, value);
        if (this.validatePathToConfig(resolved, constants_1.ENTRY_CLIENT)) {
            this._pathToClientConfig = resolved;
        }
    }
    get pathToClientConfig() {
        return this._pathToClientConfig;
    }
    set pathToServerConfig(value) {
        const resolved = value && path_1.default.resolve(this.pathToProject, value);
        if (this.validatePathToConfig(resolved, constants_1.ENTRY_SERVER)) {
            this._pathToServerConfig = resolved;
        }
    }
    get pathToServerConfig() {
        return this._pathToServerConfig;
    }
    get configClient() {
        if (!this._configClient) {
            this._configClient = this.resolveConfig(this.pathToClientConfig, constants_1.ENTRY_CLIENT);
            this.validateConfigObject(this.pathToClientConfig, constants_1.ENTRY_CLIENT, this._configClient);
        }
        return this._configClient;
    }
    get configServer() {
        if (!this._configServer) {
            this._configServer = this.resolveConfig(this.pathToServerConfig, constants_1.ENTRY_SERVER);
            this.validateConfigObject(this.pathToClientConfig, constants_1.ENTRY_SERVER, this._configServer);
        }
        return this._configServer;
    }
    get pathToClientSource() {
        return this.resolvePathToSource(this.pathToClientConfig, constants_1.ENTRY_CLIENT, this.configClient);
    }
    get pathToClientSourceScript() {
        return this.resolvePathToSourceEntry(this.pathToClientConfig, constants_1.ENTRY_CLIENT, this.configClient);
    }
    get pathToClientBuild() {
        return this.resolvePathToBuild(this.pathToClientConfig, constants_1.ENTRY_CLIENT, this.configClient);
    }
    get pathToClientBuildScript() {
        return this.resolvePathToBuildEntry(this.pathToClientConfig, constants_1.ENTRY_CLIENT, this.configClient);
    }
    get pathToServerSource() {
        return this.resolvePathToSource(this.pathToServerConfig, constants_1.ENTRY_SERVER, this.configServer);
    }
    get pathToServerSourceScript() {
        return this.resolvePathToSourceEntry(this.pathToServerConfig, constants_1.ENTRY_SERVER, this.configServer);
    }
    get pathToServerBuild() {
        return this.resolvePathToBuild(this.pathToServerConfig, constants_1.ENTRY_SERVER, this.configServer);
    }
    get pathToServerBuildScript() {
        return this.resolvePathToBuildEntry(this.pathToServerConfig, constants_1.ENTRY_SERVER, this.configServer);
    }
    get bundlerCommandClientStart() {
        return this.resolveBundlerCommandServer(this.pathToClientConfig, this.developmentPortClient);
    }
    get bundlerCommandClientBuild() {
        return this.resolveBundlerCommandBuild(this.pathToClientConfig);
    }
    get bundlerCommandServerStart() {
        return this.resolveBundlerCommandServer(this.pathToServerConfig, this.developmentPortServer);
    }
    get bundlerCommandServerBuild() {
        return this.resolveBundlerCommandBuild(this.pathToServerConfig);
    }
    configure(custom = {}) {
        // we have to assign path to root firstly
        const { pathToProject } = custom, rest = __rest(custom, ["pathToProject"]);
        if (pathToProject) {
            this.pathToProject = pathToProject;
        }
        return super.configure(rest);
    }
    validatePathToConfig(pathToConfig, name) {
        if (!pathToConfig) {
            throw new Error(`Unable to resolve path to '${name}' configuration`);
        }
        if (!fs_extra_1.default.existsSync(pathToConfig)) {
            throw new Error(`Unable to detect file for '${name}' configuration: looking for ${colors_1.default.italic(pathToConfig)}`);
        }
        return true;
    }
    validateConfigObject(pathToConfig, name, config) {
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
}
exports.default = Bundler;
;
