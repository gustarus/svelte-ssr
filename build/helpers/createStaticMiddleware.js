"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const path_1 = __importDefault(require("path"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const resolveDesiredBase_1 = __importDefault(require("./resolveDesiredBase"));
// extract process arguments
const { staticProxyPort, staticPathToDirectory } = yargs_1.default.argv;
/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
function createStaticMiddleware(options = {}) {
    const base = resolveDesiredBase_1.default(options.base);
    let staticProxy;
    if (staticProxyPort) {
        // create static assets proxy service to resolve assets from client development server
        console.log(`Serve static files from client process running on port ':${staticProxyPort}'`);
        staticProxy = http_proxy_1.default.createProxyServer({
            target: `http://localhost:${staticProxyPort}`,
        });
    }
    else if (staticPathToDirectory) {
        console.log(`Serve static files from folder '${staticPathToDirectory}'`);
    }
    else {
        throw new Error('Unable to resolve command argument \'staticPathToDirectory\' which is required to serve static files');
    }
    console.log(`Use the following base path to serve assets: '${base}'`);
    return (req, res, next) => {
        // if request is a path to file
        if (!req.path.match(/\.\w+$/)) {
            return next();
        }
        // if file should be served from the client development server
        if (staticProxy) {
            // TODO Enable in debug mode.
            // console.log(`Serve static file '${req.path}' from proxy`);
            staticProxy.web(req, res);
            return;
        }
        // '/base/name.extension' -> 'name.extension'
        // TODO Enable in debug mode.
        console.log(`Serve static file '${req.path}' from folder ${req.path.slice(base.length)}`);
        const pathToFileRelative = req.path.slice(base.length);
        const pathToFileAbsolute = path_1.default.resolve(staticPathToDirectory, pathToFileRelative);
        res.contentType(path_1.default.basename(pathToFileAbsolute)).sendFile(pathToFileAbsolute);
    };
}
exports.default = createStaticMiddleware;
