import React from 'react'
import { Window } from '../kit/window'
import { MacPointer } from '../kit/cursors'
import { Ico, Logo, BlurText, Pop } from './ui'
import { Mark } from './Mark'
import { lin, eo, eio, spring, clamp, mix, life } from './anim'

export const END = 46.5
// Scenes cut on the voice's pauses (silencedetect on the voice-over).
const SC = { noise: [0, 9.65], logo: [9.65, 11.55], feed: [11.55, 19.05], tut: [19.05, 26.3], cats: [26.3, 33.2], reveal: [33.2, 39.5], cta: [39.5, END + 1] } as const
function Scene({ t, k, children }: { t: number; k: keyof typeof SC; children: React.ReactNode }) {
  const [a, b] = SC[k]
  if (t < a - 0.01 || t > b + 0.35) return null
  const i = eo(lin(t, a, a + 0.4)), o = eio(lin(t, b, b + 0.32))
  return <div className="scene" style={{ opacity: a === 0 ? 1 - o : Math.min(i, 1 - o), transform: `translateY(${(1 - i) * 26 - o * 30}px) scale(${1 - o * 0.04})`, filter: o > 0 ? `blur(${o * 6}px)` : undefined }}>{children}</div>
}
const L = (k: string) => ('ai_' + k) as any
const Cursor = ({ x, y, click }: { x: number; y: number; click: number }) => (
  <div className="dcur" style={{ left: x, top: y }}>
    {click >= 0 && click < 1 && <span className="dcur__rip" style={{ transform: `translate(-50%,-50%) scale(${0.3 + eo(click) * 1.4})`, opacity: 1 - click }} />}
    <span style={{ display: 'block', transform: `translate(-11px,-8px) scale(${click >= 0 && click < 0.25 ? 0.85 : 1.25})`, transformOrigin: '11px 8px' }}><MacPointer /></span>
  </div>
)
// visual scan box (house style) in stage coordinates
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

// ---------- 1. Noise: too many AI tools ----------
const TILES = [
  ['openai', 70, 270, -6], ['claude', 200, 250, 4], ['gemini', 330, 280, -3], ['midjourney', 440, 300, 7],
  ['cursor', 40, 400, 5], ['perplexity', 160, 390, -5], ['deepseek', 290, 410, 3], ['runway', 410, 430, -7],
  ['elevenlabs', 80, 530, -4], ['suno', 210, 540, 6], ['mistral', 340, 545, -2], ['grok', 450, 560, 5],
  ['canva', 50, 660, 3], ['github-copilot', 180, 670, -6], ['notion', 310, 680, 4], ['figma', 430, 690, -3],
] as const
function Noise({ t }: { t: number }) {
  const grey = eo(lin(t, 5.3, 6.0))
  const scanX = mix(-60, 600, eio(lin(t, 5.6, 7.3)))
  return (
    <>
      {t < 5.3 && <BlurText t={t} at={0.4} text="كل أسبوع" className="h1" style={{ top: 92 }} />}
      {t < 5.3 && <BlurText t={t} at={1.3} text="أداة ذكاء اصطناعي جديدة" className="h2 hl-all" style={{ top: 152 }} />}
      {t >= 5.25 && <BlurText t={t} at={5.3} text="بس شن منهم" className="h1" style={{ top: 92 }} />}
      {t >= 5.25 && <BlurText t={t} at={6.0} text="يستاهل وقتك فعلاً؟" hl={['وقتك']} className="h1" style={{ top: 148 }} />}
      {TILES.map(([k, x, y, r], i) => {
        const at = 0.55 + i * 0.25
        const p = spring(t, at, 0.6)
        if (p <= 0) return null
        const jitter = t > 3.1 && t < 5.3 ? Math.sin(t * 26 + i) * 2.5 : 0
        const near = grey > 0 ? clamp(1 - Math.abs(scanX - (x + 48)) / 90) : 0
        return (
          <div key={k} className="tile" style={{ left: x, top: y, opacity: clamp(p * 2) * (1 - grey * 0.55) + near * grey * 0.5, transform: `rotate(${r + jitter}deg) scale(${(0.5 + 0.5 * p) * (1 - grey * 0.12 + near * 0.12)})`, filter: `grayscale(${grey * (1 - near)})` }}>
            <Logo k={L(k)} h={50} />
            {i % 2 === 0 && <Pop t={t} at={3.25 + (i / 2) * 0.17} out={5.3} from={0.3} className="best">الأقوى!</Pop>}
          </div>
        )
      })}
      {grey > 0 && t < 7.6 && <div className="lens" style={{ left: scanX - 46, top: 470, opacity: life(t, 5.6, 7.3, 0.2, 0.3) }}><Ico name="search" size={44} color="#1f9d63" /></div>}
      <BlurText t={t} at={3.15} text="وكل وحدة تقول إنها الأقوى" className="h2" style={{ top: 812, opacity: 1 - lin(t, 5.1, 5.35) }} />
      {t > 7.8 && <BlurText t={t} at={7.95} text="وكيف تستعملها صح؟" className="h2 hl-all" style={{ top: 812 }} />}
    </>
  )
}

