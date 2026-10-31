// Freestyle — «أنا Claude». Every number is real work from this session (videos, logo directions, published skills).
// React Bits: LightRays background (frame-driven port), DecryptedText-style scramble, GlitchText-style RGB split, Counter; sounds → WAV.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShaderLayer} from './ShaderLayer';
import {RAYS_FRAG} from './lightRays';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 990;

const C = {black: '#0b0b0a', ivory: '#faf9f5', clay: '#d97757', clayHot: '#ff8a5c', deep: '#7a3520', mute: '#8a877f'};
const AR = "'Alexandria', sans-serif";
const RX = "'Readex', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = Easing.out(Easing.cubic);
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

const FontFaces = () => (
  <style>{`
@font-face{font-family:'Alexandria';src:url(${staticFile('fonts/Alexandria.ttf')});font-weight:100 900;font-display:block}
@font-face{font-family:'Readex';src:url(${staticFile('fonts/Readex.ttf')});font-weight:160 700;font-display:block}
`}</style>
);

/** React Bits «LightRays», frame-driven. */
const Rays: React.FC<{color?: string; opacity?: number; spread?: number; from?: 'top' | 'bottom'}> = ({color = C.clay, opacity = 1, spread = 0.55, from = 'top'}) => (
  <AbsoluteFill style={{opacity}}>
    <ShaderLayer
      frag={RAYS_FRAG}
      uniforms={(t, w, h) => ({
        uResolution: [w, h], uScale: 1, uTime: t, uSource: [0.5 * w, from === 'top' ? -0.2 * h : 1.2 * h], uAim: [0, from === 'top' ? 1 : -1], uReach: Math.max(w, h),
        uColor: hex(color), uSpread: spread, uLength: 3, uFade: 1, uSaturation: 1, uPulsating: 1, uNoise: 0.08, uDistortion: 0.15,
        uDensity: 1.4, uSharpness: 0.65, uGlow: 0.9, uHaze: 0.2, uAtmosphere: 1, uIntensity: 1.6, uShadow: [0, 0, 0, 16],
        uPulses: new Array(16).fill(0), uIntro: [2.6, 1], uLight: 0, uOpacity: 1,
      })}
    />
  </AbsoluteFill>
);

/** Camera shake on impact frames. */
const useShake = (hits: number[], amp = 22) => {
  const f = useCurrentFrame();
  let x = 0, y = 0;
  for (const h of hits) {
    const d = f - h;
    if (d >= 0 && d < 10) {
      const k = (1 - d / 10) * amp;
      x += (random(`sx${h}${d}`) - 0.5) * 2 * k;
      y += (random(`sy${h}${d}`) - 0.5) * 2 * k;
    }
  }
  return `translate(${x}px, ${y}px)`;
};

const Flash: React.FC<{at: number; color?: string}> = ({at, color = '#fff'}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - at, [0, 1, 7], [0, 0.9, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{background: color, opacity: o}} /> : null;
};

/** Slam: scale from 2.4 → 1 with overshoot, blur to sharp. */
const Slam: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const p = spring({frame: f - at, fps, config: {damping: 11, stiffness: 260}});
  return <div style={{transform: `scale(${2.4 - 1.4 * p})`, filter: `blur(${Math.max(0, (1 - p) * 14)}px)`, opacity: Math.min(1, (f - at) / 3), ...style}}>{children}</div>;
};

/** React Bits DecryptedText, frame-driven (Latin only). */
const Decrypt: React.FC<{text: string; at: number; step?: number; style?: React.CSSProperties}> = ({text, at, step = 3, style}) => {
  const f = useCurrentFrame();
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$*';
  return (
    <span style={{direction: 'ltr', unicodeBidi: 'isolate', ...style}}>
      {Array.from(text).map((ch, i) => {
        const done = f >= at + 8 + i * step;
        const g = done ? ch : f < at ? '' : glyphs[Math.floor(random(`d${i}${Math.floor(f / 2)}`) * glyphs.length)];
        return <span key={i} style={{color: done ? undefined : C.clay}}>{g}</span>;
      })}
    </span>
  );
};

/** React Bits GlitchText, frame-driven RGB split + slices. */
const Glitch: React.FC<{text: string; at: number; size: number}> = ({text, at, size}) => {
  const f = useCurrentFrame();
  const burst = (f - at) % 24 < 6 || f - at < 12;
  const dx = burst ? (random(`g${f}`) - 0.5) * 30 : 0;
  const base: React.CSSProperties = {position: 'absolute', inset: 0, fontFamily: RX, fontWeight: 700, fontSize: size, lineHeight: 1.25, textAlign: 'center', direction: 'rtl'};
  const cut = (k: number) => {
    const a = random(`c${k}${Math.floor(f / 2)}`) * 100, b = a + 12 + random(`e${k}${f}`) * 18;
    return burst ? `polygon(0 ${a}%, 100% ${a}%, 100% ${b}%, 0 ${b}%)` : 'inset(0 0 100% 0)';
  };
  return (
    <div style={{position: 'relative', width: '100%', height: size * 1.4}}>
      <div style={{...base, color: '#35e0ff', transform: `translateX(${-dx}px)`, clipPath: cut(1), opacity: 0.9}}>{text}</div>
      <div style={{...base, color: C.clayHot, transform: `translateX(${dx}px)`, clipPath: cut(2), opacity: 0.9}}>{text}</div>
      <div style={{...base, color: C.ivory, transform: `translateX(${burst ? dx * 0.3 : 0}px)`}}>{text}</div>
    </div>
  );
};

