"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const displayCommandStep_1 = __importDefault(require("./displayCommandStep"));
const resolveAvailablePort_1 = __importDefault(require("./resolveAvailablePort"));
const constants_1 = require("../constants");
function resolveCommandPorts(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        displayCommandStep_1.default(cmd, colors_1.default.yellow('Resolve available server port to launch the tool...'));
        const nodePort = yield resolveAvailablePort_1.default(cmd.nodePort || constants_1.DEFAULT_PORT_NODE);
        const clientPort = yield resolveAvailablePort_1.default(cmd.clientPort || constants_1.DEFAULT_PORT_CLIENT);
        const serverPort = yield resolveAvailablePort_1.default(cmd.serverPort || constants_1.DEFAULT_PORT_SERVER);
        return {
            node: nodePort.available,
            client: clientPort.available,
            server: serverPort.available,
        };
    });
}
exports.default = resolveCommandPorts;
