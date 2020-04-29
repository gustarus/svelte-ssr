export default function resolveAvailablePort(port: string): Promise<{
    requested: string;
    available: string;
}>;
