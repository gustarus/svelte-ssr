import * as fs from 'fs-extra';
import * as path from 'path';
import colors from 'colors';
import { PATH_ROOT, PATH_PROJECT } from '../constants';
import concurrently from 'concurrently';
import { Command } from 'commander';
import displayCommandGreetings from '../helpers/displayCommandGreetings';
import displayCommandStep from '../helpers/displayCommandStep';
import resolveBundlerByCode from '../helpers/resolveBundlerByCode';
import createCommand from '../helpers/createCommand';

export default function development(program: Command) {
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
      displayCommandGreetings(cmd);

      displayCommandStep(cmd, colors.blue.bold('Launch client and server development servers'));

      displayCommandStep(cmd, colors.yellow(`Resolve bundler with code '${cmd.bundler}' from collection...`));
      const Bundler = resolveBundlerByCode(cmd.bundler);

      displayCommandStep(cmd, colors.yellow('Resolve bundler configuration files...'));
      const bundler = new Bundler({
        mode: 'development',
        pathToProject: PATH_PROJECT,
        pathToClientConfig: cmd.clientConfig,
        pathToServerConfig: cmd.serverConfig,
        serverPortClient: cmd.clientPort,
        serverPortServer: cmd.serverPort,
      });

      displayCommandStep(cmd, colors.yellow('Create empty server file for nodemon watcher...'));
      const pathToTargetServerDirectory = path.dirname(bundler.pathToServerBuildScript);
      fs.mkdirSync(pathToTargetServerDirectory, { recursive: true });
      fs.writeFileSync(bundler.pathToServerBuildScript, '');

      displayCommandStep(cmd, colors.yellow('Build command to start nodemon for the server...'));
      const pathToNodemon = path.resolve(PATH_ROOT, 'node_modules', 'nodemon', 'bin', 'nodemon.js');
      const command = createCommand(['node', pathToNodemon, bundler.pathToServerBuildScript, { port: cmd.nodePort }]);

      displayCommandStep(cmd, colors.yellow('Concurrently start node js server, server webpack and client webpack...'));
      return concurrently([
        { command: command.compile(), name: 'node' },
        { command: bundler.bundlerCommandServerStart.compile(), name: 'server' },
        { command: bundler.bundlerCommandClientStart.compile(), name: 'client' },
      ], {
        killOthers: ['failure', 'success'],
        restartTries: 3,
      });
    });
};
