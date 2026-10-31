// Test: frame-driven three.js "clay city" (procedural blocks + glowing roads + route + Kenney CC0 truck).
import React, {useEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, Easing, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 150;

const BRAND = '#5ff46d';
const ROUTE = '#2f6bff';

type World = {renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera; route: THREE.Mesh; puck: THREE.Group; truck?: THREE.Object3D; curve: THREE.CatmullRomCurve3; routeCount: number};

function buildCity(scene: THREE.Scene) {
  const N = 18, cell = 1, gap = 0.42, pitch = cell + gap;
  const block = new THREE.BoxGeometry(1, 1, 1);
  block.translate(0, 0.5, 0);
  const white = new THREE.MeshStandardMaterial({color: '#ece7e3', roughness: 0.85, metalness: 0});
  const count = N * N * 4;
  const inst = new THREE.InstancedMesh(block, white, count);
  inst.castShadow = true; inst.receiveShadow = true;
  const m = new THREE.Matrix4();
  let k = 0;
  const parks: THREE.Vector3[] = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const cx = (i - N / 2) * pitch, cz = (j - N / 2) * pitch;
    if (random(`p${i}-${j}`) < 0.08) { parks.push(new THREE.Vector3(cx, 0, cz)); continue; }
    // 2x2 sub-buildings per block, varied heights (taller toward the centre)
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const d = Math.hypot(cx, cz);
      const h = 0.18 + random(`h${i}-${j}-${a}${b}`) ** 2 * (2.6 - Math.min(2.1, d * 0.12));
      const s = 0.42 + random(`s${i}-${j}-${a}${b}`) * 0.06;
      m.compose(new THREE.Vector3(cx + (a - 0.5) * 0.5, 0, cz + (b - 0.5) * 0.5), new THREE.Quaternion(), new THREE.Vector3(s, h, s));
      inst.setMatrixAt(k++, m);
    }
  }
  inst.count = k;
  scene.add(inst);
  // park dots (emissive green)
  const dotG = new THREE.SphereGeometry(0.035, 8, 8);
  const dotM = new THREE.MeshBasicMaterial({color: BRAND});
  for (const p of parks) for (let q = 0; q < 16; q++) {
    const d = new THREE.Mesh(dotG, dotM);
    d.position.set(p.x + (random(`dx${p.x}${q}`) - 0.5) * 0.9, 0.04, p.z + (random(`dz${p.z}${q}`) - 0.5) * 0.9);
    scene.add(d);
  }
  // ground + road lane marks
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({color: '#0b0d10', roughness: 1}));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const laneM = new THREE.MeshBasicMaterial({color: '#20262b'});
  for (let i = 0; i <= N; i++) {
    const x = (i - N / 2 - 0.5) * pitch;
    const a = new THREE.Mesh(new THREE.PlaneGeometry(0.04, N * pitch), laneM); a.rotation.x = -Math.PI / 2; a.position.set(x, 0.002, -0.7); scene.add(a);
    const b = new THREE.Mesh(new THREE.PlaneGeometry(N * pitch, 0.04), laneM); b.rotation.x = -Math.PI / 2; b.position.set(-0.7, 0.002, x); scene.add(b);
  }
  return pitch;
}

function useWorld(canvas: React.RefObject<HTMLCanvasElement>, width: number, height: number) {
  const [world, setWorld] = useState<World | null>(null);
  const [handle] = useState(() => delayRender('three world'));
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({canvas: canvas.current!, antialias: true, preserveDrawingBuffer: true});
    renderer.setSize(width, height, false);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07090b');
    scene.fog = new THREE.Fog('#07090b', 9, 26);
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    scene.add(new THREE.HemisphereLight('#ffffff', '#1a2024', 0.9));
    const sun = new THREE.DirectionalLight('#ffffff', 2.2);
    sun.position.set(-6, 12, 4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, {left: -14, right: 14, top: 14, bottom: -14});
    scene.add(sun);
    const pitch = buildCity(scene);
    // the route: follows the street grid, glowing
    const r = (i: number) => (i - 0.5) * pitch;
    const pts = [[-1, 9], [-1, 3], [-1, 0.2], [1.5, 0], [3, 0], [3, -3], [3, -9]].map(([a, b]) => new THREE.Vector3(r(a) - 0.0, 0.03, r(b)));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.02);
    const tube = new THREE.TubeGeometry(curve, 400, 0.07, 8, false);
    const route = new THREE.Mesh(tube, new THREE.MeshBasicMaterial({color: ROUTE}));
    scene.add(route);
    const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, 400, 0.16, 8, false), new THREE.MeshBasicMaterial({color: ROUTE, transparent: true, opacity: 0.18}));
    route.add(glow);
    const puck = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 32), new THREE.MeshBasicMaterial({color: '#ffffff'}));
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 32), new THREE.MeshBasicMaterial({color: ROUTE}));
    puck.add(ring, core); scene.add(puck);
    const w: World = {renderer, scene, camera, route, puck, curve, routeCount: tube.index!.count};
    new GLTFLoader().load(staticFile('models/vehicle-truck-green.glb'), (g) => {
      const truck = g.scene; truck.scale.setScalar(0.32); truck.traverse((o: any) => { if (o.isMesh) o.castShadow = true; });
      scene.add(truck); w.truck = truck; setWorld(w); continueRender(handle);
    }, undefined, () => { setWorld(w); continueRender(handle); });
  }, []);
  return world;
}

export const CityTest: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const world = useWorld(ref, width, height);
  useEffect(() => {
    if (!world) return;
    const p = interpolate(f, [0, DURATION - 1], [0.02, 0.98], {easing: Easing.inOut(Easing.cubic)});
    world.route.geometry.setDrawRange(0, Math.floor(world.routeCount * p / 6) * 6);
    const head = world.curve.getPointAt(p), ahead = world.curve.getPointAt(Math.min(1, p + 0.02));
    world.puck.position.copy(head);
    if (world.truck) { world.truck.position.copy(world.curve.getPointAt(Math.max(0, p - 0.06))); world.truck.lookAt(head.x, 0, head.z); }
    const back = head.clone().sub(ahead).normalize();
    world.camera.position.set(head.x + back.x * 6 + 2.5, 7.5, head.z + back.z * 6 + 2.5);
    world.camera.lookAt(head.x, 0, head.z - 1.2);
    world.renderer.render(world.scene, world.camera);
  }, [f, world]);
  return (
    <AbsoluteFill style={{background: '#07090b'}}>
      <canvas ref={ref} width={width} height={height} style={{width: '100%', height: '100%'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,9,11,0.85) 0%, rgba(7,9,11,0) 22%, rgba(7,9,11,0) 80%, rgba(7,9,11,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};
