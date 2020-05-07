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
const aes_1 = __importDefault(require("crypto-js/aes"));
const resolveTemplateRepresentative_1 = __importDefault(require("./resolveTemplateRepresentative"));
const resolveNormalizedPath_1 = __importDefault(require("../../../helpers/resolveNormalizedPath"));
const resolveRedirect_1 = __importDefault(require("./resolveRedirect"));
const resolveResponse_1 = __importDefault(require("./resolveResponse"));
const Redirect_1 = __importDefault(require("../models/Redirect"));
const Response_1 = __importDefault(require("../models/Response"));
const resolveCandidate_1 = __importDefault(require("./resolveCandidate"));
const logger_1 = __importDefault(require("../../../instances/logger"));
const resolveRenderProperties_1 = __importDefault(require("./resolveRenderProperties"));
const resolveNormalizedUrlWithBase_1 = __importDefault(require("../../../helpers/resolveNormalizedUrlWithBase"));
const constants_1 = require("../../../constants");
/**
 * Create middleware to render application from template with desired options.
 * {
 *  component: svelte component with render generated for server side rendering,
 *  preload: callback to preload component data,
 *  pathToTemplate: path to html template file,
 *  target: html element target selector,
 *  }
 * @param options
 */
function createRenderMiddleware(options) {
    const { component, pathToTemplate, targetSelector } = options;
    const componentProps = options.componentProps || {};
    const base = resolveNormalizedPath_1.default(options.base);
    const preload = options.preload || (() => Promise.resolve({}));
    const secretSalt = options.secretSalt || constants_1.DEFAULT_SECRET_SALT;
    const removeWhitespace = typeof options.removeWhitespace !== 'undefined' ? options.removeWhitespace : false;
    const verbose = typeof options.verbose !== 'undefined' ? options.verbose : false;
    const debug = typeof options.debug !== 'undefined' ? options.debug : false;
    // create preload helpers
    const redirect = resolveRedirect_1.default;
    const response = resolveResponse_1.default;
    const helpers = { redirect, response };
    logger_1.default.info(`Use render middleware to serve server side rendering results from '${base}'`);
    if (!base) {
        throw new Error('Option \'base\' is required to serve server side rendering results');
    }
    if (!component) {
        throw new Error('Option \'component\' is required for this middleware: please, pass svelte component built for server side rendering');
    }
    if (!pathToTemplate) {
        throw new Error('Option \'pathToTemplate\' is required for this middleware: please, pass path to final index template file');
    }
    if (!targetSelector) {
        throw new Error('Option \'target\' is required for this middleware: please, pass target html element selector');
    }
    // save dom nodes to the variables
    const { original, clone } = resolveTemplateRepresentative_1.default(pathToTemplate, targetSelector);
    // remove whitespaces in initial representatives
    removeWhitespace && original.dom.removeWhitespace();
    removeWhitespace && clone.dom.removeWhitespace();
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const path = resolveNormalizedPath_1.default(req.path);
        const inner = resolveNormalizedPath_1.default(path.slice(base.length));
        const query = req.query;
        const location = { base, path, inner, query };
        verbose && logger_1.default.trace(`Render request candidate: '${req.path}'`);
        // serve render only from desired base
        if (path.indexOf(base) !== 0) {
            verbose && logger_1.default.warning(`Request is outside of the base path '${base}'`, 1);
            return next();
        }
        // preload component data
        let result;
        try {
            result = yield preload(location, resolveCandidate_1.default, helpers);
            verbose && logger_1.default.success('Preload request successfully performed', 1);
            debug && logger_1.default.inspect(result);
        }
        catch (error) {
            verbose && logger_1.default.error(`Preload request failed: ${error.message}`, 1);
            return next(error);
        }
        if (result instanceof Redirect_1.default) {
            let urlResolved;
            if (result.url.indexOf('/') === 0) {
                // redirect url is relative
                urlResolved = resolveNormalizedUrlWithBase_1.default(base, result.url);
                verbose && logger_1.default.trace(`Preload request returned redirect to '${result.url}' with status '${result.status}' but actual redirect will be '${urlResolved}' because of the base path`, 1);
            }
            else {
                // redirect url is absolute
                urlResolved = result.url;
                verbose && logger_1.default.trace(`Preload request returned absolute redirect to '${result.url}' with status '${result.status}'`, 1);
            }
            return res.redirect(result.status, urlResolved);
        }
        if (result instanceof Response_1.default) {
            verbose && logger_1.default.trace(`Preload request returned plain response: '${result.body}' with status '${result.status}'`, 1);
            return res.status(result.status).send(result.body);
        }
        // resolve render component props
        const { props, conflicts } = resolveRenderProperties_1.default(location, result, componentProps);
        if (conflicts.location.length) {
            const strings = conflicts.location.map((name) => `'${name}'`);
            verbose && logger_1.default.warning(`Component properties conflict detected: properties from resolved location ${strings.join(', ')} will be overridden`, 1);
        }
        if (conflicts.result.length) {
            const strings = conflicts.result.map((name) => `'${name}'`);
            verbose && logger_1.default.warning(`Component properties conflict detected: properties from preload result ${strings.join(', ')} will be overridden`, 1);
        }
        // render component with preloaded data
        let head;
        let html;
        try {
            const rendered = component.render(props);
            head = rendered.head;
            html = rendered.html;
        }
        catch (error) {
            verbose && logger_1.default.error(`Render failed: '${error.message}'`, 1);
            return next(error);
        }
        // create base script tag
        const baseTag = `<base href="${base}" />`;
        // encrypt properties with basic encryption method
        // because it may store spam bots sensitive data
        const propsEncrypted = aes_1.default.encrypt(JSON.stringify(props), secretSalt).toString();
        const propsScript = `<script type="text/javascript">window.$$props = ${JSON.stringify(propsEncrypted)};</script>`;
        // set clone content from original one with rendered one
        clone.head.set_content(`${baseTag}${propsScript}${original.head.innerHTML}${head}`, { script: true, style: true });
        clone.target.set_content(html, { script: true, style: true });
        // remove whitespaces in clone representative
        // do it only with changed nodes to reduce memory usage
        clone.head.removeWhitespace();
        clone.target.removeWhitespace();
        // send rendered result
        verbose && logger_1.default.success('Render successfully performed', 1);
        res.contentType('text/html')
            .send(clone.dom.toString());
    });
}
exports.default = createRenderMiddleware;
