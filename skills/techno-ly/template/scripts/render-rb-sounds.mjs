// Render React Bits sound recipes to WAV (never commit the WAVs or the recipes).
// usage: node scripts/render-rb-sounds.mjs /path/to/react-bits out/rbs tink,reveal,swish,...
// Needs esbuild + react (any copy) and Playwright's Chromium (OfflineAudioContext).
import fs from 'fs'; import path from 'path'; import { execSync } from 'child_process';
const [rb, outDir, list] = process.argv.slice(2); const names = list.split(',');
const js = `${rb}/src/sounds/js`; fs.mkdirSync(outDir, { recursive: true });
const ok = names.filter((n) => fs.existsSync(`${js}/${n}.js`));
const entry = `import { renderSound } from '${js}/react-bits-sound.js';\n${ok.map((n) => `import s_${n.replace(/-/g, '_')} from '${js}/${n}.js';`).join('\n')}\nconst R={${ok.map((n) => `'${n}':s_${n.replace(/-/g, '_')}`).join(',')}};\nwindow.__render=async()=>{const out={};for(const [k,r] of Object.entries(R)){const b=await renderSound(r,{},{sampleRate:48000,channels:2});const L=b.getChannelData(0),Rr=b.getChannelData(1);const p=new Int16Array(L.length*2);for(let i=0;i<L.length;i++){p[2*i]=Math.max(-1,Math.min(1,L[i]))*32767;p[2*i+1]=Math.max(-1,Math.min(1,Rr[i]))*32767}let s='';const u=new Uint8Array(p.buffer);for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));out[k]=btoa(s)}return out};`;
fs.writeFileSync(`${outDir}/_entry.js`, entry);
const esbuild = process.env.ESBUILD || 'esbuild'; const react = process.env.REACT_DIR || 'react';
execSync(`${esbuild} ${outDir}/_entry.js --bundle --format=iife --outfile=${outDir}/_b.js --alias:react=${react} --log-level=error`);
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const b = await chromium.launch(); const p = await b.newPage(); await p.setContent('<html></html>'); await p.addScriptTag({ content: fs.readFileSync(`${outDir}/_b.js`, 'utf8') });
const out = await p.evaluate('window.__render()');
for (const [k, v] of Object.entries(out)) { const pcm = Buffer.from(v, 'base64'); const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(48000, 24); h.writeUInt32LE(192000, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); fs.writeFileSync(path.join(outDir, `${k}.wav`), Buffer.concat([h, pcm])); }
await b.close(); console.log('rendered', Object.keys(out).length, 'sounds to', outDir);
