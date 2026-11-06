import React from 'react'
import { Phone } from '../../kit/phone'
import { Window } from '../../kit/window'
import { Ico } from '../ui'
import assets from '../assets.json'
import { lin, eo, eio, spring, clamp, mix } from '../anim'

// «جاهز JAHIZ» — order-ready alerts for restaurants. Hero: the order ticket ٤٧ that travels the whole film.
// Two devices only: the customer's phone and the restaurant's dashboard. Timings estimated until the voice arrives.
const G = '#22c55e', GT = '#16a34a', NAVY = '#0b1b3a', RED = '#e5484d'
export const T = { hook: 0, name: 3.4, scan: 5.6, num: 8.6, wait: 11.6, press: 13.6, notif: 17.0, noapp: 20.6, owner: 23.8, open: 28.8, end: 32.6, total: 35 }
const AR = (n: number | string) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])
const raw = (k: string) => ((assets.logos as any)[k] as string).replace(/<title>.*?<\/title>/, '')
const Logo = ({ k, h }: { k: string; h: number }) => <span style={{ display: 'inline-flex', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: raw(k).replace(/ width="[^"]*"| height="[^"]*"/g, '').replace('<svg', `<svg style="height:${h}px;width:auto;display:block"`) }} />

// ── brand mark: navy tile, green check drawn on ─────────────────────────────
function Mark({ s = 64, draw = 1 }: { s?: number; draw?: number }) {
  return <svg viewBox="0 0 64 64" width={s} height={s}><rect width="64" height="64" rx="18" fill={NAVY} />
    <path d="M18 33 L28 43 L47 22" fill="none" stroke={G} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="48" strokeDashoffset={48 * (1 - draw)} /></svg>
}
// seeded QR-like pattern (illustrative)
function QR({ s = 120, seed = 3 }: { s?: number; seed?: number }) {
  let x = seed; const r = () => (x = (x * 16807) % 2147483647) / 2147483647
  const n = 21, c = s / n, cells: React.ReactNode[] = []
  const finder = (i: number, j: number) => [[0, 0], [0, n - 7], [n - 7, 0]].some(([a, b]) => i >= a && i < a + 7 && j >= b && j < b + 7)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (finder(i, j)) continue; if (r() > .52) cells.push(<rect key={i * n + j} x={j * c} y={i * c} width={c} height={c} />) }
  const F = ([a, b]: number[], k: number) => <g key={'f' + k}><rect x={b * c} y={a * c} width={7 * c} height={7 * c} rx={c} /><rect x={(b + 1) * c} y={(a + 1) * c} width={5 * c} height={5 * c} fill="#fff" rx={c * .6} /><rect x={(b + 2) * c} y={(a + 2) * c} width={3 * c} height={3 * c} rx={c * .4} /></g>
  return <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} fill={NAVY}>{cells}{[[0, 0], [0, n - 7], [n - 7, 0]].map(F)}</svg>
}
function Ticket({ num = 47, s = 1, style }: { num?: number; s?: number; style?: React.CSSProperties }) {
  return <div className="tk9" style={{ ...style, transform: `${style?.transform || ''} scale(${s})` }}>
    <small>رقم الطلب</small><b>{AR(num)}</b><i /></div>
}