// ---------- 2. Logo ----------
function LogoSc({ t }: { t: number }) {
  const ring = lin(t, 10.2, 11.0)
  return (
    <>
      <BlurText t={t} at={9.8} text="هذا شغلنا في" className="h2" style={{ top: 190 }} />
      <div className="abs center" style={{ top: 280 }}>
        {ring > 0 && ring < 1 && <span className="ring" style={{ width: 300, height: 300, top: 150, transform: `translate(-50%,-50%) scale(${0.6 + eo(ring) * 1.6})`, opacity: 1 - ring }} />}
        <Mark size={300} t={t} at={9.85} />
      </div>
      <Pop t={t} at={10.45} from={0.6} y={20} className="abs center" style={{ top: 610 }}><div className="wordmark">تقني</div></Pop>
      <Pop t={t} at={10.8} from={0.8} className="abs center" style={{ top: 748 }}><div className="handle">@techno_ly</div></Pop>
    </>
  )
}

// ---------- 3. Feed: newest AI tools, tested, what they do ----------
const FEED = [['claude', 'Claude', 'كتابة وتحليل'], ['cursor', 'Cursor', 'برمجة'], ['midjourney', 'Midjourney', 'صور'], ['elevenlabs', 'ElevenLabs', 'صوت'], ['runway', 'Runway', 'فيديو'], ['perplexity', 'Perplexity', 'بحث']] as const
function Feed({ t }: { t: number }) {
  const focus = eio(lin(t, 15.5, 16.1))
  return (
    <>
      <BlurText t={t} at={11.65} text="أحدث أدوات الذكاء الاصطناعي" className="h2" style={{ top: 80 }} />
      <Pop t={t} at={14.35} from={0.4} className="abs center" style={{ top: 138 }}><div className="greenpill"><Ico name="radar" size={22} color="#fff" />أول بأول</div></Pop>
      <div className="feed" dir="rtl" style={{ opacity: 1 - focus * 0.85, filter: `blur(${focus * 3}px)` }}>
        {FEED.map(([k, n, c], i) => {
          const p = spring(t, 12.1 + i * 0.36, 0.6)
          return (
            <div key={k} className="fcard" style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 60}px)` }}>
              <span className="fcard__logo"><Logo k={L(k)} h={40} /></span>
              <span className="fcard__t"><b dir="ltr">{n}</b><small>{c}</small></span>
              <span className="new">جديد</span>
            </div>
          )
        })}
      </div>
      {focus > 0 && (
        <div className="test" dir="rtl" style={{ opacity: focus, transform: `translate(-50%, ${(1 - focus) * 40}px) scale(${0.9 + 0.1 * focus})` }}>
          <div className="test__h"><span className="fcard__logo"><Logo k={L('cursor')} h={44} /></span><b dir="ltr">Cursor</b><span className="tested" style={{ opacity: lin(t, 16.4, 16.6), transform: `rotate(-8deg) scale(${1.6 - 0.6 * spring(t, 16.4, 0.5)})` }}>جرّبناها ✓</span></div>
          {['سجّلنا ودخلنا', 'جرّبناها على مشروع حقيقي', 'شفنا النتيجة'].map((s, i) => {
            const at = 15.75 + i * 0.25, d = lin(t, at, at + 0.2)
            return <div key={s} className="test__row" style={{ opacity: clamp(lin(t, at - 0.1, at + 0.1)) }}><span className="chk" style={{ background: d > 0.5 ? '#1f9d63' : undefined, borderColor: d > 0.5 ? '#1f9d63' : undefined }}>{d > 0.5 && <Ico name="check" size={16} color="#fff" />}</span>{s}</div>
          })}
          <div className="caps">
            {['يكتب كود', 'يصلّح الأخطاء', 'يشرح المشروع'].map((c, i) => <Pop key={c} t={t} at={17.15 + i * 0.4} from={0.4}><span className="cap2">{c}</span></Pop>)}
          </div>
        </div>
      )}
      {t > 16.7 && <BlurText t={t} at={16.85} text="شن تقدر تدير بيها بالضبط" hl={['بالضبط']} className="h3" style={{ top: 812 }} />}
    </>
  )
}

// ---------- 4. Tutorial: step by step on the tool's screen, code to try ----------
function Tut({ t }: { t: number }) {
  const prompt = 'صمّم شعار لمقهى'.slice(0, Math.round(lin(t, 20.45, 21.1) * 15))
  const res = spring(t, 21.75, 0.6)
  const code = spring(t, 23.0, 0.7)
  const copied = t >= 23.75
  const ran = t >= 25.25
  const step = t < 20.25 ? 0 : t < 21.15 ? 1 : 2
  const CUR = [{ t: 19.75, x: 458, y: 260 }, { t: 20.35, x: 300, y: 356 }, { t: 21.3, x: 438, y: 407 }, { t: 23.65, x: 455, y: 588 }, { t: 25.1, x: 360, y: 588 }]
  let ci = 0; while (ci < CUR.length - 1 && CUR[ci + 1].t - 0.6 <= t) ci++
  const c0 = CUR[Math.max(0, ci - 1)], c1 = CUR[ci], e = ci === 0 ? eio(lin(t, c1.t - 0.6, c1.t)) : eio(lin(t, c1.t - 0.6, c1.t))
  const cx = ci === 0 ? mix(560, c1.x, e) : mix(c0.x, c1.x, e), cy = ci === 0 ? mix(700, c1.y, e) : mix(c0.y, c1.y, e)
  const lastClick = [...CUR].reverse().find((k) => k.t <= t)
  return (
    <>
      <div className="dstep" dir="rtl" style={{ top: 50 }}>
        <div className="dstep__top"><span className="dstep__n">{['١', '٢', '٣'][step]}</span><span className="dstep__t">شرح خطوة بخطوة</span></div>
        <div className="dstep__path" dir="ltr">{['Sign in', 'Prompt', 'Generate'].map((p, i) => <React.Fragment key={p}>{i > 0 && <span className="dstep__arr">›</span>}<span className="dstep__pill" data-on={i === step || undefined} data-past={i < step || undefined}>{p}</span></React.Fragment>)}</div>
      </div>
      <Window url="ai-tool.app" className="twin" nav>
        <div className="tool">
          <div className="tool__nav"><span className="tool__brand"><Ico name="bot" look="duotone" size={20} color="#1f9d63" />AI Tool</span><span className="tool__btn" style={{ background: t > 19.8 ? '#1f9d63' : undefined, color: t > 19.8 ? '#fff' : undefined }}>{t > 19.8 ? 'Signed in ✓' : 'Sign in'}</span></div>
          <div className="tool__body">
            <div className="tool__h">What do you want to create?</div>
            <div className="tool__in" dir="rtl" data-focus={(t > 20.35 && t < 21.3) || undefined}>{prompt || <span style={{ color: '#aaa' }}>اكتب فكرتك…</span>}</div>
            <div className="tool__row"><span className="tool__gen" style={{ transform: t > 21.3 && t < 21.45 ? 'scale(.95)' : undefined }}><Ico name="wand" size={16} color="#fff" />Generate</span></div>
            <div className="tool__res" style={{ opacity: clamp(res * 2), transform: `scale(${0.9 + 0.1 * res})` }}>
              {[0, 1, 2].map((i) => <span key={i} className="tool__img" style={{ opacity: clamp(lin(t, 21.8 + i * 0.12, 22.1 + i * 0.12)) }}><Ico name="image" look="duotone" size={34} color="#1f9d63" /></span>)}
            </div>
          </div>
        </div>
      </Window>
      <Scan t={t} a={19.3} b={20.2} x={400} y={236} w={110} h={45} label="سجّل دخول" />
      <Scan t={t} a={20.25} b={21.15} x={36} y={327} w={468} h={54} label="اكتب طلبك" />
      <Scan t={t} a={21.15} b={22.0} x={366} y={383} w={138} h={44} label="Generate" below />
      {t > 21.1 && <BlurText t={t} at={21.2} text="على الشاشة الحقيقية للأداة" className="h3" style={{ top: 560, opacity: 1 - lin(t, 22.7, 22.95) }} />}
      <div className="codecard" style={{ opacity: clamp(code * 2), transform: `translateY(${(1 - code) * 220}px)` }}>
        <div className="codecard__bar"><span dir="ltr">example.py</span><span style={{ flex: 1 }} />
          <span className="cbtn" style={{ transform: t > 25.1 && t < 25.25 ? 'scale(.94)' : undefined }}><Ico name="play" look="fill" size={14} />Run</span>
          <span className="cbtn" style={{ transform: t > 23.65 && t < 23.8 ? 'scale(.94)' : undefined, color: copied ? '#1f9d63' : undefined }}><Ico name={copied ? 'check' : 'copy'} size={14} />{copied ? 'Copied' : 'Copy'}</span></div>
        <pre dir="ltr">{`from tool import Client\n\nclient = Client()\nresult = client.generate("logo for a café")\nprint(result.url)`}</pre>
        <div className="codecard__out" dir="ltr" style={{ opacity: ran ? 1 : 0 }}>✓ done · https://…/result.png</div>
      </div>
      {t > 22.9 && <BlurText t={t} at={22.98} text="والكود كامل" className="h3 hl-all" style={{ top: 880, opacity: 1 - lin(t, 24.8, 25.0) }} />}
      {t > 24.85 && <BlurText t={t} at={24.95} text="باش تجرّب بإيدك" className="h3" style={{ top: 880 }} />}
      {t > 19.2 && <Cursor x={cx} y={cy} click={lastClick ? (t - lastClick.t) / 0.45 : -1} />}
    </>
  )
}

// ---------- 5. Categories + what every explainer is ----------
const CATS = [
  { at: 27.04, icon: 'pen-line', label: 'كتابة', logos: ['claude', 'openai'] },
  { at: 27.57, icon: 'palette', label: 'تصميم', logos: ['midjourney', 'canva'] },
  { at: 28.2, icon: 'code', label: 'برمجة', logos: ['cursor', 'github-copilot'] },
  { at: 28.83, icon: 'clapperboard', label: 'فيديو', logos: ['runway', 'elevenlabs'] },
]
function Cats({ t }: { t: number }) {
  const up = eio(lin(t, 29.7, 30.3))
  return (
    <>
      <div className="cats" dir="rtl" style={{ top: mix(220, 120, up) }}>
        {CATS.map((c) => {
          const p = spring(t, c.at, 0.6)
          return (
            <div key={c.label} className="cat" style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})` }}>
              <span className="cat__ico"><Ico name={c.icon} look="duotone" size={46} color="#1f9d63" /></span>
              <b>{c.label}</b>
              <span className="cat__logos">{c.logos.map((k) => <Logo key={k} k={L(k)} h={24} />)}</span>
            </div>
          )
        })}
      </div>
      <div className="traits" dir="rtl">
        {[[30.41, 'scissors', 'مختصر'], [30.84, 'send', 'مباشر'], [31.48, 'target', 'يوصل للنقطة']].map(([at, ic, s]) => {
          const p = spring(t, at as number, 0.6)
          return <div key={s as string} className="trait" style={{ opacity: clamp(p * 2), transform: `translateX(${(1 - p) * -60}px)` }}><span><Ico name={ic as string} size={30} color="#fff" /></span>{s}</div>
        })}
      </div>
    </>
  )
}

