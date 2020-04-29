import { TDefaultCommand } from '../types/TDefaultCommand';
export default function resolveCommandConfigurations<T>(cmd: TDefaultCommand): Promise<{
    client?: string;
    server?: string;
}>;
