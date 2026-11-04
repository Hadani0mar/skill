// A voice ribbon: a few fine lines that move ONLY while the voice speaks (scripts/voice.py place writes
// src/voice_env.json, one level per frame). The level is held over ±3 frames so it breathes instead of flickering.
import React from 'react';
import ENV from '../voice_env.json';
import {drift} from './ease';

export const voiceLevel = (t: number, fps: number) => {
  const f = Math.round(t * fps), e = ENV as number[];
  let m = 0;
  for (let k = -3; k <= 3; k++) m = Math.max(m, (e[f + k] ?? 0) * (1 - Math.abs(k) / 5));
  return m;
};

export const Ribbon: React.FC<{t: number; fps: number; w?: number; h?: number; color?: string; accent?: string}> = ({t, fps, w = 150, h = 44, color = '#fff', accent = '#B4B5DF'}) => {
  const lev = voiceLevel(t, fps);
  const lines: React.ReactNode[] = [];
  for (let k = 0; k < 5; k++) {
    let d = '';
    for (let x = 0; x <= w; x += 5) {
      const env = Math.sin((x / w) * Math.PI);
      const y = h / 2 + env * (1.5 + lev * (11 + 4 * drift(t + k * 0.37, 1.3, 2.1, 0.77))) * Math.sin(x / 11 + t * (3.1 + k * 0.4) + k);
      d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(2) + ' ';
    }
    lines.push(<path key={k} d={d} fill="none" stroke={k === 2 ? color : accent} strokeWidth={1.2} strokeOpacity={0.55 + 0.1 * k} />);
  }
  return <svg width={w} height={h} style={{direction: 'ltr'}}>{lines}</svg>;
};
