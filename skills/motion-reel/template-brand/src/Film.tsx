// A brand film in one continuous take, inside one shape of the brand's identity. This is a WORKING STARTER, not the
// final film: `python3 scripts/demo_assets.py` once and it renders with placeholder pictures. Replace them with the
// brand's own files (their films → scripts/plate.sh, their photos, their logo), then reshape the beats for your idea.
// Every time below comes from src/film.json → beats.
//
//   zoom      their footage, whole and small inside the shape; one log-space dive into a tracked detail
//   pill/card inside the shape: their sky; a glass pill with a voice ribbon drops in; a card is built
//   rolls     time passes: one date per sky change, each a soft vertical roll; the last one is the claim
//   places    each place arrives with a move, holds still while its name is spoken, THEN its number lands
//   pass      the card tips edge-on into a line of light, a slit opens, the window widens, their vehicle passes slowly
//   shrink    the window closes (by area) into their mark; the closing line; their URL; «إعلان غير رسمي»
//
// Rules this file keeps: never leave the shape; every move grows out of the last; footage and photos are shown at or
// below their own size (scripts/assets_check.py measures it; the dive dissolves at its fastest point); the creator's
// handle stays on, small, the whole film.
import React from 'react';
import {AbsoluteFill, Audio, Img, continueRender, delayRender, getRemotionEnvironment, getStaticFiles, staticFile, useCurrentFrame} from 'remotion';
import F from './film.json';
import TRACK from './track.json';
import {E, clamp, drift, ep, lerp, prog, settle} from './lib/ease';
import {R4, mixR, r4, shrinkInto, stadium} from './lib/shape';
import {makeZoom} from './lib/zoom';
import {Odometer, Roll, rollAt} from './lib/Roll';
import {Ribbon} from './lib/Ribbon';

const B = F.beats;
const [W, H] = F.size;
const FONT = (F.font.file ? `'${F.font.family}', ` : '') + F.font.fallback;
const SERIF = F.font.closingFile ? `'${F.font.closingFamily}', ${F.font.fallback}` : FONT;
const full: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: W, height: H};
const S = (p: string) => staticFile(p);
const HERO = r4(F.shape.hero), WIDE = r4(F.shape.wide), END = r4(F.shape.end);
// pictures inside the window are sized to the window (+12 % for the drift and the bank), never to the whole canvas:
// a landscape frame stretched over a portrait canvas is already a 1.8× upscale
const BOX: React.CSSProperties = {position: 'absolute', left: HERO.cx - HERO.w * 0.56, top: HERO.cy - HERO.h * 0.56, width: HERO.w * 1.12, height: HERO.h * 1.12, objectFit: 'cover'};

// their fonts, if you have the files (public/fonts/...). Check every Arabic word you set renders whole.
for (const [fam, file] of [[F.font.family, F.font.file], [F.font.closingFamily, F.font.closingFile]]) {
  if (file && typeof FontFace !== 'undefined') {
    const h = delayRender('font ' + fam);
    new FontFace(fam, `url(${S(file)})`).load().then((f) => { (document as any).fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
  }
}
const HAS_MIX = getStaticFiles().some((f) => f.name === 'mix.wav');

// ─── the dive ────────────────────────────────────────────────────────────────
const T = TRACK as {plate: string; n: number; fps: number; src: [number, number]; x: number[]; y: number[]};
const frameAt = (t: number) => Math.min(T.n, F.opening.start + Math.round(t * T.fps * F.opening.speed));
const frame = (plate: string, f: number) => S(`${plate}/${String(f).padStart(4, '0')}.jpg`);
const END_SC = HERO.h / F.opening.detailH;           // the detail grows until it is the shape at full size
const cam = makeZoom({t0: B.zoom[0], t1: B.zoom[1], wide: F.opening.wide, end: END_SC, glide: B.glide as [number, number],
  src: T.src, centre: [HERO.cx, HERO.cy], track: T, frameAt, offset: F.opening.offset as [number, number]});

// the shape at time t: locked on the detail during the dive, the window, wider for the pass, then into their mark
const shapeAt = (t: number): R4 => {
  if (t < B.zoom[1]) { const c = cam(t), k = c.sc / END_SC; return {cx: c.sx, cy: c.sy, w: HERO.w * k, h: HERO.h * k}; }
  if (t < B.grow[0]) return HERO;
  if (t < B.shrink[0]) return mixR(HERO, WIDE, ep(t, B.grow[0], B.grow[1]));
  return shrinkInto(WIDE, END, t, B.shrink[0], B.shrink[1]);
};

// ─── pieces ──────────────────────────────────────────────────────────────────
const glass: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.10)), rgba(20,8,60,0.18)',
  backdropFilter: 'blur(28px) saturate(1.4)', WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
  border: '1.5px solid rgba(255,255,255,0.4)', boxShadow: '0 20px 44px rgba(10,4,40,0.25), inset 0 1.5px 0 rgba(255,255,255,0.5)', boxSizing: 'border-box',
};

