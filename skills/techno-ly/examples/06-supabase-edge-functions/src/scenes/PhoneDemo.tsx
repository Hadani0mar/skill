import React from 'react';
import {useTime,ShopPhone,Words,Touch,lin,ease} from '../ui';
export const PhoneDemo=()=>{let t=useTime();let value='TAQNI20'.slice(0,Math.round(lin(t,2.5,3.65)*7));let state=t<2.5?'empty':t<4.3?'typing':t<4.55?'pressed':'loading';return <div className="scene phone-demo"><Words t={t} at={.2} text="جرّب الخصم على الهاتف" size={27} style={{position:'absolute',top:78,left:0,width:'100%'}}/><ShopPhone t={t} state={state} value={value} style={{left:106,top:143+(1-ease(lin(t,0,.8)))*750}} scale={.86}/><Touch x={270} y={635} t={t} press={4.3}/></div>};
