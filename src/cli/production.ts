import colors from 'colors';
import { PATH_PROJECT, DEFAULT_OPTIONS } from '../constants';
import { Command } from 'commander';
import displayCommandGreetings from '../helpers/displayCommandGreetings';
import displayCommandStep from '../helpers/displayCommandStep';
import { TDefaultCommand } from '../types/TDefaultCommand';
import resolveCommandBundler from '../helpers/resolveCommandBundler';
import resolveCommandPorts from '../helpers/resolveCommandPorts';
import resolveCommandConfigurations from '../helpers/resolveCommandConfigurations';
import Server from '../models/Server';
import displayCommandEnvironment from '../helpers/displayCommandEnvironment';
import execSyncProgressDisplay from '../helpers/execSyncProgressDisplay';
import resolveCommandBase from '../helpers/resolveCommandBase';

export default function development(program: Command) {
  program
    .command('production')
    .description('Launch node server to serve server side rendering')
    .requiredOption(DEFAULT_OPTIONS.bundler.flag, DEFAULT_OPTIONS.bundler.description)
    .option(DEFAULT_OPTIONS.base.flag, DEFAULT_OPTIONS.base.description, DEFAULT_OPTIONS.base.defaultValue)
    .option(DEFAULT_OPTIONS.nodePort.flag, DEFAULT_OPTIONS.nodePort.description, DEFAULT_OPTIONS.clientConfig.defaultValue)
    .option(DEFAULT_OPTIONS.clientConfig.flag, DEFAULT_OPTIONS.clientConfig.description, DEFAULT_OPTIONS.clientConfig.defaultValue)
    .option(DEFAULT_OPTIONS.serverConfig.flag, DEFAULT_OPTIONS.serverConfig.description, DEFAULT_OPTIONS.serverConfig.defaultValue)
    .action(async(cmd: TDefaultCommand) => {
      displayCommandGreetings(cmd);
      const base = await resolveCommandBase(cmd);
      const ports = await resolveCommandPorts(cmd);
      const Bundler = await resolveCommandBundler(cmd);
      const configurations = await resolveCommandConfigurations(cmd);

      displayCommandStep(cmd, colors.yellow('Create bundler instance with resolved options...'));
      const bundler = new Bundler({
        mode: 'production',
        base: base,
        pathToProject: PATH_PROJECT,
        pathToClientConfig: configurations.client,
        pathToServerConfig: configurations.server,
      });

      displayCommandStep(cmd, colors.yellow('Create server instance with resolved options...'));
      const server = new Server({
        bundler,
        port: ports.node,
        base: base,
        live: false,
        pathToProject: PATH_PROJECT,
      });

      // display command environment options
      displayCommandEnvironment(cmd, server, bundler);

      displayCommandStep(cmd, colors.yellow('Launch node server...'));
      execSyncProgressDisplay(server.commandStart);
    });
};
