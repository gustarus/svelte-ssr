import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
/**
 * Merge custom webpack config with default ones.
 * @param source - webpack client options
 * @param options - { production: whether in production mode or not; template: expression for template file }
 */
export default function createWebpackClientConfig(source: WebpackOptions, options?: {
    production?: boolean;
    template?: string | string[] | RegExp;
}): WebpackOptions;
