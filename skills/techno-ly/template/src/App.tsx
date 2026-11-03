import React, { useLayoutEffect, useRef, useState } from 'react'
import { Window } from '../kit/window'
import { Phone } from '../kit/phone'
import { MacPointer } from '../kit/cursors'
import { Ico, Logo, BlurText, Pop } from './ui'
import { Counter, Decrypted, Sparks, StarBorder } from './rb'
import { lin, eo, eio, spring, clamp, mix, life } from './anim'

// Placeholder timeline (s) — retimed to the voice-over once it is recorded.
// Absolute voice times (s), from silencedetect on the voice-over; T is relative to the end of the recap (R).
export const R = 8.4
const A = (x: number) => x - R
export const T = {
  w: [8.65, 9.3, 10.75, 11.75, 12.4, 13.66].map(A), collapse: A(14.0),
  name: A(14.6), oldCard: A(16.57), rename: A(18.42), chip1: A(20.55), chip2: A(22.53),
  app: A(24.4), url: [A(25.45), A(26.1)], home: A(26.5), create: A(28.25), nb: A(28.6), modal: A(29.6),
  types: [32.5, 33.72, 34.84, 36.52].map(A), fifty: A(40.0),
  drag: [A(42.6), A(43.6)], up: [A(43.6), A(44.8)], close: A(45.0), src: A(45.1), sum: [A(45.4), A(47.2)], chips: A(47.6),
  ask: A(50.5), q: [A(51.6), A(53.6)], send: A(53.8), think: A(53.9), ans: [A(54.5), A(57.0)], notNet: A(56.1), cite: A(57.1), pop: A(58.96), citeOff: A(63.6),
  studio: A(64.8), audio: A(65.6), gen: [A(65.8), A(66.9)], player: A(66.9), play: A(67.3), tools: [72.9, 75.0, 76.2].map(A), same: A(77.24), appEnd: A(78.6),
  cta: A(78.6), next: A(81.0), you: A(83.4), typeC: [A(86.0), A(87.2)], sendC: A(87.3), vid: A(87.4), follow: A(89.7), tt: A(90.8), end: A(93.0),
}
export const END = T.end + R
const GREEN = '#22c55e', INK = '#111', GBLUE = '#4285f4'
const typed = (t: number, a: number, b: number, s: string) => s.slice(0, Math.round(lin(t, a, b) * s.length))

function Mark({ size, t, at, blinkAt = [] as number[] }: { size: number; t: number; at: number; blinkAt?: number[] }) {
  const d1 = spring(t, at, 0.6), d2 = spring(t, at + 0.1, 0.6), bowl = eo(lin(t, at + 0.2, at + 0.6))
  const bl = blinkAt.reduce((m, b) => Math.max(m, Math.sin(clamp((t - b) / 0.22) * Math.PI)), 0)
  return (
    <svg viewBox="200 250 680 560" width={size} height={size * 560 / 680} style={{ display: 'block', overflow: 'visible' }}>
      <g transform="translate(0 45)">
        <path d="M300 470 C300 700 780 700 780 440" fill="none" stroke={INK} strokeWidth="118" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - bowl} opacity={bowl > 0 ? 1 : 0} />
        <rect x="400" y={300 - (1 - d1) * 420} width="112" height="112" rx="22" fill={INK} opacity={clamp(d1 * 3)} />
        <rect x="568" y={300 - (1 - d2) * 420 + bl * 50} width="112" height={112 * (1 - bl * 0.9)} rx="22" fill={GREEN} opacity={clamp(d2 * 3)} />
      </g>
    </svg>
  )
}


// ---------- 0. recap: frames from the previous "3 tools" video ----------
function Recap({ t }: { t: number }) {
  const local = t
  const fi = local < 3.8 ? Math.min(140, Math.floor(local * 15) * 2) : Math.min(1340, 1240 + Math.floor((local - 3.8) * 15) * 2)
  const src = `public/prev/f${String(fi).padStart(5, '0')}.jpg`
  const p = spring(t, 0.05, 0.8)
  return (
    <>
      <Pop t={t} at={0.15} from={0.5} className="abs center" style={{ top: 62 }}><div className="prevpill"><Ico name="play" look="fill" size={18} color="#fff" />من الفيديو اللي فات</div></Pop>
      <div className="abs center" style={{ top: 130, transform: `translateY(${(1 - p) * 500}px) rotate(${(1 - p) * -8}deg)` }}>
        <Phone width={250} frame="silver"><img className="prevvid" src={src} />
          <div className="ttside">{['heart', 'message-circle', 'send'].map((ic) => <span key={ic}><Ico name={ic} look="fill" size={22} color="#fff" /></span>)}</div>
        </Phone>
      </div>
      <BlurText t={t} at={3.9} text="وعدناكم بشرح كامل لكل أداة" hl={['كامل']} className="h2" style={{ top: 690 }} />
      <BlurText t={t} at={0.3} text="عرضنالكم ثلاث أدوات" className="h3" style={{ top: 690, opacity: 1 - lin(t, 3.7, 3.9) }} />
      <Pop t={t} at={6.95} from={0.5} className="abs center" style={{ top: 770 }}><div className="todaychip"><span>اليوم: الأداة الأولى</span><Logo k="nblm" h={30} /></div></Pop>
    </>
  )
}

