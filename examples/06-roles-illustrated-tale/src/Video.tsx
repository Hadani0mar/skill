// «حكاية مصوّرة» (Illustrated Tale) — ميزة الأدوار في المتمكن.
// UI labels from almutamakkin-expo-v3: features/aboghris/roles/RolesScreen.tsx, EmployeeSignInScreen.tsx, RoleApp.tsx.
// Names, usernames, the activity code and role codes are SAMPLE data.
// Illustrations: unDraw (free, no attribution required), recoloured to the app primary #cc785c and built piece by piece.
// React Bits: Silk background (frame-driven), BlurText-style word reveals, CountUp, Noise grain, sounds rendered to WAV.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShaderLayer} from './ShaderLayer';
import {SILK_FRAG} from './silkShader';
import ILLUS from './illus.json';
import ION from './ion.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1800;

const C = {
  cream: '#faf9f5', sunken: '#f5f0e8', raised: '#efe9de', border: '#e6dfd8', text: '#141413', subtle: '#6c6a64',
  primary: '#cc785c', strong: '#a9583e', orange: '#e8a55a', success: '#5db872', danger: '#c64545', ink: '#1f1e1b', blush: '#f4e4da',
};
const STORY = "'Readex', sans-serif";
const UI = "'Cairo', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const out = Easing.out(Easing.cubic);
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const ENT = 22;

type Ch = {id: string; s: number; e: number; bg: string; dark: boolean};
const CH: Ch[] = [
  {id: 'hook', s: 0, e: 165, bg: C.cream, dark: false},
  {id: 'problem', s: 165, e: 345, bg: C.ink, dark: true},
  {id: 'turn', s: 345, e: 480, bg: C.strong, dark: true},
  {id: 'code', s: 480, e: 730, bg: C.cream, dark: false},
  {id: 'add', s: 730, e: 1000, bg: C.blush, dark: false},
  {id: 'login', s: 1000, e: 1240, bg: C.ink, dark: true},
  {id: 'views', s: 1240, e: 1505, bg: C.cream, dark: false},
  {id: 'control', s: 1505, e: 1685, bg: C.strong, dark: true},
  {id: 'outro', s: 1685, e: 1800, bg: C.cream, dark: false},
];

/* ---------------- primitives ---------------- */
const FontFaces = () => (
  <style>{`
@font-face{font-family:'Readex';src:url(${staticFile('fonts/Readex.ttf')}) format('truetype');font-weight:160 700;font-display:block}
@font-face{font-family:'Cairo';src:url(${staticFile('fonts/Cairo.ttf')}) format('truetype');font-weight:200 1000;font-display:block}
`}</style>
);

const Ion: React.FC<{n: keyof typeof ION; size?: number; color?: string; style?: React.CSSProperties}> = ({n, size = 40, color = C.primary, style}) => {
  const ic = (ION as any)[n];
  return <svg width={size} height={size} viewBox={`0 0 ${ic.w} ${ic.h}`} style={{color, flexShrink: 0, ...style}} dangerouslySetInnerHTML={{__html: ic.body}} />;
};

/** unDraw illustration that builds itself piece by piece (pop-up book), then floats gently. */
const Illus: React.FC<{name: keyof typeof ILLUS; start: number; width: number; style?: React.CSSProperties; span?: number}> = ({name, start, width, style, span = 34}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const il = (ILLUS as any)[name] as {vb: string; kids: string[]};
  const step = Math.min(1.6, span / il.kids.length);
  const float = Math.sin((f - start) / 38) * 6;
  return (
    <svg viewBox={il.vb} width={width} style={{overflow: 'visible', transform: `translateY(${float}px)`, ...style}}>
      {il.kids.map((k, i) => {
        const t0 = start + i * step;
        const p = spring({frame: f - t0, fps, config: {damping: 12, stiffness: 140}});
        const o = interpolate(f - t0, [0, 5], [0, 1], clamp);
        return (
          <g key={i} style={{opacity: o, transform: `translateY(${(1 - p) * 26}px) scale(${0.55 + 0.45 * p})`, transformBox: 'fill-box', transformOrigin: '50% 100%'}} dangerouslySetInnerHTML={{__html: k}} />
        );
      })}
    </svg>
  );
};

