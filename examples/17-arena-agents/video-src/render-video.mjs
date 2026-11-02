import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia} from '@remotion/renderer';
import * as chromiumModule from '@sparticuz/chromium';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, '..');
const sourceRoot = path.join(here, 'src');
const publicDir = path.join(project, 'public');
const outputLocation = path.join(project, 'arena-agents.mp4');
const renderLocation = path.join(project, 'arena-agents-render.mp4');
const renderScale = 0.6;
const ffmpeg = path.join(project, 'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg');
const chromium = chromiumModule.default ?? chromiumModule;
await chromiumModule.inflate(path.join(project, 'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));
chromiumModule.setupLambdaEnvironment('/tmp/al2023/lib');
const browserExecutable = await chromium.executablePath();
const chromiumOptions = {gl: 'swangle', headless: true, enableMultiProcessOnLinux: true};

console.log('Bundling Remotion composition…');
const serveUrl = await bundle({
  entryPoint: path.join(sourceRoot, 'index.ts'),
  publicDir,
  onProgress: (progress) => {
    if (progress === 1 || progress % 0.25 < 0.01) console.log(`bundle ${(progress*100).toFixed(0)}%`);
  },
});
console.log('Reading composition…');
const compositions = await getCompositions(serveUrl, {
  browserExecutable,
  chromiumOptions,
  chromeMode: 'chrome-for-testing',
  logLevel: 'info',
});
const composition = compositions.find((item) => item.id === 'ArenaAgents');
if (!composition) throw new Error(`ArenaAgents composition missing; found ${compositions.map((c) => c.id).join(', ')}`);
console.log(`Rendering ${composition.durationInFrames} frames at ${composition.width*renderScale}x${composition.height*renderScale}…`);
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: renderLocation,
  browserExecutable,
  chromiumOptions,
  chromeMode: 'chrome-for-testing',
  pixelFormat: 'yuv420p',
  crf: 22,
  x264Preset: 'veryfast',
  scale: renderScale,
  concurrency: 2,
  audioCodec: 'aac',
  audioBitrate: '128k',
  timeoutInMilliseconds: 120000,
  overwrite: true,
  logLevel: 'info',
  onProgress: ({progress, renderedFrames, stitchStage}) => {
    const pct = Math.floor(progress*100);
    if (renderedFrames % 60 === 0 || pct === 100) console.log(`${pct}% (${renderedFrames} rendered; ${stitchStage})`);
  },
  onBrowserLog: (log) => { if (log.type === 'error') console.error('BROWSER', log.text); },
});
console.log('Upscaling the vertical master to 1080x1920…');
execFileSync(ffmpeg, [
  '-y', '-i', renderLocation,
  '-vf', 'scale=1080:1920:flags=lanczos',
  '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
  '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart',
  outputLocation,
], {stdio: 'inherit'});
fs.unlinkSync(renderLocation);
console.log(`Rendered ${outputLocation}`);
