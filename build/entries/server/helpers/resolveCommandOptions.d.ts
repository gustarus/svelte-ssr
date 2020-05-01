declare type TOptions = {
    port: number;
    base: string;
    staticProxyPort?: number;
    staticPathToDirectory?: string;
};
export default function resolveCommandOptions(): TOptions;
export {};
