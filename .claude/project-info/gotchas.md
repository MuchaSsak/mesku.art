# Gotchas & decisions (learned the hard way)

- GSAP delayed `from()` on an element with Tailwind `transition-all` freezes at the from-value. GSAP is now gone, but keep animated wrappers separate from elements with their own CSS transitions (`#about-me-cta` div wraps the link).
- Entrance animations are pure CSS (`main.css`, `@media (prefers-reduced-motion: no-preference)`), staggered via inline `style="--i: N"`. They start at first paint → no flash, no JS dependency for LCP.
- Chrome doesn't record LCP for an image whose compositor opacity animation starts at exactly 0 until it ends → `slide-in` keyframe starts at `opacity: 0.01`.
- Entrance animation targets the dedicated `.carousel-item` class, not `.splide__slide` (Splide clones slides for the loop; the old Grid extension also re-parented them).
- Native `loading=lazy` doesn't defer horizontally off-screen carousel slides in Chrome → later carousel images use Splide `lazyLoad: "nearby"` + transparent gif placeholder src.
- Homepage carousel used stale Supabase IDs after a June 2025 re-upload: `0_0.jpg` 404'd on prod, slide alts were wrong. Fixed by slug-based `featuredArtworkEntries` that restore the intended pieces (Joker = id 33, Strój = 32, Pęknięta kobieta = 60).
- Old vercel.json catch-all rewrite made robots.txt and unknown URLs return the homepage with 200 (soft 404s). Removed; 404.html serves real 404s.
- Python heredoc edits with `\b`, `\1`, `\s` in non-raw strings corrupt regexes — use the Edit tool for TS regex lines.
- Typo fixed in about text: "areozolu" → "aerozolu". Footer link pointed to dead https://mesku.art → now "/".
- `meta author` kept as "Mateusz Muszarski" (the developer/user) on purpose.
- Splide sets `role="group"`/`"tabpanel"` on slides; on `<li>` that is invalid ARIA (Lighthouse 13 "Agentic Browsing" category flags it). Carousel lists/slides are `<div>`s (Splide gives the list `role="presentation"`).
- Home carousel track has `h-80` (= Splide `height: "20rem"` = `CAROUSEL_SLIDE_HEIGHT` 320 in templates.ts) so the space is reserved before Splide mounts; without it desktop CLS ~0.02.
- 720px cover variant was considered and skipped: Chrome's srcset pick uses the geometric mean of adjacent densities, so it rarely chooses a slightly smaller variant anyway.
- Home carousel is an `autoWidth` filmstrip since 2026-10-23 (the user disliked the fixed-height mosaic grid: portraits got cropped, e.g. the writer's face). Every photo is shown whole at 20rem height; the width comes from an explicit inline `aspect-ratio: w / h` (NOT `auto`, which would use the 1x1 lazy placeholder gif's ratio and make Splide measure wrong widths). Related gotchas: the carousel wrapper needs `min-w-0` or the strip's intrinsic width blows out the home flex row; with autoWidth `perPage` is 1, so `lazyLoad: "nearby"` only reaches `preloadPages` slides ahead (set to 7); `.mount()` must stay at the end of the `new Splide(...)` chain, without it the carousel stays `visibility: hidden` and no error is logged. Splide Grid extension removed.
