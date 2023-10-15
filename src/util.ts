import { writable, type Readable } from 'svelte/store';

// Return a random item from the passed-in list.
export const choice = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

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

type TimerValue = { elapsedMs: number; progress: string; remaining: number };
export type Timer = Readable<TimerValue> & {
  cancel: () => void;
  completed: Promise<void>;
};

// Starts a countdown timer and returns a readable store with elapsedMs
// (integer), progress (0 to 1 as a string for precision clamping) and
// remaining seconds (integer) values. The store also exposes a cancel method
// to stop the timer, and a promise that resolves when the countdown
// successfully completes.
export function timer(ms: number): Timer {
  const start = performance.now();
  const { set, subscribe } = writable({
    elapsedMs: 0,
    progress: '0',
    remaining: 0,
  });
  let requestId: number;

  const completed = new Promise<void>((resolve) => {
    function tick() {
      const elapsedMs = performance.now() - start;
      set({
        elapsedMs,
        progress: Math.max(0, Math.min(1, elapsedMs / ms)).toFixed(4),
        remaining: Math.max(0, Math.ceil((ms - elapsedMs) / 1000)),
      });
      if (elapsedMs >= ms) resolve();
      else requestId = requestAnimationFrame(tick);
    }
    tick();
  });

  return {
    cancel() {
      cancelAnimationFrame(requestId);
    },
    completed,
    subscribe,
  };
}
