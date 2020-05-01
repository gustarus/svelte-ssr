import colors from 'colors';
import displayCommandStep from './displayCommandStep';
import { TDefaultCommand } from '../types/TDefaultCommand';
import resolveNormalizedPath from './resolveNormalizedPath';
import { DEFAULT_LISTEN_BASE } from '../constants';

export default async function resolveCommandBase(cmd: TDefaultCommand): Promise<string> {
  displayCommandStep(cmd, colors.yellow('Resolve base folder to launch the server...'));
  return cmd.base ? resolveNormalizedPath(cmd.base) : DEFAULT_LISTEN_BASE;
}
