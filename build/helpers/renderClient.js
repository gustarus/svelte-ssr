"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create clean express server.
 * {
 *   component: svelte frontend component,
 *   target: html selector to render component inside,
 * }
 */
function renderClient(options) {
    const { component, target, props = {} } = options;
    if (!component) {
        throw new Error('Option \'component\' should be passed: please, define svelte component to render inside the target');
    }
    if (!target) {
        throw new Error('Option \'target\' should be passed: please, define html selector to render component inside');
    }
    const el = document.querySelector(target);
    if (!el) {
        throw new Error(`Unable to find target html element for selector '${target}'`);
    }
    // resolve props from server side rendering
    const resolved = typeof window !== 'undefined' && typeof window.$$props !== 'undefined'
        ? window.$$props : {};
    // merge server side rendering props with client props
    for (const name in props) {
        resolved[name] = typeof props[name] !== 'undefined'
            ? props[name] : resolved[name];
    }
    // clean target element
    el.innerHTML = '';
    // TODO Use hydrate flag to update elements instead of rerender them
    // create component inside the target node
    // @ts-ignore
    new component({ target: el, props: resolved });
}
exports.default = renderClient;
