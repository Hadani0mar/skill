import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';
import * as chromiumModule from '@sparticuz/chromium';
import {chromium as playwrightChromium} from 'playwright-core';

const project = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const temp = '/tmp/arena-agent-sounds';
fs.mkdirSync(temp, {recursive: true});
const rb = path.join(process.env.REACT_BITS_ROOT ?? '/tmp/react-bits', 'src/sounds/js');
const source = `
import {renderSound} from '${rb}/react-bits-sound.js';
import calm from '${rb}/calm.js';
import unfold from '${rb}/unfold.js';
import swish from '${rb}/swish.js';
import glimmer from '${rb}/glimmer.js';
import stamp from '${rb}/stamp.js';
import emblem from '${rb}/emblem.js';
import blop from '${rb}/blop.js';
const recipes={calm,unfold,swish,glimmer,stamp,emblem,blop};
function wav(buffer){
 const channels=buffer.numberOfChannels, length=buffer.length, rate=buffer.sampleRate;
 const out=new DataView(new ArrayBuffer(44+length*channels*2));
 const text=(offset,str)=>{for(let i=0;i<str.length;i++)out.setUint8(offset+i,str.charCodeAt(i));};
 text(0,'RIFF');out.setUint32(4,36+length*channels*2,true);text(8,'WAVE');text(12,'fmt ');out.setUint32(16,16,true);out.setUint16(20,1,true);out.setUint16(22,channels,true);out.setUint32(24,rate,true);out.setUint32(28,rate*channels*2,true);out.setUint16(32,channels*2,true);out.setUint16(34,16,true);text(36,'data');out.setUint32(40,length*channels*2,true);
 let offset=44;for(let i=0;i<length;i++)for(let c=0;c<channels;c++){const v=Math.max(-1,Math.min(1,buffer.getChannelData(c)[i]));out.setInt16(offset,v*32767,true);offset+=2;}return new Uint8Array(out.buffer);
}
window.renderRB=async(name)=>{const buffer=await renderSound(recipes[name],{}, {sampleRate:48000});const bytes=wav(buffer);let s='';for(let i=0;i<bytes.length;i+=32768)s+=String.fromCharCode.apply(null,bytes.subarray(i,i+32768));return btoa(s);};
window.RB_NAMES=Object.keys(recipes);
`;
const entry = path.join(temp, 'entry.js');
const bundleFile = path.join(temp, 'sounds.js');
fs.writeFileSync(entry, source);
await build({entryPoints:[entry],bundle:true,format:'iife',outfile:bundleFile,platform:'browser',target:'chrome120',nodePaths:[path.join(project,'node_modules')],logLevel:'warning'});
const chromium = chromiumModule.default ?? chromiumModule;
await chromiumModule.inflate(path.join(project, 'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));
chromiumModule.setupLambdaEnvironment('/tmp/al2023/lib');
const browser = await playwrightChromium.launch({headless:true,executablePath:await chromium.executablePath(),args:chromium.args});
const page = await browser.newPage();
page.on('pageerror',e=>console.error('browser error:',e.message));
await page.setContent('<!doctype html><html><body></body></html>');
await page.addScriptTag({path:bundleFile});
const names=await page.evaluate(()=>window.RB_NAMES);
const clips={};
for(const name of names){
 console.log('render React Bits sound',name);
 clips[name]=Buffer.from(await page.evaluate(async(name)=>window.renderRB(name),name),'base64');
 fs.writeFileSync(path.join(temp,`${name}.wav`),clips[name]);
}
await browser.close();

function parseWav(buffer){
 const view=new DataView(buffer.buffer,buffer.byteOffset,buffer.byteLength);
 const channels=view.getUint16(22,true), rate=view.getUint32(24,true), dataOffset=44;
 const samples=new Float32Array((buffer.length-dataOffset)/2);
 for(let i=0;i<samples.length;i++)samples[i]=view.getInt16(dataOffset+i*2,true)/32768;
 return {channels,rate,frames:samples.length/channels,samples};
}
const parsed=Object.fromEntries(Object.entries(clips).map(([n,b])=>[n,parseWav(b)]));
const rate=48000, channels=2, duration=45, totalFrames=rate*duration, out=new Float32Array(totalFrames*channels);
const bed=parsed.calm; if(bed.rate!==rate) throw new Error('unexpected sound sample rate');
const fade=Math.round(rate*0.65), stride=bed.frames-fade;
for(let start=0,cycle=0;start<totalFrames;start+=stride,cycle++){
 const count=Math.min(bed.frames,totalFrames-start);
 for(let i=0;i<count;i++){
  let env=cycle>0&&i<fade?i/fade:1;
  if(start+i+fade<totalFrames&&i>bed.frames-fade)env=Math.min(env,(bed.frames-i)/fade);
  const global=(start+i)/rate;
  const fadeOut=Math.min(1,Math.max(0,(duration-global)/1.8));
  for(let c=0;c<channels;c++)out[(start+i)*channels+c]+=bed.samples[i*bed.channels+Math.min(c,bed.channels-1)]*0.23*env*fadeOut;
 }
}
const events=[];
for(const frame of [180,360,540,720,900,1080]){events.push(['unfold',frame,0.50],['swish',frame+5,0.36]);}
events.push(['glimmer',28,0.40],['blop',88,0.40],['glimmer',210,0.36],['blop',385,0.32],['stamp',578,0.48],['glimmer',760,0.38],['blop',936,0.38],['glimmer',1115,0.40],['emblem',1242,0.52]);
for(const [name,frame,gain] of events){
 const clip=parsed[name], start=Math.round(frame/30*rate);
 for(let i=0;i<clip.frames&&start+i<totalFrames;i++)for(let c=0;c<channels;c++)out[(start+i)*channels+c]+=clip.samples[i*clip.channels+Math.min(c,clip.channels-1)]*gain;
}
let peak=0;for(const v of out)peak=Math.max(peak,Math.abs(v));const gain=peak>0.89?0.89/peak:1;
const header=Buffer.alloc(44);header.write('RIFF',0);header.writeUInt32LE(36+totalFrames*channels*2,4);header.write('WAVE',8);header.write('fmt ',12);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(channels,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*channels*2,28);header.writeUInt16LE(channels*2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(totalFrames*channels*2,40);
const pcm=Buffer.alloc(totalFrames*channels*2);for(let i=0;i<out.length;i++)pcm.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(out[i]*gain*32767))),i*2);
fs.writeFileSync(path.join(project,'public/sfx/mix.wav'),Buffer.concat([header,pcm]));
console.log(`Wrote temporary React Bits mix, peak ${(peak*gain).toFixed(3)} (-${(-20*Math.log10(peak*gain)).toFixed(1)} dBFS)`);
