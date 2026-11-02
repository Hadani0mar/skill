import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import icons from '../../assets/icons-duotone.json';
import illustration from './illustration.json';

const W = 1080;
const H = 1920;
const PURPLE = '#6759D8';
const INK = '#211F2B';
const MUTED = '#777383';
const CREAM = '#FAF9F6';
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CHAPTERS = [0, 180, 360, 540, 720, 900, 1080];
const END = 1350;
const PAGE_T = 14;
const ART_DATA = illustration as {viewBox: string; kids: string[]};
const ART_MARKUP = ART_DATA.kids.map((part) => part.replaceAll('xmlns:ns0="http://www.w3.org/2000/svg"', '').replaceAll('ns0:', '')).join('');

const Words: React.FC<{text: string; start?: number; size?: number; color?: string; weight?: number; top: number}> = ({text, start=10, size=76, color=INK, weight=700, top}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  return <div dir="rtl" style={{position:'absolute',top,left:70,right:70,display:'flex',flexWrap:'wrap',justifyContent:'center',columnGap:'0.28em',rowGap:2,fontFamily:'Readex Pro',fontSize:size,fontWeight:weight,lineHeight:1.4,color,textAlign:'center'}}>
    {words.map((word,i)=>{const p=interpolate(f-start-i*4,[0,14],[0,1],{...CLAMP,easing:Easing.out(Easing.cubic)});return <span key={`${word}-${i}`} style={{opacity:p,transform:`translateY(${(1-p)*22}px)`}}>{word}</span>;})}
  </div>;
};

const Icon: React.FC<{name:string; size?:number; color?:string}> = ({name,size=62,color=PURPLE}) => {
  const id=React.useId().replace(/[^a-zA-Z0-9]/g,'');
  const raw=(icons as Record<string,string>)[name] ?? '';
  const html=raw.replace(/id="([^"]+)"/g,(_m,key)=>`id="${id}_${key}"`).replace(/url\(#([^)]+)\)/g,(_m,key)=>`url(#${id}_${key})`).replace(/href="#([^"]+)"/g,(_m,key)=>`href="#${id}_${key}"`).replace(/width="24" height="24"/,`width="${size}" height="${size}"`).replace(/currentColor/g,color);
  return <span style={{display:'inline-flex',width:size,height:size,lineHeight:0}} dangerouslySetInnerHTML={{__html:html}}/>;
};

const Art: React.FC<{top:number;width:number;start?:number}> = ({top,width,start=30}) => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const p=spring({frame:f-start,fps,config:{damping:15,stiffness:90}});
  return <svg viewBox={ART_DATA.viewBox} width={width} style={{position:'absolute',top,left:(W-width)/2,opacity:interpolate(f-start,[0,16],[0,1],CLAMP),transform:`translateY(${(1-p)*28}px) scale(${0.96+0.04*p})`,overflow:'visible','--primary-svg-color':PURPLE} as React.CSSProperties}><g dangerouslySetInnerHTML={{__html:ART_MARKUP}}/></svg>;
};

const Label: React.FC<{title:string; index:number}> = ({title,index}) => <div style={{position:'absolute',top:76,left:80,right:80,display:'flex',justifyContent:'space-between',alignItems:'center',font:'500 28px Readex Pro',color:MUTED,direction:'rtl'}}><span>{title}</span><span style={{direction:'ltr',fontVariantNumeric:'tabular-nums'}}>0{index+1} / 07</span></div>;

const Hook: React.FC = () => <>
  <Label title="بداية الفكرة" index={0}/>
  <Words text="عندك فكرة؟" top={232} size={112} start={12}/>
  <Words text="خلّينا نرتّبوها سوا." top={390} size={48} weight={500} color={MUTED} start={25}/>
  <div style={{position:'absolute',top:565,left:160,width:760,height:700,borderRadius:380,background:'radial-gradient(circle,#F0EDFC 0%,rgba(240,237,252,0) 72%)'}}/>
  <Art top={570} width={790} start={32}/>
  <div style={{position:'absolute',top:1390,left:175,width:730,height:130,borderRadius:32,background:'#FFF',border:'2px solid #E8E3F0',display:'flex',alignItems:'center',justifyContent:'center',gap:20,direction:'rtl',font:'600 38px Readex Pro',color:INK,boxShadow:'0 14px 36px rgba(48,39,82,.07)'}}><Icon name="chat-thread"/>نبدأ من سؤالك</div>
</>;

