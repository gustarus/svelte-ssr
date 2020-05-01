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
const colors_1 = __importDefault(require("colors"));
/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
function createStaticMiddleware(options) {
    const { staticProxyPort, staticPathToDirectory } = options;
    const base = resolveNormalizedPath_1.default(options.base);
    const pattern = options.pattern || /\.\w+$/;
    console.log(`Use static middleware to serve static assets from '${base}'`);
    if (!base) {
        throw new Error('Option \'base\' is required to serve static assets');
    }
    let staticProxy;
    if (staticProxyPort) {
        // create static assets proxy service to resolve assets from client development server
        console.log(`\tServe static files from client process running on port ':${staticProxyPort}'`);
        staticProxy = http_proxy_1.default.createProxyServer({
            target: `http://localhost:${staticProxyPort}`,
        });
    }
    else if (staticPathToDirectory) {
        console.log(`\tServe static files from folder '${staticPathToDirectory}'`);
    }
    else {
        throw new Error('Unable to resolve command argument \'staticPathToDirectory\' which is required to serve static files');
    }
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        // serve static only from desired base
        if (req.path.indexOf(base) !== 0) {
            return next();
        }
        // if request is a path to file
        if (!pattern.test(req.path)) {
            return next();
        }
        // if file should be served from the client development server
        if (staticProxy) {
            staticProxy.web(req, res);
            return;
        }
        // '/base/name.extension' -> 'name.extension'
        const pathToFileRelative = req.path.slice(base.length);
        const pathToFileAbsolute = path_1.default.resolve(staticPathToDirectory, pathToFileRelative);
        try {
            // serve static file otherwise throw an error
            res.contentType(path_1.default.basename(pathToFileAbsolute)).sendFile(pathToFileAbsolute);
        }
        catch (error) {
            console.log(colors_1.default.red(`Serve static file error: ${error.message}`));
            next(error);
        }
    });
}
exports.default = createStaticMiddleware;
