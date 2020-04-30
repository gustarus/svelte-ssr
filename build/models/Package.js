"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Source_1 = __importDefault(require("../base/Source"));
class Package extends Source_1.default {
    get data() {
        const content = fs_1.default.readFileSync(this.path).toString();
        return JSON.parse(content);
    }
    get name() {
        return this.data.name;
    }
    get version() {
        return this.data.version;
    }
    get cli() {
        return this.data.bin[this.name];
    }
}
exports.default = Package;
