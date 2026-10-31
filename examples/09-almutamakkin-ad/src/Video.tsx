// إعلان «المتمكن» — same freestyle grammar, every line a real feature from almutamakkin-expo-v3
// (inventory/ExpiryScreen, ShortagesScreen, finance «طلبية الشراء الذكية», BarcodePrintScreen, «ديون العملاء/الموردين»,
//  «الورديات», roles/RolesScreen, agent/AgentChatScreen, the bridge to أبوغريس).
// Brand: app tokens (#cc785c / #a9583e / #faf9f5 / #141413), font Cairo, logo = «صعود» m mark.
// React Bits: LightRays (frame-driven port), GlitchText-style split, Counter-free; sounds → WAV.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShaderLayer} from './ShaderLayer';
import {RAYS_FRAG} from './lightRays';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1170;

const C = {ink: '#141413', cream: '#faf9f5', clay: '#cc785c', deep: '#a9583e', orange: '#e8a55a', hot: '#ff9a70', mute: '#8e8b82'};
const AR = "'Cairo', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = Easing.out(Easing.cubic);
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

const FontFaces = () => (
  <style>{`@font-face{font-family:'Cairo';src:url(${staticFile('fonts/Cairo.ttf')});font-weight:200 1000;font-display:block}`}</style>
);

const Rays: React.FC<{opacity?: number; spread?: number}> = ({opacity = 1, spread = 0.6}) => (
  <AbsoluteFill style={{opacity}}>
    <ShaderLayer
      frag={RAYS_FRAG}
      uniforms={(t, w, h) => ({
        uResolution: [w, h], uScale: 1, uTime: t, uSource: [0.5 * w, -0.2 * h], uAim: [0, 1], uReach: Math.max(w, h),
        uColor: hex(C.clay), uSpread: spread, uLength: 3, uFade: 1, uSaturation: 1, uPulsating: 1, uNoise: 0.08, uDistortion: 0.15,
        uDensity: 1.4, uSharpness: 0.65, uGlow: 0.9, uHaze: 0.2, uAtmosphere: 1, uIntensity: 1.6, uShadow: [0, 0, 0, 16],
        uPulses: new Array(16).fill(0), uIntro: [2.6, 1], uLight: 0, uOpacity: 1,
      })}
    />
  </AbsoluteFill>
);

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
const Slam: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const p = spring({frame: f - at, fps, config: {damping: 11, stiffness: 260}});
  return <div style={{transform: `scale(${2.4 - 1.4 * p})`, filter: `blur(${Math.max(0, (1 - p) * 14)}px)`, opacity: Math.min(1, (f - at) / 3), ...style}}>{children}</div>;
};
const Glitch: React.FC<{text: string; at: number; size: number}> = ({text, at, size}) => {
  const f = useCurrentFrame();
  const burst = (f - at) % 24 < 6 || f - at < 12;
  const dx = burst ? (random(`g${f}`) - 0.5) * 30 : 0;
  const base: React.CSSProperties = {position: 'absolute', inset: 0, fontFamily: AR, fontWeight: 900, fontSize: size, lineHeight: 1.3, textAlign: 'center', direction: 'rtl'};
  const cut = (k: number) => {
    const a = random(`c${k}${Math.floor(f / 2)}`) * 100, b = a + 12 + random(`e${k}${f}`) * 18;
    return burst ? `polygon(0 ${a}%, 100% ${a}%, 100% ${b}%, 0 ${b}%)` : 'inset(0 0 100% 0)';
  };
  return (
    <div style={{position: 'relative', width: '100%', height: size * 1.45}}>
      <div style={{...base, color: '#35e0ff', transform: `translateX(${-dx}px)`, clipPath: cut(1), opacity: 0.9}}>{text}</div>
      <div style={{...base, color: C.hot, transform: `translateX(${dx}px)`, clipPath: cut(2), opacity: 0.9}}>{text}</div>
      <div style={{...base, color: C.cream, transform: `translateX(${burst ? dx * 0.3 : 0}px)`}}>{text}</div>
    </div>
  );
};
const Cursor: React.FC<{text: string; at: number; size: number; color?: string; per?: number}> = ({text, at, size, color = C.cream, per = 2.2}) => {
  const f = useCurrentFrame();
  const g = Array.from(text);
  const n = Math.max(0, Math.min(g.length, Math.floor((f - at) / per)));
  const blink = n >= g.length ? Math.floor(f / 10) % 2 : 1;
  return (
    <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AR, fontWeight: 800, fontSize: size, color}}>
      {g.slice(0, n).join('')}
      <span style={{display: 'inline-block', width: size * 0.4, height: size * 1.1, background: C.clay, marginRight: 10, opacity: blink}} />
    </div>
  );
};
const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);

