import React from 'react'
import { Window } from '../kit/window'
import { Phone, LockScreen, Notification } from '../kit/phone'
import { MacPointer } from '../kit/cursors'
import { Ico, Logo, BlurText, Pop } from './ui'
import { Decrypted, Counter, Sparks, StarBorder } from './rb'
import { lin, eo, eio, spring, clamp, mix, life } from './anim'

export const END = 50.0
// Scene cuts on the voice's pauses (silencedetect).
const SC = { hook: [0, 5.3], one: [5.3, 23.45], two: [23.45, 32.3], three: [32.3, 41.2], end: [41.2, END + 1] } as const
function Scene({ t, k, children }: { t: number; k: keyof typeof SC; children: React.ReactNode }) {
  const [a, b] = SC[k]
  if (t < a - 0.01 || t > b + 0.35) return null
  const i = eo(lin(t, a, a + 0.4)), o = eio(lin(t, b, b + 0.32))
  return <div className="scene" style={{ opacity: a === 0 ? 1 - o : Math.min(i, 1 - o), transform: `translateY(${(1 - i) * 26 - o * 30}px) scale(${1 - o * 0.04})`, filter: o > 0 ? `blur(${o * 6}px)` : undefined }}>{children}</div>
}
const L = (k: string) => ('ai_' + k) as any
const GREEN = '#22c55e', INK = '#111'

// The «تقني» mark (black bowl + black pixel + green pixel), with blink on the green pixel.
function Mark({ size, t, at, blinkAt = [] as number[], hideGreen = false }: { size: number; t: number; at: number; blinkAt?: number[]; hideGreen?: boolean }) {
  const d1 = spring(t, at, 0.6), d2 = spring(t, at + 0.1, 0.6), bowl = eo(lin(t, at + 0.2, at + 0.6))
  const bl = blinkAt.reduce((m, b) => Math.max(m, Math.sin(clamp((t - b) / 0.22) * Math.PI)), 0)
  return (
    <svg viewBox="200 250 680 560" width={size} height={size * 560 / 680} style={{ display: 'block', overflow: 'visible' }}>
      <g transform="translate(0 45)">
        <path d="M300 470 C300 700 780 700 780 440" fill="none" stroke={INK} strokeWidth="118" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - bowl} opacity={bowl > 0 ? 1 : 0} />
        <rect x="400" y={300 - (1 - d1) * 420} width="112" height="112" rx="22" fill={INK} opacity={clamp(d1 * 3)} />
        {!hideGreen && <rect x="568" y={300 - (1 - d2) * 420 + bl * 50} width="112" height={112 * (1 - bl * 0.9)} rx="22" fill={GREEN} opacity={clamp(d2 * 3)} />}
      </g>
    </svg>
  )
}
const Cursor = ({ x, y, click }: { x: number; y: number; click: number }) => (
  <div className="dcur" style={{ left: x, top: y }}>
    {click >= 0 && click < 1 && <span className="dcur__rip" style={{ transform: `translate(-50%,-50%) scale(${0.3 + eo(click) * 1.4})`, opacity: 1 - click }} />}
    <span style={{ display: 'block', transform: `translate(-11px,-8px) scale(${click >= 0 && click < 0.25 ? 0.85 : 1.25})`, transformOrigin: '11px 8px' }}><MacPointer /></span>
  </div>
)
function Scan({ t, a, b, x, y, w, h, label, below }: { t: number; a: number; b: number; x: number; y: number; w: number; h: number; label: string; below?: boolean }) {
  const v = Math.min(lin(t, a, a + 0.2), 1 - lin(t, b - 0.12, b))
  if (v <= 0) return null
  const ins = spring(t, a + 0.12, 0.6), bp = lin(t, a, a + 0.42)
  return (
    <>
      <div className="scan-veil" style={{ left: x, top: y, width: w, height: h, opacity: v }} />
      {bp < 1 && <div className="scan-beam" style={{ top: mix(-20, y + h / 2, eo(bp)), opacity: Math.sin(bp * Math.PI) }} />}
      <div className="scan-box" style={{ left: x, top: y, width: w, height: h, opacity: v * clamp(ins * 2), transform: `scale(${1.18 - 0.18 * ins})` }}><i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" /></div>
      <div className="scan-tag" dir="rtl" style={{ left: x + w / 2, top: below ? y + h + 12 : y - 12, opacity: v * clamp(ins * 2), transform: `translate(-50%, ${below ? '0' : '-100%'}) scale(${0.8 + 0.2 * ins})` }}>{label}</div>
    </>
  )
}
const typed = (t: number, a: number, b: number, s: string) => s.slice(0, Math.round(lin(t, a, b) * s.length))

