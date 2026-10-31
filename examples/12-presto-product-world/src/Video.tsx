// «عالم المنتج» (Product World) — بريستو Presto Libya.
// Facts (sources in research notes): founded June 2020 in Tripoli; 300 orders on day one (Libya Herald, Dec 2021);
// orange chosen to stand out and keep riders visible at night (Libya Herald); 23,000+ orders in a single day,
// 4 cities (Tripoli, Benghazi, Misrata, Zliten), 24,000 drivers, 2,000+ merchants, ~1M downloads, second-largest
// delivery app in North Africa after Glovo (Rest of World, 2024).
// Official logo not reachable from the sandbox → the name is set in type (no logo imitation). Orange is approximate.
// 3D: three.js (frame-driven) + Kenney Starter-Kit-Racing motorcycle (CC0). React Bits: BlurText, Counter, marquee, sounds.
import React, {useEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1200;

const OR = '#ff6a13';
const OR2 = '#ffa24c';
const INK = '#16181b';
const RX = "'Readex', sans-serif";
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const out = Easing.out(Easing.cubic);
const ease = (f: number, a: number, b: number, x = 0, y = 1, e = out) => interpolate(f, [a, b], [x, y], {...clamp, easing: e});

// timeline (frames)
const T = {PROMISE: 120, DIVE: 190, F1: 230, F2: 410, MQ: 590, F3: 620, F4: 800, RING: 980, END: 1010};

/* =============================== 3D WORLD =============================== */
type World = {
  renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera;
  r1: THREE.CatmullRomCurve3; r1Mesh: THREE.Mesh; r1Count: number;
  r2: THREE.CatmullRomCurve3; r2Mesh: THREE.Mesh; r2Count: number;
  bike: THREE.Object3D; bikeLight: THREE.PointLight; pins: THREE.Group;
  dots: THREE.InstancedMesh; trails: THREE.InstancedMesh; paths: {x: number; z: number; dir: 0 | 1; len: number; speed: number; off: number}[];
};
const N = 20, PITCH = 1.42;
const street = (i: number) => (i - N / 2 - 0.5) * PITCH; // coordinate of street line i

function buildWorld(canvas: HTMLCanvasElement, w: number, h: number, onReady: (wd: World) => void) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true});
  renderer.setSize(w, h, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#06080a');
  scene.fog = new THREE.Fog('#06080a', 10, 34);
  const camera = new THREE.PerspectiveCamera(34, w / h, 0.05, 120);
  scene.add(new THREE.HemisphereLight('#c9d6e8', '#0d1014', 0.55));
  const moon = new THREE.DirectionalLight('#dfe8ff', 1.5);
  moon.position.set(-7, 14, 5); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048);
  Object.assign(moon.shadow.camera, {left: -16, right: 16, top: 16, bottom: -16});
  scene.add(moon);

  // buildings: one instanced mesh
  const box = new THREE.BoxGeometry(1, 1, 1); box.translate(0, 0.5, 0);
  const inst = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({color: '#dedad6', roughness: 0.9}), N * N * 4);
  inst.castShadow = true; inst.receiveShadow = true;
  const m = new THREE.Matrix4(); let k = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const cx = (i - N / 2) * PITCH, cz = (j - N / 2) * PITCH;
    if (random(`park${i}-${j}`) < 0.07) continue;
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const d = Math.hypot(cx, cz);
      const hgt = 0.2 + random(`h${i}-${j}-${a}${b}`) ** 2 * (2.8 - Math.min(2.3, d * 0.13));
      const s = 0.43 + random(`s${i}-${j}-${a}${b}`) * 0.05;
      m.compose(new THREE.Vector3(cx + (a - 0.5) * 0.5, 0, cz + (b - 0.5) * 0.5), new THREE.Quaternion(), new THREE.Vector3(s, hgt, s));
      inst.setMatrixAt(k++, m);
    }
  }
  inst.count = k; scene.add(inst);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({color: '#0a0c0f', roughness: 1}));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const laneM = new THREE.MeshBasicMaterial({color: '#1d2228'});
  for (let i = 0; i <= N; i++) {
    const x = street(i);
    const a = new THREE.Mesh(new THREE.PlaneGeometry(0.035, N * PITCH), laneM); a.rotation.x = -Math.PI / 2; a.position.set(x, 0.002, -0.7); scene.add(a);
    const b = new THREE.Mesh(new THREE.PlaneGeometry(N * PITCH, 0.035), laneM); b.rotation.x = -Math.PI / 2; b.position.set(-0.7, 0.002, x); scene.add(b);
  }
  const orange = new THREE.MeshBasicMaterial({color: OR});
  const glowM = new THREE.MeshBasicMaterial({color: OR, transparent: true, opacity: 0.2});
  const tube = (c: THREE.CatmullRomCurve3) => {
    const g = new THREE.TubeGeometry(c, 500, 0.075, 8, false);
    const mesh = new THREE.Mesh(g, orange); mesh.add(new THREE.Mesh(new THREE.TubeGeometry(c, 500, 0.17, 8, false), glowM));
    scene.add(mesh); return {mesh, count: g.index!.count};
  };
  // route 1: restaurant → home along the grid
  const r1 = new THREE.CatmullRomCurve3([[8, 3], [8, 7], [10, 7.02], [12, 7], [12, 11], [12, 14]].map(([a, b]) => new THREE.Vector3(street(a), 0.03, street(b))), false, 'catmullrom', 0.02);
  const t1 = tube(r1);
  // route 2: long straight avenue for the chase
  const r2 = new THREE.CatmullRomCurve3([new THREE.Vector3(street(10), 0.03, street(18)), new THREE.Vector3(street(10), 0.03, street(2))]);
  const t2 = tube(r2);
  // pins: restaurant (orange) and home (white)
  const pins = new THREE.Group();
  const pin = (p: THREE.Vector3, color: string) => {
    const g = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), new THREE.MeshBasicMaterial({color}));
    stem.position.y = 0.35;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), new THREE.MeshBasicMaterial({color}));
    head.position.y = 0.8;
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.3, 32), new THREE.MeshBasicMaterial({color, transparent: true, opacity: 0.6, side: THREE.DoubleSide}));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; ring.name = 'ring';
    g.add(stem, head, ring); g.position.copy(p); pins.add(g); return g;
  };
  pin(r1.getPointAt(0), OR); pin(r1.getPointAt(1), '#ffffff');
  scene.add(pins);
  // moving order dots for the "many orders" shots
  const paths: World['paths'] = [];
  for (let q = 0; q < 90; q++) {
    const dir = (random(`dir${q}`) < 0.5 ? 0 : 1) as 0 | 1;
    paths.push({x: street(Math.floor(random(`sx${q}`) * (N + 1))), z: street(Math.floor(random(`sz${q}`) * (N + 1))), dir, len: N * PITCH, speed: 1.2 + random(`sp${q}`) * 1.6, off: random(`of${q}`) * 30});
  }
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.28, 12, 12), orange, paths.length);
  const trails = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.04, 0.16), glowM, paths.length);
  scene.add(dots, trails);
  const bikeLight = new THREE.PointLight(OR, 4, 3.5, 1.8); scene.add(bikeLight);
  new GLTFLoader().load(staticFile('models/vehicle-motorcycle.glb'), (g) => {
    const bike = g.scene; bike.scale.setScalar(0.42);
    bike.traverse((o: any) => { if (o.isMesh) { o.castShadow = true; o.material = o.material.clone(); o.material.color = new THREE.Color(OR2); } });
    scene.add(bike);
    onReady({renderer, scene, camera, r1, r1Mesh: t1.mesh, r1Count: t1.count, r2, r2Mesh: t2.mesh, r2Count: t2.count, bike, bikeLight, pins, dots, trails, paths});
  });
}

