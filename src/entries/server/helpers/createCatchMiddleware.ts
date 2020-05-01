import { NextFunction, Request, Response } from 'express';
import logger from '../../../instances/logger';

type TOptions = {
  verbose?: boolean;
};

/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
export default function createCatchMiddleware(options: TOptions = {}): (error: Error, req: Request, res: Response, next: NextFunction) => Promise<any> {
  const verbose = typeof options.verbose !== 'undefined' ? options.verbose : false;

  logger.info('Use catch middleware to serve errors');

  return async(error: Error, req: Request, res: Response, next: NextFunction): Promise<any> => {
    verbose && logger.error(error);
    const body = verbose ? error.toString() : undefined;
    res.status(500).send(body);
  };
}
