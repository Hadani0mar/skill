// «أرشيف القصة» — مقال: اكتتاب Anthropic. Full article text shown verbatim, paragraph by paragraph (no summarising).
// Look built from Anthropic's public palette (ivory / slate / clay); wordmark set in type (no logo file used).
// React Bits: Aurora background (frame-driven port), BlurText-style word reveals, Counter/CountUp, LogoLoop ticker, sounds → WAV.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShaderLayer} from './ShaderLayer';
import {AURORA_FRAG, auroraPalette} from './aurora';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

const C = {ivory: '#faf9f5', slate: '#141413', clay: '#d97757', clayDeep: '#b85c3e', muted: '#6b6a64', line: '#e6e1d6', paper: '#f0ede4', oat: '#e3dacc'};
const AR = "'Plex', sans-serif";
const HEAD = "'Readex', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = Easing.out(Easing.cubic);
const io = Easing.inOut(Easing.cubic);
const WF = 7; // frames per revealed word
const LEAD = 34; // paragraph starts after the kicker + stat lead-in
const HOLD = 78;

/* ------------- the article, verbatim (⟦ ⟧ only mark highlighted phrases) ------------- */
type Beat = {kicker: string; dark?: boolean; text: string; stat: string};
const BEATS: Beat[] = [
  {kicker: 'الطرح المرتقب', stat: 'valuation', text: 'يترقب سوق الذكاء الاصطناعي الطرح العام الأولي المرتقب لشركة Anthropic، المطورة لنموذج الذكاء الاصطناعي Claude، وسط توقعات بأن يشكل الاكتتاب، إذا تحقق بتقييم يبلغ ⟦1.5 تريليون دولار،⟧ ⟦نقطة تحول⟧ في القطاع، ويعزز تدفق الاستثمارات إلى شركات الذكاء الاصطناعي.'},
  {kicker: 'الموظفون والمؤسسون', stat: 'staff', text: 'لكن المكاسب المحتملة لن تقتصر على الشركة ومستثمريها، إذ يُتوقع أن يكون موظفو Anthropic من أبرز المستفيدين من الطرح، مع إمكانية تحول آلاف العاملين وعددهم ⟦5300 موظف⟧ إلى أصحاب ثروات ⟦بملايين الدولارات،⟧ فيما قد تصل حصص المؤسسين السبعة إلى ⟦عشرات المليارات⟧ من الدولارات لكل منهم.'},
  {kicker: 'منتصف نوفمبر', stat: 'founders', text: 'وإذا مضت الشركة في خطتها لطرح أسهمها للاكتتاب العام في ⟦منتصف نوفمبر،⟧ بتقييم يتجاوز 1.5 تريليون دولار، فقد ترتفع قيمة حصص مؤسسيها السبعة، وهم بالفعل من أصحاب المليارات، إلى ما ⟦بين 27 و29 مليار دولار⟧ لكل منهم.'},
  {kicker: 'أصحاب الملايين', stat: 'millionaires', text: 'ووفقًا لشركة ⟦Hill⟧ المتخصصة في تتبع سوق الأسهم الخاصة، فإن الطرح قد يمنح نحو ⟦50⟧ من أوائل المساهمين ثروات بملايين الدولارات، فيما قد ينضم نحو ⟦1200 موظف⟧ إلى فئة أصحاب الملايين، إلى جانب آلاف العاملين الآخرين الذين يُتوقع أن تحقق حصصهم مكاسب كبيرة.'},
  {kicker: 'المصلحة العامة', dark: true, stat: 'public', text: 'وقد يمثل هذا الاكتتاب ⟦حدثاً استثنائياً⟧ من حيث حجم الثروات التي يمكن أن يخلقها داخل الشركة. ومع ذلك، يبدو أن بعض مؤسسي Anthropic وموظفيها يتجهون إلى تخصيص جزء من هذه المكاسب ⟦لأغراض خيرية،⟧ في إطار ما تصفه الشركة ومؤسسوها ⟦بالالتزام بالمصلحة العامة.⟧'},
  {kicker: 'تعهد بالتبرع', stat: 'pledge', text: 'وتعهد الشقيقان ⟦داريو أمودي ودانييلا أمودي،⟧ إلى جانب الشركاء المؤسسين الخمسة الآخرين، بالتبرع بنسبة ⟦80%⟧ من مكاسبهم المحققة، كما خُصص نحو ⟦934 مليون سهم⟧ لبرنامج تبرعات مماثل يستهدف الموظفين.'},
  {kicker: 'وادي السيليكون', dark: true, stat: 'critics', text: 'وتأتي هذه التعهدات في وقت يتزايد فيه اهتمام رواد الأعمال في ⟦وادي السيليكون⟧ بكيفية توظيف الثروات الضخمة الناتجة عن طفرة الذكاء الاصطناعي. وفي المقابل، يتساءل منتقدون عما إذا كانت المبادرات الخيرية قد ترتبط أيضًا بمحاولات ⟦لتجنب آثار ضريبة مقترحة⟧ على القطاع.'},
  {kicker: 'ما بعد الطرح', stat: 'after', text: 'ولا يقتصر المستفيدون المحتملون من الطرح العام على موظفي Anthropic، إذ يُتوقع أن يستفيد ⟦مستثمرون ومساهمون آخرون⟧ مع بدء عمليات إتاحة الأسهم للتداول العام، ضمن سلسلة من التحركات المرتقبة ⟦اعتبارًا من العام الجديد.⟧'},
];
const words = (t: string) => t.split(' ');
export const INTRO = 130;
export const OUTRO = 130;
const beatLen = (b: Beat) => LEAD + words(b.text).length * WF + HOLD;
export const STARTS = BEATS.reduce<number[]>((a, b, i) => [...a, i === 0 ? INTRO : a[i - 1] + beatLen(BEATS[i - 1])], []);
export const OUTRO_AT = STARTS[STARTS.length - 1] + beatLen(BEATS[BEATS.length - 1]);
export const DURATION = OUTRO_AT + OUTRO;

