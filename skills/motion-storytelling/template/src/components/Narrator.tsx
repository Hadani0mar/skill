import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, LINES, SCENES} from '../theme';
import {graphemes, Typewriter} from './Text';

// Character image is 452×967 (background removed, original smile painted out so the mouth can move).
const IMG_W = 452;
const IMG_H = 967;
const SKIN = 'rgb(255,247,236)';

type Pose = {h: number; x: number; bottom: number};
const BIG: Pose = {h: 760, x: 26, bottom: 1712};
const SMALL: Pose = {h: 600, x: 18, bottom: 1730};
const poseFor = (id: string): Pose => (id === 'hook' || id === 'problem' || id === 'outro' ? BIG : SMALL);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Typing speed for a line so it finishes ~1.1 s before the line ends. */
const cpsFor = (l: (typeof LINES)[number]) => graphemes(l.text).length / Math.max(1.5, l.t1 - l.t0 - 1.1);

export const Narrator: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // --- pose (size/position) blends between scenes with a spring
  let pose = poseFor(SCENES[0].id);
  for (let i = 1; i < SCENES.length; i++) {
    const s = spring({frame: frame - SCENES[i].start * fps, fps, config: {damping: 16}});
    const next = poseFor(SCENES[i].id);
    pose = {h: pose.h + (next.h - pose.h) * s, x: pose.x + (next.x - pose.x) * s, bottom: pose.bottom + (next.bottom - pose.bottom) * s};
  }
  const scale = pose.h / IMG_H;
  const w = IMG_W * scale;

  // --- entrance from the left, with anticipation + squash on landing
  const enter = spring({frame: frame - 6, fps, config: {damping: 13, mass: 0.9}});
  const enterX = interpolate(enter, [0, 1], [-560, 0]);

  // --- current line
  const lineIdx = LINES.findIndex((l) => t >= l.t0 - 0.25 && t < l.t1 + 0.35);
  const line = lineIdx >= 0 ? LINES[lineIdx] : null;
  const typing = line ? t >= line.t0 && t < line.t0 + graphemes(line.text).length / cpsFor(line) : false;

  // --- hop when a new line starts (secondary action)
  let hop = 0;
  let squash = 0;
  for (const l of LINES) {
    const lf = frame - l.t0 * fps;
    if (lf > -4 && lf < 18) {
      hop = Math.max(hop, Math.sin(interpolate(lf, [0, 14], [0, Math.PI], clamp)) * 22);
      squash = Math.max(squash, interpolate(lf, [-4, 0, 3, 14, 18], [0, 0.05, -0.03, 0.02, 0], clamp));
    }
  }
  // outro cheer: two jumps
  const outroF = frame - 62 * fps;
  if (outroF > 0 && outroF < 50) hop = Math.max(hop, Math.abs(Math.sin((outroF / 25) * Math.PI)) * 48);

  const bob = Math.sin((t * Math.PI * 2) / 2.2) * 6;
  const sway = Math.sin((t * Math.PI * 2) / 3.1) * 1.4;

  // --- mouth openness from typing (changes every 3 frames, smoothed)
  const raw = (k: number) => (typing ? 0.25 + 0.75 * random(`m${Math.floor((frame + k) / 3)}`) : 0);
  const open = typing ? (raw(0) + raw(-1) + raw(-2)) / 3 : 0;

  // --- blink every ~3.3 s
  const blinkPhase = (frame + 37) % 100;
  const blink = blinkPhase < 4;

  const left = pose.x + enterX;
  const top = pose.bottom - pose.h - bob - hop;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* ground shadow */}
      <div
        style={{
          position: 'absolute',
          left: left + w * 0.18,
          top: pose.bottom - 26,
          width: w * 0.66,
          height: 34,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.10)',
          scale: String(1 - hop / 200),
          opacity: enter,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: w,
          height: pose.h,
          transformOrigin: '50% 100%',
          rotate: `${sway}deg`,
          scale: `${1 + squash} ${1 - squash}`,
        }}
      >
        <Img src={staticFile('character.png')} style={{width: '100%', height: '100%', display: 'block'}} />
        <svg viewBox={`0 0 ${IMG_W} ${IMG_H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          {open < 0.08 ? (
            <path d="M232 222 Q258 244 286 213" fill="none" stroke="#111" strokeWidth={4} strokeLinecap="round" />
          ) : (
            <g>
              <path
                d={`M234 221 Q259 ${226 + open * 4} 284 216 Q${262} ${234 + open * 22} 234 221 Z`}
                fill="#3b1d1a"
                stroke="#111"
                strokeWidth={3.5}
                strokeLinejoin="round"
              />
              <ellipse cx={258} cy={226 + open * 10} rx={10 + open * 3} ry={3 + open * 4} fill="#e8837a" />
            </g>
          )}
          {blink ? (
            <g>
              <rect x={198} y={171} width={31} height={45} rx={12} fill={SKIN} />
              <rect x={265} y={156} width={32} height={46} rx={12} fill={SKIN} />
              <path d="M202 196 Q213 203 225 195" fill="none" stroke="#111" strokeWidth={4} strokeLinecap="round" />
              <path d="M269 181 Q281 188 293 179" fill="none" stroke="#111" strokeWidth={4} strokeLinecap="round" />
            </g>
          ) : null}
        </svg>
      </div>
      {line ? <Bubble line={line} anchorX={left + w * 0.86} anchorY={top + pose.h * 0.2} frame={frame} fps={fps} /> : null}
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{line: (typeof LINES)[number]; anchorX: number; anchorY: number; frame: number; fps: number}> = ({
  line,
  anchorX,
  anchorY,
  frame,
  fps,
}) => {
  const inS = spring({frame: frame - (line.t0 - 0.25) * fps, fps, config: {damping: 13}});
  const out = interpolate(frame, [(line.t1 + 0.1) * fps, (line.t1 + 0.35) * fps], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)});
  const s = Math.min(inS, out);
  const left = Math.max(anchorX, 250);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        right: 40,
        top: anchorY - 70,
        transformOrigin: '0% 30%',
        scale: String(interpolate(s, [0, 1], [0.6, 1])),
        opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
      }}
    >
      <div
        dir="rtl"
        style={{
          background: C.card,
          border: `3px solid ${C.ink}`,
          borderRadius: 34,
          padding: '26px 34px 30px',
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 44,
          lineHeight: 1.55,
          color: C.ink,
          boxShadow: '0 10px 0 rgba(17,17,17,0.08)',
          minHeight: 120,
        }}
      >
        <Typewriter text={line.text} start={line.t0 * fps} cps={cpsFor(line)} hl={line.hl} />
      </div>
      <svg width={40} height={44} style={{position: 'absolute', left: -30, top: 52, zIndex: 2}} viewBox="0 0 40 44">
        <path d="M40 4 L2 22 L40 40 Z" fill={C.card} />
        <path d="M40 4 L2 22 L40 40" fill="none" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
