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
exports.DEFAULT_PORT_NODE = '3000';
exports.DEFAULT_PORT_CLIENT = '8080';
exports.DEFAULT_PORT_SERVER = '8081';
exports.DEFAULT_OPTIONS = {
    bundler: {
        flag: '-b, --bundler <webpack>',
        description: 'Which tool to use to bundle assets (only webpack is supported right now)',
    },
    nodePort: {
        flag: '-p --node-port <3000>',
        description: 'Port to listen for server side rendering server',
    },
    clientConfig: {
        flag: '-c, --client-config <config.client.js>',
        description: 'Path to bundler tool client config',
    },
    clientPort: {
        flag: '--client-port <8080>',
        description: 'Port to listen for client bundler',
    },
    serverConfig: {
        flag: '-s --server-config <config.server.js>',
        description: 'Path to bundler tool server config',
    },
    serverPort: {
        flag: '--server-port <8081>',
        description: 'Port to listen for server bundler',
    },
};
