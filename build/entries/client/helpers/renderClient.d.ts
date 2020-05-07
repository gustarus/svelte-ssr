import { SvelteComponent } from 'svelte/internal';
declare type TSvelteComponentProps = {
    [key: string]: any;
};
declare type TRenderOptions = {
    component: SvelteComponent;
    target: string;
    secretSalt?: string;
    props?: TSvelteComponentProps;
    includeServerLocation?: boolean;
};
/**
 * Create clean express server.
 * {
 *   component: svelte frontend component,
 *   target: html selector to render component inside,
 * }
 */
export default function renderClient(options: TRenderOptions): void;
export {};