/* ---------------- primitives ---------------- */
const FontFaces = () => (
  <style>{`
@font-face{font-family:'Plex';src:url(${staticFile('fonts/IBMPlexSansArabic-Regular.ttf')});font-weight:400;font-display:block}
@font-face{font-family:'Plex';src:url(${staticFile('fonts/IBMPlexSansArabic-Medium.ttf')});font-weight:500;font-display:block}
@font-face{font-family:'Plex';src:url(${staticFile('fonts/IBMPlexSansArabic-Bold.ttf')});font-weight:700;font-display:block}
@font-face{font-family:'Readex';src:url(${staticFile('fonts/Readex.ttf')});font-weight:160 700;font-display:block}
`}</style>
);

const AuroraBg: React.FC<{opacity?: number; stops?: string[]}> = ({opacity = 1, stops = [C.clay, '#e9a07f', C.clayDeep]}) => {
  const pal = React.useMemo(() => auroraPalette(stops), [stops.join()]);
  return (
    <AbsoluteFill style={{opacity}}>
      <ShaderLayer
        frag={AURORA_FRAG}
        uniforms={(t, w, h) => ({
          uResolution: [w, h], uTime: t * 0.12, uStops: pal, uStopCount: stops.length, uAmplitude: 1.1, uBlend: 0.55, uHeight: 0.5,
          uScale: 1, uGlow: 0.7, uBrightness: 1, uLayers: 2, uFlip: 0, uPointer: [0, 0, 0], uReveal: 1, uOpacity: 1, uLightMode: 0,
        })}
      />
    </AbsoluteFill>
  );
};

