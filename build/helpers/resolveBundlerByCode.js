"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebpackBundler_1 = __importDefault(require("../bundlers/WebpackBundler"));
const collection = {
    webpack: WebpackBundler_1.default,
};
function resolveBundlerByCode(code) {
    if (!collection[code]) {
        throw new Error(`Unable to resolve bundler by code '${code}'. Only following are allowed: ${Object.keys(collection).join(', ')}`);
    }
    return collection[code];
}
exports.default = resolveBundlerByCode;