/** BlurText-style reveal (React Bits), per word — Arabic words never split into letters. */
const Words: React.FC<{text: string; start: number; step?: number; hl?: string; hlColor?: string; style?: React.CSSProperties}> = ({text, start, step = 4, hl = '', hlColor = C.primary, style}) => {
  const f = useCurrentFrame();
  const hlw = new Set(hl.split(' ').filter(Boolean));
  return (
    <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.26em', ...style}}>
      {text.split(' ').map((w, i) => {
        if (w === '|') return <div key={i} style={{flexBasis: '100%', height: 0}} />;
        const p = interpolate(f - start - i * step, [0, 14], [0, 1], {...clamp, easing: out});
        return (
          <span key={i} style={{display: 'inline-block', opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * 34}px)`, color: hlw.has(w) ? hlColor : undefined, fontWeight: hlw.has(w) ? 700 : undefined}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Tag: React.FC<{n?: string; label: string; start: number; dark?: boolean}> = ({n, label, start, dark}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - start, [0, 14], [0, 1], {...clamp, easing: out});
  return (
    <div style={{position: 'absolute', top: 150, width: '100%', display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * -20}px)`}}>
      <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 26px 10px 14px', borderRadius: 999, background: dark ? 'rgba(255,255,255,0.12)' : C.sunken, border: `2px solid ${dark ? 'rgba(255,255,255,0.25)' : C.border}`, fontFamily: STORY, fontSize: 30, fontWeight: 500, color: dark ? '#fff' : C.text}}>
        {n ? <span style={{width: 46, height: 46, borderRadius: 23, background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 28}}>{n}</span> : null}
        {label}
      </div>
    </div>
  );
};

const Headline: React.FC<{text: string; start: number; dark?: boolean; hl?: string; top?: number; size?: number}> = ({text, start, dark, hl, top = 236, size = 82}) => (
  <div style={{position: 'absolute', top, left: 60, right: 60}}>
    <Words text={text} start={start} hl={hl} hlColor={dark ? C.orange : C.primary} style={{fontFamily: STORY, fontWeight: 700, fontSize: size, lineHeight: 1.3, color: dark ? '#fff' : C.text}} />
  </div>
);

/** Story caption on a page-like card at the bottom. */
const Caption: React.FC<{text: string; start: number; hl?: string; dark?: boolean; bottom?: number}> = ({text, start, hl, dark, bottom = 150}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - start + 6, [0, 14], [0, 1], {...clamp, easing: out});
  return (
    <div style={{position: 'absolute', bottom, left: 70, right: 70, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <div style={{background: dark ? 'rgba(255,255,255,0.08)' : '#fff', border: `2px solid ${dark ? 'rgba(255,255,255,0.18)' : C.border}`, borderRadius: 34, padding: '30px 40px 34px', boxShadow: dark ? 'none' : '0 18px 40px rgba(20,20,19,0.08)'}}>
        <Words text={text} start={start} step={3} hl={hl} hlColor={dark ? C.orange : C.primary} style={{fontFamily: STORY, fontWeight: 400, fontSize: 46, lineHeight: 1.55, color: dark ? '#fff' : C.text}} />
      </div>
    </div>
  );
};

/** App toast, as in useFeedback().showToast. */
const Toast: React.FC<{text: string; at: number; until?: number; bottom?: number}> = ({text, at, until = 9999, bottom = 470}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 14}});
  const o = interpolate(f, [until, until + 10], [1, 0], clamp);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', bottom, width: '100%', display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - p) * 80}px) scale(${0.9 + 0.1 * p})`}}>
      <div style={{direction: 'rtl', display: 'flex', alignItems: 'center', gap: 16, background: C.text, color: '#fff', borderRadius: 26, padding: '22px 34px', fontFamily: UI, fontWeight: 600, fontSize: 34, boxShadow: '0 16px 40px rgba(0,0,0,0.25)'}}>
        <Ion n="checkmark-circle" size={40} color={C.success} />
        {text}
      </div>
    </div>
  );
};

