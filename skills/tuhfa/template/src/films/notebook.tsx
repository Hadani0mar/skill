import React from 'react'
import { Phone } from '../../kit/phone'
import { Ico } from '../ui'
import assets from '../assets.json'
import { lin, eo, eio, spring, clamp, mix } from '../anim'

// «Gemini Notebook» v3 — one phone, one stage. Everything happens on the phone or comes out of it.
// Timed to the user's voice (37.56 s). Rebuilt app screens from the user's own screenshots (scr space 1080×2400).
const G = '#22c55e', GT = '#1f9d63', RED = '#e5484d'
export const T = { hook: 0, sol: 5.0, name: 6.55, src: 13.95, ask: 20.0, sum: 25.3, pod: 27.25, map: 30.75, end: 35.3, total: 37.56 }
const AR = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])
const raw = (k: string) => ((assets.logos as any)[k] as string).replace(/<title>.*?<\/title>/, '')
const Logo = ({ k, h }: { k: string; h: number }) => <span style={{ display: 'inline-flex', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: raw(k).replace(/ width="[^"]*"| height="[^"]*"/g, '').replace('<svg', `<svg style="height:${h}px;width:auto;display:block"`) }} />
function NbLogo({ h, id = 'nbg' }: { h: number; id?: string }) {
  const path = raw('nblm').match(/d="([^"]+)"/)![1]
  return <svg viewBox="0 0 24 24" style={{ height: h, width: h * 1.1 }}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9aa8ff" /><stop offset=".5" stopColor="#5b8cf5" /><stop offset="1" stopColor="#3f7ee8" /></linearGradient></defs>
    <path d={path} fill={`url(#${id})`} /></svg>
}

// ── screens (scr space) ─────────────────────────────────────────────────────
const Screen = ({ children, bg = '#fff' }: { children: React.ReactNode; bg?: string }) =>
  <div className="scr5" style={{ background: bg }}><div className="scr5__in">{children}</div></div>
