"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolveNormalizedPath_1 = __importDefault(require("./resolveNormalizedPath"));
function resolveNormalizedPathWithBase(base, path) {
    return resolveNormalizedPath_1.default(`${base}/${path}`);
}
exports.default = resolveNormalizedPathWithBase;