const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3();
function updateWorld(wd: World, f: number) {
  const t = f / FPS;
  const {camera} = wd;
  const showDots = f >= T.F3;
  // order dots
  wd.dots.visible = wd.trails.visible = showDots || f < T.F2;
  wd.paths.forEach((p, i) => {
    const s = ((t * p.speed + p.off) % p.len) - p.len / 2;
    const x = p.dir === 0 ? p.x : s - 0.7, z = p.dir === 0 ? s - 0.7 : p.z;
    tmpP.set(x, 0.12, z); tmpS.set(1, 1, 1); tmpQ.identity();
    wd.dots.setMatrixAt(i, tmpM.compose(tmpP, tmpQ, tmpS));
    const tl = 1.6;
    tmpP.set(p.dir === 0 ? x : x - tl / 2, 0.05, p.dir === 0 ? z - tl / 2 : z);
    tmpQ.setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.dir === 0 ? Math.PI / 2 : 0); tmpS.set(tl, 1, 1);
    wd.trails.setMatrixAt(i, tmpM.compose(tmpP, tmpQ, tmpS));
  });
  wd.dots.instanceMatrix.needsUpdate = true; wd.trails.instanceMatrix.needsUpdate = true;
  wd.pins.children.forEach((g) => { const r = g.getObjectByName('ring')!; const s = 1 + ((t * 0.8) % 1) * 1.6; r.scale.setScalar(s); (r as any).material.opacity = 0.6 * (1 - ((t * 0.8) % 1)); });
  wd.r1Mesh.visible = f < T.F2 || f >= T.F3; wd.pins.visible = f < T.F2 || f >= T.F3;
  wd.r2Mesh.visible = f >= T.F2 && f < T.F3;
  let head: THREE.Vector3, ahead: THREE.Vector3;
  if (f < T.F2) {
    // dive + feature 1: follow the order from restaurant to home
    const p = ease(f, T.DIVE + 10, T.F2 - 15, 0.0, 1, io);
    wd.r1Mesh.geometry.setDrawRange(0, Math.floor((wd.r1Count * Math.max(0.001, p)) / 6) * 6);
    head = wd.r1.getPointAt(p); ahead = wd.r1.getPointAt(Math.min(1, p + 0.02));
    if (p > 0.98) ahead = head.clone().add(new THREE.Vector3(0, 0, 0.1));
    const back = head.clone().sub(ahead).normalize();
    const zoom = ease(f, T.DIVE, T.F1 + 30, 15, 8, io);
    camera.position.set(head.x + back.x * zoom * 0.8 + 2.2, zoom * 1.25, head.z + back.z * zoom * 0.8 + 2.2);
    camera.lookAt(head.x, 0, head.z - 0.8);
  } else if (f < T.MQ + 15) {
    // feature 2: low chase behind the orange bike
    const p = ease(f, T.F2, T.MQ + 15, 0.05, 0.8, Easing.linear);
    wd.r2Mesh.geometry.setDrawRange(0, Math.floor((wd.r2Count * p) / 6) * 6);
    head = wd.r2.getPointAt(p); ahead = wd.r2.getPointAt(Math.min(1, p + 0.02));
    const back = head.clone().sub(ahead).normalize();
    const sway = Math.sin(t * 1.3) * 0.07;
    camera.position.set(head.x + back.x * 3.8 + sway, 1.15, head.z + back.z * 3.8);
    camera.lookAt(head.x + ahead.x * 0 - sway * 0.3, 0.35, head.z - 3.5);
  } else if (f < T.F4) {
    // feature 3: high top-down, slowly turning, many orders at once
    head = wd.r1.getPointAt(1); ahead = head.clone();
    wd.r1Mesh.geometry.setDrawRange(0, wd.r1Count);
    const a = ease(f, T.F3, T.F4, -0.3, 0.25, Easing.linear);
    const hgt = ease(f, T.F3, T.F3 + 60, 12, 24, io);
    camera.position.set(Math.sin(a) * 3, hgt, Math.cos(a) * 3 + 2);
    camera.lookAt(0, 0, 0);
  } else {
    // feature 4: wide orbit
    head = wd.r1.getPointAt(1); ahead = head.clone();
    const a = ease(f, T.F4, T.END, 0.6, 1.5, Easing.linear);
    camera.position.set(Math.sin(a) * 15, 11, Math.cos(a) * 15);
    camera.lookAt(0, 0.6, 0);
  }
  // bike on the active route
  const onR2 = f >= T.F2 && f < T.F3;
  const bp = onR2 ? ease(f, T.F2, T.MQ + 15, 0.05, 0.8, Easing.linear) : ease(f, T.DIVE + 10, T.F2 - 15, 0, 1, io);
  const curve = onR2 ? wd.r2 : wd.r1;
  const bpos = curve.getPointAt(Math.min(0.999, bp)), bnext = curve.getPointAt(Math.min(1, bp + 0.01));
  wd.bike.visible = f < T.F3;
  wd.bike.position.copy(bpos).setY(0.02);
  wd.bike.lookAt(bnext.x, 0.02, bnext.z);
  wd.bikeLight.position.set(bpos.x, 0.6, bpos.z);
  wd.bikeLight.visible = wd.bike.visible;
  void head; void ahead;
  camera.updateProjectionMatrix();
  wd.renderer.render(wd.scene, camera);
}

