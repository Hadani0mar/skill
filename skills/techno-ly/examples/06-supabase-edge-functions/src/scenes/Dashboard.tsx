import React from 'react';
import {Window} from '../../kit/window';
import {useTime,Logo,Icon,Words,UiButton,Pointer,C,lin,ease,travel} from '../ui';
export const CODE=[
 'const ORIGINAL_PRICE = 100;',
 'const COUPON = "TAQNI20";',
 'const DISCOUNT_RATE = 0.20;',
 '',
 'Deno.serve(async (req) => {',
 '  const { code } = await req.json();',
 '  const valid = code === COUPON;',
 '  const discount = valid',
 '    ? ORIGINAL_PRICE * DISCOUNT_RATE : 0;',
 '',
 '  return Response.json({',
 '    valid,',
 '    originalPrice: ORIGINAL_PRICE,',
 '    discount,',
 '    finalPrice: ORIGINAL_PRICE - discount',
 '  });',
 '});',
];
function Syntax({line}:{line:string}){return <>{line.split(/("[^"]*"|\b(?:const|async|await|return)\b|\b(?:100|0\.20|0|20)\b|\b(?:Deno|Response|ORIGINAL_PRICE|DISCOUNT_RATE|COUPON)\b)/g).map((s,i)=><span key={i} style={{color:s.startsWith('"')?'#a62d22':/^(const|async|await|return)$/.test(s)?'#2456c4':/^(100|0\.20|0|20)$/.test(s)?'#197845':/^(Deno|Response)$/.test(s)?'#137d8c':undefined}}>{s}</span>)}</>}
export const Dashboard=()=>{let t=useTime(),editor=t>=4.55,menu=t>=2.35&&t<4.55;let zoom=1+1.05*ease(lin(t,6.9,7.6))-1.05*ease(lin(t,10.6,11.25));let phase=t<2.2?'افتح Edge Functions':t<4.55?'أنشئ دالة عبر المحرر':t<10.8?'اكتب منطق الخصم':'انشر الدالة';
 let cx=t<2?95:278,cy=t<2?119:t<3.65?160:230;let r=travel(lin(t,1.75,2.3));if(t<2.3){cx=95+(278-95)*r;cy=119+(160-119)*r;}if(t>=2.35&&t<4.55){let p=travel(lin(t,3.1,3.7));cx=278+60*p;cy=160+70*p;}if(editor){cx= t<6.9?310:t<10.6?390:465;cy=t<6.9?499:t<10.6?210:499;}
 return <div className="scene dashboard"><div className="step-heading"><span>{t<4.55?'01':'02'}</span><div key={phase}>{phase}</div></div>
  <div className="dash-window-wrap" style={{transform:`translateY(${(1-ease(lin(t,0,.7)))*100}px)`}}><Window url="supabase.com/dashboard" urlShape="pill" nav style={{width:500,height:571}}><div className="studio" style={{transform:`scale(${zoom})`,transformOrigin:editor?'85% 15%':'50% 25%'}}>
  <div className="studio-top"><Logo name="supabase" size={17}/><span>Taqni</span><b>/</b><span>coupon-demo</span><span className="branch"><Icon name="git-branch" size={10}/> main</span></div>
  <div className="studio-layout"><div className="studio-rail">{['layout-grid','database','shield','package','zap','radio','settings'].map((n,i)=><div key={n} style={{background:i===4?'#e4f6ec':undefined,color:i===4?C.textGreen:undefined}}><Icon name={n} size={15}/></div>)}</div>
   <div className="studio-sidebar"><strong>Edge Functions</strong><div className="nav-selected"><Icon name="zap" size={12}/>Functions</div><div><Icon name="key" size={12}/>Secrets</div></div>
   <div className="studio-main">{!editor?<><div className="studio-page-title">Edge Functions</div><div className="studio-subtitle">Run code close to your users</div><UiButton primary className="deploy-new">Deploy a new function <Icon name="chevron-down" size={12}/></UiButton><div className="empty-state"><Icon name="code" size={28}/><div>Deploy your first edge function</div><small>Create and edit functions in your browser</small><UiButton>Open Editor</UiButton></div><div className="template-heading">Start with a template</div><div className="template-row"><Icon name="code" size={17}/><div>Simple Hello World<small>Return a JSON response</small></div></div><div className="template-row"><Icon name="database" size={17}/><div>Supabase Database Access<small>Query your database</small></div></div>
   {menu&&<div className="deploy-menu" style={{opacity:lin(t,2.35,2.5),transform:`translateY(${(1-ease(lin(t,2.35,2.7)))*-8}px)`}}><div className="menu-option" style={{background:t>3.5?'#f2f3f2':undefined}}><Icon name="code" size={17}/><span>Via Editor<small>Write and deploy in the browser</small></span></div><div className="menu-option"><Icon name="terminal" size={17}/><span>Via CLI<small>Write locally, deploy with the CLI</small></span></div><div className="menu-option"><Icon name="cpu" size={17}/><span>Via AI Assistant<small>Let the Assistant write and deploy</small></span></div></div>}</>:<><div className="editor-heading"><span>Edge Functions <b>›</b> <strong>Create new edge function</strong></span><UiButton><Icon name="book-open" size={11}/>Templates</UiButton></div><div className="editor-body"><div className="file-explorer"><div>FILES <Icon name="plus" size={11}/></div><span><Icon name="file" size={11}/>index.ts</span></div><div className="code-area">{CODE.map((l,i)=>{let hi=(t>7&&t<8.6&&i===0)||(t>8.6&&t<10.55&&(i===1||i===2));let a=lin(t,7,9.2);let chars=Math.floor(CODE.join('\n').length*a);let before=CODE.slice(0,i).join('\n').length+(i>0?1:0);let str=t<7?'':l.slice(0,Math.max(0,chars-before));return <div className="code-line" key={i} style={{background:hi?'#e5f6ed':undefined}}><span>{i+1}</span><code><Syntax line={str}/></code></div>})}</div></div><div className="editor-footer"><span>Function name</span><div className="function-name">{t<5.15?'': 'apply-coupon'.slice(0,Math.round(lin(t,5.15,6.65)*12))}</div><UiButton primary style={{transform:t>11.4&&t<11.65?'scale(.96)':undefined}}>{t>12.2?'Deployed':t>11.75?'Deploying…':'Deploy function'}</UiButton></div>{t>12.2&&<div className="deployment-toast"><Icon name="circle-check" size={14}/><span>Successfully deployed edge function</span></div>}</>}
   </div></div></div></Window>
  <Pointer x={cx} y={cy} t={t} press={editor?11.4:t<3?2.35:3.85}/></div>
  <div className="dashboard-bottom"><Words t={t} at={.3} text={t<4.55?'من لوحة سوبابيز مباشرة':'السعر وقاعدة الخصم داخل الخادم'} size={22} highlight={['الخادم']}/></div>
 </div>};
