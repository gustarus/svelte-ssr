"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redirect_1 = __importDefault(require("../models/Redirect"));
function resolveRedirect(status, url) {
    return new Redirect_1.default({ status, url });
}
exports.default = resolveRedirect;
