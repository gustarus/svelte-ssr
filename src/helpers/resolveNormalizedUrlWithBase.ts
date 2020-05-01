import resolveNormalizedUrl from './resolveNormalizedUrl';

export default function resolveNormalizedUrlWithBase(base: string, url: string): string {
  return resolveNormalizedUrl(`${base}/${url}`);
}
