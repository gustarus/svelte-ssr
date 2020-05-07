import { NextFunction, Request, Response } from 'express';
import resolveRedirect from './resolveRedirect';
import resolveResponse from './resolveResponse';
import RedirectCandidate from '../models/Redirect';
import ResponseCandidate from '../models/Response';
import resolveCandidate from './resolveCandidate';
declare type TSvelteComponentProps = {
    [key: string]: any;
};
declare type TSvelteServerSideComponent = {
    render: (props?: {}, options?: {}) => TSvelteServerSideRenderResult;
};
declare type TSvelteServerSideRenderResult = {
    head: string;
    html: any;
    css: {
        code: string;
        map: any;
    };
};
declare type TPreloadCallbackLocation = {
    base: string;
    path: string;
    inner: string;
    query: {
        [key: string]: any;
    };
};
declare type TPreloadCallbackHelpers = {
    redirect: typeof resolveRedirect;
    response: typeof resolveResponse;
};
declare type TPreloadCallbackResult = {
    [key: string]: any;
} | RedirectCandidate | ResponseCandidate;
declare type TPreloadCallback = (location: TPreloadCallbackLocation, resolve: typeof resolveCandidate, helpers: TPreloadCallbackHelpers) => Promise<TPreloadCallbackResult>;
declare type TOptions = {
    base: string;
    component: TSvelteServerSideComponent;
    componentProps?: TSvelteComponentProps;
    preload?: TPreloadCallback;
    pathToTemplate: string;
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
export default function createRenderMiddleware(options: TOptions): (req: Request, res: Response, next: NextFunction) => Promise<any>;
export {};