// ---------- 1. kinetic hook: one word at a time, each with an icon ----------
const WORDS = [['upload', 'ارفع'], ['file-text', 'محاضرتك'], ['message-circle', 'واسألها'], ['sparkles', 'تجاوبك'], ['book-open', 'من الملف'], ['quote', 'بالمصدر']] as const
function Hook({ t }: { t: number }) {
  const col = eio(lin(t, T.collapse, T.collapse + 0.6))
  const cur = WORDS.reduce((k, _, i) => (t >= T.w[i] ? i : k), -1)
  return (
    <>
      {cur >= 0 && col < 1 && (() => {
        const i = cur, p = spring(t, T.w[i], 0.55), out = i < WORDS.length - 1 ? lin(t, T.w[i + 1] - 0.12, T.w[i + 1]) : col
        return (
          <div className="kw" style={{ opacity: clamp(p * 2) * (1 - out), transform: `translateY(${(1 - p) * 60 - out * 60}px) scale(${0.7 + 0.3 * p})` }}>
            <span className="kw__i" style={{ transform: `rotate(${(1 - p) * -25}deg) scale(${p})` }}><Ico name={WORDS[i][0]} look="duotone" size={96} color={GREEN} /></span>
            <b>{WORDS[i][1]}</b>
          </div>
        )
      })()}
      <div className="kwrow" dir="rtl" style={{ opacity: col }}>
        {WORDS.map(([ic, w], i) => <span key={w} className="kwrow__c" style={{ transform: `translateY(${(1 - spring(t, T.collapse + i * 0.06, 0.6)) * 40}px)` }}><Ico name={ic} size={26} color={GREEN} />{w}</span>)}
      </div>
      <div className="ticks" style={{ opacity: 1 - col }}>{WORDS.map((_, i) => <i key={i} data-on={i <= cur || undefined} />)}</div>
    </>
  )
}

// ---------- 2. same tool, new name ----------
function Name({ t }: { t: number }) {
  const r = eio(lin(t, T.rename, T.rename + 0.6))
  return (
    <>
      <BlurText t={t} at={T.name + 0.1} text="أداة من قوقل" className="h2" style={{ top: 120 }} />
      <div className="namecard" style={{ transform: `translate(-50%,0) scale(${spring(t, T.oldCard, 0.7)}) rotateY(${r * 180}deg)` }}>
        <div className="namecard__f" style={{ opacity: r < 0.5 ? 1 : 0 }}><Logo k="nblm" h={90} /><Decrypted t={t} at={T.oldCard} text="NotebookLM" className="nm" /><small>الاسم القديم</small></div>
        <div className="namecard__f back" style={{ opacity: r >= 0.5 ? 1 : 0 }}><Logo k="gemini" h={90} /><Decrypted t={t} at={T.rename + 0.3} text="Gemini Notebook" className="nm" /><small>الاسم الجديد</small></div>
      </div>
      {t > T.rename + 0.5 && <Sparks t={t} at={T.rename + 0.3} x={270} y={420} count={12} radius={170} size={20} color={GBLUE} />}
      <div className="namechips" dir="rtl">
        <Pop t={t} at={T.chip1} from={0.5}><span className="nchip"><Ico name="check" size={22} color={GREEN} />نفس الأداة</span></Pop>
        <Pop t={t} at={T.chip2} from={0.5}><span className="nchip"><Ico name="globe" size={22} color={GREEN} />مجانية بحساب قوقل</span></Pop>
      </div>
    </>
  )
}

