import colors from 'colors';
import displayCommandStep from './displayCommandStep';
import { TDefaultCommand } from '../types/TDefaultCommand';
import resolveNormalizedPath from './resolveNormalizedPath';

export default async function resolveCommandBase(cmd: TDefaultCommand): Promise<string> {
  displayCommandStep(cmd, colors.yellow('Resolve base folder to launch the server...'));
  return resolveNormalizedPath(cmd.base);
}
