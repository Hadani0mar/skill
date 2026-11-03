import React, { useLayoutEffect, useRef, useState } from 'react'
import { Window } from '../kit/window'
import { MacPointer } from '../kit/cursors'
import { Ico, Logo } from './ui'
import { lin, eo, eio, spring, clamp, mix, life } from './anim'

// Supabase dashboard, light theme, rebuilt from apps/studio (sign-up, new project, SQL editor, Table Editor
// realtime toggle) and packages/ui light tokens. Sample data: email, org/project names, project ref, region.
const PW = 820
const REF = 'qkzwvbnmxtyplrhdgfse'
import TM from './timing.json'
const SQL = [
  ['k', 'create table', ' doctors ('],
  ['i', '  id bigint generated always as identity primary key,'],
  ['i', '  name text not null,'],
  ['i', '  specialty text not null,'],
  ['i', '  gender text not null'],
  ['p', ');'],
  ['k', 'create table', ' tickets ('],
  ['i', '  id bigint generated always as identity primary key,'],
  ['i', '  doctor_id bigint references doctors (id),'],
  ['i', '  number int not null,'],
  ['s', "  status text not null default ", "'waiting'", ','],
  ['i', '  created_at timestamptz default now()'],
  ['p', ');'],
  ['k', 'alter table', ' doctors enable row level security;'],
  ['k', 'alter table', ' tickets enable row level security;'],
  ['k', 'create policy', ' "Anyone can view doctors" on doctors'],
  ['i', '  for select using (true);'],
  ['k', 'create policy', ' "Patients can view tickets" on tickets'],
  ['i', '  for select to authenticated using (true);'],
  ['k', 'create policy', ' "Patients can book tickets" on tickets'],
  ['i', '  for insert to authenticated with check (true);'],
] as const

// ---- timeline: every action derives from the voice cues in timing.json (slow, readable pacing) ----
const at = (a: number, b: number, f: number) => a + (b - a) * f
export const D0 = TM.d_signup - 0.2, D1 = TM.dashEnd
const T = (() => {
  const s = TM.d_signup, p = TM.d_project, q = TM.d_sql, r = TM.d_run, tb = TM.d_table
  const run = r + 0.45, more = TM.d_menu + 0.45, rtitem = TM.d_item + 0.7, enable = TM.d_confirm + 0.35
  return {
    emailA: at(s, p, 0.14), emailB: at(s, p, 0.42), passA: at(s, p, 0.46), passB: at(s, p, 0.58), signup: at(s, p, 0.7), check: at(s, p, 0.76),
    newP: p - 0.05, nameA: at(p, q, 0.2), nameB: at(p, q, 0.42), gen: at(p, q, 0.56), create: at(p, q, 0.78),
    sql: q, codeA: at(q, r, 0.35), codeB: at(q, r, 0.72), run, ran: run + 0.55,
    table: tb, row: at(tb, TM.d_menu, 0.55), more, rtitem, dialog: rtitem + 0.08, enable, done: enable + 0.1,
  }
})()
const page = (t: number) => (t < T.newP ? 'signup' : t < T.sql ? 'new' : t < T.table ? 'sql' : 'table')
const typed = (t: number, a: number, b: number, s: string) => s.slice(0, Math.round(lin(t, a, b) * s.length))
const sqlLines = (t: number) => (t < T.codeA ? 0 : t < T.codeB ? Math.min(6, 1 + Math.floor(lin(t, T.codeA, T.codeB - 0.2) * 6)) : Math.min(SQL.length, 7 + Math.floor(lin(t, T.codeB, T.run - 0.35) * (SQL.length - 6))))