// Tool header: green pixel with its number (React Bits Counter) + logo + decrypted name.
function Head({ t, n, at, logoAt, k, name, sub, subAt }: { t: number; n: number; at: number; logoAt: number; k: string; name: string; sub?: string; subAt?: number }) {
  const b = spring(t, at, 0.6)
  return (
    <div className="thead" dir="ltr">
      <span className="pix" style={{ transform: `scale(${b}) rotate(${(1 - b) * -20}deg)` }}><Counter value={mix(0, n, eo(lin(t, at, at + 0.6)))} size={44} /></span>
      <Pop t={t} at={logoAt} from={0.4} className="thead__logo"><Logo k={L(k)} h={46} /></Pop>
      <span className="thead__name"><Decrypted t={t} at={logoAt + 0.1} text={name} />{sub && subAt !== undefined && <Pop t={t} at={subAt} from={0.6} className="thead__sub">{sub}</Pop>}</span>
    </div>
  )
}

// ---------- hook ----------
function Hook({ t }: { t: number }) {
  const m = eio(lin(t, 1.55, 2.15))
  const big = spring(t, 1.6, 0.7)
  return (
    <>
      <div className="abs" style={{ left: mix(150, 22, m), top: mix(220, 22, m), transform: `scale(${mix(1, 0.24, m)})`, transformOrigin: '0 0' }}>
        <Mark size={240} t={t} at={0.05} blinkAt={[1.0]} hideGreen={t > 1.6} />
      </div>
      {t > 1.55 && (
        <div className="bigpix" style={{ left: mix(150 + 240 * 0.54, 180, eo(big)), top: mix(220 + 40, 210, eo(big)), width: mix(40, 180, eo(big)), height: mix(40, 180, eo(big)), borderRadius: mix(8, 44, eo(big)) }}>
          {big > 0.5 && <Counter value={mix(0, 3, eo(lin(t, 1.8, 2.6)))} size={124} />}
        </div>
      )}
      {[['notebooklm', 2.4, -150], ['perplexity', 2.6, -30], ['ideogram', 2.8, 90]].map(([k, at, ang]) => {
        const p = spring(t, at as number, 0.6), a = ((ang as number) + t * 22) * Math.PI / 180
        return <div key={k as string} className="orb" style={{ left: 270 + Math.cos(a) * 150 - 34, top: 300 + Math.sin(a) * 150 - 34, opacity: clamp(p * 2), transform: `scale(${p})` }}><Logo k={L(k as string)} h={38} /></div>
      })}
      <BlurText t={t} at={0.35} text="ثلاث أدوات" className="h1" style={{ top: 560 }} />
      <BlurText t={t} at={1.0} text="ذكاء اصطناعي" className="h1 hl-all" style={{ top: 616 }} />
      <BlurText t={t} at={2.35} text="لو تعرفهم…" className="h3" style={{ top: 710 }} />
      <BlurText t={t} at={3.35} text="توفّر ساعات من شغلك" hl={['ساعات']} className="h2" style={{ top: 760 }} />
    </>
  )
}