const WorldLayer: React.FC<{clip: string; opacity: number}> = ({clip, opacity}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const [wd, setWd] = useState<World | null>(null);
  const [handle] = useState(() => delayRender('presto world'));
  useEffect(() => { buildWorld(ref.current!, width, height, (w) => { setWd(w); continueRender(handle); }); }, []);
  useEffect(() => { if (wd) updateWorld(wd, f); }, [f, wd]);
  return (
    <AbsoluteFill style={{clipPath: clip, opacity}}>
      <canvas ref={ref} width={width} height={height} style={{width: '100%', height: '100%'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,8,10,0.95) 0%, rgba(6,8,10,0.6) 22%, rgba(6,8,10,0) 34%, rgba(6,8,10,0) 70%, rgba(6,8,10,0.85) 100%)'}} />
    </AbsoluteFill>
  );
};

/* =============================== OVERLAYS =============================== */
const FontFaces = () => <style>{`@font-face{font-family:'Readex';src:url(${staticFile('fonts/Readex.ttf')});font-weight:160 700;font-display:block}`}</style>;
const grad = {backgroundImage: `linear-gradient(160deg, ${OR2} 0%, ${OR} 60%, #e2480b 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'} as React.CSSProperties;

const Blur: React.FC<{text: string; at: number; size: number; color?: string; weight?: number; style?: React.CSSProperties}> = ({text, at, size, color = INK, weight = 700, style}) => {
  const f = useCurrentFrame();
  return (
    <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.25em', fontFamily: RX, fontWeight: weight, fontSize: size, lineHeight: 1.3, color, ...style}}>
      {text.split(' ').map((w, i) => {
        const p = ease(f, at + i * 3, at + i * 3 + 14);
        return <span key={i} style={{display: 'inline-block', opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * 24}px)`}}>{w}</span>;
      })}
    </div>
  );
};