const press = (f: number, at: number) => (f >= at && f < at + 8 ? 0.94 : 1);
const pulse = (f: number, at: number) => 1 + 0.05 * Math.sin(Math.PI * interpolate(f, [at, at + 12], [0, 1], clamp));

const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode; start: number}> = ({style, children, start}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - start, fps, config: {damping: 15}});
  return (
    <div style={{position: 'absolute', left: 90, right: 90, direction: 'rtl', background: C.cream, border: `3px solid ${C.border}`, borderRadius: 30, padding: 36, fontFamily: UI, color: C.text, boxShadow: '0 30px 70px rgba(20,20,19,0.14)', opacity: interpolate(f - start, [0, 8], [0, 1], clamp), transform: `translateY(${(1 - p) * 70}px)`, ...style}}>
      {children}
    </div>
  );
};

const Row: React.FC<{icon: keyof typeof ION; title: string; sub: string; trailing?: React.ReactNode; start: number; bg?: string; scale?: number}> = ({icon, title, sub, trailing, start, bg = C.cream, scale = 1}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - start, [0, 12], [0, 1], {...clamp, easing: out});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 26, border: `3px solid ${C.border}`, borderRadius: 26, padding: '22px 26px', background: bg, opacity: p, transform: `translateX(${(1 - p) * -40}px) scale(${scale})`}}>
      <div style={{width: 88, height: 88, borderRadius: 18, background: C.sunken, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ion n={icon} size={44} /></div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontWeight: 700, fontSize: 38, lineHeight: 1.35}}>{title}</div>
        <div style={{fontSize: 28, color: C.subtle, lineHeight: 1.4}}>{sub}</div>
      </div>
      {trailing}
    </div>
  );
};

const Switch: React.FC<{on: number}> = ({on}) => (
  <div style={{width: 104, height: 60, borderRadius: 30, background: interpolateColor(on, C.border, C.primary), position: 'relative', flexShrink: 0}}>
    <div style={{position: 'absolute', top: 6, left: 6 + 44 * on, width: 48, height: 48, borderRadius: 24, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'}} />
  </div>
);
function interpolateColor(t: number, a: string, b: string) {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round((v + (B[i] - v) * t) * 255)).join(',')})`;
}

/** React Bits «Silk», frame-driven, tinted to the app's terracotta. */
const SilkBg: React.FC<{opacity?: number}> = ({opacity = 0.9}) => (
  <AbsoluteFill style={{opacity}}>
    <ShaderLayer
      frag={SILK_FRAG}
      uniforms={(t, w, h) => ({
        uView: [w, h], uScale: 1, uRotation: 0.5, uTime: t * 0.5, uWave: 1, uRipple: 1, uFold: 1, uShift: [0, 0],
        uPointer: [0, 0, 0, 0.32], uDrag: [0, 0], uWaves: new Array(16).fill(0),
        uColor: hex(C.strong), uSheenColor: hex(C.orange), uNoiseIntensity: 1.1, uDepth: 0.5, uSheen: 0.5, uGlow: 0,
        uLightMode: 0, uLight: [0.3, 0.5, 0], uStep: [1 / w, 1 / h], uPresence: 1, uFade: 0,
      })}
    />
  </AbsoluteFill>
);

/** React Bits «Noise»-style grain, frame-seeded. */
const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const f = useCurrentFrame();
  const s = Math.floor(f / 2) % 6;
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none', mixBlendMode: 'multiply'}}>
      <filter id={`n${s}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={s} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter={`url(#n${s})`} />
    </svg>
  );
};

