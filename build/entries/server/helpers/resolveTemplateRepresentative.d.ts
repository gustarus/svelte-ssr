import { HTMLElement } from 'node-html-parser';
declare type TTemplateRepresentative = {
    dom: HTMLElement;
    head: HTMLElement;
    target: HTMLElement;
};
export default function resolveTemplateRepresentative(pathToTemplate: string, targetSelector: string): {
    original: TTemplateRepresentative;
    clone: TTemplateRepresentative;
};
export {};