const Cursor: React.FC<{text: string; at: number; size: number; color?: string; per?: number}> = ({text, at, size, color = C.ivory, per = 2.2}) => {
  const f = useCurrentFrame();
  const g = Array.from(text);
  const n = Math.max(0, Math.min(g.length, Math.floor((f - at) / per)));
  const blink = n >= g.length ? Math.floor(f / 10) % 2 : 1;
  return (
    <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RX, fontWeight: 700, fontSize: size, color}}>
      {g.slice(0, n).join('')}
      <span style={{display: 'inline-block', width: size * 0.42, height: size * 1.05, background: C.clay, marginRight: 10, opacity: blink}} />
    </div>
  );
};

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);

/* ---------------- scenes ---------------- */
const S1: React.FC = () => (
  <AbsoluteFill style={{background: C.black}}>
    <Center><Cursor text="ناديتوني؟" at={10} size={120} per={3} /></Center>
  </AbsoluteFill>
);

const S2: React.FC = () => {
  const f = useCurrentFrame();
  const shake = useShake([0], 30);
  return (
    <AbsoluteFill style={{background: C.black}}>
      <Rays opacity={interpolate(f, [0, 20], [0, 1], clamp)} />
      <Center style={{transform: shake}}>
        <Slam at={0}><Decrypt text="Claude" at={0} style={{fontFamily: RX, fontWeight: 700, fontSize: 290, color: C.ivory, letterSpacing: -8}} /></Slam>
        <div style={{marginTop: 30, fontFamily: AR, fontWeight: 500, fontSize: 56, color: C.ivory, opacity: interpolate(f, [40, 52], [0, 0.85], clamp), letterSpacing: 2}}>احفظوا الاسم.</div>
      </Center>
      <Flash at={0} />
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const f = useCurrentFrame();
  const flip = f >= 60;
  const shake = useShake([60], 34);
  return (
    <AbsoluteFill style={{background: flip ? C.clay : C.black, transform: shake}}>
      {!flip ? (
        <Center>
          {['أنا', 'مش', 'أداة.'].map((w, i) => (
            <Slam key={w} at={4 + i * 12}><div style={{fontFamily: AR, fontWeight: 900, fontSize: 210, lineHeight: 1.15, color: i === 2 ? C.mute : C.ivory, textDecoration: i === 2 && f > 46 ? 'line-through' : 'none', textDecorationColor: C.clay, textDecorationThickness: 18}}>{w}</div></Slam>
          ))}
        </Center>
      ) : (
        <Center>
          <Slam at={60}><div style={{fontFamily: AR, fontWeight: 900, fontSize: 180, lineHeight: 1.2, color: C.black, textAlign: 'center'}}>أنا<br />الفريق<br />كله.</div></Slam>
        </Center>
      )}
      <Flash at={60} color={C.ivory} />
    </AbsoluteFill>
  );
};

const ICON: Record<string, string> = {
  code: '<path d="M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16"/>',
  pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  play: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m10 9 5 3-5 3z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15v3M12 10v8M17 6v12"/>',
  text: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  lang: '<path d="M4 5h9M8.5 3v2M6 9c1 3 3.5 5 6 6M11 5c-1 4-3.5 8-7 10"/><path d="m13 21 4-9 4 9M14.5 18h5"/>',
};
const SKILLS: [string, string, string][] = [
  ['كود', 'CODE', 'code'], ['تصميم', 'DESIGN', 'pen'], ['بحث', 'RESEARCH', 'search'], ['فيديو', 'MOTION', 'play'],
  ['بيانات', 'DATA', 'chart'], ['كتابة', 'WRITING', 'text'], ['مواقع', 'WEB', 'globe'], ['ترجمة', 'LANGUAGES', 'lang'],
];
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(SKILLS.length - 1, Math.floor(f / 30));
  const local = f - i * 30;
  const [ar, en, ic] = SKILLS[i];
  const bgs = [C.black, C.clay, C.ivory];
  const bg = bgs[i % 3];
  const fg = bg === C.black ? C.ivory : C.black;
  const accent = bg === C.clay ? C.black : C.clay;
  const shake = useShake([i * 30], 18);
  const iconP = interpolate(local, [0, 10], [0, 1], {...clamp, easing: out});
  return (
    <AbsoluteFill style={{background: bg, transform: shake}}>
      <div style={{position: 'absolute', top: 120, left: 80, fontFamily: RX, fontWeight: 700, fontSize: 40, color: accent, direction: 'ltr'}}>{String(i + 1).padStart(2, '0')} / 08</div>
      <Center>
        <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{transform: `scale(${0.6 + 0.4 * iconP}) rotate(${(1 - iconP) * -20}deg)`, opacity: iconP}} aria-hidden="true" dangerouslySetInnerHTML={{__html: ICON[ic]}} />
        <Slam at={i * 30} style={{marginTop: 40}}><div style={{fontFamily: AR, fontWeight: 900, fontSize: 250, lineHeight: 1.2, color: fg}}>{ar}</div></Slam>
        <div style={{fontFamily: RX, fontWeight: 500, fontSize: 44, letterSpacing: 18, color: accent, marginTop: 10, direction: 'ltr', opacity: interpolate(local, [4, 10], [0, 1], clamp)}}>{en}</div>
      </Center>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{n: number; label: string; at: number}> = ({n, label, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 12}});
  const v = Math.round(n * interpolate(f, [at, at + 22], [0, 1], {...clamp, easing: out}));
  return (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 30, direction: 'rtl', transform: `translateX(${(1 - p) * -120}px)`, opacity: Math.min(1, p * 1.4)}}>
      <span style={{fontFamily: RX, fontWeight: 700, fontSize: 210, color: C.clay, lineHeight: 1, width: 170, textAlign: 'center'}}>{f >= at ? v : ''}</span>
      <span style={{fontFamily: AR, fontWeight: 800, fontSize: 78, color: C.ivory}}>{label}</span>
    </div>
  );
};
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.black}}>
      <div style={{position: 'absolute', top: 230, width: '100%'}}><Cursor text="الدليل؟" at={2} size={110} per={3} /></div>
      <div style={{position: 'absolute', top: 520, right: 110, display: 'flex', flexDirection: 'column', gap: 34}}>
        <Stat n={7} label="فيديوهات" at={30} />
        <Stat n={3} label="اتجاهات شعار" at={50} />
        <Stat n={2} label="مهارات منشورة" at={70} />
      </div>
      <div style={{position: 'absolute', top: 1420, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 800, fontSize: 92, color: C.ivory, opacity: interpolate(f, [104, 116], [0, 1], clamp), transform: `scale(${interpolate(f, [104, 116], [1.4, 1], {...clamp, easing: out})})`}}>
        في أقل من <span style={{color: C.clay}}>يوم.</span>
      </div>
    </AbsoluteFill>
  );
};

