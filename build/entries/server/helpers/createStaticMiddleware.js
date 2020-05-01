"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const resolveNormalizedPath_1 = __importDefault(require("../../../helpers/resolveNormalizedPath"));
const logger_1 = __importDefault(require("../../../instances/logger"));
/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
function createStaticMiddleware(options) {
    const { staticProxyPort, staticPathToDirectory } = options;
    const verbose = typeof options.verbose !== 'undefined' ? options.verbose : false;
    const base = resolveNormalizedPath_1.default(options.base);
    const pattern = options.pattern || /\.\w+$/;
    logger_1.default.info(`Use static middleware to serve static assets from '${base}'`);
    if (!base) {
        throw new Error('Option \'base\' is required to serve static assets');
    }
    let staticProxy;
    const proxyTarget = `http://localhost:${staticProxyPort}`;
    if (staticProxyPort) {
        // create static assets proxy service to resolve assets from client development server
        logger_1.default.trace(`Serve static files from client process running on port ':${staticProxyPort}'`, 1);
        staticProxy = http_proxy_1.default.createProxyServer({
            target: proxyTarget,
        });
    }
    else if (staticPathToDirectory) {
        logger_1.default.trace(`Serve static files from folder '${staticPathToDirectory}'`, 1);
    }
    else {
        throw new Error('Unable to resolve command argument \'staticPathToDirectory\' which is required to serve static files');
    }
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        verbose && logger_1.default.trace(`Static file request candidate: '${req.path}'`);
        // serve static only from desired base
        if (req.path.indexOf(base) !== 0) {
            verbose && logger_1.default.warning(`Request is outside of the base path '${base}'`, 1);
            return next();
        }
        // if request is a path to file
        if (!pattern.test(req.path)) {
            verbose && logger_1.default.warning(`Request doesn't match pattern '${pattern.toString()}'`, 1);
            return next();
        }
        // if file should be served from the client development server
        if (staticProxy) {
            verbose && logger_1.default.trace(`Try to resolve static file via proxy from '${proxyTarget}'`, 1);
            staticProxy.web(req, res);
            return;
        }
        // '/base/name.extension' -> 'name.extension'
        const pathToFileRelative = req.path.slice(base.length);
        const pathToFileAbsolute = path_1.default.resolve(staticPathToDirectory, pathToFileRelative);
        try {
            // serve static file otherwise throw an error
            res.contentType(path_1.default.basename(pathToFileAbsolute)).sendFile(pathToFileAbsolute);
            verbose && logger_1.default.success('Static file successfully resolved', 1);
        }
        catch (error) {
            verbose && logger_1.default.error(`Failed to serve static file: ${error.message}`, 1);
            next(error);
        }
    });
}
exports.default = createStaticMiddleware;
