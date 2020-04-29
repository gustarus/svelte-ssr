"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const node_html_parser_1 = require("node-html-parser");
const mock = async function () {
    return {};
};
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
    const { component, preload, pathToTemplate, target } = options;
    if (!component) {
        throw new Error('Option \'component\' is required for this middleware: please, pass svelte component built for server side rendering');
    }
    if (!pathToTemplate) {
        throw new Error('Option \'pathToTemplate\' is required for this middleware: please, pass path to final index template file');
    }
    if (!target) {
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
            original.dom = node_html_parser_1.parse(template);
            clone.dom = node_html_parser_1.parse(template);
            // resolve head
            original.head = original.dom.querySelector('head');
            clone.head = clone.dom.querySelector('head');
            if (!original.head || !clone.head) {
                throw new Error('Unable to find head html element inside the template');
            }
            original.target = original.dom.querySelector(target);
            clone.target = clone.dom.querySelector(target);
            if (!original.target || !clone.target) {
                throw new Error('Unable to find target html element inside the template');
            }
        }
        return {
            original: original,
            clone: clone,
        };
    }
    return (req, res) => {
        const { path, query } = req;
        const { original, clone } = resolveTemplateRepresentative();
        const location = { path, query };
        // preload application data
        const processor = preload || mock;
        processor(location).then((data) => {
            // render application with loaded data
            const props = { ...location, ...data };
            const { head, html } = component.render(props);
            // set clone content from original one with rendered one
            const propsScript = `<script type="text/javascript">window.$$props = ${JSON.stringify(props)};</script>`;
            clone.head.set_content(`${propsScript}${original.head.innerHTML}${head}`, { script: true, style: true });
            clone.target.set_content(html, { script: true, style: true });
            res.contentType('text/html')
                .send(clone.dom.toString());
        }).catch((error) => res.sendStatus(500).send(error));
    };
}
exports.default = createRenderMiddleware;
