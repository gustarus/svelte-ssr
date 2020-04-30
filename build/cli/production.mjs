var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import colors from 'colors';
import { PATH_PROJECT, DEFAULT_OPTIONS } from '../constants';
import displayCommandGreetings from '../helpers/displayCommandGreetings';
import displayCommandStep from '../helpers/displayCommandStep';
import resolveCommandBundler from '../helpers/resolveCommandBundler';
import resolveCommandPorts from '../helpers/resolveCommandPorts';
import resolveCommandConfigurations from '../helpers/resolveCommandConfigurations';
import Server from '../models/Server';
import displayCommandEnvironment from '../helpers/displayCommandEnvironment';
import execSyncProgressDisplay from '../helpers/execSyncProgressDisplay';
export default function development(program) {
    program
        .command('production')
        .description('Launch node server to serve server side rendering')
        .requiredOption(DEFAULT_OPTIONS.bundler.flag, DEFAULT_OPTIONS.bundler.description)
        .option(DEFAULT_OPTIONS.nodePort.flag, DEFAULT_OPTIONS.nodePort.description, DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(DEFAULT_OPTIONS.clientConfig.flag, DEFAULT_OPTIONS.clientConfig.description, DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(DEFAULT_OPTIONS.serverConfig.flag, DEFAULT_OPTIONS.serverConfig.description, DEFAULT_OPTIONS.serverConfig.defaultValue)
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
            mode: 'production',
            pathToProject: PATH_PROJECT,
            pathToClientConfig: configurations.client,
            pathToServerConfig: configurations.server,
        });
        // display command environment options
        displayCommandEnvironment(cmd, server, bundler);
        displayCommandStep(cmd, colors.yellow('Launch node server...'));
        execSyncProgressDisplay('node', bundler.pathToServerBuildScript, {
            port: server.port,
            staticPathToDirectory: bundler.pathToClientBuild,
        });
    }));
}
;
