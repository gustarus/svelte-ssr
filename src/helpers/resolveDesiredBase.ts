import yargs from 'yargs';
import resolveNormalizedPath from './resolveNormalizedPath';

const { base } = yargs.argv;

export default function resolveDesiredBase(option?: string): string {
  return resolveNormalizedPath(option || base || '/' as any);
}
