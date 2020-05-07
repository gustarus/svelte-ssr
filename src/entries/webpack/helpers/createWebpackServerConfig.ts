import path from 'path';
import yargs from 'yargs';
import merge from 'lodash.merge';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import isPathToFileMatches from '../../../helpers/isPathToFileMatches';
import resolveDesiredBase from '../../../helpers/resolveDesiredBase';
import resolvePathToProject from '../../../helpers/resolvePathToProject';

const argv = yargs.argv;
const pathToProject = resolvePathToProject() as string;
if (!pathToProject) {
  throw new Error('Unable to resolve path to project: does package.json exist in the project folder?');
}

/**
 * Merge custom webpack config with default ones.
 * @param source - webpack client options
 * @param options - { production: whether in production mode or not; template: expression for template file }
 */
export default function createWebpackServerConfig(source: WebpackOptions, options: { production?: boolean } = {}): WebpackOptions {
  // eslint-disable-next-line
  // @ts-ignore
  const production = typeof options.production !== 'undefined'
    ? options.production : (argv.mode ? argv.mode === 'production' : false);
  const base = resolveDesiredBase();

  return merge({
    entry: {
      server: path.resolve(pathToProject, 'src', 'server.js'),
    },

    target: 'node',

    node: {
      __dirname: true,
      __filename: true,
    },

    output: {
      path: path.resolve(pathToProject, 'build', 'server'),
      filename: '[name].js',
    },

    optimization: {
      minimize: false,
    },

    devServer: {
      writeToDisk: (pathToFile: string) => isPathToFileMatches(pathToFile, 'server.js'),
      contentBase: path.join(pathToProject, 'build', 'server'),
      overlay: true,
      compress: true,
      publicPath: base,
      historyApiFallback: {
        index: base,
      },
    },
  }, source);
}
