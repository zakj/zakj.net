import { DESKTOP_WIDTH, isBrowser } from '$util';
import {
  readable,
  writable,
  type Subscriber,
  type Writable,
} from 'svelte/store';

// Track whether the current viewport is wider than mobile.
export const isDesktopMedia = readable<boolean>(false, (set) => {
  if (!isBrowser) return;
  const mq = matchMedia(`(min-width: ${DESKTOP_WIDTH}px)`);
  set(mq.matches);
  const update = (value: MediaQueryListEvent) => set(value.matches);
  mq.addEventListener('change', update);
  return () => mq.removeEventListener('change', update);
});

// Track and updates the current URL. Provides a `once` helper to subscribe and
// immediately unsubscribe, for the common case of responding to the fragment on
// load but not tracking it afterwards. Ignored in SSR mode.
// TODO reuse this elsewhere, currently only photos
export const url: Omit<Writable<string>, 'update'> & {
  once: (run: Subscriber<string>) => void;
} = (() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  if (!isBrowser) return { ...writable<string>(''), once: () => {} };

  const { subscribe, set } = writable<string>('', (set) => {
    const updateValue = () => set(document.location.hash.slice(1));
    updateValue();
    addEventListener('hashchange', updateValue);
    return () => removeEventListener('hashchange', updateValue);
  });

  return {
    once: (run: Subscriber<string>) => subscribe(run)(),
    subscribe,
    set: (value: string) => {
      set(value);
      const oldUrl = new URL(document.location.href);
      const newUrl = new URL(value, oldUrl);
      // TODO: consider pushState instead if I want back/forward
      if (oldUrl.href != newUrl.href) history.replaceState({}, '', newUrl);
    },
  };
})();
