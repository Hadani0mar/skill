import React from 'react';
import {useTime,ShopPhone,Words,Icon,C,Logo,lin,ease,travel,Rise} from '../ui';
export const RequestFlow=()=>{let t=useTime();let ret=ease(lin(t,6,6.75));let p=ease(lin(t,0,.85))*(1-ret);let arrived=t>5.9;let price=arrived?80:100;let packet=travel(lin(t,.8,1.7));let back=travel(lin(t,5.1,5.95));return <div className="scene request-flow">
 <Words t={t} at={0} text="الهاتف يرسل الكود فقط" size={28} highlight={['فقط']} style={{position:'absolute',top:86,width:'100%'}}/>
 <ShopPhone t={t} state={arrived?'success':'loading'} value="TAQNI20" price={price} style={{left:106-91*p,top:143+65*p}} scale={.86-.23*p}/>
 <div className="server-execution" style={{transform:`translateX(${(1-ease(lin(t,0,.85)))*300+ret*300}px)`,opacity:lin(t,.35,.65)*(1-ret)}}><div className="execution-brand"><Logo name="supabase" size={24}/><span>Edge Function</span></div><div className="execution-name">apply-coupon</div><div className="execution-rule"/>
  <div className="execution-step" style={{opacity:.35+.65*lin(t,2.1,2.45)}}><Icon name={t>2.5?'circle-check':'code'} size={22} color={t>2.5?C.textGreen:'#7b817e'}/><span>التحقق من الكود</span></div>
  <div className="calculation" style={{opacity:lin(t,3,3.3)}}><small>السعر الأصلي × الخصم</small><span dir="ltr">100 × 0.20</span><b dir="ltr">= 20</b></div>
  <div className="execution-response" style={{opacity:lin(t,4.6,4.9)}}><span>السعر النهائي</span><div className="final-result">80 <small>LYD</small></div><code>{'{ finalPrice: 80 }'}</code></div>
 </div>
 <svg className="flow-connectors" width="540" height="960"><path d="M215 492 C280 492 260 298 322 298" fill="none" stroke="#d8e5dd" strokeWidth="2" strokeDasharray="5 5" style={{opacity:p}}/><path d="M322 664 C265 664 280 722 215 722" fill="none" stroke="#d8e5dd" strokeWidth="2" strokeDasharray="5 5" style={{opacity:p}}/></svg>
 {t>.75&&t<2.15&&<div className="request-packet" style={{left:208+110*packet,top:465-188*packet,opacity:Math.min(lin(t,.75,.9),1-lin(t,1.85,2.15))}}><span>POST</span><code>TAQNI20</code></div>}
 {t>5&&t<6.3&&<div className="response-packet" style={{left:325-125*back,top:640+73*back,opacity:Math.min(lin(t,5,5.15),1-lin(t,6.05,6.3))}}>80 <small>LYD</small></div>}
 <div className="flow-bottom"><Words t={t} at={5.8} text="الخادم يحسب… والتطبيق يعرض" size={25} highlight={['الخادم']}/></div>
 </div>};
