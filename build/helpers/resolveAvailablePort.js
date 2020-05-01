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
            resolve({
                requested: parseInt(port.toString(), 10),
                available: parseInt(available, 10),
            });
        });
    });
}
exports.default = resolveAvailablePort;
