"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolvePathToPackage_1 = __importDefault(require("./resolvePathToPackage"));
function resolvePathToRoot() {
    return resolvePathToPackage_1.default(__dirname);
}
exports.default = resolvePathToRoot;
