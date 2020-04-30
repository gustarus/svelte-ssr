"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function resolvePackagePath(directory) {
    const possible = path_1.default.resolve(directory, 'package.json');
    if (!fs.existsSync(possible)) {
        const parent = path_1.default.dirname(directory);
        return resolvePackagePath(parent);
    }
    return directory;
}
exports.default = resolvePackagePath;
