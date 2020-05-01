declare type TOptions = {
    host: string;
    port: number;
    base: string;
    staticProxyPort?: number;
    staticPathToDirectory?: string;
};
export default function resolveCommandOptions(): TOptions;
export {};
