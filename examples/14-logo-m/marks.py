P='#cc785c'; D='#a9583e'; INK='#141413'; CR='#faf9f5'; O='#e8a55a'
M={}
# A — صعود: two arches, the second steps up (growth); two tones
M['rise']=f'''<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
<path d="M48 150 V104 A26 26 0 0 1 100 104 V150" stroke="{D}"/>
<path d="M100 150 V82 A26 26 0 0 1 152 82 V150" stroke="{P}"/></g>'''
# B — أعمدة: filled m whose stems rise like a bar chart
def bars():
    w=28; xs=[36,86,136]; tops=[112,92,72]
    s=''
    for x,t,c in zip(xs,tops,[D,P,P]): s+=f'<rect x="{x}" y="{t}" width="{w}" height="{160-t}" rx="6" fill="{c}"/>'
    s+=f'<path d="M50 112 V100 A25 25 0 0 1 100 92" fill="none" stroke="{D}" stroke-width="28"/>'
    s+=f'<path d="M100 92 V80 A25 25 0 0 1 150 72" fill="none" stroke="{P}" stroke-width="28"/>'
    return s
M['bars']=bars()
# C — شريط: one continuous m, inner fold shaded (ribbon)
M['ribbon']=f'''<g fill="none" stroke-linecap="butt" stroke-width="26">
<path d="M47 158 V96 A27 27 0 0 1 101 96 V158" stroke="{P}"/>
<path d="M101 96 A27 27 0 0 1 155 96 V158" stroke="{P}"/>
<path d="M101 96 V130" stroke="{D}"/></g>
<path d="M88 96 A13 13 0 0 1 101 83" fill="none" stroke="{D}" stroke-width="0"/>'''
# D — إنجاز: m whose last stem finishes as a check mark
M['check']=f'''<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="22">
<path d="M40 150 V104 A24 24 0 0 1 88 104 V150 M88 104 A24 24 0 0 1 136 104 V140" stroke="{INK}"/>
<path d="M136 140 L150 154 L176 112" stroke="{P}"/></g>'''
# E — بلاطة: m cut as negative space from a rounded tile (app-icon native)
M['tile']=f'''<rect x="28" y="28" width="144" height="144" rx="40" fill="{P}"/>
<path d="M62 140 V100 A19 19 0 0 1 100 100 V140 M100 100 A19 19 0 0 1 138 100 V140" fill="none" stroke="{CR}" stroke-width="20" stroke-linecap="round"/>
<circle cx="138" cy="66" r="11" fill="{O}"/>'''
import json; json.dump(M,open('marks.json','w'))
html="<html><body style='margin:0;display:grid;grid-template-columns:repeat(5,300px);background:#fff;font:16px sans-serif'>"
for k,v in M.items():
    for bg in ['#faf9f5','#141413']:
        pass
    html+=f"<div style='text-align:center'><div style='background:#faf9f5;height:280px;display:flex;align-items:center;justify-content:center'><svg width=240 height=240 viewBox='0 0 200 200'>{v}</svg></div><div style='background:#141413;height:120px;display:flex;align-items:center;justify-content:center;gap:16px'><svg width=96 height=96 viewBox='0 0 200 200'>{v}</svg><svg width=40 height=40 viewBox='0 0 200 200'>{v}</svg><svg width=20 height=20 viewBox='0 0 200 200'>{v}</svg></div>{k}</div>"
open('sheet.html','w').write(html+"</body></html>")
