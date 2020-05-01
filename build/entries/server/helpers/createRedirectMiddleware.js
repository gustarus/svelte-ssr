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
const constants_1 = require("../../../constants");
const resolveNormalizedPath_1 = __importDefault(require("../../../helpers/resolveNormalizedPath"));
const logger_1 = __importDefault(require("../../../instances/logger"));
const resolveNormalizedPathWithBase_1 = __importDefault(require("../../../helpers/resolveNormalizedPathWithBase"));
/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
function createRedirectMiddleware(options) {
    const base = resolveNormalizedPath_1.default(options.base);
    const url = options.url || constants_1.DEFAULT_REDIRECT_URL;
    const resolved = resolveNormalizedPathWithBase_1.default(base, url);
    const status = options.status
        ? parseInt(options.status.toString(), 10)
        : constants_1.DEFAULT_REDIRECT_STATUS;
    const verbose = typeof options.verbose !== 'undefined' ? options.verbose : false;
    logger_1.default.info(`Use redirect middleware to redirect unhandled requests to '${resolved}'`);
    if (!base) {
        throw new Error('Option \'base\' is required to serve redirect responses');
    }
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const path = resolveNormalizedPath_1.default(req.path);
        verbose && logger_1.default.trace(`Redirect request candidate: '${req.path}'`);
        // serve redirects only from desired base
        if (path.indexOf(base) !== 0) {
            verbose && logger_1.default.warning(`Request is outside of the base path '${base}'`, 1);
            return next();
        }
        verbose && logger_1.default.success(`Perform redirect to '${resolved}' with status '${status}'`, 1);
        res.redirect(status, resolved);
    });
}
exports.default = createRedirectMiddleware;
