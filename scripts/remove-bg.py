"""
remove-bg.py  —  Suppression automatique du fond sur toutes les images de layers
Utilise rembg (IA) pour découper la montre du fond blanc/gris.
"""
import os
import sys
from pathlib import Path
from rembg import remove
from PIL import Image

LAYERS = Path("public/images/layers")

exts = {".png", ".jpg", ".jpeg", ".webp"}
files = sorted(LAYERS.rglob("*.png"))

print(f"[rembg] Suppression de fond sur {len(files)} images...\n")

ok = 0
err = 0
for fp in files:
    rel = fp.relative_to(LAYERS)
    try:
        inp = Image.open(fp).convert("RGBA")
        out = remove(inp)
        out.save(fp, "PNG")
        print(f"  OK  {rel}")
        ok += 1
    except Exception as e:
        print(f"  ERR {rel}  ({e})", file=sys.stderr)
        err += 1

print(f"\n{ok} traites  |  {err} erreurs")
