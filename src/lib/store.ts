import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { DESKTOP_WIDTH } from './util';

export const currentSection = writable<string>('splash');
export const sections = writable<Record<string, HTMLElement>>({});

export const isDesktopMedia = (() => {
  const { subscribe, set } = writable<boolean>(false);
  if (browser) {
    const mq = matchMedia(`(min-width: ${DESKTOP_WIDTH}px)`);
    set(mq.matches);
    mq.addEventListener('change', (value) => set(value.matches));
  }
  return { subscribe };
})();
