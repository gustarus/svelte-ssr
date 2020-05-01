var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import colors from 'colors';
import resolveTemplateRepresentative from './resolveTemplateRepresentative';
import resolveNormalizedPath from '../../../helpers/resolveNormalizedPath';
import resolveRedirect from './resolveRedirect';
import resolveResponse from './resolveResponse';
import RedirectCandidate from '../models/Redirect';
import ResponseCandidate from '../models/Response';
import resolveCandidate from './resolveCandidate';
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
    const base = resolveNormalizedPath(options.base);
    const preload = options.preload || (() => Promise.resolve({}));
    // create preload helpers
    const redirect = resolveRedirect;
    const response = resolveResponse;
    const helpers = { redirect, response };
    console.log(`Use render middleware to serve server side rendering results from '${base}'`);
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
        // serve render only from desired base
        if (path.indexOf(base) !== 0) {
            return next();
        }
        // preload component data
        let result;
        try {
            result = yield preload(location, resolveCandidate, helpers);
        }
        catch (error) {
            console.log(colors.red(`Preload error: ${error.message}`));
            return next(error);
        }
        if (result instanceof RedirectCandidate) {
            return res.redirect(result.status, result.url);
        }
        if (result instanceof ResponseCandidate) {
            return res.status(result.status).send(result.body);
        }
        // render component with preloaded data
        const props = Object.assign(Object.assign({}, location), result);
        let head;
        let html;
        try {
            const rendered = component.render(props);
            head = rendered.head;
            html = rendered.html;
        }
        catch (error) {
            console.log(colors.red(`Render error: ${error.message}`));
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
        res.contentType('text/html')
            .send(clone.dom.toString());
    });
}
