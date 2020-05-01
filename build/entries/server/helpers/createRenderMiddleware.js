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
const colors_1 = __importDefault(require("colors"));
const resolveTemplateRepresentative_1 = __importDefault(require("./resolveTemplateRepresentative"));
const resolveNormalizedPath_1 = __importDefault(require("../../../helpers/resolveNormalizedPath"));
const resolveRedirect_1 = __importDefault(require("./resolveRedirect"));
const resolveResponse_1 = __importDefault(require("./resolveResponse"));
const Redirect_1 = __importDefault(require("../models/Redirect"));
const Response_1 = __importDefault(require("../models/Response"));
const resolveCandidate_1 = __importDefault(require("./resolveCandidate"));
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
    const base = resolveNormalizedPath_1.default(options.base);
    const preload = options.preload || (() => Promise.resolve({}));
    // create preload helpers
    const redirect = resolveRedirect_1.default;
    const response = resolveResponse_1.default;
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
    const { original, clone } = resolveTemplateRepresentative_1.default(pathToTemplate, targetSelector);
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const path = resolveNormalizedPath_1.default(req.path);
        const inner = resolveNormalizedPath_1.default(path.slice(base.length));
        const query = req.query;
        const location = { base, path, inner, query };
        // serve render only from desired base
        if (path.indexOf(base) !== 0) {
            return next();
        }
        // preload component data
        let result;
        try {
            result = yield preload(location, resolveCandidate_1.default, helpers);
        }
        catch (error) {
            console.log(colors_1.default.red(`Preload error: ${error.message}`));
            return next(error);
        }
        if (result instanceof Redirect_1.default) {
            return res.redirect(result.status, result.url);
        }
        if (result instanceof Response_1.default) {
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
            console.log(colors_1.default.red(`Render error: ${error.message}`));
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
exports.default = createRenderMiddleware;