/** «صعود» m mark, strokes draw in. */
const Mark: React.FC<{size: number; at: number; a?: string; b?: string}> = ({size, at, a = C.orange, b = C.clay}) => {
  const f = useCurrentFrame();
  const p1 = interpolate(f - at, [0, 14], [0, 1], {...clamp, easing: out});
  const p2 = interpolate(f - at - 6, [0, 14], [0, 1], {...clamp, easing: out});
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeWidth={26}>
        <path d="M46 152 V106 A27 27 0 0 1 100 106 V152" stroke={a} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p1} />
        <path d="M100 152 V84 A27 27 0 0 1 154 84 V152" stroke={b} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p2} />
      </g>
    </svg>
  );
};

/* ---------------- scenes ---------------- */
const S1: React.FC = () => (
  <AbsoluteFill style={{background: C.ink}}>
    <Center style={{gap: 20}}>
      <Cursor text="تعرف شن صاير" at={6} size={104} per={2.4} />
      <Sequence from={42} layout="none"><Cursor text="في محلك… توا؟" at={0} size={104} per={2.4} color={C.clay} /></Sequence>
    </Center>
  </AbsoluteFill>
);

const S2: React.FC = () => {
  const f = useCurrentFrame();
  const shake = useShake([0], 30);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Rays opacity={interpolate(f, [0, 20], [0, 1], clamp)} />
      <Center style={{transform: shake}}>
        <Mark size={260} at={0} />
        <Slam at={4}><div style={{fontFamily: AR, fontWeight: 900, fontSize: 210, lineHeight: 1.3, color: C.cream}}>المتمكن</div></Slam>
        <div style={{fontFamily: AR, fontWeight: 600, fontSize: 64, color: C.cream, opacity: interpolate(f, [40, 52], [0, 0.9], clamp), direction: 'rtl'}}>
          محلك كله… <span style={{color: C.clay}}>في جيبك.</span>
        </div>
      </Center>
      <Flash at={0} />
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const f = useCurrentFrame();
  const flip = f >= 70;
  const shake = useShake([70], 34);
  const words = ['دفاتر.', 'اتصالات.', 'تخمين.'];
  return (
    <AbsoluteFill style={{background: flip ? C.clay : C.ink, transform: shake}}>
      {!flip ? (
        <Center>
          {words.map((w, i) => (
            <Slam key={w} at={4 + i * 14}>
              <div style={{fontFamily: AR, fontWeight: 900, fontSize: 190, lineHeight: 1.2, color: f > 50 + i * 4 ? C.mute : C.cream, textDecoration: f > 50 + i * 4 ? 'line-through' : 'none', textDecorationColor: C.clay, textDecorationThickness: 16}}>{w}</div>
            </Slam>
          ))}
        </Center>
      ) : (
        <Center>
          <Slam at={70}><div style={{fontFamily: AR, fontWeight: 900, fontSize: 180, lineHeight: 1.25, color: C.ink, textAlign: 'center'}}>خلاص.<br />التخمين<br />انتهى.</div></Slam>
        </Center>
      )}
      <Flash at={70} color={C.cream} />
    </AbsoluteFill>
  );
};