// ---------- 1. NotebookLM ----------
const FILES = [[10.72, 'book-open', 'كتاب.pdf'], [11.3, 'video', 'محاضرة.pdf'], [12.24, 'file-text', 'تقرير.docx']] as const
function One({ t }: { t: number }) {
  const chat = life(t, 13.3, 18.15, 0.3, 0.3)
  const audio = spring(t, 19.2, 0.7)
  const q = typed(t, 13.4, 14.3, 'شن أهم نتيجة في التقرير؟')
  const ans = 'أهم نتيجة إن المبيعات زادت في الربع الثاني'.split(' ')
  const play = t >= 19.7
  return (
    <>
      <Head t={t} n={1} at={5.57} logoAt={6.94} k="notebooklm" name="NotebookLM" sub="Google" subAt={8.21} />
      <Window chrome="card" className="cardwin" style={{ top: 200, height: 292 }}>
        <div className="srcs" dir="rtl">
          <div className="srcs__h"><Ico name="folder" size={18} />ملفاتك</div>
          {FILES.map(([at, ic, n], i) => {
            const p = spring(t, at, 0.6), hot = life(t, 16.45, 18.0, 0.15, 0.3) * (i === 2 ? 1 : 0)
            return <div key={n} className="src" style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * 8}deg)`, boxShadow: hot ? `0 0 0 3px rgba(34,197,94,${hot})` : undefined }}><span className="src__i"><Ico name={ic} look="duotone" size={26} color="#1f9d63" /></span>{n}{i === 2 && hot > 0 && <span className="cite" style={{ marginInlineStart: 'auto' }}>2</span>}</div>
          })}
        </div>
      </Window>
      {t < 13.3 && <BlurText t={t} at={8.95} text="ترفعله ملفاتك" className="h1" style={{ top: 560, opacity: 1 - lin(t, 13.0, 13.3) }} />}
      {t > 14.6 && t < 18.2 && <BlurText t={t} at={14.75} text="يجاوبك منهم… ويوريك المصدر" hl={['المصدر']} className="h2" style={{ top: 830, opacity: 1 - lin(t, 17.9, 18.15) }} />}
      {t > 19.2 && t < 22.1 && <BlurText t={t} at={19.3} text="يحوّلهم لبودكاست" hl={['لبودكاست']} className="h2" style={{ top: 830, opacity: 1 - lin(t, 21.85, 22.05) }} />}
      {chat > 0 && (
        <div className="chat" dir="rtl" style={{ opacity: chat }}>
          <div className="bub me">{q}{t < 14.3 && <i className="caret" />}</div>
          {t > 14.7 && <div className="bub ai">{ans.map((w, i) => <span key={i} style={{ opacity: lin(t, 14.8 + i * 0.12, 15.0 + i * 0.12) }}>{w} </span>)}<span className="cite" style={{ opacity: lin(t, 15.9, 16.0) }}>1</span><span className="cite" style={{ opacity: lin(t, 16.05, 16.15) }}>2</span></div>}
        </div>
      )}
      <Scan t={t} a={16.4} b={18.05} x={290} y={643} w={72} h={40} label="المصدر" below />
      {audio > 0 && t > 19.2 && (
        <div className="aov" dir="rtl" style={{ opacity: clamp(audio * 2), transform: `translateY(${(1 - audio) * 60}px)` }}>
          <div className="aov__h"><span className="aov__hosts"><i>A</i><i>B</i></span><span><b>Audio Overview</b><small>بودكاست من ملفاتك</small></span>
            <span className="aov__play" style={{ transform: t > 19.65 && t < 19.8 ? 'scale(.9)' : undefined }}><Ico name={play ? 'pause' : 'play'} look="fill" size={26} color="#fff" /></span></div>
          <div className="aov__wave">{Array.from({ length: 34 }).map((_, i) => <i key={i} style={{ height: `${play ? 18 + 78 * Math.abs(Math.sin(t * 7 + i * 0.7) * Math.cos(t * 3.1 + i * 0.33)) : 18}%`, background: i % 2 ? GREEN : '#111' }} />)}</div>
          <div className="aov__bar"><i style={{ width: `${lin(t, 19.7, 23.4) * 100}%` }} /></div>
        </div>
      )}
      {t > 18.1 && t < 19.3 && <BlurText t={t} at={18.2} text="والأحلى؟" className="h1 hl-all" style={{ top: 560 }} />}
      {t > 22.0 && <Pop t={t} at={22.1} from={0.6} className="abs center" style={{ top: 835 }}><div className="greenpill"><Ico name="headphones" size={22} color="#fff" />تسمعها وانت سايق<Ico name="car" size={22} color="#fff" /></div></Pop>}
    </>
  )
}

// ---------- 2. Perplexity ----------
function Two({ t }: { t: number }) {
  const q = typed(t, 25.8, 26.9, 'أفضل لابتوب للبرمجة؟')
  const lines = [0.95, 0.8, 0.88, 0.6]
  const cur = { x: mix(560, 270, eio(lin(t, 30.2, 30.75))), y: mix(820, 625, eio(lin(t, 30.2, 30.75))) }
  return (
    <>
      <Head t={t} n={2} at={23.7} logoAt={24.2} k="perplexity" name="Perplexity" />
      <div className="search" dir="rtl" style={{ opacity: clamp(lin(t, 25.6, 25.9)) }}><Ico name="search" size={24} color="#1f9d63" /><span>{q || <span style={{ color: '#aaa' }}>اسأل أي سؤال…</span>}</span>{t > 25.8 && t < 26.95 && <i className="caret" />}</div>
      <div className="answer" dir="rtl" style={{ opacity: clamp(lin(t, 27.5, 27.8)) }}>
        <div className="answer__h"><Ico name="globe" size={18} color="#1f9d63" />من الإنترنت</div>
        {lines.map((w, i) => <div key={i} className="ln" style={{ width: `${w * lin(t, 27.6 + i * 0.25, 28.0 + i * 0.25) * 100}%` }}>{i < 3 && t > 29.1 + i * 0.15 && <span className="cite inl">{i + 1}</span>}</div>)}
      </div>
      <div className="sources" dir="rtl">
        {[1, 2, 3].map((n, i) => {
          const p = spring(t, 29.2 + i * 0.18, 0.6), ok = n === 2 && t > 31.0
          return <div key={n} className="srcc" style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 40}px)`, borderColor: ok ? GREEN : undefined }}><span className="srcc__n">{n}</span><Ico name="link" size={18} color="#555" /><span>مصدر {['١', '٢', '٣'][i]}</span>{ok && <Ico name="circle-check" look="fill" size={20} color="#1f9d63" />}</div>
        })}
      </div>
      {t > 25.7 && t < 27.5 && <BlurText t={t} at={25.8} text="تسأله أي سؤال" className="h2" style={{ top: 830, opacity: 1 - lin(t, 27.3, 27.5) }} />}
      {t > 27.5 && t < 30.7 && <BlurText t={t} at={27.6} text="يجاوبك… مع روابط المصادر" hl={['المصادر']} className="h2" style={{ top: 830, opacity: 1 - lin(t, 30.5, 30.7) }} />}
      {t > 30.7 && <BlurText t={t} at={30.8} text="باش تتأكد بروحك" className="h2 hl-all" style={{ top: 830 }} />}
      <Scan t={t} a={30.78} b={31.7} x={186} y={554} w={168} h={116} label="تتأكد بروحك" below />
      {t > 30.1 && <Cursor x={cur.x} y={cur.y} click={t > 30.8 ? (t - 30.8) / 0.45 : -1} />}
    </>
  )
}