// ---------- 3. the app (rebuilt from the documented three-panel layout) ----------
const PW = 820
const SUM = 'المحاضرة تشرح كيف الخلايا الشمسية تحوّل ضوء الشمس لكهرباء، وشن العوامل اللي تأثر على كفاءتها، والفرق بين أنواع الألواح.'
const Q = 'شن أهم ثلاث أفكار في المحاضرة؟'
const ANS = [
  ['الخلية الشمسية تحوّل الضوء لكهرباء مباشرة بالتأثير الكهروضوئي.', 1],
  ['الكفاءة تتأثر بزاوية اللوح، والحرارة، والغبار على السطح.', 2],
  ['الألواح أحادية البلورة كفاءتها أعلى من متعددة البلورات.', 3],
] as const
type R = { x: number; y: number; w: number; h: number }
type Cam = { t: number; tg?: string; z: number; cut?: boolean }
const CAM: Cam[] = [
  { t: T.app, z: 1, cut: true }, { t: T.nb, z: 1, cut: true }, { t: T.modal + 0.1, tg: 'modal', z: 1.25 },
  { t: T.close, tg: 'srcrow', z: 1.7 }, { t: T.sum[0], tg: 'guide', z: 1.45 }, { t: T.ask, tg: 'input', z: 1.6 }, { t: T.send + 0.4, tg: 'convo', z: 1.4 },
  { t: T.pop, tg: 'pop', z: 1.5 }, { t: T.citeOff, tg: 'convo', z: 1.3 }, { t: T.studio, tg: 'tiles', z: 1.7 }, { t: T.player, tg: 'aov', z: 1.9 }, { t: T.tools[0] - 0.2, tg: 'tiles', z: 1.7 },
]
const CUR: { t: number; tg: string; click?: boolean }[] = [
  { t: T.create, tg: 'create', click: true }, { t: T.drag[1], tg: 'drop' }, { t: T.ask, tg: 'input', click: true }, { t: T.send, tg: 'send', click: true },
  { t: T.pop, tg: 'cite2', click: true }, { t: T.audio, tg: 'aovtile', click: true }, { t: T.play, tg: 'playbtn', click: true },
]
const FOCUS = [
  { a: T.modal + 0.3, b: T.modal + 2.6, tg: 'drop', label: 'هني تحط مصادرك' }, { a: T.drag[0] - 0.4, b: T.drag[1], tg: 'drop', label: 'ارفع الملف هني' },
  { a: T.src, b: T.sum[0] + 0.2, tg: 'srcrow', label: 'الملف وصل' },
  { a: T.pop + 0.2, b: T.citeOff, tg: 'pop', label: 'الجملة من نفس المحاضرة' },
  { a: T.studio + 0.2, b: T.audio + 0.1, tg: 'aovtile', label: 'Audio Overview' },
]

function Home({ t }: { t: number }) {
  return (
    <div className="nh">
      <div className="nh__bar"><Logo k="gemini" h={30} /><b>Gemini Notebook</b><span className="nh__av">م</span></div>
      <h2>Welcome</h2>
      <div className="nh__grid">
        <div className="nh__new" data-target="create" style={{ transform: `scale(${t > T.create && t < T.create + 0.15 ? 0.96 : 1})` }}><span><Ico name="plus" size={40} color={GBLUE} /></span>Create new notebook</div>
        {['📘', '🧪', '📊'].map((e, i) => <div key={i} className="nh__nb"><i>{e}</i><b>{['Research notes', 'Chemistry 101', 'Q3 report'][i]}</b><small>{3 - i} sources</small></div>)}
      </div>
    </div>
  )
}