const ICON: Record<string, string> = {
  expiry: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/><circle cx="12" cy="15" r="3.2"/><path d="M12 13.6v1.5l1 .8"/>',
  short: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/><path d="M17 3.5 7 9"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6.2"/><path d="m12 7 1.6 2.4L17 6"/>',
  barcode: '<path d="M3 5v14M7 5v14M10 5v14M14 5v14M17 5v14M21 5v14" />',
  wallet: '<rect x="2" y="6" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M6 6V5a2 2 0 0 1 2-2h10"/><circle cx="17" cy="15" r="1.5"/>',
  shift: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  roles: '<rect x="2" y="5" width="20" height="15" rx="3"/><circle cx="8.5" cy="11.5" r="2.5"/><path d="M5 17c.6-1.8 2-2.6 3.5-2.6S11.4 15.2 12 17M14 10h5M14 14h4"/>',
  agent: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="m12 8 .9 2.2 2.1.8-2.1.8L12 14l-.9-2.2L9 11l2.1-.8z"/>',
};
const FEATURES: [string, string, string][] = [
  ['الصلاحية', 'ينبّهك قبل ما تنتهي البضاعة.', 'expiry'],
  ['النواقص', 'يقولك شن ناقص… قبل ما يخلص.', 'short'],
  ['الطلبية الذكية', 'تشتري اللي يتباع بس.', 'cart'],
  ['الباركود', 'جهّز الملصقات واطبعها من جوالك.', 'barcode'],
  ['الديون', 'العملاء والموردين… بالمليم.', 'wallet'],
  ['الورديات', 'تسوية كل وردية بحركاتها.', 'shift'],
  ['الأدوار', 'كل موظف يشوف شغله بس.', 'roles'],
  ['المساعد', 'اسأله… يجاوبك من بيانات محلك.', 'agent'],
];
const SLOT = 45;
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(FEATURES.length - 1, Math.floor(f / SLOT));
  const local = f - i * SLOT;
  const [title, line, ic] = FEATURES[i];
  const bgs = [C.ink, C.clay, C.cream];
  const bg = bgs[i % 3];
  const fg = bg === C.ink ? C.cream : C.ink;
  const accent = bg === C.clay ? C.ink : C.clay;
  const shake = useShake([i * SLOT], 18);
  const iconP = interpolate(local, [0, 10], [0, 1], {...clamp, easing: out});
  const lineP = interpolate(local, [10, 20], [0, 1], {...clamp, easing: out});
  const size = title.length > 8 ? 170 : 230;
  return (
    <AbsoluteFill style={{background: bg, transform: shake}}>
      <div style={{position: 'absolute', top: 120, left: 80, fontFamily: AR, fontWeight: 800, fontSize: 42, color: accent, direction: 'ltr'}}>{String(i + 1).padStart(2, '0')} / 08</div>
      <Center>
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{transform: `scale(${0.6 + 0.4 * iconP}) rotate(${(1 - iconP) * -20}deg)`, opacity: iconP}} aria-hidden="true" dangerouslySetInnerHTML={{__html: ICON[ic]}} />
        <Slam at={i * SLOT} style={{marginTop: 30}}><div style={{fontFamily: AR, fontWeight: 900, fontSize: size, lineHeight: 1.3, color: fg, textAlign: 'center'}}>{title}</div></Slam>
        <div style={{marginTop: 24, maxWidth: 900, fontFamily: AR, fontWeight: 700, fontSize: 58, lineHeight: 1.45, color: accent, direction: 'rtl', textAlign: 'center', opacity: lineP, transform: `translateY(${(1 - lineP) * 30}px)`}}>{line}</div>
      </Center>
    </AbsoluteFill>
  );
};

