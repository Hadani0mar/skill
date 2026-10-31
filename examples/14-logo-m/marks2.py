P='#cc785c'; D='#a9583e'; INK='#141413'; CR='#faf9f5'; O='#e8a55a'
def rise(a=D,b=P,bg=CR):
    return f'''<g fill="none" stroke-linecap="round" stroke-width="26">
<path d="M46 152 V106 A27 27 0 0 1 100 106 V152" stroke="{a}"/>
<path d="M100 152 V84 A27 27 0 0 1 154 84 V152" stroke="{b}"/></g>'''
def check(c=INK,k=P):
    return f'''<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
<path d="M34 150 V106 A25 25 0 0 1 84 106 V150 M84 106 A25 25 0 0 1 134 106" stroke="{c}"/>
<path d="M134 106 V150 L174 92" stroke="{k}"/></g>'''
def link(a=P,b=O,m=D):
    return f'''<g fill="none" stroke-linecap="round" stroke-width="28">
<path d="M44 152 V102 A28 28 0 0 1 100 102" stroke="{a}"/>
<path d="M100 102 A28 28 0 0 1 156 102 V152" stroke="{b}"/>
<path d="M100 152 V102" stroke="{m}"/></g>'''
V={
 'rise':{'light':rise(),'dark':rise(O,P,INK),'icon':rise(CR,'#ffe7da',P)},
 'check':{'light':check(),'dark':check(CR,P),'icon':check(CR,'#ffd9a8')},
 'link':{'light':link(),'dark':link(P,O,'#f3c3a8'),'icon':link(CR,'#ffd9a8','#5a2a1a')},
}
import json; json.dump(V,open('v2.json','w'))
def tile(inner,bg=P): return f'<svg width=120 height=120 viewBox="0 0 200 200"><rect width="200" height="200" rx="46" fill="{bg}"/><g transform="translate(20 14) scale(.8)">{inner}</g></svg>'
html="<html><head><style>@font-face{font-family:Cairo;src:url(/home/claude/video6/public/fonts/Cairo.ttf)}</style></head><body style='margin:0;display:grid;grid-template-columns:repeat(3,500px);background:#fff;font:16px sans-serif'>"
for k,v in V.items():
    html+=f"""<div><div style='background:{CR};height:260px;display:flex;align-items:center;justify-content:center'><svg width=230 height=230 viewBox='0 0 200 200'>{v['light']}</svg></div>
<div style='background:{INK};height:160px;display:flex;align-items:center;justify-content:center;gap:24px'><svg width=130 height=130 viewBox='0 0 200 200'>{v['dark']}</svg>{tile(v['icon'])}<svg width=32 height=32 viewBox='0 0 200 200'>{v['dark']}</svg></div>
<div style='background:{CR};height:120px;display:flex;align-items:center;justify-content:center;gap:12px;direction:rtl'><svg width=90 height=90 viewBox='0 0 200 200'>{v['light']}</svg><span style='font-family:Cairo;font-weight:800;font-size:52px;color:{INK}'>المتمكن</span></div><div style='text-align:center'>{k}</div></div>"""
open('sheet2.html','w').write(html+"</body></html>")
