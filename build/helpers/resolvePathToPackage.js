"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function resolvePathToPackage(directory) {
    const possible = path_1.default.resolve(directory, 'package.json');
    if (fs_extra_1.default.existsSync(possible)) {
        return directory;
    }
    // if we are already in the tree root
    if (directory === '/') {
        return undefined;
    }
    // step out of the current directory
    const parent = path_1.default.dirname(directory);
    return resolvePathToPackage(parent);
}
exports.default = resolvePathToPackage;
