import * as path from 'path';
import yargs from 'yargs';
import merge from 'lodash.merge';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import addWebpackProductionHash from './addWebpackProductionHash';
import { PATH_PROJECT } from '../constants';
import isPathToFileMatches from './isPathToFileMatches';

const argv = yargs.argv;

/**
 * Merge custom webpack config with default ones.
 * @param source - webpack client options
 * @param options - { production: whether in production mode or not; template: expression for template file }
 */
export default function createWebpackClientConfig(source: WebpackOptions, options: { production?: boolean; template?: string | string[] | RegExp } = {}): WebpackOptions {
  const production = typeof options.production !== 'undefined'
    ? options.production : (argv.mode ? argv.mode === 'production' : false);
  const template = options.template || 'index.html';

  return merge({
    entry: {
      client: path.resolve(PATH_PROJECT, 'src', 'client.js'),
    },

    target: 'web',

    node: {
      __dirname: true,
      __filename: true,
    },

    output: {
      path: path.resolve(PATH_PROJECT, 'build', 'client'),
      filename: addWebpackProductionHash('[name].js', production),
      sourceMapFilename: addWebpackProductionHash('[name].map', production),
    },

    devServer: {
      writeToDisk: (pathToFile: string) => isPathToFileMatches(pathToFile, template),
      contentBase: path.join(PATH_PROJECT, 'build', 'client'),
      overlay: true,
      compress: true,
    },
  }, source);
}
