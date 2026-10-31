import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {HookLine, Typewriter} from './Text';

/** Scene title block: right-aligned bold title (typed), hook divider, optional subtitle. */
export const SceneTitle: React.FC<{title: string; sub?: string; top?: number; start?: number}> = ({title, sub, top = 180, start = 8}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = interpolate(frame, [start + 14, start + 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subIn = spring({frame: frame - start - 18, fps, config: {damping: 200}});
  return (
    <div dir="rtl" style={{position: 'absolute', top, right: 70, left: 70}}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 76, color: C.ink, lineHeight: 1.25}}>
        <Typewriter text={title} start={start} cps={16} caret />
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 36,
            color: C.inkSoft,
            marginTop: 6,
            opacity: subIn,
            translate: `0 ${(1 - subIn) * 16}px`,
          }}
        >
          {sub}
        </div>
      ) : null}
      <div style={{marginTop: 18}}>
        <HookLine progress={line} width={100} />
      </div>
    </div>
  );
};

/** App card in the real Expo app tokens (warm canvas, 1px border, 22px radius). */
export const AppCard: React.FC<{style?: React.CSSProperties; children: React.ReactNode; accent?: string}> = ({style, children, accent}) => (
  <div
    dir="rtl"
    style={{
      background: C.appScaffold,
      border: `2px solid ${C.appBorder}`,
      borderRadius: 30,
      boxShadow: '0 18px 40px -22px rgba(20,20,19,0.35)',
      fontFamily: FONT,
      color: C.appText,
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
  >
    {accent ? <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 10, background: accent}} /> : null}
    {children}
  </div>
);

export const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties}> = ({
  children,
  bg = C.appSunken,
  color = C.appText,
  style,
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: bg,
      color,
      borderRadius: 999,
      padding: '8px 22px',
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 30,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Pop (scale 1 → 1.35 → 1) when its word is spoken. */
export const pulse = (frame: number, at: number) =>
  interpolate(frame, [at, at + 5, at + 11], [1, 1.045, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const enterSpring = (frame: number, fps: number, delay: number) => spring({frame: frame - delay, fps, config: {damping: 14, mass: 0.8}});