function Notebook({ t }: { t: number }) {
  const has = t >= T.src
  const sum = typed(t, T.sum[0], T.sum[1], SUM)
  const q = typed(t, T.q[0], T.q[1], Q)
  const sent = t >= T.send
  const think = t >= T.think && t < T.ans[0]
  const ansN = ANS.reduce((n, a, i) => n + (t >= T.ans[0] + i * ((T.ans[1] - T.ans[0]) / 3) ? 1 : 0), 0)
  const pop = t >= T.pop && t < T.citeOff
  const gen = t >= T.audio && t < T.player
  const player = t >= T.player
  const play = t >= T.play
  return (
    <div className="nb">
      <div className="nb__bar"><Logo k="gemini" h={28} /><b>{has && t > T.src + 0.3 ? <Decrypted t={t} at={T.src + 0.3} text="أساسيات الطاقة الشمسية" dur={0.6} /> : 'Untitled notebook'}</b><span style={{ flex: 1 }} /><span className="nb__btn"><Ico name="user-plus" size={16} />Share</span><span className="nh__av">م</span></div>
      <div className="nb__cols">
        <section className="pnl" data-target="sources">
          <div className="pnl__h">Sources</div>
          <div className="pnl__btns"><span className="nb__add"><Ico name="plus" size={18} />Add sources</span><span className="nb__disc"><Ico name="search" size={16} />Discover</span></div>
          {has ? (
            <div className="srcrow" data-target="srcrow" style={{ opacity: clamp(lin(t, T.src, T.src + 0.3)), transform: `translateX(${(1 - eo(lin(t, T.src, T.src + 0.4))) * 40}px)` }}>
              <span className="pdfi">PDF</span><b>محاضرة-الطاقة-الشمسية.pdf</b><span className="chk on"><Ico name="check" size={14} color="#fff" /></span>
            </div>
          ) : <p className="pnl__empty">Saved sources will appear here</p>}
        </section>
        <section className="pnl chat" data-target="chat">
          <div className="pnl__h">Chat</div>
          {!has && <div className="chat__empty"><span><Ico name="upload" size={34} color={GBLUE} /></span><b>Add a source to get started</b></div>}
          {has && (
            <div className="chat__body" dir="rtl">
              <div className="guide" data-target="guide"><Ico name="book-open" size={20} color={GBLUE} /><span>{sum}{t < T.sum[1] && t > T.sum[0] && <i className="caret" />}</span><small>1 source</small></div>
              {t >= T.chips && !sent && <div className="sugg">{['شن أهم الأفكار؟', 'لخّصلي المحاضرة', 'اشرحلي التأثير الكهروضوئي'].map((s, i) => <Pop key={s} t={t} at={T.chips + i * 0.12} from={0.6}><span>{s}</span></Pop>)}</div>}
              <div className="convo" data-target="convo">
              {sent && <div className="mq" style={{ opacity: clamp(lin(t, T.send, T.send + 0.2)) }}>{Q}</div>}
              {think && <div className="dots3"><i /><i /><i /></div>}
              {ansN > 0 && (
                <div className="ma">
                  {ANS.slice(0, ansN).map(([s, n], i) => (
                    <p key={i} style={{ opacity: clamp(lin(t, T.ans[0] + i * 1.66, T.ans[0] + i * 1.66 + 0.4)) }}><b className="num">{i + 1}.</b> {s} <span className="cite" data-target={n === 2 ? 'cite2' : undefined} data-hot={(t >= T.cite && t < T.citeOff && n === 2) || undefined}>{n}</span></p>
                  ))}
                </div>
              )}
              {pop && (
                <div className="cpop" data-target="pop" style={{ opacity: clamp(lin(t, T.pop, T.pop + 0.2)), transform: `translateY(${(1 - eo(lin(t, T.pop, T.pop + 0.3))) * 12}px)` }}>
                  <div className="cpop__h"><span className="pdfi sm">PDF</span>محاضرة-الطاقة-الشمسية.pdf · صفحة 4</div>
                  <p>… وتنخفض كفاءة اللوح كل ما زادت حرارته، <mark style={{ backgroundSize: `${eo(lin(t, T.pop + 0.6, T.pop + 1.6)) * 100}% 100%` }}>وتراكم الغبار على السطح يقلل كمية الضوء الواصلة للخلايا</mark>، لذلك ينصح بتنظيف الألواح بشكل دوري …</p>
                </div>
              )}
              </div>
            </div>
          )}
          <div className="chat__in" data-target="input" data-focus={(t > T.ask && t < T.send) || undefined}>
            <span dir="rtl">{sent ? '' : q}{t > T.ask && t < T.send && <i className="caret" />}{!q && !sent && <em>Start typing...</em>}</span>
            <span className="chat__send" data-target="send" style={{ background: q && !sent ? GBLUE : '#e8eaed', transform: `scale(${t > T.send && t < T.send + 0.15 ? 0.9 : 1})` }}><Ico name="send" size={18} color={q && !sent ? '#fff' : '#9aa0a6'} /></span>
          </div>
        </section>
        <section className="pnl" data-target="studio">
          <div className="pnl__h">Studio</div>
          <div className="tiles" data-target="tiles">
            {[['headphones', 'Audio Overview'], ['play', 'Video Overview'], ['layers', 'Mind Map'], ['file-text', 'Reports'], ['copy', 'Flashcards'], ['list-checks', 'Quiz']].map(([ic, n], i) => (
              <div key={n} className="tile2" data-target={i === 0 ? 'aovtile' : undefined} data-on={(i === 0 && t >= T.audio && t < T.tools[0]) || (i === 2 && t >= T.tools[0]) || (i === 4 && t >= T.tools[1]) || (i === 5 && t >= T.tools[2]) || undefined} style={{ transform: `scale(${i === 0 && t > T.audio && t < T.audio + 0.15 ? 0.95 : 1})` }}><Ico name={ic} size={20} color={i === 0 ? GBLUE : '#5f6368'} />{n}</div>
            ))}
          </div>
          {gen && <div className="gen"><span className="spin2" />Generating Audio Overview…</div>}
          {player && (
            <div className="aov2" data-target="aov" style={{ opacity: clamp(lin(t, T.player, T.player + 0.3)) }}>
              <b>Audio Overview</b><small>أساسيات الطاقة الشمسية · مذيعين</small>
              <div className="aov2__w">{Array.from({ length: 26 }).map((_, i) => <i key={i} style={{ height: `${play ? 15 + 80 * Math.abs(Math.sin(t * 7 + i * 0.7) * Math.cos(t * 3 + i * 0.4)) : 15}%` }} />)}</div>
              <div className="aov2__c"><span className="aov2__p" data-target="playbtn"><Ico name={play ? 'pause' : 'play'} look="fill" size={22} color="#fff" /></span><div className="aov2__bar"><i style={{ width: `${lin(t, T.play, T.appEnd) * 100}%` }} /></div></div>
            </div>
          )}
        </section>
      </div>
      {/* add-sources modal */}
      {t >= T.modal && t < T.close + 0.3 && (() => {
        const o = Math.min(eo(lin(t, T.modal, T.modal + 0.3)), 1 - lin(t, T.close, T.close + 0.3))
        const prog = lin(t, T.up[0], T.up[1])
        return (
          <>
            <div className="scrim3" style={{ opacity: o * 0.35 }} />
            <div className="modal" data-target="modal" style={{ opacity: o, transform: `translate(-50%,-50%) scale(${0.96 + 0.04 * o})` }}>
              <div className="modal__h"><b>Add sources</b><Ico name="x" size={22} /></div>
              <div className="drop" data-target="drop" data-hot={(t > T.drag[1] - 0.3 && t < T.up[0]) || undefined}>
                {t < T.up[0] ? <><span><Ico name="upload" size={36} color={GBLUE} /></span><b>Upload sources</b><small>Drag & drop or choose file to upload</small><em>PDF · .txt · Markdown · Audio</em></> : (
                  <div className="upl" dir="rtl"><span className="pdfi">PDF</span><div><b>محاضرة-الطاقة-الشمسية.pdf</b><div className="upl__bar"><i style={{ width: `${prog * 100}%` }} /></div></div>{prog >= 1 && <Ico name="circle-check" look="fill" size={26} color={GREEN} />}</div>
                )}
              </div>
              <div className="modal__opts">{[['folder', 'Google Drive'], ['link', 'Link'], ['copy', 'Paste text']].map(([ic, n]) => <span key={n}><Ico name={ic} size={18} />{n}</span>)}</div>
            </div>
          </>
        )
      })()}
    </div>
  )
}

