"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolveNormalizedPath(path) {
    const cleaned = path
        .replace(/\/\/+/g, '/')
        .replace(/\/$/, '')
        .replace(/^\//, '');
    return `/${cleaned ? `${cleaned}/` : ''}`;
}
exports.default = resolveNormalizedPath;
