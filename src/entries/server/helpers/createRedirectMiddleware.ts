import { NextFunction, Request, Response } from 'express';
import { DEFAULT_REDIRECT_STATUS, DEFAULT_REDIRECT_URL } from '../../../constants';
import resolveNormalizedPath from '../../../helpers/resolveNormalizedPath';

type TOptions = {
  base: string,
  url?: string;
  status?: number;
};

/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
export default function createRedirectMiddleware(options: TOptions): (req: Request, res: Response, next: NextFunction) => Promise<any> {
  const base = resolveNormalizedPath(options.base);
  const url = options.url || DEFAULT_REDIRECT_URL;
  const resolved = resolveNormalizedPath(`${base}/${url}`);
  const status = options.status || DEFAULT_REDIRECT_STATUS;

  console.log(`Use redirect middleware to redirect all requests to '${resolved}'`);

  if (!base) {
    throw new Error('Option \'base\' is required to serve redirect responses');
  }

  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const path = resolveNormalizedPath(req.path);

    // serve redirects only from desired base
    if (path.indexOf(base) !== 0) {
      return next();
    }

    res.redirect(status, resolved);
  };
}
