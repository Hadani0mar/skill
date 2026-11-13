import React from 'react';
import {useTime,Rise,Words,Logo,Icon,C,lin,enter} from '../ui';
export const Definition=()=>{let t=useTime();return <div className="scene definition">
 <Rise t={t} at={0} style={{position:'absolute',top:142,left:0,width:'100%'}}><div className="tool-name"><Logo name="supabase" size={46}/><span>Supabase</span></div><div className="edge-title">Edge Functions</div></Rise>
 <div className="definition-copy"><Words t={t} at={2.5} text="منطق تطبيقك" size={39}/><Words t={t} at={3.1} text="يعمل على الخادم" size={39} highlight={['الخادم']}/></div>
 <div className="function-object" style={{transform:`translateY(${(1-enter(t,2.9))*100}px)`,opacity:lin(t,2.9,3.2)}}><div className="function-object-top"><span/><span/><span/><small>index.ts</small></div><div className="function-brackets"><span>{'{'}</span><Icon name="zap" size={64} color={C.textGreen}/><span>{'}'}</span></div><div className="function-language">TypeScript <i/> Server-side</div></div>
 <Rise t={t} at={4.5} style={{position:'absolute',top:745,width:'100%'}}><div className="definition-footer"><Icon name="send" size={23}/><span>طلب يدخل</span><Icon name="arrow-left" size={21}/><span>نتيجة ترجع</span></div></Rise>
 </div>};
