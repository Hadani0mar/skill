import React from 'react'
import { Window } from '../kit/window'
import { Phone, Notification } from '../kit/phone'
import { MacPointer } from '../kit/cursors'
import { Ico, Logo, BlurText, Pop } from './ui'
import { Counter, Sparks, StarBorder } from './rb'
import { lin, eo, eio, spring, clamp, mix, life } from './anim'
import perfume from '../assets/products/perfume.jpg'
import headphones from '../assets/products/headphones.jpg'
import caseImg from '../assets/products/case.jpg'
import pSadad from '../assets/pay/t/sadad.png'
import pMobi from '../assets/pay/t/mobicash.png'
import pEdfali from '../assets/pay/t/edfali.png'
import pOne from '../assets/pay/t/onepay.png'
import pLy from '../assets/pay/t/lypay.png'
import pMoam from '../assets/pay/t/moamalat.png'

export const END = 60.0
const GREEN = '#22c55e', INK = '#111'
const dl = (n: number) => `${n} د.ل`
const typed = (t: number, a: number, b: number, s: string) => s.slice(0, Math.round(lin(t, a, b) * s.length))
const PRODUCTS = [
  { id: 'perfume', img: perfume, name: 'عطر عنبر فاخر', cat: 'عطور', price: 180 },
  { id: 'hp', img: headphones, name: 'سماعة رأس لاسلكية', cat: 'إلكترونيات', price: 320 },
  { id: 'case', img: caseImg, name: 'سماعات أذن لاسلكية', cat: 'إلكترونيات', price: 150 },
]
// Scenes cut on the voice's pauses (silencedetect).
const SC = { hook: [0, 4.3], why: [4.3, 11.95], dm: [11.95, 19.15], video: [19.15, 29.15], us: [29.15, 37.6], demo: [37.6, 49.95], reveal: [49.95, 54.45], cta: [54.45, END + 1] } as const
function Scene({ t, k, children, kind = 'up' }: { t: number; k: keyof typeof SC; children: React.ReactNode; kind?: 'up' | 'zoom' | 'left' }) {
  const [a, b] = SC[k]
  if (t < a - 0.01 || t > b + 0.35) return null
  // staggered: old content leaves first, then new arrives (no double exposure)
  const i = eo(lin(t, a + 0.08, a + 0.48)), o = eio(lin(t, b - 0.05, b + 0.25))
  const tr = kind === 'zoom' ? `scale(${mix(1.25, 1, i) * (1 + o * 0.3)})` : kind === 'left' ? `translateX(${(1 - i) * 80 - o * 80}px)` : `translateY(${(1 - i) * 30 - o * 30}px) scale(${1 - o * 0.04})`
  return <div className="scene" style={{ opacity: a === 0 ? 1 - o : Math.min(i, 1 - o), transform: tr, filter: o > 0 || i < 1 ? `blur(${Math.max(o, 1 - i) * 6}px)` : undefined }}>{children}</div>
}
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
const Cursor = ({ x, y, click }: { x: number; y: number; click: number }) => (
  <div className="dcur" style={{ left: x, top: y }}>
    {click >= 0 && click < 1 && <span className="dcur__rip" style={{ transform: `translate(-50%,-50%) scale(${0.3 + eo(click) * 1.4})`, opacity: 1 - click }} />}
    <span style={{ display: 'block', transform: `translate(-11px,-8px) scale(${click >= 0 && click < 0.25 ? 0.85 : 1.25})`, transformOrigin: '11px 8px' }}><MacPointer /></span>
  </div>
)

