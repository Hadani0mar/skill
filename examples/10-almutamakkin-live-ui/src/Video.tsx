// «واجهة حية» (Live UI) — modern launch film for المتمكن.
// UI rebuilt from almutamakkin-expo-v3 dark theme tokens and real screen titles; product names, quantities and amounts are SAMPLE data.
// React Bits: DotGrid-style field with a moving Spotlight, BlurText reveals, GradientText, CountUp, StarBorder-style beam on the
// focused card, Aurora (frame-driven port) for the finale; all sounds rendered to WAV from the React Bits library.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShaderLayer} from './ShaderLayer';
import {AURORA_FRAG, auroraPalette} from './aurora';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1050;

// app dark theme (theme/tokens.ts darkColors) + a deeper stage
const T = {stage: '#0c0b0a', scaffold: '#181715', surface: '#1f1e1b', sunken: '#252320', border: 'rgba(250,249,245,0.10)', text: '#faf9f5', subtle: '#a09d96',
  primary: '#cc785c', strong: '#a9583e', success: '#5db872', warning: '#e8a55a', danger: '#c64545'};
const RX = "'Readex', sans-serif";
const UI = "'Cairo', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = Easing.out(Easing.cubic);
const io = Easing.inOut(Easing.cubic);
const ease = (f: number, a: number, b: number, from = 0, to = 1, e = out) => interpolate(f, [a, b], [from, to], {...clamp, easing: e});

const FontFaces = () => (
  <style>{`
@font-face{font-family:'Readex';src:url(${staticFile('fonts/Readex.ttf')});font-weight:160 700;font-display:block}
@font-face{font-family:'Cairo';src:url(${staticFile('fonts/Cairo.ttf')});font-weight:200 1000;font-display:block}
`}</style>
);

/* ---------------- timeline ---------------- */
const PHONE_IN = 70, BENTO = 250, FOCUS0 = 320, SLOT = 58, PULL = 730, END = 880;

/* ---------------- bento layout (absolute, px) ---------------- */
type Tile = {id: string; x: number; y: number; w: number; h: number; head: string};
const TOP = 380, GAP = 24, CW = 468, XR = 60 + CW + GAP, XL = 60;
const TILES: Tile[] = [
  {id: 'expiry', x: XR, y: TOP, w: CW, h: 400, head: 'الصلاحية؟ تعرفها قبل ما تفاجئك.'},
  {id: 'short', x: XL, y: TOP, w: CW, h: 280, head: 'النواقص تبان قبل ما تخلص.'},
  {id: 'order', x: XR, y: TOP + 400 + GAP, w: CW, h: 280, head: 'طلبية تنحسب من مبيعاتك الفعلية.'},
  {id: 'barcode', x: XL, y: TOP + 280 + GAP, w: CW, h: 400, head: 'ملصقات الباركود… جاهزة للطباعة.'},
  {id: 'debts', x: XR, y: TOP + 680 + 2 * GAP, w: CW, h: 280, head: 'الديون واضحة، للزبون وللمورد.'},
  {id: 'roles', x: XL, y: TOP + 680 + 2 * GAP, w: CW, h: 280, head: 'كل موظف يشوف شغله بس.'},
  {id: 'agent', x: XR, y: TOP + 960 + 3 * GAP, w: CW, h: 300, head: 'اسأل… والجواب من بيانات محلك.'},
  {id: 'brand', x: XL, y: TOP + 960 + 3 * GAP, w: CW, h: 300, head: ''},
];
const focusIndex = (f: number) => (f < FOCUS0 || f >= FOCUS0 + 7 * SLOT ? -1 : Math.floor((f - FOCUS0) / SLOT));

