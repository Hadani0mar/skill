import React from 'react'
import { Phone } from '../kit/phone'
import { Ico, Logo, BlurText, Pop } from './ui'
import { TaskApp, tapP, doneP, flashP, type Task } from './TaskApp'
import { Dash, D0, D1 } from './Dash'
import { lin, eo, eio, spring, clamp, mix, life } from './anim'
import serverCloud from '../assets/illustrations/server-cloud.png'
import syncImg from '../assets/illustrations/sync-laptop-phone.png'

export const END = 59.0
// Scenes (seconds), cut on the voice's pauses.
const SC = { hook: [0, 7.0], what: [7.0, 16.25], rt: [16.25, 26.2], ex: [26.2, D0], dash: [D0, D1], live: [D1, 52.75], cta: [52.75, END + 1] } as const

function Scene({ t, k, children }: { t: number; k: keyof typeof SC; children: (lt: number) => React.ReactNode }) {
  const [a, b] = SC[k]
  if (t < a - 0.01 || t > b + 0.35) return null
  const i = eo(lin(t, a, a + 0.4)), o = eio(lin(t, b, b + 0.32))
  return (
    <div className="scene" style={{ opacity: a === 0 ? 1 - o : Math.min(i, 1 - o), transform: `translateY(${(1 - i) * 26 - o * 30}px) scale(${1 - o * 0.04})`, filter: o > 0 ? `blur(${o * 6}px)` : undefined }}>
      {children(t)}
    </div>
  )
}

const BASE: Task[] = [
  { title: 'تصميم شاشة الدخول', done: 0, by: 'علي' },
  { title: 'ربط قاعدة البيانات', done: 0, by: 'سارة' },
  { title: 'اختبار الإشعارات', done: 0, by: 'علي' },
]

function SyncArc({ t, a, x1, x2, y, flip }: { t: number; a: number; x1: number; x2: number; y: number; flip?: boolean }) {
  const p = lin(t, a, a + 0.45)
  const on = life(t, a - 0.1, a + 1.1, 0.15, 0.4)
  if (on <= 0) return null
  const mx = (x1 + x2) / 2, h = 70
  const d = `M${x1} ${y} Q${mx} ${y - h * 2} ${x2} ${y}`
  const pt = (q: number) => { const s = flip ? 1 - q : q; return { x: (1 - s) ** 2 * x1 + 2 * (1 - s) * s * mx + s * s * x2, y: (1 - s) ** 2 * y + 2 * (1 - s) * s * (y - h * 2) + s * s * y } }
  const d0 = pt(eio(p))
  return (
    <svg className="arc" width="540" height="960" style={{ opacity: on }}>
      <path d={d} fill="none" stroke="#3ecf8e" strokeWidth="3" strokeDasharray="6 8" strokeLinecap="round" opacity=".7" />
      <circle cx={d0.x} cy={d0.y} r="9" fill="#3ecf8e" />
      <circle cx={d0.x} cy={d0.y} r="18" fill="#3ecf8e" opacity=".25" />
    </svg>
  )
}

function Who({ name, initial, color }: { name: string; initial: string; color: string }) {
  return <div className="who" dir="rtl"><span style={{ background: color }}>{initial}</span>{name}</div>
}

// --- 1. Hook: two phones, one change shows on both ---
function Hook({ t }: { t: number }) {
  const ali = BASE.map((k, i) => (i === 1 ? { ...k, done: doneP(t, 3.95), tap: tapP(t, 3.85) } : k))
  const sara = BASE.map((k, i) => (i === 1 ? { ...k, done: doneP(t, 4.35), flash: flashP(t, 4.35, 1.6) } : k))
  return (
    <>
      <BlurText t={t} at={0.15} text="تخيّل فريقك كامل" className="h1" style={{ top: 92 }} />
      <BlurText t={t} at={1.45} text="فاتح نفس التطبيق" className="h1 hl-all" style={{ top: 146 }} />
      <Pop t={t} at={0.35} className="abs" style={{ left: 290, top: 300, transform: 'rotate(4deg)' }} from={0.85} y={60}>
        <Who name="سارة" initial="س" color="#7c5cff" />
        <Phone width={210} frame="silver"><TaskApp me="سارة" initial="س" tasks={sara} /></Phone>
      </Pop>
      <Pop t={t} at={0.2} className="abs" style={{ left: 40, top: 280, transform: 'rotate(-4deg)' }} from={0.85} y={60}>
        <Who name="علي" initial="ع" color="#f59e0b" />
        <Phone width={210} frame="silver"><TaskApp me="علي" initial="ع" tasks={ali} /></Phone>
      </Pop>
      <SyncArc t={t} a={3.98} x1={150} x2={390} y={300} />
      <BlurText t={t} at={4.2} text="أي تغيير… يوصل للكل" className="h2" style={{ top: 812 }} />
      <BlurText t={t} at={6.0} text="في نفس اللحظة" className="h2 hl-all" style={{ top: 856 }} />
    </>
  )
}

