// «نبض العلامة» (Brand Pulse) + «ختم الشعار» (Logo Sting)
// Topic: صلاحية المنتجات — almutamakkin-expo-v3 ExpiryScreen (المنتجات / الدفعات، بحث، تقرير PDF، مشاركة)
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 600; // 20 s

const C = {grid: '#1e1e1e', gridLine: '#2e2e2e', black: '#000', green: '#8cc63f', greenTint: '#e6fdc8', white: '#fff', darkGreen: '#2c4a12'};
const AR = "'IBM Plex Sans Arabic', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = Easing.out(Easing.cubic);
const snap = (f: number, fps: number, d = 0, damping = 11) => spring({frame: f - d, fps, config: {damping, mass: 0.7}});

/* ---------------- backgrounds ---------------- */
const Grid: React.FC = () => (
  <AbsoluteFill style={{background: C.grid}}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.gridLine} 2px, transparent 2px), linear-gradient(90deg, ${C.gridLine} 2px, transparent 2px)`,
        backgroundSize: '72px 72px',
        backgroundPosition: '-2px -2px',
      }}
    />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)'}} />
  </AbsoluteFill>
);

/* ---------------- 1. title smash ---------------- */
const TitleSmash: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = snap(f, fps, 0, 12);
  const fly = interpolate(f, [22, 44], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Grid />
      <AbsoluteFill style={{perspective: 1400, alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 1080 * (1 + (1 - pop) * 0.3),
            height: 1920,
            background: C.black,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${fly * 260}px) rotateX(${fly * 58}deg) rotateZ(${fly * -14}deg) scale(${1 - fly * 0.86})`,
            boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
          }}
        >
          <div dir="rtl" style={{fontFamily: AR, fontWeight: 700, fontSize: 190, lineHeight: 1.05, color: C.green, scale: String(0.7 + pop * 0.3)}}>
            صلاحية
          </div>
          <div dir="rtl" style={{fontFamily: AR, fontWeight: 300, fontSize: 170, lineHeight: 1.1, color: C.white, scale: String(0.7 + snap(f, fps, 4, 12) * 0.3)}}>
            المنتجات
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- 2. problem chips into the bin ---------------- */
const Bin: React.FC<{wobble: number}> = ({wobble}) => (
  <svg width={120} height={130} viewBox="0 0 60 66" fill="none" stroke="#111" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <g style={{transformOrigin: '52px 14px', transform: `rotate(${wobble}deg)`}}>
      <path d="M8 16 H52" />
      <path d="M23 16 V10 H37 V16" />
    </g>
    <path d="M13 22 L16 60 H44 L47 22 Z" />
    <path d="M24 30 V52 M30 30 V52 M36 30 V52" />
  </svg>
);

