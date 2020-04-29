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
import resolveAvailablePort from '../helpers/resolveAvailablePort';

export default function development(program: Command) {
  program
    .command('development')
    .description('Generate documentation library from components')
    .requiredOption('-b, --bundler <webpack>', 'Which tool to use to bundle assets (only webpack is supported right now)')
    .option('-p --node-port <3000>', 'Port to listen for server side rendering server', '3000')
    .option('-c, --client-config <config.client.js>', 'Path to bundler tool client config')
    .option('--client-port <8080>', 'Port to listen for client bundler', '8080')
    .option('-s --server-config <config.server.js>', 'Path to bundler tool server config')
    .option('--server-port <8081>', 'Port to listen for server bundler', '8081')
    .action(async(cmd) => {
      displayCommandGreetings(cmd);

      displayCommandStep(cmd, colors.blue.bold('Launch client and server development servers'));

      displayCommandStep(cmd, colors.yellow(`Resolve bundler with code '${cmd.bundler}' from collection...`));
      const Bundler = resolveBundlerByCode(cmd.bundler);

      displayCommandStep(cmd, colors.yellow('Resolve available ports to launch the tool...'));
      const nodePort = await resolveAvailablePort(cmd.nodePort);
      const clientPort = await resolveAvailablePort(cmd.clientPort);
      const serverPort = await resolveAvailablePort(cmd.serverPort);

      displayCommandStep(cmd, colors.yellow('Create bundler instance with passed options...'));
      const bundler = new Bundler({
        mode: 'development',
        pathToProject: PATH_PROJECT,
        pathToClientConfig: cmd.clientConfig,
        pathToServerConfig: cmd.serverConfig,
        serverPortClient: clientPort.available,
        serverPortServer: serverPort.available,
      });

      displayCommandStep(cmd, colors.blue('The tool will be started with the following options'));
      displayCommandStep(cmd, `\tBundler mode: ${colors.bold(bundler.mode)}`);
      displayCommandStep(cmd, `\tNode listen to port: ${colors.bold(nodePort.available)}`);
      displayCommandStep(cmd, `\tClient bundler listen to port: ${colors.bold(clientPort.available)}`);
      displayCommandStep(cmd, `\tServer bundler listen to port: ${colors.bold(serverPort.available)}`);
      displayCommandStep(cmd, `\tPath to project to build: ${colors.italic(bundler.pathToProject)}`);
      displayCommandStep(cmd, `\tPath to bundler client config: ${colors.italic(bundler.pathToClientConfig)}`);
      displayCommandStep(cmd, `\tPath to bundler server config: ${colors.italic(bundler.pathToServerConfig)}`);

      displayCommandStep(cmd, colors.yellow('Create empty server file for nodemon watcher...'));
      displayCommandStep(cmd, `\tFile will be created inside ${colors.italic(bundler.pathToServerBuildScript)}`);
      const pathToTargetServerDirectory = path.dirname(bundler.pathToServerBuildScript);
      fs.mkdirSync(pathToTargetServerDirectory, { recursive: true });
      fs.writeFileSync(bundler.pathToServerBuildScript, '');

      displayCommandStep(cmd, colors.yellow('Build command to start nodemon for the server...'));
      const nodemonExecutable = path.resolve(PATH_ROOT, 'node_modules', 'nodemon', 'bin', 'nodemon.js');
      const nodemonCommand = createCommand(['node', nodemonExecutable, bundler.pathToServerBuildScript, {
        port: nodePort.available,
        watch: bundler.pathToServerBuildScript,
        staticProxyPort: clientPort.available,
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
    });
};
