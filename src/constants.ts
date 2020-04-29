import resolvePackagePath from './helpers/resolvePackagePath';

export const PATH_ROOT = resolvePackagePath(__dirname);
export const PATH_PROJECT = resolvePackagePath(process.cwd());

export const ENTRY_CLIENT = 'client';
export const ENTRY_SERVER = 'server';
