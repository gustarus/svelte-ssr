"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../../../base/Component"));
class Response extends Component_1.default {
    // @ts-ignore
    set status(value) {
        this._status = parseInt(value.toString(), 10);
    }
    // @ts-ignore
    get status() {
        return this._status;
    }
    get defaults() {
        return {
            status: 200,
            body: '',
        };
    }
}
exports.default = Response;
;
