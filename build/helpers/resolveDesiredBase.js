"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const resolveNormalizedPath_1 = __importDefault(require("./resolveNormalizedPath"));
const { base } = yargs_1.default.argv;
function resolveDesiredBase(option) {
    return resolveNormalizedPath_1.default(option || base || '/');
}
exports.default = resolveDesiredBase;
