"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const detect = require('detect-port');
function resolveAvailablePort(port) {
    return new Promise((resolve, reject) => {
        detect(port, (error, available) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ requested: port, available });
        });
    });
}
exports.default = resolveAvailablePort;
