#!/usr/bin/env python3
"""
Hootling Asset Fix Pass
========================
1. Move logo/brand files from icons/ -> images/brand/
2. Regenerate ALL favicons from correct hootling-app-icon.png source
3. Delete incorrectly sourced social-media-icon-*.png files
4. Move identified scene files from _archive to images/mascot/
5. Move social-banner to og/, fix cities/ typos and white-bg variants
"""

import os
import shutil
from pathlib import Path
from PIL import Image

BASE   = Path("C:/Users/david/Projects/FairFare/public")
SRC    = BASE / "images"
ICONS  = BASE / "icons"
BG     = (24, 24, 27)   # #18181b

print("=" * 55)
print("  Hootling Asset Fix Pass")
print("=" * 55)

# ──────────────────────────────────────────────────────────────────────────────
# 1. MOVE BRAND/LOGO FILES  icons/ -> images/brand/
# ──────────────────────────────────────────────────────────────────────────────
print("\n[1] Moving logo files from icons/ to images/brand/")

logo_moves = {
    # source in icons/                                              : dest name in brand/
    "hootling-icon.png":                                            "hootling-logo-icon.png",
    "hootling-icon-wordmark.png":                                   "hootling-logo-wordmark.png",
    "hootling-icon-wordmark-transparent-background.png":            "hootling-logo-wordmark-transparent.png",
    "hootling-wordmark-gradient-finish-Seconda-Round-Medium-font.png": "hootling-logo-wordmark-gradient.png",
}

for src_name, dest_name in logo_moves.items():
    src  = ICONS / src_name
    dest = SRC / "brand" / dest_name
    if src.exists():
        shutil.move(str(src), str(dest))
        print(f"    [OK]  brand/{dest_name}")
    else:
        print(f"    [!!]  NOT FOUND: icons/{src_name}")

# ──────────────────────────────────────────────────────────────────────────────
# 2. REGENERATE ALL FAVICONS from hootling-app-icon.png (correct 1024x1024)
# ──────────────────────────────────────────────────────────────────────────────
print("\n[2] Regenerating favicons from hootling-app-icon.png")

icon_src_path = BASE / "hootling-app-icon.png"
if not icon_src_path.exists():
    print("    [!!]  hootling-app-icon.png NOT FOUND at public root — aborting favicon gen")
else:
    icon = Image.open(icon_src_path).convert("RGBA")
    print(f"    Source: {icon.size[0]}x{icon.size[1]}  {icon.mode}")

    # -- favicon.ico (multi-size 16+32+48) ------------------------------------
    sizes_ico = [16, 32, 48]
    ico_imgs  = [icon.resize((s, s), Image.LANCZOS) for s in sizes_ico]
    ico_imgs[0].save(
        str(BASE / "favicon.ico"),
        format="ICO",
        sizes=[(s, s) for s in sizes_ico],
        append_images=ico_imgs[1:],
    )
    print("    [OK]  favicon.ico  (16+32+48 multi-size)")

    # -- apple-touch-icon.png (180x180) at public root ------------------------
    icon.resize((180, 180), Image.LANCZOS).save(str(BASE / "apple-touch-icon.png"), optimize=True)
    print("    [OK]  apple-touch-icon.png  (180x180)")

    # -- PWA icons at public root ---------------------------------------------
    for size in [192, 512]:
        icon.resize((size, size), Image.LANCZOS).save(
            str(BASE / f"icon-{size}.png"), optimize=True
        )
        print(f"    [OK]  icon-{size}.png")

    # -- PWA maskable icons (owl on #18181b, 80% safe zone) -------------------
    for size in [192, 512]:
        canvas = Image.new("RGBA", (size, size), BG + (255,))
        safe   = int(size * 0.80)
        pad    = (size - safe) // 2
        owl    = icon.resize((safe, safe), Image.LANCZOS)
        canvas.paste(owl, (pad, pad), owl)
        canvas.convert("RGB").save(str(BASE / f"icon-{size}-maskable.png"), optimize=True)
        print(f"    [OK]  icon-{size}-maskable.png  (maskable)")

    # -- PNG favicons in icons/ (all sizes) -----------------------------------
    for size in [16, 32, 48, 64, 128, 180, 192, 256, 512]:
        out = ICONS / f"favicon-{size}x{size}.png"
        icon.resize((size, size), Image.LANCZOS).save(str(out), optimize=True)
        print(f"    [OK]  icons/favicon-{size}x{size}.png")

# ──────────────────────────────────────────────────────────────────────────────
# 3. DELETE incorrectly-sourced social-media-icon-*.png files
# ──────────────────────────────────────────────────────────────────────────────
print("\n[3] Removing incorrectly sourced icon files")

stale = [
    "social-media-icon.png",
    "social-media-icon-192.png",
    "social-media-icon-512.png",
    "social-media-icon-192-maskable.png",
    "social-media-icon-512-maskable.png",
]
for name in stale:
    f = BASE / name
    if f.exists():
        f.unlink()
        print(f"    [DEL] {name}")

# ──────────────────────────────────────────────────────────────────────────────
# 4. MOVE IDENTIFIED SCENE FILES  _archive/scenes-unidentified/ -> images/mascot/
# ──────────────────────────────────────────────────────────────────────────────
print("\n[4] Moving identified scenes from archive to images/mascot/")

archive_scenes = SRC / "_archive" / "scenes-unidentified"
mascot_dir     = SRC / "mascot"
brand_dir      = SRC / "brand"

