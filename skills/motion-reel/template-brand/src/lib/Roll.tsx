// Values that change over time: a soft vertical roll (the old value rises and fades, the new one comes up from below,
// like an odometer). NOT a split-flap: transparent flaps on glass read as garbled, overlapping glyphs.
import React from 'react';
import {E, clamp, prog} from './ease';

// one roll: 0.5 s, travels 0.55 of the line height, blur peaks at 2.5 px mid-roll.
// The mask keeps 16 px of padding above and below: some Arabic final letters (ي) hang below the line box and lose
// their dots under a tight mask («ما تنتهى»).
export const Roll: React.FC<{from: string; to: string; p: number; w: number; h: number; size: number; font: string; color?: string}> = ({from, to, p, w, h, size, font, color = '#fff'}) => {
  const moving = p > 0 && p < 1 && from !== to;
  const face = (txt: string, y: number, o: number, b: number) => (
    <div style={{position: 'absolute', left: 0, top: y + 16, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: font, fontSize: size, lineHeight: `${h}px`, color, whiteSpace: 'nowrap', opacity: o, filter: b > 0.2 ? `blur(${b}px)` : undefined}}>{txt}</div>
  );
  const box: React.CSSProperties = {position: 'relative', width: w, height: h + 32, margin: '-16px 0'};
  if (!moving) return <div style={box}>{face(p >= 1 ? to : from, 0, 1, 0)}</div>;
  const e = E(p), b = 2.5 * Math.sin(Math.PI * p);
  return (
    <div style={{...box, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 16%, #000 84%, transparent 100%)'}}>
      {face(from, -e * h * 0.55, clamp(1 - e * 1.4), b)}
      {face(to, (1 - e) * h * 0.55, clamp(e * 1.4 - 0.4), b)}
    </div>
  );
};

// which value shows at time t, given the times its changes start (one change per beat, never a flurry)
export const rollAt = (t: number, at: number[], dur = 0.5, delay = 0) => {
  let idx = 0, p = 0;
  at.forEach((a, i) => {
    const q = prog(t, a + delay, a + delay + dur);
    if (q >= 1) idx = i + 1;
    else if (q > 0) { idx = i; p = q; }
  });
  return {idx, nxt: Math.min(idx + 1, at.length), p};
};

// a balance that grows: only the columns that change roll, rightmost first, 0.07 s apart, 0.42 s each
// `build`: the columns rise in one by one (0.04 s apart) when the card is built, so the card never just appears full
export const Odometer: React.FC<{t: number; values: number[]; at: number[]; size: number; font: string; color?: string; digitW?: number; build?: number}> = ({t, values, at, size, font, color = '#fff', digitW, build = -1}) => {
  let from = values[0], to = values[0], t0 = -1;
  at.forEach((a, i) => { if (t >= a && i + 1 < values.length) { from = values[i]; to = values[i + 1]; t0 = a; } });
  const fmt = (n: number) => n.toLocaleString('en-US');
  let sf = fmt(from), st = fmt(to);
  const n = Math.max(sf.length, st.length);
  sf = sf.padStart(n, ' '); st = st.padStart(n, ' ');
  const changed: number[] = [];
  for (let i = n - 1; i >= 0; i--) if (sf[i] !== st[i]) changed.push(i);
  const H = size * 1.2, dw = digitW ?? size * 0.62;
  return (
    <div style={{display: 'flex', direction: 'ltr'}}>
      {st.split('').map((ch, i) => {
        const k = changed.indexOf(i);
        const p = k < 0 || t0 < 0 ? 1 : E(prog(t, t0 + k * 0.07, t0 + k * 0.07 + 0.42));
        const e = build < 0 ? 1 : E(prog(t, build + i * 0.04, build + 0.5 + i * 0.04));
        const blur = (k >= 0 ? Math.sin(Math.PI * p) * 3 : 0) + (1 - e) * 6;
        const glyph = (c: string, y: number) => (
          <div style={{position: 'absolute', left: 0, right: 0, top: y, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: font, fontSize: size, lineHeight: 1, color: c === ',' ? 'rgba(255,255,255,0.7)' : color}}>{c}</div>
        );
        return (
          <div key={i} style={{position: 'relative', width: ch === ',' ? dw * 0.4 : dw, height: H, overflow: 'hidden', filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
            opacity: e, transform: `translateY(${(1 - e) * 40}px)`}}>
            {k >= 0 && p < 1 && glyph(sf[i], -p * H)}
            {glyph(ch, (1 - p) * H)}
          </div>
        );
      })}
    </div>
  );
};
