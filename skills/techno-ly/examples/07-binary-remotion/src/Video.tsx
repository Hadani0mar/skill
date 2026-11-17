import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, Easing, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Kufam';
import timeline from './timeline.json';

const {fontFamily} = loadFont();
const GREEN = '#22c55e';
const DEEP = '#168752';
const INK = '#141816';
const FPS = 60;

type Segment = (typeof timeline.segments)[number];
const segs = timeline.segments as Segment[];
const bound = (x:number,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease = (x:number)=>1-Math.pow(1-bound(x),3);
const pop = (frame:number,delay:number)=>spring({fps:FPS,frame:Math.max(0,frame-delay),config:{damping:13,stiffness:150,mass:0.75}});
const getIndex = (frame:number)=>{
  let idx=0;
  for(let i=0;i<segs.length;i++) if(frame>=segs[i].start) idx=i;
  return idx;
};
const activeVoice = (frame:number,actor:string)=>{
  for(const s of segs) if(s.speaker===actor && frame>=s.start && frame<s.end){
    const idx=Math.min(s.mouth.length-1,Math.floor(frame-s.start));
    return {s,value:Number(s.mouth[Math.max(0,idx)]??0)};
  }
  return {s:null,value:0};
};
const largeCaption=['تشوف الرقم خمسة؟','الصفر طافي والواحد شغّال','زي مفتاح الضو؟','8    4    2    1','كيف نكتب خمسة؟','0101 = 5'];
const wordsToPaint=['خمسة','واحد','ضو','4','خمسة','0101'];

function TitleWords({index,frame,segment}:{index:number,frame:number,segment:Segment}){
  const text=largeCaption[index]||'';
  const entered=frame-segment.start;
  const words=text.split(' ');
  return <div dir={index===3||index===5?'ltr':'rtl'} style={{position:'absolute',top:280,left:98,width:880,textAlign:'center',
    fontFamily,fontWeight:750,color:INK,fontSize:index===3?70:67,lineHeight:1.45}}>
    {words.map((w,i)=>{
      const t=entered-i*4;
      const a=bound(t/14);
      const y=(1-ease(a))*34;
      return <span key={i} style={{display:'inline-block',whiteSpace:'pre',marginLeft:9,
        opacity:a,filter:'blur('+((1-a)*8)+'px)',transform:'translateY('+y+'px) scale('+(0.95+0.05*a)+')',
        color:(w.includes(wordsToPaint[index])&&wordsToPaint[index])?DEEP:INK}}>{w+' '}</span>;
    })}
  </div>;
}

function Person({speaker,frame,voice,active}:{speaker:'A'|'B',frame:number,voice:number,active:boolean}){
  const a = speaker==='A';
  const blink = frame%197 > 186 && frame%197 < 194 ? 0.2 : 1;
  const wiggle = active ? 3.7*Math.sin(frame/11) : 0.8*Math.sin(frame/25);
  const mouth = active ? (3+voice*15):3;
  const lift=active ? 11*Math.sin(frame/13): 2*Math.sin(frame/27);
  const height= active ? 0.9 : 0;
  return <svg width="390" height="540" viewBox="0 0 390 540" style={{overflow:'visible'}}>
    <ellipse cx="194" cy="520" rx="106" ry="12" fill="#e5eae7"/>
    {/* Leg silhouettes and shoes */}
    <path d="M154 373 L143 478" stroke={INK} strokeWidth="26" strokeLinecap="round"/>
    <path d="M239 372 L251 478" stroke={INK} strokeWidth="26" strokeLinecap="round"/>
    <path d="M141 479 Q117 484 118 502 L177 502" stroke={INK} strokeWidth="19" strokeLinecap="round"/>
    <path d="M254 478 Q277 482 272 502 L218 502" stroke={INK} strokeWidth="19" strokeLinecap="round"/>
    {/* torso */}
    <path d="M123 256 Q192 220 260 254 L273 382 Q194 418 111 380Z" fill={a?'#eaf6ee':'#f2f4f3'} stroke={INK} strokeWidth="9" strokeLinejoin="round"/>
    {a?<path d="M169 261 L191 300 L213 263" fill="none" stroke={DEEP} strokeWidth="9" strokeLinecap="round"/>:
      <path d="M168 260 Q195 280 221 257" fill="none" stroke={GREEN} strokeWidth="11"/>}
    {/* arms */}
    <g transform={'rotate('+ (a?(active?-16:7)+wiggle : (active?-(13+height):8)+wiggle)+' 130 267)'}>
      <path d="M134 263 Q94 295 75 350" fill="none" stroke={INK} strokeWidth="27" strokeLinecap="round"/>
      <circle cx="76" cy="352" r="22" fill="#efc4a8" stroke={INK} strokeWidth="7"/>
    </g>
    <g transform={'rotate('+ (a?(active?25:0): (active?24:0))+' 258 268)'}>
      <path d="M253 265 Q298 294 309 348" fill="none" stroke={INK} strokeWidth="27" strokeLinecap="round"/>
      <circle cx="309" cy="349" r="23" fill="#efc4a8" stroke={INK} strokeWidth="7"/>
    </g>
    <g transform={'translate(0 '+(-lift*0.45)+')'}>
      {a? <><ellipse cx="194" cy="156" rx="103" ry="110" fill="#eec1a4" stroke={INK} strokeWidth="9"/>
        <path d="M90 164 Q76 57 165 40 Q238 17 285 93 L283 148 Q257 85 233 96 Q191 102 169 83 Q123 127 90 164" fill={INK}/>
        <path d="M112 125 Q172 88 238 93" fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round"/>
        <rect x="123" y="144" width="63" height="46" rx="17" fill="none" stroke={INK} strokeWidth="8"/>
        <rect x="202" y="144" width="62" height="46" rx="17" fill="none" stroke={INK} strokeWidth="8"/>
        <path d="M186 163 L202 163" stroke={INK} strokeWidth="8"/>
      </>:<>
        <path d="M70 195 Q58 54 192 23 Q319 42 314 199 L285 278 L107 278Z" fill={GREEN} stroke={INK} strokeWidth="9"/>
        <ellipse cx="194" cy="158" rx="91" ry="100" fill="#edc4ab" stroke={INK} strokeWidth="8"/>
        <path d="M104 162 Q108 70 191 63 Q272 72 284 161 L260 94 Q197 118 137 94Z" fill={DEEP}/>
        <path d="M98 183 Q85 243 127 274" fill="none" stroke={GREEN} strokeWidth="35" strokeLinecap="round"/>
        <path d="M288 177 Q306 243 266 278" fill="none" stroke={GREEN} strokeWidth="34" strokeLinecap="round"/>
      </>}
      <ellipse cx="158" cy="169" rx="8" ry={8*blink} fill={INK}/>
      <ellipse cx="231" cy="169" rx="8" ry={8*blink} fill={INK}/>
      <ellipse cx="197" cy="218" rx="23" ry={mouth} fill={INK}/>
      {!active && <path d="M177 215 Q197 232 216 216" stroke={INK} fill="none" strokeWidth="5" strokeLinecap="round"/>}
    </g>
  </svg>;
}

function SwitchPanel({frame,start}:{frame:number,start:number}){
  const f=Math.max(0,frame-start), stage=(f<Math.round(FPS*3.0)?0:1);
  const inp=pop(f,0);
  return <div style={{position:'absolute',top:625,left:115,width:850,height:390,
    background:'#f8faf8',border:'3px solid #e3eae5',borderRadius:44,
    transform:'scale('+(0.96+inp*0.04)+')',opacity:bound(f/9)}}>
    <div style={{textAlign:'center',fontFamily,fontSize:40,color:INK,marginTop:28}}>فكرة بسيطة: مفتاح</div>
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:130,marginTop:35}}>
      <div style={{fontFamily:'Inter,Arial',fontSize:90,fontWeight:900,color:stage?DEEP:INK}}>{stage?'1':'0'}</div>
      <div style={{height:155,width:93,border:'5px solid '+INK,borderRadius:50,background:stage?'#c7efd4':'#e6e6e6',position:'relative'}}>
        <div style={{width:76,height:76,left:4,top:stage?7:67,borderRadius:50,position:'absolute',background:stage?GREEN:'#777',
          boxShadow:'0 5px 0 #ddd'}}/>
      </div>
      <div style={{fontFamily,fontSize:57,fontWeight:800,color:stage?DEEP:INK}}>{stage?'شغّال':'طافي'}</div>
    </div>
  </div>;
}

