import colors from 'colors';
import { Command } from 'commander';
import displayCommandStep from './displayCommandStep';
import { TBundler } from '../types/TBundler';
import Server from '../models/Server';

export default function displayCommandEnvironment(cmd: Command, server: Server, bundler: TBundler): void {
  displayCommandStep(cmd, colors.blue('The tool will be started with the following options'));
  displayCommandStep(cmd, `\tBundler mode: ${colors.bold(bundler.mode)}`);

  if (server.port) {
    displayCommandStep(cmd, `\tNode listen to port: ${colors.bold(server.port)}`);
  }

  if (bundler.developmentPortClient) {
    displayCommandStep(cmd, `\tClient bundler listen to port: ${colors.bold(bundler.developmentPortClient)}`);
  }

  if (bundler.developmentPortServer) {
    displayCommandStep(cmd, `\tServer bundler listen to port: ${colors.bold(bundler.developmentPortServer)}`);
  }

  displayCommandStep(cmd, `\tPath to project to build: ${colors.italic(bundler.pathToProject)}`);
  displayCommandStep(cmd, `\tPath to bundler client config: ${colors.italic(bundler.pathToClientConfig)}`);
  displayCommandStep(cmd, `\tPath to bundler server config: ${colors.italic(bundler.pathToServerConfig)}`);
}
