"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const Component_1 = __importDefault(require("../base/Component"));
const createCommand_1 = __importDefault(require("../helpers/createCommand"));
class Server extends Component_1.default {
    get defaults() {
        return {
            live: false,
        };
    }
    get commandStart() {
        // resolve command entry point based on live flag
        const entry = this.live
            ? `node ${path_1.default.resolve(this.pathToProject, 'node_modules', 'nodemon', 'bin', 'nodemon.js')}` : 'node';
        // resolve entry point options based on environment options
        const watch = this.live ? this.bundler.pathToServerBuildScript : undefined;
        const staticProxyPort = this.bundler.mode === 'development'
            ? this.bundler.developmentPortClient : undefined;
        const staticPathToDirectory = this.bundler.pathToClientBuild;
        // create command to start the server
        return createCommand_1.default([entry, this.bundler.pathToServerBuildScript, {
                port: this.port,
                base: this.base,
                watch,
                staticProxyPort,
                staticPathToDirectory,
            }]);
    }
}
exports.default = Server;
