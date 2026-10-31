// «أرشيف القصة» (Story Archive) — قصة Supabase في 30 ثانية. Facts: research/facts.md
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 900;

const AR = "'IBM Plex Sans Arabic', sans-serif";
const NASKH = "'Amiri', serif";
const SERIF = "'Playfair', serif";
const NAVY = '#0f0e13';
const HL = '#f6e94b';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const out = Easing.out(Easing.cubic);

const MARK = /[ً-ٰٟۖ-ۭ]/;
const graphemes = (t: string) => {
  const g: string[] = [];
  for (const c of t) {
    if (MARK.test(c) && g.length) g[g.length - 1] += c;
    else g.push(c);
  }
  return g;
};
const Typed: React.FC<{text: string; start: number; cps?: number; style?: React.CSSProperties}> = ({text, start, cps = 24, style}) => {
  const f = useCurrentFrame();
  const g = graphemes(text);
  const n = Math.max(0, Math.min(g.length, Math.floor(((f - start) / 30) * cps)));
  return (
    <span dir="rtl" style={style}>
      {g.slice(0, n).join('')}
    </span>
  );
};
/** words fade in one by one from light grey to ink */
const WordsFade: React.FC<{text: string; start: number; step?: number; color?: [number, number]; style?: React.CSSProperties}> = ({text, start, step = 5, color = [0xa8, 0x14], style}) => {
  const f = useCurrentFrame();
  return (
    <span dir="rtl" style={style}>
      {text.split(' ').map((w, i) => {
        const p = interpolate(f, [start + i * step, start + i * step + 10], [0, 1], clamp);
        const v = Math.round(interpolate(p, [0, 1], color));
        return (
          <React.Fragment key={i}>
            <span style={{color: `rgb(${v},${v},${v})`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp)}}>{w}</span>
            {' '}
          </React.Fragment>
        );
      })}
    </span>
  );
};
const Push: React.FC<{len: number; from?: number; to?: number; children: React.ReactNode}> = ({len, from = 1, to = 1.08, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{scale: String(interpolate(f, [0, len], [from, to], clamp))}}>{children}</AbsoluteFill>;
};
const Watermark: React.FC<{dark?: boolean}> = ({dark}) => (
  <div style={{position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', fontFamily: AR, fontSize: 26, letterSpacing: 2, color: dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.32)'}}>@almutamakkin</div>
);

/* ------------- backgrounds ------------- */
const Paper: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #cfcbc2 0%, #bebab0 45%, #9d998f 100%)'}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply'}}>
      <filter id="pg">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
        <feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.38  0 0 0 0 0.35  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#pg)" />
    </svg>
  </AbsoluteFill>
);
const Navy: React.FC = () => <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #1a1924 0%, ${NAVY} 60%, #08070b 100%)`}} />;
const LightLeak: React.FC<{at: number; len?: number}> = ({at, len = 14}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + len * 0.35, at + len], [0, 0.85, 0], clamp);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o, background: 'radial-gradient(ellipse at 20% 30%, rgba(255,80,40,0.9), rgba(255,200,60,0.6) 35%, rgba(0,0,0,0) 70%)'}} />
  );
};

