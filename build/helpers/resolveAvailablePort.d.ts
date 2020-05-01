export default function resolveAvailablePort(port: string | number): Promise<{
    requested: number;
    available: number;
}>;
