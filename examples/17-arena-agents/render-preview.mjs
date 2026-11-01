import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Resvg} from '@resvg/resvg-js';

const here = path.dirname(fileURLToPath(import.meta.url));
const icons = JSON.parse(fs.readFileSync(path.join(here, 'assets/icons-duotone.json'), 'utf8'));
let illustration = fs.readFileSync(path.join(here, 'assets/connecting-teams.svg'), 'utf8')
  .replace(/^\s*<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');

function icon(name, x, y, size, color, prefix) {
  let markup = icons[name]
    .replace(/id="([^"]+)"/g, (_m, id) => `id="${prefix}_${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_m, id) => `url(#${prefix}_${id})`)
    .replace(/href="#([^"]+)"/g, (_m, id) => `href="#${prefix}_${id}"`)
    .replace(/width="24" height="24"/, `width="${size}" height="${size}"`)
    .replace(/currentColor/g, color);
  return `<g transform="translate(${x} ${y})">${markup}</g>`;
}

const purple = '#6759D8';
const ink = '#211F2B';
const muted = '#777383';
const card = (x, y, label, slug, number) => `
  <g>
    <rect x="${x}" y="${y}" width="290" height="222" rx="30" fill="#FFFFFF" stroke="#E6E1F0" stroke-width="2"/>
    <circle cx="${x + 145}" cy="${y + 60}" r="43" fill="#F0EDFC"/>
    ${icon(slug, x + 121, y + 36, 48, purple, `step_${number}`)}
    <circle cx="${x + 250}" cy="${y + 27}" r="18" fill="${purple}"/>
    <text x="${x + 250}" y="${y + 35}" text-anchor="middle" font-family="Readex Pro" font-size="22" font-weight="700" fill="#FFFFFF">${number}</text>
    <text x="${x + 145}" y="${y + 142}" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="37" font-weight="700" fill="${ink}">${label}</text>
  </g>`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#544B71" flood-opacity="0.10"/>
    </filter>
    <linearGradient id="heroWash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F2EFFB"/><stop offset="1" stop-color="#FBFAF8"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="#FAF9F6"/>
  <circle cx="880" cy="510" r="440" fill="#F4F1FC" opacity="0.58"/>
  <circle cx="120" cy="1520" r="280" fill="#F6F0EC" opacity="0.55"/>

  <!-- Text-only Arena name: no official Arena.ai logo was available in the checked registry. -->
  <g>
    <rect x="78" y="74" width="172" height="62" rx="31" fill="#FFFFFF" stroke="#E7E2EF" stroke-width="2"/>
    <text x="164" y="115" text-anchor="middle" font-family="Readex Pro" font-size="25" font-weight="700" letter-spacing="3" fill="${ink}">ARENA</text>
  </g>
  <g>
    <rect x="690" y="78" width="312" height="54" rx="27" fill="#F0EDFC"/>
    ${icon('sparkles', 712, 90, 30, purple, 'eyebrow')}
    <text x="958" y="115" text-anchor="end" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="25" font-weight="600" fill="${purple}">تصوّر أولي · حكاية مصوّرة</text>
  </g>

  <text x="540" y="260" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="69" font-weight="700" fill="${ink}">أنا مساعدك على الحلبة</text>
  <text x="540" y="350" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="54" font-weight="500" fill="${purple}">الفكرة منك… ونرتّبوها سوا.</text>
  <text x="540" y="416" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="31" font-weight="400" fill="${muted}">مشهد افتتاحي لفيديو عنّي وعن الوكلاء في Arena</text>

  <!-- A storybook-like illustration card; the people illustration is unDraw, unmodified. -->
  <g filter="url(#shadow)">
    <rect x="78" y="492" width="924" height="780" rx="48" fill="url(#heroWash)" stroke="#E8E3F0" stroke-width="2"/>
  </g>
  <g transform="translate(136 550) scale(1.00)">${illustration}</g>

  <!-- Small editorial labels over the illustration, not a product UI. -->
  <g>
    <rect x="122" y="546" width="226" height="76" rx="24" fill="#FFFFFF" stroke="#E8E3F0" stroke-width="2"/>
    ${icon('chat-thread', 143, 565, 38, purple, 'bubble_idea')}
    <text x="322" y="594" text-anchor="end" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="28" font-weight="700" fill="${ink}">فكرتك</text>
  </g>
  <g>
    <rect x="732" y="1130" width="244" height="82" rx="26" fill="#FFFFFF" stroke="#E8E3F0" stroke-width="2"/>
    ${icon('agent-handshake', 751, 1150, 42, purple, 'bubble_together')}
    <text x="947" y="1182" text-anchor="end" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="28" font-weight="700" fill="${ink}">نتعاون</text>
  </g>

  <text x="540" y="1364" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="37" font-weight="600" fill="${ink}">من الفكرة… لخطوة أوضح</text>
  ${card(706, 1420, 'فكرة', 'chat-thread', '١')}
  ${card(395, 1420, 'زوايا', 'multi-agent', '٢')}
  ${card(84, 1420, 'خطوة', 'agent-handshake', '٣')}
  <path d="M704 1530 H688" stroke="#B7AEDF" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 10"/>
  <path d="M393 1530 H377" stroke="#B7AEDF" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 10"/>
  <path d="M688 1530 l10 -8 v16 z" fill="#B7AEDF"/>
  <path d="M377 1530 l10 -8 v16 z" fill="#B7AEDF"/>

  <text x="540" y="1744" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="31" font-weight="500" fill="${muted}">نطلّوا على فكرتك من أكثر من زاوية… ونرتّبوها مع بعض.</text>
  <text x="540" y="1836" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="Readex Pro" font-size="22" font-weight="400" fill="#9894A1">لقطة تصوّرية · ليست واجهة رسمية ولا الفيديو النهائي</text>
  <g transform="translate(480 1882)">
    <circle cx="0" cy="0" r="7" fill="${purple}"/><circle cx="28" cy="0" r="7" fill="#D8D2EC"/><circle cx="56" cy="0" r="7" fill="#D8D2EC"/><circle cx="84" cy="0" r="7" fill="#D8D2EC"/>
  </g>
</svg>`;

const cleanSvg = svg.replace(/^[ \\t]+$/gm, '');
const fonts = [path.join(here, 'assets/fonts/ReadexPro-variable.ttf')];
const rendered = new Resvg(cleanSvg, {
  fitTo: {mode: 'width', value: 1080},
  font: {fontFiles: fonts, loadSystemFonts: true, defaultFontFamily: 'Readex Pro'},
}).render();
fs.writeFileSync(path.join(here, 'preview.svg'), cleanSvg);
fs.writeFileSync(path.join(here, 'preview.png'), rendered.asPng());
console.log('Wrote preview.svg and preview.png');
