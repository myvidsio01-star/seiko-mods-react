"""
capture-direct.py
Acces direct au configurateur GoKickflip (sans Shopify).
Capture le preview watch pour chaque option.
"""
import asyncio, json, re
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("scripts/yans-captures/watch-previews")
OUT.mkdir(exist_ok=True)

KF_URL = "https://a39ee3-ac.gokickflip.com/customize/startingpoint/696ce74878005b114cb4fd87?shopid=6728e5e52893ac57c24cb4ce&lang=fr&currency=EUR&rate=1.0&priceAdjustmentValue=0.0&applyRounding=true&storeProductUrl=https%3A%2F%2Fyansmode.com%2Fproducts%2Fpersonnalisateur-outre-mer"

async def screenshot_watch(page, name):
    """Screenshot la zone watch (moitie gauche = preview)"""
    # GoKickflip: viewer a gauche, options a droite
    await page.screenshot(
        path=str(OUT / f"{name}.png"),
        clip={"x": 0, "y": 0, "width": 700, "height": 700}
    )

async def safe_click(page, el, wait_ms=2000):
    try:
        await el.scroll_into_view_if_needed()
        await el.click(force=True)
        await page.wait_for_timeout(wait_ms)
        return True
    except:
        pass
    return False

async def main():
    with open("scripts/yans-captures/initialData.json", encoding="utf-8") as f:
        data = json.load(f)

    prod = data["customizerProduct"]
    parts = prod.get("parts", [])

    # Reconstruit le mapping questions
    questions_map = {}
    for part in parts:
        q = part.get("image", {})
        if isinstance(q, dict) and q.get("answers"):
            questions_map[q["id"]] = {
                "name": q.get("name", "?"),
                "answers": q["answers"]
            }

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(
            viewport={"width": 1300, "height": 800}
        )

        # Intercepte images pour trouver les renders
        renders_seen = {}
        async def on_resp(r):
            u = r.url
            if "cdnv2.mycustomizer.com" in u and ("1536" in u or "800" in u):
                renders_seen[u] = True
        page.on("response", on_resp)

        print(f"Acces direct GoKickflip...")
        try:
            await page.goto(KF_URL, wait_until="domcontentloaded", timeout=30000)
        except:
            pass
        await page.wait_for_timeout(5000)

        # Screenshot initial pour voir la mise en page
        await page.screenshot(path=str(OUT / "_kickflip-layout.png"))
        print("Layout capture: _kickflip-layout.png")

        # Detecte la zone de preview
        # Cherche le canvas ou l'image principale
        preview_box = None
        for sel in ["canvas", ".viewer", ".preview", '[class*="viewer"]',
                    '[class*="preview"]', '[class*="canvas"]', "img.product"]:
            try:
                el = await page.query_selector(sel)
                if el:
                    box = await el.bounding_box()
                    if box and box["width"] > 200:
                        preview_box = box
                        print(f"Preview: {sel} {box}")
                        break
            except:
                pass

        total = 0

        # Selectionne chaque modele et capture le preview
        models = [
            ("Nautilus",  "ANSWER-353djd"),
            ("Royal Oak", "ANSWER-0y8vto"),
            ("Daytona",   "ANSWER-4nrr75"),
            ("Date Just", "ANSWER-4o2869"),
            ("Day Date",  "ANSWER-68612n"),
            ("GMT",       "ANSWER-68a5nz"),
        ]

        for model_name, model_ans_id in models:
            print(f"\n--- {model_name} ---")
            safe_model = model_name.replace(" ", "_")

            # Clique sur le modele
            els = await page.query_selector_all('button, [role="button"], [class*="answer"], [class*="label"]')
            for el in els:
                txt = (await el.inner_text()).strip()
                if txt == model_name:
                    ok = await safe_click(page, el)
                    if ok:
                        print(f"  Modele {model_name} selectionne")
                        break

            # Screenshot apres selection modele
            if preview_box:
                await page.screenshot(
                    path=str(OUT / f"{safe_model}_defaut.png"),
                    clip=preview_box
                )
            else:
                await screenshot_watch(page, f"{safe_model}_defaut")
            print(f"  Capture: {safe_model}_defaut.png")
            total += 1

            # Capture quelques options boitier
            boitier_questions = {
                "Nautilus":   "QUESTION-7d2cg7",
                "Royal Oak":  "QUESTION-0y8z6k",
                "Daytona":    "QUESTION-4nwwip",
                "Date Just":  "QUESTION-68sibj",
                "Day Date":   "QUESTION-687mdb",
                "GMT":        "QUESTION-68amgf",
            }
            cadran_questions = {
                "Nautilus":   "QUESTION-7d33bb",
                "Royal Oak":  "QUESTION-0y8izg",
                "Daytona":    "QUESTION-4nwtdd",
                "Date Just":  "QUESTION-68u6rj",
                "Day Date":   "QUESTION-686s5b",
                "GMT":        "QUESTION-68bxof",
            }

            for q_type, q_map in [("BOITIER", boitier_questions), ("CADRAN", cadran_questions)]:
                q_id = q_map.get(model_name)
                if not q_id or q_id not in questions_map:
                    continue
                q_info = questions_map[q_id]
                answers = q_info["answers"]

                for i, answer in enumerate(answers[:4]):
                    a_name = answer.get("name", "?")
                    safe_a = re.sub(r'[^\w]', '_', a_name)[:25]

                    # Cherche le bouton de cet answer
                    els = await page.query_selector_all(
                        'button, [role="button"], [class*="answer"], [class*="option"], span'
                    )
                    clicked = False
                    for el in els:
                        txt = (await el.inner_text()).strip()
                        if txt == a_name:
                            ok = await safe_click(page, el)
                            if ok:
                                clicked = True
                                break

                    if clicked:
                        fname = f"{safe_model}_{q_type}_{safe_a}"
                        if preview_box:
                            await page.screenshot(
                                path=str(OUT / f"{fname}.png"),
                                clip=preview_box
                            )
                        else:
                            await screenshot_watch(page, fname)
                        print(f"  [{q_type}] {a_name} -> {fname}.png")
                        total += 1

        await browser.close()

    print(f"\n{total} captures dans {OUT}")

asyncio.run(main())
