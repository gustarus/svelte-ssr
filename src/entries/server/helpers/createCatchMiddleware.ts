import colors from 'colors';
import { NextFunction, Request, Response } from 'express';

type TOptions = {};

/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
export default function createCatchMiddleware(options: TOptions = {}): (error: Error, req: Request, res: Response, next: NextFunction) => Promise<any> {
  console.log(`Use catch middleware to serve errors`);

  return async (error: Error, req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log(error);
    console.log(colors.red(error.message));
    res.status(500).send(error);
  };
}
