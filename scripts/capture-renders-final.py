"""
capture-renders-final.py
Capture proprement le preview de la montre yansmode pour chaque combinaison.
Screenshot UNIQUEMENT la zone canvas (montre seule).
"""
import asyncio, json, re
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("scripts/yans-captures/watch-previews")
OUT.mkdir(exist_ok=True)

# Zone du canvas watch preview (trouvee precedemment)
# x:492 y:270 w:888 h:535
CANVAS = {"x": 492, "y": 270, "width": 889, "height": 535}

async def screenshot_watch(page, name):
    """Screenshot juste la zone de la montre"""
    fname = OUT / f"{name}.png"
    await page.screenshot(
        path=str(fname),
        clip={"x": CANVAS["x"], "y": CANVAS["y"],
              "width": CANVAS["width"], "height": CANVAS["height"]}
    )
    return fname

async def click_and_wait(frame, selector_or_el, wait_ms=1500):
    try:
        if isinstance(selector_or_el, str):
            el = await frame.query_selector(selector_or_el)
        else:
            el = selector_or_el
        if el:
            await el.scroll_into_view_if_needed()
            await el.click()
            await frame.wait_for_timeout(wait_ms)
            return True
    except:
        pass
    return False

async def main():
    with open("scripts/yans-captures/initialData.json", encoding="utf-8") as f:
        data = json.load(f)

    prod = data["customizerProduct"]
    parts = prod.get("parts", [])

    # Reconstruit la liste des questions avec leurs answers
    questions_map = {}
    for part in parts:
        q = part.get("image", {})
        if isinstance(q, dict) and q.get("answers"):
            qname = q.get("name", "?")
            questions_map[q["id"]] = {
                "name": qname,
                "answers": q["answers"]
            }

    # Ordre de navigation logique
    model_questions = {
        "Nautilus":  ["QUESTION-7d2cg7", "QUESTION-7d2pvr", "QUESTION-7d33bb", "QUESTION-7d3qtj"],
        "Royal_Oak": ["QUESTION-0y8z6k", "QUESTION-0y85jw", "QUESTION-0y8izg", "QUESTION-0y8wf0"],
        "Daytona":   ["QUESTION-4nwwip", "QUESTION-4nxn01", "QUESTION-4nwtdd", "QUESTION-4nzmbl"],
        "Date_Just": ["QUESTION-68sibj", "QUESTION-68tcjj", "QUESTION-68u6rj", "QUESTION-68utvz"],
        "Day_Date":  ["QUESTION-687mdb", "QUESTION-6889hr", "QUESTION-686s5b", "QUESTION-687ci7"],
        "GMT":       ["QUESTION-68amgf", "QUESTION-68cunz", "QUESTION-68bxof", "QUESTION-68f0pb"],
    }
    model_answer_id = {
        "Nautilus":  "ANSWER-353djd",
        "Royal_Oak": "ANSWER-0y8vto",
        "Daytona":   "ANSWER-4nrr75",
        "Date_Just": "ANSWER-4o2869",
        "Day_Date":  "ANSWER-68612n",
        "GMT":       "ANSWER-68a5nz",
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        ctx = await browser.new_context(viewport={"width": 1400, "height": 900})
        page = await ctx.new_page()

        print("Chargement...")
        try:
            await page.goto("https://yansmode.com/pages/personnalisateur",
                          wait_until="domcontentloaded", timeout=30000)
        except:
            pass
        await page.wait_for_timeout(5000)

        kf_frame = None
        for fr in page.frames:
            if "gokickflip" in fr.url:
                kf_frame = fr
                break

        if not kf_frame:
            print("Iframe non trouve")
            await browser.close()
            return

        await page.wait_for_timeout(2000)

        total = 0
        for model_name, q_ids in model_questions.items():
            print(f"\n=== {model_name} ===")

            # Selectionne le modele
            model_ans = model_answer_id[model_name]

            # Cherche le bouton de selection du modele
            els = await kf_frame.query_selector_all('[class*="answer"], [class*="option"], button')
            clicked_model = False
            for el in els:
                txt = (await el.inner_text()).strip()
                model_clean = model_name.replace("_", " ")
                if txt == model_clean or model_clean in txt:
                    await el.scroll_into_view_if_needed()
                    await el.click()
                    await page.wait_for_timeout(2000)
                    clicked_model = True
                    break

            if not clicked_model:
                print(f"  SKIP: bouton modele non trouve pour {model_name}")
                continue

            # Capture l'etat par defaut du modele
            await screenshot_watch(page, f"{model_name}_defaut")
            print(f"  defaut -> {model_name}_defaut.png")
            total += 1

            # Pour chaque question (boitier, bracelet, cadran, aiguilles)
            for q_id in q_ids[:2]:  # Limite a boitier + cadran pour pas trop de captures
                if q_id not in questions_map:
                    continue
                q_info = questions_map[q_id]
                q_label = q_info["name"]
                answers = q_info["answers"]

                for answer in answers[:5]:  # Max 5 options par question
                    a_name = answer.get("name", "?")
                    safe = re.sub(r'[^\w\-]', '_', a_name)[:30]

                    # Cherche et clique l'option
                    all_els = await kf_frame.query_selector_all(
                        '[class*="answer"], [class*="option"], [class*="swatch"], button'
                    )
                    clicked = False
                    for el in all_els:
                        txt = (await el.inner_text()).strip()
                        if txt == a_name:
                            await el.scroll_into_view_if_needed()
                            await el.click()
                            await page.wait_for_timeout(1800)
                            clicked = True
                            break

                    if clicked:
                        fname = f"{model_name}_{q_label}_{safe}"
                        fname = re.sub(r'[^\w\-]', '_', fname)[:80]
                        await screenshot_watch(page, fname)
                        print(f"  [{q_label}] {a_name} -> {fname}.png")
                        total += 1

        await browser.close()

    print(f"\n{total} captures dans {OUT}")

asyncio.run(main())
