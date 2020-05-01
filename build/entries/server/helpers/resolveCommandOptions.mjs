import yargs from 'yargs';
import { DEFAULT_LISTEN_BASE, DEFAULT_LISTEN_PORT } from '../../../constants';
const { port, base, staticProxyPort, staticPathToDirectory } = yargs.options({
    port: { type: 'number', default: DEFAULT_LISTEN_PORT },
    base: { type: 'string', default: DEFAULT_LISTEN_BASE },
    staticProxyPort: { type: 'number' },
    staticPathToDirectory: { type: 'string' },
}).argv;
export default function resolveCommandOptions() {
    return { port, base, staticProxyPort, staticPathToDirectory };
}
