import colors from 'colors';
import displayCommandStep from './displayCommandStep';
import resolveAvailablePort from './resolveAvailablePort';
import { TDefaultCommand } from '../types/TDefaultCommand';
import { DEFAULT_PORT_CLIENT, DEFAULT_PORT_NODE, DEFAULT_PORT_SERVER } from '../constants';

export default async function resolveCommandPorts(cmd: TDefaultCommand): Promise<{ node: string; client: string; server: string }> {
  displayCommandStep(cmd, colors.yellow('Resolve available server port to launch the tool...'));
  const nodePort = await resolveAvailablePort(cmd.nodePort || DEFAULT_PORT_NODE);
  const clientPort = await resolveAvailablePort(cmd.clientPort || DEFAULT_PORT_CLIENT);
  const serverPort = await resolveAvailablePort(cmd.serverPort || DEFAULT_PORT_SERVER);

  return {
    node: nodePort.available,
    client: clientPort.available,
    server: serverPort.available,
  };
}
