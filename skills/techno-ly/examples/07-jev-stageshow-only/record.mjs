// node record.mjs stills 5,12,30   → out/stills/t<sec>.png      (steps the stage's virtual clock at 30 fps)
// node record.mjs frames [maxSec]  → out/frames/f%05d.jpg until the script sets data-done, and prints the frame count
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright')
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'
const [mode, arg] = process.argv.slice(2); const FPS = 30
const types = { html: 'text/html', css: 'text/css', js: 'application/javascript', ttf: 'font/ttf', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml' }
const port = 8900 + Math.floor(Math.random() * 90)
const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html'; const f = path.join(process.cwd(), u)
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return } r.writeHead(200, { 'content-type': types[f.split('.').pop()] || 'application/octet-stream' }); r.end(d) }) }).listen(port)
const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 })
pg.on('pageerror', (e) => console.log('[err]', e.message)); pg.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console.log('[' + m.type() + ']', m.text()) })
await pg.goto(`http://127.0.0.1:${port}/?record=1`)
for (let k = 0; k < 100 && !(await pg.evaluate('!!window.__mounted')); k++) await new Promise((r) => setTimeout(r, 100))
await pg.evaluate('Promise.all([document.fonts.load("800 20px Beiruti"),document.fonts.load("400 20px Beiruti")])')
const step = (n = 1) => pg.evaluate((n) => window.__stageshow.clock.step(n), n)
const shot = (file, type) => pg.screenshot({ path: file, type, quality: type === 'jpeg' ? 92 : undefined, clip: { x: 0, y: 0, width: 360, height: 640 } })
await step(3)
if (mode === 'stills') { fs.mkdirSync('out/stills', { recursive: true }); let f = 0
  for (const t of arg.split(',').map(Number).sort((a, b) => a - b)) { const target = Math.round(t * FPS); for (; f < target; f++) await step(1); await shot(`out/stills/t${t}.png`, 'png') } }
else { fs.mkdirSync('out/frames', { recursive: true }); const sig = []; const readSig = () => pg.evaluate('document.querySelector("[data-sig]")?.dataset.sig||""'); const max = Math.round((+arg || 200) * FPS); let i = 0
  for (; i < max; i++) { sig.push(await readSig()); await shot(`out/frames/f${String(i).padStart(5, '0')}.jpg`, 'jpeg'); if (i % 30 === 29 && (await pg.evaluate('!!document.querySelector("[data-done=true]")'))) { i += 45; for (let k = 0; k < 45; k++) { await step(1); await shot(`out/frames/f${String(i - 44 + k).padStart(5, '0')}.jpg`, 'jpeg') } break } await step(1) }
  fs.writeFileSync('out/sig.json', JSON.stringify(sig)); console.log('frames', i + 1) }
await br.close(); srv.close(); console.log('done')
