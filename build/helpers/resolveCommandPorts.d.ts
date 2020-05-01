import { TDefaultCommand } from '../types/TDefaultCommand';
export default function resolveCommandPorts(cmd: TDefaultCommand): Promise<{
    node: number;
    client: number;
    server: number;
}>;
