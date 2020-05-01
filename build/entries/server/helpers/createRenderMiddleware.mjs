import fs from 'fs';
import parser from 'node-html-parser';
const defaultRedirectOptions = { status: 302 };
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
    const { base, component, pathToTemplate, targetSelector } = options;
    const preload = options.preload || (() => Promise.resolve({}));
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
    const original = {};
    const clone = {};
    /**
     * Ensure dom and target nodes.
     * @returns {{ original: {dom: HTMLElement, head: HTMLElement, target: HTMLElement}, clone: {dom: HTMLElement, head: HTMLElement, target: HTMLElement} }}
     */
    function resolveTemplateRepresentative() {
        if (!original.dom || !clone.dom) {
            if (!fs.existsSync(pathToTemplate)) {
                throw new Error(`Unable to find file for the template: looking for '${pathToTemplate}'`);
            }
            // read the template from the file
            const template = fs.readFileSync(pathToTemplate).toString();
            // parse template into dom
            // @ts-ignore
            original.dom = parser.parse(template);
            // @ts-ignore
            clone.dom = parser.parse(template);
            // resolve head
            original.head = original.dom.querySelector('head');
            clone.head = clone.dom.querySelector('head');
            if (!original.head || !clone.head) {
                throw new Error('Unable to find head html element inside the template');
            }
            original.target = original.dom.querySelector(targetSelector);
            clone.target = clone.dom.querySelector(targetSelector);
            if (!original.target || !clone.target) {
                throw new Error('Unable to find target html element inside the template');
            }
        }
        return {
            original: original,
            clone: clone,
        };
    }
    /**
     * Execute server redirect.
     * @param req
     * @param res
     * @param uri
     * @param customRedirectOptions
     */
    function redirect(req, res, uri, customRedirectOptions = {}) {
        const options = Object.assign(Object.assign({}, defaultRedirectOptions), customRedirectOptions);
        return res.redirect(options.status, uri);
    }
    return (req, res) => {
        const { path, query } = req;
        const { original, clone } = resolveTemplateRepresentative();
        const location = { base, path, query };
        // TODO Match request with base
        // preload application data
        preload(location).then((data) => {
            // render application with loaded data
            const props = Object.assign(Object.assign({}, location), data);
            const { head, html } = component.render(props);
            // set clone content from original one with rendered one
            const baseTag = `<base href="${base}" />`;
            const propsScript = `<script type="text/javascript">window.$$props = ${JSON.stringify(props)};</script>`;
            clone.head.set_content(`${baseTag}${propsScript}${original.head.innerHTML}${head}`, {
                script: true,
                style: true,
            });
            clone.target.set_content(html, { script: true, style: true });
            res.contentType('text/html')
                .send(clone.dom.toString());
        }).catch((error) => res.sendStatus(500).send(error));
    };
}