/* ------------- greyscale illustrations ------------- */
const Monitor: React.FC = () => (
  <svg width={300} height={270} viewBox="0 0 100 90" style={{filter: 'drop-shadow(0 18px 18px rgba(0,0,0,0.35))'}}>
    <rect x={6} y={4} width={88} height={62} rx={6} fill="#5b5a57" />
    <rect x={12} y={10} width={76} height={50} rx={3} fill="#2c2c2b" />
    <rect x={16} y={14} width={68} height={42} rx={2} fill="#3d3d3b" />
    <path d="M20 22 H52 M20 30 H70 M20 38 H44" stroke="#8d8c88" strokeWidth={2.4} strokeLinecap="round" />
    <rect x={40} y={66} width={20} height={10} fill="#4a4946" />
    <rect x={24} y={76} width={52} height={8} rx={3} fill="#6a6965" />
  </svg>
);
const Cylinder: React.FC<{size?: number; tone?: 'grey' | 'white'}> = ({size = 300, tone = 'grey'}) => {
  const fill = tone === 'grey' ? '#4b4a47' : 'none';
  const stroke = tone === 'grey' ? '#2a2a28' : '#fff';
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" style={tone === 'grey' ? {filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.35))'} : undefined}>
      <path d="M12 20 V88 C12 100 88 100 88 88 V20" fill={fill} stroke={stroke} strokeWidth={4} />
      <ellipse cx={50} cy={20} rx={38} ry={12} fill={tone === 'grey' ? '#6c6b67' : 'none'} stroke={stroke} strokeWidth={4} />
      <path d="M12 43 C12 55 88 55 88 43 M12 66 C12 78 88 78 88 66" fill="none" stroke={tone === 'grey' ? '#8c8b86' : stroke} strokeWidth={4} />
    </svg>
  );
};

/* ------------- Act 1 ------------- */
const DigitRoll: React.FC<{from: number; to: number; p: number; size: number}> = ({from, to, p, size}) => {
  const steps = (to - from + 10) % 10;
  const seq = Array.from({length: steps + 1}, (_, i) => (from + i) % 10);
  const y = -p * steps * size;
  const moving = p > 0 && p < 1;
  return (
    <span style={{display: 'inline-block', height: size, overflow: 'hidden', verticalAlign: 'top'}}>
      <span style={{display: 'block', translate: `0 ${y}px`, filter: moving ? 'blur(3px)' : 'none'}}>
        {seq.map((d, i) => (
          <span key={i} style={{display: 'block', height: size, lineHeight: `${size}px`}}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};
const YearRoll: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [14, 34], [0, 1], {...clamp, easing: io});
  const tv = interpolate(f, [0, 20], [-120, 0], {...clamp, easing: out});
  return (
    <AbsoluteFill>
      <Paper />
      <Push len={60}>
        <div style={{position: 'absolute', left: 40 + tv, top: 230, rotate: '-8deg'}}>
          <Monitor />
        </div>
        <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', direction: 'ltr', fontFamily: AR, fontWeight: 700, fontSize: 250, color: '#141414', lineHeight: 1}}>
          <span>20</span>
          <DigitRoll from={1} to={2} p={p} size={250} />
          <DigitRoll from={9} to={0} p={p} size={250} />
        </div>
        <div style={{position: 'absolute', top: 1060, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 400, fontSize: 48, color: '#2a2a2a', opacity: interpolate(f, [34, 44], [0, 1], clamp)}}>
          سنغافورة · يناير
        </div>
      </Push>
      <Watermark />
    </AbsoluteFill>
  );
};

const TORN = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= 1080; x += 36) pts.push(`${x},${1250 + (random(`t${x}`) - 0.5) * 70}`);
  pts.push('1080,1920', '0,1920');
  return pts.join(' ');
})();
const Torn: React.FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [6, 40], [520, 0], {...clamp, easing: out});
  return (
    <AbsoluteFill>
      <Paper />
      <Push len={75}>
        <div style={{position: 'absolute', left: 540 - 190, top: 1010 + rise}}>
          <Cylinder size={380} />
        </div>
        {/* torn front sheet (lower half) */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <defs>
            <filter id="tsh">
              <feDropShadow dx="0" dy="-10" stdDeviation="12" floodOpacity="0.35" />
            </filter>
          </defs>
          <polygon points={TORN} fill="#c3bfb5" filter="url(#tsh)" />
        </svg>
        <div dir="rtl" style={{position: 'absolute', top: 420, left: 80, right: 80, textAlign: 'center', fontFamily: AR, lineHeight: 1.25}}>
          <div style={{fontWeight: 400, fontSize: 70}}>
            <WordsFade text="مطوّر تعب من حدود Firebase…" start={8} />
          </div>
          <div style={{fontWeight: 700, fontSize: 92}}>
            <WordsFade text="فبنى البديل بنفسه" start={30} />
          </div>
        </div>
      </Push>
      <Watermark />
    </AbsoluteFill>
  );
};

