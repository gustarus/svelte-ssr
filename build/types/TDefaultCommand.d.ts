import { Command } from 'commander';
export declare type TDefaultCommand = Command & {
    bundler?: 'webpack';
    nodePort?: string;
    clientConfig?: string;
    clientPort?: string;
    serverConfig?: string;
    serverPort?: string;
};
