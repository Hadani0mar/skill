import asyncio, base64
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        pg.on('pageerror', lambda e: print('ERR',e))
        await pg.goto('http://127.0.0.1:8777/__render/sounds.html'); await pg.wait_for_timeout(500)
        for n in await pg.evaluate('RB_NAMES'):
            open(f'public/sfx/{n}.wav','wb').write(base64.b64decode(await pg.evaluate(f'renderRB("{n}")')))
        await b.close()
asyncio.run(main())
