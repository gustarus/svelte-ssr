import fs from 'fs';
import parser from 'node-html-parser';
export default function resolveTemplateRepresentative(pathToTemplate, targetSelector) {
    const original = {};
    const clone = {};
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
    return {
        original: original,
        clone: clone,
    };
}
