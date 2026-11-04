// Timing helpers. Every move in the film goes through these, so the whole film shares one feel.

// cubic-bezier like CSS, solved for x (Newton steps)
export const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 8; i++) {
    const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x;
    const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
    if (Math.abs(d) < 1e-6) break;
    t -= cx / d;
  }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
};
export const E = bezier(0.45, 0, 0.15, 1);       // the house curve: soft start, long landing
export const ZE = bezier(0.45, 0, 0.2, 1);       // the dive (applied to log scale, see zoom.ts)
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const ep = (t: number, a: number, b: number) => E(prog(t, a, b));

// a landing with one soft overshoot, for things that arrive (a pill dropping in)
export const settle = (t: number, t0: number, d = 0.5) => {
  const x = (t - t0) / d;
  if (x <= 0) return 0;
  if (x >= 1.6) return 1;
  return 1 - Math.exp(-5.2 * x) * Math.cos(5.6 * x);
};

// idle motion that never repeats: sums of sines with unrelated periods (never one sine, it reads as a loop)
export const drift = (t: number, a = 7.3, b = 11.9, c = 4.1) =>
  Math.sin((t * 2 * Math.PI) / a) * 0.5 + Math.sin((t * 2 * Math.PI) / b + 1.3) * 0.3 + Math.sin((t * 2 * Math.PI) / c + 2.1) * 0.2;
