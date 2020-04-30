"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// extract process arguments
const yargs_1 = __importDefault(require("yargs"));
const { base } = yargs_1.default.argv;
function resolveDesiredBase(option) {
    return option || base || '/';
}
exports.default = resolveDesiredBase;