// ── phone screens (true points, 402 wide) ────────────────────────────────────
const Scr = ({ children, bg = '#fff' }: { children: React.ReactNode; bg?: string }) => <div className="sc9" style={{ background: bg }} dir="rtl">{children}</div>
const Url = () => <div className="url9" dir="ltr"><Ico name="sparkles" size={11} color="#8a93a6" /> jahiz · Demo Restaurant</div>
function Camera({ t }: { t: number }) {
  const sc = (t - T.scan - .3) % 1.1 / 1.1, found = t > 7.3
  return <Scr bg="#1d1f24">
    <div className="cam9"><div className="tent9"><div className="tent9__h"><Mark s={18} /> امسح وتابع طلبك</div><QR s={150} /></div>
      <div className="vf9" style={{ borderColor: found ? G : '#fff' }}><i /><i /><i /><i /></div>
      {!found && <div className="scan9" style={{ top: `${18 + sc * 62}%` }} />}
      {found && <div className="pill9" style={{ transform: `translateX(-50%) scale(${spring(t, 7.3, .5)})` }}><Ico name="check" size={14} color="#fff" /> Demo Restaurant</div>}
    </div></Scr>
}
function Enter({ t }: { t: number }) {
  const typed = t > 9.3 ? (t > 9.6 ? '47' : '4') : '', btn = t > 10.3 && t < 10.55, dlg = t > 10.55 && t < 11.45
  return <Scr>
    <Url />
    <div className="rs9"><div className="rs9__logo"><Ico name="coffee" size={30} color="#fff" /></div><b>Demo Restaurant</b><small>الفرع الرئيسي</small></div>
    <div className="lab9">رقم طلبك</div>
    <div className="inp9" style={{ borderColor: typed ? G : '#dfe3ea' }}><span className="num">{AR(typed)}</span>{t > 8.9 && t < 10.3 && Math.floor(t * 2) % 2 === 0 && <i className="car" />}</div>
    <div className="btn9" style={{ transform: `scale(${btn ? .95 : 1})`, background: t > 11.45 ? GT : NAVY }}><Ico name={t > 11.45 ? 'check' : 'bell'} size={18} color="#fff" />{t > 11.45 ? 'الإشعارات مفعّلة' : 'فعّل إشعارات الطلب'}</div>
    <div className="note9">بدون تسجيل وبدون تطبيق</div>
    {dlg && <div className="dlg9" style={{ opacity: clamp(lin(t, 10.55, 10.7)) }}><div className="dlg9__c"><b dir="ltr">“jahiz” Would Like to Send You Notifications</b><div className="dlg9__r" dir="ltr"><span>Don’t Allow</span><span className="on" style={{ background: t > 11.15 ? 'rgba(0,122,255,.15)' : undefined }}>Allow</span></div></div></div>}
  </Scr>
}
function Status({ t, ready }: { t: number; ready: number }) {
  const steps = ['جديد', 'قيد التحضير', 'جاهز']
  const cur = ready > 0 ? 2 : 1, pulse = .5 + .5 * Math.sin(t * 6)
  return <Scr>
    <Url />
    <div className="st9"><small>Demo Restaurant</small><div className="st9__n">{AR(47)}</div><span>طلبك</span></div>
    <div className="steps9">{steps.map((s, i) => <div key={i} className={'s' + (i < cur ? ' done' : i === cur ? ' cur' : '')}>
      <i style={i === cur && cur === 1 ? { boxShadow: `0 0 0 ${4 + pulse * 6}px rgba(34,197,94,${.25 * (1 - pulse) + .1})` } : undefined}>{i < cur || (i === 2 && ready > 0) ? <Ico name="check" size={14} color="#fff" /> : null}</i><b>{s}</b></div>)}</div>
    <div className="eta9"><Ico name="clock" size={16} color="#8a93a6" /> نخبّروك أول ما يجهز</div>
    {ready > 0 && <div className="rdy9" style={{ clipPath: `circle(${eo(ready) * 150}% at 50% 40%)` }}>
      <div className="rdy9__c" style={{ transform: `scale(${spring(t, T.notif + 1.6, .6)})` }}><Ico name="check" size={64} color={GT} /></div>
      <b>طلبك جاهز!</b><span>رقم {AR(47)} · تفضّل للاستلام</span></div>}
  </Scr>
}
function Banner({ t, at }: { t: number; at: number }) {
  const s = spring(t, at, .55); if (t < at) return null
  return <div className="nt9" style={{ transform: `translateY(${(1 - s) * -120}px)`, opacity: clamp(s * 3) }} dir="rtl">
    <Mark s={34} /><div><div className="nt9__h"><b>جاهز</b><small>الآن</small></div><span>طلبك رقم {AR(47)} جاهز للاستلام ✅</span></div></div>
}

