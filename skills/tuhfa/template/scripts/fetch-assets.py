#!/usr/bin/env python3
"""Build src/assets.json (icons + logos) from a local clone of Hadani0mar/m0usasvg.
usage: python3 scripts/fetch-assets.py /path/to/m0usasvg  icon1,icon2,...  slug1,key=slug2,...
  logos are stored as  ai_<slug>  (light/color/default variant, best for a white ground)
  plus 'tt' (tiktok default). Clone with:
  git clone --depth 1 --filter=blob:none --sparse https://github.com/Hadani0mar/m0usasvg
  cd m0usasvg && git sparse-checkout set src/data public/icons/tiktok public/icons/<slug> ...
"""
import json, os, sys
root, icons, slugs = sys.argv[1], sys.argv[2].split(','), (sys.argv[3].split(',') if len(sys.argv) > 3 and sys.argv[3] else [])
out = {'icons': {}, 'logos': {}}
for look in ['outline', 'duotone', 'fill']:
    d = json.load(open(f'{root}/src/data/ui/looks/{look}.json'))
    out['icons'][look] = {k: d[k] for k in icons if k in d}
miss = [k for k in icons if k not in out['icons']['outline']]
if miss: print('missing icons (pick other names):', miss)
P = f'{root}/public/icons/'
def pick(slug):
    for v in ['light', 'color', 'default']:
        if os.path.exists(P + slug + '/' + v + '.svg'): return open(P + slug + '/' + v + '.svg').read()
for s in slugs:  # 'slug' -> key ai_<slug>; 'key=slug' -> key <key>
    key, slug = (s.split('=', 1) if '=' in s else ('ai_' + s, s))
    svg = pick(slug)
    if svg: out['logos'][key] = svg
    else: print('no logo for', slug)
if os.path.exists(P + 'tiktok/default.svg'): out['logos']['tt'] = open(P + 'tiktok/default.svg').read()
os.makedirs('src', exist_ok=True)
json.dump(out, open('src/assets.json', 'w'))
print('wrote src/assets.json:', len(out['icons']['outline']), 'icons,', len(out['logos']), 'logos')
