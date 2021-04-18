interface RectLike {
  top: number;
  bottom: number;
}

function maxBy<T>(fn: (item: T) => number, arr: T[]): T {
  return arr.reduce((best, cur) => (fn(cur) > fn(best) ? cur : best));
}

function computeOverlap(r1: RectLike, r2: RectLike): number {
  const top = Math.max(r1.top, r2.top);
  const bottom = Math.min(r1.bottom, r2.bottom);
  return Math.max(0, bottom - top);
}

// TODO: is this defined somewhere for me?
type ActionReturn = { destroy?: () => void };

export default function mostVisibleChild(node: Element): ActionReturn {
  let previous = null;

  function update() {
    const viewportRect = { top: 0, bottom: window.innerHeight };
    const child = maxBy(
      (c) => computeOverlap(viewportRect, c.getBoundingClientRect()),
      Array.from(node.children)
    );

    if (previous !== child) {
      previous = child;
      node.dispatchEvent(
        new CustomEvent('changemostvisiblechild', { detail: child })
      );
    }
  }

  window.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  setTimeout(update, 0);

  return {
    destroy() {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    },
  };
}