const Eight: React.FC = () => {
  const f = useCurrentFrame();
  const blur = interpolate(f, [0, 18, 46, 65], [22, 0, 0, 16], clamp);
  return (
    <AbsoluteFill>
      <Paper />
      <Push len={65} from={1.12} to={1.0}>
        <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', fontSize: 1300, lineHeight: '1300px', color: '#2b2b2b', filter: `blur(${blur}px)`, opacity: 0.9}}>8</div>
      </Push>
      <div style={{position: 'absolute', top: 1380, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 500, fontSize: 56, color: '#151515'}}>
        <Typed text="أبريل 2020: 8 قواعد بيانات بس." start={12} cps={26} />
      </div>
      <Watermark />
    </AbsoluteFill>
  );
};

const Head: React.FC<{x: number; s: number}> = ({x, s}) => (
  <g transform={`translate(${x} 0) scale(${s})`}>
    <ellipse cx={0} cy={-150} rx={95} ry={115} />
    <path d="M-240 260 C-230 40 -120 -10 0 -10 C120 -10 230 40 240 260 Z" />
  </g>
);
const Silhouettes: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Paper />
      <Push len={70}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o * 0.55, filter: 'blur(16px)'}}>
          <g fill="#2a2926" transform="translate(540 1050)">
            <Head x={-200} s={1.15} />
            <Head x={230} s={1.05} />
          </g>
        </svg>
        <div dir="rtl" style={{position: 'absolute', top: 600, left: 80, right: 80, textAlign: 'center', fontFamily: AR, color: '#121212', lineHeight: 1.3}}>
          <div style={{fontWeight: 600, fontSize: 64}}>
            <Typed text="بول كوبلستون وآنت ويلسون" start={8} cps={26} />
          </div>
          <div style={{fontWeight: 400, fontSize: 52}}>
            <Typed text="بفكرة اسمها: Postgres لحظي" start={34} cps={28} />
          </div>
        </div>
      </Push>
      <Watermark />
    </AbsoluteFill>
  );
};

