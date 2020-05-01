"use strict";
// these exports could be used inside client script which runs in browser
// do not add something related to node js in exports like `fs` package
// if you do this - you get an error in browser because no node js in browsers
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolveNormalizedPath_1 = __importDefault(require("./build/helpers/resolveNormalizedPath"));
exports.resolveNormalizedPath = resolveNormalizedPath_1.default;
