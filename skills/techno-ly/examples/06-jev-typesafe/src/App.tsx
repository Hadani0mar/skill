import React from 'react'
import { Window } from '../kit/window'
import { Ico, Logo, BlurText, Pop } from './ui'
import { lin, eo, eio, spring, clamp, mix } from './anim'

// ---- timeline (s). Cuts sit on the 120 BPM grid of the music bed (0.5 s per beat). ----
export const S = { hook: [0, 7.5], jev: [7.5, 14.5], co: [14.5, 25.5], ppl: [25.5, 40.5], fund: [40.5, 50.5], new: [50.5, 58.5],
  price: [58.5, 68.5], diff: [68.5, 82.5], app: [82.5, 110.5], end: [110.5, 118.5] } as const
export const END = 118.5
export const TYPE = [[86.5, 'ticket'], [103.3, 'reply']] as const // typing starts (sound + picture read this)

const G = '#22c55e', GT = '#1f9d63', INK = '#111'
const typed = (t: number, a: number, b: number, s: string) => s.slice(0, Math.round(lin(t, a, b) * s.length))
const rise = (t: number, at: number, dur = 0.55, y = 26): React.CSSProperties => { const p = eo(lin(t, at, at + dur)); return { opacity: p, transform: `translateY(${(1 - p) * y}px)`, filter: `blur(${(1 - p) * 6}px)` } }
const num = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

// One scene: staggered exit (fade + lift + blur) then the next one enters. `a` is the first visible frame.
function Sc({ t, r, children }: { t: number; r: readonly [number, number]; children: (lt: number) => React.ReactNode }) {
  const [a, b] = r
  if (t < a || t >= b) return null
  const out = lin(t, b - 0.35, b)
  return <div className="sc" style={{ opacity: 1 - out, filter: `blur(${out * 10}px)`, transform: `translateY(${34 - out * 18}px)` }}>{children(t - a)}</div>
}
const Img = ({ src, style }: { src: string; style?: React.CSSProperties }) => <img src={`public/img/${src}`} style={style} />
const Head = ({ lt, at = 0.05, text, hl, top = 74, s }: { lt: number; at?: number; text: string; hl?: string[]; top?: number; s?: boolean }) =>
  <BlurText t={lt} at={at} text={text} hl={hl} className={`hd${s ? ' s' : ''}`} style={{ top }} />

// the ت mark (brand svg geometry)
function Mark({ size }: { size: number }) {
  return (
    <svg viewBox="200 250 680 560" width={size} height={size * 560 / 680} style={{ display: 'block', overflow: 'visible' }}>
      <g transform="translate(0 45)">
        <path d="M300 470 C300 700 780 700 780 440" fill="none" stroke={INK} strokeWidth="118" strokeLinecap="round" />
        <rect x="400" y="300" width="112" height="112" rx="22" fill={INK} /><rect x="568" y="300" width="112" height="112" rx="22" fill={G} />
      </g>
    </svg>
  )
}

// ---------- 0. hook: the pain, in the inbox itself ----------
const COMPLAINTS = ['الثلاجة وقفت بعد يومين', 'خصموا مني المبلغ مرتين', 'الطلب ما وصلش لين توّا', 'ما نقدرش ندخل حسابي', 'نبي نرجّع المنتج', 'التطبيق يقفل وحده', 'الفاتورة فيها خطأ', 'الكرتون واصل مكسور']
const AVC = ['#fca5a5', '#fcd34d', '#86efac', '#93c5fd', '#c4b5fd', '#f9a8d4']
function Hook({ lt }: { lt: number }) {
  const n = Math.round(mix(520, 1000, eo(lin(lt, 0.2, 3.4))))
  const sw = eio(lin(lt, 4.3, 5.0))
  return (
    <>
      <Head lt={lt} at={-1} text="ألف شكوى في اليوم... وكل واحدة لازم تروح لقسمها" hl={['ألف']} top={78} />
      <div className="abs" style={{ left: 40, right: 40, top: 270, height: 400 }}>
        <Window title="الشكاوى" className="hw" chrome="native">
          <div style={{ overflow: 'hidden', height: 362 }}>
            <div style={{ transform: `translateY(${-((lt * 80) % 528)}px)` }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div className="row" key={i}><span className="av" style={{ background: AVC[i % 6] }} /><div><b>{COMPLAINTS[i % 8]}</b><i style={{ width: 54 + ((i * 37) % 60) }} /></div><span className="t">{(i * 7) % 12 + 1}:{(i * 13) % 5}{i % 9}</span></div>
              ))}
            </div>
          </div>
        </Window>
      </div>
      <div className="ctr" style={{ top: 704, opacity: 1 - sw, transform: `translateY(${-sw * 20}px)` }}>
        <div className="big" style={{ fontSize: 112 }}>{num(n)}</div>
        <div className="lbl" style={{ marginTop: 8, fontSize: 22 }}>شكوى في اليوم</div>
      </div>
      <div className="ctr" style={{ top: 704, opacity: sw, transform: `translateY(${(1 - sw) * 24}px)` }}>
        <div className="big hl" style={{ fontSize: 100 }}>0.5<span style={{ fontSize: 44, marginInlineStart: 8 }}>s</span></div>
        <div className="lbl" style={{ marginTop: 10, fontSize: 22 }}>والقرار يطلع في أقل من نص ثانية</div>
      </div>
    </>
  )
}