scene_moves = {
    "hootling-scene-arriving.png":      mascot_dir,
    "hootling-scene-scam-warning.png":  mascot_dir,
    "hootling-scene-taxi-fare.png":     mascot_dir,
    "hootling-taxi-hailing-hero.png":   mascot_dir,
    "hootling-tipping-guide-hero.png":  mascot_dir,
    "hootling-expression-sheet.png":    brand_dir,
    "hootling-arriving.png":            mascot_dir,  # duplicate rename — archive sub-version
}

for fname, dest_dir in scene_moves.items():
    src = archive_scenes / fname
    if src.exists():
        dest = dest_dir / fname
        # Handle duplicate: if both hootling-arriving and hootling-scene-arriving exist
        if fname == "hootling-arriving.png" and (mascot_dir / "hootling-scene-arriving.png").exists():
            # Already have scene-arriving, rename this one to -alt
            dest = mascot_dir / "hootling-scene-arriving-alt.png"
        shutil.move(str(src), str(dest))
        print(f"    [OK]  {dest.parent.name}/{dest.name}")
    else:
        print(f"    [--]  not found (may already be moved): {fname}")

# ──────────────────────────────────────────────────────────────────────────────
# 5. MOVE hootling-social-banner.png -> images/og/
# ──────────────────────────────────────────────────────────────────────────────
print("\n[5] Moving social banner to og/")

social_src = SRC / "hootling-social-banner.png"
if social_src.exists():
    with Image.open(social_src) as im:
        w, h = im.size
    # 1024x1024 = square Instagram format
    dest_name = "hootling-og-square.png" if w == h else "hootling-social-banner.png"
    shutil.move(str(social_src), str(SRC / "og" / dest_name))
    print(f"    [OK]  og/{dest_name}  ({w}x{h})")

# ──────────────────────────────────────────────────────────────────────────────
# 6. FIX CITIES typos + organise white-bg variants
# ──────────────────────────────────────────────────────────────────────────────
print("\n[6] Fixing cities/ names and organising variants")

cities_dir = SRC / "cities"
(cities_dir / "variants").mkdir(exist_ok=True)

city_fixes = {
    # typo fix
    "hootling-bankgkok.png": cities_dir / "variants" / "hootling-bangkok-v2.png",
    # white-bg variants -> cities/variants/
    "hootling-bangkok-white-background.png":   cities_dir / "variants" / "hootling-bangkok-white-bg.png",
    "hootling-dubai-white-background.png":     cities_dir / "variants" / "hootling-dubai-white-bg.png",
    "hootling-london-white-background.png":    cities_dir / "variants" / "hootling-london-white-bg.png",
    "hootling-new-york-white-background.png":  cities_dir / "variants" / "hootling-new-york-white-bg.png",
    "hootling-paris-white-background.png":     cities_dir / "variants" / "hootling-paris-white-bg.png",
    "hootling-tokyo-white-background.png":     cities_dir / "variants" / "hootling-tokyo-white-bg.png",
    # backup -> archive
    "hootling-bangkok-backup.png":             SRC / "_archive" / "hootling-bangkok-backup.png",
    "hootling-paris-backup.png":               SRC / "_archive" / "hootling-paris-backup.png",
}

for fname, dest_path in city_fixes.items():
    src = cities_dir / fname
    if src.exists():
        shutil.move(str(src), str(dest_path))
        rel = str(dest_path.relative_to(SRC))
        print(f"    [OK]  {rel}")
    else:
        print(f"    [--]  not found: {fname}")

# ──────────────────────────────────────────────────────────────────────────────
# 7. ALSO MOVE hootling-app-icon.png to images/brand/ (keep a copy at root)
#    The public root needs icon-192.png / icon-512.png for PWA
#    The brand copy is the source master
# ──────────────────────────────────────────────────────────────────────────────
print("\n[7] Copying app icon to brand/ as master")

app_icon_src = BASE / "hootling-app-icon.png"
if app_icon_src.exists():
    shutil.copy2(str(app_icon_src), str(SRC / "brand" / "hootling-app-icon-master.png"))
    print("    [OK]  brand/hootling-app-icon-master.png  (source master, 1024x1024)")

# ──────────────────────────────────────────────────────────────────────────────
# 8. FINAL SUMMARY
# ──────────────────────────────────────────────────────────────────────────────
print("\n" + "=" * 55)
print("  Final file counts")
print("=" * 55)

check_dirs = [
    BASE,
    SRC / "cities",
    SRC / "cities" / "variants",
    SRC / "mascot",
    SRC / "og",
    SRC / "brand",
    SRC / "_archive",
    SRC / "_archive" / "scenes-unidentified",
    ICONS,
]
for d in check_dirs:
    pngs = list(d.glob("*.png"))
    icos = list(d.glob("*.ico"))
    total = len(pngs) + len(icos)
    if total > 0 or d in [BASE, SRC / "mascot", SRC / "og"]:
        label = str(d.relative_to(BASE.parent.parent)) if d != BASE else "public/"
        print(f"  {str(d.relative_to(BASE)):<45} {total} file(s)")

print("\n[OK] All done.\n")
print("NOTE: Favicon source was hootling-app-icon.png (1024x1024)")
print("      All icon-*.png and favicon.ico at public root regenerated.")
print("      Seconda Round Medium font noted — no code action needed (display only).")
