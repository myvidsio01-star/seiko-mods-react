"""
screenshot-configurateur.py
Navigue dans le configurateur GoKickflip de yansmode et capture
le preview de la montre pour chaque option selectionnee.
"""
import asyncio, json, re
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("scripts/yans-captures/renders")
OUT.mkdir(exist_ok=True)

# Selectionne un answer dans l'iframe GoKickflip
async def click_answer(frame, answer_id):
    try:
        el = await frame.query_selector(f'[data-answer-id="{answer_id}"], [data-id="{answer_id}"]')
        if el:
            await el.click()
            return True
        # Cherche par d'autres methodes
        els = await frame.query_selector_all('button, [role="button"], [class*="answer"], [class*="option"]')
        for e in els:
            aid = await e.get_attribute('data-answer-id') or await e.get_attribute('data-id') or ''
            if answer_id in aid:
                await e.click()
                return True
    except:
        pass
    return False

async def main():
    with open("scripts/yans-captures/initialData.json", encoding="utf-8") as f:
        data = json.load(f)

    prod = data["customizerProduct"]
    questions = prod.get("questions", [])
    # Regroupe par ID
    q_by_id = {q["id"]: q for q in questions}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        ctx = await browser.new_context(viewport={"width": 1400, "height": 900})
        page = await ctx.new_page()

        print("Chargement du configurateur...")
        try:
            await page.goto("https://yansmode.com/pages/personnalisateur",
                          wait_until="domcontentloaded", timeout=30000)
        except:
            pass
        await page.wait_for_timeout(6000)

        # Trouve l'iframe GoKickflip
        kf_frame = None
        for fr in page.frames:
            if "gokickflip" in fr.url or "kickflip" in fr.url:
                kf_frame = fr
                break

        if not kf_frame:
            print("Iframe kickflip non trouve!")
            await browser.close()
            return

        print(f"Frame trouve: {kf_frame.url[:60]}")
        await kf_frame.wait_for_load_state("domcontentloaded")
        await page.wait_for_timeout(3000)

        # Screenshot initial pour trouver la zone de preview
        await page.screenshot(path=str(OUT / "_page-initiale.png"))

        # Trouve la zone preview dans l'iframe
        # GoKickflip a generalement un element .viewer ou .preview
        preview_sel = None
        for sel in ['[class*="viewer"]', '[class*="preview"]', '[class*="canvas"]',
                    'canvas', '.kickflip-viewer', '#viewer', '.product-viewer']:
            try:
                el = await kf_frame.query_selector(sel)
                if el:
                    preview_sel = sel
                    box = await el.bounding_box()
                    print(f"Zone preview trouvee: {sel} @ {box}")
                    break
            except:
                pass

        # Si pas trouve dans iframe, cherche dans la page principale
        if not preview_sel:
            for sel in ['[class*="viewer"]', '[class*="preview"]', 'canvas', 'iframe']:
                try:
                    el = await page.query_selector(sel)
                    if el:
                        box = await el.bounding_box()
                        print(f"Zone preview dans page: {sel} @ {box}")
                        break
                except:
                    pass

        # Prend une screenshot complete du frame
        await kf_frame.wait_for_timeout(2000)

        # Essaie de trouver et cliquer les options
        # D'abord recupere tous les elements cliquables
        clickables = await kf_frame.query_selector_all(
            '[class*="answer"], [class*="option"], [class*="choice"], [class*="swatch"], [class*="thumb"]'
        )
        print(f"\n{len(clickables)} elements cliquables trouves")

        if clickables:
            # Screenshot pour chaque click
            seen = set()
            for i, el in enumerate(clickables[:80]):
                try:
                    cls = await el.get_attribute("class") or ""
                    aid = (await el.get_attribute("data-answer-id") or
                           await el.get_attribute("data-id") or
                           await el.get_attribute("id") or f"el-{i}")

                    if aid in seen:
                        continue
                    seen.add(aid)

                    # Recupere le texte ou le titre
                    txt = (await el.inner_text()).strip()[:30] or aid[:20]
                    safe_txt = re.sub(r'[^\w\s-]', '', txt).strip().replace(' ', '_')

                    await el.scroll_into_view_if_needed()
                    await el.click()
                    await page.wait_for_timeout(1200)

                    # Screenshot de la zone viewer
                    fname = f"{i:03d}_{safe_txt}.png"
                    await page.screenshot(path=str(OUT / fname))
                    print(f"  {i:3d}. {txt:30s} -> {fname}")

                except Exception as e:
                    pass

        await browser.close()
    print(f"\nTermine. Captures dans {OUT}")

asyncio.run(main())
