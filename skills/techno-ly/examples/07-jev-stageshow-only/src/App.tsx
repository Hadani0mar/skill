import { Stage, Window, Row, Avatar, Meter, Badge, Card, Count, Thread, Bubble, Chip, BrandMark, Text, type Act } from '../kit'
import { Ico, Logo } from './ico'

// The Jev film, built with Stageshow only: one Stage, one script, one thing happening per scene.
// Order = problem → solution → reply → who is Jev. Everything on screen is Arabic (RTL) except product names.

type S = {
  sc: number; done: boolean
  rows: number; total: number
  depts: number
  ticket: string; jev: boolean; scores: number[]; pick: boolean; gate: number
  reply: string; replyOn: boolean; typing: boolean
  intro: number; people: number; money: number; seed: number; ser: number; val: number
  nw: number; price: number; barL: number; diff: number; end: number
}
const Z: S = { sc: 0, done: false, rows: 0, total: 0, depts: 0, ticket: '', jev: false, scores: [0, 0, 0, 0, 0, 0, 0], pick: false, gate: 0, reply: '', replyOn: false, typing: false, intro: 0, people: 0, money: 0, seed: 0, ser: 0, val: 0, nw: 0, price: 0, barL: 0, diff: 0, end: 0 }

const COMPLAINTS = ['الثلاجة وقفت بعد يومين', 'خصموا مني المبلغ مرتين', 'الطلب ما وصلش لين توّا', 'ما نقدرش ندخل حسابي', 'نبي نرجّع المنتج', 'الفاتورة فيها خطأ']
const DEPTS: [string, string, number][] = [['الصيانة', 'wrench', 0.62], ['المالية', 'dollar-sign', 0.31], ['الشحن', 'truck', 0.03], ['الاسترجاع', 'undo', 0.02], ['الحساب والأمان', 'lock', 0.01], ['الدعم الفني', 'headphones', 0.01], ['القانوني', 'scale', 0]]
const TICKET = 'الثلاجة اللي شريتها وقفت بعد يومين، وخصموا مني المبلغ مرتين'
const REPLY = 'أهلاً... وصلتنا رسالتك. حوّلنا الثلاجة لقسم الصيانة، والخصم المضاعف لقسم المالية، وبنتواصلوا معاك قريب.'

