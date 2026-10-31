import { renderSound } from '/home/claude/reactbits/src/sounds/js/react-bits-sound.js';
import s_tink from '/home/claude/reactbits/src/sounds/js/tink.js';
import s_dot from '/home/claude/reactbits/src/sounds/js/dot.js';
import s_swish from '/home/claude/reactbits/src/sounds/js/swish.js';
import s_popover from '/home/claude/reactbits/src/sounds/js/popover.js';
import s_counter from '/home/claude/reactbits/src/sounds/js/counter.js';
import s_glimmer from '/home/claude/reactbits/src/sounds/js/glimmer.js';
import s_check from '/home/claude/reactbits/src/sounds/js/check.js';
import s_ding from '/home/claude/reactbits/src/sounds/js/ding.js';
import s_emblem from '/home/claude/reactbits/src/sounds/js/emblem.js';
import s_calm from '/home/claude/reactbits/src/sounds/js/calm.js';
import s_keycap from '/home/claude/reactbits/src/sounds/js/keycap.js';
import s_swoop from '/home/claude/reactbits/src/sounds/js/swoop.js';
import s_snap from '/home/claude/reactbits/src/sounds/js/snap.js';
import s_notch from '/home/claude/reactbits/src/sounds/js/notch.js';
const R={tink:s_tink,dot:s_dot,swish:s_swish,popover:s_popover,counter:s_counter,glimmer:s_glimmer,check:s_check,ding:s_ding,emblem:s_emblem,calm:s_calm,keycap:s_keycap,swoop:s_swoop,snap:s_snap,notch:s_notch,};
function wav(buf){const ch=buf.numberOfChannels,len=buf.length,sr=buf.sampleRate;const out=new DataView(new ArrayBuffer(44+len*ch*2));const w=(o,s)=>{for(let i=0;i<s.length;i++)out.setUint8(o+i,s.charCodeAt(i))};w(0,'RIFF');out.setUint32(4,36+len*ch*2,true);w(8,'WAVE');w(12,'fmt ');out.setUint32(16,16,true);out.setUint16(20,1,true);out.setUint16(22,ch,true);out.setUint32(24,sr,true);out.setUint32(28,sr*ch*2,true);out.setUint16(32,ch*2,true);out.setUint16(34,16,true);w(36,'data');out.setUint32(40,len*ch*2,true);const d=[];for(let c=0;c<ch;c++)d.push(buf.getChannelData(c));let o=44;for(let i=0;i<len;i++)for(let c=0;c<ch;c++){const v=Math.max(-1,Math.min(1,d[c][i]));out.setInt16(o,v*32767,true);o+=2}return new Uint8Array(out.buffer)}
window.renderRB=async(name)=>{const b=await renderSound(R[name]);const u=wav(b);let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s)};
window.RB_NAMES=Object.keys(R);