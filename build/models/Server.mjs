import path from 'path';
import Component from '../base/Component';
import createCommand from '../helpers/createCommand';
export default class Server extends Component {
    get defaults() {
        return {
            live: false,
        };
    }
    get commandStart() {
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
