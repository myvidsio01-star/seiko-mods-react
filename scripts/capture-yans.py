"""
capture-yans.py  —  Capture toutes les images du configurateur yansmode
Navigue dans le configurateur, clique chaque option et capture le preview
"""
import asyncio
import os
import re
import aiohttp
import aiofiles
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("scripts/yans-captures")
OUT.mkdir(exist_ok=True)

async def download(session, url, dest):
    try:
        async with session.get(url) as r:
            if r.status == 200:
                async with aiofiles.open(dest, 'wb') as f:
                    await f.write(await r.read())
                return True
    except:
        pass
    return False

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # visible pour debug
        ctx = await browser.new_context(
            viewport={"width": 1400, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
        )
        page = await ctx.new_page()

        # Collecte toutes les images chargees
        img_urls = set()
        async def on_resp(response):
            url = response.url
            if 'cdnv2.mycustomizer.com' in url and '.png' in url:
                img_urls.add(url)

        page.on("response", on_resp)

        print("Ouverture de yansmode...")
        try:
            await page.goto("https://yansmode.com/pages/personnalisateur",
                          wait_until="domcontentloaded", timeout=30000)
        except:
            print("Timeout domcontentloaded, on continue...")

        await page.wait_for_timeout(5000)

        # Screenshot de la page entiere pour voir l'etat
        await page.screenshot(path=str(OUT / "page-initiale.png"), full_page=True)
        print("Screenshot initial sauvegarde")

        # Cherche tous les boutons/options cliquables du configurateur
        # Le configurateur MyCustomizer a generalement des elements avec data-* attributes

        # Recupere le HTML pour analyser
        html = await page.content()
        with open(str(OUT / "page.html"), "w", encoding="utf-8") as f:
            f.write(html)

        # Cherche les images mycustomizer deja chargees
        mc_in_html = re.findall(r'cdnv2\.mycustomizer\.com[^"\'>\s]+', html)
        print(f"\n{len(mc_in_html)} URLs mycustomizer dans le HTML")
        for u in mc_in_html[:10]:
            print(f"  {u}")

        # Essaie de cliquer sur differentes options
        # D'abord trouve les elements cliquables dans le configurateur
        try:
            # Attends un selecteur qui pourrait etre le configurateur
            await page.wait_for_selector('[class*="customizer"], [class*="configurator"], [id*="customizer"], iframe', timeout=10000)
        except:
            print("Pas de selecteur customizer trouve")

        # Verifie si c'est dans un iframe
        frames = page.frames
        print(f"\n{len(frames)} frames sur la page")
        for fr in frames:
            print(f"  Frame: {fr.url}")

        # Cherche un iframe MyCustomizer
        mycustomizer_frame = None
        for fr in frames:
            if 'mycustomizer' in fr.url or 'customizer' in fr.url:
                mycustomizer_frame = fr
                print(f"Frame configurateur trouve: {fr.url}")
                break

        if mycustomizer_frame:
            # Recupere les elements de l'iframe
            frame_html = await mycustomizer_frame.content()
            with open(str(OUT / "frame.html"), "w", encoding="utf-8") as f:
                f.write(frame_html)

            # Cherche les images dans l'iframe
            mc_in_frame = re.findall(r'cdnv2\.mycustomizer\.com[^"\'>\s]+', frame_html)
            print(f"{len(mc_in_frame)} URLs dans le frame")

        # Attend plus d'images via reseau
        await page.wait_for_timeout(5000)

        print(f"\n{len(img_urls)} images mycustomizer interceptees au total:")
        for u in sorted(img_urls)[:20]:
            print(f"  {u}")

        # Sauvegarde la liste complete
        with open(str(OUT / "urls.txt"), "w") as f:
            for u in sorted(img_urls):
                f.write(u + "\n")

        await browser.close()

        # Telecharge toutes les images
        if img_urls:
            print(f"\nTelechargement de {len(img_urls)} images...")
            connector = aiohttp.TCPConnector(limit=5)
            async with aiohttp.ClientSession(connector=connector) as session:
                for url in sorted(img_urls):
                    name = url.split('/')[-1].split('?')[0]
                    size = url.split('/')[-2] if '/' in url else 'img'
                    dest = OUT / f"{size}_{name}"
                    ok = await download(session, url, dest)
                    print(f"  {'OK' if ok else 'ERR'}  {dest.name}")

asyncio.run(main())
