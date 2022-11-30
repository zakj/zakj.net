import { browser } from '$app/environment';
import type { Action } from 'svelte/action';
import { cubicInOut, quintInOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export const DESKTOP_WIDTH = 750;

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
  return browser
    ? getComputedStyle(document.body).getPropertyValue(name)
    : null;
}

// Stolen from https://github.com/sveltejs/svelte/blob/master/src/runtime/transition/index.ts
export function zoomFromElement(
  node: Element,
  fromNode: Element
): TransitionConfig {
  const from = fromNode.getBoundingClientRect();
  const to = node.getBoundingClientRect();

  const dx = from.x - to.x;
  const dy = from.y - to.y;
  const dw = from.width / to.width;
  const dh = from.height / to.height;

  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;
  const opacity = +style.opacity;

  return {
    duration: 350,
    easing: cubicInOut,
    css: (t, u) => `
        opacity: ${t * opacity};
        transform-origin: top left;
        transform: ${transform}
          translate(${u * dx}px, ${u * dy}px)
          scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
      `,
  };
}
