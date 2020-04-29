"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const displayCommandStep_1 = __importDefault(require("./displayCommandStep"));
function displayCommandEnvironment(cmd, server, bundler) {
    displayCommandStep_1.default(cmd, colors_1.default.blue('The tool will be started with the following options'));
    displayCommandStep_1.default(cmd, `\tBundler mode: ${colors_1.default.bold(bundler.mode)}`);
    if (server.port) {
        displayCommandStep_1.default(cmd, `\tNode listen to port: ${colors_1.default.bold(server.port)}`);
    }
    if (bundler.developmentPortClient) {
        displayCommandStep_1.default(cmd, `\tClient bundler listen to port: ${colors_1.default.bold(bundler.developmentPortClient)}`);
    }
    if (bundler.developmentPortServer) {
        displayCommandStep_1.default(cmd, `\tServer bundler listen to port: ${colors_1.default.bold(bundler.developmentPortServer)}`);
    }
    displayCommandStep_1.default(cmd, `\tPath to project to build: ${colors_1.default.italic(bundler.pathToProject)}`);
    displayCommandStep_1.default(cmd, `\tPath to bundler client config: ${colors_1.default.italic(bundler.pathToClientConfig)}`);
    displayCommandStep_1.default(cmd, `\tPath to bundler server config: ${colors_1.default.italic(bundler.pathToServerConfig)}`);
}
exports.default = displayCommandEnvironment;
