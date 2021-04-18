import { quintInOut } from 'svelte/easing';

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