/** BlurText-style paragraph reveal, per word (never per letter for Arabic). ⟦…⟧ phrases get the clay highlighter. */
const Para: React.FC<{text: string; start: number; dark?: boolean; size: number}> = ({text, start, dark, size}) => {
  const f = useCurrentFrame();
  let inside = false;
  return (
    <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', columnGap: '0.27em', rowGap: 0, fontFamily: AR, fontWeight: 500, fontSize: size, lineHeight: 1.72, color: dark ? C.ivory : C.slate, textAlign: 'right'}}>
      {words(text).map((raw, i) => {
        const opens = raw.includes('⟦');
        const closes = raw.includes('⟧');
        if (opens) inside = true;
        const hl = inside;
        if (closes) inside = false;
        const w = raw.replace(/[⟦⟧]/g, '');
        const t0 = start + i * WF;
        const p = interpolate(f - t0, [0, 12], [0, 1], {...clamp, easing: out});
        const m = interpolate(f - t0 - 6, [0, 10], [0, 1], {...clamp, easing: out});
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', opacity: p, filter: `blur(${(1 - p) * 8}px)`, transform: `translateY(${(1 - p) * 22}px)`, fontWeight: hl ? 700 : 500, color: hl ? (dark ? '#f2b49a' : C.clayDeep) : undefined, unicodeBidi: 'isolate'}}>
            {hl ? <span style={{position: 'absolute', right: '-0.12em', left: '-0.12em', bottom: '0.18em', height: '0.42em', background: dark ? 'rgba(217,119,87,0.35)' : 'rgba(217,119,87,0.22)', transform: `scaleX(${m})`, transformOrigin: 'right', borderRadius: 4, zIndex: -1}} /> : null}
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Kicker typed with a block cursor (Bold Typer move), clicks on every 2nd grapheme in the mix. */
const Kicker: React.FC<{text: string; n: number; dark?: boolean}> = ({text, n, dark}) => {
  const f = useCurrentFrame();
  const g = Array.from(text);
  const k = Math.max(0, Math.min(g.length, Math.floor((f - 4) / 1.6)));
  const blink = k >= g.length ? (Math.floor(f / 12) % 2 === 0 ? 1 : 0) : 1;
  return (
    <div style={{position: 'absolute', top: 150, right: 70, left: 70, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 30, color: C.ivory, background: C.clay, borderRadius: 12, padding: '4px 16px', letterSpacing: 1}}>{String(n).padStart(2, '0')}</div>
      <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 62, color: dark ? C.ivory : C.slate, display: 'flex', alignItems: 'center'}}>
        {g.slice(0, k).join('')}
        <span style={{display: 'inline-block', width: 26, height: 66, marginRight: 8, background: C.clay, opacity: blink}} />
      </div>
    </div>
  );
};

/** React Bits Counter/CountUp, frame-driven. */
const useCount = (to: number, start: number, len = 34) => {
  const f = useCurrentFrame();
  return to * interpolate(f, [start, start + len], [0, 1], {...clamp, easing: out});
};
const fmt = (v: number, dec = 0) => v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});

const Big: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 210, color = C.slate}) => (
  <span style={{fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 1, color, direction: 'ltr', unicodeBidi: 'isolate', letterSpacing: -4}}>{children}</span>
);
const Label: React.FC<{children: React.ReactNode; dark?: boolean; start?: number}> = ({children, dark, start = 20}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - start, [0, 12], [0, 1], {...clamp, easing: out});
  return <div style={{fontFamily: HEAD, fontWeight: 500, fontSize: 44, color: dark ? 'rgba(250,249,245,0.8)' : C.muted, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, direction: 'rtl', textAlign: 'center'}}>{children}</div>;
};
const Chip: React.FC<{children: React.ReactNode; at: number; dark?: boolean}> = ({children, at, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 12}});
  return <div style={{direction: 'rtl', fontFamily: HEAD, fontWeight: 600, fontSize: 34, padding: '10px 26px', borderRadius: 999, border: `3px solid ${C.clay}`, color: dark ? C.ivory : C.clayDeep, background: dark ? 'rgba(217,119,87,0.15)' : '#fff', transform: `scale(${p})`}}>{children}</div>;
};
const StatBox: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', top: 270, left: 60, right: 60, height: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22}}>{children}</div>
);