const CHIPS = [
  {t: 'منتج انتهى على الرف', green: false, rot: -3},
  {t: 'خسارة ما تنحسبش', green: true, rot: 2},
  {t: 'جرد يدوي متعب', green: false, rot: -2},
];
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const binPop = snap(f, fps, 0, 9);
  const wobble = Math.sin(f / 2) * interpolate(f, [0, 22], [18, 0], clamp) + (f > 84 ? Math.sin((f - 84) / 1.5) * interpolate(f, [84, 100], [14, 0], clamp) : 0);
  const fall = interpolate(f, [78, 96], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  return (
    <AbsoluteFill>
      <Grid />
      {/* bin */}
      <div style={{position: 'absolute', left: 540 - 110, top: 1180, width: 220, height: 220, borderRadius: 110, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', scale: String(binPop)}}>
        <Bin wobble={wobble} />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: -46,
              left: 70 + i * 34,
              width: 6,
              height: 36,
              borderRadius: 3,
              background: '#fff',
              rotate: `${(i - 1) * 28}deg`,
              opacity: interpolate(f, [4, 10, 22], [0, 1, 0], clamp),
            }}
          />
        ))}
      </div>
      {/* chips */}
      {CHIPS.map((c, i) => {
        const s = snap(f, fps, 14 + i * 16, 10);
        const y0 = 660 + i * 118;
        const yFall = interpolate(fall, [0, 1], [0, 1290 - y0 - 40]);
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: y0 - (1 - s) * 260 + yFall,
              display: 'flex',
              justifyContent: 'center',
              opacity: Math.min(1, s * 2) * (1 - fall * fall),
              scale: String(1 - fall * 0.7),
            }}
          >
            <div
              style={{
                fontFamily: AR,
                fontWeight: 500,
                fontSize: 54,
                padding: '18px 44px 24px',
                borderRadius: 22,
                background: c.green ? C.green : '#fff',
                color: '#111',
                rotate: `${c.rot + fall * (i - 1) * 30}deg`,
                boxShadow: '0 14px 34px rgba(0,0,0,0.45)',
                translate: `${(i - 1) * 40}px 0`,
              }}
            >
              {c.t}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- 3. star slam + gooey wipe ---------------- */
const Star: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill={C.green} stroke={C.green} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);
const GooeyWipe: React.FC<{progress: number}> = ({progress}) => {
  const f = useCurrentFrame();
  const y = interpolate(progress, [0, 1], [-200, 2300]);
  const pts: string[] = [];
  for (let x = 0; x <= 1080; x += 40) {
    const wave = Math.sin(x / 120 + f / 4) * 60 + Math.sin(x / 47 - f / 3) * 25;
    pts.push(`${x},${y + wave}`);
  }
  const drips = [120, 330, 520, 760, 940].map((x, i) => ({x, r: 50 + random(`r${i}`) * 50, dy: 80 + random(`d${i}`) * 220}));
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12" />
        </filter>
        <linearGradient id="greyg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d1d1d1" />
          <stop offset="1" stopColor="#bdbdbb" />
        </linearGradient>
      </defs>
      <g filter="url(#goo)" fill="url(#greyg)">
        <polygon points={`0,-300 ${pts.join(' ')} 1080,-300`} />
        {drips.map((d, i) => (
          <circle key={i} cx={d.x} cy={y + d.dy * progress * 2} r={d.r} />
        ))}
      </g>
    </svg>
  );
};
const Turn: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = interpolate(f, [0, 7], [-700, 0], {...clamp, easing: Easing.in(Easing.quad)});
  const squash = interpolate(f, [7, 10, 16], [1, 0.75, 1], clamp);
  const wipe = interpolate(f, [8, 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Grid />
      <div style={{position: 'absolute', left: 540 - 130, top: 760 + slam, scale: `${2 - squash} ${squash}`, transformOrigin: '50% 100%'}}>
        <Star size={260} />
      </div>
      <GooeyWipe progress={wipe} />
      {snap(f, fps, 0) && null}
    </AbsoluteFill>
  );
};

