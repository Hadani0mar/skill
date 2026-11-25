import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let puppeteer;
try { puppeteer = require('puppeteer'); } catch { puppeteer = createRequire(process.env.NPM_TOOLS || '/opt/npm-tools/node_modules/')('puppeteer'); }
const [, , out, dur, fps, only] = process.argv;
const N = Math.round(+dur * +fps);
const b = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage();
await p.setViewport({ width: 960, height: 600, deviceScaleFactor: 2 });
const here = new URL('.', import.meta.url);
await p.goto(new URL(process.env.PAGE || 'install-as-app.html', here).href);
await p.evaluate(() => document.fonts.ready);
if (process.env.EVJSON) await p.evaluate(ev => { window.EV = ev; }, JSON.parse(require('fs').readFileSync(process.env.EVJSON, 'utf8')));
const list = only ? only.split(',').map(Number) : [...Array(N).keys()];
for (const i of list) {
  await p.evaluate(t => window.render(t), i / +fps);
  await p.screenshot({ path: `${out}/${String(i).padStart(4, '0')}.png`, omitBackground: true });
}
await b.close();
