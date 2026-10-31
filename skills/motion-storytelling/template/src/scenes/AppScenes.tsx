import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paper} from '../components/Frame';
import {Icon, IconName} from '../components/Icon';
import {Typewriter} from '../components/Text';
import {AppCard, enterSpring, Pill, pulse, SceneTitle} from '../components/Ui';
import {C, FONT} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.bezier(0.2, 0.8, 0.2, 1);

const appear = (s: number, dist = 50): React.CSSProperties => ({
  opacity: interpolate(s, [0, 0.45], [0, 1], clamp),
  translate: `0 ${(1 - s) * dist}px`,
  scale: String(interpolate(s, [0, 1], [0.92, 1])),
});

/* ------------------------------------------------------------------ */
/* 3. Bridge: phone ↔ cloud ↔ Windows bridge ↔ shop database           */
/* ------------------------------------------------------------------ */
const Node: React.FC<{icon: IconName; title: string; sub: string; s: number; glow?: number}> = ({icon, title, sub, s, glow = 0}) => (
  <div style={{width: 235, display: 'flex', flexDirection: 'column', alignItems: 'center', ...appear(s, 60)}}>
    <div
      style={{
        width: 170,
        height: 170,
        borderRadius: 44,
        background: C.card,
        border: `3px solid ${C.ink}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 10px 0 rgba(17,17,17,0.08), 0 0 ${glow * 40}px rgba(34,185,124,${glow * 0.6})`,
      }}
    >
      <Icon name={icon} size={112} />
    </div>
    <div dir="rtl" style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, marginTop: 18, color: C.ink, textAlign: 'center'}}>
      {title}
    </div>
    <div dir="rtl" style={{fontFamily: FONT, fontSize: 25, color: C.inkSoft, textAlign: 'center', lineHeight: 1.35}}>
      {sub}
    </div>
  </div>
);

