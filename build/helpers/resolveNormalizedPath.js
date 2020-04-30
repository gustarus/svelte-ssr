"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolveNormalizedPath(...parts) {
    const cleaned = parts.join('/')
        .replace(/\/\/+/g, '/')
        .replace(/\/$/, '')
        .replace(/^\//, '');
    return `/${cleaned ? `${cleaned}/` : ''}`;
}
exports.default = resolveNormalizedPath;
