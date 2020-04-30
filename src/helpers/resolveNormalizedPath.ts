export default function resolveNormalizedPath(...parts: string[]): string {
  const cleaned = parts.join('/')
    .replace(/\/\/+/g, '/')
    .replace(/\/$/, '')
    .replace(/^\//, '');

  return `/${cleaned ? `${cleaned}/` : ''}`;
}
