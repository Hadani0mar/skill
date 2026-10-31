// «الكاتب الجريء» (Bold Typer) + «ختم الشعار» (Logo Sting)
// Topic: طلبية الشراء الذكية — almutamakkin-expo-v3 (FinanceHub → purchase: supplier, أيام السحب 90, أيام التغطية 30)
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 720; // 24 s

const C = {
  ink: '#111111',
  grey: '#b8b8b8',
  blue: '#004afd',
  lime: '#d8ff1a',
  green: '#8cc63f',
  black: '#000000',
};
const AR = "'Alexandria', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
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

/* ---------------- chrome ---------------- */
const Studio: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'linear-gradient(180deg,#b4b4b4 0%,#d9d9d9 16%,#efefef 34%,#f4f4f4 50%,#efefef 66%,#d6d6d6 84%,#b2b2b2 100%)',
    }}
  />
);

const Badge: React.FC<{onBlue?: boolean}> = ({onBlue}) => (
  <div
    style={{
      position: 'absolute',
      top: 150,
      left: 80,
      width: 96,
      height: 96,
      borderRadius: 48,
      background: onBlue ? '#fff' : C.blue,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div style={{width: 70, height: 70, borderRadius: 35, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Img src={staticFile('brand-mark.png')} style={{width: 58, height: 58}} />
    </div>
  </div>
);

const Handle: React.FC<{color?: string}> = ({color = '#2a2a2a'}) => (
  <div style={{position: 'absolute', bottom: 210, width: '100%', textAlign: 'center', fontFamily: AR, fontSize: 36, fontWeight: 400, color}}>
    @almutamakkin
  </div>
);

/* ---------------- typing with a block cursor (type → hold → backspace) ---------------- */
const BlockTyper: React.FC<{lines: string[]; typeEnd: number; eraseStart: number; eraseEnd: number; size: number}> = ({
  lines,
  typeEnd,
  eraseStart,
  eraseEnd,
  size,
}) => {
  const f = useCurrentFrame();
  const gl = lines.map(graphemes);
  const total = gl.reduce((s, g) => s + g.length, 0);
  const typed = Math.round(
    f < eraseStart ? interpolate(f, [4, typeEnd], [0, total], clamp) : interpolate(f, [eraseStart, eraseEnd], [total, 0], clamp),
  );
  let left = typed;
  let cursorLine = 0;
  const shown = gl.map((g, i) => {
    const n = Math.min(g.length, Math.max(0, left));
    left -= n;
    if (n > 0 || i === 0) cursorLine = n > 0 ? i : cursorLine;
    return g.slice(0, n).join('');
  });
  // cursor sits after the last typed grapheme
  const done = f >= typeEnd && f < eraseStart;
  const blinkOn = !done || Math.floor((f - typeEnd) / 9) % 2 === 0;
  return (
    <div dir="rtl" style={{position: 'absolute', top: 0, bottom: 0, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      {lines.map((_, i) => (
        <div key={i} style={{fontFamily: AR, fontWeight: 800, fontSize: size, lineHeight: 1.28, color: C.ink, minHeight: size * 1.28, whiteSpace: 'nowrap'}}>
          {shown[i]}
          {i === cursorLine && blinkOn && f < eraseEnd ? (
            <span style={{display: 'inline-block', width: size * 0.42, height: size * 1.02, background: C.ink, verticalAlign: '-0.18em', marginInlineStart: 8}} />
          ) : null}
        </div>
      ))}
    </div>
  );
};

/* ---------------- paragraph block: grey → black, hold, back to grey, out ---------------- */
const Paragraph: React.FC<{lines: string[]; len: number; size?: number}> = ({lines, len, size = 72}) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 8, len - 10, len], [0, 1, 1, 0], clamp);
  const ink = interpolate(f, [0, 12, len - 16, len - 4], [0, 1, 1, 0], clamp);
  const v = Math.round(interpolate(ink, [0, 1], [0xb8, 0x11]));
  const color = `rgb(${v},${v},${v})`;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity}}>
      <div dir="rtl" style={{fontFamily: AR, fontWeight: 700, fontSize: size, lineHeight: 1.24, color, textAlign: 'center'}}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- punch: word + lime pill that grows (RTL: from the right) ---------------- */
const Punch: React.FC<{word: string; pill: string; len: number}> = ({word, pill, len}) => {
  const f = useCurrentFrame();
  const wordIn = interpolate(f, [0, 8], [110, 0], {...clamp, easing: out});
  const grow = interpolate(f, [8, 20], [0, 1], {...clamp, easing: out});
  const exit = interpolate(f, [len - 10, len], [0, -120], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div dir="rtl" style={{overflow: 'hidden', padding: '20px 10px', display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{fontFamily: AR, fontWeight: 800, fontSize: 132, color: C.ink, translate: `0 ${wordIn + exit}%`}}>{word}</div>
        <div style={{translate: `0 ${exit}%`, position: 'relative'}}>
          <div
            style={{
              fontFamily: AR,
              fontWeight: 800,
              fontSize: 112,
              color: C.ink,
              background: C.lime,
              borderRadius: 36,
              padding: '6px 40px 22px',
              clipPath: `inset(0 0 0 ${(1 - grow) * 100}% round 36px)`,
            }}
          >
            {pill}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- blue card: lines slide up from a mask ---------------- */
const BlueCard: React.FC<{light: string; bold: string; boldSize?: number}> = ({light, bold, boldSize = 150}) => {
  const f = useCurrentFrame();
  const l1 = interpolate(f, [2, 14], [220, 0], {...clamp, easing: out});
  const l2 = interpolate(f, [8, 20], [220, 0], {...clamp, easing: out});
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg,#0a52ff 0%,${C.blue} 60%,#0040e0 100%)`, alignItems: 'center', justifyContent: 'center'}}>
      <div dir="rtl" style={{textAlign: 'center', color: '#fff', fontFamily: AR}}>
        <div style={{overflow: 'hidden', paddingBottom: '0.9em', marginBottom: '-0.9em'}}>
          <div style={{fontWeight: 400, fontSize: 104, lineHeight: 1.3, translate: `0 ${l1}%`}}>{light}</div>
        </div>
        <div style={{overflow: 'hidden', paddingBottom: '0.9em', marginBottom: '-0.9em'}}>
          <div style={{fontWeight: 800, fontSize: boldSize, lineHeight: 1.25, translate: `0 ${l2}%`}}>{bold}</div>
        </div>
      </div>
      <Badge onBlue />
      <Handle color="rgba(255,255,255,0.85)" />
    </AbsoluteFill>
  );
};

/* ---------------- three steps, one block per beat ---------------- */
const STEPS = [
  {n: '١', t: 'اختر المورد'},
  {n: '٢', t: 'حدّد أيام السحب', s: 'وأيام التغطية'},
  {n: '٣', t: 'خذ الأصناف المرشحة', s: 'بالعبوات وآخر سعر شراء'},
];
const Steps: React.FC<{beat: number}> = ({beat}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div dir="rtl" style={{display: 'flex', flexDirection: 'column', gap: 54, width: 900}}>
        {STEPS.map((s, i) => {
          const t0 = i * beat;
          const o = interpolate(f, [t0, t0 + 8], [0, 1], clamp);
          const ink = interpolate(f, [t0, t0 + 12], [0, 1], clamp);
          const past = i < Math.floor(f / beat) ? 0.38 : 1; // earlier steps dim to grey
          const v = Math.round(interpolate(ink * past, [0, 1], [0xc0, 0x11]));
          const color = `rgb(${v},${v},${v})`;
          const dy = interpolate(f, [t0, t0 + 10], [60, 0], {...clamp, easing: out});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 34, opacity: o, translate: `0 ${dy}px`}}>
              <div
                style={{
                  width: 132,
                  height: 132,
                  borderRadius: 66,
                  flexShrink: 0,
                  background: past === 1 ? C.blue : '#c9c9c9',
                  color: '#fff',
                  fontFamily: AR,
                  fontWeight: 800,
                  fontSize: 76,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {s.n}
              </div>
              <div style={{fontFamily: AR, color}}>
                <div style={{fontWeight: 800, fontSize: 64, lineHeight: 1.15, whiteSpace: 'nowrap'}}>{s.t}</div>
                {s.s ? <div style={{fontWeight: 500, fontSize: 44, lineHeight: 1.3}}>{s.s}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- logo sting (style 3) on black ---------------- */
const StingWord: React.FC = () => {
  const f = useCurrentFrame();
  const wordIn = interpolate(f, [0, 10], [100, 0], {...clamp, easing: out});
  // dot: falls from above, lands at the end of the line (left in RTL), bounces once
  const dotY = f < 14 ? interpolate(f, [4, 14], [-420, 0], {...clamp, easing: Easing.in(Easing.quad)}) : f < 24 ? -Math.sin(((f - 14) / 10) * Math.PI) * 90 : 0;
  const dotOn = f >= 4;
  const recolor = interpolate(f, [28, 40], [0, 1], {...clamp, easing: out});
  const cursorX = interpolate(f, [18, 34], [-200, 260], clamp);
  return (
    <AbsoluteFill style={{background: C.black, alignItems: 'center', justifyContent: 'center'}}>
      <div dir="rtl" style={{overflow: 'visible', display: 'flex', alignItems: 'baseline', fontFamily: AR, fontSize: 98, translate: `0 ${wordIn}px`, opacity: interpolate(f, [0, 6], [0, 1], clamp)}}>
        <span style={{color: C.green, fontWeight: 300}}>خلّي متجرك</span>
        <span style={{width: 24}} />
        <span style={{position: 'relative', fontWeight: 800}}>
          <span style={{color: '#fff'}}>يتمكّن</span>
          <span style={{position: 'absolute', inset: 0, color: C.green, clipPath: `inset(0 0 0 ${(1 - recolor) * 100}%)`}}>يتمكّن</span>
        </span>
        {dotOn ? <span style={{display: 'inline-block', width: 30, height: 30, borderRadius: 15, background: C.green, marginInlineStart: 10, translate: `0 ${dotY}px`}} /> : null}
      </div>
      {f > 18 && f < 36 ? (
        <svg width={56} height={64} viewBox="0 0 28 32" style={{position: 'absolute', top: 1080, left: 540 + cursorX}}>
          <path d="M2 2 L26 14 L15 17 L11 30 Z" fill={C.green} />
        </svg>
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
  const lines = ['حمّل تطبيق المتمكن', '@almutamakkin'];
  return (
    <AbsoluteFill style={{background: C.black, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {/* tagline with hand-drawn ellipse around the first word */}
        <div dir="rtl" style={{position: 'relative', fontFamily: AR, fontWeight: 400, fontSize: 46, color: '#fff', opacity: tag, marginBottom: 26}}>
          <span style={{position: 'relative', display: 'inline-block', padding: '0 14px'}}>
            أدِر
            <svg viewBox="0 0 140 80" preserveAspectRatio="none" style={{position: 'absolute', left: -18, top: -12, width: 'calc(100% + 36px)', height: 'calc(100% + 24px)', overflow: 'visible'}}>
              <path
                d="M70 6 C120 4 138 22 134 42 C130 66 90 76 58 74 C22 72 4 58 6 38 C8 18 34 8 76 9"
                fill="none"
                stroke={C.green}
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ellipse}
              />
            </svg>
          </span>{' '}
          متجرك بوضوح وثقة
        </div>
        <div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{width: 160, height: 160, opacity: sym, translate: `${(1 - sym) * 160}px 0`, rotate: `${(1 - sym) * 40}deg`}}>
            <Img src={staticFile('brand-mark-white.png')} style={{width: '100%', height: '100%'}} />
          </div>
          <div>
            <div style={{fontFamily: AR, fontWeight: 800, fontSize: 124, lineHeight: 1.05, color: '#fff', clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)`}}>المتمكن</div>
            <div style={{fontFamily: AR, fontWeight: 500, fontSize: 34, letterSpacing: 9, color: C.green, opacity: sub, direction: 'ltr', textAlign: 'right'}}>
              AL-MUTAMAKKIN
            </div>
          </div>
        </div>
        <div style={{marginTop: 56, textAlign: 'center'}}>
          {lines.map((l, i) => {
            const g = graphemes(l);
            const n = Math.round(interpolate(f, [30 + i * 5, 30 + i * 5 + g.length * 0.9], [0, g.length], clamp));
            return (
              <div key={i} dir={i === 0 ? 'rtl' : 'ltr'} style={{fontFamily: AR, fontWeight: 400, fontSize: 44, lineHeight: 1.45, color: '#fff', minHeight: 64}}>
                {g.slice(0, n).join('')}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- timeline (hard cuts, metronomic beats) ---------------- */
export const TIMELINE = {
  q1: [0, 66],
  answer: [66, 168],
  punch1: [168, 216],
  blue1: [216, 270],
  q2: [270, 330],
  steps: [330, 462],
  punch2: [462, 510],
  blue2: [510, 564],
  stingWord: [564, 618],
  stingLogo: [618, 720],
} as const;

const Seq: React.FC<{k: keyof typeof TIMELINE; children: React.ReactNode}> = ({k, children}) => (
  <Sequence name={k} from={TIMELINE[k][0]} durationInFrames={TIMELINE[k][1] - TIMELINE[k][0]}>
    {children}
  </Sequence>
);

const Fonts: React.FC = () => (
  <style>{`@font-face{font-family:'Alexandria';font-weight:100 900;font-display:block;src:url('${staticFile('fonts/Alexandria.ttf')}') format('truetype');}`}</style>
);

const Grey: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <Studio />
    {children}
    <Badge />
    <Handle />
  </AbsoluteFill>
);

export const SmartPurchaseTyper: React.FC = () => (
  <AbsoluteFill style={{background: '#f3f3f3'}}>
    <Fonts />
    <Seq k="q1">
      <Grey>
        <BlockTyper lines={['شن نطلب', 'من المورد؟']} typeEnd={34} eraseStart={50} eraseEnd={64} size={140} />
      </Grey>
    </Seq>
    <Seq k="answer">
      <Grey>
        <Paragraph
          len={102}
          lines={['طلبية الشراء الذكية', 'تحسب لكل صنف', 'كم تسحب منه يومياً،', 'وكم عندك في المخزن،', 'وكم يوم يكفيك…', 'وتقولك شن تطلب', 'بالضبط.']}
        />
      </Grey>
    </Seq>
    <Seq k="punch1">
      <Grey>
        <Punch word="بلا" pill="تخمين!" len={48} />
      </Grey>
    </Seq>
    <Seq k="blue1">
      <BlueCard light="طلبية الشراء" bold="الذكية" />
    </Seq>
    <Seq k="q2">
      <Grey>
        <BlockTyper lines={['كيف', 'تشتغل؟']} typeEnd={26} eraseStart={44} eraseEnd={58} size={150} />
      </Grey>
    </Seq>
    <Seq k="steps">
      <Grey>
        <Steps beat={44} />
      </Grey>
    </Seq>
    <Seq k="punch2">
      <Grey>
        <Punch word="طلبيتك" pill="جاهزة!" len={48} />
      </Grey>
    </Seq>
    <Seq k="blue2">
      <BlueCard light="محسوبة من" bold="حركة مخزنك" boldSize={124} />
    </Seq>
    <Seq k="stingWord">
      <StingWord />
    </Seq>
    <Seq k="stingLogo">
      <StingLogo />
    </Seq>
  </AbsoluteFill>
);
