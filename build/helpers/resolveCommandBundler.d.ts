import { TDefaultCommand } from '../types/TDefaultCommand';
import { TBundlerInstance } from '../types/TBundlerInstance';
export default function resolveCommandBundler<T>(cmd: TDefaultCommand): Promise<TBundlerInstance>;
