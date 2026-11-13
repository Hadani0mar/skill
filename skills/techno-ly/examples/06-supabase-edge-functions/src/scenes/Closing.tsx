import React from 'react';
import {useTime,Words,Logo,Icon,Rise,C,lin,ease,UiButton,Pointer} from '../ui';
export const Closing=()=>{
 const t=useTime(),out=ease(lin(t,5,5.75));
 const followIn=ease(lin(t,5.85,6.4));
 const press=lin(t,7.3,7.48);
 const pressed=t>=7.3&&t<7.48;
 const done=ease(lin(t,7.48,7.78));
 const cursorIn=ease(lin(t,6.65,7.18));
 return <div className="scene closing">
  <div className="closing-flow" style={{transform:`translateY(${-out*140}px)`,opacity:1-out}}>
   <Words t={t} at={0} text="الفكرة بسيطة" size={38}/>
   <div className="closing-chain"><Rise t={t} at={1.2}><Icon name="smartphone" size={36}/><b>الهاتف يطلب</b></Rise><div className="chain-line" style={{transform:`scaleY(${lin(t,1.4,2)})`}}/><Rise t={t} at={2.1}><Logo name="supabase" size={40}/><b>الخادم ينفّذ</b></Rise><div className="chain-line" style={{transform:`scaleY(${lin(t,2.7,3.4)})`}}/><Rise t={t} at={3.5}><Icon name="circle-check" size={38} color={C.textGreen}/><b>النتيجة لتطبيقك</b></Rise></div>
  </div>
  <div className="outro-identity" style={{opacity:lin(t,5.3,5.8),transform:`translateY(${(1-out)*80}px)`}}>
   <Logo name="taqni" size={168}/>
   <div className="outro-handle"><Logo name="tiktok" size={29}/><span>@teqani.ly</span></div>
   <div className="follow-wrap" style={{opacity:lin(t,5.85,6.1),transform:`translateY(${(1-followIn)*18}px)`}}>
    <UiButton className="follow-cta" style={{transform:`scale(${pressed?.96:1})`,background:done>.5?'#168752':'#fe2c55'}}>
     <span className="follow-state" style={{opacity:1-lin(t,7.48,7.58),transform:`translateY(${-lin(t,7.48,7.62)*15}px)`}}><Icon name="user-plus" size={21}/><b>متابعة</b></span>
     <span className="follow-state follow-done" style={{opacity:lin(t,7.62,7.79),transform:`translateY(${(1-ease(lin(t,7.62,7.79)))*15}px)`}}><Icon name="check" size={21}/><b>تمت المتابعة</b></span>
    </UiButton>
   </div>
  </div>
  {t>6.65&&t<8.4&&<div style={{position:'absolute',left:0,top:0,opacity:lin(t,6.65,6.9)*(1-lin(t,8,8.4))}}><Pointer x={390-39*cursorIn} y={656-85*cursorIn} t={t} press={7.3}/></div>}
 </div>
};