/** Opening on the white ground: whisper word, hero dot, countdown, promise. */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shh = ease(f, 4, 34);
  const shhOut = ease(f, 66, 76, 1, 0);
  const digits = ['٣', '٢', '١'];
  const di = Math.floor((f - 76) / 15);
  const promiseIn = f >= T.PROMISE;
  // hero dot path
  const drop = spring({frame: f - 40, fps, config: {damping: 9}});
  let dx = 540, dy = 600 + 160 * drop, ds = 46;
  if (f >= 76 && f < T.PROMISE) { const hop = ((f - 76) % 15) / 15; dy = 690 - Math.sin(hop * Math.PI) * 60; dx = 540; }
  if (f >= T.PROMISE) { dx = interpolate(f, [T.PROMISE, T.PROMISE + 14], [540, 112], {...clamp, easing: out}); dy = interpolate(f, [T.PROMISE, T.PROMISE + 14], [690, 838], {...clamp, easing: out}); }
  if (f >= T.DIVE - 8) { const k = ease(f, T.DIVE - 8, T.DIVE + 2, 0, 1, io); dx = 112 + (540 - 112) * k; dy = 838 + (960 - 838) * k; }
  const hookOut = ease(f, T.DIVE - 6, T.DIVE + 4, 1, 0);
  return (
    <AbsoluteFill style={{opacity: hookOut}}>
      {f < 80 ? <div style={{position: 'absolute', top: 780, width: '100%', textAlign: 'center', fontFamily: RX, fontWeight: 700, fontSize: 210, color: INK, opacity: shh * shhOut, filter: `blur(${(1 - shh) * 26}px)`, transform: `scale(${1.25 - 0.25 * shh})`, letterSpacing: 6}}>شششش</div> : null}
      {f >= 76 && f < T.PROMISE ? (
        <div style={{position: 'absolute', top: 760, width: '100%', display: 'flex', justifyContent: 'center', gap: 70, direction: 'rtl'}}>
          {digits.map((d, i) => {
            const p = ease(f, 76 + i * 15, 76 + i * 15 + 8);
            const gone = ease(f, T.PROMISE - 6, T.PROMISE, 1, 0);
            return <span key={d} style={{fontFamily: RX, fontWeight: 700, fontSize: 250, lineHeight: 1, ...grad, opacity: p * gone, transform: `translateY(${(1 - p) * 40}px) scale(${i === di ? 1.08 : 1})`}}>{d}</span>;
          })}
        </div>
      ) : null}
      {promiseIn ? (
        <div style={{position: 'absolute', top: 760, left: 60, right: 60}}>
          <Blur text="حاجات على بريستو" at={T.PROMISE + 4} size={104} />
          <Blur text="يمكن ما كنت تعرفها" at={T.PROMISE + 16} size={56} weight={500} color="#6b6e73" />
        </div>
      ) : null}
      {f >= 40 ? <div style={{position: 'absolute', left: dx - ds / 2, top: dy - ds / 2, width: ds, height: ds, borderRadius: ds, background: OR, boxShadow: `0 0 0 10px ${OR}33`}} /> : null}
    </AbsoluteFill>
  );
};

