"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addWebpackProductionHash(template, isProductionMode = false) {
    return isProductionMode ? template.replace('[name]', '[name].[hash]') : template;
}
exports.default = addWebpackProductionHash;
