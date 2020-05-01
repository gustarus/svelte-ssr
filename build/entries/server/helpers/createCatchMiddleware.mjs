var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from '../../../instances/logger';
/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
export default function createCatchMiddleware(options = {}) {
    const verbose = typeof options.verbose !== 'undefined' ? options.verbose : false;
    logger.info('Use catch middleware to serve errors');
    return (error, req, res, next) => __awaiter(this, void 0, void 0, function* () {
        verbose && logger.error(error);
        const body = verbose ? error.toString() : undefined;
        res.status(500).send(body);
    });
}
