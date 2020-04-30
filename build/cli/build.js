"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const constants_1 = require("../constants");
const displayCommandGreetings_1 = __importDefault(require("../helpers/displayCommandGreetings"));
const displayCommandStep_1 = __importDefault(require("../helpers/displayCommandStep"));
const resolveCommandBundler_1 = __importDefault(require("../helpers/resolveCommandBundler"));
const resolveCommandConfigurations_1 = __importDefault(require("../helpers/resolveCommandConfigurations"));
const displayCommandEnvironment_1 = __importDefault(require("../helpers/displayCommandEnvironment"));
const execSyncProgressDisplay_1 = __importDefault(require("../helpers/execSyncProgressDisplay"));
const displayCommandDone_1 = __importDefault(require("../helpers/displayCommandDone"));
function development(program) {
    program
        .command('build')
        .description('Build client and server entries')
        .requiredOption(constants_1.DEFAULT_OPTIONS.bundler.flag, constants_1.DEFAULT_OPTIONS.bundler.description)
        .option(constants_1.DEFAULT_OPTIONS.clientConfig.flag, constants_1.DEFAULT_OPTIONS.clientConfig.description, constants_1.DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.serverConfig.flag, constants_1.DEFAULT_OPTIONS.serverConfig.description, constants_1.DEFAULT_OPTIONS.serverConfig.defaultValue)
        .action(async (cmd) => {
        displayCommandGreetings_1.default(cmd);
        const Bundler = await resolveCommandBundler_1.default(cmd);
        const configurations = await resolveCommandConfigurations_1.default(cmd);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create bundler instance with resolved options...'));
        const bundler = new Bundler({
            mode: 'production',
            pathToProject: constants_1.PATH_PROJECT,
            pathToClientConfig: configurations.client,
            pathToServerConfig: configurations.server,
        });
        // display command environment options
        displayCommandEnvironment_1.default(cmd, undefined, bundler);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Build client entry point...'));
        execSyncProgressDisplay_1.default(bundler.bundlerCommandClientBuild.compile());
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Build server entry point...'));
        execSyncProgressDisplay_1.default(bundler.bundlerCommandServerBuild.compile());
        displayCommandDone_1.default(cmd);
    });
}
exports.default = development;
;
