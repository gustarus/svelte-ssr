import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import parser, { HTMLElement } from 'node-html-parser';

type TTemplateRepresentative = {
  dom: HTMLElement;
  head: HTMLElement;
  target: HTMLElement;
}

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

type TRequestedLocation = { path: string, query: { [key: string]: any } };

type TPreloadCallback = (location: TRequestedLocation) => Promise<{ [key: string]: any }>;

type TOptions = {
  base: string;
  component: TSvelteServerSideComponent;
  preload?: TPreloadCallback,
  pathToTemplate: string,
  targetSelector: string;
};

type TRedirectOptions = { status?: number };

const defaultRedirectOptions = { status: 302 };

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
export default function createRenderMiddleware(options: TOptions): (req: Request, res: Response, next: NextFunction) => void {
  const { base, component, pathToTemplate, targetSelector } = options;
  const preload = options.preload || (() => Promise.resolve({}));

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
  const original: Partial<TTemplateRepresentative> = {};
  const clone: Partial<TTemplateRepresentative> = {};

  /**
   * Ensure dom and target nodes.
   * @returns {{ original: {dom: HTMLElement, head: HTMLElement, target: HTMLElement}, clone: {dom: HTMLElement, head: HTMLElement, target: HTMLElement} }}
   */
  function resolveTemplateRepresentative(): { original: TTemplateRepresentative; clone: TTemplateRepresentative } {
    if (!original.dom || !clone.dom) {
      if (!fs.existsSync(pathToTemplate)) {
        throw new Error(`Unable to find file for the template: looking for '${pathToTemplate}'`);
      }

      // read the template from the file
      const template = fs.readFileSync(pathToTemplate).toString();

      // parse template into dom
      // @ts-ignore
      original.dom = parser.parse(template) as HTMLElement;
      // @ts-ignore
      clone.dom = parser.parse(template) as HTMLElement;

      // resolve head
      original.head = original.dom.querySelector('head');
      clone.head = clone.dom.querySelector('head');
      if (!original.head || !clone.head) {
        throw new Error('Unable to find head html element inside the template');
      }

      original.target = original.dom.querySelector(targetSelector);
      clone.target = clone.dom.querySelector(targetSelector);
      if (!original.target || !clone.target) {
        throw new Error('Unable to find target html element inside the template');
      }
    }

    return {
      original: original as TTemplateRepresentative,
      clone: clone as TTemplateRepresentative,
    };
  }

  /**
   * Execute server redirect.
   * @param req
   * @param res
   * @param uri
   * @param customRedirectOptions
   */
  function redirect(req: Request, res: Response, uri: string, customRedirectOptions: TRedirectOptions = {}): void {
    const options = { ...defaultRedirectOptions, ...customRedirectOptions };
    return res.redirect(options.status, uri);
  }

  return (req: Request, res: Response): void => {
    const { path, query } = req;
    const { original, clone } = resolveTemplateRepresentative();
    const location = { base, path, query };

    // TODO Match request with base

    // preload application data
    preload(location).then((data: { [key: string]: any }) => {
      // render application with loaded data
      const props = { ...location, ...data };
      const { head, html } = component.render(props);

      // set clone content from original one with rendered one
      const baseTag = `<base href="${base}" />`;
      const propsScript = `<script type="text/javascript">window.$$props = ${JSON.stringify(props)};</script>`;
      clone.head.set_content(`${baseTag}${propsScript}${original.head.innerHTML}${head}`, {
        script: true,
        style: true,
      });
      clone.target.set_content(html, { script: true, style: true });

      res.contentType('text/html')
        .send(clone.dom.toString());
    }).catch((error: Error) => res.sendStatus(500).send(error));
  };
}
