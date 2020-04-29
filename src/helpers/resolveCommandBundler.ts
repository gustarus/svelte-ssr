import colors from 'colors';
import displayCommandStep from './displayCommandStep';
import resolveBundlerByCode from './resolveBundlerByCode';
import { TDefaultCommand } from '../types/TDefaultCommand';
import { TBundlerInstance } from '../types/TBundlerInstance';

export default async function resolveCommandBundler<T>(cmd: TDefaultCommand): Promise<TBundlerInstance> {
  displayCommandStep(cmd, colors.yellow(`Resolve bundler with code '${cmd.bundler}' from collection...`));
  if (!cmd.bundler) {
    throw new Error('Unable to resolve \'bundler\' option from the command');
  }

  return resolveBundlerByCode(cmd.bundler);
}