/** Cream "book page" frame that holds an illustration on dark chapters. */
const PageFrame: React.FC<{style?: React.CSSProperties; children: React.ReactNode; start: number}> = ({style, children, start}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - start, fps, config: {damping: 14}});
  return (
    <div style={{position: 'absolute', background: C.cream, borderRadius: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + 0.2 * p}) rotate(${(1 - p) * -4}deg)`, opacity: interpolate(f - start, [0, 8], [0, 1], clamp), ...style}}>
      {children}
    </div>
  );
};

/* ---------------- chapters ---------------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chips: [string, number, keyof typeof ION][] = [['محاسب', 27, 'wallet'], ['مشتريات', 54, 'cube'], ['مبيعات', 82, 'search']];
  return (
    <>
      <Headline text="فريقك يكبر…" start={6} size={104} top={260} />
      <div style={{position: 'absolute', top: 560, left: 110, width: 860}}>
        <Illus name="people" start={22} width={860} />
        {chips.map(([t, x, ic], i) => {
          const p = spring({frame: f - 78 - i * 9, fps, config: {damping: 11}});
          return (
            <div key={t} style={{position: 'absolute', top: -40, left: `${x}%`, transform: `translate(-50%, ${(1 - p) * 30}px) scale(${p})`, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `3px solid ${C.primary}`, borderRadius: 999, padding: '10px 22px', fontFamily: STORY, fontWeight: 600, fontSize: 32, color: C.strong, boxShadow: '0 10px 24px rgba(204,120,92,0.25)'}}>
              <Ion n={ic} size={32} />{t}
            </div>
          );
        })}
      </div>
      <Caption text="وكل واحد فيهم له شغل مختلف." start={100} hl="شغل مختلف." />
    </>
  );
};

const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const leaks: [string, keyof typeof ION, number, number][] = [['المالية', 'wallet', -330, -60], ['المخزون', 'cube', 300, -110], ['الحسابات', 'person-circle', -280, 250], ['الموردين', 'megaphone', 320, 230]];
  return (
    <>
      <Tag label="المشكلة" start={8} dark />
      <Headline text="حساب واحد للكل؟" start={14} dark hl="للكل؟" />
      <PageFrame start={26} style={{top: 470, left: 110, width: 860, height: 680}}>
        <Illus name="co-workers" start={34} width={600} />
      </PageFrame>
      {leaks.map(([t, ic, dx, dy], i) => {
        const p = spring({frame: f - 92 - i * 7, fps, config: {damping: 13}});
        return (
          <div key={t} style={{position: 'absolute', left: 540, top: 800, transform: `translate(-50%,-50%) translate(${dx * p}px, ${dy * p}px) scale(${p}) rotate(${(i % 2 ? 4 : -4) * p}deg)`, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `3px solid ${C.danger}`, borderRadius: 22, padding: '14px 24px', fontFamily: UI, fontWeight: 700, fontSize: 34, color: C.danger, boxShadow: '0 14px 30px rgba(0,0,0,0.35)'}}>
            <Ion n={ic} size={36} color={C.danger} />{t}
          </div>
        );
      })}
      <Caption text="يعني الكل يشوف المالية والمخزون… | وكل شي." start={108} hl="وكل شي." dark />
    </>
  );
};

const Turn: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = spring({frame: f - 10, fps, config: {damping: 10}});
  const big = spring({frame: f - 30, fps, config: {damping: 12}});
  return (
    <>
      <SilkBg />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 0%, rgba(60,25,15,0.45) 80%)'}} />
      <div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{width: 260, height: 260, borderRadius: 130, background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ring}) rotate(${(1 - ring) * -90}deg)`, boxShadow: '0 0 0 18px rgba(250,249,245,0.18), 0 0 0 40px rgba(250,249,245,0.08)'}}>
          <Ion n="id-card-outline" size={140} color={C.strong} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 820, width: '100%', textAlign: 'center', fontFamily: STORY, color: '#fff'}}>
        <div style={{fontSize: 52, fontWeight: 400, opacity: interpolate(f, [18, 30], [0, 1], clamp)}}>الحل في المتمكن:</div>
        <div style={{fontSize: 210, fontWeight: 700, lineHeight: 1.25, transform: `scale(${0.6 + 0.4 * big})`, opacity: interpolate(f, [30, 38], [0, 1], clamp)}}>الأدوار</div>
      </div>
      <div style={{position: 'absolute', top: 1240, left: 90, right: 90}}>
        <Words text="كل موظف بحسابه… | ويشوف شغله بس." start={60} hl="شغله بس." hlColor={C.cream} style={{fontFamily: STORY, fontSize: 58, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)'}} />
      </div>
    </>
  );
};

