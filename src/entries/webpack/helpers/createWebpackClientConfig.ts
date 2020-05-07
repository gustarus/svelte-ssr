import path from 'path';
import yargs from 'yargs';
import merge from 'lodash.merge';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import addWebpackProductionHash from './addWebpackProductionHash';
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
export default function createWebpackClientConfig(source: WebpackOptions, options: { production?: boolean; template?: string | string[] | RegExp } = {}): WebpackOptions {
  const production = typeof options.production !== 'undefined'
    ? options.production : (argv.mode ? argv.mode === 'production' : false);
  const template = options.template || 'index.html';
  const base = resolveDesiredBase();

  return merge({
    entry: {
      client: path.resolve(pathToProject, 'src', 'client.js'),
    },

    target: 'web',

    node: {
      fs: 'empty',
      path: 'empty',
    },

    output: {
      path: path.resolve(pathToProject, 'build', 'client'),
      filename: addWebpackProductionHash('[name].js', production),
      sourceMapFilename: addWebpackProductionHash('[name].map', production),
    },

    devServer: {
      writeToDisk: (pathToFile: string) => isPathToFileMatches(pathToFile, template),
      contentBase: path.join(pathToProject, 'build', 'client'),
      overlay: true,
      compress: true,
      publicPath: base,
      historyApiFallback: {
        index: base,
      },
    },
  }, source);
}
