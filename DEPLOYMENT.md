# DEPLOYMENT.md — Logic Pilot

The site is fully static (HTML/CSS/JS, no build step, no dependencies), so any of the three platforms below works with almost no configuration. Pick one.

**Before deploying anywhere:**
1. Open `config.js` and fill in every real link (see the comments in that file). At minimum, decide what to do about the phone-vs-WhatsApp digit mismatch flagged in `README.md`.
2. Decide on your real domain. Every canonical URL, Open Graph URL, `sitemap.xml`, `robots.txt`, and the JSON-LD block in `index.html`/`case-study-norah-co.html` currently use the placeholder `https://logicpilot.io/`. Once you own a real domain, do a project-wide find-and-replace of `logicpilot.io` with your actual domain.

---

## Option A — GitHub Pages

**Best for:** free hosting, zero cost, you already use GitHub. **Limitation:** no custom security headers (see `SECURITY_HEADERS.md`).

1. Create a new GitHub repository (public, or private with GitHub Pro/Team/Enterprise).
2. Push the entire contents of this folder to the repo root (the `.nojekyll` file is already included — this is required so GitHub doesn't run Jekyll and accidentally ignore files/folders that start with an underscore or dot).
   ```bash
   cd logic-pilot-website
   git init
   git add .
   git commit -m "Production-ready Logic Pilot website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Build and deployment → Source** → select **Deploy from a branch** → branch **main**, folder **/ (root)** → **Save**.
4. GitHub gives you a URL like `https://<your-username>.github.io/<your-repo>/`. It can take 1–2 minutes to go live.
5. **Custom domain (optional):** Settings → Pages → Custom domain → enter your domain → GitHub creates a `CNAME` file automatically. Then add a `CNAME` DNS record at your domain registrar pointing to `<your-username>.github.io`. Wait for DNS to propagate, then tick "Enforce HTTPS" once it's available.
6. Because the site lives at a sub-path if you don't use a custom domain (e.g. `/<your-repo>/`), double-check that internal links still resolve — this project uses relative links (`index.html`, `case-study-norah-co.html`, `icons/...`) throughout specifically so it works at any sub-path without edits.

---

## Option B — Netlify

**Best for:** easiest setup, security headers work out of the box via `netlify.toml` (already included), free SSL, instant rollbacks.

**Via the Netlify dashboard (no CLI needed):**
1. Go to https://app.netlify.com → **Add new site → Deploy manually**.
2. Drag and drop this entire folder onto the upload area.
3. Netlify deploys immediately and gives you a URL like `https://random-name-123.netlify.app`.
4. `netlify.toml` is auto-detected — no extra configuration needed. It already sets the publish directory (`.`), all security headers, cache rules, and the 404 fallback.
5. **Custom domain:** Site configuration → Domain management → Add a domain → follow the DNS instructions (either point a CNAME to your Netlify subdomain, or use Netlify DNS).
6. **Rename the site** (optional): Site configuration → General → Change site name, to get a nicer `*.netlify.app` URL before you attach a custom domain.

**Via CLI (if you prefer git-based deploys):**
```bash
npm install -g netlify-cli
cd logic-pilot-website
netlify deploy --prod
```
Or connect the GitHub repo directly in the Netlify dashboard (**Add new site → Import an existing project**) for automatic redeploys on every push — no build command needed, just set the publish directory to `.`.

---

## Option C — Vercel

**Best for:** same convenience as Netlify, security headers work out of the box via `vercel.json` (already included).

**Via the Vercel dashboard:**
1. Push this folder to a GitHub repository (Vercel deploys from git).
2. Go to https://vercel.com/new → import the repository.
3. Framework preset: choose **Other** (this is a plain static site, no build step).
4. Leave the build command empty and the output directory as `.` (root).
5. Deploy. Vercel gives you a URL like `https://your-repo.vercel.app`.
6. `vercel.json` is auto-detected and applies all the security headers and cache rules automatically.
7. **Custom domain:** Project → Settings → Domains → add your domain → follow the DNS instructions.

**Via CLI:**
```bash
npm install -g vercel
cd logic-pilot-website
vercel --prod
```

---

## Which one should you actually pick?

| | GitHub Pages | Netlify | Vercel |
|---|---|---|---|
| Cost | Free | Free tier | Free tier |
| Custom security headers | ❌ Not supported | ✅ via `netlify.toml` | ✅ via `vercel.json` |
| Setup effort | Low | Lowest (drag & drop) | Low (needs a git repo) |
| Custom domain + free HTTPS | ✅ | ✅ | ✅ |
| Form backend later | Needs a 3rd-party service either way | Has built-in Netlify Forms (just add `data-netlify="true"` to the form) | Needs a 3rd-party service |

**Recommendation:** Netlify, mainly because of the built-in security headers and the option to switch the contact form to Netlify Forms later without adding a separate service. GitHub Pages is fine if you specifically want it to live alongside your GitHub profile/repos and don't need the CSP/HSTS headers.

## After deploying, on any platform

- Run the site through Lighthouse in Chrome DevTools (or https://pagespeed.web.dev) once it's live on a real URL — see `WEBSITE_QA_REPORT.md` for what to expect and why an in-editor Lighthouse run wasn't possible during this build.
- Check `https://securityheaders.com` against your live URL if you deployed to Netlify or Vercel.
- Update `sitemap.xml`, `robots.txt`, the canonical links, and the JSON-LD `url` fields with your real domain if you haven't already.
- Submit the site to Google Search Console and paste in your `sitemap.xml` URL.