// ── dashboard ────────────────────────────────────────────────────────────────
const SIDE = [['list', 'الطلبات'], ['store', 'الفروع'], ['qr-code', 'رموز QR'], ['chart-column', 'الإحصائيات'], ['users', 'الموظفين']]
function Side({ on }: { on: number }) {
  return <div className="sd9" dir="rtl"><div className="sd9__b"><Mark s={22} /><b>جاهز</b></div>
    {SIDE.map(([ic, l], i) => <div key={i} className={'sd9__i' + (i === on ? ' on' : '')}><Ico name={ic} size={15} color={i === on ? NAVY : '#7b8496'} />{l}</div>)}</div>
}
function Orders({ t, pressAt }: { t: number; pressAt: number }) {
  const rows: [number, string, number][] = [[45, 'جاهز', 2], [46, 'قيد التحضير', 1], [47, 'قيد التحضير', 1], [48, 'جديد', 0]]
  return <div className="od9" dir="rtl"><div className="od9__h"><b>الطلبات النشطة</b><span className="add"><Ico name="plus" size={13} color="#fff" /> طلب جديد</span></div>
    {rows.map(([n, s, k], i) => { const is47 = n === 47, done = is47 && t > pressAt, dn = is47 ? Math.max(0, 1 - Math.abs(t - pressAt) / .15) : 0
      return <div key={n} className={'or9' + (is47 ? ' hl' : '')} style={{ background: done ? '#ecfdf3' : undefined }}>
        <span className="no">#{AR(n)}</span><span className={'tag k' + (done ? 2 : k)}>{done ? 'جاهز' : s}</span>
        {k < 2 && !done ? <span className="go" style={{ transform: `scale(${1 - .08 * dn})` }}><Ico name="bell-ring" size={13} color="#fff" /> الطلب جاهز</span> : <span className="ok"><Ico name="check-check" size={15} color={GT} /> {is47 ? 'وصل الإشعار' : 'تم'}</span>}
      </div> })}
  </div>
}
function Dash({ t, children, on = 0 }: { t: number; children: React.ReactNode; on?: number }) {
  return <Window title="لوحة المطعم" sidebar={<Side on={on} />} sidebarWidth={118} className="win9">{children}</Window>
}
function Branches({ t }: { t: number }) {
  const a = T.owner + .6
  return <div className="br9" dir="rtl">
    <div className="br9__stats">{[['طلبات اليوم', 128], ['جاهزة', 121], ['متوسط التحضير', '٦ د']].map(([l, v], i) => <div key={i} style={{ opacity: clamp(lin(t, a + i * .2, a + i * .2 + .3)) }}><small>{l}</small><b>{typeof v === 'number' ? AR(Math.round(mix(0, v, eo(lin(t, a + .2, a + 1.4))))) : v}</b></div>)}</div>
    <div className="br9__h">الفروع</div>
    {['الفرع الرئيسي', 'فرع المدينة', 'فرع الشاطئ'].map((b, i) => { const s = spring(t, a + .9 + i * .3, .6)
      return <div key={i} className="br9__c" style={{ opacity: clamp(s * 2), transform: `translateY(${(1 - s) * 16}px)` }}><QR s={44} seed={7 + i} /><div><b>{b}</b><small>QR خاص بالفرع</small></div></div> })}
  </div>
}

// ── stage helpers ────────────────────────────────────────────────────────────
const HEAD: [number, number, string, Record<string, string>?][] = [
  [0, 3.3, 'كم مرة وقفت قدام الكاشير تستنى؟', { 'تستنى؟': 'r' }], [3.4, 5.5, 'توا مع «جاهز»', {}], [5.6, 8.5, 'تمسح الكود اللي على الطاولة', { 'الكود': 'g' }],
  [8.6, 11.5, 'تكتب رقم طلبك وتفعّل الإشعارات', { 'الإشعارات': 'g' }], [11.6, 13.5, 'وتقعد في بلاصتك', {}], [13.6, 16.9, 'أول ما يجهز… زر واحد', { 'واحد': 'g' }],
  [17.0, 20.5, 'ويجيك إشعار على تلفونك', { 'إشعار': 'g' }], [20.6, 23.7, 'بدون تطبيق… وبدون تسجيل', {}], [23.8, 28.7, 'وصاحب المطعم… لوحة وحدة', { 'وحدة': 'g' }],
  [28.8, 32.5, 'مجاني ومفتوح المصدر', { 'مجاني': 'g' }]]