// --- 2. What Supabase is ---
const FEATS = [
  { at: 11.64, icon: 'database', label: 'قاعدة بيانات' },
  { at: 12.49, icon: 'shield-check', label: 'تسجيل دخول' },
  { at: 13.43, icon: 'folder', label: 'تخزين ملفات' },
  { at: 14.37, icon: 'api-endpoint', label: 'واجهات API' },
]
function What({ t }: { t: number }) {
  const lift = eio(lin(t, 11.2, 11.8))
  const ring = lin(t, 7.35, 8.3)
  return (
    <>
      <div className="abs center" style={{ top: mix(250, 96, eio(lin(t, 8.6, 9.2))) }}>
        {ring > 0 && ring < 1 && <span className="ring" style={{ transform: `translate(-50%,-50%) scale(${0.5 + eo(ring) * 2.2})`, opacity: 1 - ring }} />}
        <Pop t={t} at={7.35} from={0.4}><Logo k="sbword" h={mix(56, 40, eio(lin(t, 8.6, 9.2)))} /></Pop>
      </div>
      <Pop t={t} at={8.8} y={50} from={0.7} className="abs center" style={{ top: 170 }}>
        <img src={serverCloud} style={{ height: mix(300, 210, lift), display: 'block', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.12))' }} />
      </Pop>
      <div className="abs center" style={{ top: mix(500, 410, lift) }}>
        <BlurText t={t} at={8.85} text="منصة تطوير مبنية على" className="h3" style={{ position: 'static' }} />
        <Pop t={t} at={10.2} from={0.5} className="pgchip"><Logo k="pg" h={30} /><span>PostgreSQL</span></Pop>
      </div>
      <div className="feats" dir="rtl">
        {FEATS.map((f) => {
          const p = spring(t, f.at, 0.65)
          const sweep = lin(t, f.at, f.at + 0.6)
          return (
            <div key={f.label} className="feat" style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})` }}>
              <Ico name={f.icon} look="duotone" size={44} color="#1f9d63" />
              <b>{f.label}</b>
              {sweep > 0 && sweep < 1 && <span className="sweep" style={{ left: `${-30 + eo(sweep) * 130}%`, opacity: Math.sin(sweep * Math.PI) }} />}
            </div>
          )
        })}
      </div>
    </>
  )
}

// --- 3. Realtime ---
const OPS = [
  { at: 19.77, op: 'INSERT', ar: 'إضافة', c: '#1f9d63', bg: '#e8f8f0' },
  { at: 20.42, op: 'UPDATE', ar: 'تعديل', c: '#b45309', bg: '#fdf3e2' },
  { at: 21.03, op: 'DELETE', ar: 'حذف', c: '#c2410c', bg: '#fdece6' },
]
function Rt({ t }: { t: number }) {
  const fly = eio(lin(t, 22.05, 22.75))
  const shine = lin(t, 17.7, 18.8)
  const imgPulse = 1 + 0.06 * Math.sin(lin(t, 22.6, 23.2) * Math.PI)
  return (
    <>
      <BlurText t={t} at={16.45} text="والميزة اللي تهمنا اليوم" className="h3" style={{ top: 86 }} />
      <Pop t={t} at={17.75} from={0.5} className="abs center rtword" style={{ top: 138 }}>
        <Ico name="zap" look="fill" size={56} color="#3ecf8e" />
        <span style={{ backgroundImage: `linear-gradient(100deg, #111 ${mix(-20, 135, shine) - 15}%, #3ecf8e ${mix(-20, 135, shine)}%, #111 ${mix(-20, 135, shine) + 15}%)` }}>Realtime</span>
      </Pop>
      <Pop t={t} at={19.55} y={40} from={0.75} className="abs center" style={{ top: 268 }}>
        <img src={syncImg} style={{ width: 330, display: 'block', transform: `scale(${imgPulse})`, filter: `drop-shadow(0 18px 30px rgba(0,0,0,.12))${fly > 0.6 ? ` drop-shadow(0 0 ${24 * (1 - lin(t, 23, 23.8))}px rgba(62,207,142,.7))` : ''}` }} />
      </Pop>
      <div className="ops" dir="rtl">
        {OPS.map((o, i) => {
          const p = spring(t, o.at, 0.6)
          const dx = (1 - i) * -150
          return (
            <div key={o.op} className="op" style={{ background: o.bg, color: o.c, opacity: clamp(p * 2) * (1 - lin(t, 22.55, 22.8)), transform: `translate(${dx * fly}px, ${-fly * 190}px) scale(${(0.7 + 0.3 * p) * (1 - fly * 0.6)})` }}>
              <code>{o.op}</code><b>{o.ar}</b>
            </div>
          )
        })}
      </div>
      <Pop t={t} at={23.95} from={0.4} className="abs center now" style={{ top: 640 }}>
        <div><Ico name="zap" look="fill" size={34} color="#fff" /><span>فوراً</span></div>
      </Pop>
      <Pop t={t} at={24.75} y={30} from={0.8} className="abs center norefresh" style={{ top: 738 }}>
        <span className="nr-ico"><Ico name="refresh-cw" size={30} color="#6b6b6b" /><i style={{ transform: `rotate(-45deg) scaleX(${eo(lin(t, 25.0, 25.35))})` }} /></span>
        <span dir="rtl">بدون ما تحدّث الصفحة</span>
      </Pop>
    </>
  )
}

// --- 4. Example ---
function Ex({ t }: { t: number }) {
  return (
    <>
      <Pop t={t} at={26.6} from={0.5} className="abs center expill" style={{ top: 250 }}><div><Ico name="play" look="fill" size={20} color="#1f9d63" /><span>مثال عملي</span></div></Pop>
      <BlurText t={t} at={28.3} text="تطبيق مهام لفريق" className="h1" style={{ top: 320 }} />
      <div className="exrow" dir="rtl">
        {[['ع', '#f59e0b', 28.6], ['س', '#7c5cff', 28.72], ['م', '#0ea5e9', 28.84]].map(([c, col, at]) => (
          <Pop key={c as string} t={t} at={at as number} from={0.3} className="exav" style={{ background: col as string }}>{c}</Pop>
        ))}
        <Pop t={t} at={28.95} from={0.6} className="excard">
          <Ico name="list-checks" look="duotone" size={44} color="#1f9d63" />
          <div><b>مهام الفريق</b><small>٣ مهام · متزامنة</small></div>
        </Pop>
      </div>
      <Pop t={t} at={29.1} from={0.6} className="abs center exsb" style={{ top: 560 }}>
        <Logo k="sb" h={30} /><span>+</span><Ico name="smartphone" look="duotone" size={34} color="#1f9d63" />
      </Pop>
    </>
  )
}

// --- 6. Live demo on two phones ---
function Live({ t }: { t: number }) {
  const tapA = 45.0, syncA = 45.15, addA = 50.35, syncB = 50.55
  const newTask = (at: number): Task => ({ title: 'مراجعة الكود', done: 0, by: 'سارة', enter: t - at, flash: flashP(t, at, at === syncB ? 1.6 : 0.9) })
  const ali: Task[] = [{ ...BASE[0], done: doneP(t, tapA + 0.08), tap: tapP(t, tapA) }, BASE[1], BASE[2], ...(t >= syncB ? [newTask(syncB)] : [])]
  const sara: Task[] = [{ ...BASE[0], done: doneP(t, syncA + 0.05), flash: flashP(t, syncA, 2.4) }, BASE[1], BASE[2], ...(t >= addA ? [newTask(addA)] : [])]
  const input = t >= addA ? '' : (t >= 49.1 ? 'مراجعة الكود'.slice(0, Math.round(lin(t, 49.1, 50.1) * 12)) : '')
  const cap1 = life(t, 43.5, 48.6, 0.3, 0.25), cap2 = life(t, 48.75, 99, 0.3)
  return (
    <>
      <div className="abs center livepill"><i />تجربة حيّة · Realtime</div>
      {cap1 > 0 && <div className="cap" dir="rtl" style={{ opacity: cap1 }}><span className="cap__av" style={{ background: '#f59e0b' }}>ع</span>علي علّم مهمة إنها <b>تمّت</b></div>}
      {cap2 > 0 && <div className="cap" dir="rtl" style={{ opacity: cap2 }}><span className="cap__av" style={{ background: '#7c5cff' }}>س</span>سارة زادت <b>مهمة جديدة</b></div>}
      <div className="abs" style={{ left: 290, top: 220 }}>
        <Who name="علي" initial="ع" color="#f59e0b" />
        <Phone width={220} frame="silver"><TaskApp me="علي" initial="ع" tasks={ali} /></Phone>
      </div>
      <div className="abs" style={{ left: 30, top: 220 }}>
        <Who name="سارة" initial="س" color="#7c5cff" />
        <Phone width={220} frame="silver"><TaskApp me="سارة" initial="س" tasks={sara} input={input} focus={t >= 48.95 && t < addA} inputTap={tapP(t, 48.9)} addTap={tapP(t, addA - 0.05)} /></Phone>
      </div>
      <SyncArc t={t} a={tapA} x1={400} x2={140} y={225} />
      <SyncArc t={t} a={addA} x1={140} x2={400} y={225} />
      <Pop t={t} at={46.0} out={47.9} from={0.6} className="abs badge" style={{ left: 40, top: 760 }}><Ico name="zap" look="fill" size={18} color="#fff" />تحدّثت عند سارة</Pop>
      <Pop t={t} at={50.95} from={0.6} className="abs badge" style={{ left: 300, top: 760 }}><Ico name="zap" look="fill" size={18} color="#fff" />طلعت عند علي</Pop>
    </>
  )
}

// --- 7. CTA ---
function Cta({ t }: { t: number }) {
  const follow = t >= 56.7
  return (
    <>
      <Pop t={t} at={53.0} from={0.5} className="abs center ctaicon" style={{ top: 180 }}><div><Ico name="code" look="duotone" size={64} color="#1f9d63" /></div></Pop>
      <BlurText t={t} at={53.75} text="تبي شرح الكود" className="h1" style={{ top: 300 }} />
      <BlurText t={t} at={54.35} text="بالتفصيل؟" className="h1 hl-all" style={{ top: 356 }} />
      <Pop t={t} at={55.3} y={30} from={0.7} className="abs center bubble" style={{ top: 460 }}>
        <div><Ico name="message-circle" look="duotone" size={30} color="#1f9d63" /><span dir="rtl">اكتبلي في التعليقات</span>
        <span className="dots">{[0, 1, 2].map((i) => <i key={i} style={{ opacity: 0.3 + 0.7 * Math.abs(Math.sin((t - 55.3) * 4 - i * 0.6)) }} />)}</span></div>
      </Pop>
      <Pop t={t} at={56.4} from={0.6} className="abs center followbtn" style={{ top: 560 }}>
        <span style={{ transform: `scale(${t >= 56.65 && t < 56.8 ? 0.92 : 1})`, background: follow ? '#fff' : '#1f9d63', color: follow ? '#1f9d63' : '#fff' }} dir="rtl">
          <Ico name={follow ? 'circle-check' : 'user-plus'} size={22} />{follow ? 'تتابع الحساب' : 'تابع الحساب'}
        </span>
      </Pop>
      <Pop t={t} at={57.2} from={0.8} className="abs center endlogos" style={{ top: 700 }}>
        <div><Logo k="sbword" h={30} /><span className="sep" /><span className="rtmini"><Ico name="zap" look="fill" size={20} color="#3ecf8e" />Realtime</span></div>
      </Pop>
    </>
  )
}

export default function App({ t }: { t: number }) {
  return (
    <div className="ss-stage stage" data-theme="light">
      <div className="bg" />
      <Scene t={t} k="hook">{(lt) => <Hook t={lt} />}</Scene>
      <Scene t={t} k="what">{(lt) => <What t={lt} />}</Scene>
      <Scene t={t} k="rt">{(lt) => <Rt t={lt} />}</Scene>
      <Scene t={t} k="ex">{(lt) => <Ex t={lt} />}</Scene>
      <Scene t={t} k="dash">{(lt) => <Dash t={lt} />}</Scene>
      <Scene t={t} k="live">{(lt) => <Live t={lt} />}</Scene>
      <Scene t={t} k="cta">{(lt) => <Cta t={lt} />}</Scene>
    </div>
  )
}
