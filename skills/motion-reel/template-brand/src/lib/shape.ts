// The one shape the whole film lives in. Here a stadium (an aircraft window); change `stadium` for your brand's shape
// (a rounded square for an app icon, a circle for a coin) and keep the rest.
import {E, lerp, prog} from './ease';

export type R4 = {cx: number; cy: number; w: number; h: number};
export const r4 = (a: number[]): R4 => ({cx: a[0], cy: a[1], w: a[2], h: a[3]});
export const mixR = (a: R4, b: R4, p: number): R4 => ({cx: lerp(a.cx, b.cx, p), cy: lerp(a.cy, b.cy, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p)});

// SVG path of a stadium in the rectangle r (use it in clipPath: path('...') and as a stroked rim)
export const stadium = (r: R4) => {
  const rad = Math.min(r.w, r.h) / 2, x0 = r.cx - r.w / 2, x1 = r.cx + r.w / 2, y0 = r.cy - r.h / 2, y1 = r.cy + r.h / 2;
  if (r.w > r.h) return `M ${x0 + rad} ${y0} L ${x1 - rad} ${y0} A ${rad} ${rad} 0 0 1 ${x1 - rad} ${y1} L ${x0 + rad} ${y1} A ${rad} ${rad} 0 0 1 ${x0 + rad} ${y0} Z`;
  return `M ${x0} ${y0 + rad} A ${rad} ${rad} 0 0 1 ${x1} ${y0 + rad} L ${x1} ${y1 - rad} A ${rad} ${rad} 0 0 1 ${x0} ${y1 - rad} Z`;
};

// shrink one shape into another by AREA (not by width and height separately): the eye reads it as one object
// getting smaller, not as a box being squeezed. Used for the ending (the window closes into the brand mark).
export const shrinkInto = (a: R4, b: R4, t: number, t0: number, t1: number): R4 => {
  const p = E(prog(t, t0, t1));
  const k = Math.sqrt(lerp(1, (b.w * b.h) / (a.w * a.h), p));
  const w = a.w * k, h = a.h * k * lerp(1, b.h / b.w / (a.h / a.w), p);
  return {cx: lerp(a.cx, b.cx, p), cy: lerp(a.cy, b.cy, p), w, h};
};
