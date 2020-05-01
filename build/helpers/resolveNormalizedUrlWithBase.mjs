import resolveNormalizedUrl from './resolveNormalizedUrl';
export default function resolveNormalizedUrlWithBase(base, url) {
    return resolveNormalizedUrl(`${base}/${url}`);
}
