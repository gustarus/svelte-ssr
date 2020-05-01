"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../../../base/Component"));
class Response extends Component_1.default {
    get defaults() {
        return {
            status: 200,
            body: '',
        };
    }
}
exports.default = Response;
;