function BitPanel({frame,from,phase}:{frame:number,from:number,phase:number}){
  const enters=pop(frame,from);
  const p=phase===5?bound((frame-segs[5].start)/Math.max(100,segs[5].duration*0.72)):0;
  const states=[0,p>=0.23?1:0,0,p>=0.46?1:0];
  const values=[8,4,2,1];
  return <div style={{position:'absolute',top:622,left:91,width:898,height:435,
    background:'#f8faf8',border:'3px solid #e5eee7',borderRadius:48,
    opacity:bound((frame-from)/10),transform:'scale('+(0.97+0.03*enters)+')'}}>
    <div style={{display:'flex',gap:15,justifyContent:'center',paddingTop:47}}>
      {values.map((v,i)=>{
        const on=states[i]===1;
        const reveal=pop(frame,from+i*5);
        return <div key={v} style={{width:180,height:238,borderRadius:29,background:on?'#e0f9e9':'#fff',
          border:'4px solid '+(on?GREEN:'#d6ded8'),display:'flex',flexDirection:'column',alignItems:'center',
          justifyContent:'center',transform:'scale('+(0.92+reveal*0.08)+')'}}>
          <div style={{fontFamily:'Inter,Arial',fontWeight:850,fontSize:57,color:INK}}>{v}</div>
          <div style={{height:1,width:125,background:'#d7dfda',margin:'15px 0'}}/>
          <div style={{fontFamily:'Inter,Arial',fontWeight:950,fontSize:84,color:on?DEEP:'#9ca9a1'}}>{on?'1':'0'}</div>
        </div>;
      })}
    </div>
    {phase===5 && p>.65 && <div style={{fontFamily:'Inter,Arial',fontSize:56,fontWeight:900,color:DEEP,
      textAlign:'center',marginTop:28,transform:'scale('+pop(frame,from+96)+')'}}>4 + 1 = 5</div>}
    {phase===3 && <div style={{textAlign:'center',color:'#4b6255',fontFamily,fontSize:27,marginTop:20}}>قيمة كل خانة</div>}
  </div>;
}

