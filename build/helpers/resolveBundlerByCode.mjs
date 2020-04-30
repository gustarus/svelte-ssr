import WebpackBundler from '../bundlers/WebpackBundler';
const collection = {
    webpack: WebpackBundler,
};
export default function resolveBundlerByCode(code) {
    if (!collection[code]) {
        throw new Error(`Unable to resolve bundler by code '${code}'. Only following are allowed: ${Object.keys(collection).join(', ')}`);
    }
    return collection[code];
}
