import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import icons from './icons.json';
import {Phone} from '../kit/phone';
import {Button} from '../kit/controls/Button';
import {MacPointer} from '../kit/cursors';
export const C={green:'#22c55e',textGreen:'#168752',sb:'#3ecf8e',ink:'#141816',grey:'#727975'};
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const lin=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
export const ease=(p:number)=>Easing.bezier(.25,.8,.25,1)(clamp(p));
export const travel=(p:number)=>Easing.bezier(.45,0,.1,1)(clamp(p));
export const enter=(t:number,at=0,d=.65)=>ease(lin(t,at,at+d));
export const useTime=()=>useCurrentFrame()/useVideoConfig().fps;
export function Icon({name,size=20,color='currentColor'}:{name:string,size?:number,color?:string}){
 const g=icons.glyphs.find(x=>x.slug===name);if(!g)throw Error('Missing icon '+name);
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>{g.nodes.map(([tag,attrs],i)=>React.createElement(tag as string,{...attrs,key:i}))}</svg>;
}
export function Logo({name,size=30}:{name:string,size?:number}){return <Img src={staticFile('logos/'+name+'.svg')} style={{width:size,height:size,objectFit:'contain'}}/>}
// Frame-driven port of the channel template's React Bits BlurText reveal.
export function Words({text,t,at=0,size=30,highlight=[],style={}}:{text:string,t:number,at?:number,size?:number,highlight?:string[],style?:React.CSSProperties}){
 return <div dir="rtl" className="words" style={{fontSize:size,...style}}>{text.split(' ').map((w,i)=>{const p=enter(t,at+i*.07,.45);return <span key={i} style={{display:'inline-block',opacity:p,filter:`blur(${(1-p)*8}px)`,transform:`translateY(${(1-p)*18}px)`,color:highlight.includes(w)?C.textGreen:undefined,marginInlineEnd:'.23em'}}>{w}</span>})}</div>;
}
export function Rise({t,at=0,children,style={},distance=45}:{t:number,at?:number,children:React.ReactNode,style?:React.CSSProperties,distance?:number}){let p=enter(t,at);return <div style={{...style,opacity:lin(t,at,at+.22),transform:`${style.transform||''} translateY(${(1-p)*distance}px)`}}>{children}</div>}
export function UiButton({children,primary=false,style={},...props}:any){return <Button variant={primary?'primary':'secondary'} {...props} style={style}><span>{children}</span></Button>}
export function Pointer({x,y,t,press=-100}:any){let p=lin(t,press,press+.18);let q=lin(t,press+.18,press+.38);return <div style={{position:'absolute',left:x-5,top:y-5,zIndex:30,transform:`scale(${1-.15*Math.sin(p*Math.PI)})`,pointerEvents:'none'}}><MacPointer/>{t>=press&&t<press+.55&&<span className="click-ring" style={{width:42*q+8,height:42*q+8,opacity:1-q,left:6-21*q,top:7-21*q}}/>}</div>}
export function Touch({x,y,t,press}:any){let p=lin(t,press,press+.6);return t<press||t>press+.65?null:<div className="touch" style={{left:x,top:y,width:22+60*p,height:22+60*p,opacity:Math.sin(p*Math.PI)*.65}}/>}
export function RollingPrice({t,from=100,to=80,at=0,size=78}:{t:number,from?:number,to?:number,at?:number,size?:number}){
 const p=travel(lin(t,at,at+.8));const n=Math.round(from+(to-from)*p);let a=String(n).padStart(3,' ');
 return <span dir="ltr" className="rolling-price" style={{fontSize:size}}>{a.split('').map((d,i)=><span key={i} style={{display:'inline-block',width:d===' '?.05*size:.64*size,overflow:'hidden',height:'1.1em',verticalAlign:'bottom'}}><span style={{display:'block',transform:`translateY(${i===2&&p<1?-Math.sin(p*Math.PI)*10:0}px)`}}>{d===' '? '':d}</span></span>)}</span>
}
export function ShopPhone({t=0,state='empty',value='',price=100,style={},scale=1,shake=0}:any){
 const isOk=state==='success',isErr=state==='error';
 return <div className="phone-holder" style={{...style,transform:`${style.transform||''} scale(${scale})`,transformOrigin:'top left'}}><Phone width={380} frame="silver" time="9:41"><div className="shop" dir="rtl">
  <div className="shop-nav"><Icon name="arrow-right" size={23}/><strong>متجر تقني</strong><Icon name="ellipsis" size={25}/></div>
  <div className="product-art"><div className="art-lines"><i/><i/><i/><i/></div><div className="art-front"><Icon name="layers" size={61} color={C.textGreen}/><span>UI / KIT</span></div></div>
  <div className="product-name">حزمة واجهات</div><div className="product-description">ملفات تصميم لمشروعك القادم</div>
  <div className="shop-rule"/>
  <div className="shop-summary"><span>السعر الأصلي</span><span dir="ltr">100 <small>د.ل</small></span></div>
  <div className="coupon-label">عندك كود خصم؟</div>
  <div className={'coupon-input '+(isOk?'valid':isErr?'invalid':'')} style={{transform:`translateX(${shake}px)`}}><span dir="ltr">{value||<em>أدخل الكود</em>}{state==='typing'&&<b className="caret" style={{opacity:Math.sin(t*8)>0?1:0}}/>}</span><Icon name="tag" size={24}/></div>
  <UiButton primary className="apply-btn" style={{transform:state==='pressed'?'scale(.97)':'none',background:isErr?'#f5f6f5':undefined,color:isErr?'#29302c':undefined}}>{state==='loading'?<span className="loading-label"><Icon name="loader-circle" size={22}/><span>جارٍ التحقق</span></span>:isOk?<span className="loading-label"><Icon name="check" size={21}/><span>تم تطبيق الخصم</span></span>:'تطبيق الخصم'}</UiButton>
  <div className="feedback" style={{color:isErr?'#b43832':C.textGreen,opacity:isOk||isErr?1:0}}>{isErr?'الكود غير صالح':<>وفّرت <b dir="ltr">20</b> دينارًا</>}</div>
  <div className="total"><span>الإجمالي</span><div className="total-num" dir="ltr">{price}<small>د.ل</small></div></div>
  
 </div></Phone></div>
}
