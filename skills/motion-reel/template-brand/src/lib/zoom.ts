// The opening dive: from their whole vehicle, small and sharp (a DOWNSCALE of their footage), into one small detail
// (a passenger window) in ONE continuous zoom. The zoom is eased in log space, so its speed rises and falls without a
// jump; a fast zoom followed by a separate slow-down reads as «not smooth». The detail is tracked in the footage
// (scripts/track.py → src/track.json) and glides to the centre while we dive. The shape then locks onto it.
//
// Approved numbers: from 0.51× (the 1920 px frame shown 980 px wide) to about 53× in 1.6 s; peak speed about
// 8 e-folds per second a third of the way in; the footage dissolves into the shape between 3.5× and 11×, while the
// move is fastest, so nobody sees the footage at an upscale.
import {E, ZE, clamp, lerp, prog} from './ease';

export type Track = {x: number[]; y: number[]};        // polynomial coefficients (highest power first) in plate frame
const poly = (c: number[], x: number) => c.reduce((a, k) => a * x + k, 0);

export type ZoomOpts = {
  t0: number; t1: number;            // the dive (the wide shot holds from 0 to t0, creeping)
  wide: number;                      // scale of the wide shot (0.51 = a 1920 px frame shown 980 px wide)
  end: number;                       // scale at t1 (shape height / detail height in source px)
  creep?: number;                    // log-scale creep during the whole opening, so the wide shot is never still
  glide: [number, number];           // when the detail travels to the centre
  src: [number, number];             // plate size in px
  centre: [number, number];          // where the detail lands on screen
  track: Track;
  frameAt: (t: number) => number;    // plate frame shown at time t
  offset?: [number, number];         // the detail's offset from the tracked point, in source px
};

export const makeZoom = (o: ZoomOpts) => {
  const creep = o.creep ?? 0.06;
  const [cx, cy] = o.centre, [SW, SH] = o.src, [dx, dy] = o.offset ?? [0, 0];
  const camL = (t: number) => Math.log(o.wide) + creep * prog(t, 0, o.t1) + (Math.log(o.end / o.wide) - creep) * ZE(prog(t, o.t0, o.t1));
  return (t: number) => {
    const f = o.frameAt(t);
    const wx = poly(o.track.x, f) + dx, wy = poly(o.track.y, f) + dy;
    const sc = Math.exp(camL(t));
    const cr = Math.exp(creep * prog(t, 0, o.t1));
    const g = E(prog(t, o.glide[0], o.glide[1]));
    // where the detail sits on screen: in the wide shot (frame centred) → the centre
    const sx = lerp(cx + (wx - SW / 2) * o.wide * cr, cx, g), sy = lerp(cy + (wy - SH / 2) * o.wide * cr, cy, g);
    const speed = (camL(t + 1 / 120) - camL(t - 1 / 120)) * 60;   // e-folds per second
    return {
      f, wx, wy, sc, sx, sy, speed,
      // the plate's transform: the tracked detail lands on (sx, sy)
      transform: (m = 1) => `translate(${sx - wx * sc * m}px, ${sy - wy * sc * m}px) scale(${sc * m})`,
      // the wide shot's frame (without the creep, so the picture creeps inside a still frame)
      frame: {cx: sx + (SW / 2 - wx) * (sc / cr), cy: sy + (SH / 2 - wy) * (sc / cr), w: SW * (sc / cr), h: SH * (sc / cr)},
      // footage → shape dissolve, keyed on scale (not on time), so it always happens at the fastest point
      out: (a = 3.5, b = 11) => E(prog(Math.log(sc), Math.log(a), Math.log(b))),
      // zoom blur from the speed itself: copies at the scales of a 1/240 s shutter, so it fades in and out with the move
      blur: () => {
        const vb = clamp(speed / 3);
        return vb > 0.02 ? [1, 2, 3].map((i) => ({m: Math.exp((-speed * i) / 240), o: (0.32 - i * 0.07) * vb})) : [];
      },
    };
  };
};
