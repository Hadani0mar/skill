// طباعة باركودات الفاتورة عن بعد — المتمكن. White ground, real iPhone 17 Pro frame (Apple design resources via
// jamesjingyi/mockup-device-frames), the app's light theme tokens, Cairo font, type scale and component metrics from
// almutamakkin-expo-v3. Strings reused from the code: «طباعة N ملصق», «مقاس الملصق», «38 × 25 مم…», «مشاركة كملف PDF»,
// «عدد النسخ N من 300 كحد أقصى للطباعة الواحدة. كل صنف حتى 20 نسخاً.», «الجسر متصل ويعمل.», «أصناف الفاتورة N»,
// «تاريخ الفاتورة», «إجمالي الفاتورة». The invoice → print flow itself is a concept (not in the code yet).
// Supplier, invoice, products, barcodes and prices are SAMPLE data. React Bits: BlurText, CountUp, sounds.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import ION from './ion.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 840;

// app light theme (theme/tokens.ts lightColors)
const C = {scaffold: '#faf9f5', surface: '#faf9f5', sunken: '#f5f0e8', raised: '#efe9de', border: '#e6dfd8', text: '#141413', subtle: '#6c6a64',
  primary: '#cc785c', strong: '#a9583e', success: '#5db872', warning: '#e8a55a', onAccent: '#ffffff'};
const F = "'Cairo', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = Easing.out(Easing.cubic);
const io = Easing.inOut(Easing.cubic);
const ease = (f: number, a: number, b: number, x = 0, y = 1, e = out) => interpolate(f, [a, b], [x, y], {...clamp, easing: e});

/* ---------- timeline ---------- */
const K = {
  TAP1: 128, PUSH1: 140, MENU: 228, SHEET1: 236, OPT: 290, PUSH2: 302,
  COUNT: 342, SIZE: 452, PRINT: 532, SHEET2: 540, SEND: 566, DONE: 642, OUTRO: 700,
};
const HEADS: {from: number; to: number; text: string; hl: string}[] = [
  {from: 0, to: 80, text: 'اطبع باركودات بضاعتك… من أي مكان', hl: 'من أي مكان'},
  {from: 80, to: 205, text: 'ادخل للفواتير، واختار فاتورة المورد الجديدة', hl: 'فاتورة المورد الجديدة'},
  {from: 205, to: 335, text: 'من الخيارات: طباعة باركودات الفاتورة', hl: 'طباعة باركودات الفاتورة'},
  {from: 335, to: 525, text: 'كل صنف ياخذ ملصقات… قد اللي اشتريته', hl: 'قد اللي اشتريته'},
  {from: 525, to: 700, text: 'اضغط طباعة… والملصقات تطلع في المحل', hl: 'تطلع في المحل'},
];

/* ---------- sample invoice ---------- */
const ITEMS: {name: string; qty: number; price: number; code: string}[] = [
  {name: 'حليب طازج 1 لتر', qty: 12, price: 3.5, code: '6221034118742'},
  {name: 'تونة 160غ', qty: 18, price: 4.5, code: '6191502300154'},
  {name: 'سكر 1كغ', qty: 20, price: 2.75, code: '6281006412339'},
  {name: 'زيت دوار الشمس 1.8 لتر', qty: 6, price: 11, code: '6221155041206'},
];
const TOTAL = ITEMS.reduce((s, i) => s + i.qty, 0);
const money = (v: number) => `${v.toFixed(2)} د.ل`;

/* ---------- atoms ---------- */
const Ion: React.FC<{n: keyof typeof ION; size?: number; color?: string}> = ({n, size = 20, color = C.text}) => {
  const ic = (ION as any)[n];
  return <svg width={size} height={size} viewBox={`0 0 ${ic.w} ${ic.h}`} style={{color, flexShrink: 0}} aria-hidden="true" dangerouslySetInnerHTML={{__html: ic.body}} />;
};
const FontFaces = () => <style>{`@font-face{font-family:'Cairo';src:url(${staticFile('fonts/Cairo.ttf')});font-weight:200 1000;font-display:block}`}</style>;

