"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("./Model"));
class Component extends Model_1.default {
    constructor(config) {
        super();
        this.configure(config);
    }
    get defaults() {
        return {};
    }
    configure(custom = {}) {
        // merge configuration with filter by undefined
        const config = this.defaults;
        for (const name in custom) {
            if (typeof custom[name] !== 'undefined') {
                config[name] = custom[name];
            }
        }
        // pass configuration to the instance
        for (const name in config) {
            if (typeof config[name] !== 'undefined') {
                this[name] = config[name];
            }
        }
        return this;
    }
}
exports.default = Component;
;
