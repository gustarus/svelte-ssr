import colors from 'colors';
import displayCommandStep from './displayCommandStep';
export default function displayCommandEnvironment(cmd, server, bundler) {
    displayCommandStep(cmd, colors.blue('The tool will be started with the following options'));
    if (bundler && bundler.mode) {
        displayCommandStep(cmd, `\tBundler mode: ${colors.bold(bundler.mode)}`);
    }
    if (server && server.port) {
        displayCommandStep(cmd, `\tNode listen to port: ${colors.bold(server.port)}`);
    }
    if (bundler && bundler.developmentPortClient) {
        displayCommandStep(cmd, `\tClient bundler listen to port: ${colors.bold(bundler.developmentPortClient)}`);
    }
    if (bundler && bundler.developmentPortServer) {
        displayCommandStep(cmd, `\tServer bundler listen to port: ${colors.bold(bundler.developmentPortServer)}`);
    }
    if (bundler && bundler.pathToProject) {
        displayCommandStep(cmd, `\tPath to project to build: ${colors.italic(bundler.pathToProject)}`);
    }
    if (bundler && bundler.pathToClientConfig) {
        displayCommandStep(cmd, `\tPath to bundler client config: ${colors.italic(bundler.pathToClientConfig)}`);
    }
    if (bundler && bundler.pathToServerConfig) {
        displayCommandStep(cmd, `\tPath to bundler server config: ${colors.italic(bundler.pathToServerConfig)}`);
    }
}