const Badge: React.FC<{n: number; at: number}> = ({n, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 12}});
  return <div style={{position: 'absolute', top: 120, right: 70, width: 96, height: 96, borderRadius: 48, background: OR, color: '#fff', fontFamily: RX, fontWeight: 700, fontSize: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, boxShadow: `0 0 0 10px ${OR}40`}}>{n}</div>;
};
const Chip: React.FC<{text: string; at: number; top?: number; dark?: boolean}> = ({text, at, top = 128, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 13}});
  return (
    <div style={{position: 'absolute', top, left: 70, right: 200, display: 'flex', justifyContent: 'flex-end', direction: 'ltr'}}>
      <div style={{direction: 'rtl', fontFamily: RX, fontWeight: 600, fontSize: 40, color: dark ? INK : '#fff', background: dark ? '#fff' : 'rgba(255,255,255,0.08)', border: `2px solid ${OR}`, borderRadius: 999, padding: '14px 32px', transform: `translateX(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 1.5)}}>{text}</div>
    </div>
  );
};
const Caption: React.FC<{text: string; at: number; hl?: string}> = ({text, at, hl = ''}) => {
  const f = useCurrentFrame();
  const p = ease(f, at - 4, at + 10);
  const hw = new Set(hl.split(' '));
  return (
    <div style={{position: 'absolute', bottom: 150, left: 60, right: 60, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <div style={{background: 'rgba(14,16,19,0.82)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: '28px 36px', backdropFilter: 'blur(8px)'}}>
        <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.26em', fontFamily: RX, fontWeight: 500, fontSize: 52, lineHeight: 1.5, color: '#fff'}}>
          {text.split(' ').map((w, i) => {
            const q = ease(f, at + i * 3, at + i * 3 + 12);
            return w === '|' ? <div key={i} style={{flexBasis: '100%', height: 0}} /> : <span key={i} style={{display: 'inline-block', opacity: q, filter: `blur(${(1 - q) * 8}px)`, color: hw.has(w) ? OR2 : undefined, fontWeight: hw.has(w) ? 700 : 500}}>{w}</span>;
          })}
        </div>
      </div>
    </div>
  );
};
const fmt = (v: number) => Math.round(v).toLocaleString('en-US');

const F1: React.FC = () => {
  const f = useCurrentFrame();
  const n = fmt(300 * ease(f, T.F1 + 70, T.F1 + 120));
  return (
    <>
      <Badge n={1} at={T.F1 + 4} />
      <Chip text="يونيو 2020 · طرابلس" at={T.F1 + 10} />
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', opacity: ease(f, T.F1 + 62, T.F1 + 74)}}>
        <div style={{fontFamily: RX, fontWeight: 700, fontSize: 190, color: '#fff', lineHeight: 1}}>{n}</div>
        <div style={{fontFamily: RX, fontWeight: 500, fontSize: 46, color: OR2, marginTop: 6, direction: 'rtl'}}>طلب في أول يوم</div>
      </div>
      <Caption text="بدت من طرابلس… | من مطعم لباب الحوش." at={T.F1 + 24} hl="طرابلس…" />
    </>
  );
};
const F2: React.FC = () => (
  <>
    <Badge n={2} at={T.F2 + 4} />
    <Chip text="ليش برتقالي؟" at={T.F2 + 10} />
    <Caption text="البرتقالي يبان حتى في الليل… | عشان سلامة السايق." at={T.F2 + 40} hl="البرتقالي الليل…" />
  </>
);
const F3: React.FC = () => {
  const f = useCurrentFrame();
  const n = fmt(23000 * ease(f, T.F3 + 30, T.F3 + 110, 0, 1, io));
  return (
    <>
      <Badge n={3} at={T.F3 + 4} />
      <Chip text="رقم قياسي" at={T.F3 + 10} />
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', opacity: ease(f, T.F3 + 24, T.F3 + 36)}}>
        <div style={{fontFamily: RX, fontWeight: 700, fontSize: 200, color: '#fff', lineHeight: 1, direction: 'ltr'}}>{n}<span style={{color: OR}}>+</span></div>
        <div style={{fontFamily: RX, fontWeight: 500, fontSize: 46, color: OR2, marginTop: 6, direction: 'rtl'}}>طلب في يوم واحد</div>
      </div>
      <Caption text="كل نقطة برتقالية… | طلب في الطريق لصاحبه." at={T.F3 + 50} hl="برتقالية…" />
    </>
  );
};
const F4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cities = ['طرابلس', 'بنغازي', 'مصراتة', 'زليتن'];
  const stats: [number, string, string][] = [[24000, '', 'سايق'], [2000, '+', 'تاجر'], [1, '≈', 'مليون تحميل']];
  return (
    <>
      <Badge n={4} at={T.F4 + 4} />
      <Chip text="4 مدن" at={T.F4 + 10} />
      <div style={{position: 'absolute', top: 290, left: 70, right: 70, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, direction: 'rtl'}}>
        {cities.map((c, i) => {
          const p = spring({frame: f - T.F4 - 22 - i * 7, fps, config: {damping: 12}});
          return (
            <div key={c} style={{background: 'rgba(14,16,19,0.8)', border: `2px solid ${i === 0 ? OR : 'rgba(255,255,255,0.12)'}`, borderRadius: 26, padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${p})`, opacity: Math.min(1, p * 1.4)}}>
              <span style={{width: 22, height: 22, borderRadius: 11, background: OR, boxShadow: `0 0 0 8px ${OR}33`}} />
              <span style={{fontFamily: RX, fontWeight: 700, fontSize: 48, color: '#fff'}}>{c}</span>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 640, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', direction: 'rtl'}}>
        {stats.map(([v, pre, l], i) => {
          const p = ease(f, T.F4 + 60 + i * 10, T.F4 + 100 + i * 10);
          return (
            <div key={l} style={{textAlign: 'center', opacity: Math.min(1, p * 2)}}>
              <div style={{fontFamily: RX, fontWeight: 700, fontSize: 84, color: '#fff', direction: 'ltr'}}>{pre}{v === 1 ? '1' : fmt(v * p)}</div>
              <div style={{fontFamily: RX, fontWeight: 500, fontSize: 38, color: OR2}}>{l}</div>
            </div>
          );
        })}
      </div>
      <Caption text="ثاني أكبر تطبيق توصيل | في شمال أفريقيا." at={T.F4 + 90} hl="ثاني أكبر" />
    </>
  );
};

