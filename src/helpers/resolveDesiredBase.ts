// extract process arguments
import yargs from 'yargs';

const { base } = yargs.argv;

export default function resolveDesiredBase(option?: string): string {
  return option || base || '/' as any;
}
