export default function resolveNormalizedPath(path: string): string {
  const cleaned = path
    .replace(/\/\/+/g, '/')
    .replace(/\/$/, '')
    .replace(/^\//, '');

  return `/${cleaned ? `${cleaned}/` : ''}`;
}
