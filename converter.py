#!/usr/bin/env python3
import io, os, sys, struct
import freetype
from PIL import Image
from fontTools import ttLib
from fontTools.ttLib import newTable
# sbix support modules
from fontTools.ttLib.tables import sbixStrike, sbixGlyph

DEFAULT_SIZE = 128  # pixels per em for the rendered PNGs

def render_glyph(face, glyph_index, size=DEFAULT_SIZE):
    # Color/bitmap-only fonts (e.g., Apple Color Emoji) expose fixed sizes; pick the first one.
    if face.num_fixed_sizes:
        face.select_size(0)
    else:
        face.set_pixel_sizes(0, size)
    flags = freetype.FT_LOAD_RENDER | freetype.FT_LOAD_TARGET_NORMAL | freetype.FT_LOAD_COLOR
    face.load_glyph(glyph_index, flags)
    bmp = face.glyph.bitmap
    if bmp.width == 0 or bmp.rows == 0:
        return None
    # grayscale -> RGBA; reuse coverage as alpha so transparency is preserved
    alpha = Image.frombytes("L", (bmp.width, bmp.rows), bmp.buffer)
    img = Image.new("RGBA", (bmp.width, bmp.rows), (0, 0, 0, 0))
    img.putalpha(alpha)
    return img

def extract_images(font_path, out_dir, size=DEFAULT_SIZE):
    os.makedirs(out_dir, exist_ok=True)
    font = ttLib.TTFont(font_path)
    face = freetype.Face(font_path)
    # If the font already has sbix strikes (e.g., Apple Color Emoji), prefer copying those PNGs
    sbix_table = font.get("sbix")
    chosen_sbix = None
    if sbix_table and getattr(sbix_table, "strikes", None):
        # pick the largest ppem strike for best quality
        chosen_sbix = max(sbix_table.strikes.values(), key=lambda s: getattr(s, "ppem", 0))
    cbdt_strikes = getattr(font.get("CBDT"), "strikeData", []) if "CBDT" in font else []
    chosen_cbdt = cbdt_strikes[-1] if cbdt_strikes else None
    images = {}
    for glyph_name in font.getGlyphOrder():
        img = None
        # First try to reuse existing sbix bitmap if available
        if chosen_sbix and glyph_name in chosen_sbix.glyphData:
            data = chosen_sbix.glyphData[glyph_name].data
            if data:
                img = Image.open(io.BytesIO(data)).convert("RGBA")
        elif chosen_cbdt and glyph_name in chosen_cbdt:
            data = getattr(chosen_cbdt[glyph_name], "data", None)
            if data:
                # CBDT format 17: 5 bytes metrics, 4 bytes dataLen, then PNG/JPEG data
                try:
                    png_offset = data.find(b"\x89PNG")
                    if png_offset != -1:
                        blob = data[png_offset:]
                    else:
                        img_len = struct.unpack(">I", data[5:9])[0]
                        blob = data[9 : 9 + img_len]
                    img = Image.open(io.BytesIO(blob)).convert("RGBA")
                except Exception:
                    img = None
        # Fallback to rendering with FreeType for outline/other fonts
        if img is None:
            gid = font.getGlyphID(glyph_name)
            try:
                img = render_glyph(face, gid, size=size)
            except freetype.FT_Exception:
                img = None
        if img is None:
            continue
        img.save(os.path.join(out_dir, f"{glyph_name}.png"))
        images[glyph_name] = img
    return font, images

def embed_sbix(font, images, ppem=DEFAULT_SIZE, resolution=72):
    strike = sbixStrike.Strike(ppem=ppem, resolution=resolution)
    strike.ppem = ppem
    strike.resolution = resolution
    strike.glyphData = {}
    for glyph_name, img in images.items():
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        glyph = sbixStrike.Glyph(
            glyphName=glyph_name,
            graphicType="png ",
            originOffsetX=0,
            originOffsetY=0,
            imageData=buf.getvalue(),
        )
        strike.glyphs[glyph_name] = glyph
    table = newTable("sbix")  # returns table__s_b_i_x instance
    table.version = 1
    table.flags = 1  # keep outlines; bitmap strike is an addition
    # strikes must be a dict keyed by ppem
    table.strikes = {ppem: strike}
    font["sbix"] = table
    return font

def main():
    if len(sys.argv) < 3:
        print("Usage: python extract_and_embed.py input.ttf output_dir [output.ttf]")
        sys.exit(1)
    input_font = sys.argv[1]
    out_dir = sys.argv[2]
    output_font = sys.argv[3] if len(sys.argv) > 3 else "out.ttf"
    font, images = extract_images(input_font, out_dir)
    font = embed_sbix(font, images)
    font.save(output_font)
    print(f"Wrote {len(images)} glyph PNGs to {out_dir} and new font {output_font}")

if __name__ == "__main__":
    main()
