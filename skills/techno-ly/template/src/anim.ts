// Frame-pure motion helpers (everything is a function of t in seconds).
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lin = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
export const eo = (x: number) => 1 - Math.pow(1 - x, 3)
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
export const back = (x: number) => { const c1 = 1.6, c3 = c1 + 1; return x <= 0 ? 0 : x >= 1 ? 1 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2) }
// damped spring 0→1 (overshoot then settle) over dur seconds
export const spring = (t: number, at: number, dur = 0.7) => { const x = (t - at) / dur; if (x <= 0) return 0; if (x >= 1) return 1; return 1 - Math.exp(-5.5 * x) * Math.cos(x * Math.PI * 2.4) * (1 - x * 0.2) }
export const mix = (a: number, b: number, p: number) => a + (b - a) * p
// presence of an element shown from `a` to `b` with fade times
export const life = (t: number, a: number, b = 1e9, fi = 0.3, fo = 0.3) => Math.min(lin(t, a, a + fi), 1 - lin(t, b, b + fo))
