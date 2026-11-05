// usage: node render_film.cjs <outDir> <scale> <fps> <workers> [t1 t2 ...]  (times => stills; none => full film)
const {chromium}=require('playwright'); const fs=require('fs'), path=require('path');
const [out,scale,fps,workers,...times]=process.argv.slice(2);
(async()=>{
  fs.mkdirSync(out,{recursive:true}); const b=await chromium.launch();
  const sc=+scale, FPS=+fps, N=+workers, END=64.0;
  const frames=times.length?times.map(Number):Array.from({length:Math.round(END*FPS)},(_,i)=>i/FPS);
  const names=times.length?times.map(t=>'t'+(+t).toFixed(2)+'.jpg'):frames.map((_,i)=>'f'+String(i).padStart(5,'0')+'.jpg');
  async function work(k){
    const pg=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:sc});
    await pg.goto('file://'+path.join(__dirname,'film.html')); await pg.evaluate(()=>document.fonts.ready);
    await pg.waitForFunction(()=>[...document.images].every(i=>!i.src||i.complete),{timeout:20000}).catch(()=>{});
    for(let i=k;i<frames.length;i+=N){
      await pg.evaluate(t=>setT(t),frames[i]);
      await pg.screenshot({path:path.join(out,names[i]),type:'jpeg',quality:90});
      if(!times.length&&i%240===k) console.log('frame',i,'/',frames.length);
    }
    await pg.close();
  }
  await Promise.all(Array.from({length:N},(_,k)=>work(k))); await b.close(); console.log('done');
})();
