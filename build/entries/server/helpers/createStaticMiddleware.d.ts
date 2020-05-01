import { NextFunction, Request, Response } from 'express';
declare type TOptions = {
    base: string;
    staticProxyPort?: number;
    staticPathToDirectory?: string;
};
/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
export default function createStaticMiddleware(options: TOptions): (req: Request, res: Response, next: NextFunction) => void;
export {};
