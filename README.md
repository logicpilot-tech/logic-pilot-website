# Logic Pilot — Website

Production-ready marketing site: home page, one case-study page, and a 404 page. Pure HTML/CSS/JS — no build step, no framework — so it opens directly in a browser, deploys as-is to any static host, and translates cleanly into Framer (structure notes below).

**This build has been optimized and prepared for production deployment.** See `WEBSITE_QA_REPORT.md` for the full audit and `DEPLOYMENT.md` for step-by-step deploy instructions on GitHub Pages, Netlify, and Vercel.

## 1. Files

| File | Purpose |
|---|---|
| `index.html` | Home page — minified for production |
| `case-study-norah-co.html` | Case study page — minified for production |
| `404.html` | Not-found page — minified for production |
| `styles.min.css` | Minified stylesheet (from `source/styles.css`) |
| `script.min.js` | Minified script (from `source/script.js`) |
| `config.js` | **The only file you edit** — every link, contact detail, and future asset. Deliberately left unminified since you edit it directly. |
| `favicon.svg` | Instrument-dial mark, SVGO-optimized |
| `icons/` | PNG favicons/app icons generated from `favicon.svg` (16/32/48/192/512px + Apple touch icon), pngquant + optipng compressed |
| `manifest.json` | Web app manifest |
| `browserconfig.xml` | Windows tile config |
| `robots.txt` / `sitemap.xml` | Search engine crawl/index config |
| `netlify.toml` / `vercel.json` | Security headers + caching rules for those platforms |
| `.nojekyll` | Tells GitHub Pages not to run Jekyll processing |
| `source/` | Human-readable, unminified originals (`index.html`, `case-study-norah-co.html`, `404.html`, `styles.css`, `script.js`) — **edit these, not the minified root files**, then re-minify (see below) |
| `DEPLOYMENT.md` | Step-by-step deploy guide for GitHub Pages / Netlify / Vercel |
| `SECURITY_HEADERS.md` | Explains every security header and its value |
| `WEBSITE_QA_REPORT.md` | Full performance/SEO/accessibility/best-practices audit |

### Making future edits

Always edit the files in `source/`, never the minified root files directly (your changes will be overwritten next time someone re-minifies). After editing:
```bash
# CSS
npx clean-css-cli -O2 -o styles.min.css source/styles.css
# JS
npx terser source/script.js -c -m -o script.min.js
# HTML (repeat per file)
npx html-minifier-terser source/index.html --collapse-whitespace --remove-comments --minify-css true --minify-js true --remove-redundant-attributes -o index.html
```

## 2. Editing links, contact info, and assets

Open `config.js`. Every value is documented inline. Leave anything blank if you don't have it yet — the site will hide social icons that have no URL, and disable (not break) buttons like "Portfolio PDF" until you add a real link. Nothing is hardcoded elsewhere; `script.js` reads `config.js` on every page load and fills in every `data-cfg-*` element.


**Confirmed before launch:**
- Phone and WhatsApp now both use the same verified number: `+91 8630398305`.

**Still needed from you before full launch:**
- Add `social.githubRepo` once the Norah & Co code is pushed to a public repo (currently blank → "View source code" is disabled).
- Add `booking.calendlyUrl` once Calendly is set up (currently blank → "Book a discovery call" falls back to a pre-filled email instead of a dead link).
- Add `company.websiteUrl` and update the `<link rel="canonical">` and Open Graph URLs in both HTML files once the domain is live (currently placeholder `logicpilot.io`).

## 3. Design system

**Concept:** an instrument panel for a business's data. Logic Pilot reads your gauges so you don't have to — so the visual language borrows from cockpit displays: dark panel surfaces, corner-bracket modules like gauge bezels, amber/teal status readouts, and a monospace "data" voice for labels.

**Color**
| Token | Hex | Use |
|---|---|---|
| `--ink-900` | `#0A0F1C` | Page background |
| `--panel-800` | `#111A2C` | Card/panel surfaces |
| `--panel-700` | `#16233A` | Nested surfaces (readout cells) |
| `--line-600` | `#263A56` | Hairline borders |
| `--text-100` | `#EDF1F7` | Primary text |
| `--text-500` | `#8FA1BC` | Muted text |
| `--amber-500` | `#F2A93B` | Primary accent (CTAs, active states) |
| `--teal-400` | `#4FD1A5` | "Healthy" status |
| `--red-400` | `#E2665A` | "Needs attention" status |

**Type**
- Display: **Space Grotesk** (600/700) — headlines only, used with restraint
- Body: **Inter** (400/500) — all paragraph and UI copy
- Mono: **IBM Plex Mono** (400/500) — eyebrows, labels, nav, data readouts (the "instrument" voice)

