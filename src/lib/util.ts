import type { Action } from 'svelte/action';
import { quintInOut } from 'svelte/easing';

// TODO: compare with native CSS scroll-behavior: smooth.
export function scrollTo(targetY: number): void {
  const duration = 500;
  const startTime = performance.now();
  const startY = window.scrollY;
  const distance = targetY - startY;
  function tick(now: number) {
    const delta = Math.max(0, now - startTime);
    const t = quintInOut(delta / duration);
    // Avoid initial jank when scrolling up.
    if (Math.abs(distance * t) > 0.1) {
      window.scrollTo(0, startY + distance * t);
    }
    if (delta <= duration) requestAnimationFrame(tick);
    else window.scrollTo(0, targetY);
  }
  requestAnimationFrame(tick);
}

// Workaround for https://github.com/sveltejs/svelte/issues/3105
export const disableScroll: Action<HTMLBodyElement, boolean> = (
  node,
  toggled: boolean
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

export function cssVar(name: string): string {
  return getComputedStyle(document.body).getPropertyValue(name);
}