/* ---------------- 4. clarity ---------------- */
const Cursor: React.FC<{size?: number}> = ({size = 90}) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 28 31">
    <path d="M26 2 L2 14 L13 17 L17 29 Z" fill={C.green} />
  </svg>
);
const Clarity: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = snap(f, fps, 0, 14);
  const curX = interpolate(f, [6, 20], [340, 0], {...clamp, easing: out});
  const curY = interpolate(f, [6, 20], [260, 0], {...clamp, easing: out});
  const press = interpolate(f, [20, 23, 27], [1, 0.85, 1], clamp);
  const box = interpolate(f, [22, 32], [0, 1], {...clamp, easing: out});
  const push = interpolate(f, [26, 60], [1, 1.35], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#d1d1d1,#c5c6c4)', alignItems: 'center', justifyContent: 'center'}}>
      <div dir="rtl" style={{textAlign: 'center', fontFamily: AR, color: '#111', scale: String(push * (0.85 + inS * 0.15)), opacity: inS}}>
        <div style={{fontWeight: 300, fontSize: 96, lineHeight: 1.2}}>وهنا يجي</div>
        <div style={{position: 'relative', display: 'inline-block', margin: '6px 0'}}>
          <div style={{position: 'absolute', inset: '-4px -26px', background: C.greenTint, border: `4px solid ${C.green}`, transformOrigin: '0% 100%', scale: `${box} 1`}} />
          <span style={{position: 'relative', fontWeight: 700, fontSize: 150, lineHeight: 1.25}}>الوضوح</span>
          <div style={{position: 'absolute', left: -60 - curX, bottom: -70 - curY, scale: String(press)}}>
            <Cursor />
          </div>
        </div>
        <div style={{fontWeight: 300, fontSize: 96, lineHeight: 1.2}}>مع المتمكن.</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 5. pillars on orbit rings ---------------- */
const LineIcon: React.FC<{kind: number; p: number}> = ({kind, p}) => {
  const common = {fill: 'none', stroke: C.green, strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
  return (
    <svg width={280} height={280} viewBox="0 0 64 64">
      {kind === 0 ? ( // batches: stacked boxes
        <>
          <path {...common} d="M10 22 L32 12 L54 22 L32 32 Z" />
          <path {...common} d="M10 32 L32 42 L54 32" />
          <path {...common} d="M10 42 L32 52 L54 42" />
        </>
      ) : kind === 1 ? ( // search
        <>
          <circle {...common} cx={28} cy={28} r={14} />
          <path {...common} d="M38 38 L52 52" />
          <path {...common} d="M22 28 H34" />
        </>
      ) : kind === 2 ? ( // PDF report
        <>
          <path {...common} d="M18 8 H40 L50 18 V56 H18 Z" />
          <path {...common} d="M40 8 V18 H50" />
          <path {...common} d="M24 30 H44 M24 38 H44 M24 46 H36" />
        </>
      ) : ( // share
        <>
          <circle {...common} cx={46} cy={16} r={6} />
          <circle {...common} cx={18} cy={32} r={6} />
          <circle {...common} cx={46} cy={48} r={6} />
          <path {...common} d="M23.5 29 L40.5 19 M23.5 35 L40.5 45" />
        </>
      )}
    </svg>
  );
};
const PILLARS = ['الدفعات', 'البحث', 'تقرير PDF', 'المشاركة'];
const Pillars: React.FC<{beat: number}> = ({beat}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const idx = Math.min(PILLARS.length - 1, Math.floor(f / beat));
  const lf = f - idx * beat;
  const rot = idx * 40 + interpolate(lf, [0, 10], [-40, 0], {...clamp, easing: out}) + f * 0.25;
  const cx = 380;
  const cy = 960;
  const wordIn = snap(lf, fps, 2, 13);
  const iconIn = snap(lf, fps, 0, 10);
  return (
    <AbsoluteFill style={{background: C.black}}>
      {/* glow ring */}
      <div style={{position: 'absolute', left: cx - 560, top: cy - 560, width: 1120, height: 1120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,0,0,1) 34%, rgba(255,255,255,0.75) 47%, rgba(255,255,255,0.12) 58%, rgba(0,0,0,0) 70%)'}} />
      {/* orbits */}
      <div style={{position: 'absolute', left: cx - 760, top: cy - 760, width: 1520, height: 1520, rotate: `${rot}deg`}}>
        {[{r: 480, n: 3, s: 34}, {r: 740, n: 3, s: 52}].map((o, k) => (
          <React.Fragment key={k}>
            <div style={{position: 'absolute', left: 760 - o.r, top: 760 - o.r, width: o.r * 2, height: o.r * 2, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.85)'}} />
            {Array.from({length: o.n}).map((_, i) => {
              const a = (i / o.n) * Math.PI * 2 + k * 0.7 + (f / fps) * (k ? 0.25 : -0.35);
              return <div key={i} style={{position: 'absolute', left: 760 + Math.cos(a) * o.r - o.s / 2, top: 760 + Math.sin(a) * o.r - o.s / 2, width: o.s, height: o.s, borderRadius: '50%', background: '#fff'}} />;
            })}
          </React.Fragment>
        ))}
      </div>
      {/* icon */}
      <div style={{position: 'absolute', left: cx - 140, top: cy - 140, scale: String(0.6 + iconIn * 0.4), opacity: Math.min(1, iconIn * 2)}}>
        <LineIcon kind={idx} p={interpolate(lf, [0, 16], [0, 1], {...clamp, easing: out})} />
      </div>
      {/* vertical word */}
      <div style={{position: 'absolute', left: 962, top: cy, width: 0, height: 0}}>
        <div
          dir="rtl"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) rotate(-90deg) translateX(${(1 - wordIn) * -260}px)`,
            whiteSpace: 'nowrap',
            fontFamily: AR,
            fontWeight: 400,
            fontSize: 104,
            color: '#fff',
            opacity: Math.min(1, wordIn * 1.5),
          }}
        >
          {PILLARS[idx]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 6. pen line: ball bounces, words land ---------------- */
const BOUNCES = [
  {x: 900, word: 'كل'},
  {x: 640, word: 'دفعة'},
  {x: 300, word: 'تحت عينك'},
];
const PenLine: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ground = 980;
  // piecewise: drop from top to first bounce, then arcs to next points
  const seg = 14;
  const pathPts: [number, number][] = [];
  const ballAt = (t: number): [number, number] => {
    if (t <= seg) {
      const k = t / seg;
      return [BOUNCES[0].x, -100 + (ground + 100) * k * k];
    }
    const i = Math.min(BOUNCES.length - 1, Math.floor((t - seg) / seg));
    const k = Math.min(1, (t - seg - i * seg) / seg);
    const a = BOUNCES[i];
    const b = BOUNCES[Math.min(BOUNCES.length - 1, i + 1)] ?? a;
    if (i >= BOUNCES.length - 1) return [a.x - k * 120, ground - Math.sin(k * Math.PI * 0.5) * 60];
    return [a.x + (b.x - a.x) * k, ground - Math.sin(k * Math.PI) * (220 - i * 50)];
  };
  for (let t = 0; t <= Math.min(f, seg * 4); t += 0.5) pathPts.push(ballAt(t));
  const [bx, by] = ballAt(Math.min(f, seg * 4));
  const fade = interpolate(f, [52, 60], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: C.black}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: fade}}>
        <polyline points={pathPts.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={bx} cy={by} r={16} fill={C.green} />
      </svg>
      {BOUNCES.map((b, i) => {
        const land = seg + i * seg;
        const s = snap(f, fps, land, 9);
        const off = (i % 2 ? 1 : -1) * 22 * (1 - interpolate(f, [land + 4, land + 14], [0, 1], clamp));
        return (
          <div key={i} dir="rtl" style={{position: 'absolute', top: ground + 40 + off, left: b.x - 250, width: 500, textAlign: 'center', fontFamily: AR, fontWeight: i === 2 ? 700 : 400, fontSize: 88, color: i === 2 ? C.green : '#fff', scale: String(s), opacity: Math.min(1, s * 2) * (f < 56 ? 1 : interpolate(f, [56, 60], [1, 0.4], clamp))}}>
            {b.word}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- 7. waveform + glitch reveal ---------------- */
const Waveform: React.FC = () => {
  const f = useCurrentFrame();
  const bars = 22;
  const reveal = interpolate(f, [8, 22], [1, 0], clamp);
  const word = 'المتمكن';
  const strips = 7;
  return (
    <AbsoluteFill style={{background: C.black, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', display: 'flex', gap: 14, alignItems: 'center', height: 700}}>
        {Array.from({length: bars}).map((_, i) => {
          const h = 160 + Math.abs(Math.sin(i * 0.7 + f / 3)) * 300 + random(`b${i}-${Math.floor(f / 2)}`) * 120;
          return <div key={i} style={{width: 30, height: h, borderRadius: 15, background: C.darkGreen, opacity: 0.85}} />;
        })}
      </div>
      <div style={{position: 'relative', width: 900, height: 220, opacity: f > 6 ? 1 : 0}}>
        {Array.from({length: strips}).map((_, s) => {
          const dx = (random(`g${s}`) - 0.5) * 260 * reveal;
          return (
            <div key={s} dir="rtl" style={{position: 'absolute', inset: 0, textAlign: 'center', fontFamily: AR, fontWeight: 700, fontSize: 180, lineHeight: '220px', color: C.green, clipPath: `inset(${(s / strips) * 100}% 0 ${100 - ((s + 1) / strips) * 100}% 0)`, translate: `${dx}px 0`}}>
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 8. logo sting (style 3) ---------------- */
const StingWord: React.FC = () => {
  const f = useCurrentFrame();
  const wordIn = interpolate(f, [0, 10], [80, 0], {...clamp, easing: out});
  const dotY = f < 14 ? interpolate(f, [4, 14], [-420, 0], {...clamp, easing: Easing.in(Easing.quad)}) : f < 24 ? -Math.sin(((f - 14) / 10) * Math.PI) * 90 : 0;
  const recolor = interpolate(f, [28, 40], [0, 1], {...clamp, easing: out});
  const cursorX = interpolate(f, [16, 34], [-260, 300], clamp);
  return (
    <AbsoluteFill style={{background: C.black, alignItems: 'center', justifyContent: 'center'}}>
      <div dir="rtl" style={{display: 'flex', alignItems: 'baseline', fontFamily: AR, fontSize: 104, translate: `0 ${wordIn}px`, opacity: interpolate(f, [0, 6], [0, 1], clamp)}}>
        <span style={{color: C.green, fontWeight: 300}}>مخزنك</span>
        <span style={{width: 26}} />
        <span style={{position: 'relative', fontWeight: 700}}>
          <span style={{color: '#fff'}}>تحت السيطرة</span>
          <span style={{position: 'absolute', inset: 0, color: C.green, clipPath: `inset(0 0 0 ${(1 - recolor) * 100}%)`}}>تحت السيطرة</span>
        </span>
        {f >= 4 ? <span style={{display: 'inline-block', width: 28, height: 28, borderRadius: 14, background: C.green, marginInlineStart: 10, translate: `0 ${dotY}px`}} /> : null}
      </div>
      {f > 16 && f < 36 ? (
        <div style={{position: 'absolute', top: 1060, left: 540 + cursorX}}>
          <Cursor size={56} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const StingLogo: React.FC = () => {
  const f = useCurrentFrame();
  const sym = interpolate(f, [0, 14], [0, 1], {...clamp, easing: out});
  const wipe = interpolate(f, [8, 24], [0, 1], {...clamp, easing: out});
  const sub = interpolate(f, [20, 30], [0, 1], clamp);
  const tag = interpolate(f, [4, 14], [0, 1], clamp);
  const ellipse = interpolate(f, [14, 32], [0, 1], {...clamp, easing: out});
  const lines = ['صلاحية المنتجات · تقرير PDF', '@almutamakkin'];
  const MARK = /[ً-ٰٟۖ-ۭ]/;
  const g = (t: string) => {
    const r: string[] = [];
    for (const c of t) {
      if (MARK.test(c) && r.length) r[r.length - 1] += c;
      else r.push(c);
    }
    return r;
  };
  return (
    <AbsoluteFill style={{background: C.black, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div dir="rtl" style={{fontFamily: AR, fontWeight: 400, fontSize: 46, color: '#fff', opacity: tag, marginBottom: 26}}>
          <span style={{position: 'relative', display: 'inline-block', padding: '0 14px'}}>
            أدِر
            <svg viewBox="0 0 140 80" preserveAspectRatio="none" style={{position: 'absolute', left: -18, top: -12, width: 'calc(100% + 36px)', height: 'calc(100% + 24px)', overflow: 'visible'}}>
              <path d="M70 6 C120 4 138 22 134 42 C130 66 90 76 58 74 C22 72 4 58 6 38 C8 18 34 8 76 9" fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ellipse} />
            </svg>
          </span>{' '}
          متجرك بوضوح وثقة
        </div>
        <div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{width: 160, height: 160, opacity: sym, translate: `${(1 - sym) * 160}px 0`, rotate: `${(1 - sym) * 40}deg`}}>
            <Img src={staticFile('brand-mark-white.png')} style={{width: '100%', height: '100%'}} />
          </div>
          <div>
            <div style={{fontFamily: AR, fontWeight: 700, fontSize: 124, lineHeight: 1.1, color: '#fff', clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)`}}>المتمكن</div>
            <div style={{fontFamily: AR, fontWeight: 500, fontSize: 34, letterSpacing: 9, color: C.green, opacity: sub, direction: 'ltr', textAlign: 'right'}}>AL-MUTAMAKKIN</div>
          </div>
        </div>
        <div style={{marginTop: 56, textAlign: 'center'}}>
          {lines.map((l, i) => {
            const gl = g(l);
            const n = Math.round(interpolate(f, [30 + i * 5, 30 + i * 5 + gl.length * 0.8], [0, gl.length], clamp));
            return (
              <div key={i} dir={i === 0 ? 'rtl' : 'ltr'} style={{fontFamily: AR, fontWeight: 400, fontSize: 44, lineHeight: 1.45, color: '#fff', minHeight: 64}}>
                {gl.slice(0, n).join('')}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- timeline ---------------- */
export const TIMELINE = {
  title: [0, 45],
  problem: [45, 150],
  turn: [150, 180],
  clarity: [180, 240],
  pillars: [240, 360],
  pen: [360, 420],
  wave: [420, 465],
  stingWord: [465, 513],
  stingLogo: [513, 600],
} as const;
const Seq: React.FC<{k: keyof typeof TIMELINE; children: React.ReactNode}> = ({k, children}) => (
  <Sequence name={k} from={TIMELINE[k][0]} durationInFrames={TIMELINE[k][1] - TIMELINE[k][0]}>
    {children}
  </Sequence>
);
const Fonts: React.FC = () => (
  <style>
    {[
      ['Light', 300],
      ['Regular', 400],
      ['Medium', 500],
      ['Bold', 700],
    ]
      .map(([n, w]) => `@font-face{font-family:'IBM Plex Sans Arabic';font-weight:${w};font-display:block;src:url('${staticFile(`fonts/IBMPlexSansArabic-${n}.ttf`)}') format('truetype');}`)
      .join('\n')}
  </style>
);

export const ExpiryPulse: React.FC = () => (
  <AbsoluteFill style={{background: C.black}}>
    <Fonts />
    <Seq k="title"><TitleSmash /></Seq>
    <Seq k="problem"><Problem /></Seq>
    <Seq k="turn"><Turn /></Seq>
    <Seq k="clarity"><Clarity /></Seq>
    <Seq k="pillars"><Pillars beat={30} /></Seq>
    <Seq k="pen"><PenLine /></Seq>
    <Seq k="wave"><Waveform /></Seq>
    <Seq k="stingWord"><StingWord /></Seq>
    <Seq k="stingLogo"><StingLogo /></Seq>
  </AbsoluteFill>
);
