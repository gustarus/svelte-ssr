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
const displayCommandGreetings_1 = __importDefault(require("../helpers/displayCommandGreetings"));
const displayCommandStep_1 = __importDefault(require("../helpers/displayCommandStep"));
const resolveBundlerByCode_1 = __importDefault(require("../helpers/resolveBundlerByCode"));
const createCommand_1 = __importDefault(require("../helpers/createCommand"));
const resolveAvailablePort_1 = __importDefault(require("../helpers/resolveAvailablePort"));
function development(program) {
    program
        .command('development')
        .description('Generate documentation library from components')
        .requiredOption('-b, --bundler <webpack>', 'Which tool to use to bundle assets (only webpack is supported right now)')
        .option('-p --node-port <3000>', 'Port to listen for server side rendering server', '3000')
        .option('-c, --client-config <config.client.js>', 'Path to bundler tool client config')
        .option('--client-port <8080>', 'Port to listen for client bundler', '8080')
        .option('-s --server-config <config.server.js>', 'Path to bundler tool server config')
        .option('--server-port <8081>', 'Port to listen for server bundler', '8081')
        .action(async (cmd) => {
        displayCommandGreetings_1.default(cmd);
        displayCommandStep_1.default(cmd, colors_1.default.blue.bold('Launch client and server development servers'));
        displayCommandStep_1.default(cmd, colors_1.default.yellow(`Resolve bundler with code '${cmd.bundler}' from collection...`));
        const Bundler = resolveBundlerByCode_1.default(cmd.bundler);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Resolve available ports to launch the tool...'));
        const nodePort = await resolveAvailablePort_1.default(cmd.nodePort);
        const clientPort = await resolveAvailablePort_1.default(cmd.clientPort);
        const serverPort = await resolveAvailablePort_1.default(cmd.serverPort);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create bundler instance with passed options...'));
        const bundler = new Bundler({
            mode: 'development',
            pathToProject: constants_1.PATH_PROJECT,
            pathToClientConfig: cmd.clientConfig,
            pathToServerConfig: cmd.serverConfig,
            serverPortClient: clientPort.available,
            serverPortServer: serverPort.available,
        });
        displayCommandStep_1.default(cmd, colors_1.default.blue('The tool will be started with the following options'));
        displayCommandStep_1.default(cmd, `\tBundler mode: ${colors_1.default.bold(bundler.mode)}`);
        displayCommandStep_1.default(cmd, `\tNode listen to port: ${colors_1.default.bold(nodePort.available)}`);
        displayCommandStep_1.default(cmd, `\tClient bundler listen to port: ${colors_1.default.bold(clientPort.available)}`);
        displayCommandStep_1.default(cmd, `\tServer bundler listen to port: ${colors_1.default.bold(serverPort.available)}`);
        displayCommandStep_1.default(cmd, `\tPath to project to build: ${colors_1.default.italic(bundler.pathToProject)}`);
        displayCommandStep_1.default(cmd, `\tPath to bundler client config: ${colors_1.default.italic(bundler.pathToClientConfig)}`);
        displayCommandStep_1.default(cmd, `\tPath to bundler server config: ${colors_1.default.italic(bundler.pathToServerConfig)}`);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create empty server file for nodemon watcher...'));
        displayCommandStep_1.default(cmd, `\tFile will be created inside ${colors_1.default.italic(bundler.pathToServerBuildScript)}`);
        const pathToTargetServerDirectory = path.dirname(bundler.pathToServerBuildScript);
        fs.mkdirSync(pathToTargetServerDirectory, { recursive: true });
        fs.writeFileSync(bundler.pathToServerBuildScript, '');
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Build command to start nodemon for the server...'));
        const nodemonExecutable = path.resolve(constants_1.PATH_ROOT, 'node_modules', 'nodemon', 'bin', 'nodemon.js');
        const nodemonCommand = createCommand_1.default(['node', nodemonExecutable, bundler.pathToServerBuildScript, {
                port: nodePort.available,
                watch: bundler.pathToServerBuildScript,
                staticProxyPort: clientPort.available,
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