const STEPS = [
  { a: D0, n: '١', title: 'افتح حساب', pills: ['Sign up'], act: [[D0, 0]] },
  { a: T.newP, n: '٢', title: 'مشروع جديد', pills: ['Project name', 'Create new project'], act: [[T.newP, 0], [T.create - 0.5, 1]] },
  { a: T.sql, n: '٣', title: 'جهّز الجداول', pills: ['SQL Editor', 'Run'], act: [[T.sql, 0], [T.run - 0.5, 1]] },
  { a: T.table, n: '٤', title: 'فعّل Realtime', pills: ['Table Editor', 'tickets', '⋮', 'Enable Realtime'], act: [[T.table, 0], [T.row - 0.4, 1], [T.more - 0.5, 2], [T.more + 0.3, 3]] },
]
const FOCUS: { a: number; b: number; tg: string; label: string }[] = [
  { a: T.emailA - 0.4, b: T.passB + 0.1, tg: 'email', label: 'اكتب إيميلك' },
  { a: T.passB + 0.1, b: T.newP - 0.05, tg: 'signup', label: 'Sign up' },
  { a: T.nameA - 0.4, b: T.gen - 0.3, tg: 'pname', label: 'اسم المشروع' },
  { a: T.gen - 0.3, b: T.create - 0.45, tg: 'gen', label: 'Generate a password' },
  { a: T.create - 0.45, b: T.sql - 0.05, tg: 'create', label: 'Create new project' },
  { a: T.sql + 0.2, b: T.codeA - 0.1, tg: 'sqlside', label: 'SQL Editor' },
  { a: T.codeA - 0.1, b: T.run - 0.45, tg: 'code', label: 'جدول الدكاترة + جدول الأرقام' },
  { a: T.run - 0.45, b: T.ran, tg: 'run', label: 'Run' },
  { a: T.ran, b: T.table - 0.05, tg: 'msg', label: 'تم بنجاح' },
  { a: T.table + 0.3, b: T.more - 0.5, tg: 'ticketsrow', label: 'جدول tickets' },
  { a: T.more - 0.5, b: T.more + 0.3, tg: 'more', label: 'More options' },
  { a: T.more + 0.3, b: T.dialog, tg: 'rtitem', label: 'Enable Realtime' },
  { a: T.dialog + 0.1, b: T.done, tg: 'rtenable', label: 'Enable realtime' },
]
type Cam = { t: number; tg?: string; z: number; cut?: boolean }
const CAM: Cam[] = [
  { t: D0, tg: 'col', z: 1.2, cut: true }, { t: T.emailA - 0.5, tg: 'email', z: 1.55 }, { t: T.passB + 0.1, tg: 'signup', z: 1.55 },
  { t: T.newP, tg: 'panel', z: 1.1, cut: true }, { t: T.nameA - 0.5, tg: 'pname', z: 1.5 }, { t: T.gen - 0.35, tg: 'gen', z: 1.5 }, { t: T.create - 0.5, tg: 'create', z: 1.55 },
  { t: T.sql, z: 1, cut: true }, { t: T.sql + 0.2, tg: 'sqlside', z: 1.4 }, { t: T.codeA - 0.2, tg: 'code', z: 1.25 }, { t: T.run - 0.55, tg: 'run', z: 1.6 }, { t: T.ran, tg: 'msg', z: 1.4 },
  { t: T.table, z: 1, cut: true }, { t: T.table + 0.3, tg: 'ticketsrow', z: 1.45 }, { t: T.more - 0.55, tg: 'more', z: 1.6 }, { t: T.more + 0.3, tg: 'rtitem', z: 1.55 }, { t: T.dialog + 0.05, tg: 'dialog', z: 1.3 }, { t: T.done + 0.1, z: 1 },
]
const CAMDUR = 0.8, CURDUR = 0.75
const CUR: { t: number; tg: string; click?: boolean }[] = [
  { t: T.emailA - 0.1, tg: 'email', click: true }, { t: T.passA, tg: 'pass', click: true }, { t: T.signup, tg: 'signup', click: true },
  { t: T.nameA - 0.05, tg: 'pname', click: true }, { t: T.gen, tg: 'gen', click: true }, { t: T.create, tg: 'create', click: true },
  { t: T.sql + 0.6, tg: 'sqlside' }, { t: T.codeA - 0.05, tg: 'code', click: true }, { t: T.run, tg: 'run', click: true },
  { t: T.row, tg: 'ticketsrow', click: true }, { t: T.more, tg: 'more', click: true }, { t: T.rtitem, tg: 'rtitem', click: true }, { t: T.enable, tg: 'rtenable', click: true },
]
type R = { x: number; y: number; w: number; h: number }

