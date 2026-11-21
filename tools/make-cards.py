#!/usr/bin/env python3
"""Make a 1200x630 link-preview card (X, Telegram, ...) for each post.

Usage (from the project root):   python3 tools/make-cards.py
Needs: pip install pyyaml playwright && playwright install chromium

Writes assets/img/posts/<post-slug>.png. Then add this line to the post's front matter:
    image: /assets/img/posts/<post-slug>.png
This folder is excluded from the site (see _config.yml), so it is never published.
"""
import html, pathlib, re, tempfile, yaml
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
out = root / "assets" / "img" / "posts"
out.mkdir(parents=True, exist_ok=True)
logo = (root / "assets/img/logo-mark.png").as_uri()
font = (root / "assets/fonts/inter-latin-wght-normal.woff2").as_uri()
URL = "mortezamirmojarabian.github.io"

TEMPLATE = """<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Inter;src:url(%(font)s);font-weight:100 900}
*{box-sizing:border-box}body{margin:0}
.c{position:relative;width:1200px;height:630px;overflow:hidden;background:#fff;font-family:Inter,sans-serif;color:#111}
.dots{position:absolute;top:0;right:0;width:700px;height:630px;opacity:.22;
 background-image:radial-gradient(circle,#1d4ed8 1.6px,transparent 2px);background-size:28px 28px;
 -webkit-mask-image:radial-gradient(ellipse at 100%% 0%%,#000,transparent 70%%)}
.bar{position:absolute;left:0;right:0;bottom:0;height:14px;display:flex}
.bar i{width:360px;background:#1d4ed8}.bar b{flex:1;background:#111}
.in{position:absolute;left:80px;right:80px;top:64px;bottom:70px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:20px}
.top img{width:64px;height:48px;object-fit:contain}
.pill{background:#1d4ed8;color:#fff;font-weight:700;font-size:24px;padding:8px 22px;border-radius:999px}
.pill.a{background:#111}
.lvl{font-size:24px;font-weight:500;color:#5a5a5a}
h1{margin:auto 0;font-size:%(size)spx;line-height:1.08;letter-spacing:-.03em;font-weight:800;max-width:1000px}
.foot{display:flex;justify-content:space-between;align-items:baseline;gap:24px}
.name{font-size:28px;font-weight:700}.url{font:500 24px ui-monospace,'DejaVu Sans Mono',monospace;color:#1d4ed8}
</style><div class=c><div class=dots></div><div class=bar><i></i><b></b></div><div class=in>
<div class=top><img src="%(logo)s" alt=""><span class="pill%(cls)s">%(label)s</span>%(lvl)s</div>
<h1>%(title)s</h1>
<div class=foot><span class=name>Morteza Mirmojarabian</span><span class=url>%(url)s</span></div>
</div></div>"""

def posts():
    for f in sorted((root / "_posts").glob("*.md")):
        m = re.match(r"---\n(.*?)\n---", f.read_text(encoding="utf-8"), re.S)
        fm = yaml.safe_load(m.group(1))
        slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", f.stem)
        yield slug, fm

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1200, "height": 630})
    for slug, fm in posts():
        title = str(fm["title"])
        label = fm.get("label") or ("Exercise" if fm.get("exercise") else "Article")
        size = 76 if len(title) <= 40 else 64 if len(title) <= 62 else 54
        lvl = f'<span class=lvl>Level {html.escape(str(fm["level"]))}</span>' if fm.get("level") else ""
        doc = TEMPLATE % dict(font=font, logo=logo, size=size, label=html.escape(label),
            cls="" if fm.get("exercise") else " a", lvl=lvl, title=html.escape(title), url=URL)
        tmp = pathlib.Path(tempfile.mkdtemp()) / "card.html"   # file:// so the logo and font load
        tmp.write_text(doc, encoding="utf-8")
        page.goto(tmp.as_uri())
        page.evaluate("document.fonts.ready")
        page.screenshot(path=str(out / f"{slug}.png"))
        print("made", slug)
    b.close()
