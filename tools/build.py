#!/usr/bin/env python3
"""Static site builder for 71588.com.
Wraps every body fragment in src/pages/*.html and src/guides/*.html with the shared
<head>, top interest banner, header, footer and scripts, then writes plain HTML to the
repo root (and /guides) so GitHub Pages can serve it with zero build step.

Each fragment starts with a metadata comment:
<!--
title: Page title
description: Meta description
-->
Run:  python3 tools/build.py
"""
import os, re, datetime, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMAIN = "https://71588.com"
INTEREST = "https://web.works/contact"
TODAY = datetime.date.today().isoformat()

NAV = [
    ("Tools", [("analyzer.html", "🔢 Lucky Number Analyzer"), ("generator.html", "✨ Number & Price Generator"),
               ("zodiac.html", "🐉 Chinese Zodiac & Lunar Date"), ("dates.html", "📅 Auspicious Date Finder")]),
    ("meanings.html", "Meanings"),
    ("Learn", [("learn.html", "📚 Guides hub"), ("the-71588-story.html", "🧧 The 71588 story"),
               ("videos.html", "▶️ Videos"), ("business.html", "🏮 Prosperity for Business")]),
    ("marketplace.html", "Marketplace"),
    ("Community", [("contests.html", "🏆 Contests & Prizes"), ("support.html", "❤️ Support us"),
                   ("careers.html", "💼 Careers & Contributors"), ("advertise.html", "📣 Advertise & Sponsor")]),
]

def head(title, desc, path, depth, schema=""):
    pre = "../" * depth
    url = DOMAIN + "/" + (path if path != "index.html" else "")
    t = html.escape(title)
    d = html.escape(desc)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t}</title>
<meta name="description" content="{d}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#c8102e">
<meta property="og:type" content="website">
<meta property="og:site_name" content="71588.com">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{DOMAIN}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{pre}assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="{pre}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Serif+SC:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{pre}assets/css/style.css">
<script>document.documentElement.classList.add('js');try{{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"WebSite","name":"71588.com","alternateName":"71588 Prosperity Numbers","url":"{DOMAIN}/","potentialAction":{{"@type":"SearchAction","target":"{DOMAIN}/analyzer.html?n={{search_term_string}}","query-input":"required name=search_term_string"}}}}</script>
{schema}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar" role="note">📩 <a href="{INTEREST}" target="_blank" rel="noopener">Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership</a></div>
"""

def header(depth):
    pre = "../" * depth
    items = []
    for i, entry in enumerate(NAV):
        if isinstance(entry[1], list):
            sub = "".join(f'<li><a href="{pre}{h}">{l}</a></li>' for h, l in entry[1])
            items.append(f'<li><button class="dd" aria-haspopup="true">{entry[0]} ▾</button><ul class="submenu">{sub}</ul></li>')
        else:
            items.append(f'<li><a href="{pre}{entry[0]}">{entry[1]}</a></li>')
    items.append(f'<li><a href="{pre}contact.html">Contact</a></li>')
    items.append(f'<li class="nav-cta"><a class="btn btn-primary btn-sm" style="color:#fff" href="{pre}blueprint.html">Free Blueprint</a></li>')
    return f"""<header class="site-header">
  <nav class="container nav" aria-label="Main">
    <a class="brand" href="{pre}index.html" aria-label="71588.com home"><span class="brand-mark">發</span><span>71588<small>Prosperity Numbers</small></span></a>
    <ul class="menu" id="menu">{''.join(items)}<li><button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode">◐</button></li></ul>
    <button class="icon-btn burger" aria-controls="menu" aria-expanded="false" aria-label="Open menu">☰</button>
  </nav>
</header>
<main id="main">
"""

def footer(depth, extra_js=""):
    pre = "../" * depth
    return f"""</main>
<section class="container" style="padding:24px 16px 0">
  <div class="cta-band reveal">
    <div><h2>Get the Daily Lucky Number 🧧</h2><p>One number, its meaning and a prosperity tip — every morning. Plus first access to contests and marketplace drops. Free, unsubscribe anytime.</p></div>
    <form data-form="Newsletter signup" data-success="You're in! Watch your inbox for your first lucky number.">
      <input type="email" name="email" required placeholder="you@example.com" aria-label="Email address">
      <input type="hidden" name="interest" value="Daily Lucky Number">
      <button class="btn btn-gold" type="submit">Subscribe</button>
      <p class="small" style="width:100%;margin:6px 0 0;color:#ffe3e6">We respect your privacy. See our <a style="color:#ffd76a" href="{pre}privacy.html">Privacy Policy</a>.</p>
    </form>
  </div>
