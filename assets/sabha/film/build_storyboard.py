#!/usr/bin/env python3
"""Sabha film — storyboard stills (1080x1920). Writes scenes/*.html; render.cjs screenshots them.
Rules (khaam arabic-typography): whole words, RTL, no letter-spacing, dots never clipped, <=2 Arabic families
(Kufam display + Alexandria text), real photos from ../media, safe zone: right 140 px, bottom 240 px."""
import os, textwrap
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'scenes'); os.makedirs(OUT, exist_ok=True)

NIGHT, GOLD, SAND, RUST, INK, GREEN = '#0a0e1f', '#e8a93a', '#f1e3c4', '#c0502e', '#14110d', '#2f6b4f'
GRAIN = ("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>"
         "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='4'/>"
         "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter>"
         "<rect width='300' height='300' filter='url(%23n)'/></svg>")

BASE = """<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:Kufam;src:url('../fonts/Kufam[wght].ttf');font-weight:100 900}
@font-face{font-family:Alexandria;src:url('../fonts/Alexandria[wght].ttf');font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:%(night)s;direction:rtl;
 font-family:Alexandria,sans-serif;color:%(sand)s}
.stage{position:absolute;inset:0;overflow:hidden}
.abs{position:absolute}
.k{font-family:Kufam,sans-serif;font-weight:800;line-height:1.35;white-space:nowrap}
.a{font-family:Alexandria,sans-serif;line-height:1.6;white-space:nowrap}
.grain{position:absolute;inset:0;background:url("%(grain)s");opacity:.10;mix-blend-mode:overlay;pointer-events:none}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50%% 45%%,transparent 55%%,rgba(0,0,0,.55) 100%%);pointer-events:none}
.gold{color:%(gold)s}
</style></head><body><div class="stage">%(body)s<div class="vig"></div><div class="grain"></div></div></body></html>"""

def page(name, body):
    html = BASE % dict(night=NIGHT, sand=SAND, gold=GOLD, grain=GRAIN, body=body)
    open(os.path.join(OUT, name + '.html'), 'w', encoding='utf-8').write(html)

def img(src, style):
    return f'<img class="abs" src="{src}" style="{style}">'

# ---- 01 hook, frame 0 : the real drone-show still, no text yet ---------------------------------------------
page('s01_hook_f0', img('../../media/01_drone_show_libya_map_sabha_airport_event.jpg',
     'left:0;top:0;width:1080px;height:1920px;object-fit:cover;filter:brightness(.8) contrast(1.05)') +
     f'<div class="abs" style="left:0;right:0;bottom:0;height:700px;background:linear-gradient(transparent,{NIGHT} 92%)"></div>')

# ---- 02 hook, ~1.5 s : push-in + title (whole words, right-aligned) ----------------------------------------
page('s02_hook_1p5s', img('../../media/01_drone_show_libya_map_sabha_airport_event.jpg',
     'left:-40px;top:-60px;width:1160px;height:2040px;object-fit:cover;filter:brightness(.72) contrast(1.08)') +
     f'<div class="abs" style="left:0;right:0;bottom:0;height:1150px;background:linear-gradient(transparent,{NIGHT} 78%)"></div>' +
     f'<div class="abs k" style="right:110px;top:1040px;font-size:200px;color:{SAND}">بوابة</div>'
     f'<div class="abs k" style="right:110px;top:1260px;font-size:200px;color:{SAND}">الصحراء</div>'
     f'<div class="abs k gold" style="right:110px;top:1480px;font-size:200px">الكبرى</div>'
     f'<div class="abs" style="right:110px;top:1000px;width:150px;height:6px;background:{GOLD}"></div>'
     f'<div class="abs a" style="right:112px;top:1730px;font-size:44px;font-weight:300;opacity:.85">سبها · ليبيا</div>')

