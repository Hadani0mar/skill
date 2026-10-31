// «أرشيف القصة» — Supabase، نسخة الجريدة. Facts: research/facts.md · Brand: research/brand.md
// Official logos from github.com/supabase/supabase (apps/www/public/brand-assets). Background: React Bits «Silk» (frame-driven).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShaderLayer} from './ShaderLayer';
import {SILK_FRAG} from './silkShader';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1020;

const GREEN = '#3ECF8E';
const DEEP = '#249361';
const DARK = '#121212';
const INK = '#1a1814';
const PAPER = '#efe8d8';
const AR = "'IBM Plex Sans Arabic', sans-serif";
const NASKH = "'Amiri', serif";
const SERIF = "'Playfair', serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const out = Easing.out(Easing.cubic);
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

/* ---------- shared ---------- */
const SilkBg: React.FC<{opacity?: number; speed?: number}> = ({opacity = 0.55, speed = 0.45}) => (
  <AbsoluteFill style={{opacity}}>
    <ShaderLayer
      frag={SILK_FRAG}
      uniforms={(t, w, h) => ({
        uView: [w, h], uScale: 1, uRotation: 0.35, uTime: t * speed, uWave: 1, uRipple: 1, uFold: 1, uShift: [0, 0],
        uPointer: [0, 0, 0, 0.32], uDrag: [0, 0], uWaves: new Array(16).fill(0),
        uColor: hex(DEEP), uSheenColor: hex(GREEN), uNoiseIntensity: 1.2, uDepth: 0.5, uSheen: 0.55, uGlow: 0,
        uLightMode: 0, uLight: [0.3, 0.5, 0], uStep: [1 / w, 1 / h], uPresence: 1, uFade: 0,
      })}
    />
  </AbsoluteFill>
);
const Vignette: React.FC<{strength?: number}> = ({strength = 0.85}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, rgba(18,18,18,0.15) 0%, rgba(18,18,18,${strength}) 75%)`}} />
);
const Grain: React.FC<{opacity?: number}> = ({opacity = 0.18}) => {
  const f = useCurrentFrame();
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <filter id={`g${f % 4}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 4} />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${f % 4})`} />
    </svg>
  );
};
const Watermark: React.FC<{dark?: boolean}> = ({dark = true}) => (
  <div style={{position: 'absolute', bottom: 110, width: '100%', textAlign: 'center', fontFamily: AR, fontSize: 26, letterSpacing: 2, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'}}>@almutamakkin</div>
);
/** BlurText-style: each word resolves from blur (React Bits BlurText, frame-driven) */
const BlurWords: React.FC<{text: string; start: number; step?: number; style?: React.CSSProperties; colorFor?: (w: string, i: number) => string | undefined}> = ({text, start, step = 4, style, colorFor}) => {
  const f = useCurrentFrame();
  return (
    <span dir="rtl" style={style}>
      {text.split(' ').map((w, i) => {
        const p = interpolate(f, [start + i * step, start + i * step + 14], [0, 1], {...clamp, easing: out});
        return (
          <React.Fragment key={i}>
            <span style={{display: 'inline-block', filter: `blur(${(1 - p) * 14}px)`, opacity: p, translate: `0 ${(1 - p) * -24}px`, color: colorFor?.(w, i)}}>{w}</span>{' '}
          </React.Fragment>
        );
      })}
    </span>
  );
};

/* ---------- 1. hook ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const icon = spring({frame: f - 6, fps, config: {damping: 14, mass: 0.9}});
  const glow = interpolate(f, [6, 30, 90], [0, 1, 0.5], clamp);
  const word = interpolate(f, [28, 46], [0, 1], {...clamp, easing: out});
  const lift = interpolate(f, [40, 70], [0, -160], {...clamp, easing: io});
  return (
    <AbsoluteFill style={{background: DARK}}>
      <SilkBg opacity={interpolate(f, [0, 30], [0, 0.6], clamp)} />
      <Vignette />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', translate: `0 ${lift}px`}}>
        <div style={{scale: String(0.4 + icon * 0.6), opacity: Math.min(1, icon * 1.5), filter: `drop-shadow(0 0 ${40 * glow}px rgba(62,207,142,${0.8 * glow}))`}}>
          <Img src={staticFile('brand/supabase-icon-green-transparent.svg')} style={{width: 260, height: 260 * (113 / 109)}} />
        </div>
        <div style={{marginTop: 50, opacity: word, clipPath: `inset(0 ${(1 - word) * 100}% 0 0)`}}>
          <Img src={staticFile('brand/supabase-logo-green-white-transparent.svg')} style={{width: 640}} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 1180, left: 80, right: 80, textAlign: 'center', fontFamily: AR, fontWeight: 300, fontSize: 64, color: '#fff', lineHeight: 1.35}}>
        <BlurWords text="قصة جملة واحدة" start={56} />
        <br />
        <BlurWords text="غيّرت مصير شركة" start={70} style={{fontWeight: 700}} colorFor={(w) => (w === 'شركة' ? GREEN : undefined)} />
      </div>
      <Grain opacity={0.12} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ---------- 2. the newspaper ---------- */
type Article = {kicker: string; title: string; body: React.ReactNode; aside?: React.ReactNode};
/** highlighter that survives line wraps (box-decoration-break), sweeps right→left */
const HL: React.FC<{p: number; children: React.ReactNode; color?: string}> = ({p, children, color = 'rgba(62,207,142,0.55)'}) => (
  <span
    style={{
      backgroundImage: `linear-gradient(to left, ${color} ${p * 100}%, transparent ${p * 100}%)`,
      WebkitBoxDecorationBreak: 'clone',
      boxDecorationBreak: 'clone',
      padding: '0 6px',
      borderRadius: 4,
    }}
  >
    {children}
  </span>
);
const STOP_LEN = 105; // frames per article
const PAGE_START = 0;
const stopOf = (i: number) => PAGE_START + 40 + i * STOP_LEN; // frame the camera arrives at article i
const hlP = (f: number, i: number, delay = 18) => interpolate(f, [stopOf(i) + delay, stopOf(i) + delay + 16], [0, 1], {...clamp, easing: out});

const OldSite: React.FC<{f: number; i: number}> = ({f, i}) => {
  const strike = interpolate(f, [stopOf(i) + 34, stopOf(i) + 46], [0, 1], {...clamp, easing: out});
  const newIn = interpolate(f, [stopOf(i) + 46, stopOf(i) + 60], [0, 1], clamp);
  return (
    <div style={{border: `3px solid ${INK}`, padding: '26px 30px', background: '#f7f2e6', direction: 'ltr', fontFamily: SERIF}}>
      <div style={{fontSize: 24, letterSpacing: 4, opacity: 0.6}}>SUPABASE.IO · MAY 2020</div>
      <div style={{position: 'relative', display: 'inline-block', fontSize: 52, marginTop: 10}}>
        Real-time Postgres
        <span style={{position: 'absolute', left: 0, top: '55%', height: 6, width: `${strike * 100}%`, background: '#b3261e'}} />
      </div>
      <div style={{fontSize: 46, fontWeight: 700, marginTop: 8, opacity: newIn, color: '#0f3d29'}}>The open-source Firebase alternative</div>
    </div>
  );
};

const Newspaper: React.FC = () => {
  const f = useCurrentFrame();
  const ARTICLES: Article[] = [
    {
      kicker: 'يناير 2020 · سنغافورة',
      title: 'مطوّران يبدآن مشروعًا اسمه Supabase',
      body: (
        <>
          في <HL p={hlP(f, 0)}>يناير 2020</HL> أسّس بول كوبلستون وآنت ويلسون الشركة، بعد تجربة مرهقة مع حدود Firebase وأداة صنعها بول لتضيف
          التحديث اللحظي إلى Postgres.
        </>
      ),
      aside: <Img src={staticFile('brand/supabase-icon-green-transparent.svg')} style={{width: 120}} />,
    },
    {
      kicker: 'أبريل 2020',
      title: 'بعد أشهر من العمل… بداية بطيئة',
      body: (
        <>
          الخدمة تستضيف <HL p={hlP(f, 1)}>8 قواعد بيانات فقط</HL>، والموقع يقدّم نفسه بجملة تقنية: Real-time Postgres.
        </>
      ),
    },
    {
      kicker: 'مايو 2020',
      title: 'جملة واحدة تقلب الموازين',
      body: (
        <>
          تغيّر شعار الموقع إلى <HL p={hlP(f, 2, 62)}>The open-source Firebase alternative</HL>، فقفزت قواعد البيانات <HL p={hlP(f, 2, 76)}>من 8 إلى 800 خلال ثلاثة أيام</HL> ووصلت الصفحة لأعلى Hacker News.
        </>
      ),
      aside: <OldSite f={f} i={2} />,
    },
    {
      kicker: 'صيف 2020',
      title: 'القبول في Y Combinator',
      body: (
        <>
          انضمت الشركة إلى <HL p={hlP(f, 3)}>دفعة S20</HL>، وهي أول دفعة في تاريخ المسرّعة تُدار بالكامل عن بُعد.
        </>
      ),
    },
    {
      kicker: 'يونيو 2026',
      title: 'تقييم يتجاوز عشرة مليارات',
      body: (
        <>
          جولة بقيمة 500 مليون دولار بتقييم <HL p={hlP(f, 4)}>10.5 مليار دولار</HL>، وأكثر من 9 ملايين مطوّر، وأغلب قواعد البيانات الجديدة تُنشئها أدوات الذكاء الاصطناعي.
        </>
      ),
    },
  ];
  const ART_HS = [560, 470, 820, 450, 560];
  const HEAD_H = 470;
  const topOf = (i: number) => HEAD_H + ART_HS.slice(0, i).reduce((a, b) => a + b, 0);
  // camera: page Y offset so article i sits around y≈600 on screen
  const targetY = (i: number) => -topOf(i) + 600;
  let camY = 120; // masthead framing before first stop
  for (let i = 0; i < ARTICLES.length; i++) {
    const p = interpolate(f, [stopOf(i) - 30, stopOf(i)], [0, 1], {...clamp, easing: io});
    camY = camY + (targetY(i) - camY) * p;
  }
  const push = 1 + 0.035 * Math.sin(Math.min(1, (f % STOP_LEN) / STOP_LEN) * Math.PI);
  const enter = interpolate(f, [0, 20], [0, 1], {...clamp, easing: out});
  return (
    <AbsoluteFill style={{background: '#1d1b17'}}>
      <AbsoluteFill style={{perspective: 2200}}>
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 0,
            width: 960,
            transform: `translateY(${camY + (1 - enter) * 400}px) rotateX(7deg) rotateZ(-1.2deg) scale(${push})`,
            transformOrigin: '50% 30%',
            background: `linear-gradient(170deg, #f4eee0, ${PAPER} 40%, #e4dcc8)`,
            boxShadow: '0 50px 120px rgba(0,0,0,0.7)',
            padding: '50px 60px 80px',
            boxSizing: 'border-box',
            color: INK,
          }}
        >
          {/* masthead */}
          <div style={{height: HEAD_H - 50, boxSizing: 'border-box'}}>
            <div dir="rtl" style={{display: 'flex', justifyContent: 'space-between', fontFamily: AR, fontSize: 24, borderBottom: `2px solid ${INK}`, paddingBottom: 10}}>
              <span>العدد الخاص</span>
              <span>قصة شركة في خمس محطات</span>
              <span>السعر: جملة واحدة</span>
            </div>
            <div dir="rtl" style={{fontFamily: NASKH, fontWeight: 700, fontSize: 150, textAlign: 'center', lineHeight: 1.25, marginTop: 10}}>أرشيف المطوّرين</div>
            <div style={{borderTop: `6px double ${INK}`, borderBottom: `2px solid ${INK}`, padding: '10px 0', display: 'flex', justifyContent: 'center', gap: 22, alignItems: 'center'}}>
              <Img src={staticFile('brand/supabase-logo-green-black-transparent.svg')} style={{height: 40}} />
              <span dir="rtl" style={{fontFamily: AR, fontSize: 30}}>· من 8 قواعد بيانات إلى 10.5 مليار</span>
            </div>
          </div>
          {ARTICLES.map((a, i) => (
            <div key={i} dir="rtl" style={{height: ART_HS[i], boxSizing: 'border-box', borderBottom: `1px solid rgba(26,24,20,0.35)`, paddingTop: 34}}>
              <div style={{fontFamily: AR, fontWeight: 700, fontSize: 30, color: '#8a1f17', letterSpacing: 0.5}}>{a.kicker}</div>
              <div style={{fontFamily: NASKH, fontWeight: 700, fontSize: 72, lineHeight: 1.25, marginTop: 6}}>{a.title}</div>
              <div style={{display: 'flex', gap: 30, marginTop: 18, alignItems: 'flex-start'}}>
                <div style={{flex: 1, fontFamily: NASKH, fontSize: 46, lineHeight: 1.7, textAlign: 'justify'}}>{a.body}</div>
                {a.aside && i !== 2 ? <div style={{width: 170, height: 170, border: `2px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#f7f2e6'}}>{a.aside}</div> : null}
              </div>
              {i === 2 ? <div style={{marginTop: 18}}>{a.aside}</div> : null}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)'}} />
      <Grain opacity={0.16} />
    </AbsoluteFill>
  );
};

/* ---------- 3. proof ---------- */
const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const a = Math.round(interpolate(f, [10, 50], [8, 800], {...clamp, easing: Easing.in(Easing.quad)}));
  const b = Math.round(interpolate(f, [82, 125], [0, 9], {...clamp, easing: out}));
  const second = f >= 75;
  return (
    <AbsoluteFill style={{background: DARK}}>
      <SilkBg opacity={0.45} speed={0.6} />
      <Vignette strength={0.9} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', opacity: second ? interpolate(f, [75, 82], [1, 0], clamp) : interpolate(f, [0, 8], [0, 1], clamp)}}>
          <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 380, lineHeight: 1, color: GREEN, textShadow: '0 0 60px rgba(62,207,142,0.45)'}}>{a}</div>
          <div dir="rtl" style={{fontFamily: AR, fontSize: 62, color: '#fff', marginTop: 10}}>قاعدة بيانات في 3 أيام</div>
        </div>
        {second ? (
          <div style={{position: 'absolute', textAlign: 'center', opacity: interpolate(f, [78, 88], [0, 1], clamp)}}>
            <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 300, lineHeight: 1, color: '#fff'}}>
              +{b}M
            </div>
            <div dir="rtl" style={{fontFamily: AR, fontSize: 62, color: GREEN, marginTop: 10}}>مطوّر يبنون عليها اليوم</div>
          </div>
        ) : null}
      </AbsoluteFill>
      <Grain opacity={0.12} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ---------- 4. lesson ---------- */
const Lesson: React.FC = () => {
  const f = useCurrentFrame();
  const strike = interpolate(f, [26, 38], [0, 1], {...clamp, easing: out});
  const newIn = interpolate(f, [40, 58], [0, 1], {...clamp, easing: out});
  return (
    <AbsoluteFill style={{background: DARK}}>
      <Vignette strength={0.6} />
      <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center'}}>
        <div style={{position: 'relative', display: 'inline-block', fontFamily: SERIF, fontSize: 72, color: 'rgba(255,255,255,0.55)', opacity: interpolate(f, [0, 10], [0, 1], clamp)}}>
          Real-time Postgres
          <span style={{position: 'absolute', left: 0, top: '55%', height: 5, width: `${strike * 100}%`, background: '#e5484d'}} />
        </div>
        <div dir="rtl" style={{fontFamily: AR, fontWeight: 300, fontSize: 46, color: 'rgba(255,255,255,0.6)', marginTop: 6}}>
          <BlurWords text="تقول شنو هو المنتج" start={10} step={3} />
        </div>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: GREEN, marginTop: 90, opacity: newIn, filter: `blur(${(1 - newIn) * 10}px)`, textShadow: `0 0 ${30 * newIn}px rgba(62,207,142,0.6)`, padding: '0 40px'}}>
          The open-source Firebase alternative
        </div>
        <div dir="rtl" style={{fontFamily: AR, fontWeight: 500, fontSize: 50, color: '#fff', marginTop: 10}}>
          <BlurWords text="تقول ليش تحتاجه" start={52} step={3} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 1260, left: 80, right: 80, textAlign: 'center', fontFamily: AR, fontWeight: 700, fontSize: 76, color: '#fff', lineHeight: 1.3}}>
        <BlurWords text="أحيانًا جملتك أهم من كودك." start={78} step={4} colorFor={(w) => (w === 'جملتك' ? GREEN : undefined)} />
      </div>
      <Grain opacity={0.1} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ---------- 5. end ---------- */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 16}});
  const sweep = interpolate(f, [16, 40], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{background: DARK}}>
      <SilkBg opacity={0.35} />
      <Vignette strength={0.92} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', scale: String(0.85 + s * 0.15), opacity: s}}>
          <Img src={staticFile('brand/supabase-logo-green-white-transparent.svg')} style={{width: 720, display: 'block'}} />
          {/* ShinyText-style sheen sweeping across the official logo (overlay only; logo untouched) */}
          <div style={{position: 'absolute', inset: -20, background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,255,255,0.35) ${sweep}%, transparent ${sweep + 12}%)`, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
        </div>
        <div dir="rtl" style={{marginTop: 120, fontFamily: AR, fontSize: 50, color: '#fff', opacity: interpolate(f, [30, 42], [0, 1], clamp)}}>
          اكتب جملة منتجك في التعليقات
        </div>
        <div dir="rtl" style={{marginTop: 16, fontFamily: AR, fontWeight: 300, fontSize: 34, color: 'rgba(255,255,255,0.6)', opacity: interpolate(f, [40, 52], [0, 1], clamp)}}>
          ونقولك هل تقول «شنو هو» ولا «ليش تحتاجه»
        </div>
      </AbsoluteFill>
      <Grain opacity={0.1} />
      <Watermark />
    </AbsoluteFill>
  );
};

/* ---------- timeline ---------- */
export const TIMELINE = {
  hook: [0, 105],
  paper: [105, 105 + 40 + 5 * STOP_LEN + 10], // 105–680
  proof: [680, 830],
  lesson: [830, 945],
  end: [945, 1020],
} as const;
const Fade: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, 8, len - 6, len], [0, 1, 1, 0], clamp)}}>{children}</AbsoluteFill>;
};
const Seq: React.FC<{k: keyof typeof TIMELINE; children: React.ReactNode}> = ({k, children}) => {
  const [a, b] = TIMELINE[k];
  return (
    <Sequence name={k} from={a} durationInFrames={b - a}>
      <Fade len={b - a}>{children}</Fade>
    </Sequence>
  );
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
export const SupabaseNewspaper: React.FC = () => (
  <AbsoluteFill style={{background: DARK}}>
    <Fonts />
    <Seq k="hook"><Hook /></Seq>
    <Seq k="paper"><Newspaper /></Seq>
    <Seq k="proof"><Proof /></Seq>
    <Seq k="lesson"><Lesson /></Seq>
    <Seq k="end"><End /></Seq>
  </AbsoluteFill>
);
export const _unused = random;
