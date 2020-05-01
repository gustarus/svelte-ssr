"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const colors_1 = __importDefault(require("colors"));
const constants_1 = require("../constants");
const concurrently_1 = __importDefault(require("concurrently"));
const displayCommandGreetings_1 = __importDefault(require("../helpers/displayCommandGreetings"));
const displayCommandStep_1 = __importDefault(require("../helpers/displayCommandStep"));
const resolveCommandConfigurations_1 = __importDefault(require("../helpers/resolveCommandConfigurations"));
const resolveCommandPorts_1 = __importDefault(require("../helpers/resolveCommandPorts"));
const resolveCommandBundler_1 = __importDefault(require("../helpers/resolveCommandBundler"));
const displayCommandEnvironment_1 = __importDefault(require("../helpers/displayCommandEnvironment"));
const Server_1 = __importDefault(require("../models/Server"));
const resolveCommandBase_1 = __importDefault(require("../helpers/resolveCommandBase"));
function development(program) {
    program
        .command('development')
        .description('Launch client and server development servers and node server to serve server side rendering')
        .requiredOption(constants_1.DEFAULT_OPTIONS.bundler.flag, constants_1.DEFAULT_OPTIONS.bundler.description, constants_1.DEFAULT_OPTIONS.bundler.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.base.flag, constants_1.DEFAULT_OPTIONS.base.description, constants_1.DEFAULT_OPTIONS.base.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.nodePort.flag, constants_1.DEFAULT_OPTIONS.nodePort.description, constants_1.DEFAULT_OPTIONS.nodePort.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.clientConfig.flag, constants_1.DEFAULT_OPTIONS.clientConfig.description, constants_1.DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.clientPort.flag, constants_1.DEFAULT_OPTIONS.clientPort.description, constants_1.DEFAULT_OPTIONS.clientPort.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.serverConfig.flag, constants_1.DEFAULT_OPTIONS.serverConfig.description, constants_1.DEFAULT_OPTIONS.serverConfig.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.serverPort.flag, constants_1.DEFAULT_OPTIONS.serverPort.description, constants_1.DEFAULT_OPTIONS.serverPort.defaultValue)
        .action((cmd) => __awaiter(this, void 0, void 0, function* () {
        displayCommandGreetings_1.default(cmd);
        const base = yield resolveCommandBase_1.default(cmd);
        const ports = yield resolveCommandPorts_1.default(cmd);
        const Bundler = yield resolveCommandBundler_1.default(cmd);
        const configurations = yield resolveCommandConfigurations_1.default(cmd);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create bundler instance with resolved options...'));
        const bundler = new Bundler({
            mode: 'development',
            base: base,
            pathToProject: constants_1.PATH_PROJECT,
            pathToClientConfig: configurations.client,
            pathToServerConfig: configurations.server,
            developmentPortClient: ports.client,
            developmentPortServer: ports.server,
        });
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create server instance with resolved options...'));
        const server = new Server_1.default({
            bundler,
            port: ports.node,
            base: base,
            live: true,
            pathToProject: constants_1.PATH_PROJECT,
        });
        // display command environment options
        displayCommandEnvironment_1.default(cmd, server, bundler);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create empty server file for nodemon watcher...'));
        displayCommandStep_1.default(cmd, `\tFile will be created inside ${colors_1.default.italic(bundler.pathToServerBuildScript)}`);
        const pathToTargetServerDirectory = path_1.default.dirname(bundler.pathToServerBuildScript);
        fs_extra_1.default.mkdirSync(pathToTargetServerDirectory, { recursive: true });
        fs_extra_1.default.writeFileSync(bundler.pathToServerBuildScript, '');
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Concurrently start node js server, server webpack and client webpack...'));
        return concurrently_1.default([
            { command: server.commandStart.compile(), name: 'node' },
            { command: bundler.bundlerCommandServerStart.compile(), name: 'server' },
            { command: bundler.bundlerCommandClientStart.compile(), name: 'client' },
        ], {
            killOthers: ['failure', 'success'],
            restartTries: 3,
        });
    }));
}
exports.default = development;
;