function Header({ title = 'تقرير المشروع' }: { title?: string }) {
  return <div className="hdr" dir="rtl"><Ico name="arrow-right" size={58} color="#222" /><span className="hdr__t">{title}</span>
    <span className="hdr__sp" /><Ico name="share-2" size={60} color="#222" /><Ico name="ellipsis-vertical" size={60} color="#222" /></div>
}
function Tabs({ on }: { on: 0 | 1 | 2 }) {
  const it = [['file-text', 'المصادر'], ['messages-square', 'المحادثة'], ['wand-sparkles', 'الاستوديو']]
  return <div className="tabs5" dir="rtl">{it.map(([ic, l], i) =>
    <div key={i} className={'tab5' + (i === on ? ' on' : '')}><Ico name={ic} size={66} look={i === on ? 'fill' : 'outline'} color={i === on ? '#111' : '#666'} /><b>{l}</b></div>)}</div>
}
// the PDF reader: endless pages scrolling, page counter racing
function ScreenPDF({ t }: { t: number }) {
  const sc = 300 * Math.pow(Math.min(t, 4.6), 1.6) * 1.1, page = Math.min(320, 1 + Math.floor(sc / 1250 * 6.5))
  return <Screen bg="#e7e7ea">
    <div className="pdf-top" dir="rtl"><Ico name="arrow-right" size={58} color="#222" /><span>تقرير_المشروع.pdf</span></div>
    <div className="pdf-pages" style={{ transform: `translateY(${-(sc % 1250)}px)` }}>
      {[0, 1, 2, 3].map(i => <div key={i} className="pdf-page">
        <i className="h" />{Array.from({ length: 22 }, (_, k) => <i key={k} style={{ width: `${[100, 94, 98, 86, 100, 72, 97, 90, 64][(k + i * 3) % 9]}%` }} />)}</div>)}
    </div>
    <div className="pdf-num" dir="rtl"><b>{AR(page)}</b> / ٣٢٠</div>
    <div className="pdf-bar"><i style={{ top: `${(page / 320) * 92}%` }} /></div>
  </Screen>
}
function ScreenA() {
  return <Screen>
    <div className="a-logo" dir="ltr"><NbLogo h={66} id="nbA" /><span>Gemini Notebook</span></div>
    <div className="a-h1" dir="rtl">تفاصيل العالم بين يديك.</div>
    <div className="a-h2" dir="rtl">الإبداع مع الذكاء الاصطناعي</div>
    <div className="a-glow" />
    <div className="a-btn">البدء</div>
  </Screen>
}
const SRC_ROWS: [React.ReactNode, string, number][] = [
  [<Logo k="pdf" h={70} />, 'تقرير_المشروع.pdf', 14.3],
  [<Logo k="word" h={70} />, 'عقد_العمل.docx', 15.0],
  [<Logo k="sheets" h={70} />, 'جدول المبيعات', 15.7],
  [<Ico name="link" size={70} color="#3f7ee8" />, 'رابط موقع', 16.3],
  [<Logo k="yt" h={52} />, 'محاضرة على يوتيوب', 16.9],
  [<Ico name="mic" size={70} color="#8b5cf6" />, 'تسجيل صوتي', 17.8],
]
function ScreenSrc({ t }: { t: number }) {
  return <Screen>
    <Header />
    <div className="s-h" dir="rtl">المصادر</div>
    <div className="s-add" dir="rtl"><Ico name="plus" size={56} color="#111" /> إضافة مصدر</div>
    {SRC_ROWS.map(([ic, l, at], i) => { const s = spring(t, at + .35, .6); return t > at + .3 ?
      <div key={i} className="s-row" dir="rtl" style={{ top: 620 + i * 172, height: 150, opacity: clamp(s * 2), transform: `translateX(${(1 - s) * -80}px)` }}>
        <span className="s-ic">{ic}</span><span>{l}</span><span className="s-ck"><Ico name="check" size={50} color="#fff" /></span></div> : null })}
    <div className="s-cap" dir="rtl" style={{ top: 1680 }}>لين ٥٠ مصدر في الدفتر الواحد</div>
    <Tabs on={0} />
  </Screen>
}
type Msg = { me?: boolean; at: number; body: React.ReactNode; h: number }
function ScreenChat({ t, msgs }: { t: number; msgs: Msg[] }) {
  const vis = msgs.filter(m => t > m.at); let y = 0
  const total = vis.reduce((s, m) => s + m.h + 50, 0), off = Math.max(0, total - 1500)
  return <Screen>
    <Header />
    <div className="ch-body" style={{ transform: `translateY(${-off}px)` }}>
      {vis.map((m, i) => { const s = spring(t, m.at, .5); const top = y; y += m.h + 50
        return <div key={i} className={'ch-msg' + (m.me ? ' me' : '')} dir="rtl" style={{ top, opacity: clamp(s * 2), transform: `translateY(${(1 - s) * 60}px)` }}>{m.body}</div> })}
    </div>
    <div className="b-in"><div className="b-ph" dir="rtl">اسأل عن مصادرك…</div><div className="b-mic"><Ico name="audio-lines" size={60} color="#666" /></div></div>
    <Tabs on={1} />
  </Screen>
}
const Cite = ({ n, on }: { n: number; on?: boolean }) => <span className={'cite8' + (on ? ' on' : '')}>{n}</span>
const TILES: [string, string, string][] = [['audio-lines', 'الملخّص الصوتي', 'audio'], ['video', 'ملخّص فيديو', 'video'], ['presentation', 'مجموعة الشرائح', 'slides'],
  ['gallery-vertical', 'البطاقات التعليمية', 'cards'], ['circle-question-mark', 'اختبار', 'quiz'], ['chart-column', 'المخطّط البياني', 'chart'], ['file-text', 'التقارير', 'reports']]
function ScreenC({ t, press }: { t: number; press?: [string, number][] }) {
  return <Screen>
    <Header />
    <div className="c-h" dir="rtl">إنشاء ناتج جديد</div>
    {TILES.map(([ic, l, k], i) => { const col = i % 2, row = Math.floor(i / 2); const pr = press?.find(p => p[0] === k)
      const d = pr ? Math.max(0, 1 - Math.abs(t - pr[1]) / .18) : 0, on = pr && t > pr[1]
      return <div key={k} className="c-tile" dir="rtl" style={{ right: col ? 555 : 45, top: 390 + row * 181, transform: `scale(${1 - .06 * d})`, background: on ? '#dff5e7' : undefined, outline: on ? `6px solid ${G}` : undefined }}>
        <Ico name={ic} size={62} color={on ? GT : '#444'} /><span>{l}</span></div> })}
    <Tabs on={2} />
  </Screen>
}
// tap ripple in scr space
function Tap({ t, at, x, y }: { t: number; at: number; x: number; y: number }) {
  const p = lin(t, at - .2, at + .5); if (p <= 0 || p >= 1) return null
  const r = mix(40, 150, eo(lin(t, at, at + .5)))
  return <div className="scr5 top"><div className="scr5__in"><div className="tap8" style={{ left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: t < at ? lin(t, at - .2, at) : 1 - lin(t, at, at + .5) }} /></div></div>
}

