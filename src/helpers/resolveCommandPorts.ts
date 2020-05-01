import colors from 'colors';
import displayCommandStep from './displayCommandStep';
import resolveAvailablePort from './resolveAvailablePort';
import { TDefaultCommand } from '../types/TDefaultCommand';
import { DEFAULT_CLIENT_PORT, DEFAULT_LISTEN_PORT, DEFAULT_SERVER_PORT } from '../constants';

export default async function resolveCommandPorts(cmd: TDefaultCommand): Promise<{ node: number; client: number; server: number }> {
  displayCommandStep(cmd, colors.yellow('Resolve available server port to launch the tool...'));
  const nodePort = await resolveAvailablePort(cmd.nodePort || DEFAULT_LISTEN_PORT);
  const clientPort = await resolveAvailablePort(cmd.clientPort || DEFAULT_CLIENT_PORT);
  const serverPort = await resolveAvailablePort(cmd.serverPort || DEFAULT_SERVER_PORT);

  return {
    node: nodePort.available,
    client: clientPort.available,
    server: serverPort.available,
  };
}
