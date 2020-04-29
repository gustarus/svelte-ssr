"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const displayCommandStep_1 = __importDefault(require("./displayCommandStep"));
const resolveBundlerByCode_1 = __importDefault(require("./resolveBundlerByCode"));
async function resolveCommandBundler(cmd) {
    displayCommandStep_1.default(cmd, colors_1.default.yellow(`Resolve bundler with code '${cmd.bundler}' from collection...`));
    if (!cmd.bundler) {
        throw new Error('Unable to resolve \'bundler\' option from the command');
    }
    return resolveBundlerByCode_1.default(cmd.bundler);
}
exports.default = resolveCommandBundler;
