"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolveNormalizedUrl_1 = __importDefault(require("./resolveNormalizedUrl"));
function resolveNormalizedUrlWithBase(base, url) {
    return resolveNormalizedUrl_1.default(`${base}/${url}`);
}
exports.default = resolveNormalizedUrlWithBase;