/** Touch feedback at a point in screen (pt) coordinates. */
const Tap: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const l = f - at;
  if (l < -6 || l > 18) return null;
  const pre = ease(l, -6, 0, 0, 1);
  const r = ease(l, 0, 18, 16, 46);
  const o = l < 0 ? pre * 0.5 : ease(l, 0, 18, 0.5, 0);
  return (
    <>
      <div style={{position: 'absolute', left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 18, background: 'rgba(20,20,19,0.18)', opacity: l < 6 ? pre : ease(l, 6, 12, 1, 0), transform: `scale(${l < 0 ? 0.7 + 0.3 * pre : 1})`}} />
      <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, border: '2px solid rgba(204,120,92,0.6)', opacity: l >= 0 ? o : 0}} />
    </>
  );
};

const Header: React.FC<{title: string; sub?: string; right?: React.ReactNode}> = ({title, sub, right}) => (
  <div style={{minHeight: 56, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '6px 8px', gap: 4, direction: 'rtl'}}>
    <div style={{width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ion n="arrow-forward" size={24} /></div>
    <div style={{flex: 1, textAlign: 'center'}}>
      <div style={{fontSize: 18, lineHeight: '26px', fontWeight: 700}}>{title}</div>
      {sub ? <div style={{fontSize: 11, lineHeight: '16px', color: C.subtle}}>{sub}</div> : null}
    </div>
    <div style={{width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{right}</div>
  </div>
);
const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: '#ffffff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, ...style}}>{children}</div>
);

/* ---------- screens (402 × 874 pt) ---------- */
const StatusBar: React.FC = () => (
  <div style={{height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 34px 0', direction: 'ltr', fontFamily: '-apple-system, "SF Pro Text", Cairo, sans-serif', fontWeight: 600, fontSize: 16, color: C.text}}>
    <span>9:41</span>
    <span style={{display: 'flex', gap: 6, alignItems: 'center'}}>
      <span style={{display: 'flex', gap: 2, alignItems: 'flex-end'}}>{[5, 7, 9, 11].map((h) => <span key={h} style={{width: 3, height: h, background: C.text, borderRadius: 1}} />)}</span>
      <span style={{width: 24, height: 12, border: `1.5px solid ${C.text}`, borderRadius: 4, padding: 1.5, boxSizing: 'border-box'}}><span style={{display: 'block', width: '80%', height: '100%', background: C.text, borderRadius: 2}} /></span>
    </span>
  </div>
);

const InvoicesScreen: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string, string, number, boolean][] = [
    ['10482', 'شركة النور للمواد الغذائية', '2026-10-29', 4850, true],
    ['10471', 'مخازن الريان', '2026-10-26', 2310.5, false],
    ['10466', 'شركة الوفاء للتوزيع', '2026-10-22', 7105, false],
    ['10459', 'شركة النور للمواد الغذائية', '2026-10-18', 3920, false],
  ];
  return (
    <>
      <Header title="فواتير المشتريات" sub="آخر فواتير الموردين" />
      <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
        <div style={{height: 48, borderRadius: 8, background: C.sunken, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', color: C.subtle, fontSize: 15}}><Ion n="search-outline" size={20} color={C.subtle} />ابحث برقم الفاتورة أو المورد</div>
        {rows.map(([id, sup, date, total, isNew], i) => {
          const p = ease(f, 20 + i * 5, 34 + i * 5);
          const pressed = i === 0 && f >= K.TAP1 && f < K.TAP1 + 10;
          return (
            <div key={id} style={{background: pressed ? C.sunken : '#fff', border: `1px solid ${isNew ? C.primary : C.border}`, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${pressed ? 0.98 : 1})`}}>
              <div style={{width: 42, height: 42, borderRadius: 8, background: C.sunken, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ion n="receipt-outline" size={22} color={C.primary} /></div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <span style={{fontSize: 16, fontWeight: 700}}>فاتورة {id}</span>
                  {isNew ? <span style={{fontSize: 11, fontWeight: 700, color: C.strong, background: '#f6e3da', borderRadius: 999, padding: '1px 8px'}}>جديدة</span> : null}
                </div>
                <div style={{fontSize: 13, color: C.subtle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{sup} · {date}</div>
              </div>
              <div style={{fontSize: 13, fontWeight: 700, direction: 'rtl', whiteSpace: 'nowrap'}}>{money(total)}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const InvoiceScreen: React.FC = () => {
  const f = useCurrentFrame();
  const menuPressed = f >= K.MENU && f < K.MENU + 8;
  return (
    <>
      <Header title="فاتورة 10482" sub="شركة النور للمواد الغذائية" right={<div style={{width: 40, height: 40, borderRadius: 20, background: menuPressed ? C.raised : C.sunken, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ion n="ellipsis-vertical" size={20} /></div>} />
      <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
        <div style={{display: 'flex', gap: 8}}>
          {([['تاريخ الفاتورة', '2026-10-29'], ['إجمالي الفاتورة', '4850.00 د.ل'], ['عدد الأصناف', '4']] as [string, string][]).map(([l, v]) => (
            <div key={l} style={{flex: 1, background: C.sunken, borderRadius: 4, padding: '10px 8px', textAlign: 'center'}}>
              <div style={{fontSize: 11, color: C.subtle}}>{l}</div>
              <div style={{fontSize: 14, fontWeight: 700, direction: 'rtl'}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize: 18, fontWeight: 700}}>أصناف الفاتورة 10482</div>
        <Panel style={{padding: 0}}>
          {ITEMS.map((it, i) => (
            <div key={it.name} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: i ? `1px solid ${C.border}` : 'none'}}>
              <div style={{flex: 1}}>
                <div style={{fontSize: 15, fontWeight: 700}}>{it.name}</div>
                <div style={{fontSize: 12, color: C.subtle}}>السعر {money(it.price)}</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: 11, color: C.subtle}}>الكمية</div>
                <div style={{fontSize: 17, fontWeight: 800}}>{it.qty}</div>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
};

const OptionsSheet: React.FC = () => {
  const f = useCurrentFrame();
  const open = ease(f, K.SHEET1, K.SHEET1 + 12, 0, 1, io) * ease(f, K.PUSH2 - 4, K.PUSH2 + 6, 1, 0, io);
  if (open <= 0) return null;
  const opts: [keyof typeof ION, string][] = [['barcode-outline', 'طباعة باركودات الفاتورة'], ['share-outline', 'مشاركة كملف PDF'], ['document-text-outline', 'كشف حساب المورد']];
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `rgba(20,20,19,${0.32 * open})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '12px 12px 0 0', padding: '10px 16px 40px', transform: `translateY(${(1 - open) * 100}%)`, direction: 'rtl'}}>
        <div style={{width: 40, height: 5, borderRadius: 3, background: C.border, margin: '0 auto 12px'}} />
        <div style={{fontSize: 16, fontWeight: 700, marginBottom: 8}}>خيارات الفاتورة</div>
        {opts.map(([ic, l], i) => {
          const hot = i === 0;
          const pressed = hot && f >= K.OPT && f < K.OPT + 9;
          return (
            <div key={l} style={{display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, padding: '0 12px', borderRadius: 8, background: pressed ? '#f6e3da' : hot ? C.sunken : 'transparent', marginTop: 4}}>
              <Ion n={ic} size={22} color={hot ? C.primary : C.subtle} />
              <span style={{fontSize: 15, fontWeight: hot ? 700 : 500, color: hot ? C.text : C.subtle}}>{l}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

const PrintScreen: React.FC = () => {
  const f = useCurrentFrame();
  const counts = ITEMS.map((it, i) => Math.round(it.qty * ease(f, K.COUNT + i * 10, K.COUNT + 26 + i * 10)));
  const total = counts.reduce((a, b) => a + b, 0);
  const size = f >= K.SIZE + 4 ? 1 : 0;
  const printPressed = f >= K.PRINT && f < K.PRINT + 9;
  const matchIn = ease(f, K.COUNT + 60, K.COUNT + 74);
  return (
    <>
      <Header title="طباعة باركودات الفاتورة" sub="فاتورة 10482 · شركة النور" />
      <div style={{padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 12px', opacity: matchIn, transform: `translateY(${(1 - matchIn) * -8}px)`}}>
          <Ion n="checkmark-circle" size={20} color={C.success} />
          <span style={{fontSize: 13, fontWeight: 700}}>الكميات مطابقة لما اشتريته في الفاتورة</span>
        </div>
        <div style={{fontSize: 17, fontWeight: 700}}>الملصقات المختارة (4)</div>
        <Panel style={{padding: 0}}>
          {ITEMS.map((it, i) => {
            const bump = f >= K.COUNT + i * 10 && f < K.COUNT + 26 + i * 10;
            return (
              <div key={it.name} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderTop: i ? `1px solid ${C.border}` : 'none'}}>
                <Ion n="checkbox" size={22} color={C.primary} />
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{it.name}</div>
                  <div style={{fontSize: 11, color: C.subtle}}>{it.code} • {money(it.price)}</div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                  <div style={{width: 32, height: 32, border: `1px solid ${C.border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'}}><Ion n="remove" size={16} /></div>
                  <div style={{minWidth: 28, textAlign: 'center', fontWeight: 800, fontSize: 16, color: bump ? C.strong : C.text, transform: `scale(${bump ? 1.15 : 1})`}}>{counts[i]}</div>
                  <div style={{width: 32, height: 32, border: `1px solid ${C.border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'}}><Ion n="add" size={16} /></div>
                </div>
              </div>
            );
          })}
        </Panel>
        <div style={{fontSize: 12, color: C.subtle, lineHeight: '18px'}}>عدد النسخ {total} من 300 كحد أقصى للطباعة الواحدة. كل صنف حتى 20 نسخاً.</div>
        <Panel>
          <div style={{fontSize: 16, fontWeight: 700, marginBottom: 6}}>مقاس الملصق</div>
          <div style={{display: 'flex', gap: 6, direction: 'rtl'}}>
            {['38 × 25 مم', '50 × 30 مم', '60 × 40 مم'].map((l, i) => (
              <div key={l} style={{minHeight: 34, padding: '0 10px', borderRadius: 8, display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: i === size ? 700 : 500, color: i === size ? C.text : C.subtle, background: i === size ? '#f6e3da' : 'transparent', direction: 'rtl'}}>{l}</div>
            ))}
          </div>
          <div style={{marginTop: 10, minHeight: 48, borderRadius: 8, background: printPressed ? C.strong : C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, fontWeight: 600, transform: `scale(${printPressed ? 0.97 : 1})`}}>
            <Ion n="print-outline" size={18} color="#fff" />طباعة {total} ملصق
          </div>
          <div style={{marginTop: 8, minHeight: 46, borderRadius: 8, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: C.strong}}>مشاركة كملف PDF</div>
        </Panel>
      </div>
    </>
  );
};

const SendSheet: React.FC = () => {
  const f = useCurrentFrame();
  const open = ease(f, K.SHEET2, K.SHEET2 + 12, 0, 1, io);
  if (open <= 0) return null;
  const sent = Math.round(TOTAL * ease(f, K.SEND, K.DONE - 8, 0, 1, Easing.inOut(Easing.quad)));
  const done = f >= K.DONE;
  const dp = spring({frame: f - K.DONE, fps: 30, config: {damping: 11}});
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `rgba(20,20,19,${0.32 * open})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '12px 12px 0 0', padding: '10px 18px 42px', transform: `translateY(${(1 - open) * 100}%)`, direction: 'rtl'}}>
        <div style={{width: 40, height: 5, borderRadius: 3, background: C.border, margin: '0 auto 12px'}} />
        <div style={{fontSize: 17, fontWeight: 700}}>إرسال للطابعة</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, background: C.sunken, borderRadius: 12, padding: 12}}>
          <div style={{width: 44, height: 44, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ion n="desktop-outline" size={24} color={C.primary} /></div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 15, fontWeight: 700}}>طابعة الملصقات — المحل</div>
            <div style={{fontSize: 12, color: C.subtle, display: 'flex', alignItems: 'center', gap: 6}}><span style={{width: 8, height: 8, borderRadius: 4, background: C.success}} />الجسر متصل ويعمل.</div>
          </div>
          <div style={{fontSize: 12, fontWeight: 700, color: C.subtle, direction: 'rtl'}}>50 × 30 مم</div>
        </div>
        <div style={{marginTop: 16, height: 10, borderRadius: 5, background: C.sunken, overflow: 'hidden', display: 'flex', justifyContent: 'flex-start'}}>
          <div style={{width: `${(sent / TOTAL) * 100}%`, background: done ? C.success : C.primary, borderRadius: 5}} />
        </div>
        <div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: done ? C.text : C.subtle}}>
          {done ? <span style={{transform: `scale(${dp})`, display: 'inline-flex'}}><Ion n="cloud-done-outline" size={22} color={C.success} /></span> : null}
          {done ? `أُرسلت ${TOTAL} ملصق للطابعة.` : `أُرسل ${sent} من ${TOTAL} ملصق`}
        </div>
      </div>
    </>
  );
};

/** Navigation stack with RTL push (new screen enters from the left). */
const Screen: React.FC = () => {
  const f = useCurrentFrame();
  const push = (at: number) => ease(f, at, at + 16, 0, 1, io);
  const p1 = push(K.PUSH1), p2 = push(K.PUSH2);
  const layer = (children: React.ReactNode, enter: number, leave: number, z: number) => (
    <div style={{position: 'absolute', top: 54, left: 0, right: 0, bottom: 0, background: C.scaffold, transform: `translateX(${(enter - 1) * 402 + leave * 110}px)`, filter: `brightness(${1 - 0.06 * leave})`, zIndex: z, boxShadow: enter < 1 ? '0 0 30px rgba(0,0,0,0.15)' : 'none'}}>{children}</div>
  );
  return (
    <div style={{width: 402, height: 874, position: 'relative', background: C.scaffold, fontFamily: F, color: C.text, direction: 'rtl', overflow: 'hidden'}}>
      {f < K.PUSH1 + 18 ? layer(<InvoicesScreen />, 1, p1, 1) : null}
      {f >= K.PUSH1 && f < K.PUSH2 + 18 ? layer(<InvoiceScreen />, p1, p2, 2) : null}
      {f >= K.PUSH2 ? layer(<PrintScreen />, p2, 0, 3) : null}
      <div style={{position: 'absolute', inset: 0, zIndex: 5}}>
        {f < K.PUSH2 + 8 ? <OptionsSheet /> : null}
        <SendSheet />
      </div>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6, background: C.scaffold}}><StatusBar /></div>
      <div style={{position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none'}}>
        <Tap x={250} y={200} at={K.TAP1} />
        <Tap x={38} y={84} at={K.MENU} />
        <Tap x={240} y={692} at={K.OPT} />
        <Tap x={212} y={584} at={K.SIZE} />
        <Tap x={205} y={612} at={K.PRINT} />
      </div>
    </div>
  );
};

/** Real iPhone 17 Pro frame (1406 × 2822, screen 1206 × 2622 at 100,100). */
const PHONE_H = 1300, S = PHONE_H / 2822, PW = 1406 * S;
const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: f - 4, fps, config: {damping: 18, stiffness: 80}});
  const float = Math.sin(f / 40) * 5;
  const outro = ease(f, K.OUTRO, K.OUTRO + 30, 0, 1, io);
  const top = 568 + (1 - enter) * 260 + float + outro * 90;
  const scale = 1 - 0.08 * outro;
  const scr = 1206 * S;
  return (
    <div style={{position: 'absolute', left: (W - PW) / 2, top, width: PW, height: PHONE_H, opacity: Math.min(1, enter * 1.4), transform: `scale(${scale})`, transformOrigin: '50% 0%'}}>
      <div style={{position: 'absolute', left: '6%', right: '6%', bottom: -30, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(20,20,19,0.18), rgba(20,20,19,0) 70%)'}} />
      <div style={{position: 'absolute', left: 100 * S, top: 100 * S, width: scr, height: 2622 * S, borderRadius: 172 * S, overflow: 'hidden', background: C.scaffold}}>
        <div style={{width: 402, height: 874, transform: `scale(${scr / 402})`, transformOrigin: '0 0'}}><Screen /></div>
      </div>
      <Img src={staticFile('device/iphone17pro-silver.png')} style={{position: 'absolute', inset: 0, width: PW, height: PHONE_H}} />
    </div>
  );
};

/** Headline above the phone: BlurText words + highlighter sweep on the key phrase. */
const Headline: React.FC = () => {
  const f = useCurrentFrame();
  const h = HEADS.find((x) => f >= x.from && f < x.to);
  if (!h) return null;
  const words = h.text.split(' ');
  const hlw = h.hl.split(' ');
  const hlStart = words.findIndex((w, i) => hlw.every((x, k) => words[i + k] === x));
  const landed = h.from + 6 + words.length * 3 + 10;
  const sweep = ease(f, landed, landed + 14, 0, 1, io);
  const exit = ease(f, h.to - 10, h.to, 0, 1, io);
  return (
    <div style={{position: 'absolute', top: 170, left: 70, right: 70, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.24em', rowGap: 6, fontFamily: F, fontWeight: 800, fontSize: 76, lineHeight: 1.35, color: C.text, opacity: 1 - exit, filter: `blur(${exit * 10}px)`, transform: `translateY(${-exit * 30}px)`}}>
        {words.map((w, i) => {
          const p = ease(f, h.from + 6 + i * 3, h.from + 20 + i * 3);
          const inHl = i >= hlStart && i < hlStart + hlw.length;
          const first = i === hlStart, last = i === hlStart + hlw.length - 1;
          return (
            <span key={i} style={{position: 'relative', display: 'inline-block', opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * 26}px)`, color: inHl && sweep > 0.3 ? C.strong : undefined}}>
              {inHl ? <span style={{position: 'absolute', top: '22%', bottom: '8%', right: first ? '-0.12em' : '-0.26em', left: last ? '-0.12em' : 0, background: 'rgba(204,120,92,0.22)', borderRadius: 10, transformOrigin: 'right', transform: `scaleX(${Math.max(0, Math.min(1, sweep * hlw.length - (i - hlStart)))})`, zIndex: -1}} /> : null}
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** «صعود» m mark. */
const Mark: React.FC<{size: number; at: number}> = ({size, at}) => {
  const f = useCurrentFrame();
  const p1 = ease(f, at, at + 14), p2 = ease(f, at + 6, at + 20);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeWidth={26}>
        <path d="M46 152 V106 A27 27 0 0 1 100 106 V152" stroke={C.strong} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p1} />
        <path d="M100 152 V84 A27 27 0 0 1 154 84 V152" stroke={C.primary} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p2} />
      </g>
    </svg>
  );
};
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  if (f < K.OUTRO) return null;
  const p = ease(f, K.OUTRO + 6, K.OUTRO + 24);
  return (
    <div style={{position: 'absolute', top: 190, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
        <Mark size={120} at={K.OUTRO + 4} />
        <span style={{fontFamily: F, fontWeight: 900, fontSize: 104, color: C.text}}>المتمكن</span>
      </div>
      <div style={{fontFamily: F, fontWeight: 600, fontSize: 52, color: C.subtle, direction: 'rtl', opacity: ease(f, K.OUTRO + 26, K.OUTRO + 40)}}>
        طباعة الباركود <span style={{color: C.strong, background: 'rgba(204,120,92,0.18)', borderRadius: 10, padding: '0 10px'}}>عن بعد</span>
      </div>
    </div>
  );
};

export const BarcodeRemote: React.FC = () => (
  <AbsoluteFill style={{background: '#ffffff'}}>
    <FontFaces />
    <Headline />
    <Phone />
    <Outro />
  </AbsoluteFill>
);