# ---- 03 where : stylised Libya outline (schematic), pin on Sabha, counter ----------------------------------
PTS = [(11.55,33.15),(12.1,32.85),(13.18,32.92),(14.2,32.7),(15.1,32.4),(15.9,32.0),(16.6,31.2),(17.7,30.5),(18.6,30.3),
       (19.2,30.3),(20.1,32.1),(21.0,32.8),(22.0,32.9),(22.64,32.77),(23.2,32.2),(24.0,32.0),(25.1,31.65),(25.0,29.2),
       (25.0,22.0),(25.0,20.0),(24.0,20.0),(24.0,19.5),(22.0,20.8),(19.5,21.8),(17.0,22.5),(15.0,23.4),(13.5,23.2),
       (11.97,23.52),(10.2,24.6),(9.5,26.0),(9.75,27.5),(9.5,29.0),(9.9,30.3),(10.3,30.9),(10.1,31.5),(10.0,32.2),(11.0,33.0)]
S, X0, Y0 = 50, 120, 330
def xy(lon, lat): return (X0 + (lon - 9) * S, Y0 + (33.5 - lat) * S)
poly = ' '.join('%.1f,%.1f' % xy(*p) for p in PTS)
sx, sy = xy(14.43, 27.04); tx, ty = xy(13.18, 32.89)
dots = ''.join(f'<circle cx="{x}" cy="{y}" r="2" fill="#ffffff" opacity=".07"/>' for x in range(30, 1080, 54) for y in range(30, 1920, 54))
mapsvg = f"""<svg class="abs" style="left:0;top:0" width="1080" height="1920" viewBox="0 0 1080 1920">{dots}
<polygon points="{poly}" fill="{GOLD}" fill-opacity=".10" stroke="{GOLD}" stroke-width="5" stroke-linejoin="round"/>
<line x1="{tx}" y1="{ty}" x2="{sx}" y2="{sy}" stroke="{SAND}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round"/>
<circle cx="{tx}" cy="{ty}" r="12" fill="{SAND}"/>
<circle cx="{sx}" cy="{sy}" r="58" fill="none" stroke="{GOLD}" stroke-width="4" opacity=".55"/>
<circle cx="{sx}" cy="{sy}" r="34" fill="none" stroke="{GOLD}" stroke-width="4" opacity=".8"/>
<circle cx="{sx}" cy="{sy}" r="16" fill="{GOLD}"/></svg>"""
page('s03_where', mapsvg +
     f'<div class="abs a" style="left:{tx+30:.0f}px;top:{ty-34:.0f}px;font-size:40px">طرابلس</div>'
     f'<div class="abs k gold" style="left:{sx+78:.0f}px;top:{sy-46:.0f}px;font-size:76px">سبها</div>'
     f'<div class="abs a" style="right:110px;top:170px;font-size:44px;font-weight:300;opacity:.8">خريطة تخطيطية</div>'
     f'<div class="abs k gold" style="right:110px;top:1240px;font-size:260px;line-height:1.2">+600</div>'
     f'<div class="abs k" style="right:110px;top:1530px;font-size:92px">كم عن طرابلس</div>'
     f'<div class="abs a" style="right:112px;top:1690px;font-size:38px;font-weight:300;opacity:.75">مصدر المسافة: ويكيبيديا، الجزيرة نت</div>')

# ---- 04 ruin : real "before" photo as a small print (it is only 380x450) ----------------------------------
page('s04_ruin', f'<div class="abs" style="inset:0;background:linear-gradient(160deg,#2a2018,#0f0b08)"></div>' +
     f'<div class="abs" style="left:215px;top:250px;width:650px;padding:26px 26px 110px;background:#efe7d6;transform:rotate(-2.2deg);'
     f'box-shadow:0 40px 90px rgba(0,0,0,.65)"><img src="../../before_after/castle_sabha_before.jpg" '
     f'style="display:block;width:598px;height:708px;object-fit:cover;filter:grayscale(.55) sepia(.35) contrast(1.05)"></div>' +
     f'<div class="abs k" style="right:110px;top:1150px;font-size:170px;color:{SAND}">قلعة سبها</div>'
     f'<div class="abs a" style="right:114px;top:1400px;font-size:68px;font-weight:500;color:{GOLD}">القذائف أصابت أسوارها</div>'
     f'<div class="abs a" style="right:114px;top:1540px;font-size:38px;font-weight:300;opacity:.7">المصدر: هيئة الآثار الليبية · Libya Observer</div>')

