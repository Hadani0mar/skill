import sys, asyncio
from playwright.async_api import async_playwright
frames=[int(x) for x in sys.argv[1].split(',')]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1080,'height':1920})
        pg.on('console', lambda m: print('LOG',m.type,m.text[:300]) if m.type in ('error',) else None)
        pg.on('pageerror', lambda e: print('PAGEERR',str(e)[:500]))
        await pg.goto('http://127.0.0.1:8767/__render/index.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate('document.fonts.ready')
        for f in frames:
            await pg.evaluate(f'seek({f})'); await pg.wait_for_timeout(120)
            await pg.screenshot(path=f'out/still_{f:04d}.png')
        await b.close()
asyncio.run(main())