// ---------- 6. Reveal: this video was made in a motion editor ----------
function Reveal({ t }: { t: number }) {
  const z = eio(lin(t, 34.9, 35.9))
  const ph = lin(t, 35.2, 39.5)
  return (
    <>
      <BlurText t={t} at={33.8} text="وبالمناسبة…" className="h2" style={{ top: 90, opacity: 1 - lin(t, 34.7, 34.9) }} />
      {t > 34.75 && <BlurText t={t} at={34.85} text="الفيديو اللي تتفرج فيه توّا" className="h2" style={{ top: 90 }} />}
      <div className="editor" style={{ transform: `translate(-50%, 0) scale(${mix(2.6, 1, z)})`, opacity: clamp(lin(t, 34.85, 35.1)) }}>
        <div className="editor__bar"><i /><i /><i /><span dir="ltr">techno_ly · motion.prj</span></div>
        <div className="editor__main">
          <div className="editor__prev">
            <div style={{ position: 'absolute', left: '50%', top: 40, transform: 'translateX(-50%)' }}><Mark size={120} t={99} at={0} /></div>
            <div className="editor__wm">تقني</div>
          </div>
          <div className="editor__side" dir="ltr">{['Logo', 'Text', 'Scan', 'Cursor', 'Voice'].map((l, i) => <span key={l} data-on={i === Math.floor(ph * 5) % 5 || undefined}><Ico name="layers" size={12} />{l}</span>)}</div>
        </div>
        <div className="editor__tl">
          {[[0.02, 0.4, '#3ecf8e'], [0.15, 0.7, '#a7e9c9'], [0.35, 0.95, '#cdeee0'], [0.5, 0.8, '#e5e5e5']].map(([a, b, c], i) => <div key={i} className="trk"><span style={{ left: `${(a as number) * 100}%`, width: `${((b as number) - (a as number)) * 100}%`, background: c as string }} /></div>)}
          <div className="trk wave">{Array.from({ length: 48 }).map((_, i) => <i key={i} style={{ height: `${20 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))}%` }} />)}</div>
          <div className="playhead" style={{ left: `${4 + ph * 92}%` }} />
        </div>
      </div>
      {t > 36.9 && <BlurText t={t} at={36.98} text="تقدر يكون عندك واحد زيه" className="h2" style={{ top: 760 }} />}
      {t > 37.6 && <Pop t={t} at={37.85} from={0.5} className="abs center" style={{ top: 820 }}><div className="greenpill"><Ico name="clapperboard" size={22} color="#fff" />لمشروعك</div></Pop>}
    </>
  )
}

