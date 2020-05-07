import colors from 'colors';
import { DEFAULT_OPTIONS } from '../constants';
import { Command } from 'commander';
import displayCommandGreetings from '../helpers/displayCommandGreetings';
import displayCommandStep from '../helpers/displayCommandStep';
import { TDefaultCommand } from '../types/TDefaultCommand';
import resolveCommandBundler from '../helpers/resolveCommandBundler';
import resolveCommandConfigurations from '../helpers/resolveCommandConfigurations';
import displayCommandEnvironment from '../helpers/displayCommandEnvironment';
import execSyncProgressDisplay from '../helpers/execSyncProgressDisplay';
import displayCommandDone from '../helpers/displayCommandDone';
import resolveCommandPathToProject from '../helpers/resolveCommandPathToProject';

export default function development(program: Command) {
  program
    .command('build')
    .description('Build client and server entries')
    .requiredOption(DEFAULT_OPTIONS.bundler.flag, DEFAULT_OPTIONS.bundler.description)
    .option(DEFAULT_OPTIONS.clientConfig.flag, DEFAULT_OPTIONS.clientConfig.description, DEFAULT_OPTIONS.clientConfig.defaultValue)
    .option(DEFAULT_OPTIONS.serverConfig.flag, DEFAULT_OPTIONS.serverConfig.description, DEFAULT_OPTIONS.serverConfig.defaultValue)
    .action(async(cmd: TDefaultCommand) => {
      displayCommandGreetings(cmd);
      const Bundler = await resolveCommandBundler(cmd);
      const pathToProject = await resolveCommandPathToProject(cmd);
      const configurations = await resolveCommandConfigurations(cmd);

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
    });
};