</section>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" style="color:#fff" href="{pre}index.html"><span class="brand-mark">發</span><span>71588<small style="color:#c9b8a8">Prosperity Numbers</small></span></a>
        <p style="margin-top:14px;font-size:.93rem">起·要我发发 — the world's friendliest guide to Chinese lucky numbers, prosperity culture and meaningful numbers for life and business.</p>
        <p class="small"><a href="{INTEREST}" target="_blank" rel="noopener">Interested in this website or domain? Contact →</a></p>
      </div>
      <div><h4>Tools</h4><ul>
        <li><a href="{pre}analyzer.html">Number Analyzer</a></li><li><a href="{pre}generator.html">Number & Price Generator</a></li>
        <li><a href="{pre}zodiac.html">Chinese Zodiac</a></li><li><a href="{pre}dates.html">Auspicious Dates</a></li><li><a href="{pre}meanings.html">Number Dictionary</a></li></ul></div>
      <div><h4>Learn</h4><ul>
        <li><a href="{pre}learn.html">Guides</a></li><li><a href="{pre}the-71588-story.html">The 71588 Story</a></li>
        <li><a href="{pre}videos.html">Videos</a></li><li><a href="{pre}business.html">For Business</a></li><li><a href="{pre}marketplace.html">Marketplace</a></li></ul></div>
      <div><h4>Community</h4><ul>
        <li><a href="{pre}contests.html">Contests & Prizes</a></li><li><a href="{pre}support.html">Support / Donate</a></li>
        <li><a href="{pre}careers.html">Careers</a></li><li><a href="{pre}advertise.html">Advertise & Sponsor</a></li><li><a href="{pre}blueprint.html">Free Blueprint</a></li></ul></div>
      <div><h4>Company</h4><ul data-social>
        <li><a href="{pre}about.html">About</a></li><li><a href="{pre}contact.html">Contact</a></li><li><a href="{pre}privacy.html">Privacy</a></li>
        <li><a href="{pre}terms.html">Terms</a></li><li><a href="{pre}legal.html">Trademark & Copyright</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> 71588.com. All rights reserved. Content is for cultural education and entertainment; not financial, legal or religious advice.</span>
      <span>"71588" is used descriptively as a number and domain name. No affiliation with any company using this number. <a href="{pre}legal.html">Disclosure</a></span>
    </div>
  </div>
</footer>
<div class="float-cta"><button class="icon-btn to-top" aria-label="Back to top">↑</button></div>
<div class="cookie" role="dialog" aria-label="Cookie notice"><p style="margin:0 0 10px">We use cookies for analytics and to show ads (Google AdSense) that keep this site free. <a href="{pre}privacy.html">Learn more</a>.</p>
  <button class="btn btn-primary btn-sm" data-cookie="1">Accept</button> <button class="btn btn-ghost btn-sm" data-cookie="0">Essential only</button></div>
<div class="modal" id="lead-modal" aria-modal="true" role="dialog" aria-labelledby="lm-title">
  <div class="form-card">
    <button class="icon-btn close" data-close aria-label="Close">✕</button>
    <span class="tag red">Free · 2 minutes</span>
    <h2 id="lm-title" style="margin-top:10px">Before you go — get your free Prosperity Blueprint</h2>
    <p class="muted">Your personalised lucky numbers, best dates and a prosperity checklist for your next launch, purchase or celebration.</p>
    <form class="form" data-form="Exit-intent blueprint request" data-success="Blueprint request received! We'll email your personalised blueprint shortly.">
      <input name="name" required placeholder="First name" aria-label="First name">
      <input type="email" name="email" required placeholder="Email" aria-label="Email">
      <select name="goal" aria-label="Goal"><option>Personal lucky numbers</option><option>Business launch / pricing</option><option>Buy or sell a lucky number / domain</option><option>Wedding or event date</option></select>
      <button class="btn btn-primary" type="submit">Send my free blueprint</button>
      <p class="form-note">No spam. One-click unsubscribe.</p>
    </form>
  </div>
</div>
<script src="{pre}assets/js/config.js"></script>
<script src="{pre}assets/js/main.js" defer></script>
<script src="{pre}assets/js/numbers.js" defer></script>
{extra_js}
</body>
</html>
"""

def parse(fragment):
    m = re.match(r"\s*<!--(.*?)-->", fragment, re.S)
    meta = {}
    if m:
        for line in m.group(1).strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1); meta[k.strip()] = v.strip()
        fragment = fragment[m.end():]
    return meta, fragment

def build():
    pages = []
    for sub, outdir, depth in (("pages", "", 0), ("guides", "guides", 1)):
        srcdir = os.path.join(ROOT, "src", sub)
        for fn in sorted(os.listdir(srcdir)):
            if not fn.endswith(".html"): continue
            meta, body = parse(open(os.path.join(srcdir, fn), encoding="utf-8").read())
            rel = (outdir + "/" if outdir else "") + fn
            schema = ""
            if sub == "guides":
                schema = ('<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"%s","description":"%s","datePublished":"%s","dateModified":"%s","author":{"@type":"Organization","name":"71588.com Editorial"},"publisher":{"@type":"Organization","name":"71588.com"},"mainEntityOfPage":"%s/%s"}</script>'
                          % (meta.get("title", "").replace('"', "'"), meta.get("description", "").replace('"', "'"), meta.get("date", TODAY), TODAY, DOMAIN, rel))
            if body.find("PREFIX/") > -1:
                body = body.replace("PREFIX/", "../" * depth)
            out = head(meta.get("title", "71588.com"), meta.get("description", ""), rel, depth, schema) + header(depth) + body + footer(depth)
            os.makedirs(os.path.join(ROOT, outdir) if outdir else ROOT, exist_ok=True)
            open(os.path.join(ROOT, rel), "w", encoding="utf-8").write(out)
            if meta.get("noindex") != "true":
                pages.append((rel, meta.get("priority", "0.7")))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for rel, pr in pages:
        loc = DOMAIN + "/" + ("" if rel == "index.html" else rel)
        sm.append(f"  <url><loc>{loc}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>")
    sm.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w").write("\n".join(sm) + "\n")
    print(f"Built {len(pages)} indexable pages.")

if __name__ == "__main__":
    build()