const CodeCh: React.FC = () => {
  const f = useCurrentFrame();
  const code = 'AB7K2Q';
  const n = Math.max(0, Math.min(code.length, Math.floor((f - 52) / 4)));
  const copied = f >= 118;
  return (
    <>
      <Tag n="1" label="معرّف النشاط" start={6} />
      <Headline text="انسخ معرّف النشاط" start={12} hl="معرّف النشاط" />
      <Card start={30} style={{top: 420}}>
        <div style={{fontSize: 30, fontWeight: 700, color: C.subtle}}>معرّف النشاط</div>
        <div style={{marginTop: 20, border: `3px solid ${C.border}`, background: C.sunken, borderRadius: 18, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pulse(f, 76)})`}}>
          <span style={{direction: 'ltr', fontSize: 66, fontWeight: 800, letterSpacing: 16, fontFamily: UI}}>{code.slice(0, n)}</span>
        </div>
        <div style={{marginTop: 20, height: 92, border: `3px solid ${C.border}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, background: copied && f < 126 ? C.sunken : C.cream, transform: `scale(${press(f, 112)})`}}>
          <Ion n="copy-outline" size={40} /><span style={{fontSize: 36, fontWeight: 700, color: C.strong}}>نسخ المعرّف</span>
        </div>
        <div style={{marginTop: 18, fontSize: 29, lineHeight: 1.6, color: C.subtle}}>أرسله لموظفيك؛ يدخلون به من «الدخول كموظف» مع اسم المستخدم وكلمة المرور في أبوغريس.</div>
      </Card>
      <div style={{position: 'absolute', top: 1080, left: 230, width: 620}}>
        <Illus name="share-link" start={130} width={620} />
      </div>
      <Toast text="تم نسخ معرّف النشاط." at={120} until={200} bottom={860} />
      <Caption text="ترسله لموظفك… وهذا مفتاح دخوله لنشاطك." start={150} hl="مفتاح دخوله" />
    </>
  );
};

const AddCh: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const emps: [string, string][] = [['سالم المبروك', 'مشتريات · salem'], ['هدى الورفلي', 'حسابات · huda'], ['علي الشريف', 'مبيعات · ali']];
  const dlg = spring({frame: f - 104, fps, config: {damping: 14}});
  const dlgOut = interpolate(f, [176, 186], [1, 0], clamp);
  return (
    <>
      <Tag n="2" label="إضافة دور" start={6} />
      <Headline text="اختار موظفك" start={12} hl="موظفك" />
      <Card start={28} style={{top: 420, padding: 30}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
          <Ion n="arrow-back" size={44} color={C.text} style={{transform: 'scaleX(-1)'}} />
          <div style={{fontSize: 42, fontWeight: 800}}>إضافة دور</div>
          <div style={{width: 44}} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {emps.map(([n, s], i) => (
            <Row key={n} icon="person-outline" title={n} sub={s} start={44 + i * 8} bg={i === 0 && f >= 94 && f < 104 ? C.sunken : C.cream} scale={i === 0 ? press(f, 94) : 1} trailing={<Ion n="add-circle-outline" size={52} />} />
          ))}
        </div>
        {f >= 104 ? (
          <div style={{position: 'absolute', inset: 0, borderRadius: 27, background: `rgba(20,20,19,${0.45 * dlg * dlgOut})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24}}>
            <div style={{background: C.cream, borderRadius: 30, padding: '34px 34px 28px', width: '100%', transform: `scale(${0.85 + 0.15 * dlg})`, opacity: dlg * dlgOut, boxShadow: '0 24px 60px rgba(0,0,0,0.3)'}}>
              <div style={{fontSize: 40, fontWeight: 800}}>إنشاء دور</div>
              <div style={{fontSize: 29, lineHeight: 1.65, color: C.subtle, marginTop: 12}}>السماح لـ«سالم المبروك» (مشتريات) بتسجيل الدخول للتطبيق باسم المستخدم «salem» وكلمة مروره في أبوغريس؟</div>
              <div style={{display: 'flex', gap: 16, marginTop: 26}}>
                <div style={{flex: 1.6, height: 88, borderRadius: 18, background: f >= 160 && f < 168 ? C.strong : C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 31, fontWeight: 700, transform: `scale(${press(f, 160)})`}}>السماح وإنشاء الدور</div>
                <div style={{flex: 1, height: 88, borderRadius: 18, border: `3px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 31, fontWeight: 700}}>إلغاء</div>
              </div>
            </div>
          </div>
        ) : null}
      </Card>
      <div style={{position: 'absolute', top: 1150, left: 280, width: 520}}>
        <Illus name="selecting-team" start={150} width={520} />
      </div>
      <Toast text="أُنشئ الدور R-03 لـ«سالم المبروك»." at={170} until={250} bottom={800} />
      <Caption text="تسمح له… ويدخل باسم مستخدمه وكلمة مروره في أبوغريس." start={178} hl="في أبوغريس." />
    </>
  );
};

