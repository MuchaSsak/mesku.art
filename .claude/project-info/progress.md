# Status

## 2026-10-20: optimization rewrite (committed, user pushes)
Clean code, static optimized images instead of Supabase, SEO (meta, JSON-LD, image sitemap, robots, real 404), a11y, CSS animations instead of GSAP. Originals moved to `C:\Users\Mucha\Desktop\mesku.art-originals`.

Verified before commit (local Vercel-like server): `yarn build` OK, e2e 53/53, Lighthouse mobile home 97 / gallery 94 / contact 100, desktop 100 / 97 / 100, A11y/BP/SEO/Agentic Browsing 100 everywhere. Baseline live site was mobile 40 / 70 / 95, SEO 92.

## Waiting on the user
- Push + Vercel deploy, then delete the Supabase project (site no longer uses it).
- Optional: apex mesku.pl → www redirect 307 → 308 in Vercel domains; submit `https://www.mesku.pl/sitemap.xml` in Google Search Console; artist reviews titles in `src/data/artworks.ts`.

## Possible future work
- More cover widths only if real-device data shows oversized thumbnails (see gotchas: srcset geometric mean).

## Scratchpad tools (session temp dir, may be gone)
`vercel-like-server.mjs <dist> <vercel.json> <port>`, `lhsum.cjs <reports>`, `tools/e2e.cjs <base> <outdir>` (playwright-core + system Chrome).
Lighthouse: `npx --no-install lighthouse <url> --quiet --chrome-flags="--headless=new" [--preset=desktop] --output=json --output-path=…`.
