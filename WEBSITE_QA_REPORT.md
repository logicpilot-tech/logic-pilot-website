# WEBSITE_QA_REPORT.md — Logic Pilot

## Important caveat, upfront

This environment has no headless Chrome / Lighthouse CLI available (network access here is restricted to package registries, not general web/browser binaries), so **the scores below are not from an actual Lighthouse run** — they're a manual, category-by-category audit against Lighthouse's own published rubric, backed by the concrete measurements shown in each section. Treat the numbers as an informed estimate, not a certified result.

**Run the real thing once this is live:** open the deployed URL in Chrome DevTools → Lighthouse tab (or https://pagespeed.web.dev) and run it. Nothing in this build should score outside the ranges estimated here, but only a live run against a real URL, real DNS, and real TLS produces an official score — Lighthouse penalizes things like server response time and TLS setup that can't be evaluated from static files alone.

---

## 1. Performance — estimated 95–100

| Factor | Status | Evidence |
|---|---|---|
| Total page weight (HTML+CSS+JS+config+favicon) | 34.3 KB | Measured directly on `index.html`'s dependency chain — see file sizes below. |
| Images | Zero raster images shipped | The entire site uses inline SVG for icons/logo. Nothing to lazy-load, no image compression needed on the page itself. |
| Render-blocking requests | 1 stylesheet (Google Fonts) + 1 CSS file | `styles.min.css` is `<link>`ed normally; both JS files use `defer` so they never block first paint. |
| JS execution | Deferred, no blocking | `config.js` and `script.min.js` both load with `defer`, run after DOMParsing, and do only lightweight DOM work (attribute binding, `IntersectionObserver`, one click listener). |
| Font loading | `display=swap` | Set in the Google Fonts URL, so text renders in a fallback font immediately instead of staying invisible while fonts download. |
| Preconnects | `fonts.googleapis.com` + `fonts.gstatic.com` | Both added with `crossorigin` on the gstatic one, shaving a DNS+TLS round trip off font loading. |
| Minification | HTML, CSS, JS all minified | See table below. |
| Caching | 1-year immutable cache on CSS/JS/icons, 5-min on `config.js`, no-cache on HTML | Configured in `netlify.toml` / `vercel.json`; see `SECURITY_HEADERS.md`. |
| Layout shift | Low risk | No images without dimensions, no late-injected fonts above the fold without swap, no ads/embeds. |

**Minification results (measured):**

| File | Before | After | Savings |
|---|---|---|---|
| `styles.css` → `styles.min.css` | 13,942 B | 10,999 B | 21% |
| `script.js` → `script.min.js` | 5,211 B | 2,965 B | 43% |
| `index.html` (minified in place) | 19,091 B | 16,389 B | 14% |
| `case-study-norah-co.html` | 9,163 B | 8,399 B | 8% |
| `404.html` | 2,206 B | 2,092 B | 5% |

Icons were rasterized from the SVG mark and compressed with `pngquant` + `optipng`:

| Icon | Before | After |
|---|---|---|
| `icon-512.png` | 36 KB | 8.9 KB |
| `icon-192.png` | 12 KB | 3.0 KB |
| `apple-touch-icon.png` (180×180) | 12 KB | 2.8 KB |
| `icon-48.png` / `icon-32.png` / `icon-16.png` | 2.5 KB / 1.4 KB / 0.5 KB | 0.8 KB / 0.6 KB / 0.3 KB |

`favicon.svg` was run through SVGO: 396 B → 353 B.

**What would most likely cost points on a real run:** third-party font requests (Google Fonts) are outside your control unless you self-host the three font families — self-hosting would remove 4 external requests but is a bigger change than "optimize," so it's noted here rather than done. Actual server response time (TTFB) also affects this score and depends entirely on which host you pick (see `DEPLOYMENT.md`).

---

## 2. Accessibility — estimated 95–100

| Check | Status |
|---|---|
| Color contrast | **Verified computationally**, not eyeballed. All text/background pairs pass WCAG AA, most pass AAA: |

| Pair | Ratio | Passes |
|---|---|---|
| Primary text on background (`#EDF1F7` / `#0A0F1C`) | 16.87:1 | AAA |
| Body text on cards (`#C2CEDE` / `#111A2C`) | 10.91:1 | AAA |
| Muted text on background (`#8FA1BC` / `#0A0F1C`) | 7.28:1 | AAA |
| Amber accent/eyebrows on background | 9.58:1 | AAA |
| Teal "healthy" status on background | 10.01:1 | AAA |
| Red "warning" status on background (used only at large 24px+ bold size) | 5.72:1 | AA (large text needs 3:1 — passes with margin) |

| Check | Status |
|---|---|
| Skip-to-content link | Added — first focusable element on every page, jumps to `#main-content`. |
| Landmark structure | `<header>`, one `<main id="main-content">`, `<footer>` on every page. |
| Heading order | Single `<h1>` per page, followed by `<h2>`/`<h3>`/`<h4>` in nesting order — not skipped. |
| Form labels | Every input has an associated `<label for="...">`, not just placeholder text. |
| Focus states | Global `:focus-visible` outline in amber, visible against the dark background. |
| Decorative icons hidden from screen readers | All logo marks, nav-toggle icon, service icons, and social icons have `aria-hidden="true" focusable="false"`; the social links carry the accessible name via `aria-label` on the `<a>` instead. |
| Interactive element labeling | Mobile nav toggle has `aria-label`, `aria-expanded`, `aria-controls`; JS keeps `aria-expanded` in sync on open/close. |
| Disabled/placeholder buttons | Elements pointing at empty config values get `aria-disabled="true"` and a real `title`, instead of a dead link with no explanation. |
| Placeholder text contrast | Explicit `::placeholder { color: var(--text-500) }` set — browser default placeholder styling is often too faint on dark backgrounds. |
| Reduced motion | `prefers-reduced-motion: reduce` disables the hero's scan animation and all transitions/animations sitewide. |
| Language attribute | `<html lang="en">` on every page. |

**What could still be improved (not done, since it would mean adding new UI, not just optimizing):** the contact form has no inline validation error messaging beyond native browser `required` validation — that's a UX feature addition, not an optimization, so it's out of scope here per your instructions.

---

## 3. SEO — estimated 95–100

| Check | Status |
|---|---|
| Unique `<title>` per page | ✅ |
| Unique meta description per page | ✅ |
| Canonical URL | ✅ (placeholder domain — update once real domain is live, see `DEPLOYMENT.md`) |
| `robots.txt` | ✅ Added, points to `sitemap.xml` |
| `sitemap.xml` | ✅ Added — lists home + case study (404 correctly excluded) |
| `noindex` on 404 | ✅ |
| Open Graph tags | ✅ title/description/type/url on both indexable pages |
| Twitter Card | ✅ on home page |
| Structured data (JSON-LD) | ✅ `Organization` schema with address and social profiles, validated as parseable JSON |
| Mobile-friendly viewport meta | ✅ |
| Heading hierarchy | ✅ single H1, logical nesting |
| Descriptive link text | ✅ no bare "click here" links |
| HTTPS | Depends on host — all three recommended platforms (GitHub Pages, Netlify, Vercel) serve HTTPS by default |

**What needs a real domain to finish:** every canonical/OG/JSON-LD URL currently points at the placeholder `https://logicpilot.io/`. This is flagged in `DEPLOYMENT.md` as a find-and-replace step once a domain is chosen — it wasn't guessed at further since `config.js` has `websiteUrl` marked `NA`.

---

## 4. Best Practices — estimated 95–100

| Check | Status |
|---|---|
| No inline event handlers | ✅ The one inline `onsubmit="return false;"` was moved into `script.js` as a real event listener specifically so `script-src` can be a strict `'self'` with no `'unsafe-inline'`. |
| Security headers | ✅ Configured for Netlify/Vercel — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Full rationale in `SECURITY_HEADERS.md`. GitHub Pages cannot support these (platform limitation, documented). |
| No console errors expected | `script.js` guards every DOM query (`if (!el) return`) before use. |
| Valid HTML | ✅ All three minified pages parsed cleanly with Python's `html.parser` (no unclosed tags, no structural errors). |
| Valid JSON | ✅ `manifest.json`, `vercel.json`, and the JSON-LD block all parse without error. |
| No mixed content | ✅ Every external reference (Google Fonts) is `https://`. |
| Favicon present | ✅ SVG (primary) + PNG fallbacks at 16/32/48px + Apple touch icon + Android/Chrome 192/512px, all wired through `manifest.json` and `<link>` tags. |
| Charset declared | ✅ `<meta charset="UTF-8">` first tag in every `<head>` |

---

## 5. Mobile responsiveness — manually verified

| Breakpoint | Behavior verified in CSS |
|---|---|
| ≤960px | Hero, about, and contact grids collapse from 2 columns to 1; service cards go 3→2 columns; process steps go 5→2; footer 4→2. |
| ≤640px | Nav collapses into a full-screen slide-down menu behind a hamburger toggle (JS-driven, `aria-expanded` synced); all remaining multi-column grids (services, process, readout panel, footer) collapse to a single column; hero CTA buttons go full-width for easier tapping. |
| Touch targets | Primary buttons use `13px` vertical padding on a `~14px` line-height, landing at roughly 40–44px tap height, in line with the widely used 44px touch-target guideline. |
| Text scaling | Headings use `clamp()` so font size scales fluidly between mobile and desktop instead of jumping at fixed breakpoints. |
| Horizontal scroll | No fixed-width elements found; every grid and container uses relative units (`%`, `fr`, `ch`, `rem`) or `max-width`. |

No emulator/device lab was used to visually confirm this (not available in this environment) — the assessment is based on reading the actual CSS rules, not a screenshot. Recommend a quick manual pass in Chrome DevTools' device toolbar once deployed.

---

## 6. Known, deliberately out-of-scope items

These were flagged in the original build and remain unresolved because fixing them means adding a feature or asset, not optimizing/validating the existing one — consistent with "do not redesign, only optimize":

1. **Contact form has no backend.** It now correctly `preventDefault()`s instead of doing nothing via an inline handler, but still doesn't send anywhere. Netlify Forms (just add `data-netlify="true"` to the `<form>`) is the fastest fix if you deploy there; otherwise a service like Formspree or Web3Forms.
2. **`og-image.png` doesn't exist yet.** The Open Graph/Twitter Card meta tags reference `https://logicpilot.io/og-image.png`, but no 1200×630 image has been generated — link previews will currently show no image until one is added.
3. ~~**Phone vs. WhatsApp number mismatch**~~ — **Resolved.** Both now use the confirmed number `+91 8630398305`.
4. **`GitHub Repository` and `Calendly` links are still blank** in `config.js` — the corresponding buttons correctly disable/fall back rather than break, but they won't be fully functional until those two values are filled in.

## 7. Summary

| Category | Estimated score | Confidence |
|---|---|---|
| Performance | 95–100 | High — based on measured file sizes and zero render-blocking JS |
| Accessibility | 95–100 | High — based on computed contrast ratios and a manual ARIA/landmark audit |
| SEO | 95–100 | High for on-page factors; actual ranking/indexing depends on the real domain being live |
| Best Practices | 95–100 | High for Netlify/Vercel; GitHub Pages will score lower here specifically on the missing-headers checks Lighthouse runs |

**Bottom line:** the static-file side of all four Lighthouse categories is in good shape. The only things that can move these numbers are (a) which host you pick — Netlify/Vercel vs. GitHub Pages, because of headers — and (b) an actual Lighthouse run against a live URL, which accounts for real-world network conditions this environment can't simulate.
