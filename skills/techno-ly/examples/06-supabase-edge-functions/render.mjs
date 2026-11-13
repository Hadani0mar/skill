import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
fs.mkdirSync('out',{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.tsx',publicDir:'public',outDir:process.cwd()+'/build'});
const localBrowser=process.cwd()+'/browser/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE || (fs.existsSync(localBrowser)?localBrowser:null);
const browser=await openBrowser('chrome',{browserExecutable,chromiumOptions:{disableWebSecurity:false}});
const comp=await selectComposition({serveUrl,id:'EdgeFunctions',puppeteerInstance:browser});
console.log('Composition',comp.width,comp.height,comp.fps,comp.durationInFrames);
if(process.argv[2]==='render'){
 let last=-1;
 await renderMedia({composition:comp,serveUrl,codec:'h264',outputLocation:'out/edge-functions.tmp.mp4',crf:21,audioBitrate:'192k',pixelFormat:'yuv420p',concurrency:4,puppeteerInstance:browser,browserExecutable,timeoutInMilliseconds:60000,onProgress:({progress})=>{const pct=Math.floor(progress*20)*5;if(pct!==last){last=pct;console.log('RENDER',pct+'%')}}});
 fs.renameSync('out/edge-functions.tmp.mp4','out/taqni-edge-functions-1080x1920-60fps.mp4');
}else{
 fs.mkdirSync('out/stills',{recursive:true});
 const times=process.argv.slice(3).map(Number);const ts=times.length?times:[0,1.7,5.8,9,12.5,15.5,17.9,20.5,23.8,26.5,29.8,31.7,34.2,36.8,39,42.7,46.7,51.9];
 for(const sec of ts){await renderStill({composition:comp,serveUrl,frame:Math.round(sec*60),output:'out/stills/'+sec.toFixed(2)+'.png',scale:.5,puppeteerInstance:browser});console.log('STILL',sec)}
}
await browser.close({silent:true});