// ── stage ─────────────────────────────────────────────────────────────────────
const PX = 252, PY = 562, PS = 0.8
function PhoneAt({ t, children, dz = 1, dx = 0, dy = 0 }: { t: number; children: React.ReactNode; dz?: number; dx?: number; dy?: number }) {
  const br = Math.sin(t * 1.6) * .006, fl = Math.sin(t * 1.1) * 2
  return <div className="ph5" style={{ left: PX + dx, top: PY + dy + fl, transform: `translate(-50%,-50%) scale(${PS * dz * (1 + br)})` }}>
    <Phone width={380} frame="pro" time="9:41">{children}</Phone></div>
}
const HEAD: [number, number, string, Record<string, string>?][] = [
  [0.0, 2.3, 'عندك ملف PDF من شغلك؟', { PDF: 'r' }], [2.3, 4.95, 'وما عندكش وقت تقراه كامل؟', { 'كامل؟': 'r' }],
  [5.35, 6.5, 'هذي الأداة هي الحل', { 'الحل': 'g' }], [6.6, 9.8, 'اسمها Gemini_Notebook', {}], [9.85, 11.6, 'كانت معروفة باسم NotebookLM', {}],
  [11.65, 13.9, 'من قوقل… وببلاش', { 'وببلاش': 'g' }], [14.1, 16.75, 'تحط فيها ملفات وروابط', {}], [16.8, 19.4, 'ويوتيوب… لين ٥٠ مصدر', { '٥٠': 'g' }],
  [20.0, 21.1, 'تسألها أي سؤال', {}], [21.15, 22.95, 'تجاوبك من ملفك أنت بس', { 'ملفك': 'g' }], [23.0, 25.25, 'وتوريك من وين جابت الجواب', { 'وين': 'g' }],
  [25.35, 27.2, 'تبي ملخص؟ في ثواني', { 'ثواني': 'g' }], [27.3, 29.45, 'تبي تسمعه وأنت سايق؟', {}], [29.5, 30.7, 'تحوله لبودكاست', { 'لبودكاست': 'g' }],
  [30.78, 32.85, 'وتطلع منه خريطة ذهنية', { 'ذهنية': 'g' }], [32.9, 35.25, 'وأسئلة تختبر بيها روحك', { 'روحك': 'g' }], [35.4, 99, 'جربها على أول ملف عندك', { 'ملف': 'g' }]]
