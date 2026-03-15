#!/usr/bin/env python3
"""
Hootling Brand Asset Organiser
================================
Renames, reorganises, resizes, and generates derived assets
from Adobe Firefly source images.

Run from any directory:
  python /c/Users/david/Projects/FairFare/public/organise_assets.py
"""

import os
import shutil
import struct
import io
from pathlib import Path
from PIL import Image, ImageDraw

BASE   = Path("C:/Users/david/Projects/FairFare/public")
SRC    = BASE / "images"
ICONS  = BASE / "icons"

# -- Brand colours ------------------------------------------------------------─
BG_COLOUR = (24, 24, 27)   # #18181b  app background

# -- Folder structure ----------------------------------------------------------
DIRS = [
    SRC / "cities",
    SRC / "mascot",
    SRC / "og",
    SRC / "brand",
    SRC / "_archive",
    SRC / "_archive" / "scenes-unidentified",
]

print("=" * 55)
print("  Hootling Asset Organiser")
print("=" * 55)

for d in DIRS:
    d.mkdir(parents=True, exist_ok=True)
print("\n[OK] Folder structure ready\n")

# -- Helper --------------------------------------------------------------------
all_png = list(SRC.glob("*.png"))
processed = set()

def find(keyword, files=None):
    src = files or all_png
    return [f for f in src if keyword in f.name and f.name not in processed]

def move(src_path, dest_dir, new_name):
    dest = dest_dir / new_name
    shutil.move(str(src_path), str(dest))
    processed.add(src_path.name)
    print(f"    [OK]  {new_name:<45}  ← {src_path.name[:50]}")
    return dest

def archive(f):
    dest = SRC / "_archive" / f.name
    shutil.move(str(f), str(dest))
    processed.add(f.name)

# ==============================================================================
# 1. CITY STICKERS
# ==============================================================================
print("-- City Stickers ------------------------------------─")

CITIES = {
    "Amsterdam Netherlands": "hootling-amsterdam.png",
    "Bangkok Thailand":      "hootling-bangkok.png",
    "Barcelona Spain":       "hootling-barcelona.png",
    "Dubai UAE":             "hootling-dubai.png",
    "Istanbul Turkey":       "hootling-istanbul.png",
    "London England":        "hootling-london.png",
    "Melbourne Australia":   "hootling-melbourne.png",
    "New York City":         "hootling-new-york.png",
    "Rome Italy":            "hootling-rome.png",
    "Singapore,":            "hootling-singapore.png",
    "Sydney Australia":      "hootling-sydney.png",
    "Tokyo Japan":           "hootling-tokyo.png",
}

for keyword, dest_name in CITIES.items():
    matches = find(keyword)
    if not matches:
        print(f"    [!!]  NOT FOUND: {keyword}")
        continue
    # Prefer file without Windows (1) suffix (original download)
    clean = [f for f in matches if " (1)" not in f.name and " (2)" not in f.name]
    pick  = clean[0] if clean else matches[0]
    move(pick, SRC / "cities", dest_name)
    for extra in matches:
        if extra != pick and extra.name not in processed:
            archive(extra)

# Paris: two versions — keep newer seed 513016 (updated/fixed sticker border)
paris_all = find("Paris France")
paris_new = [f for f in paris_all if "513016" in f.name]
paris_old = [f for f in paris_all if "513016" not in f.name]
if paris_new:
    move(paris_new[0], SRC / "cities", "hootling-paris.png")
elif paris_all:
    move(paris_all[0], SRC / "cities", "hootling-paris.png")
for f in paris_old:
    if f.name not in processed:
        archive(f)

# ==============================================================================
# 2. NAMED / IDENTIFIED ASSETS
# ==============================================================================
print("\n-- Named Assets --------------------------------------")

NAMED = {
    "regenerate replacing":             (SRC / "mascot", "hootling-app-screen.png"),
    "Make the owl look happier":        (SRC / "mascot", "hootling-character-happy.png"),
    "delete plane and map pin icons":   (SRC / "og",     "hootling-og-banner.png"),
    "RENDER THE ENTIRE IMAGE IN MONO":  (SRC / "brand",  "hootling-monochrome-sheet.png"),
    "delete THE TEXT":                  (SRC / "brand",  "hootling-character-sheet-white-bg.png"),
    "change front view only":           (SRC / "brand",  "hootling-character-sheet-corrected.png"),
}

for keyword, (dest_dir, dest_name) in NAMED.items():
    matches = find(keyword)
    if matches:
        move(matches[0], dest_dir, dest_name)
        for extra in matches[1:]:
            if extra.name not in processed:
                archive(extra)
    else:
        print(f"    [!!]  NOT FOUND: {keyword}")

# ==============================================================================
# 3. CHARACTER SHEETS (three-panel)
# ==============================================================================
print("\n-- Character Sheets --------------------------------─")

cs = find("Three-panel")
cs.sort(key=lambda f: f.stat().st_mtime, reverse=True)   # newest first
for i, f in enumerate(cs):
    name = "hootling-character-sheet.png" if i == 0 else f"hootling-character-sheet-v{i+1}.png"
    move(f, SRC / "brand", name)

# ==============================================================================
# 4. APP ICON CANDIDATE (1024×1024) > Favicons
# ==============================================================================
print("\n-- App Icon & Favicons ------------------------------─")

# Identify 1024×1024 source files from "Flat 2D illustration" set
flat_all = [f for f in all_png if "Flat 2D illustration" in f.name]
square_candidates = []
for f in flat_all:
    try:
        with Image.open(f) as im:
            if im.size == (1024, 1024):
                square_candidates.append(f)
    except Exception:
        pass

