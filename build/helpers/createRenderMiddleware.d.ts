import { NextFunction, Request, Response } from 'express';
declare type TSvelteServerSideRenderResult = {
    head: string;
    html: any;
    css: {
        code: string;
        map: any;
    };
};
declare type TSvelteServerSideComponent = {
    render: (props?: {}, options?: {}) => TSvelteServerSideRenderResult;
};
declare type TRequestedLocation = {
    path: string;
    query: {
        [key: string]: any;
    };
};
declare type TPreloadCallback = (location: TRequestedLocation) => Promise<{
    [key: string]: any;
}>;
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
export default function createRenderMiddleware(options: {
    base?: string;
    component: TSvelteServerSideComponent;
    preload?: TPreloadCallback;
    pathToTemplate: string;
    target: string;
}): (req: Request, res: Response, next: NextFunction) => void;
export {};
