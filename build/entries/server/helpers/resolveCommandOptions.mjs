import yargs from 'yargs';
import { DEFAULT_LISTEN_BASE, DEFAULT_LISTEN_HOST, DEFAULT_LISTEN_PORT } from '../../../constants';
const { host, port, base, staticProxyPort, staticPathToDirectory } = yargs.options({
    host: { type: 'string', default: DEFAULT_LISTEN_HOST },
    port: { type: 'number', default: DEFAULT_LISTEN_PORT },
    base: { type: 'string', default: DEFAULT_LISTEN_BASE },
    staticProxyPort: { type: 'number' },
    staticPathToDirectory: { type: 'string' },
}).argv;
export default function resolveCommandOptions() {
    return { host, port, base, staticProxyPort, staticPathToDirectory };
}
