"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const Component_1 = __importDefault(require("./Component"));
const fs_1 = __importDefault(require("fs"));
class Source extends Component_1.default {
    set path(value) {
        this._path = path_1.default.resolve(value);
    }
    get path() {
        return this._path;
    }
    get source() {
        if (!this._source) {
            this._source = fs_1.default.readFileSync(this.path).toString();
        }
        return this._source;
    }
    set source(content) {
        this._source = content;
        this.save();
    }
    save() {
        fs_1.default.writeFileSync(this.path, this.source);
        this.reset();
    }
    reset() {
        delete this._source;
    }
    getPosition(position) {
        const part = this.source.substr(0, position);
        const lines = part.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length;
        return { line, column };
    }
}
exports.default = Source;