const Assistant: React.FC = () => <>
  <Label title="أنا مساعدك" index={1}/>
  <Words text="أنا مساعدك" top={225} size={94} start={12}/>
  <Words text="على Arena" top={354} size={62} weight={600} color={PURPLE} start={24}/>
  <div style={{position:'absolute',top:500,left:375,width:330,height:330,borderRadius:165,background:'#F0EDFC',border:'2px solid #E4DDF5',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="brain-circuit" size={180}/></div>
  <Art top={845} width={790} start={40}/>
  <Words text="نستكشف الفكرة من أكثر من زاوية." top={1535} size={40} weight={500} color={MUTED} start={82}/>
</>;

const Perspectives: React.FC = () => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  return <>
    <Label title="زوايا مختلفة" index={2}/>
    <Words text="نطّلعوا عليها" top={235} size={86} start={16}/>
    <Words text="من أكثر من زاوية." top={350} size={52} weight={500} color={MUTED} start={30}/>
    <div style={{position:'absolute',top:555,left:145,width:790,height:680,borderRadius:390,background:'radial-gradient(circle,#F0EDFC 0%,rgba(240,237,252,0) 72%)'}}/>
    <Art top={555} width={790} start={38}/>
    <div style={{position:'absolute',top:1280,left:110,right:110,display:'flex',justifyContent:'space-between',direction:'rtl'}}>{['sparkles','brain-circuit','chat-thread'].map((name,i)=>{const p=spring({frame:f-80-i*10,fps,config:{damping:13}});return <div key={name} style={{width:205,height:205,borderRadius:38,background:i===1?'#F0EDFC':'#FFF',border:'2px solid #E8E3F0',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 14px 30px rgba(48,39,82,.07)',opacity:interpolate(f-80-i*10,[0,10],[0,1],CLAMP),transform:`translateY(${(1-p)*32}px) rotate(${(i-1)*(1-p)*3}deg)`}}><Icon name={name} size={88}/></div>;})}</div>
  </>;
};

const Organize: React.FC = () => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const steps=[{icon:'chat-thread',label:'الفكرة'},{icon:'brain-circuit',label:'الزوايا'},{icon:'agent-handshake',label:'الخطوة'}];
  return <>
    <Label title="نرتّبوها سوا" index={3}/>
    <Words text="من الفكرة" top={230} size={86} start={15}/>
    <Words text="إلى الخطوة الجاية." top={350} size={52} weight={500} color={MUTED} start={28}/>
    <Art top={515} width={790} start={36}/>
    <div style={{position:'absolute',top:1265,left:105,right:105,height:250,display:'flex',justifyContent:'space-between',alignItems:'center',direction:'rtl'}}>
      <div style={{position:'absolute',left:112,right:112,top:92,height:4,background:'#D9D3EA'}}/>
      {steps.map((step,i)=>{const p=spring({frame:f-90-i*12,fps,config:{damping:13}});return <div key={step.label} style={{position:'relative',width:240,height:230,borderRadius:34,background:'#FFF',border:'2px solid #E8E3F0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,boxShadow:'0 14px 30px rgba(48,39,82,.07)',opacity:interpolate(f-90-i*12,[0,10],[0,1],CLAMP),transform:`translateY(${(1-p)*28}px)`}}><Icon name={step.icon} size={76}/><span style={{font:'600 30px Readex Pro',color:INK}}>{step.label}</span></div>;})}
    </div>
  </>;
};

const Ask: React.FC = () => <>
  <Label title="نبدأ من سؤالك" index={4}/>
  <Words text="ابدأ بسؤالك" top={260} size={92} start={18}/>
  <Words text="شن ودّك توصل له؟" top={395} size={50} weight={500} color={MUTED} start={32}/>
  <div style={{position:'absolute',top:570,left:130,right:130,height:190,borderRadius:36,background:'#FFF',border:'2px solid #E8E3F0',display:'flex',alignItems:'center',justifyContent:'center',gap:22,direction:'rtl',font:'600 40px Readex Pro',color:INK,boxShadow:'0 14px 36px rgba(48,39,82,.07)'}}><Icon name="chat-thread" size={64}/>نبدأ من سؤالك</div>
  <Art top={850} width={790} start={58}/>
</>;

const NextStep: React.FC = () => {
  const f=useCurrentFrame();
  const p=spring({frame:f-75,fps:30,config:{damping:13,stiffness:100}});
  return <>
    <Label title="الخطوة الجاية" index={5}/>
    <Words text="نرتّب الأفكار" top={260} size={82} start={16}/>
    <Words text="ونشوفوا شن الخطوة الجاية." top={380} size={46} weight={500} color={MUTED} start={30}/>
    <div style={{position:'absolute',top:590,left:180,right:180,height:380,borderRadius:48,background:'#F0EDFC',border:'2px solid #E4DDF5',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:20,opacity:interpolate(f-52,[0,16],[0,1],CLAMP),transform:`scale(${0.94+0.06*p})`}}>
      <Icon name="sparkles" size={108}/>
      <div style={{font:'650 46px Readex Pro',color:INK}}>الخطوة تصبح أوضح</div>
    </div>
    <div style={{position:'absolute',top:1110,left:170,right:170,height:370,display:'flex',justifyContent:'space-between',alignItems:'center',direction:'rtl'}}>
      {['chat-thread','brain-circuit','agent-handshake'].map((name,i)=>{const q=spring({frame:f-94-i*10,fps:30,config:{damping:13}});return <div key={name} style={{width:175,height:175,borderRadius:88,background:'#FFF',border:'2px solid #E8E3F0',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 14px 28px rgba(48,39,82,.07)',opacity:interpolate(f-94-i*10,[0,10],[0,1],CLAMP),transform:`translateY(${(1-q)*30}px)`}}><Icon name={name} size={82}/></div>;})}
    </div>
  </>;
};

const Outro: React.FC = () => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const p=spring({frame:f-80,fps,config:{damping:14,stiffness:100}});
  return <>
    <Label title="الخلاصة" index={6}/>
    <div style={{position:'absolute',top:200,left:140,width:800,height:730,borderRadius:400,background:'radial-gradient(circle,#F0EDFC 0%,rgba(240,237,252,0) 72%)'}}/>
    <Art top={205} width={800} start={12}/>
    <Words text="الفكرة منك…" top={1000} size={82} start={38}/>
    <Words text="ونرتّبوها سوا." top={1115} size={58} color={PURPLE} weight={600} start={52}/>
    <div style={{position:'absolute',top:1320,left:190,right:190,height:172,display:'flex',alignItems:'center',justifyContent:'center',gap:36,direction:'rtl'}}>
      {['chat-thread','sparkles','agent-handshake'].map((name,i)=><div key={name} style={{width:148,height:148,borderRadius:74,background:i===1?'#F0EDFC':'#FFF',border:'2px solid #E8E3F0',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 12px 28px rgba(48,39,82,.07)',opacity:interpolate(f-70-i*8,[0,12],[0,1],CLAMP),transform:`translateY(${(1-spring({frame:f-70-i*8,fps,config:{damping:13}}))*30}px)`}}><Icon name={name} size={76}/></div>)}
    </div>
    <div style={{position:'absolute',top:1555,left:'50%',transform:`translateX(-50%) scale(${0.92+0.08*p})`,opacity:interpolate(f-82,[0,14],[0,1],CLAMP),borderRadius:999,background:INK,color:'#FFF',padding:'20px 54px',font:'700 34px Readex Pro',letterSpacing:2}}>ARENA</div>
  </>;
};

const SCENES=[Hook,Assistant,Perspectives,Organize,Ask,NextStep,Outro];
const Page:React.FC<{index:number;duration:number}> = ({index,duration}) => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=index===0?1:spring({frame:f,fps,config:{damping:18,stiffness:90}});
  const leave=interpolate(f,[duration,duration+PAGE_T],[0,1],{...CLAMP,easing:Easing.inOut(Easing.cubic)});
  const Scene=SCENES[index];
  const bg=index===6?'#F5F1EB':CREAM;
  return <AbsoluteFill style={{background:bg,overflow:'hidden',transform:`translateY(${(1-enter)*H}px) scale(${1-0.04*leave})`,filter:`brightness(${1-0.14*leave})`,boxShadow:enter<0.999?'0 -24px 64px rgba(35,28,63,.14)':'none'}}><Scene/></AbsoluteFill>;
};
const Progress:React.FC=()=>{const f=useCurrentFrame();const index=Math.min(6,Math.floor(f/180));return <div style={{position:'absolute',top:42,left:0,right:0,display:'flex',justifyContent:'center',gap:10,pointerEvents:'none'}}>{CHAPTERS.map((_,i)=><div key={i} style={{width:i===index?38:10,height:10,borderRadius:99,background:i===index?PURPLE:'#D8D3E5'}}/>)}</div>;};
const FontFaces=()=> <style>{`@font-face{font-family:'Readex Pro';src:url(${staticFile('fonts/ReadexPro-variable.ttf')}) format('truetype');font-weight:100 900;font-display:block}`}</style>;

export const ArenaAgentsVideo:React.FC=()=> <AbsoluteFill style={{background:CREAM,color:INK,fontFamily:'Readex Pro'}}>
  <FontFaces/>
  {CHAPTERS.map((start,index)=>{const duration=(CHAPTERS[index+1]??END)-start;return <Sequence key={index} from={start} durationInFrames={duration+(index<6?PAGE_T:0)}><Page index={index} duration={duration}/></Sequence>;})}
  <Progress/>
  <Audio src={staticFile('sfx/mix.wav')} volume={0.82}/>
</AbsoluteFill>;
export const VIDEO_META={fps:30,width:W,height:H,durationInFrames:END};
