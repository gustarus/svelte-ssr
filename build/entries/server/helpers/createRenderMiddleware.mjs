var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import resolveTemplateRepresentative from './resolveTemplateRepresentative';
import resolveNormalizedPath from '../../../helpers/resolveNormalizedPath';
import resolveRedirect from './resolveRedirect';
import resolveResponse from './resolveResponse';
import RedirectCandidate from '../models/Redirect';
import ResponseCandidate from '../models/Response';
import resolveCandidate from './resolveCandidate';
import logger from '../../../instances/logger';
import resolveRenderProperties from './resolveRenderProperties';
import resolveNormalizedUrlWithBase from '../../../helpers/resolveNormalizedUrlWithBase';
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
export default function createRenderMiddleware(options) {
    const { component, pathToTemplate, targetSelector } = options;
    const componentProps = options.componentProps || {};
    const base = resolveNormalizedPath(options.base);
    const preload = options.preload || (() => Promise.resolve({}));
    const verbose = typeof options.verbose !== 'undefined' ? options.verbose : false;
    const debug = typeof options.debug !== 'undefined' ? options.debug : false;
    // create preload helpers
    const redirect = resolveRedirect;
    const response = resolveResponse;
    const helpers = { redirect, response };
    logger.info(`Use render middleware to serve server side rendering results from '${base}'`);
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
    const { original, clone } = resolveTemplateRepresentative(pathToTemplate, targetSelector);
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const path = resolveNormalizedPath(req.path);
        const inner = resolveNormalizedPath(path.slice(base.length));
        const query = req.query;
        const location = { base, path, inner, query };
        verbose && logger.trace(`Render request candidate: '${req.path}'`);
        // serve render only from desired base
        if (path.indexOf(base) !== 0) {
            verbose && logger.warning(`Request is outside of the base path '${base}'`, 1);
            return next();
        }
        // preload component data
        let result;
        try {
            result = yield preload(location, resolveCandidate, helpers);
            verbose && logger.success('Preload request successfully performed', 1);
            debug && logger.inspect(result);
        }
        catch (error) {
            verbose && logger.error(`Preload request failed: ${error.message}`, 1);
            return next(error);
        }
        if (result instanceof RedirectCandidate) {
            let urlResolved;
            if (result.url.indexOf('/') === 0) {
                // redirect url is relative
                urlResolved = resolveNormalizedUrlWithBase(base, result.url);
                verbose && logger.trace(`Preload request returned redirect to '${result.url}' with status '${result.status}' but actual redirect will be '${urlResolved}' because of the base path`, 1);
            }
            else {
                // redirect url is absolute
                urlResolved = result.url;
                verbose && logger.trace(`Preload request returned absolute redirect to '${result.url}' with status '${result.status}'`, 1);
            }
            return res.redirect(result.status, urlResolved);
        }
        if (result instanceof ResponseCandidate) {
            verbose && logger.trace(`Preload request returned plain response: '${result.body}' with status '${result.status}'`, 1);
            return res.status(result.status).send(result.body);
        }
        // resolve render component props
        const { props, conflicts } = resolveRenderProperties(location, result, componentProps);
        if (conflicts.location.length) {
            const strings = conflicts.location.map((name) => `'${name}'`);
            verbose && logger.warning(`Component properties conflict detected: properties from resolved location ${strings.join(', ')} will be overridden`, 1);
        }
        if (conflicts.result.length) {
            const strings = conflicts.result.map((name) => `'${name}'`);
            verbose && logger.warning(`Component properties conflict detected: properties from preload result ${strings.join(', ')} will be overridden`, 1);
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
            verbose && logger.error(`Render failed: '${error.message}'`, 1);
            return next(error);
        }
        // set clone content from original one with rendered one
        const baseTag = `<base href="${base}" />`;
        const propsScript = `<script type="text/javascript">window.$$props = ${JSON.stringify(props)};</script>`;
        clone.head.set_content(`${baseTag}${propsScript}${original.head.innerHTML}${head}`, {
            script: true,
            style: true,
        });
        clone.target.set_content(html, { script: true, style: true });
        // send rendered result
        verbose && logger.success('Render successfully performed', 1);
        res.contentType('text/html')
            .send(clone.dom.toString());
    });
}
