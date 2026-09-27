# 71588.com: Phase-by-Phase Build Prompt

> This is the master prompt used to build 71588.com. Paste one phase at a time into an AI coding assistant, or hand it to a developer. `OWNER_INBOX` means the owner's private inbox. It must **never** appear in page text or source: store it encoded, as `SITE_CONFIG._r` does in `assets/js/config.js`.

---

## Phase 0: Positioning and concept

**Domain:** 71588.com, read as "715 88".
**Mandarin reading:** 起·要我发发, "Rise: I want to prosper, and prosper again."

**Concept: "71588 — Prosperity Numbers Hub"**
- The web's most useful destination for Chinese lucky-number meaning and tools.
- Monetised through:
  - Google AdSense and YouTube
  - A lead-gen consultation funnel (B2C and B2B)
  - A broker marketplace for lucky phone numbers, plates and numeric domains
  - Sponsorships
  - Donations

**Audience:**
- Chinese diaspora (about 40M+ people worldwide)
- Asia-curious consumers
- Businesses marketing to Chinese-speaking customers: retail, real estate, restaurants and automotive
- Buyers and sellers of numeric assets

**Why this beats the alternatives:**
- **Evergreen search demand:** "chinese lucky numbers", "number meaning", "[number] meaning", zodiac and red envelope queries.
- **Strong seasonal spikes:** Lunar New Year, 520 (May 20), Mid-Autumn.
- **High-CPC adjacent topics:** finance, real estate, domains, business services.
- **Documented willingness to pay for meaning in numbers:**
  - HK plate "28" sold for HK$18.1M.
  - Phone number 8888-8888 sold for ¥2.33M.
  - 19.2% of Chinese IPO prices end in 8, against 3.3% ending in 4.

## Phase 1: Foundation (static, free GitHub Pages hosting)

**Stack:**
- Plain HTML, CSS and vanilla JavaScript. No framework and no server.
- A tiny Python templater (`tools/build.py`) wraps body fragments in `src/` with the shared layout and outputs plain `.html` files at the repo root.
- `.nojekyll` so GitHub Pages serves the files as-is.

**Shared layout on every page:**
- A top banner reading "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership", linked to https://web.works/contact.
- A sticky header with a mega-menu:
  - Tools: Analyzer, Generator, Zodiac, Dates
  - Meanings
  - Learn
  - Marketplace
  - Community: Contests, Support, Careers, Advertise
  - Contact
  - A "Free Blueprint" call-to-action button
  - A dark-mode toggle
- A footer with the newsletter band, 5 link columns, a copyright line and the trademark disclosure.

**Design system:**
- Colours: imperial red `#c8102e` and gold `#d4a017` on cream/ink, with light and dark themes.
- Fonts: Inter plus Noto Serif SC for Chinese characters.
- Shape: 16px radius, soft shadows.
- Responsive from 320px wide, with no horizontal scroll.
- Accessibility: skip link, ARIA labels, reduced-motion support.

**SEO:**
- Per-page title, description, canonical URL, OpenGraph and Twitter tags.
- JSON-LD: WebSite plus SearchAction, FAQPage and Article.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, and a 1200×630 OG image.

## Phase 2: Interactive tools (all client-side)

1. **Lucky Number Analyzer**
   - Modes: any, phone, plate, address, price, domain.
   - Scores 1–100 from:
     - Digit scores based on homophones
     - Known combinations (168, 518, 520, 1314, 250, 14…)
     - Extra weight on the final digit
     - Pattern bonuses (triples, ABAB, rising sequences, palindromes)
     - Penalties for the digit 4
   - Output:
     - A gauge showing the score
     - A tier label (大吉 to 凶)
     - A sound-alike reading, e.g. 起要我发发
     - Per-digit chips, the combinations found, and notes specific to the mode
   - The result is shareable via `?n=` in the URL.
2. **Dictionary:** digits 0–9 plus about 37 combinations, with search and category chips (prosperity, smooth, love, slang, avoid).
3. **Generator:** choose length and theme, set digits the number must include, and optionally force it to end in 8. Returns the top 12 candidates, scored.
4. **Lucky Price Finder:** suggests 8/88/68/168 price endings within −15% to +12% of the target price, with no 4 and no 250.
5. **Zodiac:**
   - Uses the real lunar year via `Intl.DateTimeFormat('en-u-ca-chinese')`.
   - Shows animal, element, yin/yang, lucky numbers and traits.
   - Includes a compatibility checker (Six Harmonies, Triads, Clashes) and a table of the 12 signs.
