declare type TProps = {
    [key: string]: any;
};
export default function resolveRenderProperties(location: TProps, result: TProps, custom: TProps): {
    props: TProps;
    conflicts: {
        location: string[];
        result: string[];
    };
};
export {};
