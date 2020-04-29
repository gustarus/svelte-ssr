"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const colors_1 = __importDefault(require("colors"));
const constants_1 = require("../constants");
const concurrently_1 = __importDefault(require("concurrently"));
const createCommand_1 = __importDefault(require("../helpers/createCommand"));
const displayCommandGreetings_1 = __importDefault(require("../helpers/displayCommandGreetings"));
const displayCommandStep_1 = __importDefault(require("../helpers/displayCommandStep"));
const resolveCommandConfigurations_1 = __importDefault(require("../helpers/resolveCommandConfigurations"));
const resolveCommandPorts_1 = __importDefault(require("../helpers/resolveCommandPorts"));
const resolveCommandBundler_1 = __importDefault(require("../helpers/resolveCommandBundler"));
const displayCommandEnvironment_1 = __importDefault(require("../helpers/displayCommandEnvironment"));
const Server_1 = __importDefault(require("../models/Server"));
function development(program) {
    program
        .command('development')
        .description('Launch client and server development servers and node server to serve server side rendering')
        .requiredOption(constants_1.DEFAULT_OPTIONS.bundler.flag, constants_1.DEFAULT_OPTIONS.bundler.description, constants_1.DEFAULT_OPTIONS.bundler.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.nodePort.flag, constants_1.DEFAULT_OPTIONS.nodePort.description, constants_1.DEFAULT_OPTIONS.nodePort.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.clientConfig.flag, constants_1.DEFAULT_OPTIONS.clientConfig.description, constants_1.DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.clientPort.flag, constants_1.DEFAULT_OPTIONS.clientPort.description, constants_1.DEFAULT_OPTIONS.clientPort.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.serverConfig.flag, constants_1.DEFAULT_OPTIONS.serverConfig.description, constants_1.DEFAULT_OPTIONS.serverConfig.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.serverPort.flag, constants_1.DEFAULT_OPTIONS.serverPort.description, constants_1.DEFAULT_OPTIONS.serverPort.defaultValue)
        .action(async (cmd) => {
        displayCommandGreetings_1.default(cmd);
        const ports = await resolveCommandPorts_1.default(cmd);
        const Bundler = await resolveCommandBundler_1.default(cmd);
        const configurations = await resolveCommandConfigurations_1.default(cmd);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create server instance with resolved options...'));
        const server = new Server_1.default({
            port: ports.node,
        });
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create bundler instance with resolved options...'));
        const bundler = new Bundler({
            mode: 'development',
            pathToProject: constants_1.PATH_PROJECT,
            pathToClientConfig: configurations.client,
            pathToServerConfig: configurations.server,
            developmentPortClient: ports.client,
            developmentPortServer: ports.server,
        });
        // display command environment options
        displayCommandEnvironment_1.default(cmd, server, bundler);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create empty server file for nodemon watcher...'));
        displayCommandStep_1.default(cmd, `\tFile will be created inside ${colors_1.default.italic(bundler.pathToServerBuildScript)}`);
        const pathToTargetServerDirectory = path.dirname(bundler.pathToServerBuildScript);
        fs.mkdirSync(pathToTargetServerDirectory, { recursive: true });
        fs.writeFileSync(bundler.pathToServerBuildScript, '');
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Build command to start nodemon for the server...'));
        const nodemonExecutable = path.resolve(constants_1.PATH_PROJECT, 'node_modules', 'nodemon', 'bin', 'nodemon.js');
        const nodemonCommand = createCommand_1.default(['node', nodemonExecutable, bundler.pathToServerBuildScript, {
                port: server.port,
                watch: bundler.pathToServerBuildScript,
                staticProxyPort: ports.client,
                staticPathToDirectory: bundler.pathToClientBuild,
            }]);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Concurrently start node js server, server webpack and client webpack...'));
        return concurrently_1.default([
            { command: nodemonCommand.compile(), name: 'node' },
            { command: bundler.bundlerCommandServerStart.compile(), name: 'server' },
            { command: bundler.bundlerCommandClientStart.compile(), name: 'client' },
        ], {
            killOthers: ['failure', 'success'],
            restartTries: 3,
        });
    });
}
exports.default = development;
;