function Btn({ children, kind = 'default', size = 'tiny', target, block, icon, iconRight, loading, pressed }: any) {
  return (
    <span className={`sb-btn sb-btn--${kind} sb-btn--${size}${block ? ' sb-btn--block' : ''}`} data-target={target} style={{ transform: pressed ? 'scale(.96)' : undefined }}>
      {loading ? <span className="sb-spin" /> : icon}{children}{iconRight}
    </span>
  )
}
const pressed = (t: number, at: number) => t >= at && t < at + 0.14

function SignUp({ t }: { t: number }) {
  const email = typed(t, T.emailA, T.emailB, 'musa@example.com')
  const pass = typed(t, T.passA, T.passB, '••••••••••••')
  const check = t >= T.check
  return (
    <div className="sb-auth">
      <nav className="sb-auth__nav"><Logo k="sbword" h={24} /><Btn icon={<Ico name="book-open" size={13} />}>Documentation</Btn></nav>
      <main className="sb-auth__main">
        <div className="sb-auth__col" data-target="col">
          <h1>Get started</h1>
          <h2>Create a new account</h2>
          {!check ? (
            <div className="sb-auth__stack">
              <Btn kind="outline" size="large" block icon={<Logo k="gh" h={16} />}>Continue with GitHub</Btn>
              <Btn kind="outline" size="large" block icon={<Logo k="oai" h={16} />}>Continue with ChatGPT</Btn>
              <Btn kind="outline" size="large" block icon={<Ico name="key" size={15} />}>Continue with SSO</Btn>
              <div className="sb-or"><span>or</span></div>
              <label className="sb-field"><span>Email</span>
                <span className="sb-input" data-target="email" data-focus={(t >= T.emailA && t < T.passA) || undefined} data-empty={!email || undefined}>{email || 'you@example.com'}</span></label>
              <label className="sb-field"><span>Password</span>
                <span className="sb-input" data-target="pass" data-focus={(t >= T.passA && t < T.signup) || undefined} data-empty={!pass || undefined}>{pass || '••••••••'}<Ico name="eye" size={14} color="#8f8f8f" style={{ marginInlineStart: 'auto' }} /></span></label>
              <Btn kind="primary" size="large" block target="signup" pressed={pressed(t, T.signup)} loading={t >= T.signup + 0.06}>Sign up</Btn>
            </div>
          ) : (
            <div className="sb-admon" data-target="signup">
              <Ico name="circle-check" size={16} color="#1f9d63" />
              <div><b>Check your email</b><p>We sent you a link to finish signing up. It expires in 10 minutes.</p></div>
            </div>
          )}
          <div className="sb-auth__have"><span>Have an account?</span> <u>Sign in</u></div>
        </div>
        <p className="sb-auth__tos">By continuing, you agree to Supabase’s <u>Terms of Service</u> and <u>Privacy Policy</u>, and to receive periodic emails with updates.</p>
      </main>
    </div>
  )
}

function Rail({ active }: { active: string }) {
  const items = [['home-position', 'home'], ['layout-list', 'table'], ['terminal', 'sql'], ['database', 'db'], ['users', 'auth'], ['folder', 'storage'], ['serverless-function', 'fn'], ['zap', 'rt'], ['settings', 'set']]
  return (
    <aside className="sb-rail">
      <Logo k="sb" h={22} />
      {items.map(([i, k]) => <span key={k} className="sb-rail__i" data-on={active === k || undefined}><Ico name={i} size={17} /></span>)}
    </aside>
  )
}
function Top() {
  return (
    <header className="sb-top">
      <span className="sb-crumb"><b>clinic-org</b></span><span className="sb-slash">/</span>
      <span className="sb-crumb"><b>clinic-queue</b></span>
    </header>
  )
}

