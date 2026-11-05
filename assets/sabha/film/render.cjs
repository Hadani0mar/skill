const {chromium}=require('playwright'); const fs=require('fs'), path=require('path');
(async()=>{
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  const dir=path.join(__dirname,'scenes'), out=path.join(__dirname,'..','storyboard'); fs.mkdirSync(out,{recursive:true});
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.html')).sort()){
    await pg.goto('file://'+path.join(dir,f)); await pg.evaluate(()=>document.fonts.ready);
    await pg.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0),{timeout:15000}).catch(e=>console.log('img wait',f));
    const fonts=await pg.evaluate(()=>[document.fonts.check('800 40px Kufam'),document.fonts.check('400 40px Alexandria')]);
    await pg.screenshot({path:path.join(out,f.replace('.html','.png'))}); console.log(f,fonts);
  }
  await b.close();
})();
