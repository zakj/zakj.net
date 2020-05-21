import { useEffect, useState, RefObject } from 'react';
import { useThrottle, useWindowScroll, useWindowSize } from 'react-use';

interface RectLike {
  top: number;
  bottom: number;
}

function computeOverlap(r1: RectLike, r2: RectLike): number {
  const top = Math.max(r1.top, r2.top);
  const bottom = Math.min(r1.bottom, r2.bottom);
  return Math.max(0, bottom - top);
}

function maxBy<T>(fn: (item: T) => number, arr: T[]): T {
  // TODO: memoize fn results
  return arr.reduce((best, cur) => {
    if (!best) return cur;
    return fn(best) > fn(cur) ? best : cur;
  });
}

export default function useMostVisibleElement(refs: RefObject<HTMLElement>[]) {
  const [mostVisible, setMostVisible] = useState<RefObject<HTMLElement>>();
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();
  const { y: scrollY } = useWindowScroll();
  const throttledScrollY = useThrottle(scrollY, 100);

  useEffect(() => {
    const viewportRect: RectLike = { top: 0, bottom: viewportHeight };
    setMostVisible(
      maxBy(
        (ref) =>
          ref.current
            ? computeOverlap(viewportRect, ref.current.getBoundingClientRect())
            : 0,
        refs
      )
    );
  }, [throttledScrollY, viewportWidth, viewportHeight]);

  return mostVisible;
}
