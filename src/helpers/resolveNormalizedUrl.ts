function cleanPath(path: string): string {
  return path.replace(/\/\/+/g, '/');
}

export default function resolveNormalizedUrl(url: string): string {
  if (url.indexOf('/') !== 0) {
    throw new Error(`Unable to normalize absolute url '${url}'`);
  }

  const match = url.match(/^(.*?)(\?.*?)?(#.*?)?$/);
  if (!match) {
    throw new Error(`Unable to parse url '${url}'`);
  }

  const path = match[1].replace(/\/\/+/g, '/');
  const search = match[2] || '';
  const anchor = match[3] || '';
  return `${path}${search}${anchor}`;
}
