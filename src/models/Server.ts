import path from 'path';
import Component from '../base/Component';
import Command from './Command';
import createCommand from '../helpers/createCommand';
import { TBundler } from '../types/TBundler';

export namespace ServerSpace {
  export type Config = {
    bundler: TBundler;
    port: number;
    base: string;
    live: boolean;
    pathToProject: string;
  };
}

export default class Server extends Component<ServerSpace.Config> {

  public bundler: TBundler;

  public port: number;

  public base: string;

  public live: boolean;

  public pathToProject: string;

  public get defaults(): any {
    return {
      live: false,
    };
  }

  public get commandStart(): Command {
    // resolve command entry point based on live flag
    const entry = this.live
      ? `node ${path.resolve(this.pathToProject, 'node_modules', 'nodemon', 'bin', 'nodemon.js')}` : 'node';

    // resolve entry point options based on environment options
    const watch = this.live ? this.bundler.pathToServerBuildScript : undefined;
    const staticProxyPort = this.bundler.mode === 'development'
      ? this.bundler.developmentPortClient : undefined;
    const staticPathToDirectory = this.bundler.pathToClientBuild;

    // create command to start the server
    return createCommand([entry, this.bundler.pathToServerBuildScript, {
      port: this.port,
      base: this.base,
      watch,
      staticProxyPort,
      staticPathToDirectory,
    }]);
  }
}
