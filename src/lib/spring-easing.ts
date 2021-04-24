// Adapted from anime.js <https://github.com/juliangarnier/anime>.

type EasingFn = (t: number) => number;
interface SpringOpts {
  damping?: number;
  mass?: number;
  stiffness?: number;
  velocity?: number;
}

const minMax = (val: number, min: number, max: number): number =>
  Math.min(Math.max(val, min), max);

export function springEasing(opts: SpringOpts = {}): EasingFn {
  const damping = minMax(opts.damping ?? 10, 0.1, 100);
  const mass = minMax(opts.mass ?? 1, 0.1, 100);
  const stiffness = minMax(opts.stiffness ?? 100, 0.1, 100);
  const velocity = minMax(opts.velocity ?? 0, 0.1, 100);
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  const a = 1;
  const b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  return (t: number): number => {
    if (t === 0 || t === 1) return t;
    if (zeta < 1) {
      t =
        Math.exp(-t * zeta * w0) *
        (a * Math.cos(wd * t) + b * Math.sin(wd * t));
    } else {
      t = (a + b * t) * Math.exp(-t * w0);
    }
    return 1 - t;
  };
}
