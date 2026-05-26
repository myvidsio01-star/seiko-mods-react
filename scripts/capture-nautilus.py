"""
Capture les renders Nautilus avec toutes les couleurs de boitier
"""
import asyncio, re
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("public/images/renders/nautilus")
OUT.mkdir(parents=True, exist_ok=True)

KF_URL = "https://a39ee3-ac.gokickflip.com/customize/startingpoint/696ce74878005b114cb4fd87?shopid=6728e5e52893ac57c24cb4ce&lang=fr&currency=EUR&rate=1.0"

CANVAS = {"x": 492, "y": 73, "width": 803, "height": 615}

async def capture(page, fname):
    await page.screenshot(path=str(OUT / fname), clip=CANVAS)
    print(f"  OK  {fname}")

async def click_text(page, text, wait=2500):
    """Cherche et clique un element par son texte exact"""
    for sel in ['button', '[role="button"]', 'span', 'div', 'li', 'label']:
        els = await page.query_selector_all(sel)
        for el in els:
            try:
                t = (await el.inner_text()).strip()
                if t == text:
                    bb = await el.bounding_box()
                    if bb and bb['width'] > 0:
                        await el.click(force=True)
                        await page.wait_for_timeout(wait)
                        return True
            except:
                pass
    print(f"  SKIP '{text}' non trouve")
    return False

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(viewport={"width": 1300, "height": 800})

        print("Chargement GoKickflip...")
        try:
            await page.goto(KF_URL, wait_until="domcontentloaded", timeout=30000)
        except:
            pass
        await page.wait_for_timeout(6000)

        # Assure qu'on est sur Nautilus
        await click_text(page, "Nautilus", wait=3000)

        # Boitier Argent (defaut)
        await click_text(page, "Argent", wait=2000)
        await capture(page, "boitier-acier.png")

        # Boitier Or Rose
        await click_text(page, "Or Rose", wait=2500)
        await capture(page, "boitier-or-rose.png")

        # Boitier Noir
        await click_text(page, "Noir", wait=2500)
        await capture(page, "boitier-black.png")

        # Remet Argent pour capturer les cadrans
        await click_text(page, "Argent", wait=2000)

        # Cadran Noir (defaut)
        await click_text(page, "Noir Index Argentés Ouvert", wait=2500)
        await capture(page, "cadran-noir.png")

        # Cadran Blanc
        await click_text(page, "Blanc Index Argentés Ouvert", wait=2500)
        await capture(page, "cadran-blanc.png")

        # Cadran Bleu
        await click_text(page, "Bleu Dégradé Index Argentés Ouvert", wait=2500)
        await capture(page, "cadran-bleu.png")

        # Cadran Vert
        await click_text(page, "Vert Dégradé Index Argentés Ouvert", wait=2500)
        await capture(page, "cadran-vert.png")

        await browser.close()
    print(f"\nTermine. Images dans {OUT}")

asyncio.run(main())
