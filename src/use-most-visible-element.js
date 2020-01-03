import { useEffect, useState } from 'react';
import { useThrottle, useWindowScroll, useWindowSize } from 'react-use';

function computeOverlap(r1, r2) {
  const top = Math.max(r1.top, r2.top);
  const bottom = Math.min(r1.bottom, r2.bottom);
  return Math.max(0, bottom - top);
}

function maxBy(fn, arr) {
  // TODO: memoize fn results
  return arr.reduce((best, cur) => {
    if (!best) return cur;
    return fn(best) > fn(cur) ? best : cur;
  });
}

export default function useMostVisibleElement(refs) {
  const [mostVisible, setMostVisible] = useState();
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();
  const { y: scrollY } = useWindowScroll();
  const throttledScrollY = useThrottle(scrollY, 100);

  useEffect(() => {
    const viewportRect = { top: 0, bottom: viewportHeight };
    setMostVisible(
      maxBy(
        ref =>
          computeOverlap(viewportRect, ref.current.getBoundingClientRect()),
        refs
      )
    );
  }, [throttledScrollY, viewportWidth, viewportHeight]);

  return mostVisible;
}
