"""
scrape-yans.py  —  Capture les URLs de toutes les images de pieces sur yansmode.com
"""
import asyncio
import json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Intercepte toutes les requetes images
        images = []
        def on_response(response):
            url = response.url
            if any(ext in url.lower() for ext in ['.png', '.jpg', '.jpeg', '.webp']):
                if response.status == 200:
                    images.append(url)

        page.on("response", on_response)

        print("Chargement de yansmode.com/pages/personnalisateur ...")
        await page.goto("https://yansmode.com/pages/personnalisateur", wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_timeout(8000)  # attendre que le JS charge les images

        # Screenshot pour voir ce qu'on a
        await page.screenshot(path="scripts/yans-screenshot.png", full_page=True)

        # Recupere aussi toutes les src d'images dans le DOM
        dom_imgs = await page.eval_on_selector_all("img", "els => els.map(e => e.src)")

        print(f"\n{len(images)} images interceptees via reseau")
        print(f"{len(dom_imgs)} images dans le DOM\n")

        all_imgs = list(set(images + dom_imgs))

        # Filtre les images qui ressemblent a des pieces de montre
        watch_imgs = [u for u in all_imgs if any(k in u.lower() for k in [
            'boitier', 'cadran', 'aiguille', 'bracelet', 'case', 'dial', 'hand',
            'strap', 'watch', 'piece', 'configurateur', 'personnalisateur'
        ])]

        print("=== IMAGES DE PIECES (filtrees) ===")
        for u in sorted(watch_imgs):
            print(u)

        print("\n=== TOUTES LES IMAGES ===")
        for u in sorted(all_imgs):
            print(u)

        with open("scripts/yans-images.json", "w") as f:
            json.dump({"watch": watch_imgs, "all": all_imgs}, f, indent=2)

        await browser.close()

asyncio.run(main())