function Headline({ t }: { t: number }) {
  const h = HEAD.find(h => t >= h[0] - .05 && t < h[1]); if (!h) return null
  const [a, b, s, hl] = h, q = lin(t, b - .18, b)
  return <div className="hl8" dir="rtl" style={{ fontSize: s.length > 21 ? 28 : 33, whiteSpace: 'nowrap', opacity: 1 - q, filter: `blur(${q * 8}px)`, transform: `translateY(${-q * 12}px)` }}>
    {s.split(' ').map((w, i) => { const p = a < .1 ? 1 : eo(lin(t, a + i * .07, a + i * .07 + .35)); const c = hl?.[w]
      return <span key={i} dir={/^[A-Za-z]/.test(w) ? 'ltr' : undefined} style={{ opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * 14}px)`, color: c === 'r' ? RED : c === 'g' ? GT : undefined }}>{w.replace('_', ' ')}</span> })}
  </div>
}
function Step({ t }: { t: number }) {
  const S: [number, number, number, string][] = [[T.ask, T.sum, 1, 'اسألها'], [T.sum, T.pod, 2, 'ملخص'], [T.pod, T.map, 3, 'بودكاست'], [T.map, T.end, 4, 'خريطة وأسئلة']]
  const s = S.find(s => t >= s[0] && t < s[1]); if (!s) return null
  const p = spring(t, s[0], .5)
  return <div className="step8" dir="rtl"><div className="dots">{[1, 2, 3, 4].map(k => <i key={k} className={k < s[2] ? 'done' : k === s[2] ? 'on' : ''} />)}</div>
    <b style={{ transform: `scale(${.6 + .4 * p})` }}>{AR(s[2])}</b></div>
}
// a card that comes OUT of the phone (scales from the phone's centre point)
function Out({ t, at, out = 1e9, x, y, w, children, from = [PX, PY] }: { t: number; at: number; out?: number; x: number; y: number; w: number; children: React.ReactNode; from?: [number, number] }) {
  const s = spring(t, at, .6), e = eo(lin(t, at, at + .45)), q = lin(t, out, out + .2)
  if (t < at || q >= 1) return null
  const cx = mix(from[0], x, e), cy = mix(from[1], y, e)
  return <div className="out8" dir="rtl" style={{ left: cx, top: cy, width: w, opacity: clamp(e * 3) * (1 - q), transform: `translate(-50%,-50%) scale(${(.3 + .7 * s) * (1 - .1 * q)})` }}>{children}</div>
}
const Chip = ({ children, g }: { children: React.ReactNode; g?: boolean }) => <div className={'chip8' + (g ? ' g' : '')} dir="rtl">{children}</div>
function Fly({ t, at, x0, y0, children }: { t: number; at: number; x0: number; y0: number; children: React.ReactNode }) {
  const p = eio(lin(t, at, at + .55)); if (p <= 0 || p >= 1) return null
  return <div className="out8 fly" style={{ left: mix(x0, PX, p), top: mix(y0, PY - 40, p), opacity: 1 - lin(p, .8, 1), transform: `translate(-50%,-50%) scale(${mix(1, .25, p)}) rotate(${mix(-8, 0, p)}deg)` }}>{children}</div>
}

const MSG_ASK: Msg[] = [
  { me: true, at: 20.25, h: 190, body: <span>شن أهم نتيجة في التقرير؟</span> },
  { at: 21.35, h: 520, body: <span>أهم نتيجة إن المبيعات زادت <b className="mk">١٨٪ في الربع الثاني</b> <Cite n={1} on />، والسبب الأساسي نظام الطلبات الجديد <Cite n={2} />.</span> },
  { me: true, at: 25.45, h: 190, body: <span>لخّصلي محاضرة اليوتيوب</span> },
  { at: 26.0, h: 560, body: <div className="sum8">{['الفكرة الأساسية في أول ١٠ دقايق', 'ثلاث أمثلة عملية من السوق', 'الخلاصة: ابدأ صغير وقيس'].map((x, i) => <div key={i}><b>{AR(i + 1)}</b>{x}</div>)}</div> },
]

function Scene({ t }: { t: number }) {
  // camera: one stage, small pushes only
  let z = 1, cx = 0, cy = 0
  if (t < T.sol) { z = mix(1.05, 1.0, eo(lin(t, 0, 1.2))); cy = mix(-10, 0, eo(lin(t, 0, 1.2))) }
  if (t >= 22.6 && t < T.sum) { const p = eio(lin(t, 22.6, 23.2)) * (1 - eio(lin(t, 24.9, 25.3))); z = 1 + .18 * p; cx = 40 * p; cy = 30 * p }
  const endP = eio(lin(t, T.end, T.end + .6))
  const solR = lin(t, 5.15, 5.75) // circular reveal into the app
  let screen: React.ReactNode
  if (t < T.name - .05) screen = <><ScreenPDF t={t} />{solR > 0 && <div className="reveal8" style={{ clipPath: `circle(${eo(solR) * 75}% at 50% 50%)` }}><ScreenA /></div>}</>
  else if (t < T.src) screen = <ScreenA />
  else if (t < T.ask) screen = <ScreenSrc t={t} />
  else if (t < T.pod) screen = <><ScreenChat t={t} msgs={MSG_ASK} /><Tap t={t} at={23.15} x={560} y={760} /></>
  else if (t < T.map) screen = <><ScreenC t={t} press={[['audio', 28.0]]} /><Tap t={t} at={28.0} x={795} y={466} /></>
  else screen = <><ScreenC t={t} press={[['quiz', 32.9]]} /><Tap t={t} at={32.9} x={795} y={828} /></>
  // rings around the phone while the podcast plays
  const rings = t > 28.3 && t < T.map ? [0, 1, 2].map(i => { const ph = ((t - 28.3) * .7 + i / 3) % 1
    return <div key={i} className="ring8" style={{ width: 300 + ph * 420, height: 300 + ph * 420, opacity: (1 - ph) * .5 }} /> }) : null
  return <div className="cam8" style={{ transform: `translate(${cx}px,${cy}px) scale(${z})`, transformOrigin: `${PX}px ${PY}px` }}>
    {rings}
    <div style={{ opacity: 1 - endP, transform: `translateY(${endP * 260}px)` }}><PhoneAt t={t}>{screen}</PhoneAt></div>
    {/* hook: red page pill on the phone's corner */}
    {t < T.sol && <Out t={t} at={1.4} out={4.9} x={418} y={300} w={120}><Chip><Ico name="clock" size={20} color={RED} /><span>ساعات</span></Chip></Out>}
    {t < T.sol && <Out t={t} at={2.45} out={4.9} x={88} y={330} w={140} from={[PX - 60, PY]}><div className="file8" style={{ transform: 'rotate(-7deg)' }}><Logo k="word" h={34} /><span>عقد_العمل.docx</span><small>٤٨ صفحة</small></div></Out>}
    {t < T.sol && <Out t={t} at={2.85} out={4.9} x={430} y={450} w={140} from={[PX + 60, PY]}><div className="file8" style={{ transform: 'rotate(6deg)' }}><Logo k="sheets" h={34} /><span>جدول المبيعات</span><small>١٢ ورقة</small></div></Out>}
    {t < T.sol && <Out t={t} at={3.25} out={4.9} x={92} y={560} w={150} from={[PX - 60, PY + 40]}><div className="file8" style={{ transform: 'rotate(4deg)' }}><Logo k="yt" h={26} /><span>محاضرة يوتيوب</span><small>ساعة ونص</small></div></Out>}
    {/* name */}
    <Out t={t} at={6.7} out={13.8} x={252} y={238} w={340}><div className="name8" dir="ltr"><NbLogo h={34} id="nbN" /><b>Gemini Notebook</b></div></Out>
    <Out t={t} at={9.95} out={13.8} x={100} y={400} w={170}><Chip><span>كانت</span><span className="lat">NotebookLM</span></Chip></Out>
    <Out t={t} at={11.75} out={13.8} x={420} y={470} w={130}><Chip><Logo k="goo" h={20} /><span>من قوقل</span></Chip></Out>
    <Out t={t} at={12.9} out={13.8} x={425} y={660} w={110}><Chip g><span>ببلاش</span></Chip></Out>
    {/* sources fly in */}
    <Fly t={t} at={14.1} x0={-40} y0={300}><Chip><Logo k="pdf" h={22} /><span>PDF</span></Chip></Fly>
    <Fly t={t} at={14.8} x0={560} y0={330}><Chip><Logo k="word" h={22} /><span>Word</span></Chip></Fly>
    <Fly t={t} at={15.5} x0={-40} y0={440}><Chip><Logo k="sheets" h={22} /><span>جداول</span></Chip></Fly>
    <Fly t={t} at={16.1} x0={560} y0={470}><Chip><Ico name="link" size={20} color="#3f7ee8" /><span>رابط</span></Chip></Fly>
    <Fly t={t} at={16.7} x0={-40} y0={580}><Chip><Logo k="yt" h={18} /><span>يوتيوب</span></Chip></Fly>
    <Fly t={t} at={17.6} x0={560} y0={600}><Chip><Ico name="mic" size={20} color="#8b5cf6" /><span>صوت</span></Chip></Fly>
    <Out t={t} at={18.3} out={19.3} x={420} y={300} w={120}><div className="big8"><b>{AR(Math.round(mix(4, 50, eo(lin(t, 18.3, 19.1)))))}</b><span>مصدر</span></div></Out>
    {/* the cited page comes out of the phone */}
    <Out t={t} at={23.3} out={25.15} x={150} y={330} w={240} from={[PX + 40, PY + 10]}><div className="page8">
      <div className="pg-h"><span className="lat">p.47</span><Cite n={1} on /></div>
      <p>…وخلال الربع الثاني <span className="mk">ارتفعت المبيعات بنسبة ١٨٪</span> مقارنة بالربع الأول…</p></div></Out>
    {/* the youtube lecture being summarised */}
    <Out t={t} at={25.5} out={27.1} x={130} y={330} w={210} from={[PX, PY]}><div className="yt8"><div className="thumb"><span className="pl"><Logo k="yt" h={30} /></span><i>١:٣٠:٠٠</i></div><b>محاضرة على يوتيوب</b></div></Out>
    {/* podcast player */}
    <Out t={t} at={28.35} out={30.6} x={252} y={300} w={330} from={[PX + 50, PY - 70]}><div className="pod8">
      <div className="pod8__r"><div className="hosts"><i /><i className="b" /></div><div><b>بودكاست: تقرير المشروع</b><small>صوتين يتناقشوا</small></div></div>
      <div className="wave8">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ height: 6 + Math.abs(Math.sin(t * 7 + i * .7) * Math.sin(i * 1.3 + t)) * 30 }} />)}</div></div></Out>
    <Out t={t} at={29.0} out={30.6} x={420} y={600} w={140}><Chip><Ico name="car" size={20} color={GT} /><span>وأنت سايق</span></Chip></Out>
    {/* mind map + quiz */}
    <Out t={t} at={30.9} out={32.75} x={252} y={330} w={400} from={[PX, PY]}><MindMap t={t - 31.1} /></Out>
    <Out t={t} at={33.15} out={35.2} x={252} y={300} w={330} from={[PX + 50, PY + 30]}><div className="quiz8">
      <div className="qh"><span>سؤال ٣ من ١٠</span></div><div className="qq">المبيعات زادت أكثر في الربع…</div>
      {['الأول', 'الثاني', 'الثالث'].map((o, i) => <div key={i} className={'qo8' + (i === 1 && t > 34.2 ? ' ok' : '')}>{o}{i === 1 && t > 34.2 && <Ico name="check" size={18} color={GT} />}</div>)}</div></Out>
  </div>
}
function MindMap({ t }: { t: number }) {
  const N: [number, number, string, number][] = [[200, 150, 'التقرير', 0], [70, 70, 'المبيعات', 1], [330, 70, 'التوريد', 1], [70, 230, 'التكلفة', 1], [330, 230, 'التوصيات', 1]]
  return <svg className="map8" viewBox="-30 0 460 300">
    {N.slice(1).map((n, i) => { const p = eo(lin(t, .1 + i * .18, .5 + i * .18)); return <line key={i} x1={200} y1={150} x2={mix(200, n[0], p)} y2={mix(150, n[1], p)} stroke={G} strokeWidth={4} strokeLinecap="round" /> })}
    {N.map((n, i) => { const s = spring(t, i ? .3 + (i - 1) * .18 : 0, .5); const w = n[2].length * 13 + 34
      return <g key={i} transform={`translate(${n[0]},${n[1]}) scale(${s})`}><rect x={-w / 2} y={-22} width={w} height={44} rx={22} fill={n[3] ? '#fff' : '#111'} stroke="#111" strokeWidth={2.5} />
        <text textAnchor="middle" y={7} fontFamily="Alexandria" fontWeight={700} fontSize={17} fill={n[3] ? '#111' : '#fff'}>{n[2]}</text></g> })}
  </svg>
}
function End({ t }: { t: number }) {
  const a = T.end + .3
  return <>
    <Out t={t} at={a} x={252} y={420} w={360} from={[252, 560]}><div className="name8 big" dir="ltr"><NbLogo h={44} id="nbE" /><b>Gemini Notebook</b></div></Out>
    <Out t={t} at={a + 1.0} x={252} y={560} w={300} from={[252, 640]}><div className="sign8" dir="ltr"><span className="tq"><img src="src/taqni.svg" /></span><span className="tt"><Logo k="tt" h={30} /></span><b>@teqani.ly</b></div></Out>
  </>
}

export default function App({ t }: { t: number }) {
  // match-cut flashes on the pushes between app screens
  const cut = [T.src, T.ask, T.pod, T.map].map(c => lin(t, c - .12, c + .12)).find(p => p > 0 && p < 1) || 0
  return <div className="stage8 ss-stage" data-theme="light" style={{ ['--ss-accent' as any]: G }}>
    <div className="bg8" /><div className="glow8" />
    <Scene t={t} />
    {t >= T.end && <End t={t} />}
    <Headline t={t} /><Step t={t} />
    {cut > 0 && <div className="cut8" style={{ opacity: Math.sin(cut * Math.PI) * .6 }} />}
    <div className="grain8" /><div className="vig8" />
    <div className="bug8"><img src="src/taqni.svg" /><span>@teqani.ly</span></div>
  </div>
}
