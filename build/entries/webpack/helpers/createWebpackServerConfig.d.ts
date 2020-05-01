import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
/**
 * Merge custom webpack config with default ones.
 * @param source - webpack client options
 * @param options - { production: whether in production mode or not; template: expression for template file }
 */
export default function createWebpackServerConfig(source: WebpackOptions, options?: {
    production?: boolean;
}): WebpackOptions;
