#!/usr/bin/env python3
"""Generate assets/img/og.png (1200x630) and assets/img/icon-512.png. Needs Pillow + Noto CJK fonts."""
import os, glob
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def font(pattern, size):
    for p in glob.glob("/usr/share/fonts/**/" + pattern, recursive=True):
        return ImageFont.truetype(p, size, index=0)
    return ImageFont.load_default()
SERIF, SANS = "NotoSerifCJK-Bold.ttc", "NotoSansCJK-Black.ttc"
out = os.path.join(ROOT, "assets", "img")
W, H = 1200, 630
im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
for y in range(H):
    t = y / H; d.line([(0, y), (W, y)], fill=(int(22 + 40 * t), int(17 - 7 * t), int(15 + 3 * t)))
d.text((W - 330, H - 330), "發", font=font(SERIF, 360), fill=(60, 30, 20))
d.text((70, 90), "71588", font=font(SANS, 170), fill="#ffd76a")
d.text((74, 300), "起·要我发发", font=font(SERIF, 64), fill="#ffffff")
d.text((74, 400), "Chinese Lucky Numbers · Meanings · Prosperity Tools", font=font(SANS, 36), fill="#f3e6c8")
d.rectangle([74, 470, 300, 478], fill="#c8102e")
im.save(os.path.join(out, "og.png"), optimize=True)
ic = Image.new("RGB", (512, 512), "#c8102e"); di = ImageDraw.Draw(ic)
di.text((256, 240), "發", font=font(SERIF, 340), fill="#ffd76a", anchor="mm")
ic.save(os.path.join(out, "icon-512.png"), optimize=True)
print("images ok")
