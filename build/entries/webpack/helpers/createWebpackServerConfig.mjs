import path from 'path';
import yargs from 'yargs';
import merge from 'lodash.merge';
import { PATH_PROJECT } from '../../../constants';
import isPathToFileMatches from '../../../helpers/isPathToFileMatches';
import resolveDesiredBase from '../../../helpers/resolveDesiredBase';
const argv = yargs.argv;
/**
 * Merge custom webpack config with default ones.
 * @param source - webpack client options
 * @param options - { production: whether in production mode or not; template: expression for template file }
 */
export default function createWebpackServerConfig(source, options = {}) {
    // eslint-disable-next-line
    // @ts-ignore
    const production = typeof options.production !== 'undefined'
        ? options.production : (argv.mode ? argv.mode === 'production' : false);
    const base = resolveDesiredBase();
    return merge({
        entry: {
            server: path.resolve(PATH_PROJECT, 'src', 'server.js')
        },
        target: 'node',
        node: {
            __dirname: true,
            __filename: true,
        },
        output: {
            path: path.resolve(PATH_PROJECT, 'build', 'server'),
            filename: '[name].js'
        },
        optimization: {
            minimize: false
        },
        devServer: {
            writeToDisk: (pathToFile) => isPathToFileMatches(pathToFile, 'server.js'),
            contentBase: path.join(PATH_PROJECT, 'build', 'server'),
            overlay: true,
            compress: true,
            publicPath: base,
            historyApiFallback: {
                index: base,
            },
        }
    }, source);
}
