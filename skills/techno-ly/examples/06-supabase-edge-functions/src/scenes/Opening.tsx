import React from 'react';
import {useTime,Words,Icon,Rise,C,lin,ease,RollingPrice} from '../ui';
export const Opening=()=>{let t=useTime();let q=ease(lin(t,3.5,4.1));return <div className="scene opening">
 <div className="opening-kicker">كود واحد. خصم محسوب.</div>
 <div className="price-proof" style={{transform:`translateY(${-q*70}px) scale(${1-q*.17})`}}>
  <div className="before-price" style={{opacity:.4+lin(t,.3,.9)*.6}}>100<span>د.ل</span><i style={{transform:`scaleX(${lin(t,.7,1.5)})`}}/></div>
  <div className="proof-arrow"><Icon name="arrow-left" size={34}/></div>
  <div className="after-price"><RollingPrice t={t} at={.15} size={126}/><span>د.ل</span></div>
 </div>
 <div className="coupon-ticket" style={{transform:`translateY(${-q*45}px)`}}><Icon name="tag" size={25}/><span>TAQNI20</span><b>−20%</b></div>
 <div className="opening-question"><Words t={t} at={3.6} text="من يحسب الخصم؟" size={35}/><div className="question-options"><Rise t={t} at={4.9}><Icon name="smartphone" size={24}/><span>الهاتف</span></Rise><span style={{opacity:lin(t,5.5,5.7)}}>أم</span><Rise t={t} at={5.6}><Icon name="server" size={24}/><span>الخادم</span></Rise></div></div>
 </div>};