const On = ({ on, children, d = 0 }: { on: boolean; children: React.ReactNode; d?: number }) => <div className="fx" data-on={on} style={{ transitionDelay: `${d}ms` }}>{children}</div>
const Scn = ({ on, y = 0, children }: { on: boolean; y?: number; children: React.ReactNode }) => <div className="scn" data-on={on}><div style={{ position: 'absolute', inset: 0, transform: `translateY(${y}px)` }}>{children}</div></div>
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}M`

async function script(a: Act<S>) {
  await a.wait(500)
  // 1 · the problem
  await a.set({ sc: 1 })
  await a.wait(700)
  await a.stagger([1, 2, 3, 4, 5, 6], (n) => a.set({ rows: n }), 380)
  await a.set({ total: 1000000 })
  await a.wait(4200)
  // 2 · one team can't carry it
  await a.set({ sc: 2 })
  await a.wait(500)
  await a.stagger([1, 2, 3, 4, 5, 6, 7], (n) => a.set({ depts: n }), 340)
  await a.wait(3000)
  // 3 · the solution: the app decides by itself
  await a.set({ sc: 3 })
  await a.wait(900)
  await a.type('ticket', TICKET)
  await a.wait(600)
  await a.set({ jev: true })
  await a.wait(900)
  await a.set({ scores: DEPTS.map((d) => d[2]) })
  await a.wait(2400)
  await a.set({ pick: true })
  await a.wait(1500)
  await a.set({ gate: 1 })
  await a.wait(2200)
  await a.set({ gate: 2 })
  await a.wait(2600)
  // 4 · the reply, written by a bigger model
  await a.set({ sc: 4 })
  await a.wait(1000)
  await a.set({ replyOn: true, typing: true })
  await a.wait(1500)
  await a.set({ typing: false, reply: REPLY })
  await a.wait(4200)
  // 5 · so who is Jev
  await a.set({ sc: 5 })
  await a.wait(600)
  await a.stagger([1, 2, 3], (n) => a.set({ intro: n }), 800)
  await a.wait(3200)
  // 6 · the people
  await a.set({ sc: 6 })
  await a.wait(500)
  await a.stagger([1, 2, 3, 4], (n) => a.set({ people: n }), 1500)
  await a.wait(3200)
  // 7 · the money
  await a.set({ sc: 7 })
  await a.wait(700)
  await a.set({ money: 1, seed: 40 })
  await a.wait(2600)
  await a.set({ money: 2, ser: 870 })
  await a.wait(3000)
  await a.set({ money: 3, val: 7.5 })
  await a.wait(3400)
  // 8 · what's new + price
  await a.set({ sc: 8 })
  await a.wait(600)
  await a.stagger([1, 2, 3], (n) => a.set({ nw: n }), 900)
  await a.wait(1600)
  await a.set({ sc: 9 })
  await a.wait(700)
  await a.set({ price: 1, barL: 1 })
  await a.wait(2400)
  await a.set({ price: 2 })
  await a.wait(4200)
  // 10 · the difference
  await a.set({ sc: 10 })
  await a.wait(500)
  await a.stagger([1, 2, 3, 4], (n) => a.set({ diff: n }), 1700)
  await a.wait(3400)
  // 11 · the question
  await a.set({ sc: 11 })
  await a.wait(500)
  await a.stagger([1, 2], (n) => a.set({ end: n }), 900)
  await a.wait(4500)
  await a.set({ done: true })
}

export default function App() {
  return (
    <Stage<S> width={360} height={640} initial={Z} script={script} play="once" accent="#22c55e" fidelity="standard" poster={{ ...Z, sc: 3, ticket: TICKET, jev: true, scores: DEPTS.map((d) => d[2]), pick: true }}>
      {(s) => (
        <div data-done={s.done} data-sig={[s.sc, s.rows, s.depts, s.ticket.length, s.reply.length, s.gate, s.intro, s.people, s.money, s.nw, s.price, s.diff, s.end, s.pick ? 1 : 0, s.jev ? 1 : 0].join('|')} style={{ position: 'absolute', inset: 0 }}>
          {/* 1 · problem */}
          <Scn on={s.sc === 1} y={0}>
            <div className="hd">عندك <em>ملايين</em> الشكاوى... وكلها بتروح لقسم واحد؟</div>
            <div className="col" style={{ top: 118 }}>
              <Window title="صندوق الشكاوى" chrome="native" style={{ height: 330 }}>
                <div style={{ padding: '4px 0', direction: 'rtl' }}>
                  {COMPLAINTS.map((c, i) => (
                    <On key={c} on={s.rows > i}><Row lead={<Avatar name={['أحمد', 'سالم', 'نورة', 'علي', 'مريم', 'يوسف'][i]} size={26} />} title={<Text>{c}</Text>} meta={<Text>{`${i + 1}:0${(i * 7) % 6}`}</Text>} /></On>
                  ))}
                </div>
              </Window>
            </div>
            <div className="col" style={{ top: 480, alignItems: 'center' }}>
              <div className="big" style={{ fontSize: 56 }}><Count value={s.total} duration={2600} /></div>
              <div className="cap" style={{ position: 'static' }}>تذكرة مفتوحة، وما أحد يقدر يقراها كلها</div>
            </div>
          </Scn>
          {/* 2 · many teams */}
          <Scn on={s.sc === 2} y={24}>
            <div className="hd">وما تبيش تكدّسها على <em>فريق واحد</em></div>
            <div className="col" style={{ top: 118 }}>
              {DEPTS.map(([n, ic], i) => (
                <On key={n} on={s.depts > i}><Card pad="medium" style={{ direction: 'rtl' }}><div className="rowx"><Ico name={ic} size={22} color="#1f9d63" /><b style={{ fontSize: 15 }}>{n}</b><span className="cap" style={{ position: 'static', marginInlineStart: 'auto', textAlign: 'left', fontSize: 12 }}>فريق متخصص</span></div></Card></On>
              ))}
            </div>
            <div className="cap" style={{ top: 560 }}>كل فريق يشدّ جهة معينة</div>
          </Scn>
          {/* 3 · the solution */}
          <Scn on={s.sc === 3} y={0}>
            <div className="hd">كيف التطبيق <em>يعرف القسم بروحه</em>؟</div>
            <div className="col" style={{ top: 100, gap: 8 }}>
              <Card pad="small"><div style={{ fontSize: 13, color: 'var(--ss-text)', marginBottom: 4 }}>شكوى جديدة <span className="tag">بيانات تجريبية</span></div><div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.45, minHeight: 46, wordSpacing: '.1em' }}>{s.ticket}</div></Card>
              <On on={s.jev}>
                <Card pad="small" lift>
                  <div className="rowx" style={{ marginBottom: 6 }}><BrandMark name="Jev" src="public/img/typesafe-mark.png" size={22} tile={false} /><b className="big" style={{ fontSize: 18 }}>Jev</b><span style={{ marginInlineStart: 'auto' }}><Badge tone="neutral"><span className="lat">68 ms</span></Badge></span></div>
                  {DEPTS.map(([n, ic, p], i) => (
                    <div className="dept" key={n} data-win={s.pick && i < 2}><span className="nm"><Ico name={ic} size={15} color={s.pick && i < 2 ? '#1f9d63' : '#a3a3a3'} />{n}</span><Meter value={s.scores[i] || 0} tone={i < 2 ? 'accent' : 'ink'} /><span className="pc"><Count value={Math.round((s.scores[i] || 0) * 100)} format={(x) => `${Math.round(x)}%`} /></span></div>
                  ))}
                </Card>
              </On>
              <On on={s.gate >= 1}>
                <div className="rowx" style={{ justifyContent: 'center', gap: 8, direction: 'rtl' }}>
                  <Badge tone="success" icon={<Ico name="check" size={13} />}>ثقة 94%: يروح الصيانة تلقائي</Badge>
                </div>
              </On>
              <On on={s.gate >= 2}>
                <div className="rowx" style={{ justifyContent: 'center', direction: 'rtl' }}><Badge tone="warning" icon={<Ico name="user" size={13} />}>ثقة 71%: موظف يراجع المالية</Badge></div>
              </On>
            </div>
          </Scn>
          {/* 4 · reply */}
          <Scn on={s.sc === 4} y={70}>
            <div className="hd">وفوقها... موديل أكبر <em>يكتب الرد</em></div>
            <div className="col" style={{ top: 112 }}>
              <div className="rowx" style={{ justifyContent: 'center', gap: 8 }}><Logo k="ai_claude" h={22} /><b style={{ fontSize: 15 }}>موديل كبير يكتب ردّ الاستلام</b></div>
              <Thread app="chat" style={{ height: 250 }}>
                <Bubble from="them"><span dir="rtl">{TICKET}</span></Bubble>
                {s.replyOn && <Bubble from="me" typing={s.typing}><span dir="rtl" style={{ display: 'block' }}>{s.reply || ' '}</span></Bubble>}
              </Thread>
            </div>
            <On on={s.reply.length > 0}><div className="cap" style={{ top: 470 }}><b>جيف يقرر</b> · والموديل الكبير يتكلم</div></On>
          </Scn>
          {/* 5 · who is Jev */}
          <Scn on={s.sc === 5} y={100}>
            <div className="hd">طيب... من هو <em className="lat">Jev</em>؟</div>
            <div className="col" style={{ top: 150, alignItems: 'center', gap: 14 }}>
              <On on={s.intro >= 1}><img src="public/img/typesafe-mark.png" width={92} height={92} style={{ borderRadius: 99 }} /></On>
              <On on={s.intro >= 2}><div className="big" style={{ fontSize: 76, letterSpacing: '-.06em' }}>Jev</div></On>
              <On on={s.intro >= 3}><Badge tone="accent">موديل قرارات... ماهو شات بوت</Badge></On>
            </div>
            <On on={s.intro >= 3}><div className="cap" style={{ top: 420 }}>من شركة <b className="lat">TypeSafe AI</b> · سان فرانسيسكو</div></On>
          </Scn>
          {/* 6 · people */}
          <Scn on={s.sc === 6} y={80}>
            <div className="hd">الشركة تأسست <em>2024</em> وطلع جيف <em>15 سبتمبر 2026</em></div>
            <div className="col" style={{ top: 130, alignItems: 'center', gap: 14 }}>
              <On on={s.people >= 1}><img src="public/img/typesafe-word.png" width={190} /></On>
              <div className="rowx" style={{ gap: 14, alignItems: 'flex-start', direction: 'rtl' }}>
                {[['diogo', 'دييغو ألميدا', 'CEO'], ['erik', 'إريك غافني', 'مؤسس مشارك'], ['sasha', 'ساشا شنغ', 'مؤسسة مشاركة']].map(([f, n, r], i) => (
                  <On key={f} on={s.people >= i + 2}><div style={{ width: 96 }}><div className="ph" style={{ width: 96, height: 96 }}><img src={`public/img/${f}.jpg`} /></div><div className="who" style={{ marginTop: 8 }}>{n}<b>{r}</b></div></div></On>
                ))}
              </div>
            </div>
            <On on={s.people >= 2}><div className="cap" style={{ top: 420 }}>دييغو: حوالي 4 سنين في <b className="lat">OpenAI</b><br />على RLHF وInstructGPT وGPT-4</div></On>
          </Scn>
          {/* 7 · money */}
          <Scn on={s.sc === 7} y={90}>
            <div className="hd">وبعدها... <em>المال</em></div>
            <div className="col" style={{ top: 100 }}>
              <On on={s.money >= 1}><Card pad="medium"><div className="rowx"><BrandMark name="DCVC" src="public/img/dcvc.png" size={32} tile={false} /><div><b style={{ fontSize: 14 }}>جولة أولية بقيادة DCVC</b><div style={{ fontSize: 11, color: 'var(--ss-text)' }}>15 سبتمبر 2026</div></div></div><div className="big" style={{ fontSize: 40, marginTop: 8 }}><Count value={s.seed} format={money} duration={1300} /></div></Card></On>
              <On on={s.money >= 2}><Card pad="medium" lift><div className="rowx"><BrandMark name="a16z" src="public/img/a16z.png" size={32} tile={false} /><div><b style={{ fontSize: 14 }}>جولة بقيادة a16z</b><div style={{ fontSize: 11, color: 'var(--ss-text)' }}>9 أكتوبر 2026 · معاهم Sequoia وDCVC</div></div></div><div className="big" style={{ fontSize: 56, marginTop: 8, color: 'var(--ss-accent-text)' }}><Count value={s.ser} format={money} duration={1600} /></div></Card></On>
              <On on={s.money >= 3}><div className="rowx" style={{ justifyContent: 'center' }}><Badge tone="neutral">قيمة الشركة <span className="lat"><b><Count value={s.val} format={(x) => `$${x.toFixed(1)}B`} duration={1400} /></b></span></Badge></div></On>
            </div>
          </Scn>
          {/* 8 · new */}
          <Scn on={s.sc === 8} y={90}>
            <div className="hd">وشن الجديد؟ <em className="lat">1.14</em></div>
            <div className="col" style={{ top: 120 }}>
              <div className="rowx" style={{ justifyContent: 'center' }}><Badge tone="neutral" icon={<Ico name="calendar" size={13} />}>14 أكتوبر 2026</Badge></div>
              {[['image', 'قراءة الصور'], ['file-text', 'سياق أطول: 262 ألف توكن'], ['flag', 'صندوق إحداثيات للصور']].map(([ic, t], i) => (
                <On key={t} on={s.nw > i}><Card pad="small"><div className="rowx" style={{ direction: 'rtl' }}><Ico name={ic} size={20} color="#1f9d63" /><b style={{ fontSize: 15 }}>{t}</b></div></Card></On>
              ))}
              <On on={s.nw >= 3}><div className="rowx" style={{ justifyContent: 'center' }}><Badge tone="warning">كلها تجريبية، بإعدادات خاصة</Badge></div></On>
            </div>
          </Scn>
          {/* 9 · price */}
          <Scn on={s.sc === 9} y={80}>
            <div className="hd">والسعر؟</div>
            <div className="col" style={{ top: 100, alignItems: 'center', gap: 6 }}>
              <div className="big" style={{ fontSize: 66, color: 'var(--ss-accent-text)' }}><Count value={s.price >= 1 ? 42 : 0} format={(x) => `$${(x / 1000).toFixed(3)}`} duration={1400} /></div>
              <div className="cap" style={{ position: 'static' }}>لكل مليون توكن دخل · والخرج مجاني</div>
            </div>
            <div className="col" style={{ top: 280 }}>
              <Card pad="medium">
                <div className="dept" style={{ height: 40 }}><span className="nm" style={{ width: 84 }}>جيف</span><Meter value={s.barL ? 0.02 : 0} tone="accent" /><span className="pc lat" style={{ width: 52 }}>$0.042</span></div>
                <div className="dept" style={{ height: 40 }}><span className="nm" style={{ width: 84 }}>موديلات كبيرة</span><Meter value={s.barL ? 1 : 0} tone="ink" /><span className="pc lat" style={{ width: 52 }}>$0.2–10</span></div>
              </Card>
              <On on={s.price >= 2}><div className="rowx" style={{ justifyContent: 'center', gap: 6, direction: 'rtl' }}><Badge tone="neutral"><b className="lat">200×</b> أسرع</Badge><Badge tone="neutral"><b className="lat">400×</b> أرخص</Badge></div><div className="rowx" style={{ justifyContent: 'center', marginTop: 6 }}><span className="tag">حسب الشركة نفسها... وفي اختبارات من عندها</span></div></On>
            </div>
          </Scn>
          {/* 10 · difference */}
          <Scn on={s.sc === 10} y={70}>
            <div className="hd">شن الفرق بينه وبين <em>الباقي</em>؟</div>
            <div className="col" style={{ top: 100 }}>
              <On on={s.diff >= 1}><Card pad="medium"><div className="rowx" style={{ justifyContent: 'center', gap: 12 }}>{['ai_openai', 'ai_claude', 'ai_gemini', 'ai_mistral', 'ai_deepseek'].map((k) => <Logo key={k} k={k} h={22} />)}</div><div className="cap" style={{ position: 'static', marginTop: 8 }}>تكتب نص... كلمة ورا كلمة</div></Card></On>
              <On on={s.diff >= 2}><div className="rowx" style={{ justifyContent: 'center' }}><Badge tone="warning">وبعدها لازم تحلل الكلام باش البرنامج يفهمه</Badge></div></On>
              <On on={s.diff >= 3}><Card pad="medium" lift><div className="rowx" style={{ justifyContent: 'center', gap: 8 }}><img src="public/img/typesafe-mark.png" width={24} height={24} style={{ borderRadius: 99 }} /><b className="big" style={{ fontSize: 22 }}>Jev</b></div><div className="cap" style={{ position: 'static', marginTop: 6 }}>يختار من خياراتك: نعم/لا، أو خيار، أو درجة<br />+ نسبة الثقة · <span className="lat">70–500 ms</span></div></Card></On>
              <On on={s.diff >= 4}><div className="rowx" style={{ justifyContent: 'center' }}><Badge tone="danger" icon={<Ico name="triangle-alert" size={13} />}>يقدر يغلط... مش مضمون 100%</Badge></div></On>
            </div>
          </Scn>
          {/* 11 · end */}
          <Scn on={s.sc === 11} y={130}>
            <div className="hd" style={{ top: 120, fontSize: 28 }}>شن القسم اللي شكاويه <em>تعبتك</em> في شغلك؟</div>
            <On on={s.end >= 1}><div className="cap" style={{ top: 250, fontSize: 17 }}>اكتبه في التعليقات... ونجربوه مع <b className="lat">Jev</b></div></On>
            <On on={s.end >= 2}><div className="rowx" style={{ position: 'absolute', left: 0, right: 0, top: 360, justifyContent: 'center', gap: 10, direction: 'ltr' }}><Logo k="tt" h={28} /><b className="lat" style={{ fontSize: 24 }}>@techno_ly</b></div></On>
          </Scn>
        </div>
      )}
    </Stage>
  )
}