/** Mid-film kinetic interstitial: tilted marquee bands. */
const Marquee: React.FC = () => {
  const f = useCurrentFrame();
  const l = f - T.MQ;
  if (l < -10 || l > 42) return null;
  const phrase = 'بريستو ✦ طرابلس ✦ بنغازي ✦ مصراتة ✦ زليتن ✦ ';
  const bands = [OR, '#ffffff', INK, OR, '#ffffff', INK, OR, '#ffffff', INK, OR];
  const inK = ease(l, -10, 4, 0, 1, io), outK = ease(l, 26, 42, 0, 1, io);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -500, top: -400, width: 2100, transform: 'rotate(-12deg)'}}>
        {bands.map((c, i) => {
          const dir = i % 2 ? 1 : -1;
          const enter = (1 - inK) * 2200 * dir + outK * -2200 * dir;
          return (
            <div key={i} style={{height: 290, background: c, overflow: 'hidden', whiteSpace: 'nowrap', transform: `translateX(${enter}px)`, display: 'flex', alignItems: 'center'}}>
              <div style={{fontFamily: RX, fontWeight: 700, fontSize: 120, color: c === INK ? OR : c === OR ? '#fff' : INK, transform: `translateX(${dir * l * 22 - 400}px)`, direction: 'rtl'}}>{phrase.repeat(4)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Ring wipe around the hero dot, opening the brand end card. */
const RingAndEnd: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < T.RING - 6) return null;
  const r = ease(f, T.RING, T.RING + 22, 20, 1250, io);
  const ringR = ease(f, T.RING - 6, T.RING + 10, 0, 150, out);
  const rot = (f - T.RING) * 14;
  const l = f - T.END;
  // wordmark: the white dot becomes the final "o" of Presto
  const dotK = ease(l, 6, 30, 0, 1, io);
  const word = ease(l, 22, 44, 0, 1, io);
  const sub = spring({frame: l - 46, fps, config: {damping: 14}});
  const dotX = 540 + (827 - 540) * dotK, dotY = 960 + 5 * dotK, dotS = 70 + 58 * dotK;
  return (
    <>
      <AbsoluteFill style={{clipPath: `circle(${r}px at 540px 960px)`, background: `radial-gradient(circle at 50% 42%, ${OR2} 0%, ${OR} 55%, #e4500d 100%)`}}>
        <div style={{position: 'absolute', top: 820, left: 190, direction: 'ltr', fontFamily: RX, fontWeight: 700, fontSize: 230, color: '#fff', lineHeight: 1, letterSpacing: -6, whiteSpace: 'nowrap', clipPath: `inset(0 ${(1 - word) * 100}% 0 0)`}}>Prest</div>
        <div style={{position: 'absolute', top: 1100, left: 60, right: 60, textAlign: 'center', opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`}}>
          <div style={{fontFamily: RX, fontWeight: 700, fontSize: 80, color: '#fff', direction: 'rtl'}}>بريستو</div>
          <div style={{fontFamily: RX, fontWeight: 500, fontSize: 46, color: 'rgba(255,255,255,0.92)', direction: 'rtl', marginTop: 8}}>من طرابلس… لأربع مدن</div>
          <div style={{marginTop: 36, display: 'inline-flex', alignItems: 'center', gap: 14, background: '#fff', color: OR, borderRadius: 999, padding: '16px 40px', fontFamily: RX, fontWeight: 700, fontSize: 44, direction: 'rtl', opacity: ease(l, 80, 92)}}>اطلب من التطبيق</div>
          <div style={{marginTop: 26, fontFamily: RX, fontWeight: 400, fontSize: 24, color: 'rgba(255,255,255,0.75)', direction: 'rtl', opacity: ease(l, 96, 108)}}>الأرقام: Libya Herald 2021 · Rest of World 2024</div>
        </div>
        {/* hero dot = the "o" */}
        <div style={{position: 'absolute', left: dotX - dotS / 2, top: dotY - dotS / 2, width: dotS, height: dotS, borderRadius: dotS, border: `${Math.max(1, 30 * dotK)}px solid #fff`, background: dotK < 0.6 ? '#fff' : 'transparent', boxSizing: 'border-box', opacity: ease(f, T.RING + 8, T.RING + 14)}} />
      </AbsoluteFill>
      {f < T.RING + 26 ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} aria-hidden="true">
          <circle cx={540} cy={960} r={Math.max(1, ringR + (r > 150 ? r - 150 : 0))} fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeDasharray={`${Math.PI * 2 * (ringR + 1) * 0.7} 9999`} transform={`rotate(${rot} 540 960)`} opacity={ease(f, T.RING + 14, T.RING + 26, 1, 0)} />
          <circle cx={540} cy={960} r={30} fill={OR} opacity={ease(f, T.RING - 6, T.RING + 4, 1, 0)} />
        </svg>
      ) : null}
    </>
  );
};

export const PrestoWorld: React.FC = () => {
  const f = useCurrentFrame();
  // iris: the hero dot opens into the world
  const iris = f < T.DIVE ? 0 : ease(f, T.DIVE, T.F1 + 4, 23, 1250, io);
  const irisRing = f >= T.DIVE && f < T.F1 + 6;
  return (
    <AbsoluteFill style={{background: '#ffffff'}}>
      <FontFaces />
      <WorldLayer clip={`circle(${iris}px at 540px 960px)`} opacity={ease(f, T.RING + 10, T.RING + 24, 1, 0)} />
      {irisRing ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} aria-hidden="true"><circle cx={540} cy={960} r={iris} fill="none" stroke={OR} strokeWidth={22} /></svg>
      ) : null}
      {f < T.DIVE + 6 ? <Hook /> : null}
      {f >= T.F1 && f < T.F2 ? <F1 /> : null}
      {f >= T.F2 && f < T.MQ + 10 ? <F2 /> : null}
      {f >= T.F3 && f < T.F4 ? <F3 /> : null}
      {f >= T.F4 && f < T.RING + 10 ? <F4 /> : null}
      <Marquee />
      <RingAndEnd />
    </AbsoluteFill>
  );
};
