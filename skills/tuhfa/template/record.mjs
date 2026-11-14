// node record.mjs stills 1.2,5,9  → out/stills/t<sec>.png
// FPS=60 DSF=4 STEP=2 OFF=0|1 node record.mjs frames <from> <to> [dir] → dir/f%05d.jpg (run OFF=0 and OFF=1 in parallel)
const {chromium} = await import(process.env.PLAYWRIGHT || 'playwright');
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const [mode, a, b] = process.argv.slice(2); const FPS = +(process.env.FPS||30); const DSF = +(process.env.DSF||2);
const types = {html: 'text/html', css: 'text/css', svg: 'image/svg+xml', ttf: 'font/ttf', js: 'application/javascript'};
const port = 8810 + Math.floor(Math.random() * 80);
const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html'; const f = path.join(process.cwd(), u);
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, {'content-type': types[f.split('.').pop()] || 'application/octet-stream'}); r.end(d); }); }).listen(port);
const br = await chromium.launch({args: ['--font-render-hinting=none']}); const pg = await br.newPage({viewport: {width: 540, height: 960}, deviceScaleFactor: DSF});
pg.on('pageerror', e => console.log('[err]', e.message)); pg.on('console', m => { if (m.type() === 'error') console.log('[console]', m.text()); });
await pg.goto(`http://127.0.0.1:${port}/` + (process.env.ONLY ? `?only=${process.env.ONLY}` : ""));
for (let k = 0; k < 100 && !(await pg.evaluate('!!window.__mounted')); k++) await new Promise(r => setTimeout(r, 100));
await pg.evaluate(()=>Promise.all(['800 20px Alexandria','900 20px Kufam','700 20px Cairo','400 20px "Noto Sans Arabic"','700 20px "Noto Sans Arabic"','600 20px Inter'].map(f=>document.fonts.load(f)))); await new Promise(r => setTimeout(r, 300)); await pg.evaluate(`Promise.all([...document.images].map(i=>i.decode().catch(()=>0)))`);
const shot = async (t, file, type) => { await pg.evaluate(`window.__seek(${t})`); await pg.evaluate(`Promise.all([...document.images].map(i=>i.decode().catch(()=>0)))`); await pg.evaluate('new Promise(r=>requestAnimationFrame(()=>r()))'); await pg.screenshot({path: file, type, quality: type === 'jpeg' ? 92 : undefined, clip: {x: 0, y: 0, width: 540, height: 960}}); };
if (mode === 'stills') { fs.mkdirSync('out/stills', {recursive: true}); for (const t of a.split(',')) await shot(+t, `out/stills/t${t}.png`, 'png'); }
else { const dir = process.argv[5] || 'out/frames'; fs.mkdirSync(dir, {recursive: true}); const f0 = Math.round(+a * FPS), f1 = Math.round(+b * FPS);
  const STEP = +(process.env.STEP||1), OFF = +(process.env.OFF||0);
  for (let i = f0 + OFF; i < f1; i += STEP) { await shot(i / FPS, `${dir}/f${String(i).padStart(5, '0')}.jpg`, 'jpeg'); if (i % 150 === 0) process.stdout.write(`${i} `); } }
await br.close(); srv.close(); console.log('done');
