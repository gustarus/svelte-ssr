"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function resolvePackagePath(directory) {
    const possible = path_1.default.resolve(directory, 'package.json');
    if (!fs_extra_1.default.existsSync(possible)) {
        const parent = path_1.default.dirname(directory);
        return resolvePackagePath(parent);
    }
    return directory;
}
exports.default = resolvePackagePath;
