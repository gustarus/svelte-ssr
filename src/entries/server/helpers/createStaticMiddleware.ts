import path from 'path';
import { NextFunction, Request, Response } from 'express';
import httpProxy from 'http-proxy';

type TOptions = {
  base: string,
  staticProxyPort?: number;
  staticPathToDirectory?: string;
};

/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
export default function createStaticMiddleware(options: TOptions): (req: Request, res: Response, next: NextFunction) => void {
  const { base, staticProxyPort, staticPathToDirectory } = options;

  let staticProxy: httpProxy | undefined;
  if (staticProxyPort) {
    // create static assets proxy service to resolve assets from client development server
    console.log(`Serve static files from client process running on port ':${staticProxyPort}'`);
    staticProxy = httpProxy.createProxyServer({
      target: `http://localhost:${staticProxyPort}`,
    });
  } else if (staticPathToDirectory) {
    console.log(`Serve static files from folder '${staticPathToDirectory}'`);
  } else {
    throw new Error('Unable to resolve command argument \'staticPathToDirectory\' which is required to serve static files');
  }

  console.log(`Use the following base path to serve assets: '${base}'`);
  return (req: Request, res: Response, next: NextFunction): void => {
    // if request is a path to file
    if (!req.path.match(/\.\w+$/)) {
      return next();
    }

    // if file should be served from the client development server
    if (staticProxy) {
      // TODO Enable in debug mode.
      // console.log(`Serve static file '${req.path}' from proxy`);
      staticProxy.web(req, res);
      return;
    }

    // '/base/name.extension' -> 'name.extension'
    // TODO Enable in debug mode.
    // console.log(`Serve static file '${req.path}' from folder ${req.path.slice(base.length)}`);
    const pathToFileRelative = req.path.slice(base.length);
    const pathToFileAbsolute = path.resolve(staticPathToDirectory as string, pathToFileRelative);
    res.contentType(path.basename(pathToFileAbsolute)).sendFile(pathToFileAbsolute);
  };
}
