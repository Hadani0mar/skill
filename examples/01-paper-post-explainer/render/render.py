import asyncio, os, sys, time
from playwright.async_api import async_playwright
TOTAL=2100; WORKERS=int(sys.argv[1]) if len(sys.argv)>1 else 4
os.makedirs('out/frames',exist_ok=True)
async def worker(b, idx):
    pg=await b.new_page(viewport={'width':1080,'height':1920})
    pg.on('pageerror', lambda e: print('PAGEERR',str(e)[:300]))
    await pg.goto('http://127.0.0.1:8765/__render/index.html'); await pg.wait_for_timeout(1500)
    await pg.evaluate('document.fonts.ready')
    for f in range(idx, TOTAL, WORKERS):
        await pg.evaluate(f'seek({f})')
        await pg.screenshot(path=f'out/frames/f{f:05d}.jpg', type='jpeg', quality=93)
        if f % 300 == idx: print('frame',f,flush=True)
async def main():
    t=time.time()
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--disable-gpu'])
        await asyncio.gather(*[worker(b,i) for i in range(WORKERS)])
        await b.close()
    print('done',round(time.time()-t),'s')
asyncio.run(main())
