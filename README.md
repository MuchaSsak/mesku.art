# mesku.art 🎨

Portfolio website of the graffiti and airbrush artist Mariusz Chabasiński.

If you want to see the project live, [click here](https://www.mesku.pl). 🚀

## Stack

- Static multi-page site built with [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/) and [Tailwind CSS](https://tailwindcss.com/), hosted on [Vercel](https://vercel.com/).
- No backend: the art pieces are optimized WebP images served from `public/art/` with immutable caching.
- Pages are rendered at build time by a small Vite plugin (`plugins/site/`), which also generates the meta tags, structured data (JSON-LD), `sitemap.xml` (with images) and `robots.txt`.
- Carousels use [Splide](https://splidejs.com/), animations are plain CSS.

## Scripts

Requires Node.js 22.18 or newer and Yarn.

| Command | Description |
| --- | --- |
| `yarn dev` | Start the dev server |
| `yarn build` | Type-check and build the site into `dist/` |
| `yarn preview` | Preview the production build |
| `yarn images <source-dir>` | Convert new or changed photos of the art pieces |

## Adding art pieces

1. Add an entry (`id`, `slug`, `title`, `medium`) to `src/data/artworks.ts`. To show the piece in the home page carousel, add it to `featuredArtworkEntries`.
2. Put its photos in a folder outside the repository, named `{id}_0.jpg` (cover), `{id}_1.jpg`, … and optionally `{id}_reference.jpg` (the image the piece was based on).
3. Run `yarn images <that-folder>`. Only new or changed photos are processed, the results go to `public/art/<slug>/` and `src/data/images.json` (do not edit it by hand).
4. Commit the changes. The gallery, carousel, alt texts and the sitemap are updated automatically.

## License

[MIT](https://choosealicense.com/licenses/mit/)
