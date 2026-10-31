import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Split text into graphemes so harakat stay with their letter while typing.
const MARK = /[ً-ٰٟۖ-ۭ]/;
export const graphemes = (text: string) => {
  const g: string[] = [];
  for (const ch of text) {
    if (MARK.test(ch) && g.length) g[g.length - 1] += ch;
    else g.push(ch);
  }
  return g;
};

/** Marker swipe behind a word (yellow block from the reference cover). Grows right → left. */
export const Marker: React.FC<{progress: number; children: React.ReactNode; color?: string; pad?: string}> = ({
  progress,
  children,
  color = C.highlight,
  pad = '0 0.12em',
}) => (
  <span style={{position: 'relative', display: 'inline-block', padding: pad}}>
    <span
      style={{
        position: 'absolute',
        top: '14%',
        bottom: '6%',
        right: 0,
        width: `${progress * 100}%`,
        background: color,
        zIndex: 0,
      }}
    />
    <span style={{position: 'relative', zIndex: 1}}>{children}</span>
  </span>
);

/**
 * Typewriter: reveals the string grapheme by grapheme from `start` (frames),
 * at `cps` characters per second, with a blinking caret. Arabic reshapes naturally as it types.
 * Any substring listed in `hl` gets the marker once fully typed.
 */
export const Typewriter: React.FC<{
  text: string;
  start?: number;
  cps?: number;
  hl?: string;
  caret?: boolean;
  caretColor?: string;
  style?: React.CSSProperties;
}> = ({text, start = 0, cps = 22, hl, caret = true, caretColor = C.ink, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const g = graphemes(text);
  const n = Math.max(0, Math.min(g.length, Math.floor(((frame - start) / fps) * cps)));
  const typed = g.slice(0, n).join('');
  const done = n >= g.length;
  const doneAt = start + (g.length / cps) * fps;
  const showCaret = caret && frame >= start - 6 && (!done || Math.floor((frame - doneAt) / 15) % 2 === 0) && frame < doneAt + 40;

  let content: React.ReactNode = typed;
  if (hl && text.includes(hl)) {
    const i = text.indexOf(hl);
    const before = text.slice(0, i);
    const hlEndChars = graphemes(before + hl).length;
    if (n >= hlEndChars) {
      const p = interpolate(frame, [start + (hlEndChars / cps) * fps, start + (hlEndChars / cps) * fps + 10], [0, 1], {
        ...clamp,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      });
      content = (
        <>
          {before}
          <Marker progress={p}>{hl}</Marker>
          {typed.slice((before + hl).length)}
        </>
      );
    }
  }
  return (
    <span dir="rtl" style={{fontFamily: FONT, ...style}}>
      {content}
      {showCaret ? (
        <span
          style={{
            display: 'inline-block',
            width: '0.08em',
            height: '1em',
            background: caretColor,
            marginInlineStart: '0.06em',
            verticalAlign: '-0.12em',
            borderRadius: 2,
          }}
        />
      ) : null}
    </span>
  );
};

/** Word-by-word entrance (spring up from below), the RTL-safe way to animate Arabic. */
export const WordsIn: React.FC<{
  text: string;
  start?: number;
  stagger?: number;
  hl?: string;
  style?: React.CSSProperties;
}> = ({text, start = 0, stagger = 4, hl, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const hlWords = hl ? hl.split(' ') : [];
  return (
    <span dir="rtl" style={{fontFamily: FONT, ...style}}>
      {words.map((w, i) => {
        const s = spring({frame: frame - start - i * stagger, fps, config: {damping: 14, mass: 0.7}});
        const isHl = hlWords.includes(w);
        const p = interpolate(frame - start - i * stagger, [8, 20], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1)});
        const inner = isHl ? <Marker progress={p}>{w}</Marker> : w;
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
                translate: `0 ${interpolate(s, [0, 1], [50, 0])}px`,
                scale: String(interpolate(s, [0, 1], [0.85, 1])),
              }}
            >
              {inner}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </span>
  );
};

/** Thin line ending in a half arrow-head, the divider used under every title in the references. */
export const HookLine: React.FC<{progress: number; width?: number; color?: string}> = ({progress, width = 120, color = C.ink}) => {
  const len = width + 26;
  return (
    <svg width={width + 4} height={26} viewBox={`0 0 ${width + 4} 26`} style={{display: 'block', overflow: 'visible'}}>
      <path
        d={`M2 4 H${width} L${width - 20} 22`}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
      />
    </svg>
  );
};