// ---------- mobile store (inside a Stageshow Phone, 402pt wide) ----------
function MobileStore({ t, scroll = 0, order = 0 }: { t: number; scroll?: number; order?: number }) {
  const items = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS]
  return (
    <div className="ms" dir="rtl">
      <div className="ms__top"><div className="ms__h"><span className="ms__brand"><Mark size={40} t={99} at={0} />التقني</span><span className="ms__cart"><Ico name="shopping-cart" size={24} color="#fff" />{order > 0 && <i>{order}</i>}</span></div>
      <div className="ms__search"><Ico name="search" size={20} color="#999" />ابحث عن منتج…</div>
      <div className="ms__chips">{['الكل', 'عطور', 'إلكترونيات', 'هدايا'].map((c, i) => <span key={c} data-on={i === 0 || undefined}>{c}</span>)}</div></div>
      <div className="ms__grid" style={{ transform: `translateY(${-scroll}px)` }}>
        {items.map((p, i) => (
          <div key={i} className="mg">
            <div className="mg__img"><img src={p.img} /><span className="mg__heart"><Ico name="heart" size={18} color="#fff" /></span></div>
            <b>{p.name}</b><small>{p.cat}</small>
            <div className="mg__r"><span>{dl(p.price)}</span><i><Ico name="shopping-bag" size={20} color="#111" /></i></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- 1. hook ----------
function Hook({ t }: { t: number }) {
  const scroll = mix(0, 290, eio(lin(t, 0.5, 3.4)))
  const n = spring(t, 2.95, 0.7)
  return (
    <>
      <BlurText t={t} at={0.25} text="زبونك اليوم" className="h1" style={{ top: 70 }} />
      <BlurText t={t} at={1.2} text="يدوّر ويشري من تليفونه" hl={['تليفونه']} className="h2" style={{ top: 130 }} />
      <div className="abs center" style={{ top: 210, transform: `rotate(${mix(-4, 0, eo(lin(t, 0, 1)))}deg)` }}>
        <Phone width={290} frame="silver"><MobileStore t={t} scroll={scroll} order={t > 3.0 ? 1 : 0} />
          <div className="nbanner" style={{ transform: `translateY(${(1 - n) * -140}px)`, opacity: clamp(n * 2) * (1 - lin(t, 4.0, 4.3)) }}>
            <Notification banner icon={<span className="nic"><Mark size={30} t={99} at={0} /></span>} title="التقني" body="وصلك طلب جديد 🛍️" time="الآن" />
          </div>
        </Phone>
      </div>
      <Pop t={t} at={2.85} from={0.6} className="abs center" style={{ top: 852 }}><div className="chip-ghost"><Ico name="house" size={22} color={GREEN} />وهو قاعد في حوشه</div></Pop>
    </>
  )
}

// ---------- 2. why a store ----------
const CITIES = [['طرابلس', 120, 330], ['بنغازي', 400, 300], ['مصراتة', 230, 260], ['سبها', 300, 470], ['الزاوية', 70, 440], ['البيضاء', 460, 420], ['طبرق', 470, 200], ['غريان', 150, 520]] as const
function Why({ t }: { t: number }) {
  const ring = eo(lin(t, 6.0, 7.1))
  const phase = t < 7.6 ? 0 : t < 9.6 ? 1 : 2
  return (
    <>
      <BlurText t={t} at={4.5} text="المتجر الإلكتروني" className="h1" style={{ top: 70 }} />
      {phase === 0 && (
        <div className="abs center" style={{ top: 230 }}>
          <div className="clock">
            <svg viewBox="0 0 200 200" width="300" height="300"><circle cx="100" cy="100" r="86" fill="none" stroke="#eee" strokeWidth="16" /><circle cx="100" cy="100" r="86" fill="none" stroke={GREEN} strokeWidth="16" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} transform="rotate(-90 100 100)" /></svg>
            <div className="clock__in"><Counter value={mix(0, 24, ring)} size={96} color={INK} /><span>ساعة يخدم معاك</span></div>
            {[0, 1].map((k) => { const ang = (-90 + ring * 360 + k * 180) * Math.PI / 180; return <span key={k} className="orbit" style={{ left: 150 + Math.cos(ang) * 150 - 24, top: 150 + Math.sin(ang) * 150 - 24, background: k ? '#111' : '#fbbf24' }}>{k ? '☾' : '☀'}</span> })}
          </div>
          <div className="dn" dir="rtl">{[[6.2, 'الصبح'], [6.5, 'العشية'], [6.8, 'الليل']].map(([at, s]) => <Pop key={s as string} t={t} at={at as number} from={0.5}><span className="dn__c">{s}<i>✓</i></span></Pop>)}</div>
        </div>
      )}
      {phase >= 1 && (
        <div className="fan" style={{ opacity: phase === 1 ? 1 : 0.0, transform: `translateY(${phase === 2 ? -40 : 0}px)` }}>
          {PRODUCTS.map((p, i) => {
            const s = spring(t, 7.75 + i * 0.25, 0.7)
            return <div key={p.id} className="fcard2" style={{ transform: `translateX(${(i - 1) * 150 * s}px) rotate(${(i - 1) * 9 * s}deg) translateY(${(1 - s) * 200 + Math.abs(i - 1) * 24}px)`, opacity: clamp(s * 2), zIndex: i === 1 ? 2 : 1 }}><img src={p.img} /><b>{p.name}</b><span>{dl(p.price)}</span></div>
          })}
          <BlurText t={t} at={7.8} text="منتجاتك بصورها وأسعارها" className="h2" style={{ top: 640 }} />
        </div>
      )}
      {phase === 2 && (
        <>
          <div className="store-hub" style={{ transform: `translate(-50%,-50%) scale(${spring(t, 9.65, 0.6)})` }}><Mark size={70} t={99} at={0} /></div>
          {CITIES.map(([c, x, y], i) => {
            const p = spring(t, 9.8 + i * 0.16, 0.6), line = eo(lin(t, 9.8 + i * 0.16, 10.2 + i * 0.16))
            return (
              <React.Fragment key={c}>
                <svg className="arc" width="540" height="960"><line x1="270" y1="390" x2={mix(270, x, line)} y2={mix(390, y, line)} stroke={GREEN} strokeWidth="2.5" strokeDasharray="5 6" opacity=".6" /></svg>
                <div className="city" style={{ left: x, top: y, opacity: clamp(p * 2), transform: `translate(-50%,-50%) scale(${p})` }}><Ico name="pin" look="fill" size={18} color={GREEN} />{c}</div>
              </React.Fragment>
            )
          })}
          <BlurText t={t} at={9.7} text="قدام أي حد في ليبيا كلها" hl={['ليبيا']} className="h2" style={{ top: 640 }} />
        </>
      )}
    </>
  )
}

// ---------- 3. DM chaos → self-serve ----------
function Dm({ t }: { t: number }) {
  const sweep = eio(lin(t, 16.2, 16.7))
  const N = 22
  return (
    <>
      <BlurText t={t} at={12.2} text="نفس السؤال… مية مرة" className="h1" style={{ top: 70, opacity: 1 - sweep }} />
      <div className="dmicon" style={{ opacity: 1 - sweep }}><Ico name="message-circle" look="duotone" size={44} color={GREEN} /><span className="dmbadge"><Counter value={Math.round(mix(0, 99, eo(lin(t, 12.3, 16.0))))} size={20} />{t > 15.9 ? '+' : ''}</span></div>
      {Array.from({ length: N }).map((_, i) => {
        const at = 12.35 + i * 0.17, p = spring(t, at, 0.5)
        const r = (Math.sin(i * 12.9) * 43758.5) % 1, r2 = (Math.sin(i * 78.2) * 12345.6) % 1
        const x = 40 + Math.abs(r) * 360, y = 230 + Math.abs(r2) * 520
        const txt = i % 3 === 1 ? 'ووين نستلم؟' : i % 5 === 3 ? 'متوفر؟' : 'بكم؟'
        const hot = t > 14.6 && (txt !== 'متوفر؟')
        return p > 0 ? <div key={i} className="qb" data-me={i % 2 || undefined} style={{ left: x, top: y + sweep * 900, opacity: clamp(p * 2) * (1 - sweep), transform: `scale(${p * (hot ? 1.06 : 1)}) rotate(${(r - 0.5) * 10}deg)`, background: hot && i % 4 === 0 ? '#111' : undefined, color: hot && i % 4 === 0 ? '#fff' : undefined }}>{txt}</div> : null
      })}
      {sweep > 0 && (
        <>
          <BlurText t={t} at={16.4} text="الزبون بروحه:" className="h1" style={{ top: 120 }} />
          <div className="self" dir="rtl">
            {[[16.5, 'eye', 'يشوف'], [17.15, 'pointer', 'يختار'], [17.8, 'credit-card', 'ويدفع']].map(([at, ic, s], i) => {
              const p = spring(t, at as number, 0.6)
              return <div key={s as string} className="self__s" style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 60}px)` }}><span><Ico name={ic as string} look="duotone" size={52} color={GREEN} /></span><b>{s}</b>{t > (at as number) + 0.4 && <i className="tick"><Ico name="check" size={18} color="#fff" /></i>}</div>
            })}
          </div>
        </>
      )}
    </>
  )
}

// ---------- 4. why a promo video ----------
const FEED = Array.from({ length: 16 })
function Video({ t }: { t: number }) {
  const v = t < 23.8 ? 0 : 1
  const speed = t < 23.85 ? mix(0, 1, eo(lin(t, 21.5, 22.2))) : 0
  const feedY = ((t < 23.85 ? Math.max(0, (t - 21.5)) * 700 * Math.min(1, (t - 21.5)) : (23.85 - 21.5) * 700) % 560)
  const vp = spring(t, 23.9, 0.6)
  const shot = t < 27.6 ? 0 : t < 28.2 ? 1 : 2
  return (
    <>
      {t < 21.5 && (
        <>
          <BlurText t={t} at={19.4} text="بس المتجر بروحه" className="h1" style={{ top: 120 }} />
          <BlurText t={t} at={20.1} text="ما يكفيش" className="h1 hl-all" style={{ top: 180 }} />
          <div className="abs center" style={{ top: 330 }}><div className="lonely"><Mark size={70} t={99} at={0} /><span>متجرك</span><div className="zz" style={{ opacity: 0.4 + 0.3 * Math.sin(t * 3) }}>…</div></div></div>
        </>
      )}
      {t >= 21.5 && (
        <>
          <BlurText t={t} at={21.6} text="الناس تتفرج قبل ما تقرا" hl={['تتفرج']} className="h2" style={{ top: 60 }} />
          <div className="abs center" style={{ top: 130 }}>
            <Phone width={300} frame="silver">
              <div className="feedv">
                <div style={{ transform: `translateY(${-feedY}px)`, filter: speed > 0.3 ? `blur(${speed * 2.5}px)` : undefined }}>
                  {FEED.map((_, i) => <div key={i} className="post"><div className="post__h"><i />{['', '', '', ''].map((__, k) => <span key={k} />)}</div><div className="post__ln" /><div className="post__ln s" /><div className="post__ln" /></div>)}
                </div>
                {v > 0 && (
                  <div className="vidpost" style={{ opacity: clamp(vp * 2), transform: `scale(${0.9 + 0.1 * vp})` }}>
                    {[perfume, headphones, caseImg].map((src, i) => <img key={i} src={src} style={{ opacity: i === shot ? 1 : 0, transform: `scale(${1.15 - 0.15 * lin(t, 24 + i * 1.2, 29)}) translateY(${i === 0 ? -lin(t, 24, 27.6) * 30 : 0}px)` }} />)}
                    <div className="vidpost__sheen" style={{ left: `${-60 + lin(t, 24.3, 25.3) * 220}%` }} />
                    <div className="vidpost__t" dir="rtl"><b>{PRODUCTS[shot].name}</b><span>{dl(PRODUCTS[shot].price)}</span></div>
                    <div className="vidpost__btn" style={{ transform: `scale(${spring(t, 27.3, 0.6)})` }}>اطلب توّا</div>
                    <div className="vidpost__bar"><i style={{ width: `${lin(t, 23.9, 29.1) * 100}%` }} /></div>
                  </div>
                )}
              </div>
            </Phone>
          </div>
          {t > 23.8 && t < 25.4 && <Pop t={t} at={23.9} from={0.6} className="abs center" style={{ top: 860 }}><div className="chip-ghost"><Ico name="clapperboard" size={22} color={GREEN} />فيديو دعائي قصير</div></Pop>}
          {t > 25.4 && t < 27.2 && <Pop t={t} at={25.5} from={0.6} className="abs center" style={{ top: 860 }}><div className="chip-ghost stop"><span className="stopi" />يوقّف السكرول</div></Pop>}
          {t > 27.2 && <Pop t={t} at={27.3} from={0.6} className="abs center" style={{ top: 860 }}><div className="chip-ghost"><Ico name="clock" size={22} color={GREEN} />منتجك في ثواني</div></Pop>}
        </>
      )}
    </>
  )
}

// ---------- 5. who we are ----------
function Us({ t }: { t: number }) {
  return (
    <>
      <div className="abs center" style={{ top: 110 }}><Mark size={180} t={t} at={29.35} blinkAt={[30.6]} /></div>
      <BlurText t={t} at={29.4} text="وهني نجوا إحنا" className="h3" style={{ top: 70 }} />
      <Pop t={t} at={31.02} from={0.6} className="abs center" style={{ top: 280 }}><div className="wm">تقني</div></Pop>
      <BlurText t={t} at={31.8} text="نطوّروا الاثنين" className="h2" style={{ top: 400 }} />
      <div className="duo" dir="rtl">
        <Pop t={t} at={33.0} from={0.4}><div className="duo__c"><span><Ico name="monitor" look="duotone" size={46} color={GREEN} /></span><b>المتجر</b></div></Pop>
        <Pop t={t} at={33.5} from={0.3}><div className="duo__plus">+</div></Pop>
        <Pop t={t} at={33.8} from={0.4}><div className="duo__c"><span><Ico name="clapperboard" look="duotone" size={46} color={GREEN} /></span><b>الفيديو</b></div></Pop>
      </div>
      <div className="for" dir="rtl">
        {[[35.33, 'globe', 'موقع'], [35.96, 'smartphone', 'تطبيق'], [36.69, 'package', 'منتج']].map(([at, ic, s]) => <Pop key={s as string} t={t} at={at as number} from={0.5}><span className="for__c"><Ico name={ic as string} size={22} color="#fff" />{s}</span></Pop>)}
      </div>
    </>
  )
}

// ---------- 6. live demo: desktop store (Stageshow window) ----------
const PAYS = [
  { k: 'sadad', n: 'سداد', img: pSadad, at: 45.44 }, { k: 'mobi', n: 'موبي كاش', img: pMobi, at: 46.06 }, { k: 'edfali', n: 'ادفع لي', img: pEdfali, at: 46.86 },
  { k: 'one', n: 'وان باي', img: pOne, at: 47.57 }, { k: 'ly', n: 'لي باي', img: pLy }, { k: 'moam', n: 'بطاقة مصرفية · معاملات', img: pMoam }, { k: 'cod', n: 'كاش عند الاستلام' },
]
const D = { add: 40.6, co: 41.6, deliv: 42.3, pickHover: 43.3, pay: 44.95, open: 45.15, pick: 48.0, payBtn: 48.85, ok: 49.3 }
function Desk({ t }: { t: number }) {
  const page = t < D.co ? 'home' : t < D.pay ? 'co' : t < D.ok ? 'pay' : 'ok'
  const push = eio(lin(t, D.co, D.co + 0.45)), slide = eio(lin(t, D.pay, D.pay + 0.45)), reveal = eio(lin(t, D.ok, D.ok + 0.55))
  const count = t >= D.add + 0.75 ? 1 : 0
  const fly = lin(t, D.add + 0.08, D.add + 0.75)
  const open = t >= D.open && t < D.pick + 0.15 ? eo(lin(t, D.open, D.open + 0.3)) : 0
  const sel = t >= D.pick ? 0 : -1
  const hi = [...PAYS].reverse().find((p) => p.at && t >= p.at && t < D.pick)
  // cursor path (stage coords inside window viewport)
  const CUR = [{ t: 39.3, x: 420, y: 420 }, { t: 40.5, x: 132, y: 455 }, { t: 42.2, x: 360, y: 260 }, { t: 43.3, x: 140, y: 260 }, { t: 44.2, x: 360, y: 260 }, { t: 44.85, x: 250, y: 560 }, { t: 45.1, x: 250, y: 220 }, { t: 47.9, x: 300, y: 296 }, { t: 48.8, x: 250, y: 560 }]
  let ci = 0; while (ci < CUR.length - 1 && CUR[ci + 1].t - 0.5 <= t) ci++
  const c1 = CUR[ci], c0 = CUR[Math.max(0, ci - 1)], e = eio(lin(t, c1.t - 0.5, c1.t))
  const cx = ci === 0 ? mix(520, c1.x, e) : mix(c0.x, c1.x, e), cy = ci === 0 ? mix(640, c1.y, e) : mix(c0.y, c1.y, e)
  const clicks = [D.add, D.deliv, D.pay - 0.1, D.open - 0.05, D.pick, D.payBtn]
  const lc = [...clicks].reverse().find((c) => c <= t)
  const scroll = mix(0, 60, eio(lin(t, 38.6, 39.6)))
  return (
    <div className="dk">
      {/* home */}
      {t < D.co + 0.5 && (
        <div className="dk__pg" style={{ transform: `translateX(${push * 40}%)`, opacity: 1 - push }}>
          <div className="dk__h"><span className="ms__brand"><Mark size={34} t={99} at={0} />التقني</span><div className="dk__s"><Ico name="search" size={16} color="#999" />ابحث…</div>
            <span className="ms__cart" style={{ transform: `scale(${1 + 0.3 * Math.sin(clamp((t - D.add - 0.75) / 0.35) * Math.PI)})` }}><Ico name="shopping-cart" size={20} color="#fff" />{count > 0 && <i>1</i>}</span></div>
          <div style={{ transform: `translateY(${-scroll}px)` }}>
            <div className="dk__hero"><div><small>تشكيلة جديدة</small><b>هدايا الموسم وصلت</b></div><img src={perfume} /></div>
            <div className="dk__grid">
              {PRODUCTS.map((p, i) => {
                const hov = i === 1 && t > 39.6 && t < 41.4, added = i === 1 && t >= D.add + 0.08
                return (
                  <div key={p.id} className="dcard" style={{ transform: `translateY(${hov ? -6 : 0}px)`, boxShadow: hov ? '0 18px 40px rgba(0,0,0,.25)' : undefined }}>
                    <div className="dcard__img"><img src={p.img} /><span className="pcard__heart sm"><Ico name="heart" size={16} color="#fff" /></span></div>
                    <b>{p.name}</b><small>{p.cat}</small>
                    <div className="dcard__r"><span>{dl(p.price)}</span><i style={{ background: added ? GREEN : '#fff', transform: `scale(${t > D.add && t < D.add + 0.12 ? 0.85 : 1})` }}><Ico name={added ? 'check' : 'shopping-bag'} size={18} color={added ? '#fff' : INK} /></i></div>
                  </div>
                )
              })}
            </div>
          </div>
          {fly > 0 && fly < 1 && <img className="dk__fly" src={headphones} style={{ left: mix(150, 40, eio(fly)) - 28, top: mix(430 - scroll, 24, eio(fly)) - 28 - Math.sin(eio(fly) * Math.PI) * 120, transform: `scale(${1 - 0.6 * eio(fly)}) rotate(${-30 * eio(fly)}deg)` }} />}
          {t > D.add + 0.75 && <div className="dk__toast" style={{ opacity: life(t, D.add + 0.75, D.co - 0.1, 0.15, 0.2) }}><Ico name="circle-check" look="fill" size={18} color={GREEN} />تمت الإضافة للسلة</div>}
        </div>
      )}
      {/* delivery */}
      {page !== 'home' && t < D.pay + 0.5 && (
        <div className="dk__pg co" style={{ transform: `translateX(${(1 - push) * -40}%) translateX(${slide * 50}%)`, opacity: Math.min(push, 1 - slide) }}>
          <div className="steps2"><span data-on>السلة ✓</span><i data-on /><span data-on>الاستلام</span><i /><span>الدفع</span></div>
          <h3>كيف تبي تستلم طلبك؟</h3>
          <div className="opts2">
            <div className="opt2" data-on={t >= D.deliv || undefined}><Ico name="truck" look="duotone" size={34} color={GREEN} /><b>توصيل للبيت</b><small>لين باب بيتك</small></div>
            <div className="opt2" data-hover={(t > D.pickHover - 0.2 && t < D.pickHover + 0.8) || undefined}><Ico name="store" look="duotone" size={34} color="#888" /><b>استلام من المحل</b><small>جاهز خلال ساعة</small></div>
          </div>
          <div className="fld2">المدينة<span>{typed(t, D.deliv + 0.3, D.deliv + 0.8, 'طرابلس') || '—'}</span></div>
          <div className="btn2" style={{ transform: `scale(${t > D.pay - 0.15 && t < D.pay ? 0.95 : 1})` }}>متابعة للدفع</div>
        </div>
      )}
      {/* payment with dropdown */}
      {(page === 'pay' || (page === 'ok' && reveal < 1)) && (
        <div className="dk__pg co" style={{ transform: `translateX(${(1 - slide) * -50}%)`, opacity: slide }}>
          <div className="steps2"><span data-on>السلة ✓</span><i data-on /><span data-on>الاستلام ✓</span><i data-on /><span data-on>الدفع</span></div>
          <h3>طريقة الدفع</h3>
          <div className="dd" data-open={open > 0 || undefined}>
            {sel === 0 ? <span className="dd__v"><img src={pSadad} />سداد</span> : <span className="dd__v ph">اختار طريقة الدفع</span>}
            <Ico name="arrow-left" size={18} style={{ transform: `rotate(${open > 0 ? 90 : -90}deg)` }} />
          </div>
          {open > 0 && (
            <div className="ddm" style={{ opacity: open, transform: `translateY(${(1 - open) * -10}px)`, clipPath: `inset(0 0 ${(1 - open) * 100}% 0)` }}>
              {PAYS.map((p) => (
                <div key={p.k} className="ddm__i" data-hi={hi?.k === p.k || undefined}>
                  <span className="ddm__logo">{p.img ? <img src={p.img} /> : <Ico name="hand-coins" size={24} color={GREEN} />}</span>{p.n}
                </div>
              ))}
            </div>
          )}
          <div className="sum2"><span>المجموع</span><b>{dl(320)}</b></div>
          <div className="btn2" style={{ transform: `scale(${t > D.payBtn && t < D.payBtn + 0.14 ? 0.95 : 1})` }}>{t > D.payBtn + 0.1 ? <span className="spin" /> : <>ادفع {dl(320)}</>}</div>
        </div>
      )}
      {page === 'ok' && (
        <div className="dk__pg co okp2" style={{ clipPath: `circle(${reveal * 150}% at 50% 86%)` }}>
          <svg viewBox="0 0 120 120" width="120" height="120"><circle cx="60" cy="60" r="54" fill={GREEN} /><path d="M36 62 l16 16 l32 -34" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - eo(lin(t, D.ok + 0.25, D.ok + 0.6))} /></svg>
          <h3>تم الطلب!</h3><p>دفعت عن طريق سداد · توصيل لطرابلس</p>
        </div>
      )}
      {t < D.ok && <Cursor x={cx} y={cy} click={lc !== undefined ? (t - lc) / 0.45 : -1} />}
    </div>
  )
}
function Demo({ t }: { t: number }) {
  const w = spring(t, 37.85, 0.8)
  return (
    <>
      <Pop t={t} at={37.8} from={0.5} className="abs center" style={{ top: 64 }}><div className="livepill2"><i />شوف المثال</div></Pop>
      <div className="dwin2" style={{ transform: `translateY(${(1 - w) * 600}px) rotate(${(1 - w) * 8}deg)`, opacity: clamp(w * 2) }}>
        <Window url="altaqni-demo.ly" nav className="dwin2__w"><Desk t={t} /></Window>
      </div>
      <div className="mini" style={{ opacity: clamp(lin(t, 45.0, 45.3)) * (1 - lin(t, 49.6, 49.9)) }}>
        {[[41.75, 'truck', 'توصيل'], [43.3, 'store', 'استلام'], [45.0, 'credit-card', 'دفع']].map(([at, ic, s]) => <span key={s as string} className="mini__c" data-on={t >= (at as number) || undefined}><Ico name={ic as string} size={18} />{s}</span>)}
      </div>
    </>
  )
}

// ---------- 7. reveal: this video is our work ----------
function Reveal({ t }: { t: number }) {
  const z = eio(lin(t, 50.0, 50.9)), ph = lin(t, 50.2, 54.4)
  return (
    <>
      <BlurText t={t} at={50.15} text="والفيديو اللي تتفرج فيه توّا؟" className="h2" style={{ top: 80 }} />
      <div className="editor2" style={{ transform: `translate(-50%,0) scale(${mix(2.4, 1, z)})` }}>
        <div className="editor2__bar"><i /><i /><i /><span dir="ltr">techno_ly · store-promo.prj</span></div>
        <div className="editor2__prev"><img src={perfume} /><div className="editor2__ov"><Mark size={60} t={99} at={0} /></div></div>
        <div className="editor2__tl">
          {[[perfume, 0.02, 0.3], [headphones, 0.3, 0.55], [caseImg, 0.55, 0.8]].map(([src, a, b], i) => <div key={i} className="clip" style={{ left: `${(a as number) * 100}%`, width: `${((b as number) - (a as number)) * 100}%` }}><img src={src as string} /></div>)}
          <div className="trk2">{[[0.05, 0.5], [0.52, 0.95]].map(([a, b], i) => <span key={i} style={{ left: `${a * 100}%`, width: `${(b - a) * 100}%` }} />)}</div>
          <div className="trk2 wave">{Array.from({ length: 40 }).map((_, i) => <i key={i} style={{ height: `${20 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))}%` }} />)}</div>
          <div className="playhead" style={{ left: `${3 + ph * 94}%` }} />
        </div>
      </div>
      {t > 51.8 && <BlurText t={t} at={51.95} text="نفس الشغل اللي نديروه لمنتجك" hl={['لمنتجك']} className="h2" style={{ top: 780 }} />}
    </>
  )
}

// ---------- 8. CTA ----------
function Cta({ t }: { t: number }) {
  const f = t >= 57.25
  return (
    <>
      <div className="abs center" style={{ top: 150 }}><Mark size={170} t={t} at={54.6} blinkAt={[56.0, 58.6]} /></div>
      <Pop t={t} at={54.75} from={0.6} className="abs center" style={{ top: 360 }}><div className="dm2"><Ico name="message-circle" look="duotone" size={30} color={GREEN} />اكتبلنا في التعليقات أو الخاص</div></Pop>
      <Pop t={t} at={56.9} from={0.5} className="abs center" style={{ top: 480 }}>
        <StarBorder t={t}><span className="followb" dir="rtl" style={{ background: f ? '#fff' : INK, color: f ? INK : '#fff', transform: `scale(${t > 57.2 && t < 57.35 ? 0.93 : 1})` }}><Ico name={f ? 'circle-check' : 'user-plus'} size={24} color={f ? GREEN : '#fff'} />{f ? 'تتابع تقني' : 'تابع تقني'}</span></StarBorder>
      </Pop>
      <Sparks t={t} at={57.25} x={270} y={512} count={12} radius={110} size={18} />
      <Pop t={t} at={57.7} from={0.8} className="abs center" style={{ top: 640 }}><div className="endtag"><Logo k="tt" h={30} /><span dir="ltr">@techno_ly</span></div></Pop>
    </>
  )
}

export default function App({ t }: { t: number }) {
  return (
    <div className="ss-stage stage" data-theme="light">
      <div className="bg" />
      <Scene t={t} k="hook"><Hook t={t} /></Scene>
      <Scene t={t} k="why" kind="left"><Why t={t} /></Scene>
      <Scene t={t} k="dm"><Dm t={t} /></Scene>
      <Scene t={t} k="video" kind="zoom"><Video t={t} /></Scene>
      <Scene t={t} k="us" kind="zoom"><Us t={t} /></Scene>
      <Scene t={t} k="demo"><Demo t={t} /></Scene>
      <Scene t={t} k="reveal" kind="zoom"><Reveal t={t} /></Scene>
      <Scene t={t} k="cta"><Cta t={t} /></Scene>
    </div>
  )
}