**Signature element:** the hero readout panel — a live-styled instrument strip showing four real numbers from the Norah & Co case study (revenue, ROAS, CAC trend, retention), color-coded amber/teal/red by health. It proves the product (clear, honest data reads) inside the hero itself, instead of a generic headline + gradient.

## 4. Component hierarchy

```
Page
├── Nav (sticky)
│   ├── Brand mark + wordmark
│   ├── Nav links (Services, Work, Process, About, Contact)
│   ├── CTA: Book a discovery call
│   └── Mobile nav toggle
├── Hero
│   ├── Eyebrow + H1 + subhead
│   ├── CTA row (Book a call / View case study)
│   └── Signature readout panel (4 metric cells)
├── Capability strip (4 items)
├── Services (3 cards: Insight Report, Dashboard Build, Reporting Automation)
├── Process (5 steps: Discover → Diagnose → Build → Deliver → Support)
├── Work
│   ├── Project card (templated from config.js `projects[]`)
│   └── Synthetic-data disclosure block
├── About (positioning + 3 stats)
├── Contact
│   ├── Form (name, email, message)
│   └── Direct channel list (email, phone, WhatsApp, booking, address)
└── Footer
    ├── Brand + social icons
    ├── Site links / Connect links / Resources (PDFs)
    └── Copyright bar
```

Case-study page reuses Nav + Footer and adds: hero, KPI readout row, 4 "problem" cards, 3 "build layer" cards, next-steps CTA.

## 5. Images required (none are currently embedded — site ships icon-only)

The site currently uses only inline SVG icons (brand mark, service icons, social icons) so it works with zero image assets. For a fuller production pass, add:
- **OG/social preview image** — 1200×630px, referenced in both HTML files as `og-image.png` (currently a placeholder path — add the file at the site root and it will resolve).
- Optional: a founder photo for the About section, and 1–2 dashboard screenshots from the actual Norah & Co Excel/Power BI files for the case-study page (`/mnt/skills` extraction of the uploaded zip has the workbook if you want real screenshots).

## 6. SEO / metadata audit — status

| Item | Status |
|---|---|
| Title tags | ✅ Unique per page |
| Meta description | ✅ Present, unique per page |
| Canonical URL | ⚠️ Placeholder domain (`logicpilot.io`) — update once real domain is set in `config.js` and in both `<link rel="canonical">` tags |
| Open Graph tags | ✅ Present; `og:image` path needs the real image file |
| Twitter Card | ✅ Present on home page |
| Favicon | ✅ `favicon.svg` |
| JSON-LD (Organization) | ✅ On home page |
| robots meta on 404 | ✅ `noindex` |
| Mobile viewport | ✅ |

## 7. Clickable-element audit — result

Every interactive element on every page now resolves through `config.js` via `data-cfg-*` attributes instead of a hardcoded `href`. Summary:

| Element | Behavior when config value is present | Behavior when blank |
|---|---|---|
| GitHub repo / profile | Links out | Repo link disables; profile is always filled (you gave a value) |
| LinkedIn company / personal | Links out | Personal link hides entirely (marked optional) |
| Instagram | Links out | Hides |
| Email (mailto) | Opens mail client | N/A — always filled |
| Phone (tel) | Dials | N/A — always filled |
| WhatsApp | Opens `wa.me` chat | N/A — always filled (verify digits, see §2) |
| Book a discovery call | Opens Calendly | Falls back to pre-filled `mailto:` — never a dead link |
| Portfolio / Company Profile / Capability Deck / Resume PDFs | Downloads | Button disables + shows "Coming soon" |
| View case study | Links to case-study page | Disables if a project has no case study URL |
| View source code | Links to GitHub repo | Disables if blank |
| Contact form | Front-end only — see note below | — |
| 404 links | Home + email | — |

**Contact form note:** the form currently has no backend (`onsubmit="return false;"` as a placeholder). It needs to be wired to either a form service (e.g. Formspree, Web3Forms) or a real endpoint before launch — say the word and this can be added next.

## 8. Framer migration notes

This build maps cleanly onto Framer's model:
- Each `<section>` → a Framer **Section** with the same padding/border tokens.
- `.card`, `.readout-cell`, `.strip-item` → **Components** with variants (default / hover).
- `config.js` values → Framer **CMS fields** or **Page/Site variables**, so the same "edit once" workflow applies in Framer's UI instead of a JS file.
- Google Fonts (Space Grotesk, Inter, IBM Plex Mono) are all available natively in Framer's font picker under the same names.
- The hero readout panel's subtle scan animation (`.sweep`) can be rebuilt with a Framer **scroll/loop animation** on a rectangle layer.
