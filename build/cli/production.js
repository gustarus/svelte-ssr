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
function development(program) {
    program
        .command('production')
        .description('Generate documentation library from components')
        .requiredOption('-b, --bundler <webpack>', 'Which tool to use to bundle assets (only webpack is supported right now)')
        .option('-s --node-port <3000>', 'Port to listen for server side rendering server', undefined)
        .option('-c, --client-config <config.client.js>', 'Path to bundler tool client config')
        .option('-s --client-port <8080>', 'Port to listen for client bundler', undefined)
        .option('-s --server-config <config.server.js>', 'Path to bundler tool server config')
        .option('-s --server-port <8081>', 'Port to listen for server bundler', undefined)
        .action(async (cmd) => {
        displayCommandGreetings_1.default(cmd);
        displayCommandStep_1.default(cmd, colors_1.default.blue.bold('Launch client and server development servers'));
        displayCommandStep_1.default(cmd, colors_1.default.yellow(`Resolve bundler with code '${cmd.bundler}' from collection...`));
        const Bundler = resolveBundlerByCode_1.default(cmd.bundler);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Resolve bundler configuration files...'));
        const bundler = new Bundler({
            mode: 'development',
            pathToProject: constants_1.PATH_PROJECT,
            pathToClientConfig: cmd.clientConfig,
            pathToServerConfig: cmd.serverConfig,
            serverPortClient: cmd.clientPort,
            serverPortServer: cmd.serverPort,
        });
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create empty server file for nodemon watcher...'));
        const pathToTargetServerDirectory = path.dirname(bundler.pathToServerBuildScript);
        fs.mkdirSync(pathToTargetServerDirectory, { recursive: true });
        fs.writeFileSync(bundler.pathToServerBuildScript, '');
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Build command to start nodemon for the server...'));
        const pathToNodemon = path.resolve(constants_1.PATH_ROOT, 'node_modules', 'nodemon', 'bin', 'nodemon.js');
        const command = createCommand_1.default(['node', pathToNodemon, bundler.pathToServerBuildScript, { port: cmd.nodePort }]);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Concurrently start node js server, server webpack and client webpack...'));
        return concurrently_1.default([
            { command: command.compile(), name: 'node' },
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
