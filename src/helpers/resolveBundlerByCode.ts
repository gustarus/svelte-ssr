import WebpackBundler from '../bundlers/WebpackBundler';
import { TBundlers } from '../types/TBundlers';

const collection: TBundlers = {
  webpack: WebpackBundler,
};

export default function resolveBundlerByCode(code: keyof TBundlers): TBundlers[typeof code] {
  if (!collection[code]) {
    throw new Error(`Unable to resolve bundler by code '${code}'. Only following are allowed: ${Object.keys(collection).join(', ')}`);
  }

  return collection[code];
}
