import { Command } from 'commander';

export type TDefaultCommand = Command & {
  bundler?: 'webpack';
  nodePort?: string;
  clientConfig?: string;
  clientPort?: string;
  serverConfig?: string;
  serverPort?: string;
};