const Field: React.FC<{label: string; value: string; start: number; ltr?: boolean; dots?: boolean}> = ({label, value, start, ltr, dots}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(value.length, Math.floor((f - start) / 3)));
  const shown = dots ? '•'.repeat(n) : value.slice(0, n);
  const typing = f >= start && n < value.length;
  return (
    <div style={{marginTop: 16}}>
      <div style={{fontSize: 29, fontWeight: 700, marginBottom: 10}}>{label}</div>
      <div style={{height: 92, border: `3px solid ${typing ? C.primary : C.border}`, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: ltr ? 'flex-start' : 'flex-end', padding: '0 26px', direction: 'ltr', fontSize: 38, fontWeight: 700, letterSpacing: ltr ? 6 : 2}}>
        {shown}{typing ? <span style={{width: 4, height: 44, background: C.primary, marginLeft: 4}} /> : null}
      </div>
    </div>
  );
};

const LoginCh: React.FC = () => {
  const f = useCurrentFrame();
  const verifying = f >= 128 && f < 160;
  const ok = f >= 160;
  return (
    <>
      <Tag n="3" label="الدخول كموظف" start={6} dark />
      <Headline text="الموظف يدخل من جواله" start={12} dark hl="من جواله" />
      <Card start={26} style={{top: 410, padding: 34}}>
        <div style={{fontSize: 46, fontWeight: 800, textAlign: 'center'}}>الدخول كموظف</div>
        <Field label="معرّف النشاط" value="AB7K2Q" start={46} ltr />
        <Field label="اسم المستخدم" value="salem" start={70} ltr />
        <Field label="كلمة المرور" value="12345678" start={90} dots />
        <div style={{marginTop: 24, height: 96, borderRadius: 18, background: ok ? C.success : C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 34, fontWeight: 700, transform: `scale(${press(f, 122)})`}}>
          {ok ? <><Ion n="checkmark-circle" size={44} color="#fff" />أهلاً سالم</> : verifying ? 'جارٍ التحقق عبر جسر النشاط…' : 'دخول'}
        </div>
      </Card>
      <PageFrame start={140} style={{top: 1240, left: 270, width: 540, height: 290}}>
        <Illus name="mobile-login" start={146} width={400} span={22} />
      </PageFrame>
      <Caption text="بمعرّف النشاط، واسم مستخدمه وكلمة مروره." start={168} hl="بمعرّف النشاط،" dark />
    </>
  );
};

