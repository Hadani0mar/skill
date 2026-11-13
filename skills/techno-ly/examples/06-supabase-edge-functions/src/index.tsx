import React,{useEffect,useState} from 'react';
import {registerRoot,Composition,Sequence,Audio,staticFile,AbsoluteFill,delayRender,continueRender,useCurrentFrame,useVideoConfig,Folder} from 'remotion';
import {Opening} from './scenes/Opening';
import {Definition} from './scenes/Definition';
import {Dashboard} from './scenes/Dashboard';
import {PhoneDemo} from './scenes/PhoneDemo';
import {RequestFlow} from './scenes/RequestFlow';
import {InvalidCoupon} from './scenes/InvalidCoupon';
import {Closing} from './scenes/Closing';
import {Logo,useTime,lin,ease} from './ui';
import '../kit/stage.css';
import './style.css';
const Frame=({children}:{children:React.ReactNode})=>{const [h]=useState(()=>delayRender('Load Arabic and UI fonts'));useEffect(()=>{Promise.all(['Kufam','Inter','JetBrains'].map(x=>document.fonts.load(`600 24px ${x}`))).then(()=>continueRender(h));},[h]);return <AbsoluteFill style={{background:'white'}}><style>{`@font-face{font-family:Kufam;src:url("${staticFile("fonts/Kufam.ttf")}")}@font-face{font-family:Inter;src:url("${staticFile("fonts/Inter.ttf")}")}@font-face{font-family:JetBrains;src:url("${staticFile("fonts/JetBrainsMono.ttf")}")}`}</style><div className="film ss-stage" data-theme="light">{children}</div></AbsoluteFill>};
const Transition=({children,duration,kind='rise'}:any)=>{let t=useTime();let out=lin(t,duration-.24,duration);let inP=ease(lin(t,0,.45));return <AbsoluteFill style={{opacity:1-out,filter:`blur(${out*5}px)`,transform:kind==='wipe'?undefined:`translateY(${kind==='none'?0:(1-inP)*24-out*14}px)`,clipPath:kind==='wipe'?`inset(0 ${(1-inP)*100}% 0 0)`:undefined}}>{children}</AbsoluteFill>};
export const Film=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return <Frame>
 <Sequence name="Opening" from={0} durationInFrames={402} premountFor={fps}><Transition duration={6.7} kind="none"><Opening/></Transition></Sequence>
 <Sequence name="Definition" from={402} durationInFrames={450} premountFor={fps}><Transition duration={7.5} kind="wipe"><Definition/></Transition></Sequence>
 <Sequence name="Supabase dashboard" from={852} durationInFrames={762} premountFor={fps}><Transition duration={12.7} kind="rise"><Dashboard/></Transition></Sequence>
 <Sequence name="Phone coupon entry" from={1614} durationInFrames={348} premountFor={fps}><Transition duration={5.8} kind="none"><PhoneDemo/></Transition></Sequence>
 <Sequence name="Request and response" from={1962} durationInFrames={450} premountFor={fps}><Transition duration={7.5} kind="none"><RequestFlow/></Transition></Sequence>
 <Sequence name="Invalid coupon" from={2412} durationInFrames={267} premountFor={fps}><Transition duration={4.45} kind="none"><InvalidCoupon/></Transition></Sequence>
 <Sequence name="Closing" from={2679} durationInFrames={531} premountFor={fps}><Transition duration={8.85} kind="rise"><Closing/></Transition></Sequence>
 <div className="watermark"><Logo name="taqni" size={34}/><span>@teqani.ly</span></div>
 <div className="progress-track"><i style={{width:`${f/3209*100}%`}}/></div>
 <Audio src={staticFile('mix.flac')} volume={1}/>
 </Frame>};
const Standalone=({scene:Scene}:any)=><Frame><Scene/></Frame>;
const A=()=> <Standalone scene={Opening}/>;const B=()=> <Standalone scene={Definition}/>;const D=()=> <Standalone scene={Dashboard}/>;const P=()=> <Standalone scene={PhoneDemo}/>;const R=()=> <Standalone scene={RequestFlow}/>;const I=()=> <Standalone scene={InvalidCoupon}/>;const E=()=> <Standalone scene={Closing}/>;
export const Root=()=> <><Composition id="EdgeFunctions" component={Film} width={1080} height={1920} fps={60} durationInFrames={3210}/><Folder name="Scenes"><Composition id="Opening" component={A} width={1080} height={1920} fps={60} durationInFrames={402}/><Composition id="Definition" component={B} width={1080} height={1920} fps={60} durationInFrames={450}/><Composition id="Dashboard" component={D} width={1080} height={1920} fps={60} durationInFrames={762}/><Composition id="Phone" component={P} width={1080} height={1920} fps={60} durationInFrames={348}/><Composition id="RequestFlow" component={R} width={1080} height={1920} fps={60} durationInFrames={450}/><Composition id="InvalidCoupon" component={I} width={1080} height={1920} fps={60} durationInFrames={267}/><Composition id="Closing" component={E} width={1080} height={1920} fps={60} durationInFrames={531}/></Folder></>;
registerRoot(Root);
