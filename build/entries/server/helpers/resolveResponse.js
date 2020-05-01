"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = __importDefault(require("../models/Response"));
function resolveResponse(status, body) {
    return new Response_1.default({ status, body });
}
exports.default = resolveResponse;
