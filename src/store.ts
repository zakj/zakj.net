import { DESKTOP_WIDTH, isBrowser } from '$util';
import { readable, writable, type Writable } from 'svelte/store';

// Track whether the current viewport is wider than mobile.
export const isDesktopMedia = readable<boolean>(false, (set) => {
  if (!isBrowser) return;
  const mq = matchMedia(`(min-width: ${DESKTOP_WIDTH}px)`);
  set(mq.matches);
  const update = (value: MediaQueryListEvent) => set(value.matches);
  mq.addEventListener('change', update);
  return () => mq.removeEventListener('change', update);
});

// Tracks and updates the current URL fragment.
// TODO reuse this elsewhere, currently only photos
export const urlHash: Omit<Writable<string>, 'update'> = (() => {
  if (!isBrowser) return writable<string>('');
  const { subscribe, set } = writable<string>('', (set) => {
    const updateValue = () => set(document.location.hash.slice(1));
    updateValue();
    addEventListener('hashchange', updateValue);
    return () => removeEventListener('hashchange', updateValue);
  });

  return {
    subscribe,
    set: (value: string) => {
      set(value);
      const url = new URL(document.location.href);
      url.hash = value;
      // TODO: consider pushState instead if I want back/forward
      if (url.hash !== document.location.hash)
        history.replaceState({}, '', url.toString());
    },
  };
})();
