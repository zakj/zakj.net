import { writable } from 'svelte/store';

export const currentSection = writable<string>(null);
export const sections = writable<Record<string, HTMLElement>>({});