export const Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // RTL reading order: right → left
  const nodes: {icon: IconName; title: string; sub: string}[] = [
    {icon: 'phone', title: 'جوالك', sub: 'تطبيق المتمكن'},
    {icon: 'cloud', title: 'السحابة', sub: 'قناة آمنة مشفّرة'},
    {icon: 'laptop', title: 'جسر ويندوز', sub: 'على جهاز المتجر'},
    {icon: 'database', title: 'قاعدة المتجر', sub: 'SQL Server'},
  ];
  const xs = [775, 540, 305, 70]; // slot left edges (235 wide), phone on the right
  const flow = (frame / fps) * 1.1;
  const qr = enterSpring(frame, fps, 150);
  const press = interpolate(frame, [175, 179, 185], [1, 0.93, 1], clamp);
  const chips = enterSpring(frame, fps, 120);
  return (
    <AbsoluteFill>
      <Paper />
      <SceneTitle title="كيف يشتغل؟" sub="جسر آمن بين جوالك وقاعدة بيانات متجرك" />
      {/* connectors */}
      <svg width={1080} height={300} style={{position: 'absolute', top: 470, left: 0}}>
        {[0, 1, 2].map((i) => {
          const s = interpolate(frame, [30 + i * 18, 48 + i * 18], [0, 1], {...clamp, easing: io});
          const x1 = xs[i] + 30;
          const x2 = xs[i + 1] + 205;
          return (
            <g key={i}>
              <line x1={x1} y1={85} x2={x1 - (x1 - x2) * s} y2={85} stroke={C.ink} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
              {s >= 1
                ? [0, 1].map((k) => {
                    const p = (flow + k * 0.5 + i * 0.17) % 1;
                    return <circle key={k} cx={x1 - (x1 - x2) * p} cy={85} r={9} fill={C.green} />;
                  })
                : null}
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => (
        <div key={i} style={{position: 'absolute', top: 470, left: xs[i]}}>
          <Node {...n} s={enterSpring(frame, fps, 22 + i * 18)} glow={i === 2 ? 0.5 + 0.5 * Math.sin(frame / 8) : 0} />
        </div>
      ))}
      <div dir="rtl" style={{position: 'absolute', top: 860, right: 70, left: 70, display: 'flex', gap: 18, justifyContent: 'flex-start', ...appear(chips, 30)}}>
        <Pill bg={C.greenSoft} color="#137a50">
          <Icon name="shield" size={40} /> قراءة فقط
        </Pill>
        <Pill bg={C.greenSoft} color="#137a50">
          <Icon name="lock" size={40} /> استعلامات موقّعة
        </Pill>
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 970, right: 70, ...appear(qr, 30)}}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            background: C.ink,
            color: '#fff',
            borderRadius: 999,
            padding: '18px 40px',
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 38,
            scale: String(press),
            boxShadow: frame > 179 ? `0 0 0 ${interpolate(frame, [179, 200], [0, 26], clamp)}px rgba(17,17,17,${interpolate(frame, [179, 200], [0.18, 0], clamp)})` : 'none',
          }}
        >
          <Icon name="scan" size={46} /> مسح QR الجسر
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Home screen                                                      */
/* ------------------------------------------------------------------ */
export const Home: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = (i: number) => enterSpring(frame, fps, 24 + i * 7);
  const presence = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill>
      <Paper />
      <SceneTitle title="الرئيسية" sub="متجرك كله في نظرة وحدة" />
      <div style={{position: 'absolute', top: 440, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 22}}>
        <AppCard accent={C.appSuccess} style={{padding: '26px 40px 26px 34px', ...appear(s(0))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <Icon name="person" size={74} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 38}}>الوردية الآن: سالم</div>
              <div style={{fontSize: 28, color: C.appSubtle, display: 'flex', alignItems: 'center', gap: 10}}>
                <span style={{width: 16, height: 16, borderRadius: 8, background: C.appSuccess, opacity: 0.4 + presence * 0.6}} />
                بدأ الحضور في 08:05 · مباشر من الجسر
              </div>
            </div>
          </div>
        </AppCard>
        <AppCard accent={C.appWarning} style={{padding: '26px 40px 26px 34px', ...appear(s(1)), scale: String(pulse(frame, 125))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <Icon name="package" size={74} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 36, lineHeight: 1.4}}>لديك 12 منتج ناقص وحركته نشطة أو مرغوبة</div>
              <div style={{fontSize: 28, color: C.appPrimaryStrong}}>اضغط هنا للمراجعة</div>
            </div>
          </div>
        </AppCard>
        <AppCard accent={C.appDanger} style={{padding: '26px 40px 26px 34px', ...appear(s(2)), scale: String(pulse(frame, 165))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <Icon name="expiry" size={74} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 36, lineHeight: 1.4}}>لديك أكثر من (5) منتج منتهي الصلاحية</div>
              <div style={{fontSize: 28, color: C.appPrimaryStrong}}>اضغط للمراجعة وإصدار ملف بها</div>
            </div>
          </div>
        </AppCard>
        <div style={{display: 'flex', gap: 22, direction: 'rtl'}}>
          {[
            {t: 'أكثر العملاء دينًا', icon: 'people' as IconName, v: '3,250 د.ل'},
            {t: 'أكثر الموردين دينًا', icon: 'building' as IconName, v: '12,400 د.ل'},
          ].map((c, i) => (
            <AppCard key={i} style={{flex: 1, padding: '22px 28px', ...appear(s(3 + i))}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <Icon name={c.icon} size={52} />
                <div style={{fontWeight: 600, fontSize: 30}}>{c.t}</div>
              </div>
              <div style={{fontWeight: 700, fontSize: 46, marginTop: 8, direction: 'rtl'}}>{c.v}</div>
            </AppCard>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Inventory hub                                                    */
/* ------------------------------------------------------------------ */
const INVENTORY: {t: string; d: string; icon: IconName}[] = [
  {t: 'بحث الأصناف', d: 'الباركود والاسم والكمية', icon: 'search'},
  {t: 'طباعة الباركود', d: 'تجهيز ملصقات الطباعة', icon: 'print'},
  {t: 'نواقص المخزن', d: 'حسب التغطية والمبيعات', icon: 'package'},
  {t: 'منتهية الصلاحية', d: 'دفعات قريبة أو منتهية', icon: 'expiry'},
  {t: 'تتبع المنتجات', d: 'متابعة أصناف وتنبيهاتها', icon: 'pin'},
  {t: 'حركات المنتج', d: 'مبيعات ومشتريات الصنف', icon: 'trending'},
];

export const Inventory: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // highlight timings (local frames) roughly following the narration words
  const focus = [60, 0, 0, 0, 0, 0];
  const photoS = enterSpring(frame, fps, 70);
  const photoPulse = pulse(frame, 205);
  const flash = interpolate(frame, [205, 212, 230], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Paper />
      <SceneTitle title="المخزون" sub="البحث والطباعة والنواقص والصلاحية والتتبع" />
      <div dir="rtl" style={{position: 'absolute', top: 440, left: 70, right: 70, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
        {INVENTORY.map((it, i) => (
          <AppCard key={i} style={{padding: '22px 26px', height: 150, boxSizing: 'border-box', ...appear(enterSpring(frame, fps, 22 + i * 6)), scale: String(focus[i] ? pulse(frame, focus[i]) : 1)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, height: '100%'}}>
              <Icon name={it.icon} size={72} />
              <div>
                <div style={{fontWeight: 700, fontSize: 34}}>{it.t}</div>
                <div style={{fontSize: 25, color: C.appSubtle, lineHeight: 1.35}}>{it.d}</div>
              </div>
            </div>
          </AppCard>
        ))}
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 975, left: 70, right: 70, ...appear(photoS)}}>
        <AppCard accent={C.appPrimary} style={{padding: '20px 40px 20px 30px', scale: String(photoPulse), boxShadow: `0 0 ${flash * 50}px rgba(255,201,92,${flash})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <Icon name="image" size={72} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 34}}>تعبئة صور تلقائية</div>
              <div style={{fontSize: 25, color: C.appSubtle}}>جلب صور الأصناف بلا صورة</div>
            </div>
            <Pill bg={C.appPrimary} color="#fff" style={{fontSize: 28}}>
              <Icon name="sparkle" size={34} /> جديد
            </Pill>
          </div>
        </AppCard>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Finance hub                                                      */
/* ------------------------------------------------------------------ */
const FINANCE: {t: string; d: string; icon: IconName}[] = [
  {t: 'ديون العملاء', d: 'الأرصدة وكشوف الحساب', icon: 'people'},
  {t: 'ديون الموردين', d: 'المستحقات وفواتير الموردين', icon: 'building'},
  {t: 'الورديات', d: 'تسوية الوردية وحركاتها', icon: 'receipt'},
  {t: 'طلبية الشراء الذكية', d: 'تحليل الاحتياج حسب المورد', icon: 'bot'},
];

export const Finance: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const big = enterSpring(frame, fps, 22);
  const count = interpolate(frame, [30, 80], [0, 48750], {...clamp, easing: Easing.out(Easing.cubic)});
  const methods = ['كاش', 'بطاقة', 'تحويل', 'آجل'];
  const activeMethod = Math.min(3, Math.max(0, Math.floor((frame - 90) / 14)));
  return (
    <AbsoluteFill>
      <Paper />
      <SceneTitle title="المالية" sub="خمسة أقسام متصلة باستعلامات موقّعة" />
      <div dir="rtl" style={{position: 'absolute', top: 440, left: 70, right: 70, ...appear(big)}}>
        <AppCard style={{padding: '26px 36px', background: C.ink, border: 'none', color: '#fff'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <div style={{fontSize: 30, opacity: 0.75}}>إجمالي الدين</div>
              <div style={{fontWeight: 700, fontSize: 76, lineHeight: 1.15}}>
                {Math.round(count).toLocaleString('en-US')} <span style={{fontSize: 40, opacity: 0.8}}>د.ل</span>
              </div>
            </div>
            <Icon name="coins" size={110} />
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 14}}>
            {methods.map((m, i) => (
              <span
                key={m}
                style={{
                  borderRadius: 999,
                  padding: '6px 22px',
                  fontSize: 28,
                  fontWeight: 600,
                  background: frame > 90 && i === activeMethod ? C.highlight : 'rgba(255,255,255,0.12)',
                  color: frame > 90 && i === activeMethod ? C.ink : '#fff',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </AppCard>
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 735, left: 70, right: 70, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
        {FINANCE.map((it, i) => (
          <AppCard
            key={i}
            accent={i === 3 ? C.highlight : undefined}
            style={{padding: '20px 24px', height: 168, boxSizing: 'border-box', ...appear(enterSpring(frame, fps, 50 + i * 7)), scale: String(i === 3 ? pulse(frame, 200) : 1)}}
          >
            <Icon name={it.icon} size={60} />
            <div style={{fontWeight: 700, fontSize: 32, marginTop: 6}}>{it.t}</div>
            <div style={{fontSize: 24, color: C.appSubtle}}>{it.d}</div>
          </AppCard>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 7. Agent chat                                                       */
/* ------------------------------------------------------------------ */
export const Agent: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const question = 'كم دين المورد النور؟';
  const typeStart = 30;
  const sent = 72;
  const sendPress = interpolate(frame, [sent - 4, sent, sent + 5], [1, 0.88, 1], clamp);
  const userS = enterSpring(frame, fps, sent);
  const stepS = enterSpring(frame, fps, sent + 14);
  const stepDone = frame > sent + 50;
  const ansS = enterSpring(frame, fps, sent + 56);
  const chipsS = enterSpring(frame, fps, 14);
  return (
    <AbsoluteFill>
      <Paper />
      <SceneTitle title="شات الوكيل" sub="اسأل بلغتك… والرد من بيانات متجرك" />
      <div dir="rtl" style={{position: 'absolute', top: 440, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{display: 'flex', gap: 14, flexWrap: 'wrap', ...appear(chipsS, 20), opacity: interpolate(frame, [sent, sent + 10], [1, 0.35], clamp) * Math.min(1, chipsS * 2)}}>
          {['كم دين أحمد؟', 'ابحث عن منتج', 'اعرض المنتجات المنتهية'].map((c) => (
            <Pill key={c} style={{border: `2px solid ${C.appBorder}`, background: C.appScaffold}}>
              {c}
            </Pill>
          ))}
        </div>
        <div style={{alignSelf: 'flex-start', maxWidth: 700, ...appear(userS, 30)}}>
          <div style={{background: C.appPrimary, color: '#fff', borderRadius: '34px 34px 8px 34px', padding: '20px 32px', fontFamily: FONT, fontWeight: 600, fontSize: 38}}>
            {question}
          </div>
        </div>
        <div style={{alignSelf: 'flex-end', ...appear(stepS, 20)}}>
          <Pill style={{background: C.appSunken, fontSize: 28}}>
            {stepDone ? (
              <Icon name="check" size={36} />
            ) : (
              <svg width={34} height={34} viewBox="0 0 34 34" style={{rotate: `${frame * 12}deg`}}>
                <circle cx={17} cy={17} r={13} fill="none" stroke={C.appPrimary} strokeWidth={4} strokeDasharray="50 30" strokeLinecap="round" />
              </svg>
            )}
            خطوة · بحث عن دين مورد
          </Pill>
        </div>
        <div style={{alignSelf: 'flex-end', width: 760, ...appear(ansS, 30)}}>
          <AppCard style={{padding: '24px 32px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <Icon name="bot" size={58} />
              <div style={{fontWeight: 600, fontSize: 32}}>المورد النور</div>
            </div>
            <div style={{fontSize: 30, color: C.appSubtle, marginTop: 8}}>المستحق</div>
            <div style={{fontWeight: 700, fontSize: 60}}>
              {Math.round(interpolate(frame, [sent + 60, sent + 95], [0, 12400], {...clamp, easing: Easing.out(Easing.cubic)})).toLocaleString('en-US')}{' '}
              <span style={{fontSize: 34}}>د.ل</span>
            </div>
            <div style={{marginTop: 12, color: C.appPrimaryStrong, fontWeight: 600, fontSize: 28}}>فتح كشف حساب المورد النور ←</div>
          </AppCard>
        </div>
      </div>
      {/* prompt input */}
      <div dir="rtl" style={{position: 'absolute', top: 1010, left: 70, right: 70, opacity: Math.min(1, chipsS * 2)}}>
        <AppCard style={{padding: '16px 18px 16px 28px', borderRadius: 999}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{flex: 1, fontSize: 34, color: frame < typeStart ? C.appSubtle : C.appText}}>
              {frame < typeStart ? 'اكتب سؤالك…' : frame < sent ? <Typewriter text={question} start={typeStart} cps={14} caretColor={C.appPrimary} /> : <span style={{color: C.appSubtle}}>اكتب سؤالك…</span>}
            </div>
            <div style={{width: 66, height: 66, borderRadius: 33, background: C.appPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', scale: String(sendPress)}}>
              <svg width={30} height={30} viewBox="0 0 24 24" style={{rotate: '-90deg'}}>
                <path d="M4 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </AppCard>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8. Team: roles, support tickets, notifications                       */
/* ------------------------------------------------------------------ */
export const Team: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const toast = spring({frame: frame - 120, fps, config: {damping: 13}});
  const toggle = interpolate(frame, [58, 66], [0, 1], {...clamp, easing: io});
  return (
    <AbsoluteFill>
      <Paper />
      <SceneTitle title="فريقك والدعم" sub="أدوار للموظفين، بلاغات، وإشعارات فورية" top={330} start={10} />
      <div dir="rtl" style={{position: 'absolute', top: 600, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 22}}>
        <AppCard style={{padding: '24px 34px', ...appear(enterSpring(frame, fps, 26))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14}}>
            <Icon name="key" size={54} />
            <div style={{fontWeight: 700, fontSize: 36}}>الأدوار</div>
            <div style={{flex: 1}} />
            <Pill style={{fontSize: 26}}>إضافة دور</Pill>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, background: C.appSunken, borderRadius: 22, padding: '14px 22px'}}>
            <Icon name="person" size={50} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, fontSize: 30}}>سالم</div>
              <div style={{fontSize: 24, color: C.appSubtle}}>يدخل باسم المستخدم وكلمة مروره في أبوغريس</div>
            </div>
            <div style={{width: 92, height: 52, borderRadius: 26, background: toggle > 0.5 ? C.appSuccess : C.appBorder, position: 'relative'}}>
              <div style={{position: 'absolute', top: 6, right: 6 + toggle * 40, width: 40, height: 40, borderRadius: 20, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'}} />
            </div>
          </div>
        </AppCard>
        <AppCard style={{padding: '24px 34px', ...appear(enterSpring(frame, fps, 70))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Icon name="megaphone" size={54} />
            <div style={{fontWeight: 700, fontSize: 36}}>مركز البلاغات</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14}}>
            <div style={{flex: 1, fontSize: 30}}>لا تظهر نتيجة البحث</div>
            <Pill bg="#fdf0dc" color="#9a5b12" style={{fontSize: 26, scale: String(pulse(frame, 128))}}>
              بانتظار ردك
            </Pill>
          </div>
        </AppCard>
      </div>
      {/* push notification sliding down */}
      <div dir="rtl" style={{position: 'absolute', top: 170, left: 60, right: 60, translate: `0 ${interpolate(toast, [0, 1], [-260, 0])}px`, opacity: interpolate(toast, [0, 0.3], [0, 1], clamp)}}>
        <AppCard style={{padding: '18px 28px', background: '#ffffff', borderRadius: 34}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{rotate: `${Math.sin(frame / 2.5) * interpolate(frame, [125, 160], [14, 0], clamp)}deg`}}>
              <Icon name="alert" size={60} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 28}}>المتمكن · الآن</div>
              <div style={{fontSize: 28, color: C.appText}}>وصل رد جديد من فريق الدعم على تذكرتك.</div>
            </div>
          </div>
        </AppCard>
      </div>
    </AbsoluteFill>
  );
};