function NewProject({ t }: { t: number }) {
  const name = typed(t, T.nameA, T.nameB, 'clinic-queue')
  const gen = t >= T.gen + 0.05
  return (
    <div className="sb-app sb-app--plain">
      <header className="sb-top"><Logo k="sb" h={20} /><span className="sb-slash">/</span><span className="sb-crumb"><b>clinic-org</b></span></header>
      <div className="sb-newwrap">
        <section className="sb-panel" data-target="panel">
          <div className="sb-panel__head">
            <h3>Create a new project</h3>
            <p>Your project will have its own dedicated instance and full Postgres database. An API will be set up so you can easily interact with your new database.</p>
          </div>
          <div className="sb-row"><span className="sb-row__l">Organization</span><span className="sb-select">clinic-org<Ico name="arrow-left" size={12} style={{ transform: 'rotate(-90deg)' }} /></span></div>
          <div className="sb-row"><span className="sb-row__l">Project name</span>
            <span className="sb-input" data-target="pname" data-focus={(t >= T.nameA && t < T.gen) || undefined} data-empty={!name || undefined}>{name || 'Project name'}</span></div>
          <div className="sb-row"><span className="sb-row__l">Database password</span>
            <div className="sb-row__c">
              <span className="sb-input" data-empty={!gen || undefined}>{gen ? '••••••••••••••••••••' : 'Type in a strong password'}</span>
              {gen && <div className="sb-strength"><i style={{ width: `${eo(lin(t, T.gen, T.gen + 0.35)) * 100}%` }} /></div>}
              <p className="sb-help">{gen ? 'This password is strong.' : 'This is the password to your Postgres database, so it must be strong and hard to guess.'} <u data-target="gen">Generate a password</u></p>
            </div></div>
          <div className="sb-row"><span className="sb-row__l">Region</span><span className="sb-select">Central EU (Frankfurt)<Ico name="arrow-left" size={12} style={{ transform: 'rotate(-90deg)' }} /></span></div>
          <div className="sb-panel__foot"><Btn>Cancel</Btn><Btn kind="primary" target="create" pressed={pressed(t, T.create)} loading={t >= T.create + 0.08}>Create new project</Btn></div>
        </section>
      </div>
    </div>
  )
}

