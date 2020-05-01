"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolveRenderProperties(location, result, custom) {
    const conflictsWithLocation = [];
    const conflictsWithResult = [];
    for (const name in result) {
        if (typeof location[name] !== 'undefined') {
            conflictsWithLocation.push(name);
        }
    }
    for (const name in custom) {
        if (typeof location[name] !== 'undefined') {
            conflictsWithLocation.push(name);
        }
        if (typeof result[name] !== 'undefined') {
            conflictsWithResult.push(name);
        }
    }
    const props = Object.assign({}, location);
    for (const name in result) {
        if (typeof result[name] !== 'undefined') {
            props[name] = result[name];
        }
    }
    for (const name in custom) {
        if (typeof custom[name] !== 'undefined') {
            props[name] = custom[name];
        }
    }
    return { props, conflicts: { location: conflictsWithLocation, result: conflictsWithResult } };
}
exports.default = resolveRenderProperties;