/* ---------------- background: DotGrid + Spotlight ---------------- */
const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const fi = focusIndex(f);
  // spotlight follows the focused card, otherwise rests centre-top
  let sx = 540, sy = 700;
  if (f >= FOCUS0 && f < FOCUS0 + 7 * SLOT) {
    const i = fi, t = (f - FOCUS0 - i * SLOT) / 14;
    const a = TILES[Math.max(0, i - 1)], b = TILES[i];
    const k = i === 0 ? 1 : Math.min(1, t);
    const e = io(k);
    sx = a.x + a.w / 2 + (b.x + b.w / 2 - a.x - a.w / 2) * e;
    sy = a.y + a.h / 2 + (b.y + b.h / 2 - a.y - a.h / 2) * e;
  }
  const grid = ease(f, 0, 40, 0, 1);
  return (
    <AbsoluteFill style={{background: T.stage}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.55 * grid}} aria-hidden="true">
        <defs>
          <pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="18" cy="18" r="1.6" fill="#faf9f5" /></pattern>
          <radialGradient id="spot" cx={sx / W} cy={sy / H} r="0.45" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#fff" stopOpacity="0.9" /><stop offset="1" stopColor="#fff" stopOpacity="0.08" />
          </radialGradient>
          <mask id="m"><rect width={W} height={H} fill="url(#spot)" /></mask>
        </defs>
        <rect width={W} height={H} fill="url(#dots)" mask="url(#m)" />
      </svg>
      <AbsoluteFill style={{background: `radial-gradient(circle 620px at ${sx}px ${sy}px, rgba(204,120,92,0.20), rgba(204,120,92,0) 70%)`}} />
    </AbsoluteFill>
  );
};

