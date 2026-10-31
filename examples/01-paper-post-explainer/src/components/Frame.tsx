import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

/** Warm paper with a fine static grain, like the reference posts. */
export const Paper: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.32}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.44  0 0 0 0 0.42  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)'}} />
  </AbsoluteFill>
);

const Heart = () => (
  <svg width={46} height={42} viewBox="0 0 24 22">
    <path d="M12 21s-8.5-5.3-10.6-10.2C-.2 6.9 2.3 2 6.7 2c2.2 0 3.9 1.2 5.3 3 1.4-1.8 3.1-3 5.3-3 4.4 0 6.9 4.9 5.3 8.8C20.5 15.7 12 21 12 21z" fill={C.green} />
  </svg>
);
const Send = () => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={1.6} strokeLinejoin="round">
    <path d="M22 2 2 9.5l8 3.2L22 2zM22 2l-7.6 20-4.4-9.3" />
  </svg>
);
const Bookmark = () => (
  <svg width={36} height={46} viewBox="0 0 18 24" fill="none" stroke={C.green} strokeWidth={1.6} strokeLinejoin="round">
    <path d="M2 2h14v20l-7-5.5L2 22z" />
  </svg>
);

/** Handle on top + share row at the bottom: the fixed chrome of every reference post. */
export const BrandChrome: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inTop = spring({frame: frame - 4, fps, config: {damping: 200}});
  const inBottom = spring({frame: frame - 10, fps, config: {damping: 200}});
  const heartPulse = 1 + 0.12 * Math.max(0, Math.sin((frame / fps) * Math.PI * 1.2)) ** 8;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 92,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 36,
          color: C.inkSoft,
          letterSpacing: 0.5,
          opacity: inTop,
          translate: `0 ${(1 - inTop) * -20}px`,
        }}
      >
        @almutamakkin
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 92,
          left: 90,
          right: 90,
          display: 'flex',
          direction: 'ltr',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: inBottom,
          translate: `0 ${(1 - inBottom) * 20}px`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <div style={{scale: String(heartPulse)}}>
            <Heart />
          </div>
          <Send />
          <span style={{fontFamily: FONT, fontSize: 34, color: C.inkSoft}}>شارك المنفعة</span>
        </div>
        <Bookmark />
      </div>
    </AbsoluteFill>
  );
};

export const fadeUp = (frame: number, fps: number, delay = 0, distance = 40) => {
  const s = spring({frame: frame - delay, fps, config: {damping: 15, mass: 0.8}});
  return {
    opacity: interpolate(s, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}),
    translate: `0 ${(1 - s) * distance}px`,
  } as React.CSSProperties;
};