const Stat: React.FC<{kind: string; dark?: boolean}> = ({kind, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useCount(1, 8);
  if (kind === 'valuation')
    return (
      <StatBox>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, direction: 'ltr'}}><Big color={C.clay}>$</Big><Big>{fmt(1.5 * v, 1)}</Big><Big size={110}>T</Big></div>
        <Label>تريليون دولار · التقييم المتوقع</Label>
      </StatBox>
    );
  if (kind === 'staff')
    return (
      <StatBox>
        <Big>{fmt(5300 * v)}</Big>
        <Label>موظف في Anthropic</Label>
        <div style={{display: 'flex', gap: 18, direction: 'rtl', marginTop: 6}}>
          {Array.from({length: 7}, (_, i) => {
            const p = spring({frame: f - 30 - i * 4, fps, config: {damping: 11}});
            return <div key={i} style={{width: 64, height: 64, borderRadius: 32, background: C.clay, transform: `scale(${p})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ivory, fontFamily: HEAD, fontWeight: 700, fontSize: 30}}>{i + 1}</div>;
          })}
        </div>
        <Label start={58}>7 مؤسسين</Label>
      </StatBox>
    );
  if (kind === 'founders')
    return (
      <StatBox>
        <Chip at={6}>منتصف نوفمبر</Chip>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 16, direction: 'ltr'}}><Big color={C.clay}>$</Big><Big>{fmt(27 * v)}</Big><Big size={130} color={C.muted}>–</Big><Big>{fmt(29 * v)}</Big><Big size={110}>B</Big></div>
        <Label>مليار دولار · لكل مؤسس من السبعة</Label>
      </StatBox>
    );
  if (kind === 'millionaires')
    return (
      <StatBox>
        <div style={{display: 'flex', gap: 40, direction: 'rtl', alignItems: 'flex-end'}}>
          <div style={{textAlign: 'center'}}><Big size={170}>{fmt(50 * v)}</Big><Label>من أوائل المساهمين</Label></div>
          <div style={{width: 3, height: 230, background: C.line}} />
          <div style={{textAlign: 'center'}}><Big size={170} color={C.clay}>{fmt(1200 * useCount(1, 22))}</Big><Label start={34}>موظف مليونير</Label></div>
        </div>
        <Chip at={50}>المصدر حسب المقال: شركة Hill</Chip>
      </StatBox>
    );
  if (kind === 'public')
    return (
      <StatBox>
        <div style={{transform: `scale(${spring({frame: f - 6, fps, config: {damping: 12}})})`}}>
          <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" strokeDasharray="30" strokeDashoffset={30 * (1 - interpolate(f, [8, 40], [0, 1], clamp))} />
            <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" strokeDasharray="40" strokeDashoffset={40 * (1 - interpolate(f, [14, 46], [0, 1], clamp))} />
            <path d="m2 15 6 6" />
            <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z" fill={C.clay} fillOpacity={interpolate(f, [40, 52], [0, 0.9], clamp)} />
          </svg>
        </div>
        <Label dark>المصلحة العامة</Label>
      </StatBox>
    );
  if (kind === 'pledge') {
    const r = 150, len = 2 * Math.PI * r, p = 0.8 * useCount(1, 8, 40);
    return (
      <StatBox>
        <div style={{position: 'relative', width: 360, height: 360}}>
          <svg width="360" height="360" style={{transform: 'rotate(-90deg)'}}>
            <circle cx="180" cy="180" r={r} stroke={C.line} strokeWidth="26" fill="none" />
            <circle cx="180" cy="180" r={r} stroke={C.clay} strokeWidth="26" fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Big size={130}>{fmt(p * 100)}%</Big></div>
        </div>
        <Chip at={46}>{`${fmt(934 * useCount(1, 46, 30))} مليون سهم للموظفين`}</Chip>
      </StatBox>
    );
  }
  if (kind === 'critics')
    return (
      <StatBox>
        <div style={{transform: `scale(${spring({frame: f - 6, fps, config: {damping: 9}})}) rotate(${Math.sin(f / 9) * 4}deg)`}}><Big size={300} color={C.clay}>?</Big></div>
        <div style={{display: 'flex', gap: 16, direction: 'rtl'}}>
          <Chip at={24} dark>تبرعات خيرية</Chip>
          <Chip at={32} dark>ضريبة مقترحة</Chip>
        </div>
      </StatBox>
    );
  // after
  return (
    <StatBox>
      <div style={{display: 'flex', gap: 22, direction: 'rtl'}}>
        {['موظفون', 'مستثمرون', 'مساهمون'].map((t, i) => {
          const p = spring({frame: f - 8 - i * 7, fps, config: {damping: 12}});
          return <div key={t} style={{width: 280, height: 220, borderRadius: 28, background: i === 0 ? C.slate : i === 1 ? C.clay : C.oat, color: i === 2 ? C.slate : C.ivory, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 46, transform: `translateY(${(1 - p) * 60}px)`, opacity: p}}>{t}</div>;
        })}
      </div>
      <Chip at={34}>اعتبارًا من العام الجديد</Chip>
    </StatBox>
  );
};

const paraSize = (t: string) => (t.length > 330 ? 49 : t.length > 290 ? 52 : 55);

const BeatView: React.FC<{b: Beat; n: number}> = ({b, n}) => (
  <AbsoluteFill style={{background: b.dark ? C.slate : C.ivory}}>
    {b.dark ? <AuroraBg opacity={0.55} /> : null}
    {b.dark ? <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,20,19,0) 0%, rgba(20,20,19,0.75) 45%, rgba(20,20,19,0.92) 100%)'}} /> : null}
    <Kicker text={b.kicker} n={n} dark={b.dark} />
    <Stat kind={b.stat} dark={b.dark} />
    <div style={{position: 'absolute', top: 790, left: 72, right: 72}}>
      <div style={{height: 3, background: b.dark ? 'rgba(250,249,245,0.18)' : C.line, marginBottom: 34}} />
      <Para text={b.text} start={LEAD} dark={b.dark} size={paraSize(b.text)} />
    </div>
  </AbsoluteFill>
);

const Wordmark: React.FC<{color?: string; size?: number}> = ({color = C.ivory, size = 92}) => (
  <span style={{fontFamily: HEAD, fontWeight: 500, fontSize: size, letterSpacing: size * 0.14, color, direction: 'ltr'}}>ANTHROPIC</span>
);

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wm = interpolate(f, [8, 40], [0, 1], {...clamp, easing: out});
  const t = spring({frame: f - 46, fps, config: {damping: 13}});
  return (
    <AbsoluteFill style={{background: C.slate}}>
      <AuroraBg />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(20,20,19,0.1) 0%, rgba(20,20,19,0.85) 80%)'}} />
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', opacity: wm, filter: `blur(${(1 - wm) * 12}px)`, letterSpacing: (1 - wm) * 30}}><Wordmark /></div>
      <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 116, color: C.ivory, transform: `scale(${0.7 + 0.3 * t})`, opacity: t}}>الاكتتاب المرتقب</div>
      <div style={{position: 'absolute', top: 990, width: '100%', display: 'flex', justifyContent: 'center', gap: 18, direction: 'rtl'}}>
        <Chip at={70} dark>1.5 تريليون دولار</Chip>
        <Chip at={78} dark>5300 موظف</Chip>
        <Chip at={86} dark>7 مؤسسين</Chip>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [6, 30], [0, 1], {...clamp, easing: out});
  return (
    <AbsoluteFill style={{background: C.slate}}>
      <AuroraBg opacity={0.8} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(20,20,19,0.15) 0%, rgba(20,20,19,0.85) 80%)'}} />
      <div style={{position: 'absolute', top: 620, width: '100%', textAlign: 'center', opacity: p}}><Wordmark size={78} /></div>
      <div style={{position: 'absolute', top: 780, left: 80, right: 80, fontFamily: HEAD, fontWeight: 700, fontSize: 92, color: C.ivory, textAlign: 'center', lineHeight: 1.3, direction: 'rtl', opacity: interpolate(f, [24, 40], [0, 1], clamp)}}>
        منتصف نوفمبر… <span style={{color: '#f2b49a'}}>الموعد المرتقب</span>
      </div>
      <div style={{position: 'absolute', top: 1060, width: '100%', textAlign: 'center', fontFamily: HEAD, fontSize: 40, color: 'rgba(250,249,245,0.7)', direction: 'rtl', opacity: interpolate(f, [50, 64], [0, 1], clamp)}}>تابعونا لأخبار الذكاء الاصطناعي</div>
    </AbsoluteFill>
  );
};

/** LogoLoop-style ticker (React Bits), frame-driven marquee. */
const Ticker: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['ANTHROPIC IPO', '1.5 تريليون دولار', '5300 موظف', '7 مؤسسين', '27–29 مليار لكل مؤسس', '1200 مليونير محتمل', '80% للتبرع', '934 مليون سهم', 'منتصف نوفمبر'];
  const strip = items.map((t, i) => (
    <span key={i} style={{display: 'inline-flex', alignItems: 'center', gap: 26, marginLeft: 26}}>
      <span style={{width: 12, height: 12, borderRadius: 6, background: C.clay, display: 'inline-block'}} />{t}
    </span>
  ));
  const x = (f * 0.07) % 50;
  const vis = interpolate(f, [INTRO - 10, INTRO + 6, OUTRO_AT - 6, OUTRO_AT + 6], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', bottom: 120, left: 0, right: 0, height: 82, background: C.slate, overflow: 'hidden', opacity: vis, borderTop: `3px solid ${C.clay}`}}>
      <div style={{position: 'absolute', top: 14, left: 0, whiteSpace: 'nowrap', fontFamily: HEAD, fontWeight: 500, fontSize: 34, color: C.ivory, direction: 'ltr', transform: `translateX(-${x}%)`}}>
        <span style={{display: 'inline-block'}}>{strip}</span><span style={{display: 'inline-block'}}>{strip}</span>
      </div>
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 170, background: C.clay, color: C.ivory, fontFamily: HEAD, fontWeight: 700, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>عاجل</div>
    </div>
  );
};

/** Clay news-wipe over each cut. */
const Wipe: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [-8, 8], [0, 1], {...clamp, easing: io});
  if (f < at - 8 || f > at + 8) return null;
  return <div style={{position: 'absolute', top: 0, bottom: 0, width: 520, right: -520 + p * (W + 1040), background: C.clay, transform: 'skewX(-12deg)'}} />;
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const i = STARTS.findIndex((s, k) => f >= s && f < (STARTS[k + 1] ?? OUTRO_AT));
  if (i < 0) return null;
  const dark = BEATS[i].dark;
  const p = (f - STARTS[i]) / beatLen(BEATS[i]);
  return (
    <div style={{position: 'absolute', top: 86, left: 70, right: 70, display: 'flex', gap: 10, direction: 'rtl'}}>
      {BEATS.map((_, k) => (
        <div key={k} style={{flex: 1, height: 8, borderRadius: 4, background: dark ? 'rgba(250,249,245,0.2)' : C.line, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${k < i ? 100 : k === i ? p * 100 : 0}%`, background: C.clay, marginRight: 0, marginLeft: 'auto'}} />
        </div>
      ))}
    </div>
  );
};

export const AnthropicIPO: React.FC = () => (
  <AbsoluteFill style={{background: C.slate}}>
    <FontFaces />
    <Sequence durationInFrames={INTRO}><Intro /></Sequence>
    {BEATS.map((b, i) => (
      <Sequence key={i} from={STARTS[i]} durationInFrames={beatLen(b)}>
        <BeatView b={b} n={i + 1} />
      </Sequence>
    ))}
    <Sequence from={OUTRO_AT}><Outro /></Sequence>
    <Progress />
    <Ticker />
    {[...STARTS, OUTRO_AT].map((s) => <Wipe key={s} at={s} />)}
  </AbsoluteFill>
);
