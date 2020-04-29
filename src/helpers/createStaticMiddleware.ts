import yargs from 'yargs';
import { NextFunction, Request, Response } from 'express';
import httpProxy from 'http-proxy';
import Server = require('http-proxy');

// extract process arguments
const { staticProxyPort } = yargs.argv;

/**
 * Create middleware to serve static files.
 * If there is a client development server running we are using proxy to serve files.
 * Client development server port will be taken from node js server launch arguments.
 */
export default function createStaticMiddleware(): (req: Request, res: Response, next: NextFunction) => void {
  let staticProxy: Server | undefined;
  if (staticProxyPort) {
    // create static assets proxy service to resolve assets from client development server
    console.log(`Serve static files from client process running on port ${staticProxyPort}`);
    staticProxy = httpProxy.createProxyServer({
      target: `http://localhost:${staticProxyPort}`,
    });
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    // if request is a path to file
    if (!req.path.match(/\.\w+$/)) {
      return next();
    }

    // if file should be served from the client development server
    if (staticProxy) {
      staticProxy.web(req, res);
      return;
    }

    res.contentType(req.path).sendFile(req.path);
  };
}