/* ---------------- text ---------------- */
const Blur: React.FC<{text: string; at: number; size: number; weight?: number; color?: string; grad?: boolean; step?: number}> = ({text, at, size, weight = 600, color = T.text, grad, step = 3}) => {
  const f = useCurrentFrame();
  return (
    <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.25em', fontFamily: RX, fontWeight: weight, fontSize: size, lineHeight: 1.3, color, letterSpacing: -0.5}}>
      {text.split(' ').map((w, i) => {
        const p = ease(f, at + i * step, at + i * step + 14);
        return (
          <span key={i} style={{display: 'inline-block', opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * 24}px)`,
            ...(grad ? {backgroundImage: `linear-gradient(100deg, #f3c9a8 0%, ${T.primary} 45%, ${T.warning} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingBottom: '0.1em'} : {})}}>{w}</span>
        );
      })}
    </div>
  );
};

/** Headline band that swaps per focus. */
const Headline: React.FC = () => {
  const f = useCurrentFrame();
  const fi = focusIndex(f);
  if (f >= BENTO - 10 && f < FOCUS0) return null;
  let text = '', at = 0, alpha = 1;
  if (f < BENTO - 10) { text = 'كل محلك… في شاشة وحدة.'; at = PHONE_IN + 20; alpha = ease(f, BENTO - 30, BENTO - 10, 1, 0); }
  else if (fi >= 0) { text = TILES[fi].head; at = FOCUS0 + fi * SLOT + 4; alpha = ease(f, FOCUS0 + fi * SLOT + SLOT - 8, FOCUS0 + fi * SLOT + SLOT, 1, 0); }
  else if (f < PULL) return null;
  else return null;
  return (
    <div key={text} style={{position: 'absolute', top: 170, left: 60, right: 60, opacity: alpha}}>
      <Blur text={text} at={at} size={62} />
    </div>
  );
};

/* ---------------- UI atoms (app dark theme) ---------------- */
/** App-style skeleton (components/Skeleton) with a moving shimmer, shown until the card's turn. */
const TITLES: Record<string, string> = {expiry: 'دفعات قريبة أو منتهية الصلاحية', short: 'نواقص المخزن', order: 'طلبية الشراء الذكية', barcode: 'تجهيز ملصقات الطباعة', debts: 'الأرصدة وكشوف الحساب', roles: 'الأدوار', agent: 'المساعد'};
const Skel: React.FC<{id: string; h: number}> = ({id, h}) => {
  const f = useCurrentFrame();
  const x = ((f * 14) % 900) - 300;
  const rows = Math.max(2, Math.floor((h - 90) / 64));
  return (
    <>
      <Title>{TITLES[id]}</Title>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        {Array.from({length: rows}, (_, i) => (
          <div key={i} style={{height: 46, width: `${[92, 70, 84, 60][i % 4]}%`, borderRadius: 14, background: `linear-gradient(90deg, ${T.sunken} 0px, #34312d ${x}px, ${T.sunken} ${x + 220}px)`}} />
        ))}
      </div>
    </>
  );
};
const Card: React.FC<{tile: Tile; children: React.ReactNode}> = ({tile, children}) => {
  const f = useCurrentFrame();
  const localStart = FOCUS0 + TILES.indexOf(tile) * SLOT;
  const {fps} = useVideoConfig();
  const idx = TILES.indexOf(tile);
  const fi = focusIndex(f);
  // assembly: fly out of the phone
  const p = spring({frame: f - BENTO - idx * 4, fps, config: {damping: 16, stiffness: 110}});
  const px = 540, py = 1000;
  const cx = tile.x + tile.w / 2, cy = tile.y + tile.h / 2;
  const tx = (px - cx) * (1 - p), ty = (py - cy) * (1 - p);
  const focused = fi === idx;
  const dim = fi >= 0 && !focused ? 0.38 : 1;
  const fs = focused ? ease(f, FOCUS0 + fi * SLOT, FOCUS0 + fi * SLOT + 12, 1, 1.035) : 1;
  const angle = (f * 6) % 360;
  return (
    <div style={{position: 'absolute', left: tile.x, top: tile.y, width: tile.w, height: tile.h, transform: `translate(${tx}px, ${ty}px) scale(${(0.3 + 0.7 * p) * fs})`, opacity: Math.min(1, p * 1.5) * dim, borderRadius: 34, padding: 2,
      background: focused ? `conic-gradient(from ${angle}deg, rgba(204,120,92,0) 0deg, ${T.primary} 60deg, #f3c9a8 90deg, rgba(204,120,92,0) 150deg, rgba(204,120,92,0) 360deg)` : T.border,
      boxShadow: focused ? '0 30px 80px rgba(204,120,92,0.25)' : '0 20px 50px rgba(0,0,0,0.35)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 32, background: `linear-gradient(160deg, ${T.surface} 0%, ${T.scaffold} 100%)`, padding: 28, boxSizing: 'border-box', direction: 'rtl', fontFamily: UI, color: T.text, overflow: 'hidden', position: 'relative'}}>
        {tile.id !== 'brand' && f < localStart ? <Skel id={tile.id} h={tile.h} /> : children}
      </div>
    </div>
  );
};
const Title: React.FC<{children: React.ReactNode; icon?: React.ReactNode}> = ({children, icon}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, fontWeight: 700, color: T.subtle, marginBottom: 14, whiteSpace: 'nowrap'}}>{icon}{children}</div>
);
const Ico: React.FC<{d: string; size?: number; color?: string}> = ({d, size = 30, color = T.primary}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{__html: d}} />
);
const I = {
  cal: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6.2"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  wallet: '<rect x="2" y="6" width="20" height="14" rx="3"/><path d="M2 10h20"/>',
  id: '<rect x="2" y="5" width="20" height="15" rx="3"/><circle cx="8.5" cy="11.5" r="2.5"/><path d="M5 17c.6-1.8 2-2.6 3.5-2.6S11.4 15.2 12 17M14 10h5M14 14h4"/>',
  spark: '<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
};
/** local progress of a tile's own animation: starts when it gets focus */
const useLocal = (id: string) => {
  const f = useCurrentFrame();
  const idx = TILES.findIndex((t) => t.id === id);
  return f - (FOCUS0 + idx * SLOT);
};
const fmt = (v: number) => Math.round(v).toLocaleString('en-US');

