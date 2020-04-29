"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const http_proxy_1 = __importDefault(require("http-proxy"));
// extract process arguments
const { staticProxyPort } = yargs_1.default.argv;
/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
function createStaticMiddleware() {
    let staticProxy;
    if (staticProxyPort) {
        // create static assets proxy service to resolve assets from client development server
        console.log(`Serve static files from client process running on port ${staticProxyPort}`);
        staticProxy = http_proxy_1.default.createProxyServer({
            target: `http://localhost:${staticProxyPort}`,
        });
    }
    return (req, res, next) => {
        // if request is a path to file
        if (!req.path.match(/\.\w+$/)) {
            return next();
        }
        // if file should be served from the client development server
        if (staticProxy) {
            staticProxy.web(req, res);
            return;
        }
        res.contentType(req.path).sendFile(req.path);
    };
}
exports.default = createStaticMiddleware;
