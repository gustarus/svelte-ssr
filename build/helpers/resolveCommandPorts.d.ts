import { TDefaultCommand } from '../types/TDefaultCommand';
export default function resolveCommandPorts(cmd: TDefaultCommand): Promise<{
    node: string;
    client: string;
    server: string;
}>;