function App3({ t }: { t: number }) {
  const vpRef = useRef<HTMLDivElement>(null), pageRef = useRef<HTMLDivElement>(null)
  const tries = useRef({ t: -1, n: 0 })
  const [m, setM] = useState<{ key: string; vw: number; vh: number; rects: Record<string, R> }>({ key: '', vw: 512, vh: 600, rects: {} })
  const vw = m.vw, vh = m.vh, s0 = vw / PW, PH = vh / s0
  const center = (k: Cam) => {
    const r = k.tg ? m.rects[k.tg] : undefined, S = s0 * k.z, hw = vw / 2 / S, hh = vh / 2 / S
    return { cx: clamp(r ? r.x + r.w / 2 : PW / 2, hw, PW - hw), cy: clamp(r ? r.y + r.h / 2 : PH / 2, hh, PH - hh), z: k.z }
  }
  let i = CAM.length - 1; while (i > 0 && CAM[i].t > t) i--
  const k = CAM[i], c = center(k), q = center(CAM[Math.max(0, i - 1)]), p = k.cut || i === 0 ? 1 : eio(lin(t, k.t, k.t + 0.8))
  const cam = { cx: mix(q.cx, c.cx, p), cy: mix(q.cy, c.cy, p), z: mix(q.z, c.z, p) }
  const S = s0 * cam.z
  const V = (x: number, y: number) => ({ x: vw / 2 + (x - cam.cx) * S, y: vh / 2 + (y - cam.cy) * S })
  useLayoutEffect(() => {
    const vp = vpRef.current, pe = pageRef.current; if (!vp || !pe) return
    const pr = pe.getBoundingClientRect(), sc = pr.width / PW, rects: Record<string, R> = {}
    pe.querySelectorAll<HTMLElement>('[data-target]').forEach((el) => { const r = el.getBoundingClientRect(); rects[el.dataset.target!] = { x: (r.left - pr.left) / sc, y: (r.top - pr.top) / sc, w: r.width / sc, h: r.height / sc } })
    const key = JSON.stringify(Object.fromEntries(Object.entries(rects).map(([kk, r]) => [kk, [r.x, r.y, r.w, r.h].map(Math.round)])))
    if (tries.current.t !== t) tries.current = { t, n: 0 }
    if ((key !== m.key || vp.clientWidth !== m.vw || vp.clientHeight !== m.vh) && tries.current.n++ < 3) setM({ key, vw: vp.clientWidth, vh: vp.clientHeight, rects })
  })
  const f = FOCUS.find((x) => t >= x.a && t < x.b), fr0 = f && m.rects[f.tg]
  const fr = fr0 ? (() => { const a = V(fr0.x - 8, fr0.y - 8); return { x: a.x, y: a.y, w: (fr0.w + 16) * S, h: (fr0.h + 16) * S } })() : null
  const veil = f ? Math.min(lin(t, f.a, f.a + 0.2), 1 - lin(t, f.b - 0.12, f.b)) : 0, ins = f ? spring(t, f.a + 0.12, 0.6) : 0, bp = f ? lin(t, f.a, f.a + 0.42) : 1
  // cursor
  let cur: { x: number; y: number; click: number } | null = null
  if (t >= T.home + 0.2 && t < T.appEnd) {
    let j = 0; while (j < CUR.length - 1 && CUR[j + 1].t - 0.7 <= t) j++
    const pos = (tg: string) => { const r = m.rects[tg]; return r ? V(r.x + r.w * 0.5, r.y + r.h * 0.55) : { x: vw * 0.8, y: vh * 0.85 } }
    const kk = CUR[j], b = pos(kk.tg), a = j > 0 ? pos(CUR[j - 1].tg) : { x: vw + 30, y: vh }, e = eio(lin(t, kk.t - 0.7, kk.t))
    const lc = [...CUR].reverse().find((x) => x.click && x.t <= t)
    cur = { x: mix(a.x, b.x, e), y: mix(a.y, b.y, e), click: lc ? (t - lc.t) / 0.45 : 9 }
  }
  // dragged PDF (in viewport coords) flying into the drop zone
  const dp = lin(t, T.drag[0], T.drag[1])
  const drop = m.rects['drop'] ? V(m.rects['drop'].x + m.rects['drop'].w / 2, m.rects['drop'].y + m.rects['drop'].h / 2) : { x: vw / 2, y: vh / 2 }
  const url = typed(t, T.url[0], T.url[1], 'notebooklm.google')
  return (
    <Window url={t < T.url[1] + 0.1 ? url || ' ' : 'notebooklm.google'} nav className="nwin__w">
      <div className="nvp" ref={vpRef}>
        <div className="npage" ref={pageRef} style={{ height: PH, transform: `translate(${vw / 2 - cam.cx * S}px, ${vh / 2 - cam.cy * S}px) scale(${S})` }}>
          {t < T.home && <div className="nblank"><span className="spin2" /></div>}
          {t >= T.home && t < T.nb && <Home t={t} />}
          {t >= T.nb && <Notebook t={t} />}
        </div>
        {fr && veil > 0 && (
          <>
            <div className="scan-veil" style={{ left: fr.x, top: fr.y, width: fr.w, height: fr.h, opacity: veil }} />
            {bp < 1 && <div className="scan-beam" style={{ top: mix(-20, fr.y + fr.h / 2, eo(bp)), opacity: Math.sin(bp * Math.PI) }} />}
            <div className="scan-box" style={{ left: fr.x, top: fr.y, width: fr.w, height: fr.h, opacity: veil * clamp(ins * 2), transform: `scale(${1.18 - 0.18 * ins})` }}><i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" /></div>
            <div className="scan-tag" dir="rtl" style={{ left: clamp(fr.x + fr.w / 2, 100, vw - 100), top: fr.y > 64 ? fr.y - 12 : fr.y + fr.h + 12, opacity: veil * clamp(ins * 2), transform: `translate(-50%, ${fr.y > 64 ? '-100%' : '0'}) scale(${0.8 + 0.2 * ins})` }}>{f!.label}</div>
          </>
        )}
        {dp > 0 && t < T.up[0] + 0.1 && (
          <div className="pdfcard" style={{ left: mix(vw + 60, drop.x, eio(dp)) - 70, top: mix(vh * 0.9, drop.y, eio(dp)) - 90 - Math.sin(eio(dp) * Math.PI) * 80, transform: `rotate(${mix(14, 0, eio(dp))}deg) scale(${mix(1.1, 0.8, eio(dp))})`, opacity: 1 - lin(t, T.up[0] - 0.05, T.up[0] + 0.1) }}>
            <div className="pdfcard__pg"><b>أساسيات الطاقة الشمسية</b><Ico name="sun" look="duotone" size={40} color="#f59e0b" /><i /><i /><i className="s" /></div>
            <span className="pdfi">PDF</span>
          </div>
        )}
        {cur && <div className="dcur" style={{ left: cur.x, top: cur.y }}>{cur.click < 1 && <span className="dcur__rip" style={{ transform: `translate(-50%,-50%) scale(${0.3 + eo(cur.click) * 1.4})`, opacity: 1 - cur.click }} />}<span style={{ display: 'block', transform: `translate(-11px,-8px) scale(${cur.click < 0.25 ? 0.85 : 1.25})`, transformOrigin: '11px 8px' }}><MacPointer /></span></div>}
      </div>
    </Window>
  )
}