# ---- 05 division : four separate arches, wide gaps, cold grade ---------------------------------------------
def arch(x, y, w, h, src, label, extra=''):
    return (f'<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{w//2}px {w//2}px 22px 22px;overflow:hidden;'
            f'background:{SAND};border:5px solid rgba(241,227,196,.55);filter:saturate(.55) brightness(.85)">'
            f'<img src="{src}" style="width:100%;height:100%;object-fit:cover;{extra}"></div>'
            f'<div class="abs k" style="left:{x}px;width:{w}px;text-align:center;top:{y+h+18}px;font-size:56px">{label}</div>')
page('s05_division', f'<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 30%,#1a2238,{NIGHT} 70%)"></div>' +
     f'<div class="abs k" style="right:110px;top:190px;font-size:120px">كل واحد</div>'
     f'<div class="abs k gold" style="right:110px;top:345px;font-size:120px">في ركنه</div>' +
     arch(70, 560, 410, 560, '../../media/09_char_tuareg_camel_illustration.jpg', 'الطوارق') +
     arch(600, 560, 410, 560, '../../media/10_char_seated_man_red_rugs_illustration.jpg', 'التبو') +
     arch(70, 1250, 410, 400, '../../media/11_char_man_curly_hair_cutout.jpg', 'العرب', 'object-position:50% 40%;mix-blend-mode:multiply') +
     arch(600, 1250, 410, 400, '../../media/12_char_man_dark_turban_cutout.jpg', 'العرب', 'object-position:50% 20%;mix-blend-mode:multiply'))

# ---- 06 rise : night castle (after) full-bleed + "before" print inset --------------------------------------
page('s06_rise', img('../../media/03_castle_night_still.jpg',
     'left:-300px;top:200px;width:1680px;height:1260px;object-fit:cover;filter:brightness(.95) contrast(1.05)') +
     f'<div class="abs" style="left:0;right:0;top:0;height:900px;background:linear-gradient({NIGHT} 20%,transparent)"></div>'
     f'<div class="abs" style="left:0;right:0;bottom:0;height:900px;background:linear-gradient(transparent,{NIGHT} 80%)"></div>' +
     f'<div class="abs" style="left:70px;top:150px;width:390px;padding:14px 14px 56px;background:#efe7d6;transform:rotate(-3deg);box-shadow:0 30px 70px rgba(0,0,0,.7)">'
     f'<img src="../../before_after/castle_sabha_before.jpg" style="display:block;width:362px;height:430px;object-fit:cover;filter:grayscale(.6) sepia(.3)"></div>'
     f'<div class="abs k" style="left:100px;top:660px;font-size:60px;color:{GOLD}">قبل</div>'
     f'<div class="abs k" style="right:110px;top:190px;font-size:96px;color:{GOLD}">بعد</div>'
     f'<div class="abs k" style="right:110px;top:1280px;font-size:150px">ثم عادت</div>'
     f'<div class="abs a" style="right:114px;top:1490px;font-size:62px;font-weight:500">ترميم القلعة في 2023</div>'
     f'<div class="abs a" style="right:114px;top:1610px;font-size:38px;font-weight:300;opacity:.7">المصدر: Libya Update · رواية الجهة المنفذة</div>')

# ---- 07 build : the real vertical bridge footage (frame at 14 s) ------------------------------------------
page('s07_bridge', img('../img/bridge_14s.png', 'left:0;top:0;width:1080px;height:1920px;object-fit:cover') +
     f'<div class="abs" style="left:0;right:0;bottom:0;height:1000px;background:linear-gradient(transparent,{NIGHT} 85%)"></div>'
     f'<div class="abs" style="left:0;right:0;top:0;height:420px;background:linear-gradient({NIGHT},transparent)"></div>' +
     f'<div class="abs a" style="right:110px;top:180px;font-size:46px;font-weight:500;color:{GOLD}">جهاز التنمية الوطنية · سبها</div>'
     f'<div class="abs k gold" style="right:110px;top:1060px;font-size:330px;line-height:1.1">71%</div>'
     f'<div class="abs" style="right:110px;top:1420px;width:860px;height:18px;border-radius:9px;background:rgba(241,227,196,.22)">'
     f'<div style="position:absolute;right:0;top:0;height:18px;width:71%;border-radius:9px;background:{GOLD}"></div></div>'
     f'<div class="abs k" style="right:110px;top:1470px;font-size:110px">جسر بطل العبور</div>'
     f'<div class="abs a" style="right:114px;top:1630px;font-size:46px;font-weight:300">نسبة الإنجاز حتى ديسمبر 2025</div>'
     f'<div class="abs a" style="right:114px;top:1700px;font-size:34px;font-weight:300;opacity:.65">المصدر: Libya Update (مصدر واحد)</div>')