// ---------- 3. Ideogram ----------
function Three({ t }: { t: number }) {
  const q = typed(t, 34.5, 35.4, 'Poster: "SUMMER SALE"')
  const gen = lin(t, 35.45, 36.2)
  const bad = spring(t, 39.75, 0.6)
  return (
    <>
      <Head t={t} n={3} at={32.51} logoAt={33.53} k="ideogram" name="Ideogram" />
      <div className="search" dir="ltr" style={{ opacity: clamp(lin(t, 34.3, 34.5)), top: 196 }}><Ico name="wand" size={22} color="#1f9d63" /><span style={{ fontFamily: 'Inter', fontWeight: 700 }}>{q}</span>{t > 34.5 && t < 35.45 && <i className="caret" />}</div>
      <div className="poster" style={{ opacity: clamp(lin(t, 35.4, 35.6)), transform: `translateX(${-bad * 70}px) rotate(${-bad * 2}deg)` }}>
        <div className="poster__in"><small>NEW SEASON</small><b>SUMMER<br />SALE</b><span>50% OFF</span></div>
        {gen < 1 && <div className="pxgrid">{Array.from({ length: 64 }).map((_, i) => <i key={i} style={{ opacity: (((i * 37) % 64) / 64) > gen ? 1 : 0 }} />)}</div>}
        {t > 38.25 && <span className="okstamp" style={{ transform: `rotate(-10deg) scale(${1.5 - 0.5 * spring(t, 38.3, 0.5)})`, opacity: lin(t, 38.25, 38.4) }}>✓ مقروءة</span>}
      </div>
      {bad > 0 && (
        <div className="poster bad" style={{ opacity: clamp(bad * 2), transform: `translateX(${40}px) rotate(${6}deg) scale(${0.6 + 0.12 * bad})` }}>
          <div className="poster__in"><small>NEW SAESON</small><b>SUMRNER<br />SAEL</b><span>5O% OFF</span></div>
          <span className="xstamp"><Ico name="x" size={44} color="#fff" /></span>
        </div>
      )}
      <Scan t={t} a={36.25} b={38.2} x={150} y={414} w={240} h={134} label="الكتابة في الصورة" />
      {t > 39.7 && <BlurText t={t} at={39.8} text="مش حروف ملخبطة" className="h2" style={{ top: 830 }} />}
    </>
  )
}

