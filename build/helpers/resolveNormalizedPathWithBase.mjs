import resolveNormalizedPath from './resolveNormalizedPath';
export default function resolveNormalizedPathWithBase(base, path) {
    return resolveNormalizedPath(`${base}/${path}`);
}