function Outro({frame}:{frame:number}){
  const st=frame-timeline.outroStart;
  const logo=pop(st,4);
  const btn=pop(st,55);
  const followed=st>125;
  return <AbsoluteFill style={{backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
    <Img src={staticFile('brand/taqni-mark-white.svg')} style={{width:295,height:295,
      transform:'translateY(-210px) scale('+logo+')'}}/>
    <div style={{position:'absolute',top:950,display:'flex',alignItems:'center',gap:25}}>
      <Img src={staticFile('brand/tiktok.svg')} style={{width:67,height:77,background:INK,borderRadius:14,padding:7}}/>
      <div dir="ltr" style={{fontFamily:'Inter,Arial',fontSize:51,fontWeight:800,color:INK}}>@teqani.ly</div>
    </div>
    <div style={{position:'absolute',top:1130,width:425,height:97,borderRadius:22,background:followed?'#f0f4f1':GREEN,
      transform:'translateY('+(1-btn)*100+'px)',opacity:btn,display:'grid',placeItems:'center',
      fontFamily,color:followed?DEEP:'#fff',fontSize:45,fontWeight:800}}>
      {followed?'✓  تمت المتابعة':'متابعة'}
    </div>
    <div style={{position:'absolute',top:1270,left:600,width:40,height:65,
      transform:'translateY('+(followed?-52:0)+'px)',fontSize:67,opacity:st>101?1:0}}>↖</div>
  </AbsoluteFill>;
}

export const BinaryFilm:React.FC=()=>{
  const frame=useCurrentFrame();
  const phase=getIndex(frame);
  const seg=segs[phase];
  const inOutro=frame>=timeline.outroStart;
  const speakA=activeVoice(frame,'A'),speakB=activeVoice(frame,'B');
  const bitStart=segs[3].start, revealStart=segs[5].start;
  return <AbsoluteFill style={{backgroundColor:'#fff',color:INK,fontFamily,overflow:'hidden'}}>
    {/* Real Taqni mark, fixed corner bug */}
    <Img src={staticFile('brand/taqni-mark-white.svg')} style={{position:'absolute',top:57,left:56,width:112,height:112}}/>
    <div style={{position:'absolute',top:102,left:170,color:'#5c6b60',fontFamily:'Inter,Arial',
      fontSize:28,fontWeight:650}}>@teqani.ly</div>
    {frame<timeline.outroStart && <>
      {phase===0 ? <>
        <div style={{position:'absolute',top:205,width:'100%',textAlign:'center',fontFamily,
          fontSize:64,fontWeight:800}}>كيف الكمبيوتر يكتب <span style={{color:DEEP}}>خمسة؟</span></div>
        <div style={{position:'absolute',top:628,left:135,width:810,height:390,background:'#f8faf8',
          border:'3px solid #e5eee7',borderRadius:42,display:'flex',alignItems:'center',
          justifyContent:'center',gap:45}}>
          <div style={{fontFamily:'Inter,Arial',fontSize:118,fontWeight:950,color:INK}}>0101</div>
          <div style={{fontSize:95,color:DEEP,fontWeight:900}}>= 5</div>
        </div>
      </>:null}
      {phase>=1&&phase<=2 && <SwitchPanel frame={frame} start={segs[1].start}/>}
      {phase>=3&& <BitPanel frame={frame} from={bitStart} phase={phase===5?5:phase}/>}
      {phase!==0&& <TitleWords frame={frame} index={phase} segment={seg}/>}
      <div style={{position:'absolute',top:1152,left:30,width:420}}>
        <Person speaker="A" frame={frame} voice={speakA.value} active={!!speakA.s}/>
      </div>
      <div style={{position:'absolute',top:1152,left:620,width:420}}>
        <Person speaker="B" frame={frame} voice={speakB.value} active={!!speakB.s}/>
      </div>
      <div style={{position:'absolute',top:1705,left:110,width:335,fontSize:35,fontFamily,
        color:'#47564a',textAlign:'center'}}>يسأل</div>
      <div style={{position:'absolute',top:1705,left:615,width:335,fontSize:35,fontFamily,
        color:'#47564a',textAlign:'center'}}>تشرح</div>
    </>}
    {inOutro && <Outro frame={frame}/>}
    {/* Each utterance has its own exact audio source and a waveform-derived mouth track */}
    {segs.map(s=><Sequence key={s.i} from={s.start} durationInFrames={s.duration}>
      <Audio src={staticFile('audio/'+s.file)} volume={0.9}/>
    </Sequence>)}
    {/* Restrained sound only on visible state changes */}
    {[segs[1].start+Math.round(FPS*3),segs[5].start+44,segs[5].start+98].map((f,i)=><Sequence key={'sfx'+i} from={f} durationInFrames={12}>
      <Audio src={staticFile('audio/soft-click.wav')} volume={0.18}/>
    </Sequence>)}
    <Sequence from={timeline.outroStart+125} durationInFrames={16}><Audio src={staticFile('audio/soft-press.wav')} volume={0.13}/></Sequence>
  </AbsoluteFill>;
};
