var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import { PATH_PROJECT, DEFAULT_OPTIONS } from '../constants';
import concurrently from 'concurrently';
import createCommand from '../helpers/createCommand';
import displayCommandGreetings from '../helpers/displayCommandGreetings';
import displayCommandStep from '../helpers/displayCommandStep';
import resolveCommandConfigurations from '../helpers/resolveCommandConfigurations';
import resolveCommandPorts from '../helpers/resolveCommandPorts';
import resolveCommandBundler from '../helpers/resolveCommandBundler';
import displayCommandEnvironment from '../helpers/displayCommandEnvironment';
import Server from '../models/Server';
export default function development(program) {
    program
        .command('development')
        .description('Launch client and server development servers and node server to serve server side rendering')
        .requiredOption(DEFAULT_OPTIONS.bundler.flag, DEFAULT_OPTIONS.bundler.description, DEFAULT_OPTIONS.bundler.defaultValue)
        .option(DEFAULT_OPTIONS.nodePort.flag, DEFAULT_OPTIONS.nodePort.description, DEFAULT_OPTIONS.nodePort.defaultValue)
        .option(DEFAULT_OPTIONS.clientConfig.flag, DEFAULT_OPTIONS.clientConfig.description, DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(DEFAULT_OPTIONS.clientPort.flag, DEFAULT_OPTIONS.clientPort.description, DEFAULT_OPTIONS.clientPort.defaultValue)
        .option(DEFAULT_OPTIONS.serverConfig.flag, DEFAULT_OPTIONS.serverConfig.description, DEFAULT_OPTIONS.serverConfig.defaultValue)
        .option(DEFAULT_OPTIONS.serverPort.flag, DEFAULT_OPTIONS.serverPort.description, DEFAULT_OPTIONS.serverPort.defaultValue)
        .action((cmd) => __awaiter(this, void 0, void 0, function* () {
        displayCommandGreetings(cmd);
        const ports = yield resolveCommandPorts(cmd);
        const Bundler = yield resolveCommandBundler(cmd);
        const configurations = yield resolveCommandConfigurations(cmd);
        displayCommandStep(cmd, colors.yellow('Create server instance with resolved options...'));
        const server = new Server({
            port: ports.node,
        });
        displayCommandStep(cmd, colors.yellow('Create bundler instance with resolved options...'));
        const bundler = new Bundler({
            mode: 'development',
            pathToProject: PATH_PROJECT,
            pathToClientConfig: configurations.client,
            pathToServerConfig: configurations.server,
            developmentPortClient: ports.client,
            developmentPortServer: ports.server,
        });
        // display command environment options
        displayCommandEnvironment(cmd, server, bundler);
        displayCommandStep(cmd, colors.yellow('Create empty server file for nodemon watcher...'));
        displayCommandStep(cmd, `\tFile will be created inside ${colors.italic(bundler.pathToServerBuildScript)}`);
        const pathToTargetServerDirectory = path.dirname(bundler.pathToServerBuildScript);
        fs.mkdirSync(pathToTargetServerDirectory, { recursive: true });
        fs.writeFileSync(bundler.pathToServerBuildScript, '');
        displayCommandStep(cmd, colors.yellow('Build command to start nodemon for the server...'));
        const nodemonExecutable = path.resolve(PATH_PROJECT, 'node_modules', 'nodemon', 'bin', 'nodemon.js');
        const nodemonCommand = createCommand(['node', nodemonExecutable, bundler.pathToServerBuildScript, {
                port: server.port,
                watch: bundler.pathToServerBuildScript,
                staticProxyPort: ports.client,
                staticPathToDirectory: bundler.pathToClientBuild,
            }]);
        displayCommandStep(cmd, colors.yellow('Concurrently start node js server, server webpack and client webpack...'));
        return concurrently([
            { command: nodemonCommand.compile(), name: 'node' },
            { command: bundler.bundlerCommandServerStart.compile(), name: 'server' },
            { command: bundler.bundlerCommandClientStart.compile(), name: 'client' },
        ], {
            killOthers: ['failure', 'success'],
            restartTries: 3,
        });
    }));
}
;
