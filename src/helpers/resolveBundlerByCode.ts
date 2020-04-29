import WebpackBundler from '../bundlers/WebpackBundler';

type TBundler = typeof WebpackBundler;

type TCollection = { [key: string]: TBundler };

const collection: TCollection = {
  webpack: WebpackBundler,
};

export default function resolveBundlerByCode(code: string) {
  if (!collection[code]) {
    throw new Error(`Unable to resolve bundler by code '${code}'. Only following are allowed: ${Object.keys(collection).join(', ')}`);
  }

  return collection[code];
}
