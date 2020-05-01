"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const constants_1 = require("../../../constants");
const { host, port, base, staticProxyPort, staticPathToDirectory } = yargs_1.default.options({
    host: { type: 'string', default: constants_1.DEFAULT_LISTEN_HOST },
    port: { type: 'number', default: constants_1.DEFAULT_LISTEN_PORT },
    base: { type: 'string', default: constants_1.DEFAULT_LISTEN_BASE },
    staticProxyPort: { type: 'number' },
    staticPathToDirectory: { type: 'string' },
}).argv;
function resolveCommandOptions() {
    return { host, port, base, staticProxyPort, staticPathToDirectory };
}
exports.default = resolveCommandOptions;
