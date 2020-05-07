var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import { DEFAULT_OPTIONS } from '../constants';
import concurrently from 'concurrently';
import displayCommandGreetings from '../helpers/displayCommandGreetings';
import displayCommandStep from '../helpers/displayCommandStep';
import resolveCommandConfigurations from '../helpers/resolveCommandConfigurations';
import resolveCommandPorts from '../helpers/resolveCommandPorts';
import resolveCommandBundler from '../helpers/resolveCommandBundler';
import displayCommandEnvironment from '../helpers/displayCommandEnvironment';
import Server from '../models/Server';
import resolveCommandBase from '../helpers/resolveCommandBase';
import resolveCommandPathToProject from '../helpers/resolveCommandPathToProject';
export default function development(program) {
    program
        .command('development')
        .description('Launch client and server development servers and node server to serve server side rendering')
        .requiredOption(DEFAULT_OPTIONS.bundler.flag, DEFAULT_OPTIONS.bundler.description, DEFAULT_OPTIONS.bundler.defaultValue)
        .option(DEFAULT_OPTIONS.base.flag, DEFAULT_OPTIONS.base.description, DEFAULT_OPTIONS.base.defaultValue)
        .option(DEFAULT_OPTIONS.nodePort.flag, DEFAULT_OPTIONS.nodePort.description, DEFAULT_OPTIONS.nodePort.defaultValue)
        .option(DEFAULT_OPTIONS.clientConfig.flag, DEFAULT_OPTIONS.clientConfig.description, DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(DEFAULT_OPTIONS.clientPort.flag, DEFAULT_OPTIONS.clientPort.description, DEFAULT_OPTIONS.clientPort.defaultValue)
        .option(DEFAULT_OPTIONS.serverConfig.flag, DEFAULT_OPTIONS.serverConfig.description, DEFAULT_OPTIONS.serverConfig.defaultValue)
        .option(DEFAULT_OPTIONS.serverPort.flag, DEFAULT_OPTIONS.serverPort.description, DEFAULT_OPTIONS.serverPort.defaultValue)
        .action((cmd) => __awaiter(this, void 0, void 0, function* () {
        displayCommandGreetings(cmd);
        const base = yield resolveCommandBase(cmd);
        const ports = yield resolveCommandPorts(cmd);
        const Bundler = yield resolveCommandBundler(cmd);
        const pathToProject = yield resolveCommandPathToProject(cmd);
        const configurations = yield resolveCommandConfigurations(cmd);
        displayCommandStep(cmd, colors.yellow('Create bundler instance with resolved options...'));
        const bundler = new Bundler({
            mode: 'development',
            base,
            pathToProject,
            pathToClientConfig: configurations.client,
            pathToServerConfig: configurations.server,
            developmentPortClient: ports.client,
            developmentPortServer: ports.server,
        });
        displayCommandStep(cmd, colors.yellow('Create server instance with resolved options...'));
        const server = new Server({
            bundler,
            port: ports.node,
            base,
            live: true,
            pathToProject,
        });
        // display command environment options
        displayCommandEnvironment(cmd, server, bundler);
        displayCommandStep(cmd, colors.yellow('Create empty server file for nodemon watcher...'));
        displayCommandStep(cmd, `\tFile will be created inside ${colors.italic(bundler.pathToServerBuildScript)}`);
        const pathToTargetServerDirectory = path.dirname(bundler.pathToServerBuildScript);
        fs.mkdirSync(pathToTargetServerDirectory, { recursive: true });
        fs.writeFileSync(bundler.pathToServerBuildScript, '');
        // proxy additional arguments to bundler server command
        const bundlerCommandAdditional = {
            nodePort: server.port,
            clientPort: bundler.developmentPortClient,
            serverPort: bundler.developmentPortServer,
        };
        displayCommandStep(cmd, colors.yellow('Concurrently start node js server, server webpack and client webpack...'));
        return concurrently([
            { command: server.commandStart.compile(), name: 'node' },
            { command: bundler.bundlerCommandServerStart.merge(bundlerCommandAdditional).compile(), name: 'server' },
            { command: bundler.bundlerCommandClientStart.merge(bundlerCommandAdditional).compile(), name: 'client' },
        ], {
            killOthers: ['failure', 'success'],
            restartTries: 3,
        });
    }));
}
;
