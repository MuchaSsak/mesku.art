# Gotchas & decisions (learned the hard way)

- GSAP delayed `from()` on an element with Tailwind `transition-all` freezes at the from-value. GSAP is now gone, but keep animated wrappers separate from elements with their own CSS transitions (`#about-me-cta` div wraps the link).
- Entrance animations are pure CSS (`main.css`, `@media (prefers-reduced-motion: no-preference)`), staggered via inline `style="--i: N"`. They start at first paint → no flash, no JS dependency for LCP.
- Chrome doesn't record LCP for an image whose compositor opacity animation starts at exactly 0 until it ends → `slide-in` keyframe starts at `opacity: 0.01`.
- Splide Grid re-parents original slides (adds `splide__slide__col`, new wrapper li's are also `.splide__slide`) → animate the dedicated `.carousel-item` class, not `.splide__slide`.
- Native `loading=lazy` doesn't defer horizontally off-screen carousel slides in Chrome → later carousel images use Splide `lazyLoad: "nearby"` + transparent gif placeholder src.
- Homepage carousel used stale Supabase IDs after a June 2025 re-upload: `0_0.jpg` 404'd on prod, slide alts were wrong. Fixed by slug-based `featuredArtworkEntries` that restore the intended pieces (Joker = id 33, Strój = 32, Pęknięta kobieta = 60).
- Old vercel.json catch-all rewrite made robots.txt and unknown URLs return the homepage with 200 (soft 404s). Removed; 404.html serves real 404s.
- Python heredoc edits with `\b`, `\1`, `\s` in non-raw strings corrupt regexes — use the Edit tool for TS regex lines.
- Typo fixed in about text: "areozolu" → "aerozolu". Footer link pointed to dead https://mesku.art → now "/".
- `meta author` kept as "Mateusz Muszarski" (the developer/user) on purpose.
- Splide sets `role="group"`/`"tabpanel"` on slides; on `<li>` that is invalid ARIA (Lighthouse 13 "Agentic Browsing" category flags it). Carousel lists/slides are `<div>`s (Splide gives the list `role="presentation"`).
- Home carousel track has `h-72` (= Splide `height: "18rem"`) so the space is reserved before Splide mounts; without it desktop CLS ~0.02.
- 720px cover variant was considered and skipped: Chrome's srcset pick uses the geometric mean of adjacent densities, so it rarely chooses a slightly smaller variant anyway.
