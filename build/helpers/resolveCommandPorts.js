"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const displayCommandStep_1 = __importDefault(require("./displayCommandStep"));
const resolveAvailablePort_1 = __importDefault(require("./resolveAvailablePort"));
const constants_1 = require("../constants");
async function resolveCommandPorts(cmd) {
    displayCommandStep_1.default(cmd, colors_1.default.yellow('Resolve available server port to launch the tool...'));
    const nodePort = await resolveAvailablePort_1.default(cmd.nodePort || constants_1.DEFAULT_PORT_NODE);
    const clientPort = await resolveAvailablePort_1.default(cmd.clientPort || constants_1.DEFAULT_PORT_CLIENT);
    const serverPort = await resolveAvailablePort_1.default(cmd.serverPort || constants_1.DEFAULT_PORT_SERVER);
    return {
        node: nodePort.available,
        client: clientPort.available,
        server: serverPort.available,
    };
}
exports.default = resolveCommandPorts;