# ---- 08 hub : airport timeline + Fezzan palace -------------------------------------------------------------
def node(x, date, text, strong=False):
    c = GOLD if strong else SAND
    return (f'<div class="abs" style="left:{x-17}px;top:880px;width:34px;height:34px;border-radius:50%;background:{c}"></div>'
            f'<div class="abs k" style="left:{x-170}px;width:340px;text-align:center;top:935px;font-size:38px;color:{c}">{date}</div>'
            f'<div class="abs a" style="left:{x-170}px;width:340px;text-align:center;top:1000px;font-size:36px;font-weight:300">{text}</div>')
page('s08_hub', img('../img/airport_crop.jpg', 'left:0;top:0;width:1080px;height:760px;object-fit:cover;object-position:50% 40%;filter:brightness(.9)') +
     f'<div class="abs" style="left:0;right:0;top:560px;height:260px;background:linear-gradient(transparent,{NIGHT})"></div>' +
     f'<div class="abs k" style="right:110px;top:640px;font-size:96px">مطار سبها الدولي</div>' +
     f'<div class="abs" style="left:150px;right:150px;top:895px;height:4px;background:rgba(241,227,196,.4)"></div>' +
     node(890, 'يناير 2014', 'إغلاق المطار') + node(540, '16 أغسطس 2019', 'عودة الرحلات') + node(190, '16 مايو 2026', 'افتتاح رسمي', True) +
     img('../img/fezzan_after_crop.jpg', 'left:0;top:1200px;width:1080px;height:690px;object-fit:cover;filter:brightness(.95)') +
     f'<div class="abs" style="left:0;right:0;top:1160px;height:140px;background:linear-gradient({NIGHT},transparent)"></div>' +
     f'<div class="abs k gold" style="right:110px;top:1200px;font-size:64px">قصر فزان للمؤتمرات</div>' +
     f'<div class="abs a" style="right:114px;top:1085px;font-size:32px;font-weight:300;opacity:.7">المصدر: Reuters عبر Euronews · المرصد</div>'
     f'<div class="abs a" style="right:114px;top:1125px;font-size:30px;font-weight:300;opacity:.6">تاريخ عودة الرحلات تختلف فيه المصادر</div>')

# ---- 09 unity + end : four arches side by side, same light -----------------------------------------------
def arch2(x, src, extra=''):
    return (f'<div class="abs" style="left:{x}px;top:700px;width:228px;height:560px;border-radius:114px 114px 18px 18px;overflow:hidden;'
            f'background:{SAND};border:4px solid {GOLD}"><img src="{src}" style="width:100%;height:100%;object-fit:cover;{extra}"></div>')
page('s09_unity', f'<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 38%,#3a2c12,{NIGHT} 72%)"></div>' +
     f'<div class="abs k" style="right:110px;top:190px;font-size:128px">رغم القيود</div>'
     f'<div class="abs k gold" style="right:110px;top:350px;font-size:128px">سبها واقفة</div>' +
     arch2(40, '../../media/12_char_man_dark_turban_cutout.jpg', 'object-position:50% 20%;mix-blend-mode:multiply') +
     arch2(300, '../../media/11_char_man_curly_hair_cutout.jpg', 'object-position:50% 35%;mix-blend-mode:multiply') +
     arch2(560, '../../media/10_char_seated_man_red_rugs_illustration.jpg') +
     arch2(820, '../../media/09_char_tuareg_camel_illustration.jpg') +
     f'<div class="abs k" style="left:60px;right:60px;text-align:center;top:1340px;font-size:84px;color:{GOLD}">مدينة واحدة</div>'
     f'<div class="abs a" style="left:60px;right:60px;text-align:center;top:1560px;font-size:48px;font-weight:500">@اسم_القناة</div>'
     f'<div class="abs a" style="left:60px;right:60px;text-align:center;top:1640px;font-size:34px;font-weight:300;opacity:.7">فيديو غير رسمي · المصادر في الوصف</div>')
print('ok', sorted(os.listdir(OUT)))
