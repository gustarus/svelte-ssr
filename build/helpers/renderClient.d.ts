import { SvelteComponent } from 'svelte/internal';
declare type TSvelteComponentProps = {
    [key: string]: any;
};
/**
 * Create clean express server.
 * {
 *   component: svelte frontend component,
 *   target: html selector to render component inside,
 * }
 */
export default function renderClient(options: {
    component: SvelteComponent;
    target: string;
    props?: TSvelteComponentProps;
}): void;
export {};
