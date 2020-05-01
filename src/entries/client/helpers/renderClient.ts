import { SvelteComponent } from 'svelte/internal';

type TSvelteComponentProps = { [key: string]: any };

type TWindowWithProps = Window & { $$props?: TSvelteComponentProps };

type TRenderOptions = {
  component: SvelteComponent;
  target: string;
  props?: TSvelteComponentProps;
  excludeServerLocation?: boolean;
};

const defaults: Partial<TRenderOptions> = {
  props: {},
  excludeServerLocation: true,
};

/**
 * Create clean express server.
 * {
 *   component: svelte frontend component,
 *   target: html selector to render component inside,
 * }
 */
export default function renderClient(options: TRenderOptions) {
  const { component, target, props, excludeServerLocation } = { ...defaults, ...options };

  if (!component) {
    throw new Error('Option \'component\' should be passed: please, define svelte component to render inside the target');
  }

  if (!target) {
    throw new Error('Option \'target\' should be passed: please, define html selector to render component inside');
  }

  const el = document.querySelector(target);
  if (!el) {
    throw new Error(`Unable to find target html element for selector '${target}'`);
  }

  // resolve props from server side rendering
  const resolved: TSvelteComponentProps = typeof window !== 'undefined' && typeof (window as TWindowWithProps).$$props !== 'undefined'
    ? (window as TWindowWithProps).$$props as any : {};

  // merge server side rendering props with client props
  for (const name in props) {
    resolved[name] = typeof props[name] !== 'undefined'
      ? props[name] : resolved[name];
  }

  if (excludeServerLocation) {
    // delete props which
    // must be taken from the frontend
    delete resolved.path;
    delete resolved.query;
  }

  // clean target element
  el.innerHTML = '';

  // TODO Use hydrate flag to update elements instead of rerender them
  // create component inside the target node
  // @ts-ignore
  new component({ target: el, props: resolved });
}
