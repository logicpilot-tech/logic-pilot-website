# Security Headers — Logic Pilot

This site is 100% static (no server-side code), so security headers have to be set at the hosting/CDN layer rather than in application code. They're pre-configured for Netlify and Vercel; GitHub Pages has a hard platform limitation described below.

## Headers applied (Netlify: `netlify.toml`, Vercel: `vercel.json`)

| Header | Value | Why |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Stops browsers from guessing MIME types, which prevents some content-sniffing attacks. |
| `X-Frame-Options` | `DENY` | Stops the site from being embedded in an `<iframe>` elsewhere (clickjacking protection). |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Sends full URL as referrer on same-origin requests, only the origin on cross-origin ones. Good default for a public marketing site. |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=()` | The site never needs these browser APIs, so they're explicitly turned off. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for two years once a browser has visited once. Netlify and Vercel both serve HTTPS by default, so this is safe to enable immediately. |
| `Content-Security-Policy` | see below | Restricts what the page is allowed to load and execute. |

### Content-Security-Policy, explained directive by directive

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
object-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

- `script-src 'self'` — only `config.js` and `script.min.js`, served from the same origin, may run. There is no inline JavaScript left in the HTML (the old inline `onsubmit` handler was moved into `script.js` specifically so this could be set to a strict `'self'` with no `'unsafe-inline'`).
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — `'unsafe-inline'` is required because the page uses inline `style="…"` attributes in a handful of places (kept as-is per your instruction not to redesign/refactor markup). **Future hardening:** moving those inline styles into `styles.css` classes would let you drop `'unsafe-inline'` entirely and tighten this further.
- `font-src https://fonts.gstatic.com` — Google Fonts serves the actual font files from this domain.
- `img-src 'self' data:` — same-origin images plus inline `data:` URIs (used nowhere today, but harmless to allow and avoids breaking small inline SVG data-URIs if added later).
- `object-src 'none'` — blocks Flash/Java-style plugin embeds entirely; there's no legitimate use for them here.
- `frame-ancestors 'none'` — belt-and-suspenders version of `X-Frame-Options` for browsers that respect CSP over the older header.
- `base-uri 'self'` — stops an injected `<base>` tag from silently rewriting relative URLs on the page.
- `form-action 'self'` — the contact form can only submit to this same origin (today it does nothing — see `WEBSITE_QA_REPORT.md` — but this is ready for whenever a form backend is wired up on the same domain).

## Caching

| File type | Policy | Why |
|---|---|---|
| `styles.min.css`, `script.min.js`, `favicon.svg`, `/icons/*` | `max-age=31536000, immutable` (1 year) | These are static assets. Filenames don't currently include a content hash, so if you edit `styles.css`/`script.js` and re-minify, rename the output (e.g. `styles.min.v2.css`) and update the two references in the HTML — otherwise cached browsers may keep the old version for up to a year. |
| `config.js` | `max-age=300` (5 minutes) | This is the one file you're expected to edit directly and often. A short cache means visitors see updated links within minutes instead of up to a year. |
| `*.html` | `max-age=0, must-revalidate` | Pages should always be revalidated so copy changes go live immediately. |

## GitHub Pages limitation

**GitHub Pages does not support custom response headers.** There is no config file (no `_headers`, no `netlify.toml` equivalent) that GitHub Pages will read — every file is served with GitHub's fixed default headers, and `Content-Security-Policy`, `Strict-Transport-Security`, etc. cannot be added at the hosting layer.

If strict security headers are a hard requirement, you have two options:
1. **Deploy on Netlify or Vercel instead** (both are already fully configured — see `DEPLOYMENT.md`), or
2. **Put GitHub Pages behind Cloudflare** (free tier) and add the same headers there via a Cloudflare "Transform Rule" or a small Cloudflare Worker.

GitHub Pages does still serve over HTTPS by default and sets basic headers like `X-Content-Type-Options: nosniff`, so it isn't insecure — it just can't be hardened further from within this repo.

## Testing headers after deployment

Once live, verify with:
```bash
curl -sI https://your-domain.com/ | grep -iE "content-security|x-frame|x-content-type|strict-transport|referrer|permissions"
```
Or paste the URL into https://securityheaders.com for a scored report.
