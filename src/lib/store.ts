import { writable } from 'svelte/store';

export const currentSection = writable<string>('splash');
export const sections = writable<Record<string, HTMLElement>>({});

export type PageMeta = {
  isRoot: boolean;
  maxWidth: string;
  title: string;
  description: string;
  image: string;
};

const defaultPage: PageMeta = {
  isRoot: false,
  maxWidth: null,
  title: 'Zak Johnson',
  description: 'Whiskey ginger & a dash of bitters.',
  image: null,
};

export const page = (() => {
  const { subscribe, set } = writable<PageMeta>(defaultPage);
  return {
    subscribe,
    set: (value: Partial<PageMeta>) => set({ ...defaultPage, ...value }),
  };
})();