// ---------- 7. CTA ----------
function Cta({ t }: { t: number }) {
  const follow = t >= 40.35
  const typed = 'اشرحولنا Cursor'.slice(0, Math.round(lin(t, 41.2, 42.4) * 15))
  const sent = t >= 42.65
  const vid = spring(t, 43.3, 0.7)
  return (
    <>
      <div className="abs" style={{ left: 40, top: 70 }}><Mark size={92} t={t} at={39.75} /></div>
      <Pop t={t} at={39.95} from={0.6} className="abs" style={{ left: 150, top: 92 }}>
        <span className="follow" dir="rtl" style={{ transform: `scale(${t >= 40.3 && t < 40.45 ? 0.92 : 1})`, background: follow ? '#fff' : '#1f9d63', color: follow ? '#1f9d63' : '#fff' }}><Ico name={follow ? 'circle-check' : 'user-plus'} size={22} />{follow ? 'تتابع تقني' : 'تابع تقني'}</span>
      </Pop>
      <Pop t={t} at={40.4} y={30} from={0.8} className="abs" style={{ left: 30, right: 30, top: 230 }}>
        <div className="comments" dir="rtl">
          <div className="comments__h"><Ico name="message-circle" size={20} />التعليقات</div>
          {sent && <div className="cmt" style={{ opacity: lin(t, 42.65, 42.85) }}><span className="cmt__av">أ</span><div><small>متابع</small>اشرحولنا Cursor</div></div>}
          <div className="cin"><span className="cin__f" data-empty={!typed || sent || undefined}>{sent ? 'اكتب اسم الأداة اللي تبيها…' : typed || 'اكتب اسم الأداة اللي تبيها…'}</span><span className="cin__s" style={{ transform: t > 42.55 && t < 42.7 ? 'scale(.9)' : undefined }}><Ico name="send" size={20} color="#fff" /></span></div>
        </div>
      </Pop>
      {vid > 0 && (
        <div className="vcard" style={{ opacity: clamp(vid * 2), transform: `translate(-50%,0) scale(${0.7 + 0.3 * vid})` }}>
          <div className="vcard__thumb"><Logo k={L('cursor')} h={70} /><span className="vcard__play"><Ico name="play" look="fill" size={30} color="#fff" /></span></div>
          <div className="vcard__t" dir="rtl"><b>شرح Cursor كامل</b><small>فيديو جاي على طلبك</small></div>
        </div>
      )}
      <Pop t={t} at={44.6} from={0.8} className="abs center" style={{ top: 862 }}><div className="endtag"><Logo k="tt" h={30} /><span dir="ltr">@techno_ly</span></div></Pop>
    </>
  )
}

export default function App({ t }: { t: number }) {
  return (
    <div className="ss-stage stage" data-theme="light">
      <div className="bg" />
      <Scene t={t} k="noise"><Noise t={t} /></Scene>
      <Scene t={t} k="logo"><LogoSc t={t} /></Scene>
      <Scene t={t} k="feed"><Feed t={t} /></Scene>
      <Scene t={t} k="tut"><Tut t={t} /></Scene>
      <Scene t={t} k="cats"><Cats t={t} /></Scene>
      <Scene t={t} k="reveal"><Reveal t={t} /></Scene>
      <Scene t={t} k="cta"><Cta t={t} /></Scene>
    </div>
  )
}
