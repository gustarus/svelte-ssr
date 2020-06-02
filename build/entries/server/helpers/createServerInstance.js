"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createServerInstance(server, port, callback) {
    return server.listen(port, callback);
}
exports.default = createServerInstance;
