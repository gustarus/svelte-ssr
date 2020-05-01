"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redirect_1 = __importDefault(require("../models/Redirect"));
const Response_1 = __importDefault(require("../models/Response"));
function resolveCandidate(candidate, prepare) {
    if (candidate instanceof Redirect_1.default) {
        return candidate;
    }
    if (candidate instanceof Response_1.default) {
        return candidate;
    }
    return prepare ? prepare(candidate) : candidate;
}
exports.default = resolveCandidate;