6. **Auspicious Date Finder:**
   - A month calendar that scores each day by its digits and lunar date.
   - Lunar days 8, 18 and 28 get a bonus. Ghost Month and days containing 4 are flagged as cautions.
7. **Number of the Day** widget.

## Phase 3: Content engine

**Guides** (Article schema, table of contents, cited sources, ad slots in the text):
- Complete lucky numbers guide
- Economics of lucky numbers
- Lucky pricing strategy
- Red envelope amounts
- Number slang
- Why 4 is unlucky
- The 71588 story

**Expansion roadmap:**
- One page per number from 00 to 9999 (programmatic SEO)
- Festival hubs
- Annual forecasts by zodiac sign
- A 中文 translation of the site
- Q&A archive

## Phase 4: Monetisation

- **AdSense:**
  - `.ad-slot` placeholders render house ads until `adsenseClient` is set in `config.js`. They then switch to responsive AdSense units automatically.
  - `ads.txt` template included.
- **YouTube:** `SITE_CONFIG.videos` drives a lite click-to-load facade using youtube-nocookie. Includes a creator video submission form and video sponsorships.
- **Advertise page:**
  - 6 packages with starting prices, from $88/month banners up to $1,888 seasonal takeovers.
  - Media-kit request form with budget tiers.
  - Partnership and promotion sections.
- **Paid services:** $168 Launch Consultation and $888 Business Prosperity Audit.
- **Marketplace:** success commission and escrow. The featured 71588.com listing links to web.works/contact.

## Phase 5: Lead generation (highest priority)

- **/blueprint.html:** a dedicated 4-step form.
  - Asks for goal, then timeline and market, then numbers and budget, then contact details plus consent.
  - Has a progress bar, trust bullets and upsell tiers.
- **Embedded lead capture across the site:**
  - Lead form on the homepage
  - Analyzer "full report" gate that appears after results
  - Free audit form on the business page
  - Buy and sell/valuation forms on the marketplace
  - Newsletter band on every page
  - Exit-intent modal, shown once per visitor
- **Delivery:**
  - All forms POST JSON to FormSubmit's AJAX endpoint, with the address assembled from an encoded array only at submit time.
  - Honeypot field for spam.
  - Falls back to a runtime-built mailto link if the service fails.
  - Replace with the FormSubmit random alias after activation.

## Phase 6: Community, donations, contests, hiring

- **Support page:**
  - Red-envelope amounts: $8, $18, $88, $168 and $888, plus a custom amount.
  - PayPal donate link built at click time.
  - Monthly patron tiers, pledge form, fund progress bar and a supporter wall with no fake names.
- **Contests:** the Lucky 88 Challenge.
  - Countdown timer and tabs for overview, prizes, rules, timeline, judging and winners.
  - Skill-based judging, 18+ eligibility, and a void-where-prohibited clause.
  - Entry form, plus sponsor and prize-donor calls to action.
- **Careers:**
  - Remote freelance roles: writer, developer, video creator, broker, growth marketer.
  - Contributor open call and an application form.

## Phase 7: Legal and trust

- Privacy page with AdSense cookie disclosure and GDPR, CCPA and PIPEDA rights.
- Terms page.
- Trademark and copyright disclosure:
  - "71588" is used descriptively.
  - No affiliation with anyone else who uses the number.
  - Third-party marks belong to their owners.
  - Notice-and-takedown process.
- Cookie banner.
- "Entertainment and education, not advice" statements.

## Phase 8: Deploy and grow

- Push to `WEBWORKSA1/71588-com` and publish via GitHub Pages from the `main` branch root.
- **Custom domain:** add a `CNAME` file containing `71588.com`, then set DNS:
  - A records for the apex domain: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  - `www` as a CNAME pointing to `webworksa1.github.io`
  - Then enforce HTTPS.
- **After launch:**
  - Submit the sitemap to Google Search Console.
  - Apply for AdSense.
  - Add the GA4 ID.
  - Activate FormSubmit.
  - Publish 2 guides a week.
  - Start YouTube Shorts.
