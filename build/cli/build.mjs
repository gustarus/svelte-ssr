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
import { DEFAULT_OPTIONS } from '../constants';
import displayCommandGreetings from '../helpers/displayCommandGreetings';
import displayCommandStep from '../helpers/displayCommandStep';
import resolveCommandBundler from '../helpers/resolveCommandBundler';
import resolveCommandConfigurations from '../helpers/resolveCommandConfigurations';
import displayCommandEnvironment from '../helpers/displayCommandEnvironment';
import execSyncProgressDisplay from '../helpers/execSyncProgressDisplay';
import displayCommandDone from '../helpers/displayCommandDone';
import resolveCommandPathToProject from '../helpers/resolveCommandPathToProject';
export default function development(program) {
    program
        .command('build')
        .description('Build client and server entries')
        .requiredOption(DEFAULT_OPTIONS.bundler.flag, DEFAULT_OPTIONS.bundler.description)
        .option(DEFAULT_OPTIONS.clientConfig.flag, DEFAULT_OPTIONS.clientConfig.description, DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(DEFAULT_OPTIONS.serverConfig.flag, DEFAULT_OPTIONS.serverConfig.description, DEFAULT_OPTIONS.serverConfig.defaultValue)
        .action((cmd) => __awaiter(this, void 0, void 0, function* () {
        displayCommandGreetings(cmd);
        const Bundler = yield resolveCommandBundler(cmd);
        const pathToProject = yield resolveCommandPathToProject(cmd);
        const configurations = yield resolveCommandConfigurations(cmd);
        displayCommandStep(cmd, colors.yellow('Create bundler instance with resolved options...'));
        const bundler = new Bundler({
            mode: 'production',
            pathToProject,
            pathToClientConfig: configurations.client,
            pathToServerConfig: configurations.server,
        });
        // display command environment options
        displayCommandEnvironment(cmd, undefined, bundler);
        displayCommandStep(cmd, colors.yellow('Build client entry point...'));
        execSyncProgressDisplay(bundler.bundlerCommandClientBuild.compile());
        displayCommandStep(cmd, colors.yellow('Build server entry point...'));
        execSyncProgressDisplay(bundler.bundlerCommandServerBuild.compile());
        displayCommandDone(cmd);
    }));
}
;