const TabBar: React.FC<{tabs: [string, keyof typeof ION][]; start: number}> = ({tabs, start}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{direction: 'rtl', display: 'flex', justifyContent: 'space-around', background: '#fff', border: `3px solid ${C.border}`, borderRadius: 40, padding: '16px 10px', boxShadow: '0 14px 34px rgba(20,20,19,0.1)'}}>
      {tabs.map(([l, ic], i) => {
        const p = spring({frame: f - start - i * 5, fps, config: {damping: 12}});
        const active = i === 0;
        return (
          <div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transform: `scale(${p})`, minWidth: 120}}>
            <Ion n={ic} size={46} color={active ? C.primary : C.subtle} />
            <span style={{fontFamily: UI, fontSize: 25, fontWeight: active ? 700 : 500, color: active ? C.primary : C.subtle}}>{l}</span>
          </div>
        );
      })}
    </div>
  );
};

const ViewsCh: React.FC = () => {
  const Block: React.FC<{name: keyof typeof ILLUS; label: string; top: number; start: number; tabs: [string, keyof typeof ION][]; illusW: number}> = ({name, label, top, start, tabs, illusW}) => {
    const f = useCurrentFrame();
    const p = interpolate(f - start, [0, 12], [0, 1], {...clamp, easing: out});
    const bar = interpolate(f - start - 22, [0, 10], [0, 1], {...clamp, easing: out});
    return (
      <div style={{position: 'absolute', top, left: 70, right: 70, height: 500}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Illus name={name} start={start} width={illusW} span={26} />
        </div>
        <div style={{position: 'absolute', top: 6, right: 0, opacity: p, direction: 'rtl', background: C.primary, color: '#fff', fontFamily: STORY, fontWeight: 700, fontSize: 38, borderRadius: 999, padding: '8px 30px'}}>{label}</div>
        <div style={{position: 'absolute', top: 336, left: 0, right: 0, opacity: bar, transform: `translateY(${(1 - bar) * 30}px)`}}>
          <TabBar tabs={tabs} start={start + 30} />
        </div>
      </div>
    );
  };
  return (
    <>
      <Tag n="4" label="كل دور وشغله" start={6} />
      <Headline text="كل دور يشوف شغله بس" start={12} hl="شغله بس" />
      <Block name="finance" label="حسابات" top={410} start={30} illusW={500} tabs={[['المالية', 'wallet'], ['الحساب', 'person-circle-outline'], ['مركز البلاغات', 'megaphone-outline']]} />
      <Block name="heavy-box" label="مشتريات" top={900} start={90} illusW={500} tabs={[['المنتجات', 'search'], ['المخزون', 'cube-outline'], ['المالية', 'wallet-outline'], ['الحساب', 'person-circle-outline'], ['مركز البلاغات', 'megaphone-outline']]} />
      <Caption text="المحاسب للمالية، | والمشتريات للمنتجات والمخزون." start={150} hl="للمالية، للمنتجات والمخزون." />
    </>
  );
};

const ControlCh: React.FC = () => {
  const f = useCurrentFrame();
  const count = Math.round(interpolate(f, [34, 60], [0, 3], {...clamp, easing: out}));
  const off = interpolate(f, [92, 100], [1, 0], clamp);
  const roles: [string, string][] = [['هدى الورفلي', 'R-01 · حسابات'], ['علي الشريف', 'R-02 · مبيعات'], ['سالم المبروك', 'R-03 · مشتريات']];
  return (
    <>
      <SilkBg opacity={0.55} />
      <Tag n="5" label="تحكّم كامل" start={6} dark />
      <Headline text="توقّف أي دور بلمسة" start={12} dark hl="بلمسة" />
      <Card start={26} style={{top: 430, padding: 30}}>
        <div style={{fontSize: 31, fontWeight: 700, color: C.subtle, marginBottom: 18}}>{`الأدوار (${count} من 5)`}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {roles.map(([n, s], i) => (
            <Row key={n} icon="id-card-outline" title={n} sub={s} start={40 + i * 8} scale={i === 1 ? pulse(f, 88) : 1} trailing={<Switch on={i === 1 ? off : 1} />} />
          ))}
        </div>
      </Card>
      <Toast text="تم إيقاف الدور وإنهاء جلساته." at={102} bottom={760} />
      <PageFrame start={104} style={{top: 1200, left: 300, width: 480, height: 320}}>
        <Illus name="switches" start={108} width={400} span={18} />
      </PageFrame>
      <Caption text="يتوقف الدور… وتنتهي جلساته فوراً." start={118} hl="فوراً." dark />
    </>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: f - 40, fps, config: {damping: 12}});
  return (
    <>
      <div style={{position: 'absolute', top: 300, left: 140, width: 800}}>
        <Illus name="team-spirit" start={8} width={800} span={30} />
      </div>
      <div style={{position: 'absolute', top: 900, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl', transform: `scale(${logo})`}}>
          <Img src={staticFile('brand/brand-mark.png')} style={{width: 130, height: 130, objectFit: 'contain'}} />
          <span style={{fontFamily: STORY, fontWeight: 700, fontSize: 96, color: C.text}}>المتمكن</span>
        </div>
        <Words text="الأدوار: كل واحد في مكانه." start={56} hl="في مكانه." style={{fontFamily: STORY, fontSize: 58, color: C.text, fontWeight: 500}} />
        <div style={{opacity: interpolate(f, [76, 88], [0, 1], clamp), marginTop: 18, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 12, fontFamily: STORY, fontSize: 36, color: C.subtle, border: `2px solid ${C.border}`, borderRadius: 999, padding: '12px 28px', background: '#fff'}}>
          <Ion n="id-card-outline" size={38} />من الحساب ← الأدوار
        </div>
      </div>
    </>
  );
};

const VIEWS: Record<string, React.FC> = {hook: Hook, problem: Problem, turn: Turn, code: CodeCh, add: AddCh, login: LoginCh, views: ViewsCh, control: ControlCh, outro: Outro};

/** Storybook page: rises from the bottom with rounded top corners; sinks back when the next page arrives. */
const Page: React.FC<{ch: Ch; idx: number}> = ({ch, idx}) => {
  const f = useCurrentFrame();
  const dur = ch.e - ch.s;
  const enter = idx === 0 ? 1 : interpolate(f, [0, ENT], [0, 1], {...clamp, easing: io});
  const leave = interpolate(f, [dur, dur + ENT], [0, 1], {...clamp, easing: io});
  const V = VIEWS[ch.id];
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - enter) * H}px) scale(${1 - 0.08 * leave})`, borderRadius: `${(1 - enter) * 120 + leave * 70}px`, overflow: 'hidden', background: ch.bg, boxShadow: enter < 1 ? '0 -30px 80px rgba(0,0,0,0.35)' : 'none', filter: `brightness(${1 - 0.45 * leave})`}}>
      <V />
      <Grain opacity={ch.dark ? 0.1 : 0.06} />
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.max(0, CH.findIndex((c, k) => f < (CH[k + 1]?.s ?? 99999) + ENT / 2));
  const dark = CH[i].dark;
  return (
    <div style={{position: 'absolute', top: 84, width: '100%', display: 'flex', justifyContent: 'center', gap: 12, direction: 'rtl'}}>
      {CH.map((c, k) => (
        <div key={c.id} style={{height: 12, width: k === i ? 54 : 12, borderRadius: 6, background: k === i ? C.primary : dark ? 'rgba(255,255,255,0.35)' : 'rgba(20,20,19,0.18)', ...(k === i && dark && c.bg === C.strong ? {background: C.cream} : {})}} />
      ))}
    </div>
  );
};

export const RolesTale: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <FontFaces />
    {CH.map((ch, idx) => (
      <Sequence key={ch.id} from={ch.s} durationInFrames={ch.e - ch.s + (idx < CH.length - 1 ? ENT : 0)}>
        <Page ch={ch} idx={idx} />
      </Sequence>
    ))}
    <Progress />
  </AbsoluteFill>
);
