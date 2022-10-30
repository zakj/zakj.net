import { writable } from 'svelte/store';

type PageData = {
  title: string;
  isRoot: boolean;
  description: string;
  maxWidth?: string;
  image?: string;
};

export const currentSection = writable<string>('splash');
export const sections = writable<Record<string, HTMLElement>>({});
export const page = writable<PageData>({
  title: 'Zak Johnson',
  isRoot: false,
  description: 'Whiskey ginger & a dash of bitters.',
});
