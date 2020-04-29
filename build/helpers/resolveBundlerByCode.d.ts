import { TBundlers } from '../types/TBundlers';
export default function resolveBundlerByCode(code: keyof TBundlers): TBundlers[typeof code];
