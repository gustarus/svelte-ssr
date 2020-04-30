// extract process arguments
import yargs from 'yargs';
const { base } = yargs.argv;
export default function resolveDesiredBase(option) {
    return option || base || '/';
}