square_candidates.sort(key=lambda f: f.stat().st_mtime, reverse=True)  # newest first

if square_candidates:
    icon_src_path = square_candidates[0]
    print(f"    Source: {icon_src_path.name[:60]}")

    icon_src = Image.open(icon_src_path).convert("RGBA")

    favicon_sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512]

    # -- PNG favicons in public/icons/ --------------------------------------
    for size in favicon_sizes:
        resized = icon_src.resize((size, size), Image.LANCZOS)
        out_name = f"favicon-{size}x{size}.png"
        resized.save(str(ICONS / out_name), optimize=True)
        print(f"    [OK]  icons/{out_name}")

    # -- apple-touch-icon.png (180×180) in public/ ------------------------─
    apple = icon_src.resize((180, 180), Image.LANCZOS)
    apple.save(str(BASE / "apple-touch-icon.png"), optimize=True)
    print(f"    [OK]  apple-touch-icon.png  (180×180)")

    # -- PWA icons in public/ ----------------------------------------------─
    for size in [192, 512]:
        pwa = icon_src.resize((size, size), Image.LANCZOS)
        pwa.save(str(BASE / f"icon-{size}.png"), optimize=True)
        print(f"    [OK]  icon-{size}.png  ({size}×{size})")

    # -- Maskable PWA icons (icon on #18181b bg, 80% safe zone) ------------
    for size in [192, 512]:
        canvas = Image.new("RGBA", (size, size), BG_COLOUR + (255,))
        safe   = int(size * 0.80)
        pad    = (size - safe) // 2
        owl    = icon_src.resize((safe, safe), Image.LANCZOS)
        canvas.paste(owl, (pad, pad), owl)
        out = canvas.convert("RGB")
        out.save(str(BASE / f"icon-{size}-maskable.png"), optimize=True)
        print(f"    [OK]  icon-{size}-maskable.png  (maskable, safe-zone padded)")

    # -- favicon.ico (multi-size: 16 + 32 + 48) in public/ ----------------─
    ico_images = [
        icon_src.resize((16, 16),  Image.LANCZOS).convert("RGBA"),
        icon_src.resize((32, 32),  Image.LANCZOS).convert("RGBA"),
        icon_src.resize((48, 48),  Image.LANCZOS).convert("RGBA"),
    ]
    ico_images[0].save(
        str(BASE / "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=ico_images[1:],
    )
    print(f"    [OK]  favicon.ico  (16×16 + 32×32 + 48×48)")

    # Mark all square candidates as processed / archive non-primary ones
    for f in square_candidates:
        if f.name not in processed:
            archive(f)
else:
    print("    [!!]  No 1024×1024 source found for favicons — check _archive/scenes-unidentified/")

# ==============================================================================
# 5. OG BANNER RESIZE > 1200×630
# ==============================================================================
print("\n-- OG Banner Resize --------------------------------─")

og_src = SRC / "og" / "hootling-og-banner.png"
if og_src.exists():
    img = Image.open(og_src)
    tw, th = 1200, 630
    ratio  = max(tw / img.width, th / img.height)
    nw, nh = int(img.width * ratio), int(img.height * ratio)
    img    = img.resize((nw, nh), Image.LANCZOS)
    left   = (nw - tw) // 2
    top    = (nh - th) // 2
    img    = img.crop((left, top, left + tw, top + th))
    og_out = SRC / "og" / "hootling-og-1200x630.png"
    img.save(str(og_out), optimize=True)
    print(f"    [OK]  og/hootling-og-1200x630.png  (1200×630, OG/Twitter ready)")
else:
    print("    [!!]  OG banner not found — skipping")

# ==============================================================================
# 6. ARCHIVE REMAINING Flat 2D illustration files
# ==============================================================================
print("\n-- Archiving unidentified scene files --------------─")

remaining_flat = [f for f in all_png if "Flat 2D illustration" in f.name and f.name not in processed]
remaining_flat.sort()

for f in remaining_flat:
    dest = SRC / "_archive" / "scenes-unidentified" / f.name
    shutil.move(str(f), str(dest))
    processed.add(f.name)
    # Get dimensions for labelling
    try:
        with Image.open(dest) as im:
            w, h = im.size
        print(f"    >  _archive/scenes-unidentified/  [{w}×{h}]  {f.name[:55]}")
    except Exception:
        print(f"    >  _archive/scenes-unidentified/  {f.name[:60]}")

# ==============================================================================
# 7. FINAL SUMMARY
# ==============================================================================
print("\n-- Final file counts --------------------------------")
for folder in [SRC/"cities", SRC/"mascot", SRC/"og", SRC/"brand",
               SRC/"_archive", SRC/"_archive"/"scenes-unidentified"]:
    n = len(list(folder.glob("*.png")))
    print(f"    {str(folder.relative_to(BASE)):<40}  {n} file(s)")

# Remaining unprocessed at root
leftover = [f for f in SRC.glob("*.png") if f.name not in processed]
if leftover:
    print(f"\n    [!!]  {len(leftover)} file(s) still at images/ root:")
    for f in leftover:
        print(f"       {f.name[:70]}")

print("\n[OK] Done.\n")
print("NEXT STEPS:")
print("  1. Review _archive/scenes-unidentified/ — identify scenario images")
print("     (arriving in city, scam warning, taxi fare, tipping guide, onboarding)")
print("     and move/rename them to images/mascot/ manually.")
print("  2. Verify favicon.ico looks correct in browser.")
print("  3. Run: npm run dev and check /api/manifest for updated PWA icons.")
