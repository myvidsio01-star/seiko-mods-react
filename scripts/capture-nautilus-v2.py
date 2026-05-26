"""
capture-nautilus-v2.py
Utilise les data-answer-id pour cliquer les bonnes options
"""
import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("public/images/renders/nautilus")
OUT.mkdir(parents=True, exist_ok=True)

KF_URL = "https://a39ee3-ac.gokickflip.com/customize/startingpoint/696ce74878005b114cb4fd87?shopid=6728e5e52893ac57c24cb4ce&lang=fr&currency=EUR&rate=1.0"
CANVAS = {"x": 492, "y": 73, "width": 803, "height": 615}

# IDs des answers pour Nautilus (depuis initialData.json)
NAUTILUS_MODEL   = "ANSWER-353djd"   # TYPE DE MONTRE = Nautilus

# Boitiers Nautilus (QUESTION-7d2cg7)
BOITIER_ARGENT   = "ANSWER-7d2ft3"
BOITIER_OR_ROSE  = "ANSWER-3ww9yr"
BOITIER_NOIR     = "ANSWER-1rruex"

# Cadrans Nautilus (QUESTION-7d33bb) - quelques exemples
CADRAN_NOIR      = "ANSWER-3ww60j"   # Noir Index Argentés Ouvert
CADRAN_BLANC     = "ANSWER-3wwcqb"   # Blanc Index Argentés Ouvert
CADRAN_BLEU      = "ANSWER-3wuvlf"   # Bleu Dégradé Index Argentés Ouvert
CADRAN_VERT      = "ANSWER-3wuyyb"   # Vert Dégradé Index Argentés Ouvert
CADRAN_CARAMEL   = "ANSWER-3wwg37"   # Caramel
CADRAN_TIFFANY   = "ANSWER-3ww9df"   # Tyffany

async def click_answer_id(page, answer_id, wait=2500):
    """Clique par data-answer-id ou par id dans le HTML JS"""
    # Essaie plusieurs selecteurs
    selectors = [
        f'[data-answer-id="{answer_id}"]',
        f'[data-id="{answer_id}"]',
        f'[id="{answer_id}"]',
        f'[value="{answer_id}"]',
    ]
    for sel in selectors:
        try:
            el = await page.query_selector(sel)
            if el:
                bb = await el.bounding_box()
                if bb:
                    await el.click(force=True)
                    await page.wait_for_timeout(wait)
                    print(f"  click {answer_id} via {sel}")
                    return True
        except:
            pass

    # Cherche dans le JS state (GoKickflip expose une API window.kickflip)
    try:
        result = await page.evaluate(f"""
            () => {{
                // Essaie l'API kickflip
                if (window.kickflip) {{
                    window.kickflip.selectAnswer('{answer_id}');
                    return 'kickflip-api';
                }}
                // Cherche dans le DOM
                const els = document.querySelectorAll('[class*="answer"], [class*="option"], button, input');
                for (const el of els) {{
                    const id = el.dataset.answerId || el.dataset.id || el.id || el.value;
                    if (id === '{answer_id}') {{
                        el.click();
                        return 'dom-click';
                    }}
                }}
                return null;
            }}
        """)
        if result:
            await page.wait_for_timeout(wait)
            print(f"  click {answer_id} via JS ({result})")
            return True
    except:
        pass

    print(f"  SKIP {answer_id}")
    return False

async def capture(page, fname):
    await page.screenshot(path=str(OUT / fname), clip=CANVAS)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(viewport={"width": 1300, "height": 800})

        print("Chargement...")
        try:
            await page.goto(KF_URL, wait_until="domcontentloaded", timeout=30000)
        except:
            pass
        await page.wait_for_timeout(6000)

        # Selectionne Nautilus
        await click_answer_id(page, NAUTILUS_MODEL, wait=3000)
        print("Nautilus selectionne")

        print("\n-- Boitiers --")
        for ans_id, fname in [
            (BOITIER_ARGENT,  "boitier-acier.png"),
            (BOITIER_OR_ROSE, "boitier-or-rose.png"),
            (BOITIER_NOIR,    "boitier-black.png"),
        ]:
            await click_answer_id(page, ans_id)
            await capture(page, fname)
            print(f"  {fname}")

        # Remet argent pour cadrans
        await click_answer_id(page, BOITIER_ARGENT, wait=1500)

        print("\n-- Cadrans --")
        for ans_id, fname in [
            (CADRAN_NOIR,    "cadran-noir.png"),
            (CADRAN_BLANC,   "cadran-blanc.png"),
            (CADRAN_BLEU,    "cadran-bleu.png"),
            (CADRAN_VERT,    "cadran-vert.png"),
            (CADRAN_CARAMEL, "cadran-caramel.png"),
            (CADRAN_TIFFANY, "cadran-tiffany.png"),
        ]:
            await click_answer_id(page, ans_id)
            await capture(page, fname)
            print(f"  {fname}")

        await browser.close()
    print("\nTermine")

asyncio.run(main())
