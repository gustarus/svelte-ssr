"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolvePackagePath_1 = __importDefault(require("./helpers/resolvePackagePath"));
exports.PATH_ROOT = resolvePackagePath_1.default(__dirname);
exports.PATH_PROJECT = resolvePackagePath_1.default(process.cwd());
exports.ENTRY_CLIENT = 'client';
exports.ENTRY_SERVER = 'server';