function SqlEditor({ t }: { t: number }) {
  const lines = sqlLines(t)
  const running = t >= T.run && t < T.ran
  const ran = t >= T.ran
  return (
    <div className="sb-app">
      <Rail active="sql" />
      <div className="sb-main">
        <Top />
        <div className="sb-split">
          <div className="sb-side"><div className="sb-side__h" data-target="sqlside">SQL Editor</div><div className="sb-side__row" data-on>Untitled query</div></div>
          <div className="sb-editor">
            <div className="sb-tool"><span className="sb-tool__name">Untitled query</span><span style={{ flex: 1 }} />
              <span className="sb-tool__role">postgres</span>
              <Btn kind="primary" target="run" pressed={pressed(t, T.run)} iconRight={running ? null : <kbd>⌘↵</kbd>} loading={running}>Run</Btn></div>
            <div className="sb-code" data-target="code">
              {SQL.map((l, i) => (
                <div key={i} className="sb-code__l" style={{ opacity: i < lines ? 1 : 0 }}>
                  <span className="sb-code__n">{i + 1}</span>
                  {l[0] === 'k' ? <><span className="tk-k">{l[1]}</span>{l[2]}</> : l[0] === 's' ? <>{l[1]}<span className="tk-s">{l[2]}</span>{l[3]}</> : <span>{l[1]}</span>}
                </div>
              ))}
            </div>
            <div className="sb-results">
              <div className="sb-results__tabs"><span data-on>Results</span><span>Chart</span></div>
              <p className="sb-results__msg" data-target="msg">{running ? 'Running...' : ran ? 'Success. No rows returned' : <>Click <code>Run</code> to execute your query.</>}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TableEditor({ t }: { t: number }) {
  const menu = t >= T.more + 0.05 && t < T.dialog
  const dialog = t >= T.dialog && t < T.done
  const dlg = dialog ? eo(lin(t, T.dialog, T.dialog + 0.2)) : 0
  const mn = menu ? eo(lin(t, T.more + 0.05, T.more + 0.2)) : 0
  return (
    <div className="sb-app">
      <Rail active="table" />
      <div className="sb-main">
        <Top />
        <div className="sb-split">
          <div className="sb-side"><div className="sb-side__h">Table Editor</div><div className="sb-side__schema">schema <b>public</b></div>
            <div className="sb-side__row" data-on={t < T.row || undefined}><Ico name="layout-list" size={13} />doctors</div>
            <div className="sb-side__row" data-on={t >= T.row || undefined} data-target="ticketsrow"><Ico name="layout-list" size={13} />tickets</div></div>
          <div className="sb-grid">
            <div className="sb-tool">
              <Btn kind="primary" icon={<Ico name="plus" size={12} />}>Insert</Btn><span style={{ flex: 1 }} />
              <Btn icon={<span className="sb-badge">2</span>}>RLS policies</Btn>
              <span className="sb-iconbtn" data-target="more" data-open={menu || undefined}>⋮</span>
            </div>
            <div className="sb-cols">
              {(t >= T.row ? [['id', 'int8'], ['doctor_id', 'int8'], ['number', 'int4'], ['status', 'text'], ['created_at', 'timestamptz']] : [['id', 'int8'], ['name', 'text'], ['specialty', 'text'], ['gender', 'text']]).map(([c, ty]) => <span key={c}><b>{c}</b><i>{ty}</i></span>)}
            </div>
            <div className="sb-empty" />
            <div className="sb-menu" style={{ opacity: mn, transform: `translateY(${(1 - mn) * -4}px) scale(${0.98 + 0.02 * mn})` }}>
              <span className="sb-menu__i" data-target="rtitem" data-hover={t >= T.more + 0.5 || undefined}><Ico name="zap" size={14} />Enable Realtime</span>
              <span className="sb-menu__i"><Ico name="book-open" size={14} />View API docs</span>
              <span className="sb-menu__i"><Ico name="activity" size={14} />Enable Index Advisor</span>
            </div>
          </div>
        </div>
      </div>
      <div className="sb-scrim" style={{ opacity: dlg }} />
      <div className="sb-dialog" data-target="dialog" style={{ opacity: dlg, transform: `translate(-50%, ${-50 + (1 - dlg) * 2}%) scale(${0.98 + 0.02 * dlg})` }}>
        <div className="sb-dialog__h">Enable realtime for tickets</div>
        <div className="sb-dialog__b">
          <p>Once realtime has been enabled, the table will broadcast any changes to authorized subscribers.</p>
          <p>You may also select which events to broadcast to subscribers on the <u>database publications</u> settings.</p>
        </div>
        <div className="sb-dialog__f"><Btn>Cancel</Btn><Btn kind="primary" target="rtenable" pressed={pressed(t, T.enable)}>Enable realtime</Btn></div>
      </div>
    </div>
  )
}

const URLS: Record<string, string> = {
  signup: 'supabase.com/dashboard/sign-up', new: 'supabase.com/dashboard/new/clinic-org',
  sql: `supabase.com/dashboard/project/${REF}/sql/new`, table: `supabase.com/dashboard/project/${REF}/editor`,
}

export function Dash({ t }: { t: number }) {
  const pg = page(t)
  const vpRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const tries = useRef({ t: -1, n: 0 })
  const [m, setM] = useState<{ key: string; vw: number; vh: number; rects: Record<string, R> }>({ key: '', vw: 500, vh: 600, rects: {} })
  const vw = m.vw, vh = m.vh, s0 = vw / PW, PH = vh / s0

  // camera
  const cam = (() => {
    const center = (k: Cam) => {
      const r = k.tg ? m.rects[k.tg] : undefined
      const S = s0 * k.z, hw = vw / 2 / S, hh = vh / 2 / S
      const cx = r ? r.x + r.w / 2 : PW / 2, cy = r ? r.y + r.h / 2 : PH / 2
      return { cx: clamp(cx, hw, PW - hw), cy: clamp(cy, hh, PH - hh), z: k.z }
    }
    let i = CAM.length - 1
    while (i > 0 && CAM[i].t > t) i--
    const k = CAM[i], c = center(k)
    if (k.cut || i === 0) return c
    const p = eio(lin(t, k.t, k.t + CAMDUR)), q = center(CAM[i - 1])
    return { cx: mix(q.cx, c.cx, p), cy: mix(q.cy, c.cy, p), z: mix(q.z, c.z, p) }
  })()
  const S = s0 * cam.z
  const V = (x: number, y: number) => ({ x: vw / 2 + (x - cam.cx) * S, y: vh / 2 + (y - cam.cy) * S })
  const VR = (r: R, pad = 6) => { const a = V(r.x - pad, r.y - pad); return { x: a.x, y: a.y, w: (r.w + pad * 2) * S, h: (r.h + pad * 2) * S } }

  useLayoutEffect(() => {
    const vp = vpRef.current, pe = pageRef.current
    if (!vp || !pe) return
    const pr = pe.getBoundingClientRect(), sc = pr.width / PW
    const rects: Record<string, R> = {}
    pe.querySelectorAll<HTMLElement>('[data-target]').forEach((el) => {
      const r = el.getBoundingClientRect()
      rects[el.dataset.target!] = { x: (r.left - pr.left) / sc, y: (r.top - pr.top) / sc, w: r.width / sc, h: r.height / sc }
    })
    const key = pg + JSON.stringify(Object.fromEntries(Object.entries(rects).map(([k, r]) => [k, [r.x, r.y, r.w, r.h].map((v) => Math.round(v))])))
    const nvw = vp.clientWidth, nvh = vp.clientHeight
    if (tries.current.t !== t) tries.current = { t, n: 0 }
    if ((key !== m.key || nvw !== m.vw || nvh !== m.vh) && tries.current.n++ < 3) setM({ key, vw: nvw, vh: nvh, rects })
  })

  // focus / scan
  const f = FOCUS.find((x) => t >= x.a && t < x.b)
  const fr = f && m.rects[f.tg] ? VR(m.rects[f.tg]) : null
  const veil = f ? Math.min(lin(t, f.a, f.a + 0.2), 1 - lin(t, f.b - 0.12, f.b)) : 0
  const ins = f ? spring(t, f.a + 0.12, 0.6) : 0
  const beamP = f ? lin(t, f.a, f.a + 0.42) : 1

  // cursor
  let cur: { x: number; y: number; click: number } | null = null
  if (t >= CUR[0].t - CURDUR) {
    let i = 0
    while (i < CUR.length - 1 && CUR[i + 1].t - CURDUR <= t) i++
    const pos = (tg: string) => { const r = m.rects[tg]; return r ? V(r.x + r.w * 0.55, r.y + r.h * 0.6) : { x: vw * 0.7, y: vh * 0.8 } }
    const k = CUR[i]
    let p = pos(k.tg)
    if (i > 0 && pg === page(CUR[i - 1].t + 0.05)) { const a = pos(CUR[i - 1].tg), e = eio(lin(t, k.t - CURDUR, k.t)); p = { x: mix(a.x, p.x, e), y: mix(a.y, p.y, e) } }
    else if (i === 0) { const e = eio(lin(t, k.t - CURDUR, k.t)); p = { x: mix(vw + 20, p.x, e), y: mix(vh * 0.9, p.y, e) } }
    const last = [...CUR].reverse().find((c) => c.click && c.t <= t)
    cur = { ...p, click: last ? (t - last.t) / 0.45 : 9 }
  }
  const curOn = t < T.done + 0.4

  // step header
  const step = [...STEPS].reverse().find((s) => t >= s.a)!
  const sIn = spring(t, step.a, 0.6)
  const act = [...step.act].reverse().find(([a]) => t >= a)![1]
  const doneP = lin(t, T.done, T.done + 0.3)

  return (
    <>
      <div className="dstep" dir="rtl" key={step.n} style={{ opacity: clamp(sIn * 1.5), transform: `translateY(${(1 - sIn) * 16}px)` }}>
        <div className="dstep__top"><span className="dstep__n">{step.n}</span><span className="dstep__t">{step.title}</span></div>
        <div className="dstep__path" dir="ltr">
          {step.pills.map((p, i) => (
            <React.Fragment key={p}>
              {i > 0 && <span className="dstep__arr">›</span>}
              <span className="dstep__pill" data-on={i === act || undefined} data-past={i < act || undefined}>{p}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <Window url={URLS[pg]} className="dwin" nav>
        <div className="dvp" ref={vpRef}>
          <div className="sb-page" ref={pageRef} style={{ height: PH, transform: `translate(${vw / 2 - cam.cx * S}px, ${vh / 2 - cam.cy * S}px) scale(${S})` }}>
            {pg === 'signup' && <SignUp t={t} />}
            {pg === 'new' && <NewProject t={t} />}
            {pg === 'sql' && <SqlEditor t={t} />}
            {pg === 'table' && <TableEditor t={t} />}
          </div>
          {/* visual scan: veil + beam + brackets + label */}
          {fr && veil > 0 && (
            <>
              <div className="scan-veil" style={{ left: fr.x, top: fr.y, width: fr.w, height: fr.h, opacity: veil }} />
              {beamP < 1 && <div className="scan-beam" style={{ top: mix(-20, fr.y + fr.h / 2, eo(beamP)), opacity: Math.sin(beamP * Math.PI) }} />}
              <div className="scan-box" style={{ left: fr.x, top: fr.y, width: fr.w, height: fr.h, opacity: veil * clamp(ins * 2), transform: `scale(${1.18 - 0.18 * ins})` }}>
                <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
              </div>
              <div className="scan-tag" dir="rtl" style={{ left: clamp(fr.x + fr.w / 2, 90, vw - 90), top: fr.y > 64 ? fr.y - 12 : fr.y + fr.h + 12, opacity: veil * clamp(ins * 2), transform: `translate(-50%, ${fr.y > 64 ? '-100%' : '0'}) scale(${0.8 + 0.2 * ins})` }}>{f!.label}</div>
            </>
          )}
          {cur && curOn && (
            <div className="dcur" style={{ left: cur.x, top: cur.y }}>
              {cur.click < 1 && <span className="dcur__rip" style={{ transform: `translate(-50%,-50%) scale(${0.3 + eo(cur.click) * 1.4})`, opacity: 1 - cur.click }} />}
              <span style={{ display: 'block', transform: `translate(-11px,-8px) scale(${cur.click < 0.25 ? 0.85 : 1.25})`, transformOrigin: '11px 8px' }}><MacPointer /></span>
            </div>
          )}
        </div>
      </Window>
      {doneP > 0 && (
        <div className="ddone" dir="rtl" style={{ opacity: doneP, transform: `translate(-50%, 0) scale(${0.7 + 0.3 * spring(t, T.done, 0.7)})` }}>
          <Ico name="circle-check" look="fill" size={30} color="#1f9d63" />
          <span>Realtime شغّال على جدول <b dir="ltr">tickets</b></span>
        </div>
      )}
    </>
  )
}
