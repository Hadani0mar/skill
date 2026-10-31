import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Frame';
import {Icon} from '../components/Icon';
import {HookLine, Marker, Typewriter, WordsIn} from '../components/Text';
import {C, FONT} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Cover post: icon in a dashed ring, three heavy lines, the middle one on the yellow marker. */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = spring({frame: frame - 4, fps, config: {damping: 11}});
  const bulbGlow = 0.5 + 0.5 * Math.sin(frame / 6);
  const marker = interpolate(frame, [34, 48], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1)});
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', top: 230, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 170, height: 170, scale: String(ring)}}>
          <svg width={170} height={170} viewBox="0 0 170 170" style={{position: 'absolute', inset: 0, rotate: `${frame * 0.8}deg`}}>
            <circle cx={85} cy={85} r={80} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="34 16" strokeLinecap="round" />
          </svg>
          <div style={{position: 'absolute', inset: 30, filter: `drop-shadow(0 0 ${10 + bulbGlow * 16}px rgba(255,201,92,0.8))`}}>
            <Icon name="lightbulb" size={110} />
          </div>
        </div>
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 450, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, color: C.ink, lineHeight: 1.18}}>
        <div style={{fontSize: 132}}>
          <WordsIn text="أدِر متجرك" start={14} />
        </div>
        <div style={{fontSize: 132}}>
          <span style={{display: 'inline-block', scale: String(spring({frame: frame - 24, fps, config: {damping: 12}}))}}>
            <Marker progress={marker} pad="0 0.18em">
              بوضوح وثقة
            </Marker>
          </span>
        </div>
        <div style={{fontSize: 132}}>
          <WordsIn text="مع المتمـــكن" start={40} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 960, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <HookLine progress={interpolate(frame, [56, 76], [0, 1], clamp)} width={110} />
      </div>
    </AbsoluteFill>
  );
};

/** Text post: bold title + light body typed, right aligned (reference #2). */
export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const iconIn = (d: number) => spring({frame: frame - d, fps, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <Paper />
      <div dir="rtl" style={{position: 'absolute', top: 330, right: 80, left: 80, fontFamily: FONT, color: C.ink}}>
        <div style={{fontWeight: 700, fontSize: 82}}>
          <Typewriter text="إدارة المتجر" start={8} cps={14} caret={false} />
        </div>
        <div style={{fontWeight: 400, fontSize: 56, lineHeight: 1.6, marginTop: 10}}>
          <Typewriter text="ليست أن تجلس أمام البرنامج طول اليوم،" start={26} cps={20} caret={false} />
          <br />
          <Typewriter text="بل أن تعرف ما يحدث فيه وأنت بعيد...." start={26 + 52} cps={20} hl="وأنت بعيد" />
        </div>
        <div style={{marginTop: 34}}>
          <HookLine progress={interpolate(frame, [120, 140], [0, 1], clamp)} width={100} />
        </div>
      </div>
      {/* small floating illustrations, staged one at a time */}
      <div style={{position: 'absolute', top: 210, left: 90, scale: String(iconIn(30)), rotate: `${Math.sin(frame / 14) * 6}deg`}}>
        <Icon name="store" size={120} />
      </div>
      <div style={{position: 'absolute', top: 820, left: 120, scale: String(iconIn(95)), translate: `0 ${Math.sin(frame / 11) * 8}px`}}>
        <Icon name="question" size={96} />
      </div>
    </AbsoluteFill>
  );
};

/** End card: brand mark, name, tagline on the marker. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: frame - 6, fps, config: {damping: 10, mass: 0.9}});
  const marker = interpolate(frame, [46, 60], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1)});
  const spark = (d: number) => spring({frame: frame - d, fps, config: {damping: 9}});
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', top: 190, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{width: 300, height: 300, scale: String(logo), rotate: `${(1 - logo) * -20}deg`}}>
          <Img src={staticFile('brand-mark.png')} style={{width: '100%', height: '100%'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 210, left: 190, scale: String(spark(30)), rotate: `${frame}deg`}}>
        <Icon name="sparkle" size={90} />
      </div>
      <div style={{position: 'absolute', top: 400, right: 200, scale: String(spark(38))}}>
        <Icon name="sparkle" size={64} />
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 520, width: '100%', textAlign: 'center', fontFamily: FONT, color: C.ink}}>
        <div style={{fontWeight: 700, fontSize: 150, lineHeight: 1.1}}>
          <WordsIn text="المتمكن" start={20} />
        </div>
        <div style={{fontWeight: 600, fontSize: 84, marginTop: 20, lineHeight: 1.3}}>
          <WordsIn text="أدِر متجرك" start={34} />
          <br />
          <span style={{display: 'inline-block', scale: String(spring({frame: frame - 44, fps, config: {damping: 12}}))}}>
            <Marker progress={marker} pad="0 0.2em">
              بوضوح وثقة
            </Marker>
          </span>
        </div>
      </div>
      <div style={{position: 'absolute', top: 990, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <HookLine progress={interpolate(frame, [64, 84], [0, 1], clamp)} width={110} />
      </div>
    </AbsoluteFill>
  );
};
