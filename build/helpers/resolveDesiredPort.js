"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const { port } = yargs_1.default.argv;
function resolveDesiredPort(option) {
    return parseInt(option || port || '3000', 10);
}
exports.default = resolveDesiredPort;
