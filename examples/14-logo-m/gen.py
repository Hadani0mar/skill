import json, datetime
P='#cc785c'; D='#a9583e'; INK='#141413'; CR='#faf9f5'; O='#e8a55a'; BL='#0c66e4'; BLD='#0055cc'; BLL='#1fa1ff'
def rise(a,b): return f'<g fill="none" stroke-linecap="round" stroke-width="26"><path d="M46 152 V106 A27 27 0 0 1 100 106 V152" stroke="{a}"/><path d="M100 152 V84 A27 27 0 0 1 154 84 V152" stroke="{b}"/></g>'
def check(c,k): return f'<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"><path d="M34 150 V106 A25 25 0 0 1 84 106 V150 M84 106 A25 25 0 0 1 134 106" stroke="{c}"/><path d="M134 106 V150 L174 92" stroke="{k}"/></g>'
def link(a,b,m): return f'<g fill="none" stroke-linecap="round" stroke-width="28"><path d="M44 152 V102 A28 28 0 0 1 100 102" stroke="{a}"/><path d="M100 102 A28 28 0 0 1 156 102 V152" stroke="{b}"/><path d="M100 152 V102" stroke="{m}"/></g>'
def svg(inner,size,label='شعار المتمكن'): return f'<svg width="{size}" height="{size}" viewBox="0 0 200 200" role="img" aria-label="{label}">{inner}</svg>'
def tile(inner,size,bg,r=0.23): return f'<svg width="{size}" height="{size}" viewBox="0 0 200 200" role="img" aria-label="أيقونة التطبيق"><rect width="200" height="200" rx="{200*r}" fill="{bg}"/><g transform="translate(20 14) scale(0.8)">{inner}</g></svg>'
HEAD='''<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>{t}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&amp;display=swap" rel="stylesheet">
<style>
body{{margin:0}}
</style>
</helmet>
'''
def tail(props,w,h): 
    pr=dict(props); pr['$preview']={'width':w,'height':h}
    defaults={k:v['default'] for k,v in props.items()}
    body=", ".join(f"{k}: this.props.{k} ?? '{v}'" for k,v in defaults.items())
    return f'''</x-dc>
<script type="text/x-dc" data-dc-script data-props='{json.dumps(pr, ensure_ascii=False)}'>
class Component extends DCLogic {{
renderVals() {{
return {{ {body} }};
}}
}}
</script>
</body>
</html>
'''
F="font-family: Cairo, system-ui, sans-serif"
files={}
# Main: hero of the recommended direction, colours editable
files['Main.dc.html']=HEAD.format(t='صعود — الشعار المقترح')+f'''<div style="width: 1080px; height: 1080px; box-sizing: border-box; background: {{{{ground}}}}; {F}; color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 56px">
<svg width="520" height="520" viewBox="0 0 200 200" role="img" aria-label="شعار المتمكن: حرف m بقوسين يصعد الثاني"><g fill="none" stroke-linecap="round" stroke-width="26"><path d="M46 152 V106 A27 27 0 0 1 100 106 V152" stroke="{{{{deep}}}}"/><path d="M100 152 V84 A27 27 0 0 1 154 84 V152" stroke="{{{{primary}}}}"/></g></svg>
<div style="display: flex; align-items: center; gap: 28px; direction: rtl">
<svg width="120" height="120" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke-linecap="round" stroke-width="26"><path d="M46 152 V106 A27 27 0 0 1 100 106 V152" stroke="{{{{deep}}}}"/><path d="M100 152 V84 A27 27 0 0 1 154 84 V152" stroke="{{{{primary}}}}"/></g></svg>
<span style="font-size: 104px; font-weight: 800; line-height: 1.2">المتمكن</span>
</div>
</div>
'''+tail({'primary':{'editor':'color','default':P},'deep':{'editor':'color','default':D},'ground':{'editor':'color','default':CR}},1080,1080)

