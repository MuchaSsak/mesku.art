/**
 * Vite plugin which turns the HTML entries into complete static pages:
 * replaces `<!-- site:<partial> -->` placeholders with the shared head, navbar,
 * footer and the art piece markup, and emits `sitemap.xml` and `robots.txt`.
 */

import { basename } from "node:path";
import type { Plugin } from "vite";

import { artworks, getFeaturedArtworks } from "../../src/lib/artworks.ts";
import { PAGES, type PageMeta } from "./config.ts";
import { getStructuredData, renderSitemap, ROBOTS_TXT } from "./seo.ts";
import {
  renderCarouselSlides,
  renderFooter,
  renderGalleryItems,
  renderHead,
  renderNav,
  splitHeadingChars,
} from "./templates.ts";

const PARTIALS: Record<string, (page: PageMeta) => string> = {
  head: (page) => renderHead(page, getStructuredData(page)),
  nav: renderNav,
  footer: renderFooter,
  carousel: () => renderCarouselSlides(getFeaturedArtworks()),
  gallery: () => renderGalleryItems(artworks),
};

const GENERATED_FILES: Record<string, { contentType: string; render: () => string }> = {
  "sitemap.xml": { contentType: "application/xml", render: renderSitemap },
  "robots.txt": { contentType: "text/plain", render: () => ROBOTS_TXT },
};

export default function site(): Plugin {
  return {
    name: "mesku:site",

    transformIndexHtml: {
      order: "pre",
      handler(html, { filename }) {
        const page = PAGES[basename(filename)];

        if (!page) {
          throw new Error(`Missing metadata for ${filename} in plugins/site/config.ts`);
        }

        const withPartials = html.replace(/<!-- site:(\w+) -->/g, (_, name: string) => {
          const render = PARTIALS[name];
          if (!render) throw new Error(`Unknown partial "${name}" in ${filename}`);
          return render(page);
        });

        return splitHeadingChars(withPartials);
      },
    },

    configureServer(server) {
      for (const [fileName, { contentType, render }] of Object.entries(GENERATED_FILES)) {
        server.middlewares.use(`/${fileName}`, (_, res) => {
          res.setHeader("Content-Type", contentType);
          res.end(render());
        });
      }
    },

    generateBundle() {
      for (const [fileName, { render }] of Object.entries(GENERATED_FILES)) {
        this.emitFile({ type: "asset", fileName, source: render() });
      }
    },
  };
}
