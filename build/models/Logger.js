"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const moment_1 = __importDefault(require("moment"));
const Component_1 = __importDefault(require("../base/Component"));
class Logger extends Component_1.default {
    log(level = 0, message, wrapper) {
        const timestamp = moment_1.default().format('HH:mm:ss');
        const space = '  '.repeat(level);
        const wrapped = wrapper(message.toString());
        console.log(`[${timestamp}]${space}${wrapped}`);
    }
    trace(message, level) {
        this.log(level, message, (message) => message);
    }
    info(message, level) {
        this.log(level, message, (message) => colors_1.default.blue(message));
    }
    warning(message, level) {
        this.log(level, message, (message) => colors_1.default.yellow(message));
    }
    success(message, level) {
        this.log(level, message, (message) => colors_1.default.green(message));
    }
    error(message, level) {
        this.log(level, message, (message) => colors_1.default.red(message));
    }
    debug(...data) {
        console.log(...data);
    }
}
exports.default = Logger;
;