// ---------- end ----------
const TOOLS = [['notebooklm', 'NotebookLM'], ['perplexity', 'Perplexity'], ['ideogram', 'Ideogram']] as const
function End({ t }: { t: number }) {
  const up = eio(lin(t, 45.0, 45.6))
  const follow = t >= 46.85
  return (
    <>
      <div className="trio" style={{ top: mix(220, 70, up), transform: `scale(${1 - up * 0.3})` }}>
        {TOOLS.map(([k, n], i) => {
          const p = spring(t, 41.45 + i * 0.2, 0.6)
          return (
            <div key={k} className="tcard" style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 50}px)` }}>
              <span className="pix sm"><Counter value={i + 1} size={26} /></span>
              <Logo k={L(k)} h={44} /><b>{n}</b>
              <Pop t={t} at={43.2 + i * 0.25} from={0.4}><span className="soon">شرح كامل</span></Pop>
            </div>
          )
        })}
      </div>
      {t > 43.1 && t < 45.1 && <BlurText t={t} at={43.15} text="خطوة بخطوة" className="h2 hl-all" style={{ top: 520 }} />}
      {t > 45.0 && (
        <>
          <div className="abs center" style={{ top: 300 }}><Mark size={200} t={t} at={45.2} blinkAt={[46.2, 47.9]} /></div>
          <Pop t={t} at={45.45} from={0.6} className="abs center" style={{ top: 505 }}><div className="wm">تقني</div></Pop>
          <Pop t={t} at={46.45} from={0.5} className="abs center" style={{ top: 662 }}>
            <StarBorder t={t}><span className="followb" dir="rtl" style={{ transform: `scale(${t > 46.8 && t < 46.95 ? 0.93 : 1})`, background: follow ? '#fff' : INK, color: follow ? INK : '#fff' }}><Ico name={follow ? 'circle-check' : 'user-plus'} size={24} color={follow ? GREEN : '#fff'} />{follow ? 'تتابع تقني' : 'تابع'}</span></StarBorder>
          </Pop>
          <Sparks t={t} at={46.85} x={270} y={694} count={12} radius={110} size={18} />
          <div className="notif" style={{ transform: `translateY(${(1 - spring(t, 47.25, 0.7)) * -140}px)`, opacity: clamp(lin(t, 47.25, 47.45)) }}>
            <Notification icon={<span className="nic"><Mark size={30} t={99} at={0} /></span>} title="تقني" body={"نزل الشرح الكامل لـ \u2066NotebookLM\u2069"} time="الآن" />
          </div>
          <Pop t={t} at={48.3} from={0.8} className="abs center" style={{ top: 896 }}><div className="endtag"><Logo k="tt" h={30} /><span dir="ltr">@techno_ly</span></div></Pop>
        </>
      )}
    </>
  )
}

export default function App({ t }: { t: number }) {
  const bug = t > 2.15 && t < 45.0
  return (
    <div className="ss-stage stage" data-theme="light">
      <div className="bg" />
      <Scene t={t} k="hook"><Hook t={t} /></Scene>
      <Scene t={t} k="one"><One t={t} /></Scene>
      <Scene t={t} k="two"><Two t={t} /></Scene>
      <Scene t={t} k="three"><Three t={t} /></Scene>
      <Scene t={t} k="end"><End t={t} /></Scene>
      {bug && t > 5.3 && <div className="bug"><Mark size={58} t={99} at={0} blinkAt={[9.5, 17.2, 26.4, 35.0, 42.6]} /></div>}
    </div>
  )
}
