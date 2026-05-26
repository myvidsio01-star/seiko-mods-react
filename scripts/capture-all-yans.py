"""
capture-all-yans.py  —  Navigue dans le configurateur GoKickflip de yansmode
et capture toutes les images possibles en cliquant sur chaque option
"""
import asyncio
import json
import re
import aiohttp
import aiofiles
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("scripts/yans-captures")
OUT.mkdir(exist_ok=True)

async def download_img(session, url, dest):
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as r:
            if r.status == 200:
                async with aiofiles.open(dest, 'wb') as f:
                    await f.write(await r.read())
                return True
    except:
        pass
    return False

async def main():
    all_imgs = set()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        ctx = await browser.new_context(
            viewport={"width": 1400, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = await ctx.new_page()

        # Intercepte les images
        async def on_resp(r):
            u = r.url
            if 'cdnv2.mycustomizer.com' in u or 'mycustomizer' in u:
                all_imgs.add(u)
        page.on("response", on_resp)

        print("Chargement du configurateur...")
        try:
            await page.goto("https://yansmode.com/pages/personnalisateur",
                           wait_until="domcontentloaded", timeout=30000)
        except:
            pass
        await page.wait_for_timeout(6000)

        # Trouve l'iframe GoKickflip
        kickflip_frame = None
        for fr in page.frames:
            if 'gokickflip' in fr.url or 'kickflip' in fr.url:
                kickflip_frame = fr
                print(f"Frame Kickflip: {fr.url[:80]}")
                break

        if not kickflip_frame:
            print("Frame kickflip non trouvee, essai direct...")
            # Essaie d'acceder directement
            kf_url = "https://a39ee3-ac.gokickflip.com/customize/startingpoint/696ce74878005b114cb4fd87"
            try:
                await page.goto(kf_url, wait_until="domcontentloaded", timeout=20000)
            except:
                pass
            await page.wait_for_timeout(4000)
            kickflip_frame = page.main_frame

        # Recupere le HTML du frame
        try:
            frame_html = await kickflip_frame.content()
            with open(str(OUT / "kickflip-frame.html"), "w", encoding="utf-8") as f:
                f.write(frame_html)
            print(f"HTML du frame: {len(frame_html)} chars")

            # Trouve toutes les images dans le HTML
            img_in_html = re.findall(r'https?://cdnv2\.mycustomizer\.com/[^\s"\']+', frame_html)
            for u in img_in_html:
                all_imgs.add(u.rstrip('.,;'))
            print(f"{len(img_in_html)} images dans le HTML du frame")
        except Exception as e:
            print(f"Erreur HTML frame: {e}")

        # Cherche et clique sur tous les boutons d'options
        try:
            # Attend que les options se chargent
            await kickflip_frame.wait_for_selector('[class*="option"], [class*="part"], [class*="choice"], button, [role="button"]', timeout=8000)

            # Recupere tous les elements cliquables
            buttons = await kickflip_frame.query_selector_all('[class*="option"], [class*="thumb"], [class*="choice"]')
            print(f"{len(buttons)} boutons d'options trouves")

            for i, btn in enumerate(buttons[:50]):  # max 50 pour ne pas boucler
                try:
                    await btn.click()
                    await page.wait_for_timeout(800)
                except:
                    pass

        except Exception as e:
            print(f"Erreur interaction: {e}")

        # Screenshot final
        await page.screenshot(path=str(OUT / "configurateur.png"), full_page=True)

        # Attend encore pour capturer plus d'images
        await page.wait_for_timeout(3000)

        print(f"\n{len(all_imgs)} images interceptees au total")

        # Telecharge toutes les images en haute resolution
        connector = aiohttp.TCPConnector(limit=8)
        async with aiohttp.ClientSession(connector=connector) as session:
            # Priorite aux grandes images
            large = [u for u in all_imgs if '1536' in u or '800' in u or '600' in u]
            medium = [u for u in all_imgs if '200x200' in u]
            small = [u for u in all_imgs if '20x20' in u]

            print(f"  {len(large)} grandes, {len(medium)} moyennes, {len(small)} petites")

            for url in sorted(large + medium):
                size = url.split('/')[-2]
                name = url.split('/')[-1].split('?')[0]
                dest = OUT / f"{size}_{name}"
                if not dest.exists():
                    ok = await download_img(session, url, dest)
                    print(f"  {'OK' if ok else 'ERR'}  {dest.name}")

        await browser.close()

    # Sauvegarde la liste
    with open(str(OUT / "all-urls.json"), "w") as f:
        json.dump(sorted(all_imgs), f, indent=2)
    print(f"\nTermine. {len(all_imgs)} images totales.")

asyncio.run(main())
