import aes from 'crypto-js/aes';
import { NextFunction, Request, Response } from 'express';
import resolveTemplateRepresentative from './resolveTemplateRepresentative';
import resolveNormalizedPath from '../../../helpers/resolveNormalizedPath';
import resolveRedirect from './resolveRedirect';
import resolveResponse from './resolveResponse';
import RedirectCandidate from '../models/Redirect';
import ResponseCandidate from '../models/Response';
import resolveCandidate from './resolveCandidate';
import logger from '../../../instances/logger';
import resolveRenderProperties from './resolveRenderProperties';
import resolveNormalizedUrlWithBase from '../../../helpers/resolveNormalizedUrlWithBase';
import { DEFAULT_SECRET_SALT } from '../../../constants';

type TSvelteComponentProps = { [key: string]: any };

type TSvelteServerSideComponent = {
  render: (props?: {}, options?: {}) => TSvelteServerSideRenderResult;
}

type TSvelteServerSideRenderResult = {
  head: string;
  html: any;
  css: {
    code: string;
    map: any;
  };
}

type TPreloadCallbackLocation = { base: string; path: string; inner: string; query: { [key: string]: any } };

type TPreloadCallbackHelpers = { redirect: typeof resolveRedirect; response: typeof resolveResponse };

type TPreloadCallbackResult = { [key: string]: any } | RedirectCandidate | ResponseCandidate;

type TPreloadCallback = (location: TPreloadCallbackLocation, resolve: typeof resolveCandidate, helpers: TPreloadCallbackHelpers) => Promise<TPreloadCallbackResult>;

type TOptions = {
  base: string;
  component: TSvelteServerSideComponent;
  componentProps?: TSvelteComponentProps;
  preload?: TPreloadCallback,
  pathToTemplate: string,
  targetSelector: string;
  secretSalt?: string;
  removeWhitespace?: boolean;
  verbose?: boolean;
  debug?: boolean;
};

/**
 * Create middleware to render application from template with desired options.
 * {
 *  component: svelte component with render generated for server side rendering,
 *  preload: callback to preload component data,
 *  pathToTemplate: path to html template file,
 *  target: html element target selector,
 *  }
 * @param options
 */
export default function createRenderMiddleware(options: TOptions): (req: Request, res: Response, next: NextFunction) => Promise<any> {
  const { component, pathToTemplate, targetSelector } = options;
  const componentProps = options.componentProps || {};
  const base = resolveNormalizedPath(options.base);
  const preload = options.preload || (() => Promise.resolve({}));
  const secretSalt = options.secretSalt || DEFAULT_SECRET_SALT;
  const removeWhitespace = typeof options.removeWhitespace !== 'undefined' ? options.removeWhitespace : false;
  const verbose = typeof options.verbose !== 'undefined' ? options.verbose : false;
  const debug = typeof options.debug !== 'undefined' ? options.debug : false;

  // create preload helpers
  const redirect = resolveRedirect;
  const response = resolveResponse;
  const helpers: TPreloadCallbackHelpers = { redirect, response };

  logger.info(`Use render middleware to serve server side rendering results from '${base}'`);

  if (!base) {
    throw new Error('Option \'base\' is required to serve server side rendering results');
  }

  if (!component) {
    throw new Error('Option \'component\' is required for this middleware: please, pass svelte component built for server side rendering');
  }

  if (!pathToTemplate) {
    throw new Error('Option \'pathToTemplate\' is required for this middleware: please, pass path to final index template file');
  }

  if (!targetSelector) {
    throw new Error('Option \'target\' is required for this middleware: please, pass target html element selector');
  }

  // save dom nodes to the variables
  const { original, clone } = resolveTemplateRepresentative(pathToTemplate, targetSelector);

  // remove whitespaces in initial representatives
  removeWhitespace && original.dom.removeWhitespace();
  removeWhitespace && clone.dom.removeWhitespace();

  return async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const path = resolveNormalizedPath(req.path);
    const inner = resolveNormalizedPath(path.slice(base.length));
    const query = req.query;
    const location: TPreloadCallbackLocation = { base, path, inner, query };

    verbose && logger.trace(`Render request candidate: '${req.path}'`);

    // serve render only from desired base
    if (path.indexOf(base) !== 0) {
      verbose && logger.warning(`Request is outside of the base path '${base}'`, 1);
      return next();
    }

    // preload component data
    let result: TPreloadCallbackResult;
    try {
      result = await preload(location, resolveCandidate, helpers);
      verbose && logger.success('Preload request successfully performed', 1);
      debug && logger.inspect(result);
    } catch (error) {
      verbose && logger.error(`Preload request failed: ${error.message}`, 1);
      return next(error);
    }

    if (result instanceof RedirectCandidate) {
      let urlResolved;
      if (result.url.indexOf('/') === 0) {
        // redirect url is relative
        urlResolved = resolveNormalizedUrlWithBase(base, result.url);
        verbose && logger.trace(`Preload request returned redirect to '${result.url}' with status '${result.status}' but actual redirect will be '${urlResolved}' because of the base path`, 1);
      } else {
        // redirect url is absolute
        urlResolved = result.url;
        verbose && logger.trace(`Preload request returned absolute redirect to '${result.url}' with status '${result.status}'`, 1);
      }

      return res.redirect(result.status, urlResolved);
    }

    if (result instanceof ResponseCandidate) {
      verbose && logger.trace(`Preload request returned plain response: '${result.body}' with status '${result.status}'`, 1);
      return res.status(result.status).send(result.body);
    }


    // resolve render component props
    const { props, conflicts } = resolveRenderProperties(location, result, componentProps);

    if (conflicts.location.length) {
      const strings = conflicts.location.map((name) => `'${name}'`);
      verbose && logger.warning(`Component properties conflict detected: properties from resolved location ${strings.join(', ')} will be overridden`, 1);
    }

    if (conflicts.result.length) {
      const strings = conflicts.result.map((name) => `'${name}'`);
      verbose && logger.warning(`Component properties conflict detected: properties from preload result ${strings.join(', ')} will be overridden`, 1);
    }


    // build collection of document components
    // to return with the response
    const headComponents = [];
    const bodyComponents = [];

    // override base script tag with expected one
    const baseSource = `<base href="${base}" />`;
    const baseElFound = original.head.querySelector('base');
    baseElFound && ((baseElFound.parentNode as any as HTMLElement).removeChild(baseElFound as any));
    headComponents.push(baseSource);

    // encrypt properties with basic encryption method
    // because it may store spam bots sensitive data
    // and append them to the components collection
    const propsEncrypted = aes.encrypt(JSON.stringify(props), secretSalt).toString();
    const propsScript = `<script type="text/javascript">window.$$props = ${JSON.stringify(propsEncrypted)};</script>`;
    headComponents.push(propsScript);

    // append template head html source code
    headComponents.push(original.head.innerHTML);

    // render component with preloaded data
    // and append the result to the components collections
    try {
      const rendered = component.render(props);
      headComponents.push(rendered.head);
      bodyComponents.push(rendered.html);
    } catch (error) {
      verbose && logger.error(`Render failed: '${error.message}'`, 1);
      return next(error);
    }

    // set clone content from original one with rendered one
    clone.head.set_content(headComponents.join(''), { script: true, style: true });
    clone.target.set_content(bodyComponents.join(''), { script: true, style: true });

    // remove whitespaces in clone representative
    // do it only with changed nodes to reduce memory usage
    clone.head.removeWhitespace();
    clone.target.removeWhitespace();

    // send rendered result
    verbose && logger.success('Render successfully performed', 1);
    res.contentType('text/html')
      .send(clone.dom.toString());
  };
}