const Mark: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 104, display: 'flex', justifyContent: 'center', opacity: 0.9}}>
    <div style={{padding: '8px 22px', borderRadius: 30, background: 'rgba(10,4,40,.38)', fontFamily: FONT, fontWeight: 700, fontSize: 26, color: '#fff', direction: 'ltr'}}>{F.handle}</div>
  </div>
);

// ─── the film ────────────────────────────────────────────────────────────────
export const Film: React.FC = () => {
  const t = useCurrentFrame() / F.fps;
  const win = shapeAt(t);
  const path = stadium(win);
  const L: React.ReactNode[] = [];

  // the wall: their colour, breathing very slightly so it is never a dead plate
  L.push(<AbsoluteFill key="wall" style={{background: `radial-gradient(120% 80% at ${50 + 4 * drift(t)}% 40%, ${F.colors.accent}33, ${F.colors.wall} 70%)`}} />);

  // ── inside the shape ──
  const lens = E(prog(t, B.inside[0], B.inside[0] + 0.2));
  const toWall = ep(t, B.slit[0], B.slit[1] + 0.4);               // the views give way to the pass
  if (lens > 0) {
    const content: React.ReactNode[] = [];
    // the sky: frames from their own films (never a flat gradient), one per sky change, crossfading, always drifting
    const push = 1.06 - 0.06 * ep(t, B.inside[0], B.inside[1]) + 0.04 * prog(t, B.inside[1], B.slit[1]);
    F.skies.forEach((src, i) => {
      const o = i === 0 ? 1 : ep(t, B.skies[i - 1], B.skies[i - 1] + B.skyFade);
      if (o > 0) content.push(<Img key={'sky' + i} src={S(src)} style={{...BOX, opacity: o, transform: `scale(${push}) translate(${30 * drift(t + i)}px, ${16 * drift(t + 3 + i, 5.3, 9.1, 3.7)}px)`}} />);
    });
    // the places: each one ARRIVES with a move of its own (a flight has them: through a cloud, a bank, a shade that
    // drops and lifts), then holds still while its name is spoken. A plain crossfade between still photos reads dead.
    let bank = 0, haze = 0, shade = 0;
    F.places.forEach((p, i) => {
      const t0 = B.places[i], mv = p.move || 'fade';
      let o = ep(t, t0, t0 + 0.6);
      if (mv === 'cloud') { haze = Math.max(haze, Math.sin(Math.PI * prog(t, t0 - 0.5, t0 + 0.7))); o = ep(t, t0 - 0.1, t0 + 0.2); }
      if (mv === 'bank') { bank += 7 * Math.sin(Math.PI * prog(t, t0 - 0.4, t0 + 0.8)); o = ep(t, t0 - 0.1, t0 + 0.4); }
      if (mv === 'shade') { shade = Math.max(shade, t < t0 - 0.2 ? ep(t, t0 - 0.6, t0 - 0.25) : 1 - ep(t, t0 - 0.1, t0 + 0.9)); o = t >= t0 - 0.2 ? 1 : 0; }
      if (o > 0) content.push(<Img key={'pl' + i} src={S(p.img)} style={{...BOX, opacity: o, transform: `scale(${1.06 - 0.05 * prog(t, t0, t0 + 2.5)})`}} />);
    });
    content.push(<div key="view" style={{...full, transform: `rotate(${bank}deg) scale(${1 + 0.1 * Math.abs(bank) / 7 + 0.1 * haze})`}}>{content.splice(0)}</div>);
    if (haze > 0) content.push(<div key="haze" style={{...full, background: 'radial-gradient(70% 50% at 50% 50%, #fff, rgba(255,255,255,0.85))', opacity: haze * 0.95}} />);
    if (shade > 0) {
      const top = HERO.cy - HERO.h / 2, sh = HERO.h * shade;
      content.push(
        <div key="shade" style={{position: 'absolute', left: 0, right: 0, top, height: sh, background: `linear-gradient(180deg, ${F.colors.soft}, #e9e7f5 ${Math.max(0, 100 - 6000 / Math.max(sh, 1))}%, #d8d5ea)`,
          boxShadow: '0 6px 18px rgba(0,0,0,.25)', borderBottom: '6px solid #cfcbe3'}} />,
      );
    }
    // the place name: only once the place has arrived and is still, so the voice says it while we look at it
    const pi = F.places.reduce((a, _, i) => (t >= B.places[i] + 0.8 ? i : a), -1);
    if (pi >= 0) {
      const a = ep(t, B.places[pi] + 0.8, B.places[pi] + 1.2) * (1 - ep(t, B.undock[0], B.undock[0] + 0.3));
      if (a > 0) content.push(
        <div key={'name' + pi} dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: HERO.cy - HERO.h / 2 + 300, textAlign: 'center', fontFamily: FONT, fontSize: 64, color: '#fff',
          opacity: a * (1 - shade), transform: `translateY(${(1 - a) * 24}px)`, textShadow: '0 4px 30px rgba(0,0,0,.35)', padding: '16px 0'}}>{F.places[pi].name}</div>,
      );
    }
    content.push(<div key="toWall" style={{...full, background: F.colors.wall, opacity: toWall}} />);

    // the pass: their vehicle through a slit of light, in slow motion (a 200 fps plate played at 0.3×), always a
    // DOWNSCALE (0.56–0.68 of 1920), the crop drifting along it so the slow shot never sits still
    if (t >= B.slit[0] && F.pass.n > 1) {
      const sp = E(prog(t, B.slit[0], B.slit[1]));
      const half = Math.min(win.h / 2, 300) * Math.sqrt(sp);
      const idx = Math.min(F.pass.n, F.pass.start + Math.floor((t - B.slit[0]) * F.pass.fps * F.pass.speed));
      const tk = prog(t, B.slit[0], B.shrink[1]);
      const s = lerp(F.pass.scale[0], F.pass.scale[1], tk) * (1920 / F.pass.src[0]);   // scale is a fraction of a 1920 px frame
      const fx = lerp(F.pass.focus[0][0], F.pass.focus[1][0], tk), fy = lerp(F.pass.focus[0][1], F.pass.focus[1][1], tk);   // in plate px
      content.push(
        <div key="pass" style={{position: 'absolute', left: 0, right: 0, top: win.cy - half, height: half * 2, overflow: 'hidden', opacity: 1 - ep(t, B.shrink[0] + 0.5, B.shrink[1] + 0.2)}}>
          <Img src={frame(F.pass.plate, idx)} style={{position: 'absolute', left: 0, top: -(win.cy - half), width: F.pass.src[0], height: F.pass.src[1], transformOrigin: '0 0',
            transform: `translate(${win.cx - fx * s}px, ${win.cy - fy * s}px) scale(${s})`}} />
        </div>,
      );
    }
    content.push(<div key="dim" style={{...full, background: F.colors.wall, opacity: ep(t, B.shrink[0] + 0.3, B.shrink[1])}} />);
    L.push(<div key="win" style={{...full, clipPath: `path('${path}')`, opacity: lens}}>{content}</div>);
  }

  // ── the opening: their footage, whole and small inside the shape, diving into the tracked detail ──
  if (t < B.zoom[1]) {
    const c = cam(t);
    const out = c.out();
    if (out < 1) {
      const layer = (m: number, o: number, key: string) => (
        <Img key={key} src={frame(T.plate, c.f)} style={{position: 'absolute', left: 0, top: 0, width: T.src[0], height: T.src[1], opacity: o, transformOrigin: '0 0', transform: c.transform(m)}} />
      );
      const fr = stadium(c.frame);
      const rim = Math.min(ep(t, 0.1, 0.6), 1 - ep(t, B.zoom[0] + 0.2, B.zoom[0] + 0.5));
      L.push(
        <div key="opening" style={{...full, overflow: 'hidden', opacity: 1 - out}}>
          <div style={{...full, clipPath: `path('${fr}')`}}>
            {layer(1, 1, 'z0')}
            {c.blur().map((b, i) => layer(b.m, b.o, 'zb' + i))}
          </div>
          {rim > 0 && <svg width={W} height={H} style={full}><path d={fr} fill="none" stroke="#fff" strokeOpacity={0.8 * rim} strokeWidth={2.5} /></svg>}
        </div>,
      );
    }
  }

  // the shape's rim: a thin white line with a soft glow, from the moment we are inside until their mark
  const rimO = clamp(ep(t, B.inside[0], B.inside[0] + 0.3) * 3) * (1 - ep(t, B.shrink[1] - 0.2, B.shrink[1] + 0.4));
  if (rimO > 0) {
    L.push(
      <svg key="rim" width={W} height={H} style={full}>
        <defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter></defs>
        <g opacity={rimO}>
          <path d={path} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={6} filter="url(#glow)" />
          <path d={path} fill="none" stroke="#fff" strokeWidth={2.5} />
        </g>
      </svg>,
    );
  }

  // ── the pill: the voice of the film (a captain, a concierge); its ribbon moves only when the voice speaks ──
  const away = ep(t, B.undock[0], B.undock[0] + 0.4);
  const drop = settle(t, B.pill[0], B.pill[1] - B.pill[0]);
  if (drop > 0 && away < 1) {
    const top = HERO.cy - HERO.h / 2 + 120;
    L.push(
      <div key="pill" dir="rtl" style={{...glass, position: 'absolute', left: HERO.cx - 230, width: 460, height: 96, borderRadius: 48, top: lerp(top - 140, top, drop),
        opacity: clamp(drop * 2) * (1 - away), display: 'flex', alignItems: 'center', gap: 18, padding: '0 34px', color: '#fff'}}>
        <div style={{fontFamily: FONT, fontSize: 36, whiteSpace: 'nowrap', padding: '12px 0'}}>{F.pill}</div>
        <div style={{flex: 1}} />
        <Ribbon t={t} fps={F.fps} accent={F.colors.soft} />
      </div>,
    );
  }

  // ── the card: built piece by piece; docks low for the places; then rises, tips edge-on and becomes a line of light ──
  const toCard = ep(t, B.card[0], B.card[1]);
  const tip = ep(t, B.tip[0], B.tip[1]);
  if (toCard > 0 && tip < 1) {
    const dock = ep(t, B.dock[0], B.dock[1]) * (1 - ep(t, B.undock[0], B.undock[1]));
    const cw = 680, ch = 400, cy = HERO.cy + lerp(260, 410, dock) * (1 - ep(t, B.undock[0], B.undock[1]));
    const month = rollAt(t, B.rolls, 0.5, 0);
    const built = ep(t, B.build[1] - 0.3, B.build[1] + 0.2);
    L.push(
      <div key="card" dir="rtl" style={{...glass, position: 'absolute', left: HERO.cx - cw / 2, top: cy - ch / 2, width: cw, height: ch, borderRadius: 36,
        background: `linear-gradient(135deg, ${F.colors.card[0]}cc, ${F.colors.card[1]}cc)`, opacity: toCard * (1 - tip * 0.6),
        transform: `perspective(1400px) translateY(${(1 - toCard) * 60}px) scale(${lerp(0.9, 1, toCard) * lerp(1, 0.86, dock)}) rotateX(${tip * 90}deg)`,
        color: '#fff', padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{fontFamily: FONT, fontSize: 30, opacity: 0.8 * ep(t, B.build[0], B.build[0] + 0.4), padding: '8px 0'}}>{F.pointsLabel}</div>
          {F.cardLogo ? <Img src={S(F.cardLogo)} style={{height: 44, opacity: ep(t, B.build[0] + 0.2, B.build[0] + 0.6)}} /> : null}
        </div>
        <Odometer t={t} values={F.points} at={B.counts} size={110} font={FONT} build={B.build[0] + 0.15} />
        <div style={{flex: 1}} />
        <div style={{alignSelf: 'flex-start', direction: 'rtl', opacity: built, transform: `translateY(${(1 - built) * 20}px)`}}>
          <Roll from={F.months[month.idx]} to={F.months[month.nxt]} p={month.p} w={320} h={48} size={34} font={FONT} />
        </div>
      </div>,
    );
  }
  // each place's points fall from the place into the card (0.45 s), then the balance rolls
  B.counts.forEach((c, i) => {
    const fall = prog(t, c - 0.45, c), gone = ep(t, c, c + 0.25);
    if (fall <= 0 || gone >= 1 || i + 1 >= F.points.length) return;
    const y0 = HERO.cy - HERO.h / 2 + 430, y1 = HERO.cy + 410 - 120;
    const y = lerp(y0, y1, fall * fall);                       // accelerating, like something falling
    L.push(
      <div key={'drop' + i} style={{...glass, position: 'absolute', left: HERO.cx - 90, top: y, width: 180, height: 64, borderRadius: 32, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: FONT, fontSize: 32, color: '#fff', direction: 'ltr', opacity: clamp(fall * 4) * (1 - gone), transform: `scale(${1 - 0.4 * gone})`,
        background: `${F.colors.accent}aa`}}>+{(F.points[i + 1] - F.points[i]).toLocaleString('en-US')}</div>,
    );
  });

  // the line of light the card becomes, which opens into the slit
  const lineO = Math.min(ep(t, B.tip[0] + 0.3, B.tip[1]), 1 - ep(t, B.slit[0] + 0.2, B.slit[1]));
  if (lineO > 0) {
    const lw = lerp(680, WIDE.w, ep(t, B.tip[0] + 0.3, B.slit[1]));
    L.push(<div key="light" style={{position: 'absolute', left: HERO.cx - lw / 2, width: lw, top: HERO.cy - 2, height: 4, borderRadius: 2, background: '#fff', opacity: lineO,
      boxShadow: `0 0 18px 4px ${F.colors.soft}, 0 0 60px 10px ${F.colors.accent}`}} />);
  }

  // ── the ending ──
  if (F.logo) {   // their logo, small in a corner from the first second, until the window starts to close
    const o = ep(t, B.logo[0], B.logo[1]) * (1 - ep(t, B.shrink[0], B.shrink[0] + 0.4));
    if (o > 0) L.push(<Img key="logo" src={S(F.logo)} style={{position: 'absolute', right: 70, top: 110, width: 120, height: 120, objectFit: 'contain', opacity: o}} />);
  }
  if (F.monogram) {   // their mark, where the window closed
    const o = ep(t, B.shrink[1] - 0.2, B.shrink[1] + 0.5);
    if (o > 0) L.push(<Img key="mono" src={S(F.monogram)} style={{position: 'absolute', left: END.cx - END.w * 0.4, top: END.cy - END.w * 0.4, width: END.w * 0.8, height: END.w * 0.8,
      objectFit: 'contain', opacity: o, transform: `scale(${lerp(0.9, 1, o)})`}} />);
  }
  const line = ep(t, B.line, B.line + 0.6), url = ep(t, B.url, B.url + 0.5), note = ep(t, B.note, B.note + 0.5);
  if (line > 0) {
    L.push(
      <div key="line" dir="rtl" style={{position: 'absolute', left: 80, right: 80, top: END.cy + END.h / 2 + 70, textAlign: 'center', fontFamily: SERIF, fontSize: 54, color: '#fff',
        opacity: line, transform: `translateY(${(1 - line) * 30}px)`, filter: `blur(${(1 - line) * 8}px)`, padding: '16px 0'}}>{F.closing}</div>,
    );
  }
  if (url > 0) L.push(<div key="url" style={{position: 'absolute', left: 0, right: 0, top: END.cy + END.h / 2 + 200, textAlign: 'center', fontFamily: FONT, fontSize: 28, color: '#fff', opacity: 0.75 * url, direction: 'ltr'}}>{F.url}</div>);
  if (note > 0) L.push(<div key="note" dir="rtl" style={{position: 'absolute', left: 0, right: 0, bottom: 190, textAlign: 'center', fontFamily: FONT, fontSize: 24, color: '#fff', opacity: 0.6 * note}}>{F.note}</div>);

  return (
    <AbsoluteFill style={{background: F.colors.wall, overflow: 'hidden'}}>
      {L}
      <Mark />
      {/* the mix in the live preview (scripts/mix.py → public/mix.wav; run it again after any timing change) */}
      {HAS_MIX && !getRemotionEnvironment().isRendering ? <Audio src={S('mix.wav')} /> : null}
    </AbsoluteFill>
  );
};
