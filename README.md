# 71588.com: Prosperity Numbers Hub (起·要我发发)

This is a static website about Chinese lucky numbers. It includes interactive tools, lead-generation funnels, a marketplace, contests, donations and advertising. It runs on **GitHub Pages (free plan)**, which builds it with Jekyll automatically. There are no Actions and no paid services.

- **Live (GitHub Pages):** https://webworksa1.github.io/71588-com/
- **Research:** `docs/RESEARCH.md`
- **Competitor audit:** `docs/COMPETITOR-AUDIT.md`
- **Phase-by-phase build prompt:** `docs/BUILD-PROMPT.md`

## Structure
```
_layouts/default.html  shared <head>, top interest banner, header, footer, modal (Jekyll layout)
*.html                 page stubs (front matter + include of the body in src/pages)
guide-*.html           guide stubs published at /guides/*.html
src/pages/*.html       page bodies (edit these)
src/guides/*.html      article bodies
tools/build.py         optional offline builder that produces plain HTML without Jekyll
assets/css/style.css design system (light and dark)
assets/js/config.js  ALL settings: AdSense, GA4, videos, donations, contest, social
assets/js/main.js    forms, ads, videos, donations, UX
assets/js/numbers.js analyzer, dictionary, generator, price finder, zodiac, dates
```
Edit anything under `src/` or the layout, then commit to the Pages branch (`gh-pages`), and GitHub rebuilds the site within about a minute. To publish from `main` instead, go to Settings → Pages → Branch and choose `main` / root.

## Go-live checklist
1. **Forms:** the first form submission triggers a one-time FormSubmit activation email to the owner inbox. Click it. Optionally paste the random alias into `formAlias` in `config.js`.
2. **AdSense:** once approved, set `adsenseClient` (and optionally the slot IDs) in `config.js`, and uncomment the line in `ads.txt`.
3. **Analytics:** set `gaId` in `config.js`.
4. **Custom domain:**
   - Add a `CNAME` file containing `71588.com`, and set `baseurl: ""` in `_config.yml`.
   - Point DNS A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
   - Point `www` as a CNAME to `webworksa1.github.io`.
   - Then enable "Enforce HTTPS" in Settings → Pages.
5. **Videos:** add YouTube IDs to `videos` in `config.js`.
6. **Images:** upload `assets/img/og.png` (1200×630 social card) and `assets/img/icon-512.png`, or regenerate them with `python3 tools/make_images.py`.
7. **Donations:**
   - PayPal donate links are generated at click time.
   - Optional Stripe, Ko-fi and Buy Me a Coffee links can be set in `config.js`.

The owner email never appears in any page. It is stored encoded and assembled only when a form is submitted or an email link is clicked.

© 2026 71588.com. See `legal.html` for the trademark and copyright disclosure.
