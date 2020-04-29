// extract process arguments
import yargs from 'yargs';

const { port } = yargs.argv;

export default function resolveDesiredPort() {
  return port;
}
