import { writable } from 'svelte/store';

export const currentSection = writable<string>('splash');
export const sections = writable<Record<string, HTMLElement>>({});

export type Layout = {
  isRoot: boolean;
  maxWidth: string;
  title: string;
  description: string;
  image: string;
};

const defaultLayout: Layout = {
  isRoot: false,
  maxWidth: null,
  title: 'Zak Johnson',
  description: 'Whiskey ginger & a dash of bitters.',
  image: null,
};

export const layout = (() => {
  const { subscribe, set } = writable<Layout>(defaultLayout);
  return {
    subscribe,
    set: (value: Partial<Layout>) => set({ ...defaultLayout, ...value }),
  };
})();
