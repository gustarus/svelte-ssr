"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const node_html_parser_1 = __importDefault(require("node-html-parser"));
function resolveTemplateRepresentative(pathToTemplate, targetSelector) {
    const original = {};
    const clone = {};
    if (!fs_1.default.existsSync(pathToTemplate)) {
        throw new Error(`Unable to find file for the template: looking for '${pathToTemplate}'`);
    }
    // read the template from the file
    const template = fs_1.default.readFileSync(pathToTemplate).toString();
    // parse template into dom
    // @ts-ignore
    original.dom = node_html_parser_1.default.parse(template);
    // @ts-ignore
    clone.dom = node_html_parser_1.default.parse(template);
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
    return {
        original: original,
        clone: clone,
    };
}
exports.default = resolveTemplateRepresentative;
