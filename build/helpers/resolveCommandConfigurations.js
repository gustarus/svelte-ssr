"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const displayCommandStep_1 = __importDefault(require("./displayCommandStep"));
async function resolveCommandConfigurations(cmd) {
    displayCommandStep_1.default(cmd, colors_1.default.yellow(`Resolve bundler path to config files...`));
    return { client: cmd.clientConfig, server: cmd.serverConfig };
}
exports.default = resolveCommandConfigurations;