function Headline({ t }: { t: number }) {
  const h = HEAD.find(h => t >= h[0] - .05 && t < h[1]); if (!h) return null
  const [a, b, s, hl] = h, q = lin(t, b - .18, b)
  return <div className="hl9" dir="rtl" style={{ fontSize: s.length > 26 ? 26 : s.length > 20 ? 29 : 34, opacity: 1 - q, filter: `blur(${q * 8}px)` }}>
    {s.split(' ').map((w, i) => { const p = a < .1 ? 1 : eo(lin(t, a + i * .06, a + i * .06 + .32)); const c = hl?.[w]
      return <span key={i} style={{ opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * 14}px)`, color: c === 'r' ? RED : c === 'g' ? GT : undefined }}>{w}</span> })}
  </div>
}
function At({ x, y, s = 1, r = 0, o = 1, z = 2, children }: { x: number; y: number; s?: number; r?: number; o?: number; z?: number; children: React.ReactNode }) {
  if (o <= 0) return null
  return <div style={{ position: 'absolute', left: x, top: y, zIndex: z, opacity: o, transform: `translate(-50%,-50%) scale(${s}) rotate(${r}deg)` }}>{children}</div>
}
const Chip = ({ children, cls = '' }: { children: React.ReactNode; cls?: string }) => <div className={'chip9 ' + cls} dir="rtl">{children}</div>
function Pop({ t, at, out = 1e9, x, y, children, r = 0 }: { t: number; at: number; out?: number; x: number; y: number; children: React.ReactNode; r?: number }) {
  const s = spring(t, at, .55), q = lin(t, out, out + .2); if (t < at || q >= 1) return null
  return <At x={x} y={y + (1 - s) * 20} s={(.4 + .6 * s) * (1 - .1 * q)} r={r} o={clamp(s * 3) * (1 - q)} z={6}>{children}</At>
}
function Strike({ t, at }: { t: number; at: number }) {
  const p = eo(lin(t, at, at + .3)); return <i className="strike9" style={{ width: `${p * 112}%` }} />
}

// ── the film ─────────────────────────────────────────────────────────────────
function Film({ t }: { t: number }) {
  const P = (a: number, d = .6) => eio(lin(t, a, a + d))
  const out: React.ReactNode[] = []
  // HOOK: receipt prints, pager blinks, waiting clock
  if (t < T.name + .6) {
    const pr = mix(.92, 1, eo(lin(t, 0, .8))), leave = P(T.name, .5)
    out.push(<At key="rc" x={252} y={mix(470, 430, pr) - leave * 700} r={mix(-2, -5, pr)} s={mix(1.15, 1, pr)}><div className="rc9" style={{ clipPath: `inset(0 0 ${(1 - pr) * 100}% 0)` }}>
      <div className="rc9__h">Demo Restaurant</div><div className="rc9__d">— — — — — — — —</div><Ticket num={47} s={1.25} /><div className="rc9__d">— — — — — — — —</div>
      <div className="rc9__l"><span>برجر لحم</span><span>٢٥</span></div><div className="rc9__l"><span>بطاطا</span><span>٨</span></div><div className="rc9__zig" /></div></At>)
    const blink = Math.floor(t * 4) % 2
    out.push(<At key="pg" x={420} y={640 - leave * 600} r={8 + Math.sin(t * 40) * (blink ? 2 : 0)} o={clamp(lin(t, .5, .8))}><div className="pager9"><i style={{ background: blink ? RED : '#5a2224' }} /><i style={{ background: !blink ? RED : '#5a2224' }} /><i style={{ background: blink ? RED : '#5a2224' }} /><span>٤٧</span></div></At>)
    out.push(<Pop key="ck" t={t} at={1.6} out={T.name} x={100} y={640}><Chip cls="r"><Ico name="clock" size={18} color={RED} /> ١٥ دقيقة واقف</Chip></Pop>)
  }
  // NAME: the mark draws, ring burst
  if (t >= T.name - .1 && t < T.scan + .5) {
    const a = T.name + .15, s = spring(t, a, .7), q = P(T.scan, .45)
    const ring = lin(t, a + .3, a + 1.1)
    out.push(<At key="nm" x={252} y={mix(470, 260, q)} s={(.5 + .5 * s) * mix(1, .45, q)} o={clamp(s * 3) * (1 - lin(t, T.scan + .2, T.scan + .5))}>
      <div className="name9"><Mark s={120} draw={eo(lin(t, a + .2, a + .7))} /><b>جاهز</b><span dir="ltr">JAHIZ</span></div></At>)
    if (ring > 0 && ring < 1) out.push(<At key="rg" x={252} y={430} o={1 - ring}><div className="ring9" style={{ width: 160 + ring * 420, height: 160 + ring * 420 }} /></At>)
  }
  // PHONE: enters at scan, centred; moves right when the dashboard arrives; back to centre for the alert
  if (t >= T.scan && t < T.owner + .4) {
    const enter = P(T.scan, .7), side = P(T.press - .1, .5) * (1 - P(T.notif - .1, .55)), toOwner = P(T.noapp + 2.6, .5)
    const ready = lin(t, T.notif + 1.2, T.notif + 1.8), shake = t > T.notif + .4 && t < T.notif + 1.1 ? Math.sin(t * 90) * 5 : 0
    const x = mix(252, 820, side) + shake, y = mix(1150, 560, enter) + P(T.noapp, .5) * 40 + toOwner * 700, s = .78
    let screen: React.ReactNode
    if (t < T.num) screen = <Camera t={t} />
    else if (t < T.wait) screen = <Enter t={t} />
    else screen = <Status t={t} ready={ready} />
    out.push(<At key="ph" x={x} y={y} s={s} z={4}><div className="ph9"><Phone width={380} frame="pro" time="9:41">{screen}{t > T.notif && <Banner t={t} at={T.notif + .35} />}</Phone></div></At>)
    // the ticket flies from the receipt corner into the input
    const fl = lin(t, 9.0, 9.6); if (fl > 0 && fl < 1) out.push(<At key="tf" x={mix(90, 250, eio(fl))} y={mix(300, 540, eio(fl))} s={mix(.9, .3, eio(fl))} o={1 - lin(fl, .8, 1)} z={7}><Ticket /></At>)
    if (t < T.press) out.push(<Pop key="tk" t={t} at={8.7} out={9.0} x={90} y={300} r={-8}><Ticket /></Pop>)
    // no app, no sign-up
    out.push(<Pop key="n1" t={t} at={T.noapp + .2} out={T.owner} x={110} y={250} r={-4}><Chip><Ico name="download" size={18} color="#555" /><span className="st">تنزيل تطبيق<Strike t={t} at={T.noapp + .7} /></span></Chip></Pop>)
    out.push(<Pop key="n2" t={t} at={T.noapp + 1.4} out={T.owner} x={400} y={250} r={4}><Chip><Ico name="user-plus" size={18} color="#555" /><span className="st">إنشاء حساب<Strike t={t} at={T.noapp + 1.9} /></span></Chip></Pop>)
    out.push(<Pop key="n3" t={t} at={T.noapp + 2.2} out={T.owner} x={252} y={865}><Chip cls="g"><Ico name="qr-code" size={18} color="#fff" /> مسح QR بس</Chip></Pop>)
  }
  // DASHBOARD: slides in from the left at press; then fills the stage for the owner
  if (t >= T.press - .2 && t < T.open + .5) {
    const enter = P(T.press - .1, .6), leave = P(T.notif - .1, .5), back = P(T.owner, .7), gone = P(T.open, .5)
    const x = t < T.owner ? mix(-340, 252, enter) - leave * 640 : mix(-400, 252, back) - gone * 600
    const s = .86, on = t < T.owner ? 0 : t < T.owner + 2.7 ? 1 : 3
    out.push(<At key="db" x={x} y={480} s={s} z={3}><Dash t={t} on={on}>{t < T.owner ? <Orders t={t} pressAt={15.6} /> : <Branches t={t} />}</Dash></At>)
    // cursor to the button of #47
    if (t < T.notif) { const cp = eio(lin(t, 14.4, 15.4)), cx = mix(x + 120, x - 92, cp), cy = mix(720, 555, cp), down = t > 15.5 && t < 15.75
      out.push(<At key="cu" x={cx} y={cy} s={down ? .85 : 1} z={8} o={enter}><div className="cur9"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 3 L19 12 L12 13 L9 20 Z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg></div></At>)
      const rp = lin(t, 15.6, 16.2); if (rp > 0 && rp < 1) out.push(<At key="rp" x={x - 100} y={548} z={7} o={1 - rp}><div className="ring9 g" style={{ width: 30 + rp * 160, height: 30 + rp * 160 }} /></At>)
      // the signal travels to the phone
      const sg = lin(t, 15.8, 16.6); if (sg > 0 && sg < 1) out.push(<At key="sg" x={mix(152, 600, eio(sg))} y={mix(548, 420, eio(sg)) - Math.sin(sg * Math.PI) * 120} z={9}><div className="sig9"><Ico name="bell-ring" size={18} color="#fff" /></div></At>) }
    if (t >= T.owner) { out.push(<Pop key="pgx" t={t} at={26.6} out={T.open} x={410} y={690} r={6}><Chip><span className="st">أجهزة النداء<Strike t={t} at={27.1} /></span></Chip></Pop>) }
  }
  // OPEN SOURCE
  if (t >= T.open) {
    const s = spring(t, T.open + .2, .6), q = P(T.end, .5)
    out.push(<At key="term" x={252} y={mix(520, 470, s) - q * 80} s={.98 * (1 - .15 * q)} o={clamp(s * 2) * (1 - q)} z={3}><Window chrome="terminal" title="jahiz — zsh" className="term9">
      <div className="tm9" dir="ltr">{[['$ git clone …/jahiz', 29.3], ['$ npm install && npm run dev', 30.0], ['✓ Ready — Supabase · Web Push · PWA', 30.8]].map(([l, a], i) => <div key={i} style={{ opacity: t > (a as number) ? 1 : 0, color: i === 2 ? G : undefined }}>{(l as string).slice(0, Math.floor(clamp((t - (a as number)) / .5) * (l as string).length))}</div>)}</div></Window></At>)
    out.push(<Pop key="gh" t={t} at={29.1} out={T.end} x={100} y={300} r={-5}><Chip><Logo k="gh" h={20} /> مفتوح المصدر</Chip></Pop>)
    out.push(<Pop key="mit" t={t} at={29.9} out={T.end} x={415} y={330} r={5}><Chip cls="n">MIT</Chip></Pop>)
    out.push(<Pop key="fr" t={t} at={30.6} out={T.end} x={410} y={680} r={-4}><Chip cls="g">مجاني</Chip></Pop>)
  }
  if (t >= T.end) {
    out.push(<Pop key="em" t={t} at={T.end + .2} x={252} y={400}><div className="name9 sm"><Mark s={86} draw={1} /><b>جاهز</b><span dir="ltr">JAHIZ</span></div></Pop>)
    out.push(<Pop key="sig" t={t} at={T.end + 1.0} x={252} y={600}><div className="sign9" dir="ltr"><span className="tq"><img src="src/taqni.svg" /></span><span className="tq"><Logo k="tt" h={30} /></span><b>@teqani.ly</b></div></Pop>)
  }
  return <>{out}</>
}

export default function App({ t }: { t: number }) {
  const ready = lin(t, T.notif + 1.2, T.notif + 1.9)
  const flash = [T.scan, T.press, T.notif, T.owner, T.open].map(c => lin(t, c - .1, c + .14)).find(p => p > 0 && p < 1) || 0
  return <div className="stage9 ss-stage" data-theme="light" style={{ ['--ss-accent' as any]: G }}>
    <div className="bg9" /><div className="glow9" style={{ opacity: .6 + .4 * ready * (1 - lin(t, T.noapp, T.noapp + .5)) }} />
    <Film t={t} />
    <Headline t={t} />
    {flash > 0 && <div className="flash9" style={{ opacity: Math.sin(flash * Math.PI) * .5 }} />}
    <div className="grain8" /><div className="vig8" />
    <div className="bug8"><img src="src/taqni.svg" /><span>@teqani.ly</span></div>
  </div>
}
