#!/usr/bin/env python3
"""
Build a browser-friendly SVG-in-OT font from bitmap PNGs.

Steps:
1) Load the source TTF.
2) Add empty glyf/loca outlines (required by browser sanitizers).
3) Embed each PNG as an <image> in the SVG table (one doc per glyph).
4) Drop bitmap tables (sbix, CBDT/CBLC) to keep the font small and OTS-safe.
5) Optionally emit a WOFF2 for web use.
"""
import base64
import sys
from pathlib import Path

from PIL import Image
from fontTools import ttLib, subset
from fontTools.ttLib import newTable
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphCoordinates


def add_empty_outlines(font, glyph_order):
    """Ensure glyf/loca exist with blank outlines for every glyph."""
    if "glyf" not in font:
        font["glyf"] = newTable("glyf")
    glyf = font["glyf"]
    if not hasattr(glyf, "glyphs"):
        glyf.glyphs = {}
    for name in glyph_order:
        if name not in glyf.glyphs:
            g = Glyph()
            g.numberOfContours = 0
            g.endPtsOfContours = []
            g.flags = []
            g.coordinates = GlyphCoordinates()
            g.program = None
            glyf.glyphs[name] = g
    font["loca"] = newTable("loca")


def build_svg_docs(glyph_order, png_dir: Path):
    docs = []
    for gid, name in enumerate(glyph_order):
        png_file = png_dir / f"{name}.png"
        if not png_file.exists():
            continue
        with Image.open(png_file) as im:
            w, h = im.size
        b64 = base64.b64encode(png_file.read_bytes()).decode("ascii")
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
            f'viewBox="0 0 {w} {h}"><image width="{w}" height="{h}" '
            f'href="data:image/png;base64,{b64}" /></svg>'
        )
        docs.append((svg, gid, gid))
    return docs


def drop_bitmap_tables(font):
    for tag in ("sbix", "CBDT", "CBLC", "EBDT", "EBLC"):
        if tag in font:
            del font[tag]


def to_woff2(font, glyph_order, out_path):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.retain_gids = True
    sub = subset.Subsetter(options=opts)
    sub.populate(glyphs=glyph_order)
    sub.subset(font)
    font.save(out_path)


def build_svg_font(src_ttf, png_dir, out_ttf, out_woff2=None):
    font = ttLib.TTFont(src_ttf)
    glyph_order = font.getGlyphOrder()

    add_empty_outlines(font, glyph_order)

    svg_table = newTable("SVG ")
    svg_table.docList = build_svg_docs(glyph_order, Path(png_dir))
    font["SVG "] = svg_table

    drop_bitmap_tables(font)

    font.save(out_ttf)
    if out_woff2:
        to_woff2(font, glyph_order, out_woff2)


def main():
    if len(sys.argv) < 4:
        print("usage: python make_svg_font.py input.ttf png_dir output.ttf [output.woff2]")
        sys.exit(1)
    build_svg_font(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else None)


if __name__ == "__main__":
    main()