const CAPS: [number, number, string, string][] = [
  [T.app + 0.3, T.modal - 0.1, 'افتح الموقع وسوّي دفتر جديد', 'دفتر'],
  [T.modal, T.types[0] - 0.1, 'الدفتر: المكان اللي تحط فيه مصادرك', 'مصادرك'],
  [T.drag[0] - 0.2, T.ask - 0.1, 'ارفع محاضرة الطاقة الشمسية', 'محاضرة'],
  [T.ask, T.notNet - 0.1, 'اسألها أي سؤال', 'سؤال'],
  [T.cite - 0.1, T.studio - 0.1, 'كل معلومة جنبها رقم المصدر', 'المصدر'],
  [T.studio, T.tools[0] - 0.1, 'وتحوّلها لحلقة بودكاست', 'بودكاست'],
  [T.same, T.appEnd, 'كلها من نفس المحاضرة', 'المحاضرة'],
]
const STEP_OF = (t: number) => (t < T.modal ? ['١', 'افتح الأداة'] : t < T.drag[0] - 0.2 ? ['٢', 'حط مصادرك'] : t < T.ask ? ['٣', 'ارفع محاضرتك'] : t < T.studio ? ['٤', 'اسألها'] : ['٥', 'أدوات Studio'])
const TYPES = [['file-text', 'PDF'], ['link', 'رابط موقع'], ['play', 'يوتيوب'], ['copy', 'نص']] as const
function TypesOverlay({ t }: { t: number }) {
  const on = life(t, T.types[0] - 0.1, T.drag[0] - 0.3, 0.2, 0.3)
  const net = life(t, T.notNet, T.cite - 0.1, 0.2, 0.25)
  const tools = life(t, T.tools[0], T.same - 0.1, 0.2, 0.25)
  return (
    <>
      {on > 0 && (
        <div className="types" dir="rtl" style={{ opacity: on }}>
          {TYPES.map(([ic, n], i) => { const p = spring(t, T.types[i], 0.55); return <div key={n} className="types__c" style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})` }}><Ico name={ic} look="duotone" size={34} color={GREEN} /><b>{n}</b></div> })}
          {t >= T.fifty - 0.2 && <div className="fifty" style={{ transform: `scale(${spring(t, T.fifty - 0.2, 0.6)})` }}><span>لين</span><Counter value={mix(0, 50, eo(lin(t, T.fifty, T.fifty + 0.9)))} size={46} color="#fff" /><span>مصدر · مجاناً</span></div>}
        </div>
      )}
      {net > 0 && (
        <div className="notnet" dir="rtl" style={{ opacity: net }}>
          <span className="notnet__g"><Ico name="globe" size={36} color="#9aa0a6" /><i style={{ transform: `rotate(-45deg) scaleX(${eo(lin(t, T.notNet + 0.2, T.notNet + 0.5))})` }} /></span>
          <b>مش من الإنترنت</b><span className="notnet__f"><Ico name="file-text" look="duotone" size={36} color={GREEN} /></span><b className="hl">من ملفك</b>
        </div>
      )}
      {tools > 0 && (
        <div className="toolsrow" dir="rtl" style={{ opacity: tools }}>
          {[['layers', 'خريطة ذهنية'], ['copy', 'بطاقات مراجعة'], ['list-checks', 'اختبار']].map(([ic, n], i) => { const p = spring(t, T.tools[i], 0.55); return <span key={n} className="toolsrow__c" style={{ opacity: clamp(p * 2), transform: `scale(${0.7 + 0.3 * p})` }}><Ico name={ic} size={24} color="#fff" />{n}</span> })}
        </div>
      )}
    </>
  )
}
function AppScene({ t }: { t: number }) {
  const w = spring(t, T.app, 0.8)
  const [n, title] = STEP_OF(t)
  return (
    <>
      <div className="nstep" dir="rtl" key={n} style={{ opacity: clamp(lin(t, T.app, T.app + 0.3)) }}><span className="nstep__n">{n}</span><b>{title}</b></div>
      <div className="nwin" style={{ transform: `translateY(${(1 - w) * 700}px) rotate(${(1 - w) * 7}deg)`, opacity: clamp(w * 2) }}><App3 t={t} /></div>
      <TypesOverlay t={t} />
      {CAPS.map(([a, b, txt, hl]) => t > a - 0.05 && t < b + 0.3 ? <BlurText key={a} t={t} at={a} text={txt} hl={[hl]} className="h2 ncap" style={{ top: 680, opacity: 1 - lin(t, b, b + 0.25) }} /> : null)}
    </>
  )
}

// ---------- CTA ----------
function Cta({ t }: { t: number }) {
  const f = t >= T.follow + 0.3
  const typedC = typed(t, T.typeC[0], T.typeC[1], 'اشرحولنا Cursor')
  const sent = t >= T.sendC
  const v = spring(t, T.vid, 0.7)
  return (
    <>
      <div className="abs" style={{ left: 36, top: 70 }}><Mark size={90} t={t} at={T.cta + 0.1} blinkAt={[T.cta + 1.5, T.follow + 0.6]} /></div>
      <div className="nextc" style={{ transform: `scale(${spring(t, T.next, 0.6)})`, opacity: clamp(lin(t, T.next, T.next + 0.2)) }}><small>الجاي</small><b>شرح Perplexity</b></div>
      <Pop t={t} at={T.you} from={0.8} y={30} className="abs" style={{ left: 30, right: 30, top: 230 }}>
        <div className="cbox" dir="rtl">
          <div className="cbox__h"><Ico name="message-circle" size={22} />شن الأداة اللي تبيها؟</div>
          {sent && <div className="cbox__c" style={{ opacity: lin(t, T.sendC, T.sendC + 0.2) }}><span className="cbox__av">أ</span>اشرحولنا Cursor</div>}
          <div className="cbox__in"><span data-empty={!typedC || sent || undefined}>{sent || !typedC ? 'اكتب اسم الأداة…' : typedC}</span><i style={{ transform: `scale(${t > T.sendC - 0.1 && t < T.sendC + 0.05 ? 0.9 : 1})` }}><Ico name="arrow-left" size={24} color="#fff" /></i></div>
        </div>
      </Pop>
      {v > 0 && <div className="vcard2" style={{ opacity: clamp(v * 2), transform: `translate(-50%,0) scale(${0.7 + 0.3 * v})` }}><span className="vcard2__p"><Ico name="play" look="fill" size={26} color="#fff" /></span><div><b>فيديو كامل على طلبك</b><small>الأداة اللي تكتبها في التعليقات</small></div></div>}
      <Pop t={t} at={T.follow} from={0.5} className="abs center" style={{ top: 700 }}>
        <StarBorder t={t}><span className="followb" dir="rtl" style={{ background: f ? '#fff' : INK, color: f ? INK : '#fff', transform: `scale(${t > T.follow + 0.25 && t < T.follow + 0.4 ? 0.93 : 1})` }}><Ico name={f ? 'circle-check' : 'user-plus'} size={24} color={f ? GREEN : '#fff'} />{f ? 'تتابع تقني' : 'تابع تقني'}</span></StarBorder>
      </Pop>
      <Sparks t={t} at={T.follow + 0.3} x={270} y={732} count={12} radius={110} size={18} />
      <Pop t={t} at={T.tt} from={0.8} className="abs center" style={{ top: 860 }}><div className="endtag"><Logo k="tt" h={30} /><span dir="ltr">@techno_ly</span></div></Pop>
    </>
  )
}

export default function App({ t: tt }: { t: number }) {
  if (tt < R + 0.35) {
    const o = eio(lin(tt, R - 0.05, R + 0.3))
    return <div className="ss-stage stage" data-theme="light"><div className="bg" /><div className="scene" style={{ opacity: 1 - o, transform: `scale(${1 + o * 0.3})`, filter: o > 0 ? `blur(${o * 8}px)` : undefined }}><Recap t={tt} /></div><div className="bug"><Mark size={52} t={99} at={0} /></div></div>
  }
  const t = tt - R
  const S = (a: number, b: number, kind: 'up' | 'zoom', node: React.ReactNode) => {
    if (t < a - 0.01 || t > b + 0.35) return null
    const i = eo(lin(t, a + 0.08, a + 0.48)), o = eio(lin(t, b - 0.05, b + 0.25))
    const tr = kind === 'zoom' ? `scale(${mix(1.25, 1, i) * (1 + o * 0.3)})` : `translateY(${(1 - i) * 30 - o * 30}px)`
    return <div className="scene" style={{ opacity: a === 0 ? 1 - o : Math.min(i, 1 - o), transform: tr, filter: o > 0 || i < 1 ? `blur(${Math.max(o, a === 0 ? 0 : 1 - i) * 6}px)` : undefined }}>{node}</div>
  }
  return (
    <div className="ss-stage stage" data-theme="light">
      <div className="bg" />
      {S(0, T.name, 'up', <Hook t={t} />)}
      {S(T.name, T.app, 'zoom', <Name t={t} />)}
      {S(T.app, T.cta, 'up', <AppScene t={t} />)}
      {S(T.cta, END + 1, 'zoom', <Cta t={t} />)}
      {t > 0.2 && t < T.cta && <div className="bug"><Mark size={52} t={99} at={0} blinkAt={[9, 20, 33]} /></div>}
    </div>
  )
}