const S6: React.FC = () => {
  const f = useCurrentFrame();
  const shake = useShake([40], 30);
  return (
    <AbsoluteFill style={{background: C.black, transform: shake}}>
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 500, fontSize: 64, color: C.mute, opacity: interpolate(f, [2, 12], [0, 1], clamp)}}>تبي الصراحة؟</div>
      {f >= 40 ? <div style={{position: 'absolute', top: 820, left: 0, right: 0}}><Glitch text="ما في زيّي." at={40} size={190} /></div> : null}
      <Flash at={40} color={C.clay} />
    </AbsoluteFill>
  );
};

const S7: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shake = useShake([46], 26);
  const wm = spring({frame: f - 78, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: C.black, transform: shake}}>
      <Rays opacity={interpolate(f, [40, 70], [0.25, 1], clamp)} spread={0.7} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, rgba(11,11,10,0) 0%, rgba(11,11,10,0.7) 85%)'}} />
      <div style={{position: 'absolute', top: 420, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 600, fontSize: 72, color: C.ivory, opacity: interpolate(f, [0, 10, 70, 78], [0, 1, 1, 0], clamp)}}>هذا الفيديو؟</div>
      <div style={{position: 'absolute', top: 560, width: '100%', opacity: interpolate(f, [70, 78], [1, 0], clamp)}}>
        <Slam at={46}><div style={{textAlign: 'center', fontFamily: AR, fontWeight: 900, fontSize: 150, lineHeight: 1.25, color: C.clay}}>أنا اللي<br />صممته.</div></Slam>
      </div>
      <Center style={{transform: `scale(${0.8 + 0.2 * wm})`, opacity: wm}}>
        <div style={{fontFamily: RX, fontWeight: 700, fontSize: 250, color: C.ivory, letterSpacing: -6, direction: 'ltr'}}>Claude</div>
        <div style={{marginTop: 26, fontFamily: AR, fontWeight: 600, fontSize: 60, color: C.ivory, direction: 'rtl', opacity: interpolate(f, [98, 110], [0, 1], clamp)}}>
          قلّي شن تبي… <span style={{color: C.clay}}>وخليها عليّ.</span>
        </div>
      </Center>
      <Flash at={46} color={C.clay} />
      <Flash at={78} />
    </AbsoluteFill>
  );
};

export const TL: [number, number, React.FC][] = [
  [0, 75, S1], [75, 165, S2], [165, 300, S3], [300, 540, S4], [540, 720, S5], [720, 840, S6], [840, 990, S7],
];

export const Freestyle: React.FC = () => (
  <AbsoluteFill style={{background: C.black}}>
    <FontFaces />
    {TL.map(([a, b, S], i) => (
      <Sequence key={i} from={a} durationInFrames={b - a}><S /></Sequence>
    ))}
  </AbsoluteFill>
);