const Page: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 105], [0, 1], clamp);
  const strike = interpolate(f, [30, 42], [0, 1], {...clamp, easing: out});
  const hl = interpolate(f, [50, 66], [0, 1], {...clamp, easing: out});
  return (
    <AbsoluteFill style={{background: '#2e2e2c'}}>
      <AbsoluteFill style={{perspective: 1600}}>
        <div
          style={{
            position: 'absolute',
            left: -30,
            top: 220,
            width: 1140,
            height: 1560,
            background: 'linear-gradient(160deg,#efebe3,#dcd7cc)',
            transform: `rotateX(${22 - drift * 4}deg) rotateY(${-16 + drift * 6}deg) rotateZ(${-4 + drift * 2}deg) translate3d(${-drift * 60}px, ${-drift * 120}px, ${drift * 120}px)`,
            boxShadow: '0 60px 120px rgba(0,0,0,0.6)',
            padding: '80px 110px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 120, letterSpacing: 6, color: '#1a1a1a', borderBottom: '6px double #1a1a1a', paddingBottom: 10, direction: 'ltr', textAlign: 'center'}}>SUPABASE</div>
          <div dir="rtl" style={{fontFamily: NASKH, fontSize: 60, lineHeight: 1.65, color: '#1c1c1c', marginTop: 40}}>
            <div>في مايو 2020 غيّر بول جملة واحدة في الموقع.</div>
            <div>
              من:{' '}
              <span style={{position: 'relative', direction: 'ltr', display: 'inline-block', fontFamily: SERIF}}>
                Real-time Postgres
                <span style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${strike * 100}%`, background: '#b3261e'}} />
              </span>
            </div>
            <div>إلى:</div>
            <div style={{direction: 'ltr', textAlign: 'right'}}>
              <span style={{position: 'relative', direction: 'ltr', display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: 54, whiteSpace: 'nowrap'}}>
                <span style={{position: 'absolute', left: -8, right: 'auto', top: '18%', bottom: '8%', width: `calc(${hl * 100}% + 16px)`, background: HL, zIndex: 0}} />
                <span style={{position: 'relative'}}>The open-source Firebase alternative</span>
              </span>
            </div>
            <div style={{opacity: 0.85}}>ووصلت الصفحة لأعلى Hacker News.</div>
            <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, direction: 'ltr', textAlign: 'left', marginTop: 30, opacity: interpolate(f, [70, 84], [0, 1], clamp)}}>
              “we changed the tagline on the website one day” — Paul Copplestone
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)'}} />
      <LightLeak at={0} len={14} />
      <LightLeak at={92} len={13} />
    </AbsoluteFill>
  );
};

const Counter: React.FC = () => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [8, 40], [8, 800], {...clamp, easing: Easing.in(Easing.quad)}));
  const blur = f > 8 && f < 40 ? 2 : 0;
  return (
    <AbsoluteFill>
      <Paper />
      <Push len={65} from={1} to={1.12}>
        <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: 420, lineHeight: 1, color: '#141414', filter: `blur(${blur}px)`}}>{v}</div>
        <div style={{position: 'absolute', top: 1130, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 600, fontSize: 64, color: '#1b1b1b', opacity: interpolate(f, [36, 46], [0, 1], clamp)}}>خلال 3 أيام بس</div>
      </Push>
      <LightLeak at={40} len={16} />
      <Watermark />
    </AbsoluteFill>
  );
};

const NameCard: React.FC = () => {
  const f = useCurrentFrame();
  const c = interpolate(f, [0, 16], [0.7, 1], {...clamp, easing: out});
  const t = interpolate(f, [8, 22], [0, 1], clamp);
  const text = (
    <div style={{position: 'absolute', top: 860, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 250, lineHeight: 1, color: '#fff', direction: 'ltr', letterSpacing: -4, opacity: t, textShadow: '0 6px 30px rgba(0,0,0,0.4)'}}>Supabase</div>
  );
  return (
    <AbsoluteFill>
      <Paper />
      <Push len={55}>
        {text}
        <div style={{position: 'absolute', left: 540 - 260, top: 640, width: 520, height: 520, borderRadius: '50%', overflow: 'hidden', scale: String(c), background: 'radial-gradient(circle at 35% 30%, #d9d7d2, #77756f 70%, #3b3a37)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)'}}>
          <div style={{position: 'absolute', left: 110, top: 100}}>
            <Cylinder size={300} />
          </div>
        </div>
        {/* front copy of the name, hidden over the upper part of the circle so letters tuck behind it */}
        <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 52.8%, 33% 52.8%, 33% 48%, 67% 48%, 67% 52.8%, 0 52.8%)'}}>
          <div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 0 0 0)'}}>{text}</div>
        </div>
        <div style={{position: 'absolute', top: 1180, width: '100%', textAlign: 'center', fontFamily: AR, fontSize: 44, color: '#222', opacity: interpolate(f, [20, 32], [0, 1], clamp)}}>
          Y Combinator · صيف 2020
        </div>
      </Push>
      <Watermark />
    </AbsoluteFill>
  );
};

/* ------------- Act 2 ------------- */
const glow = {filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.65))'};
const Why: React.FC = () => (
  <AbsoluteFill>
    <Navy />
    <div style={{position: 'absolute', top: 880, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 300, fontSize: 92, color: '#fff'}}>
      <WordsFade text="ليش نجحت؟" start={4} step={8} color={[0x40, 0xff]} />
    </div>
    <Watermark dark />
  </AbsoluteFill>
);

const Circles: React.FC = () => {
  const f = useCurrentFrame();
  const phase = f < 35 ? 0 : f < 70 ? 1 : 2;
  const lf = f - phase * 35;
  const draw = interpolate(lf, [0, 14], [0, 1], {...clamp, easing: out});
  const labels = ['"Real-time Postgres"', 'واحد من بين مية', '"The open-source Firebase alternative"'];
  const captions = ['يقول شنو هو', 'يضيع بين غيره', 'يقول ليش تحتاجه'];
  const circle = (cx: number, cy: number, r: number, p: number, w = 4) => (
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeWidth={w} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`rotate(-90 ${cx} ${cy})`} />
  );
  return (
    <AbsoluteFill>
      <Navy />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, ...glow}}>
        {phase === 0 ? circle(540, 900, 190, draw) : null}
        {phase === 1 ? (
          <>
            {circle(470, 860, 170, draw)}
            {circle(610, 860, 170, interpolate(lf, [4, 18], [0, 1], clamp))}
            {circle(540, 980, 170, interpolate(lf, [8, 22], [0, 1], clamp))}
          </>
        ) : null}
        {phase === 2 ? circle(540, 900, 190, draw, 7) : null}
      </svg>
      <div style={{position: 'absolute', top: 560, left: 60, right: 60, textAlign: 'center', fontFamily: phase === 1 ? AR : SERIF, fontStyle: phase === 1 ? 'normal' : 'italic', fontSize: phase === 2 ? 52 : 58, color: '#fff', opacity: interpolate(lf, [4, 12], [0, 1], clamp), direction: phase === 1 ? 'rtl' : 'ltr'}}>
        {labels[phase]}
      </div>
      <div style={{position: 'absolute', top: 1220, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 300, fontSize: 60, color: '#fff'}}>
        <Typed key={phase} text={captions[phase]} start={phase * 35 + 10} cps={22} />
      </div>
      <Watermark dark />
    </AbsoluteFill>
  );
};

const STOPS = [
  {top: '— 8 ← 800 —', bottom: 'مايو 2020', icon: 'db'},
  {top: '— Y Combinator —', bottom: 'صيف 2020', icon: 'rocket'},
  {top: '— +9 مليون مطوّر —', bottom: '2026', icon: 'people'},
  {top: '— تقييم 10.5 مليار $ —', bottom: 'يونيو 2026', icon: 'chart'},
];
const LineIconW: React.FC<{k: string}> = ({k}) => {
  const s = {fill: 'none', stroke: '#fff', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={170} height={170} viewBox="0 0 64 64">
      {k === 'db' ? (
        <>
          <ellipse {...s} cx={32} cy={14} rx={18} ry={6} />
          <path {...s} d="M14 14 V50 C14 58 50 58 50 50 V14 M14 26 C14 34 50 34 50 26 M14 38 C14 46 50 46 50 38" />
        </>
      ) : k === 'rocket' ? (
        <>
          <path {...s} d="M32 6 C44 16 46 32 40 46 H24 C18 32 20 16 32 6 Z" />
          <circle {...s} cx={32} cy={24} r={5} />
          <path {...s} d="M24 46 L18 56 L28 50 M40 46 L46 56 L36 50" />
        </>
      ) : k === 'people' ? (
        <>
          <circle {...s} cx={22} cy={22} r={7} />
          <circle {...s} cx={42} cy={22} r={7} />
          <path {...s} d="M8 50 C8 38 36 38 36 50 M28 50 C28 38 56 38 56 50" />
        </>
      ) : (
        <>
          <path {...s} d="M8 56 H56" />
          <path {...s} d="M12 46 L26 34 L36 40 L52 18" />
          <path {...s} d="M44 18 H52 V26" />
        </>
      )}
    </svg>
  );
};
const Timeline: React.FC = () => {
  const f = useCurrentFrame();
  const gap = 760;
  const idx = interpolate(f, [6, 96], [0, STOPS.length - 1], {...clamp, easing: io});
  const camX = 540 - idx * gap; // world x of stop i is i*gap
  const pts: string[] = [];
  for (let x = -600; x <= gap * (STOPS.length - 1) + 600; x += 20) pts.push(`${x},${Math.sin(x / 140) * 26}`);
  const reveal = interpolate(f, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Navy />
      <div style={{position: 'absolute', left: camX, top: 980, width: 0, height: 0}}>
        <svg width={gap * STOPS.length + 1200} height={200} style={{position: 'absolute', left: -600, top: -100, overflow: 'visible', ...glow}}>
          <polyline points={pts.map((p) => {
            const [x, y] = p.split(',').map(Number);
            return `${x + 600},${y + 100}`;
          }).join(' ')} fill="none" stroke="#fff" strokeWidth={4} opacity={reveal} />
        </svg>
        {STOPS.map((s, i) => {
          const near = 1 - Math.min(1, Math.abs(idx - i) * 1.2);
          return (
            <div key={i} style={{position: 'absolute', left: i * gap - 300, top: -330, width: 600, textAlign: 'center', opacity: 0.25 + near * 0.75}}>
              <div dir="rtl" style={{fontFamily: AR, fontWeight: 300, fontSize: 46, color: '#fff', marginBottom: 20}}>{s.top}</div>
              <div style={{display: 'inline-block', scale: String(0.85 + near * 0.15), ...glow}}>
                <LineIconW k={s.icon} />
              </div>
              <div style={{height: 120}} />
              <div dir="rtl" style={{fontFamily: AR, fontWeight: 300, fontSize: 42, color: 'rgba(255,255,255,0.8)'}}>{s.bottom}</div>
            </div>
          );
        })}
      </div>
      <Watermark dark />
    </AbsoluteFill>
  );
};

const GlitchStatement: React.FC = () => {
  const f = useCurrentFrame();
  const bars = f < 12;
  return (
    <AbsoluteFill>
      <Navy />
      {bars
        ? Array.from({length: 7}).map((_, i) => (
            <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: random(`gx${i}-${Math.floor(f / 2)}`) * 1080, width: 4 + random(`gw${i}`) * 14, background: i % 2 ? 'rgba(120,255,240,0.6)' : 'rgba(255,255,255,0.5)'}} />
          ))
        : null}
      <div dir="rtl" style={{position: 'absolute', top: 820, width: '100%', textAlign: 'center', fontFamily: AR, color: '#fff', lineHeight: 1.35}}>
        <div style={{fontWeight: 300, fontSize: 72}}>
          <WordsFade text="المنتج ما تغيّر…" start={10} step={6} color={[0x30, 0xff]} />
        </div>
        <div style={{fontWeight: 700, fontSize: 100}}>
          <WordsFade text="الوصف تغيّر." start={24} step={7} color={[0x30, 0xff]} />
        </div>
      </div>
      <Watermark dark />
    </AbsoluteFill>
  );
};

/* ------------- Act 3 ------------- */
const Question: React.FC = () => (
  <AbsoluteFill>
    <Navy />
    <div dir="rtl" style={{position: 'absolute', top: 840, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 300, fontSize: 74, color: '#fff', lineHeight: 1.35}}>
      <div>
        <Typed text="تقدر توصف منتجك" start={4} cps={26} />
      </div>
      <div style={{fontWeight: 600}}>
        <Typed text="في جملة وحدة؟" start={22} cps={24} />
      </div>
    </div>
    <Watermark dark />
  </AbsoluteFill>
);
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['لمين؟', 'شن المشكلة اللي يحلها؟', 'ليش إنت بالذات؟'];
  return (
    <AbsoluteFill>
      <Navy />
      <div dir="rtl" style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 400, fontSize: 64, color: '#fff', opacity: interpolate(f, [0, 8], [0, 1], clamp)}}>
        اكتب جملتك في التعليقات
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
        {items.map((t, i) => {
          const s = 8 + i * 10;
          const box = interpolate(f, [s, s + 8], [0, 1], clamp);
          const blur = interpolate(f, [s + 6, s + 14], [10, 0], clamp);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, width: 640, justifyContent: 'space-between', opacity: Math.min(1, box * 2)}}>
              <span style={{fontFamily: AR, fontWeight: 300, fontSize: 52, color: '#fff', filter: `blur(${blur}px)`}}>{t}</span>
              <svg width={58} height={58} viewBox="0 0 30 30">
                <rect x={3} y={3} width={24} height={24} rx={3} fill="none" stroke="#fff" strokeWidth={2.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - box} />
              </svg>
            </div>
          );
        })}
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 1180, width: '100%', textAlign: 'center', fontFamily: AR, fontWeight: 300, fontSize: 40, color: 'rgba(255,255,255,0.75)', opacity: interpolate(f, [36, 46], [0, 1], clamp)}}>
        جاوب على الثلاثة… وخلّيها قصيرة
      </div>
      <Watermark dark />
    </AbsoluteFill>
  );
};

/* ------------- timeline ------------- */
export const TIMELINE = {
  roll: [0, 60],
  torn: [60, 135],
  eight: [135, 200],
  silhouette: [200, 270],
  page: [270, 375],
  counter: [375, 440],
  name: [440, 495],
  why: [495, 540],
  circles: [540, 645],
  line: [645, 750],
  statement: [750, 795],
  question: [795, 850],
  cta: [850, 900],
} as const;
const Seq: React.FC<{k: keyof typeof TIMELINE; children: React.ReactNode}> = ({k, children}) => {
  const [a, b] = TIMELINE[k];
  return (
    <Sequence name={k} from={a} durationInFrames={b - a}>
      <Fade len={b - a}>{children}</Fade>
    </Sequence>
  );
};
const Fade: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, 5, len - 4, len], [0, 1, 1, 0.6], clamp)}}>{children}</AbsoluteFill>;
};
const Fonts: React.FC = () => (
  <style>
    {[
      ...[
        ['Light', 300],
        ['Regular', 400],
        ['Medium', 500],
        ['Bold', 700],
      ].map(([n, w]) => `@font-face{font-family:'IBM Plex Sans Arabic';font-weight:${w};font-display:block;src:url('${staticFile(`fonts/IBMPlexSansArabic-${n}.ttf`)}');}`),
      `@font-face{font-family:'Amiri';font-weight:400;font-display:block;src:url('${staticFile('fonts/Amiri-Regular.ttf')}');}`,
      `@font-face{font-family:'Amiri';font-weight:700;font-display:block;src:url('${staticFile('fonts/Amiri-Bold.ttf')}');}`,
      `@font-face{font-family:'Playfair';font-weight:400 900;font-display:block;src:url('${staticFile('fonts/Playfair.ttf')}');}`,
    ].join('\n')}
  </style>
);

export const SupabaseArchive: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Fonts />
    <Seq k="roll"><YearRoll /></Seq>
    <Seq k="torn"><Torn /></Seq>
    <Seq k="eight"><Eight /></Seq>
    <Seq k="silhouette"><Silhouettes /></Seq>
    <Seq k="page"><Page /></Seq>
    <Seq k="counter"><Counter /></Seq>
    <Seq k="name"><NameCard /></Seq>
    <Seq k="why"><Why /></Seq>
    <Seq k="circles"><Circles /></Seq>
    <Seq k="line"><Timeline /></Seq>
    <Seq k="statement"><GlitchStatement /></Seq>
    <Seq k="question"><Question /></Seq>
    <Seq k="cta"><CTA /></Seq>
  </AbsoluteFill>
);