/* ---------------- tiles ---------------- */
const Expiry: React.FC = () => {
  const l = useLocal('expiry');
  const rows: [string, string, string][] = [['حليب طازج 1 لتر', 'منتهي', T.danger], ['زبادي 500غ', 'باقي يومين', T.warning], ['عصير برتقال', 'باقي 9 أيام', T.success]];
  return (
    <>
      <Title icon={<Ico d={I.cal} />}>دفعات قريبة أو منتهية الصلاحية</Title>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        {rows.map(([n, chip, c], i) => {
          const p = ease(l, 4 + i * 6, 16 + i * 6);
          return (
            <div key={n} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.sunken, borderRadius: 18, padding: '14px 18px', opacity: 0.35 + 0.65 * p, transform: `translateX(${(1 - p) * -24}px)`}}>
              <span style={{fontSize: 27, fontWeight: 700}}>{n}</span>
              <span style={{fontSize: 24, fontWeight: 700, color: c, background: `${c}22`, border: `2px solid ${c}`, borderRadius: 999, padding: '4px 16px', transform: `scale(${ease(l, 14 + i * 6, 22 + i * 6, 0.6, 1)})`}}>{chip}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};
const Short: React.FC = () => {
  const l = useLocal('short');
  const bars: [string, number][] = [['سكر 1كغ', 0.12], ['زيت 1.8 لتر', 0.2], ['أرز 5كغ', 0.34]];
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <Title icon={<Ico d={I.box} />}>نواقص المخزن</Title>
        <span style={{fontSize: 34, fontWeight: 800, color: T.danger, fontFamily: RX, direction: 'ltr', lineHeight: 1}}>{fmt(12 * ease(l, 6, 30))}</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {bars.map(([n, v], i) => {
          const w = 1 - (1 - v) * ease(l, 8 + i * 5, 34 + i * 5, 0, 1, io);
          return (
            <div key={n}>
              <div style={{fontSize: 21, fontWeight: 600, marginBottom: 4}}>{n}</div>
              <div style={{height: 14, background: T.sunken, borderRadius: 7, overflow: 'hidden', display: 'flex', justifyContent: 'flex-start'}}>
                <div style={{width: `${w * 100}%`, background: w < 0.4 ? T.danger : T.primary, borderRadius: 7}} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
const Order: React.FC = () => {
  const l = useLocal('order');
  return (
    <>
      <Title icon={<Ico d={I.cart} />}>طلبية الشراء الذكية</Title>
      <div style={{fontSize: 30, fontWeight: 700}}>سكر 1كغ</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8}}>
        <span style={{fontFamily: RX, fontWeight: 700, fontSize: 92, color: T.primary, lineHeight: 1}}>{fmt(24 * ease(l, 6, 34))}</span>
        <span style={{fontSize: 30, fontWeight: 700, color: T.subtle}}>كرتونة مقترحة</span>
      </div>
      <div style={{fontSize: 22, color: T.subtle, marginTop: 12, opacity: ease(l, 24, 34)}}>حسب التغطية والمبيعات</div>
    </>
  );
};
const Barcode: React.FC = () => {
  const l = useLocal('barcode');
  const widths = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1];
  const n = Math.floor(widths.length * ease(l, 4, 28, 0, 1, io));
  const slide = ease(l, 30, 44);
  return (
    <>
      <Title icon={<Ico d={I.tag} />}>تجهيز ملصقات الطباعة</Title>
      <div style={{background: '#faf9f5', borderRadius: 18, padding: '16px 22px', color: '#141413', transform: `translateY(${slide * 16}px)`, boxShadow: slide > 0 ? `0 ${slide * 24}px 40px rgba(0,0,0,0.4)` : 'none'}}>
        <div style={{fontSize: 24, fontWeight: 800, marginBottom: 8}}>تونة 160غ</div>
        <div style={{display: 'flex', gap: 3, height: 84, direction: 'ltr', alignItems: 'stretch'}}>
          {widths.map((w, i) => <div key={i} style={{width: w * 4, background: i < n ? '#141413' : 'transparent'}} />)}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 22, fontWeight: 700, direction: 'ltr'}}><span>6 221034 118742</span><span>4.50 د.ل</span></div>
      </div>
      <div style={{marginTop: 18, height: 58, borderRadius: 16, background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', transform: `scale(${l >= 30 && l < 36 ? 0.95 : 1})`}}>طباعة</div>
    </>
  );
};
const Debts: React.FC = () => {
  const l = useLocal('debts');
  return (
    <>
      <Title icon={<Ico d={I.wallet} />}>الأرصدة وكشوف الحساب</Title>
      <div style={{display: 'flex', gap: 16}}>
        {([['ديون العملاء', 8420, T.success], ['ديون الموردين', 15300, T.warning]] as [string, number, string][]).map(([n, v, c], i) => (
          <div key={n} style={{flex: 1, background: T.sunken, borderRadius: 20, padding: '18px 18px'}}>
            <div style={{fontSize: 22, fontWeight: 700, color: T.subtle}}>{n}</div>
            <div style={{fontFamily: RX, fontWeight: 700, fontSize: 50, color: c, direction: 'ltr', textAlign: 'right', marginTop: 6}}>{fmt(v * ease(l, 6 + i * 6, 36 + i * 6))}</div>
            <div style={{fontSize: 20, color: T.subtle}}>د.ل</div>
          </div>
        ))}
      </div>
    </>
  );
};
const Roles: React.FC = () => {
  const l = useLocal('roles');
  const people: [string, string][] = [['هدى', 'حسابات'], ['علي', 'مبيعات'], ['سالم', 'مشتريات']];
  return (
    <>
      <Title icon={<Ico d={I.id} />}>الأدوار</Title>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {people.map(([n, g], i) => {
          const on = i === 1 ? 1 - ease(l, 26, 34) : 1;
          return (
            <div key={n} style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <div style={{width: 46, height: 46, borderRadius: 23, background: T.sunken, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: T.primary}}>{n[0]}</div>
              <div style={{flex: 1, fontSize: 26, fontWeight: 700}}>{n} <span style={{color: T.subtle, fontWeight: 500, fontSize: 22}}>· {g}</span></div>
              <div style={{width: 76, height: 42, borderRadius: 21, background: on > 0.5 ? T.primary : T.sunken, position: 'relative'}}>
                <div style={{position: 'absolute', top: 4, left: 4 + 34 * on, width: 34, height: 34, borderRadius: 17, background: '#fff'}} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
const Agent: React.FC = () => {
  const l = useLocal('agent');
  const q = 'شن ناقص عندي توا؟';
  const a = '12 صنف، أهمهم السكر والزيت.';
  const qn = Math.max(0, Math.min(q.length, Math.floor((l - 2) / 1.2)));
  const typing = l >= 24 && l < 32;
  const an = Math.max(0, Math.min(a.length, Math.floor((l - 32) / 0.8)));
  return (
    <>
      <Title icon={<Ico d={I.spark} />}>المساعد</Title>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={{alignSelf: 'flex-start', background: T.primary, color: '#fff', borderRadius: '22px 22px 6px 22px', padding: '14px 20px', fontSize: 28, fontWeight: 700, minHeight: 40, opacity: l >= 2 ? 1 : 0.3}}>{l >= 2 ? q.slice(0, qn) : q}</div>
        <div style={{alignSelf: 'flex-end', background: T.sunken, borderRadius: '22px 22px 22px 6px', padding: '14px 20px', fontSize: 28, fontWeight: 600, minHeight: 40, opacity: l >= 24 ? 1 : 0}}>
          {typing ? <span style={{letterSpacing: 6, color: T.subtle}}>{'•••'.slice(0, 1 + (Math.floor(l / 3) % 3))}</span> : a.slice(0, an)}
        </div>
      </div>
    </>
  );
};
const Mark: React.FC<{size: number; at: number}> = ({size, at}) => {
  const f = useCurrentFrame();
  const p1 = ease(f, at, at + 16), p2 = ease(f, at + 6, at + 22);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeWidth={26}>
        <path d="M46 152 V106 A27 27 0 0 1 100 106 V152" stroke={T.warning} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p1} />
        <path d="M100 152 V84 A27 27 0 0 1 154 84 V152" stroke={T.primary} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p2} />
      </g>
    </svg>
  );
};
const Brand: React.FC = () => (
  <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
    <Mark size={150} at={BENTO + 30} />
    <div style={{fontFamily: UI, fontWeight: 900, fontSize: 56}}>المتمكن</div>
  </div>
);
const VIEW: Record<string, React.FC> = {expiry: Expiry, short: Short, order: Order, barcode: Barcode, debts: Debts, roles: Roles, agent: Agent, brand: Brand};

/* ---------------- phone ---------------- */
const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - PHONE_IN, fps, config: {damping: 18, stiffness: 70}});
  const ry = 38 * (1 - p) - 8 * ease(f, PHONE_IN + 40, BENTO, 0, 1, io);
  const exit = ease(f, BENTO - 10, BENTO + 14, 0, 1, io);
  const tabs: [string, string][] = [['المنتجات', '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'], ['المخزون', I.box], ['المالية', I.wallet], ['الحساب', '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>']];
  const stats: [string, string, string][] = [['نواقص المخزن', '12', T.danger], ['قريبة الصلاحية', '7', T.warning], ['ديون العملاء', '8,420', T.success], ['الطلبية الذكية', '24', T.primary]];
  if (f > BENTO + 16) return null;
  return (
    <div style={{position: 'absolute', left: 540 - 230, top: 1000 - 470, width: 460, height: 940, perspective: 1600, opacity: Math.min(1, p * 1.4) * (1 - exit)}}>
      <div style={{width: '100%', height: '100%', borderRadius: 72, background: '#050505', padding: 16, boxSizing: 'border-box', transform: `rotateY(${ry}deg) rotateX(${8 * (1 - p)}deg) scale(${(0.85 + 0.15 * p) * (1 - 0.6 * exit)})`, boxShadow: '0 60px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(250,249,245,0.12)'}}>
        <div style={{width: '100%', height: '100%', borderRadius: 58, background: T.scaffold, overflow: 'hidden', position: 'relative', direction: 'rtl', fontFamily: UI, color: T.text}}>
          <div style={{position: 'absolute', top: 14, left: '50%', marginLeft: -60, width: 120, height: 34, borderRadius: 17, background: '#050505'}} />
          <div style={{padding: '70px 26px 0'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <Mark size={54} at={PHONE_IN + 10} />
              <span style={{fontSize: 34, fontWeight: 900}}>المتمكن</span>
            </div>
            <div style={{marginTop: 18, height: 64, borderRadius: 18, background: T.sunken, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', color: T.subtle, fontSize: 24}}>
              <Ico d={tabs[0][1]} size={26} color={T.subtle} />بحث الأصناف
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18}}>
              {stats.map(([n, v, c], i) => {
                const q = ease(f, PHONE_IN + 24 + i * 5, PHONE_IN + 40 + i * 5);
                return (
                  <div key={n} style={{background: T.surface, border: `1px solid ${T.border}`, borderRadius: 22, padding: '18px 16px', opacity: q, transform: `translateY(${(1 - q) * 20}px)`}}>
                    <div style={{fontSize: 19, color: T.subtle, fontWeight: 600}}>{n}</div>
                    <div style={{fontFamily: RX, fontSize: 44, fontWeight: 700, color: c, direction: 'ltr', textAlign: 'right'}}>{v}</div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 22, padding: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
              {['حليب طازج 1 لتر', 'زبادي 500غ', 'سكر 1كغ'].map((n, i) => (
                <div key={n} style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 600, opacity: ease(f, PHONE_IN + 50 + i * 5, PHONE_IN + 62 + i * 5)}}>
                  <span>{n}</span><span style={{color: [T.danger, T.warning, T.danger][i]}}>{['منتهي', 'يومين', 'ناقص'][i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{position: 'absolute', bottom: 18, left: 18, right: 18, height: 96, borderRadius: 30, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
            {tabs.map(([l, d], i) => (
              <div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: i === 0 ? T.primary : T.subtle, fontSize: 17, fontWeight: 700}}>
                <Ico d={d} size={30} color={i === 0 ? T.primary : T.subtle} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- scenes ---------------- */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const o = ease(f, PHONE_IN - 14, PHONE_IN, 1, 0);
  const line = ease(f, 6, 40, 0, 1, io);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', top: 820, width: '100%'}}>
        <Blur text="إدارة محلك،" at={8} size={110} weight={500} />
        <Blur text="بشكل جديد." at={20} size={110} weight={700} grad />
      </div>
      <div style={{position: 'absolute', top: 1140, left: 540 - 180 * line, width: 360 * line, height: 2, background: `linear-gradient(90deg, transparent, ${T.primary}, transparent)`}} />
    </AbsoluteFill>
  );
};

const Bento: React.FC = () => {
  const f = useCurrentFrame();
  // pull back: tilt the whole board into perspective and shrink it
  const k = ease(f, PULL, PULL + 70, 0, 1, io);
  const gone = ease(f, END, END + 30, 0, 1, io);
  const sweep = ease(f, PULL + 30, PULL + 100, -0.4, 1.4, io);
  if (f < BENTO - 2) return null;
  return (
    <AbsoluteFill style={{perspective: 2200}}>
      <AbsoluteFill style={{transformOrigin: '50% 60%', transform: `translateY(${k * 120 + gone * 900}px) rotateX(${k * 32}deg) scale(${1 - 0.36 * k})`, opacity: 1 - gone}}>
        {TILES.map((t) => {
          const V = VIEW[t.id];
          return <Card key={t.id} tile={t}><V /></Card>;
        })}
        {k > 0 ? <AbsoluteFill style={{background: `linear-gradient(115deg, transparent ${sweep * 100 - 12}%, rgba(250,249,245,0.16) ${sweep * 100}%, transparent ${sweep * 100 + 12}%)`, mixBlendMode: 'screen', pointerEvents: 'none'}} /> : null}
      </AbsoluteFill>
      {f >= PULL + 20 && f < END + 20 ? (
        <div style={{position: 'absolute', top: 210, left: 60, right: 60, opacity: ease(f, END - 6, END + 12, 1, 0)}}>
          <Blur text="كل شي." at={PULL + 24} size={110} weight={700} />
          <Blur text="في تطبيق واحد." at={PULL + 36} size={110} weight={700} grad />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const AuroraBg: React.FC<{opacity: number}> = ({opacity}) => {
  const stops = [T.strong, T.primary, T.warning];
  const pal = React.useMemo(() => auroraPalette(stops), []);
  return (
    <AbsoluteFill style={{opacity}}>
      <ShaderLayer frag={AURORA_FRAG} uniforms={(t, w, h) => ({uResolution: [w, h], uTime: t * 0.14, uStops: pal, uStopCount: 3, uAmplitude: 1.1, uBlend: 0.55, uHeight: 0.55, uScale: 1, uGlow: 0.7, uBrightness: 1, uLayers: 2, uFlip: 1, uPointer: [0, 0, 0], uReveal: 1, uOpacity: 1, uLightMode: 0})} />
    </AbsoluteFill>
  );
};
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const l = f - END;
  const lock = spring({frame: l - 26, fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <AuroraBg opacity={ease(l, 0, 40, 0, 0.9)} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(12,11,10,0.2) 0%, rgba(12,11,10,0.85) 75%)'}} />
      <div style={{position: 'absolute', top: 640, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{transform: `scale(${0.85 + 0.15 * lock})`, opacity: lock}}><Mark size={300} at={END + 22} /></div>
        <div style={{fontFamily: UI, fontWeight: 900, fontSize: 170, color: T.text, marginTop: -10, opacity: ease(l, 40, 56), filter: `blur(${(1 - ease(l, 40, 56)) * 12}px)`}}>المتمكن</div>
        <div style={{marginTop: 10}}><Blur text="محلك، تحت سيطرتك." at={END + 66} size={66} weight={500} color="rgba(250,249,245,0.85)" /></div>
        <div style={{marginTop: 46, opacity: ease(l, 96, 112), display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', border: `1px solid ${T.border}`, background: 'rgba(250,249,245,0.05)', borderRadius: 999, padding: '14px 30px', fontFamily: RX, fontSize: 34, color: T.subtle}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: T.success, display: 'inline-block'}} />مربوط بنظام أبوغريس
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LiveUI: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: T.stage}}>
      <FontFaces />
      <AbsoluteFill style={{opacity: ease(f, END, END + 30, 1, 0.25)}}><Stage /></AbsoluteFill>
      <Sequence durationInFrames={PHONE_IN}><Intro /></Sequence>
      <Phone />
      <Bento />
      <Headline />
      {f >= END ? <Finale /> : null}
    </AbsoluteFill>
  );
};
