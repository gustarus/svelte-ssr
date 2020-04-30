import yargs from 'yargs';

const { port } = yargs.argv;

export default function resolveDesiredPort(option?: string | number): number {
  return parseInt(option || port || '3000' as any, 10);
}