// ---------- 1. the name ----------
function JevName({ lt }: { lt: number }) {
  const p = spring(lt, 0.15, 0.7)
  return (
    <>
      <div className="ctr" style={{ top: 150, transform: `scale(${0.5 + 0.5 * p})`, opacity: clamp(p * 3) }}><Img src="typesafe-mark.png" style={{ width: 150, height: 150, borderRadius: 99 }} /></div>
      <div className="ctr" style={{ top: 330, ...rise(lt, 0.45, 0.6, 40) }}><div className="big" style={{ fontSize: 170, letterSpacing: '-.07em' }}>Jev</div></div>
      <Head lt={lt} at={1.3} text="موديل جديد... ماهو شات بوت" hl={['شات']} top={548} s />
      <div className="ctr" style={{ top: 650, ...rise(lt, 2.6, 0.5) }}><span className="chip"><Img src="typesafe-mark.png" style={{ width: 28, height: 28, borderRadius: 99 }} /><span className="en">من TypeSafe AI</span></span></div>
      <div className="sub" style={{ top: 736, ...rise(lt, 3.8, 0.5) }}>يرجّع <span className="hl">قرار</span> مع نسبة ثقة... مش مقال</div>
    </>
  )
}

// ---------- 2. the company ----------
function Company({ lt }: { lt: number }) {
  const items = [['calendar', '2024', 'تأسست الشركة', 1.0], ['eye', 'سنتين', 'اشتغلوا في الخفاء', 2.9], ['rocket', '15 سبتمبر 2026', 'أول إطلاق لجيف', 4.8]] as const
  const line = eo(lin(lt, 1.0, 5.8))
  return (
    <>
      <div className="ctr" style={{ top: 92, ...rise(lt, 0.05, 0.6) }}><Img src="typesafe-word.png" style={{ width: 340 }} /></div>
      <div className="tl" style={{ right: 78, top: 250, height: 330 * line }} />
      {items.map(([ic, big, small, at], i) => (
        <div key={i} className="abs" style={{ right: 40, left: 40, top: 240 + i * 118, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 16, ...rise(lt, at, 0.55) }}>
          <span style={{ width: 76, height: 76, borderRadius: 99, background: '#fff', border: '1px solid #e6e6e6', display: 'grid', placeItems: 'center', boxShadow: '0 6px 18px rgba(0,0,0,.06)', flex: 'none' }}><Ico name={ic} size={30} color={GT} /></span>
          <div><div style={{ fontSize: i === 2 ? 34 : 40, fontWeight: 800, lineHeight: 1.1 }} className={i === 2 ? '' : ''}>{big}</div><div className="lbl" style={{ fontSize: 21 }}>{small}</div></div>
        </div>
      ))}
      <div className="abs card" style={{ left: 40, right: 40, top: 640, height: 150, overflow: 'hidden', ...rise(lt, 6.6, 0.6) }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, #d9e7df 1.6px, transparent 1.9px) 0 0 / 14px 14px', opacity: .9 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #fff 8%, rgba(255,255,255,0) 60%)' }} />
        <div style={{ position: 'absolute', left: 54 + 4 * Math.sin(lt * 2) * 0, top: 50 }}>
          <div style={{ width: 54, height: 54, borderRadius: 99, background: G, opacity: .22, position: 'absolute', left: -9, top: -9, transform: `scale(${1 + 0.4 * ((lt * 1.4) % 1)})` }} />
          <Ico name="pin" size={36} color={GT} />
        </div>
        <div style={{ position: 'absolute', right: 24, top: 40, direction: 'rtl', textAlign: 'right' }}><div style={{ fontSize: 34, fontWeight: 800 }}>سان فرانسيسكو</div><div className="lbl" style={{ fontSize: 20 }}>كاليفورنيا، أمريكا</div></div>
      </div>
    </>
  )
}

// ---------- 3. the people ----------
function Person({ img, x, y, s, name, role, p, black }: { img: string; x: number; y: number; s: number; name: string; role: string; p: number; black?: boolean }) {
  return (
    <>
      <div className="ph" style={{ left: x, top: y, width: s, height: s, borderRadius: s * 0.14 }}><Img src={img} /></div>
      <div className="abs" style={{ left: x, top: y + s - 16, width: s, display: 'flex', justifyContent: 'center', opacity: p }}><span className={`chip ${black ? 'k' : 'g'}`} style={{ fontSize: s > 200 ? 26 : 17, padding: s > 200 ? '8px 24px' : '5px 12px' }}>{role}</span></div>
      <div className="abs" style={{ left: x - 10, top: y + s + (s > 200 ? 34 : 24), width: s + 20, textAlign: 'center', fontWeight: 800, fontSize: s > 200 ? 34 : 19, lineHeight: 1.15, opacity: p, wordSpacing: '.12em' }}>{name}</div>
    </>
  )
}
function People({ lt }: { lt: number }) {
  const m = eio(lin(lt, 7.4, 8.6)) // Diogo shrinks into the trio row
  const bx = mix(120, 22, m), by = mix(138, 236, m), bs = mix(300, 152, m)
  const e1 = eo(lin(lt, 8.4, 9.2)), e2 = eo(lin(lt, 9.0, 9.8))
  return (
    <>
      <div style={{ opacity: 1 - m }}><Head lt={lt} at={0.0} text="من يقف خلفه؟" top={74} /></div>
      <div style={{ opacity: m }}><Head lt={lt} at={8.4} text="ثلاثة مؤسسين" hl={['ثلاثة']} top={74} /></div>
      <Person img="diogo.jpg" x={bx} y={by} s={bs} name="دييغو ألميدا" role="CEO" p={clamp(lin(lt, 0.8, 1.4))} black />
      {/* Diogo's background */}
      <div className="ctr" style={{ top: 612, opacity: (1 - m) * eo(lin(lt, 2.0, 2.7)), transform: `translateY(${(1 - eo(lin(lt, 2.0, 2.7))) * 20}px)` }}>
        <div className="logo-row"><Logo k="ai_openai" h={46} style={{ color: '#111' }} /><span style={{ fontSize: 30, fontWeight: 800 }} className="en">OpenAI</span></div>
        <div className="sub" style={{ position: 'relative', left: 0, right: 0, marginTop: 14, fontSize: 24 }}>حوالي 4 سنين هناك</div>
      </div>
      <div className="abs" style={{ left: 30, right: 30, top: 742, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', opacity: 1 - m }}>
        {['RLHF', 'InstructGPT', 'GPT-4'].map((c, i) => <span key={c} className="chip g en" style={{ ...rise(lt, 3.6 + i * 0.55, 0.45), fontSize: 19 }}>{c}</span>)}
      </div>
      <div style={{ opacity: e1 }}><Person img="erik.jpg" x={194} y={236} s={152} name="إريك غافني" role="مؤسس مشارك" p={e1} /></div>
      <div style={{ opacity: e2 }}><Person img="sasha.jpg" x={366} y={236} s={152} name="ساشا شنغ" role="مؤسسة مشاركة" p={e2} /></div>
      <div className="ctr" style={{ top: 560, opacity: m * eo(lin(lt, 10.8, 11.6)) }}>
        <div className="sub" style={{ position: 'relative', left: 0, right: 0 }}>الشركة تقول عن دييغو إنه <span className="hl">ساهم في اختراع</span> <span className="en">RLHF</span></div>
        <div className="lbl" style={{ marginTop: 10, fontSize: 17 }}>(وصف من صفحة الفريق على موقع الشركة)</div>
      </div>
    </>
  )
}

// ---------- 4. funding ----------
function Funding({ lt }: { lt: number }) {
  const a = eo(lin(lt, 0.4, 1.0)), b = eo(lin(lt, 3.2, 3.9))
  const seed = Math.round(40 * eo(lin(lt, 0.7, 1.8))), ser = Math.round(870 * eo(lin(lt, 3.6, 5.2))), val = 7.5 * eo(lin(lt, 6.0, 7.6))
  return (
    <>
      <Head lt={lt} text="وبعدها... المال" hl={['المال']} top={74} />
      <div className="abs card" style={{ left: 40, right: 40, top: 190, height: 190, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, padding: 22, direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Img src="dcvc.png" style={{ width: 58, height: 58, borderRadius: 12, border: '1px solid #eee' }} /><div><div style={{ fontSize: 24, fontWeight: 800 }}>جولة أولية بقيادة DCVC</div><div className="lbl" style={{ fontSize: 18 }}>15 سبتمبر 2026</div></div></div>
        <div className="big" style={{ fontSize: 66, marginTop: 14, direction: 'ltr', textAlign: 'right' }}>${seed}M</div>
      </div>
      <div className="abs" style={{ left: 0, right: 0, top: 388, textAlign: 'center', opacity: b, fontSize: 24, color: '#999' }}><Ico name="arrow-right" size={28} color="#bbb" style={{ transform: 'rotate(90deg)', margin: '0 auto' }} /></div>
      <div className="abs card" style={{ left: 40, right: 40, top: 430, height: 250, opacity: b, transform: `translateY(${(1 - b) * 30}px)`, padding: 22, direction: 'rtl', borderColor: '#bbf0d1', boxShadow: '0 16px 44px rgba(34,197,94,.14)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Img src="a16z.png" style={{ width: 58, height: 58, borderRadius: 12 }} /><div><div style={{ fontSize: 24, fontWeight: 800 }}>جولة بقيادة a16z</div><div className="lbl" style={{ fontSize: 18 }}>9 أكتوبر 2026 · معاهم Sequoia وDCVC</div></div></div>
        <div className="big hl" style={{ fontSize: 96, marginTop: 14, direction: 'ltr', textAlign: 'right' }}>${seed < 40 ? 0 : ser}M</div>
      </div>
      <div className="ctr" style={{ top: 712, ...rise(lt, 5.8, 0.6) }}>
        <span className="chip k" style={{ fontSize: 24, padding: '10px 22px' }}>قيمة الشركة <span className="big en" style={{ fontSize: 30, color: G }}>${num(val, 1)}B</span></span>
      </div>
    </>
  )
}

// ---------- 5. what's new: 1.14 ----------
function NewVer({ lt }: { lt: number }) {
  const rows = [['image', 'قراءة الصور', 1.2], ['file-text', 'سياق أطول: 262 ألف توكن', 2.2], ['flag', 'صندوق إحداثيات للصور', 3.2]] as const
  return (
    <>
      <Head lt={lt} text="وشن الجديد؟" hl={['الجديد']} top={74} />
      <div className="ctr" style={{ top: 190, ...rise(lt, 0.4, 0.6) }}>
        <div className="big" style={{ fontSize: 108 }}>1.14</div>
        <span className="chip" style={{ marginTop: 14 }}><Ico name="calendar" size={20} color={GT} />14 أكتوبر 2026</span>
      </div>
      {rows.map(([ic, tx, at], i) => (
        <div key={i} className="abs card" style={{ left: 40, right: 40, top: 430 + i * 96, height: 78, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', direction: 'rtl', ...rise(lt, at, 0.5) }}>
          <Ico name={ic} size={30} color={GT} /><span style={{ fontSize: 24, fontWeight: 800, flex: 1 }}>{tx}</span><Ico name="check" size={24} color={G} />
        </div>
      ))}
      <div className="ctr" style={{ top: 746, ...rise(lt, 5.0, 0.5) }}><span className="chip w" style={{ fontSize: 20 }}><Ico name="triangle-alert" size={20} color="#c2410c" />كلها تجريبية، بإعدادات خاصة</span></div>
    </>
  )
}

// ---------- 6. price ----------
function Price({ lt }: { lt: number }) {
  const pr = 0.042 * eo(lin(lt, 0.4, 1.6)), bj = lin(lt, 2.2, 2.9), bl = eo(lin(lt, 2.6, 4.2))
  return (
    <>
      <Head lt={lt} text="والسعر؟" hl={['السعر']} top={74} />
      <div className="ctr" style={{ top: 170 }}>
        <div className="big hl" style={{ fontSize: 124, ...rise(lt, 0.2, 0.5, 20) }}>${num(pr, 3)}</div>
        <div className="lbl" style={{ marginTop: 10, fontSize: 21, ...rise(lt, 1.4, 0.5) }}>لكل مليون توكن دخل</div>
        <div style={{ marginTop: 16, ...rise(lt, 1.8, 0.5) }}><span className="chip g" style={{ fontSize: 22 }}><Ico name="check" size={22} color={G} />الخرج مجاني</span></div>
      </div>
      <div className="abs card" style={{ left: 40, right: 40, top: 470, height: 196, padding: '22px 22px', direction: 'rtl', opacity: bj }}>
        <div className="dept" style={{ height: 52 }}><span className="n" style={{ width: 96, fontSize: 21 }}>جيف</span><div className="bar" style={{ height: 22 }}><span style={{ width: `${bl * 1.2 + 1}%`, background: G }} /></div><span className="p en" style={{ width: 70, color: GT }}>$0.042</span></div>
        <div className="dept" style={{ height: 52 }}><span className="n" style={{ width: 96, fontSize: 21 }}>موديلات كبيرة</span><div className="bar" style={{ height: 22 }}><span style={{ width: `${bl * 100}%`, background: '#9ca3af' }} /></div><span className="p en" style={{ width: 70 }}>$0.2–10</span></div>
        <div className="lbl" style={{ fontSize: 16, marginTop: 6, textAlign: 'center' }}>السعر لكل مليون توكن دخل</div>
      </div>
      <div className="ctr" style={{ top: 704, ...rise(lt, 5.2, 0.6) }}>
        <div style={{ display: 'flex', gap: 10, direction: 'rtl' }}><span className="chip" style={{ fontSize: 22 }}><b className="en" style={{ color: GT }}>200×</b> أسرع</span><span className="chip" style={{ fontSize: 22 }}><b className="en" style={{ color: GT }}>400×</b> أرخص</span></div>
        <div style={{ marginTop: 12 }}><span className="tag">حسب الشركة نفسها... وفي اختبارات من عندها</span></div>
      </div>
    </>
  )
}

// ---------- 7. the difference ----------
const LOGOS = ['ai_openai', 'ai_claude', 'ai_gemini', 'ai_mistral', 'ai_deepseek']
const WORDS_FAKE = [38, 62, 44, 70, 52, 30, 66, 48, 58, 40, 72, 34]
function Diff({ lt }: { lt: number }) {
  const k = Math.floor(lin(lt, 1.4, 4.4) * WORDS_FAKE.length)
  const q = ['نعم / لا', 'اختيار', 'درجة']
  const res = lin(lt, 8.6, 9.4)
  const bars = [['الصيانة', 94, G], ['المالية', 4, '#d1d5db'], ['الشحن', 2, '#d1d5db']] as const
  return (
    <>
      <Head lt={lt} text="شن الفرق بينه وبين الباقي؟" hl={['الفرق']} top={74} s />
      {/* LLMs */}
      <div className="abs card" style={{ left: 30, right: 30, top: 170, height: 250, padding: 18, ...rise(lt, 0.4, 0.5) }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center' }}>{LOGOS.map(l => <Logo key={l} k={l} h={32} style={l === 'ai_openai' ? { color: '#111' } : undefined} />)}</div>
        <div className="lbl" style={{ textAlign: 'center', marginTop: 10, fontSize: 19 }}>الموديلات الكبيرة: تكتب نص... كلمة ورا كلمة</div>
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 7, direction: 'rtl' }}>
          {WORDS_FAKE.slice(0, k).map((w, i) => <span key={i} style={{ width: w, height: 9, borderRadius: 5, background: '#d4d4d8' }} />)}<span className="caret" style={{ opacity: Math.floor(lt * 3) % 2 }} />
        </div>
        <div style={{ position: 'absolute', left: 18, right: 18, bottom: 14, display: 'flex', justifyContent: 'center', ...rise(lt, 5.0, 0.5) }}><span className="chip w" style={{ fontSize: 17 }}>وبعدها لازم تحلل الكلام باش البرنامج يفهمه</span></div>
      </div>
      {/* Jev */}
      <div className="abs card" style={{ left: 30, right: 30, top: 440, height: 350, padding: 18, borderColor: '#bbf0d1', boxShadow: '0 16px 44px rgba(34,197,94,.13)', ...rise(lt, 5.8, 0.55) }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}><Img src="typesafe-mark.png" style={{ width: 36, height: 36, borderRadius: 99 }} /><b className="big" style={{ fontSize: 34 }}>Jev</b></div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, direction: 'rtl' }}>{q.map((s, i) => <span key={i} className="chip g" style={{ fontSize: 17, ...rise(lt, 6.4 + i * 0.4, 0.4, 12) }}>{s}</span>)}</div>
        <div style={{ marginTop: 14, opacity: res, transform: `translateY(${(1 - res) * 14}px)` }}>
          <div className="lbl" style={{ fontSize: 17, textAlign: 'center' }}>أي قسم؟</div>
          {bars.map(([n, p, c], i) => <div className="dept" key={i} style={{ height: 38 }}><span className="n" style={{ fontSize: 18 }}>{n}</span><div className="bar"><span style={{ width: `${p * eo(lin(lt, 8.8 + i * 0.15, 9.8))}%`, background: c }} /></div><span className="p">{Math.round(p * eo(lin(lt, 8.8, 9.8)))}%</span></div>)}
        </div>
        <div style={{ position: 'absolute', left: 18, right: 18, bottom: 14, display: 'flex', justifyContent: 'center', gap: 8, direction: 'rtl' }}>
          <span className="chip k en" style={{ fontSize: 16, ...rise(lt, 10.4, 0.4, 10) }}><bdi dir="ltr">70–500 ms</bdi></span>
          <span className="chip w" style={{ fontSize: 16, ...rise(lt, 11.6, 0.4, 10) }}><Ico name="triangle-alert" size={16} color="#c2410c" />يقدر يغلط... مش مضمون</span>
        </div>
      </div>
      <div className="ctr" style={{ top: 810, ...rise(lt, 12.2, 0.5) }}><span className="lbl" style={{ fontSize: 19 }}>ما يألف نص... يختار من خياراتك</span></div>
    </>
  )
}

// ---------- 8. the complaints app ----------
const DEPTS: [string, string, number][] = [['الصيانة', 'wrench', 62], ['المالية', 'dollar-sign', 31], ['الشحن', 'truck', 3], ['الاسترجاع', 'undo', 2], ['الحساب والأمان', 'lock', 1], ['الدعم الفني', 'headphones', 1], ['القانوني', 'scale', 0]]
const TICKET = 'الثلاجة اللي شريتها وقفت بعد يومين، وخصموا مني المبلغ مرتين'
const REPLY = 'أهلاً... نعتذر عن عطل الثلاجة. حوّلنا طلبك لقسم الصيانة، وراجعنا الخصم المضاعف مع المالية.'
function AppScene({ lt }: { lt: number }) {
  const v1 = 1 - lin(lt, 6.2, 6.8)
  const v2 = lin(lt, 6.4, 7.0) * (1 - lin(lt, 14.6, 15.2))
  const v3 = lin(lt, 14.8, 15.4) * (1 - lin(lt, 19.6, 20.2))
  const v4 = lin(lt, 19.8, 20.4)
  const sub = lt < 6.5 ? 'نبنيو تطبيق شكاوي المستخدمين' : lt < 19.6 ? 'جيف يقرر في لحظة' : 'والموديل الكبير يتكلم'
  const hl = lt < 6.5 ? ['شكاوي'] : lt < 19.6 ? ['يقرر'] : ['يتكلم']
  return (
    <>
      <div key={sub} style={{ position: 'absolute', inset: 0 }}><Head lt={lt < 6.5 ? lt : lt < 19.6 ? lt - 6.5 : lt - 19.6} at={0.05} text={sub} hl={hl} top={74} s /></div>
      <div className="abs" style={{ left: 28, right: 28, top: 150, height: 700, ...rise(lt, 0.3, 0.6) }}>
        <Window title="شكاوى العملاء" chrome="native" body={{ style: { padding: 0 } }}>
          <div style={{ position: 'relative', height: 650, direction: 'rtl' }}>
            {/* view 1: the ticket arrives */}
            <div style={{ position: 'absolute', inset: 0, padding: 20, opacity: v1, filter: `blur(${(1 - v1) * 6}px)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 38, height: 38, borderRadius: 99, background: '#93c5fd' }} /><div><b style={{ fontSize: 20 }}>عميل جديد</b><div className="lbl" style={{ fontSize: 14 }}>تذكرة #4821</div></div><span className="tag" style={{ marginInlineStart: 'auto' }}>بيانات تجريبية</span></div>
              <div className="card" style={{ marginTop: 18, padding: 18, minHeight: 130, fontSize: 29, fontWeight: 700, lineHeight: 1.5, wordSpacing: '.12em', minHeight: 180, opacity: eo(lin(lt, 3.6, 4.0)) }}>{typed(lt, 4.0 + 0, 6.0, TICKET)}{lt > 4 && lt < 6.2 && <span className="caret" />}</div>
              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>{[0.9, 0.7, 0.8].map((w, i) => <div key={i} style={{ height: 64, borderRadius: 14, background: '#f6f6f6', width: `${w * 100}%`, ...rise(lt, 0.9 + i * 0.3, 0.5) }} />)}</div>
            </div>
            {/* view 2: Jev scores departments */}
            <div style={{ position: 'absolute', inset: 0, padding: 20, opacity: v2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Img src="typesafe-mark.png" style={{ width: 34, height: 34, borderRadius: 99 }} /><b className="big" style={{ fontSize: 28 }}>Jev</b><span className="chip k en" style={{ marginInlineStart: 'auto', fontSize: 15, padding: '4px 12px' }}><bdi dir="ltr">{Math.round(68 * eo(lin(lt, 7.2, 8)))} ms</bdi></span></div>
              <div className="lbl" style={{ marginTop: 16, marginBottom: 6, fontSize: 18 }}>أي قسم؟</div>
              {DEPTS.map(([n, ic, p], i) => {
                const g = eo(lin(lt, 7.4 + i * 0.12, 9.6)), top2 = i < 2 && lt > 10.2
                return <div className="dept" key={n} style={{ height: 56, opacity: top2 || lt <= 10.2 ? 1 : 1 - 0.55 * lin(lt, 10.2, 10.8) }}><span className="n"><Ico name={ic} size={20} color={i < 2 ? GT : '#9ca3af'} />{n}</span><div className="bar"><span style={{ width: `${p * g}%`, background: i < 2 ? G : '#d1d5db' }} /></div><span className="p">{Math.round(p * g)}%</span></div>
              })}
              <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'center', ...rise(lt, 11.4, 0.5) }}><span className="chip w"><Ico name="flag" size={18} color="#c2410c" />أولوية عالية</span><span className="chip"><Ico name="layers" size={18} color={GT} />مشكلتين في تذكرة</span></div>
              <div className="lbl" style={{ textAlign: 'center', marginTop: 14, fontSize: 15, ...rise(lt, 12.2, 0.4) }}>أرقام تجريبية للتوضيح</div>
            </div>
            {/* view 3: the confidence gate */}
            <div style={{ position: 'absolute', inset: 0, padding: 20, opacity: v3 }}>
              <div className="lbl" style={{ fontSize: 20, textAlign: 'center' }}>نسبة الثقة تحدد الطريق</div>
              {[['الصيانة', 'wrench', 94, 'تلقائي', 'check'], ['المالية', 'dollar-sign', 71, 'موظف يراجعها', 'user']].map(([n, ic, c, how, hi], i) => {
                const a0 = 15.8 + i * 1.9, g = eo(lin(lt, a0, a0 + 1.1))
                const auto = (c as number) >= 90
                return (
                  <div key={i} className="card" style={{ marginTop: 22, padding: 18, ...rise(lt, a0 - 0.4, 0.5) }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Ico name={ic as string} size={26} color={GT} /><b style={{ fontSize: 24 }}>{n}</b><b className="big en" style={{ marginInlineStart: 'auto', fontSize: 34, color: auto ? GT : '#c2410c' }}>{Math.round((c as number) * g)}%</b></div>
                    <div className="bar" style={{ marginTop: 12, height: 14, overflow: 'visible' }}><span style={{ width: `${(c as number) * g}%`, background: auto ? G : '#fb923c' }} /><i style={{ position: 'absolute', left: '90%', top: -6, bottom: -6, width: 2, background: '#111' }} /></div>
                    <div style={{ marginTop: 14, opacity: lin(lt, a0 + 1.0, a0 + 1.5) }}><span className={`chip ${auto ? 'g' : 'w'}`}><Ico name={hi as string} size={20} color={auto ? GT : '#c2410c'} />{how}</span></div>
                  </div>
                )
              })}
              <div className="lbl" style={{ textAlign: 'center', marginTop: 20, fontSize: 16, ...rise(lt, 18.4, 0.4) }}>الخط الأسود = حد الثقة (90%) · أرقام تجريبية</div>
            </div>
            {/* view 4: the big model writes the reply */}
            <div style={{ position: 'absolute', inset: 0, padding: 20, opacity: v4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Logo k="ai_claude" h={32} /><b style={{ fontSize: 22 }}>موديل كبير</b><span className="chip g" style={{ marginInlineStart: 'auto', fontSize: 15, padding: '4px 12px' }}>يكتب الرد</span></div>
              <div className="card" style={{ marginTop: 18, padding: 18, minHeight: 220, fontSize: 28, fontWeight: 700, lineHeight: 1.55, wordSpacing: '.12em' }}>{typed(lt, 20.8, 24.8, REPLY)}{lt > 20.8 && lt < 25 && <span className="caret" />}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'center', ...rise(lt, 25.0, 0.5) }}><span className="chip g"><Ico name="wrench" size={18} color={GT} />الصيانة</span><span className="chip g"><Ico name="dollar-sign" size={18} color={GT} />المالية</span></div>
              <div className="lbl" style={{ textAlign: 'center', marginTop: 16, ...rise(lt, 25.4, 0.4) }}>جيف يقرر... والموديل الكبير يتكلم</div>
            </div>
          </div>
        </Window>
      </div>
    </>
  )
}

// ---------- 9. end ----------
function End({ lt }: { lt: number }) {
  return (
    <>
      <Head lt={lt} at={0.1} text="شن القسم اللي شكاويه تعبتك في شغلك؟" hl={['القسم']} top={150} />
      <div className="sub" style={{ top: 330, fontSize: 28, ...rise(lt, 1.4, 0.5) }}>اكتبه في التعليقات... ونجربوه مع <span className="hl en" style={{ fontWeight: 800 }}>Jev</span></div>
      <div className="ctr" style={{ top: 520, ...rise(lt, 2.4, 0.6) }}><Mark size={190} /></div>
      <div className="ctr" style={{ top: 690, ...rise(lt, 3.2, 0.5) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Logo k="tt" h={38} /><span className="en" style={{ fontSize: 34, fontWeight: 800 }}>@techno_ly</span></div>
      </div>
    </>
  )
}

export default function App({ t }: { t: number }) {
  return (
    <div className="stage">
      <div className="bg" />
      <Sc t={t} r={S.hook}>{lt => <Hook lt={lt} />}</Sc>
      <Sc t={t} r={S.jev}>{lt => <JevName lt={lt} />}</Sc>
      <Sc t={t} r={S.co}>{lt => <Company lt={lt} />}</Sc>
      <Sc t={t} r={S.ppl}>{lt => <People lt={lt} />}</Sc>
      <Sc t={t} r={S.fund}>{lt => <Funding lt={lt} />}</Sc>
      <Sc t={t} r={S.new}>{lt => <NewVer lt={lt} />}</Sc>
      <Sc t={t} r={S.price}>{lt => <Price lt={lt} />}</Sc>
      <Sc t={t} r={S.diff}>{lt => <Diff lt={lt} />}</Sc>
      <Sc t={t} r={S.app}>{lt => <AppScene lt={lt} />}</Sc>
      <Sc t={t} r={S.end}>{lt => <End lt={lt} />}</Sc>
      {t < S.end[0] && <div className="bug"><Mark size={40} /></div>}
    </div>
  )
}
