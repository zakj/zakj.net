import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const currentSection = writable<string>('splash');
export const sections = writable<Record<string, HTMLElement>>({});

export const isDesktopMedia = (() => {
  const { subscribe, set } = writable<boolean>(false);
  if (browser) {
    const mq = matchMedia('(min-width: 750px)');
    set(mq.matches);
    mq.addEventListener('change', (value) => set(value.matches));
  }
  return { subscribe };
})();
