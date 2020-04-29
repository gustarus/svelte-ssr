"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolveLocationNormalizedPath(path) {
    const cleaned = path
        .replace(/\/\/+/g, '/')
        .replace(/\/$/, '')
        .replace(/^\//, '');
    return `/${cleaned ? `${cleaned}/` : ''}`;
}
exports.default = resolveLocationNormalizedPath;
