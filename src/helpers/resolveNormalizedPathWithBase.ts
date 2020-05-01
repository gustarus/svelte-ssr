import resolveNormalizedPath from './resolveNormalizedPath';

export default function resolveNormalizedPathWithBase(base: string, path: string) {
  return resolveNormalizedPath(`${base}/${path}`);
}
