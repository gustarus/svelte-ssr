"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const listenToExit_1 = __importDefault(require("./listenToExit"));
function cleanServerInstanceOnExit(server) {
    listenToExit_1.default(() => server.close());
}
exports.default = cleanServerInstanceOnExit;
;
