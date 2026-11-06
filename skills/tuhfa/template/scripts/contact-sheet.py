#!/usr/bin/env python3
"""Shots sheet for review before the full render.  usage: python3 scripts/contact-sheet.py out/shots.png 2.0 7.6 11 ...
(run `node record.mjs stills 2.0,7.6,11` first; stills land in out/stills/t<sec>.png)"""
import sys
from PIL import Image, ImageDraw, ImageFont
out, ts = sys.argv[1], sys.argv[2:]
cols = 6 if len(ts) > 7 else len(ts); rows = (len(ts) + cols - 1) // cols
try: f = ImageFont.truetype('public/fonts/Beiruti.ttf', 30)
except Exception: f = ImageFont.load_default()
W = Image.new('RGB', (cols * 300 + 30, rows * 590 + 20), '#efefef'); d = ImageDraw.Draw(W)
for i, t in enumerate(ts):
    im = Image.open(f'out/stills/t{t}.png').resize((280, 498)); x = 20 + (i % cols) * 300; y = 15 + (i // cols) * 590
    W.paste(im, (x, y)); d.text((x + 140, y + 512), f'{float(t):.1f}s', font=f, fill='#333', anchor='ma')
W.save(out); print('wrote', out)
