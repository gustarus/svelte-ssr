import colors from 'colors';
import displayCommandStep from './displayCommandStep';
import { TDefaultCommand } from '../types/TDefaultCommand';

export default async function resolveCommandConfigurations<T>(cmd: TDefaultCommand): Promise<{ client?: string; server?: string }> {
  displayCommandStep(cmd, colors.yellow(`Resolve bundler path to config files...`));
  return { client: cmd.clientConfig, server: cmd.serverConfig };
}