const Point: React.FC<{text: string; at: number}> = ({text, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 12}});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl', transform: `translateX(${(1 - p) * 140}px)`, opacity: Math.min(1, p * 1.4)}}>
      <svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="m7.5 12.5 3 3 6-6.5" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - interpolate(f - at - 6, [0, 10], [0, 1], clamp)} />
      </svg>
      <span style={{fontFamily: AR, fontWeight: 800, fontSize: 70, color: C.cream}}>{text}</span>
    </div>
  );
};
const S5: React.FC = () => (
  <AbsoluteFill style={{background: C.ink}}>
    <div style={{position: 'absolute', top: 300, width: '100%'}}><Cursor text="والأهم؟" at={2} size={120} per={3} /></div>
    <div style={{position: 'absolute', top: 660, right: 100, display: 'flex', flexDirection: 'column', gap: 54}}>
      <Point text="مربوط بنظام أبوغريس" at={36} />
      <Point text="من جوالك، وين ما كنت" at={66} />
      <Point text="بالعربي من أول حرف" at={96} />
    </div>
  </AbsoluteFill>
);

const S6: React.FC = () => {
  const f = useCurrentFrame();
  const shake = useShake([40], 30);
  return (
    <AbsoluteFill style={{background: C.ink, transform: shake}}>
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 700, fontSize: 76, color: C.mute, opacity: interpolate(f, [2, 12], [0, 1], clamp)}}>محلك يستاهل…</div>
      {f >= 40 ? <div style={{position: 'absolute', top: 800, left: 0, right: 0}}><Glitch text="يتمكّن." at={40} size={230} /></div> : null}
      <Flash at={40} color={C.clay} />
    </AbsoluteFill>
  );
};

const S7: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shake = useShake([40], 26);
  const lock = spring({frame: f - 84, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: C.ink, transform: shake}}>
      <Rays opacity={interpolate(f, [30, 70], [0.25, 1], clamp)} spread={0.7} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, rgba(20,20,19,0) 0%, rgba(20,20,19,0.7) 85%)'}} />
      <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 700, fontSize: 80, color: C.cream, opacity: interpolate(f, [0, 10, 74, 82], [0, 1, 1, 0], clamp)}}>من اليوم…</div>
      <div style={{position: 'absolute', top: 610, width: '100%', opacity: interpolate(f, [74, 82], [1, 0], clamp)}}>
        <Slam at={40}><div style={{textAlign: 'center', fontFamily: AR, fontWeight: 900, fontSize: 170, lineHeight: 1.3, color: C.clay}}>أنت<br />المتمكن.</div></Slam>
      </div>
      {f >= 84 ? (
        <Center style={{transform: `scale(${0.8 + 0.2 * lock})`, opacity: lock}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
            <Mark size={200} at={84} />
            <span style={{fontFamily: AR, fontWeight: 900, fontSize: 190, color: C.cream}}>المتمكن</span>
          </div>
          <div style={{marginTop: 20, fontFamily: AR, fontWeight: 700, fontSize: 62, color: C.cream, direction: 'rtl', opacity: interpolate(f, [104, 116], [0, 1], clamp)}}>
            تحكّم في محلك… <span style={{color: C.clay}}>من جوالك.</span>
          </div>
          <div style={{marginTop: 50, fontFamily: AR, fontWeight: 800, fontSize: 52, color: C.ink, background: C.clay, borderRadius: 999, padding: '18px 56px', opacity: interpolate(f, [124, 136], [0, 1], clamp), transform: `scale(${interpolate(f, [124, 136], [0.8, 1], {...clamp, easing: out})})`}}>جرّبه اليوم</div>
        </Center>
      ) : null}
      <Flash at={40} color={C.clay} />
      <Flash at={84} />
    </AbsoluteFill>
  );
};

export const TL: [number, number, React.FC][] = [
  [0, 90, S1], [90, 180, S2], [180, 330, S3], [330, 690, S4], [690, 870, S5], [870, 990, S6], [990, 1170, S7],
];

export const MutamakkinAd: React.FC = () => (
  <AbsoluteFill style={{background: C.ink}}>
    <FontFaces />
    {TL.map(([a, b, S], i) => (
      <Sequence key={i} from={a} durationInFrames={b - a}><S /></Sequence>
    ))}
  </AbsoluteFill>
);
