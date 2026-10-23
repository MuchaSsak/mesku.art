# Image pipeline

- Command: `yarn images <source-dir>` → `node scripts/optimize-images.ts` (Node ≥22.18, native TS type stripping; imports use `.ts` extensions).
- Source naming: `{id}_{n}.{jpg|jpeg|png|webp|avif|tif}` and `{id}_reference.{ext}`; id must exist in `src/data/artworks.ts`.
- Incremental: sha256(ENCODER_VERSION + bytes)[:8] hash; unchanged photos skipped; changed ones replace old files; slugs removed from catalog get their folder deleted.
- Output: `public/art/<slug>/<base>-<width>w.<hash>.webp`; base = slug | slug-N (N = n+1) | slug-pierwowzor (reference). Hash in filename → immutable caching.
- Variants by LONG edge (never upscale): cover photo ("0") 480/960/1600, other photos 960/1600. WebP q80 effort 6 smartSubsample (visually lossless at 1:1, checked with crops), each variant encoded straight from the source (`webp-q80-v2`; v1 accidentally went through a JPEG q80 intermediate). Source names are normalized (`1_Reference.JPG`, `1_01.jpg`), duplicates rejected, old files deleted only after the manifest is written. EXIF rotation applied. Dominant color stored as placeholder.
- Result: 252 photos → 591 files, ~64MB (originals were 102MB of 12MP JPEGs served raw from Supabase).
- Originals (2026-10-23): `C:\Users\Mucha\Desktop\mesku.art-originals` was missing, so it was recreated with ONLY the 2026-10 batch below. The old 252 originals are not there. If they get restored, copy the new files over them and delete `114_1.*`, or the next `yarn images` run would bring back the replaced photos.
- Earlier originals history: moved out of the repo to `C:\Users\Mucha\Desktop\mesku.art-originals` (run `yarn images ../mesku.art-originals`). `31_.jpg` was renamed to `31_reference.jpg` (Madonna reference, previously hidden by a bug); `30_1.jpeg` was missing locally and downloaded from the Supabase bucket. Local set now == bucket (252 files).
- One-off assets (not part of script): background webp (1920 q70 for <64rem, 2859 q70 for ≥64rem — grain must stay visible), logo.svg (potrace of alpha mask, fill #1c1c1c, viewBox 0 0 1332 976), apple-touch-icon 180, og-image 1200x630 (2Pac, Joker pop-art, Maska, Sektor), font subset via fonttools pyftsubset.
- Sizes: gallery thumbnails `auto, <column math>`; carousel explicit px = 320 × aspect ratio per image (no auto! off-screen slides resolve auto as 100vw → huge downloads); dialog per-aspect `min(calc(Xvw - Ypx), calc((75vh - Zpx) * ratio))`.

## Artwork vs reference (pierwowzór)
- **Artwork** = a photo of the finished physical piece: board/canvas with a white margin, lying on a table, bedspread or cutting mat, usually with the signature (`Chabasiński 'YY`) and `www.mesku.pl` in the corners. Cover `{id}_0` = the cleanest, flattest shot; extra angles or in-situ shots go to `{id}_1`, `{id}_2`…
- **Reference** = what the artist painted from: a client photo (often b/w, a selfie or a phone screenshot), a logo, a poster, a film still or a digital illustration. There is no board edge and no signature. Saved as `{id}_reference`, shown last in the dialog as „pierwowzór”.
- Only ONE reference slot per piece. When the artist sends several reference photos (e.g. one per person in a group portrait), combine them side by side into one JPEG (q95, 4:4:4, the same order as the people in the painting) and crop off any phone UI. The older `portret-pieciu-osob` keeps its reference photos as `_1…_4`, a legacy exception.
- The artist sends things over WhatsApp in this order: painting, then its reference(s), or the reverse. Pair them by subject, not by timestamp alone, and check the chat text for „zamień” (replace an existing piece's photo instead of adding a new piece).
- New pieces get the next free id. Gallery order = the order of `artworkEntries` (not the id), new pieces are appended at the end unless the artist wants them elsewhere. Pinned at the top: `writer-w-czerwonej-bluzie` (id 125, artist's request 2026-10-20, also first in the home carousel). Titles are descriptive Polish, without client names.

## Batch log
### 2026-10-23 (WhatsApp 2026-10-20/21, 15 files)
| Source (WhatsApp Image …) | Saved as | Role |
| --- | --- | --- |
| 10-20 19.37.19 | `8_0` piec-dwa-debiec | artwork, **replaces** the old cover (artist: one guy had no ear) |
| 10-20 19.19.15 | `114_0` portret-kobiety | artwork, **replaces** the old cover (artist: better quality); old `_1` (a second shot of the same painting) removed from the manifest + files by hand; old reference kept |
| 10-20 19.15.08 | `124_0` podwojny-portret-sluchawki | artwork (no reference) |
| 10-20 19.15.41 | `125_0` writer-w-czerwonej-bluzie | artwork (no reference) |
| 10-20 19.16.32 / 19.16.52 | `126_0` / `126_1` portret-mlodej-pary | artwork: flat shot / on a shelf |
| 10-20 19.17.24 / 19.17.37 | `127_0` / `127_reference` tdw-logo | artwork / logo |
| 10-20 19.17.54 / 19.18.13 | `128_0` / `128_reference` portret-pary-w-sercu | artwork / b/w photo with a „Kocham Cię” frame |
| 10-20 19.18.33 + 19.20.17 + 19.18.47 | `129_0` / `129_reference` portret-pary-w-okularach | artwork / woman + man photos combined (man cropped out of a phone screenshot, rows 248–1787) |
| 10-21 05.53.14 / 05.53.06 | `130_0` / `130_reference` kon-na-blekitnym-tle | artwork / digital horse illustration |
