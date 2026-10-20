# Image pipeline

- Command: `yarn images <source-dir>` → `node scripts/optimize-images.ts` (Node ≥22.18, native TS type stripping; imports use `.ts` extensions).
- Source naming: `{id}_{n}.{jpg|jpeg|png|webp|avif|tif}` and `{id}_reference.{ext}`; id must exist in `src/data/artworks.ts`.
- Incremental: sha256(ENCODER_VERSION + bytes)[:8] hash; unchanged photos skipped; changed ones replace old files; slugs removed from catalog get their folder deleted.
- Output: `public/art/<slug>/<base>-<width>w.<hash>.webp`; base = slug | slug-N (N = n+1) | slug-pierwowzor (reference). Hash in filename → immutable caching.
- Variants by LONG edge (never upscale): cover photo ("0") 480/960/1600, other photos 960/1600. WebP q80 effort 6 smartSubsample (visually lossless at 1:1, checked with crops), each variant encoded straight from the source (`webp-q80-v2`; v1 accidentally went through a JPEG q80 intermediate). Source names are normalized (`1_Reference.JPG`, `1_01.jpg`), duplicates rejected, old files deleted only after the manifest is written. EXIF rotation applied. Dominant color stored as placeholder.
- Result: 252 photos → 591 files, ~64MB (originals were 102MB of 12MP JPEGs served raw from Supabase).
- Originals: moved out of the repo to `C:\Users\Mucha\Desktop\mesku.art-originals` (run `yarn images ../mesku.art-originals`). `31_.jpg` was renamed to `31_reference.jpg` (Madonna reference, previously hidden by a bug); `30_1.jpeg` was missing locally and downloaded from the Supabase bucket. Local set now == bucket (252 files).
- One-off assets (not part of script): background webp (1920 q70 for <64rem, 2859 q70 for ≥64rem — grain must stay visible), logo.svg (potrace of alpha mask, fill #1c1c1c, viewBox 0 0 1332 976), apple-touch-icon 180, og-image 1200x630 (2Pac, Joker pop-art, Maska, Sektor), font subset via fonttools pyftsubset.
- Sizes: gallery thumbnails `auto, <column math>`; carousel explicit (no auto! off-screen slides resolve auto as 100vw → huge downloads); dialog per-aspect `min(calc(Xvw - Ypx), calc((75vh - Zpx) * ratio))`.