def card(name,sub,light,dark,icon,iconbg):
    return f'''<div style="flex: 1; display: flex; flex-direction: column; border: 1px solid #e6dfd8; border-radius: 16px; overflow: hidden; background: #ffffff">
<div style="height: 340px; background: {CR}; display: flex; align-items: center; justify-content: center">{svg(light,260,'اتجاه '+name)}</div>
<div style="height: 150px; background: {INK}; display: flex; align-items: center; justify-content: center; gap: 28px">{svg(dark,110,'نسخة داكنة')}{tile(icon,96,iconbg)}{svg(dark,32,'حجم صغير')}</div>
<div style="padding: 22px 26px; display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 30px; font-weight: 800">{name}</span>
<span style="font-size: 18px; color: #6c6a64; line-height: 1.6">{sub}</span>
</div>
</div>
'''
files['Directions.dc.html']=HEAD.format(t='ثلاث اتجاهات')+f'''<div style="width: 1440px; height: 760px; box-sizing: border-box; padding: 48px; background: #f5f0e8; {F}; color: {INK}; display: flex; gap: 32px; direction: rtl">
{card('صعود','قوسان، الثاني أعلى من الأول: نمو النشاط خطوة بخطوة.',rise(D,P),rise(O,P),rise(CR,'#ffe7da'),P)}
{card('إنجاز','الساق الأخيرة تنتهي بعلامة صح: المهمة تمت.',check(INK,P),check(CR,P),check(CR,'#ffd9a8'),P)}
{card('تكامل','قوسان يتشاركان ساقاً واحدة: نظامان وفريق في تطبيق واحد.',link(P,O,D),link(P,O,'#f3c3a8'),link(CR,'#ffd9a8','#5a2a1a'),P)}
</div>
'''+tail({},1440,760)

def iconrow(label,inner,bg):
    sizes=[180,120,76,48,29]
    return f'''<div style="display: flex; align-items: center; gap: 40px; direction: rtl">
<span style="width: 140px; font-size: 26px; font-weight: 700">{label}</span>
{''.join(tile(inner,s,bg) for s in sizes)}
</div>
'''
files['AppIcon.dc.html']=HEAD.format(t='أيقونة التطبيق')+f'''<div style="width: 1200px; height: 760px; box-sizing: border-box; padding: 56px; background: {CR}; {F}; color: {INK}; display: flex; flex-direction: column; justify-content: center; gap: 40px">
{iconrow('صعود',rise(CR,'#ffe7da'),P)}
{iconrow('إنجاز',check(CR,'#ffd9a8'),P)}
{iconrow('تكامل',link(CR,'#ffd9a8','#5a2a1a'),P)}
{iconrow('صعود · داكن',rise(O,P),INK)}
</div>
'''+tail({},1200,760)

def sw(bg,inner,label,fg):
    return f'''<div style="flex: 1; background: {bg}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px">{svg(inner,220,'شعار على '+label)}<span style="font-size: 20px; font-weight: 600; color: {fg}">{label}</span></div>
'''
files['Colorways.dc.html']=HEAD.format(t='الألوان')+f'''<div style="width: 1440px; height: 420px; box-sizing: border-box; {F}; display: flex; direction: rtl">
{sw(CR,rise(D,P),'كريمي · ألوان التطبيق','#6c6a64')}
{sw(INK,rise(O,P),'داكن','#cfcac0')}
{sw(P,rise('#5a2a1a',CR),'تيراكوتا','#ffffff')}
{sw('#ffffff',rise(BLD,BLL),'أزرق · نظام التصميم القديم','#44546f')}
{sw(CR,rise(INK,INK),'لون واحد','#6c6a64')}
</div>
'''+tail({},1440,420)

for k,v in files.items(): open(f'canvas/project/{k}','w').write(v)
now=datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
canvas={"v":3,"createdOnFiles":{"v":1,"at":now},"title":"شعار المتمكن — حرف m","launch":{"view":"canvas"},"pages":[],
 "boards":{"Main.dc.html":{"x":0,"y":0,"w":1080,"h":1080,"title":"صعود — المقترح"},
  "Directions.dc.html":{"x":1160,"y":0,"w":1440,"h":760,"title":"ثلاث اتجاهات"},
  "AppIcon.dc.html":{"x":0,"y":1200,"w":1200,"h":760,"title":"أيقونة التطبيق"},
  "Colorways.dc.html":{"x":1280,"y":1200,"w":1440,"h":420,"title":"الألوان"}},
 "order":["Main.dc.html","Directions.dc.html","AppIcon.dc.html","Colorways.dc.html"],"notes":{},"designSystems":[]}
json.dump(canvas,open('canvas/project/canvas.json','w'),ensure_ascii=False,indent=1)
print('ok')
