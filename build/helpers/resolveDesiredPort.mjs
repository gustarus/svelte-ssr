import yargs from 'yargs';
const { port } = yargs.argv;
export default function resolveDesiredPort(option) {
    return parseInt(option || port || '3000', 10);
}
