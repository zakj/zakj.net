import type { Action } from 'svelte/action';
import type { CollectionEntry } from 'astro:content';
import { createSubscriber } from 'svelte/reactivity';

// TODO is this still a useful alias?
export type Image = CollectionEntry<'photos'>['data'];

export const DESKTOP_WIDTH = 750;
export const isBrowser = !import.meta.env.SSR;

// Workaround for https://github.com/sveltejs/svelte/issues/3105
export const disableScroll: Action<HTMLBodyElement, boolean> = (
  node,
  toggled: boolean,
) => {
  const name = 'no-scroll';
  node.classList.toggle(name, toggled);
  return {
    update(toggled: boolean) {
      node.classList.toggle(name, toggled);
    },
    destroy() {
      node.classList.remove(name);
    },
  };
};

// Return a random item from the passed-in list.
export const choice = <T,>(xs: T[]) =>
  xs[Math.floor(Math.random() * xs.length)];

// Playing a sound muted (from a user-interaction handler) allows us to play it
// later without a user interaction on mobile Safari.
export function prePlayAudio(s: HTMLAudioElement) {
  s.muted = true;
  s.play();
  setTimeout(() => (s.muted = false), s.duration * 1000);
  // HACK: On mobile Safari, replaying without a load cuts off the beginning
  // of the audio. Even setting s.currentTime = 0 doesn't work.
  s.addEventListener('ended', () => s.load());
}

export type Timer = {
  elapsedMs: number;
  progress: string;
  remaining: number;
  cancel: () => void;
  completed: Promise<void>;
};

// Starts a countdown timer and returns a state with elapsedMs (integer),
// progress (0 to 1 as a string for precision clamping) and remaining seconds
// (integer) values. We also expose a cancel method to stop the timer, and a
// promise that resolves when the countdown successfully completes.
export function timer(ms: number): Timer {
  let requestId: number;
  const ctx = $state({
    elapsedMs: 0,
    progress: '0',
    remaining: Math.ceil(ms / 1000),
    cancel: () => cancelAnimationFrame(requestId),
  });
  return Object.assign(ctx, {
    completed: new Promise<void>((resolve) => {
      const start = performance.now();
      const tick = () => {
        ctx.elapsedMs = performance.now() - start;
        ctx.progress = Math.max(0, Math.min(1, ctx.elapsedMs / ms)).toFixed(4);
        ctx.remaining = Math.max(0, Math.ceil((ms - ctx.elapsedMs) / 1000));
        if (ctx.elapsedMs < ms) requestId = requestAnimationFrame(tick);
        else resolve();
      };
      tick();
    }),
  });
}

// A reactive view into the current page URL.
export class UrlState {
  private subscribe: () => void;

  constructor() {
    this.subscribe = createSubscriber((update) => {
      addEventListener('hashchange', update);
      addEventListener('popstate', update);
      return () => {
        removeEventListener('hashchange', update);
        removeEventListener('popstate', update);
      };
    });
  }

  get current(): Location | undefined {
    this.subscribe();
    return isBrowser ? document.location : undefined;
  }

  private newUrl(value: string): URL | false {
    const oldUrl = new URL(document.location.href);
    const newUrl = new URL(value, oldUrl);
    return oldUrl.href !== newUrl.href ? newUrl : false;
  }

  push(value: string): void {
    const newUrl = this.newUrl(value);
    if (newUrl) history.pushState({}, '', newUrl);
  }

  replace(value: string): void {
    const newUrl = this.newUrl(value);
    if (newUrl) history.replaceState({}, '', newUrl);
  }
}
