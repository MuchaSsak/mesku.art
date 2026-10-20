# mesku.art – notes for Claude

Portfolio of the graffiti / airbrush artist Mariusz Chabasiński. Static Vite + TypeScript + Tailwind v4 site on Vercel (https://www.mesku.pl). UI copy is Polish.

## Project wiki (`.claude/project-info/`)

| File | Read when |
| --- | --- |
| [architecture.md](.claude/project-info/architecture.md) | Touching any code: file layout, site plugin, data flow, deps |
| [images.md](.claude/project-info/images.md) | Adding/replacing art pieces, image sizes, encoding, originals |
| [gotchas.md](.claude/project-info/gotchas.md) | Animations, carousel, LCP/Lighthouse, Vercel routing, past bugs |
| [progress.md](.claude/project-info/progress.md) | Resuming work: current task status and TODO |

## Commands
- `yarn dev` – dev server
- `yarn build` – type-check + production build (`dist/`)
- `yarn images <source-dir>` – convert new/changed photos into `public/art` + `src/data/images.json`

Keep the wiki up to date when something non-obvious is learned.
