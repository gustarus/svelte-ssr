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
const colors_1 = __importDefault(require("colors"));
const constants_1 = require("../constants");
const displayCommandGreetings_1 = __importDefault(require("../helpers/displayCommandGreetings"));
const displayCommandStep_1 = __importDefault(require("../helpers/displayCommandStep"));
const resolveCommandBundler_1 = __importDefault(require("../helpers/resolveCommandBundler"));
const resolveCommandPorts_1 = __importDefault(require("../helpers/resolveCommandPorts"));
const resolveCommandConfigurations_1 = __importDefault(require("../helpers/resolveCommandConfigurations"));
const Server_1 = __importDefault(require("../models/Server"));
const displayCommandEnvironment_1 = __importDefault(require("../helpers/displayCommandEnvironment"));
const execSyncProgressDisplay_1 = __importDefault(require("../helpers/execSyncProgressDisplay"));
function development(program) {
    program
        .command('production')
        .description('Launch node server to serve server side rendering')
        .requiredOption(constants_1.DEFAULT_OPTIONS.bundler.flag, constants_1.DEFAULT_OPTIONS.bundler.description)
        .option(constants_1.DEFAULT_OPTIONS.nodePort.flag, constants_1.DEFAULT_OPTIONS.nodePort.description, constants_1.DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.clientConfig.flag, constants_1.DEFAULT_OPTIONS.clientConfig.description, constants_1.DEFAULT_OPTIONS.clientConfig.defaultValue)
        .option(constants_1.DEFAULT_OPTIONS.serverConfig.flag, constants_1.DEFAULT_OPTIONS.serverConfig.description, constants_1.DEFAULT_OPTIONS.serverConfig.defaultValue)
        .action((cmd) => __awaiter(this, void 0, void 0, function* () {
        displayCommandGreetings_1.default(cmd);
        const ports = yield resolveCommandPorts_1.default(cmd);
        const Bundler = yield resolveCommandBundler_1.default(cmd);
        const configurations = yield resolveCommandConfigurations_1.default(cmd);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create server instance with resolved options...'));
        const server = new Server_1.default({
            port: ports.node,
        });
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Create bundler instance with resolved options...'));
        const bundler = new Bundler({
            mode: 'production',
            pathToProject: constants_1.PATH_PROJECT,
            pathToClientConfig: configurations.client,
            pathToServerConfig: configurations.server,
        });
        // display command environment options
        displayCommandEnvironment_1.default(cmd, server, bundler);
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Launch node server...'));
        execSyncProgressDisplay_1.default('node', bundler.pathToServerBuildScript, {
            port: server.port,
            staticPathToDirectory: bundler.pathToClientBuild,
        });
    }));
}
exports.default = development;
;
