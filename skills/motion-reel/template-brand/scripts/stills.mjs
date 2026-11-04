// node scripts/stills.mjs <out_dir> <t1> <t2> ...   (seconds; COMP=<id> for another composition)
// Renders exact frames so you (and the human) can look before a full render.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
const [out, ...ts] = process.argv.slice(2);
if (!out || !ts.length) { console.log('usage: node scripts/stills.mjs out/stills 1.5 3.2 5.0'); process.exit(1); }
mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: process.env.COMP || 'BrandFilm'});
for (const t of ts) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(t) * composition.fps));
  await renderStill({composition, serveUrl, output: `${out}/t${String(t).padStart(5, '0')}.png`, frame, imageFormat: 'png'});
  process.stdout.write(t + ' ');
}
console.log('done');
