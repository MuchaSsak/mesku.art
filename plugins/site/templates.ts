/** HTML partials injected into the pages by the site plugin. */

import {
  getSrcset,
  type Artwork,
  type ArtworkImage,
} from "../../src/lib/artworks.ts";
import {
  ARTIST,
  CAROUSEL_EAGER_IMAGES_COUNT,
  GALLERY_EAGER_IMAGES_COUNT,
  NAV_LINKS,
  SITE_NAME,
  THEME_COLOR,
  absoluteUrl,
  type PageMeta,
} from "./config.ts";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const ICON_ATTRIBUTES =
  'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

/** Lucide icons */
export const ICONS = {
  images: `<svg ${ICON_ATTRIBUTES} stroke-width="1.5"><path d="M18 22H4a2 2 0 0 1-2-2V6" /><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" /><circle cx="12" cy="8" r="2" /><rect width="16" height="16" x="6" y="2" rx="2" /></svg>`,
  circleUser: `<svg ${ICON_ATTRIBUTES} stroke-width="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></svg>`,
} as const;

export function renderHead(page: PageMeta, structuredData: object | null) {
  const canonicalUrl = page.path ? absoluteUrl(page.path) : null;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);

  return [
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    canonicalUrl
      ? `<link rel="canonical" href="${canonicalUrl}" />`
      : '<meta name="robots" content="noindex" />',
    `<meta name="theme-color" content="${THEME_COLOR}" />`,
    '<meta name="author" content="Mateusz Muszarski" />',
    '<meta name="keywords" content="Graffiti, Rysunki, Prace, Aerograf, Plakaty, Artysta, Sztuka, Malowanie, Farby, Kołobrzeg" />',
    `<meta name="application-name" content="${SITE_NAME}" />`,
    // Open Graph & Twitter
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    '<meta property="og:locale" content="pl_PL" />',
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    canonicalUrl ? `<meta property="og:url" content="${canonicalUrl}" />` : "",
    `<meta property="og:image" content="${absoluteUrl("/og-image.jpg")}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="Wybrane prace ${ARTIST.nameGenitive}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    // Icons
    '<link rel="icon" href="/favicon.ico" sizes="32x32" />',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    // Styles
    '<link rel="preload" href="/src/assets/fonts/plus-jakarta-sans.woff2" as="font" type="font/woff2" crossorigin />',
    '<link rel="stylesheet" href="/src/styles/main.css" />',
    structuredData
      ? `<script type="application/ld+json">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");
}

export function renderNav(page: PageMeta) {
  const links = NAV_LINKS.map((link) => {
    const isCurrent = link.href === page.path;
    const content = `<span>${link.label}</span>${ICONS[link.icon]}`;

    return isCurrent
      ? `<li class="opacity-60"><a class="flex items-center gap-2 pointer-events-none" href="${link.href}" aria-current="page">${content}</a></li>`
      : `<li class="hover:tracking-wide hover:font-semibold focus-within:tracking-wide focus-within:font-semibold transition-all"><a class="flex items-center gap-2" href="${link.href}">${content}</a></li>`;
  }).join('\n        <li class="text-xs select-none max-md:hidden" aria-hidden="true">∙</li>\n        ');

  return `<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-neutral-50 focus:px-4 focus:py-2 focus:font-medium focus:text-black">Przejdź do treści</a>

    <!-- NavBar -->
    <nav
      id="site-nav"
      aria-label="Główna nawigacja"
      class="sticky top-0 left-0 z-30 bg-neutral-50 h-20 transition-[height] ease-in-out duration-300 py-1.5 px-side flex justify-between items-start shadow overflow-hidden"
    >
      <!-- Logo -->
      <a class="h-fit" href="/">
        <img src="/src/assets/images/logo.svg" class="h-16 w-auto" width="333" height="244" alt="${SITE_NAME} – strona główna" />
      </a>

      <!-- Hamburger menu button -->
      <button
        id="hamburger-menu-btn"
        type="button"
        aria-label="Menu"
        aria-expanded="false"
        aria-controls="site-menu"
        class="md:hidden p-2 pt-7 flex flex-col gap-1.5 justify-center items-end before:w-6 before:h-0.5 before:bg-black before:content-[''] before:block before:transition-[width] before:duration-200 after:w-4 after:h-0.5 after:bg-black after:content-[''] after:block after:transition-[width] after:duration-200"
      ></button>

      <!-- Links -->
      <ul
        id="site-menu"
        class="flex items-center gap-5 font-medium text-lg pt-[1.125rem] max-md:absolute max-md:flex-col max-md:top-20 max-md:items-start"
      >
        ${links}
      </ul>
    </nav>`;
}

export function renderFooter() {
  const linkClass =
    "inline-block py-1 hover:underline hover:text-neutral-50 focus-visible:underline focus-visible:text-neutral-50";

  return `<!-- Footer -->
    <footer class="h-24 bg-black/75 text-neutral-300 flex items-center justify-between px-side max-xs:text-xs">
      <!-- Copyright -->
      <small class="max-sm:flex max-sm:flex-col">
        <span>
          <span>&copy; ${new Date().getFullYear()}</span>
          <a class="${linkClass}" href="/">${SITE_NAME}</a>
        </span>
        <span class="max-sm:hidden" aria-hidden="true">&dash;</span>
        <span>Wszystkie prawa zastrzeżone</span>
      </small>

      <!-- Contact info -->
      <small class="max-sm:flex max-sm:flex-col max-sm:text-right">
        <a class="${linkClass}" href="mailto:${ARTIST.email}">${ARTIST.email}</a>
        <span class="px-2 max-sm:hidden" aria-hidden="true">|</span>
        <a class="${linkClass}" href="tel:${ARTIST.phone}">${ARTIST.phoneDisplay}</a>
      </small>
    </footer>`;
}

/* --------------------------------- Images --------------------------------- */

/**
 * Rendered width of gallery thumbnails, mirrors `columns-sm gap-4` inside
 * `px-side` (column count grows every ~400px of the viewport).
 */
const GALLERY_THUMBNAIL_SIZES = [
  "(min-width: 2112px) calc(20vw - 38px)",
  "(min-width: 1664px) calc(25vw - 32px)",
  "(min-width: 1248px) calc(33.3vw - 37px)",
  "(min-width: 848px) calc(50vw - 40px)",
  "(min-width: 640px) calc(100vw - 64px)",
  "calc(100vw - 32px)",
].join(", ");

/**
 * Carousel tiles take at most a whole page, which is half of the carousel
 * (perPage: 2). Below 640px a page is the whole carousel, split in 2 columns.
 */
const CAROUSEL_TILE_SIZES =
  "(min-width: 1280px) calc(25vw - 24px), (min-width: 640px) calc(50vw - 32px), calc(50vw - 19px)";

/** Transparent pixel, keeps the `<img>` valid until Splide loads the real image */
const PLACEHOLDER_SRC =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

interface ImageOptions {
  sizes: string;
  /**
   * - eager: loaded with the page
   * - lazy: native lazy loading, the width is taken from the layout (`sizes="auto"`)
   * - splide: loaded by Splide's `lazyLoad` right before its slide is shown
   */
  loading: "eager" | "lazy" | "splide";
  highPriority?: boolean;
  className: string;
}

function renderImage(image: ArtworkImage, options: ImageOptions) {
  const src = image.variants.at(-1)!.url;
  const srcset = getSrcset(image.variants);
  const sources =
    options.loading === "splide"
      ? `src="${PLACEHOLDER_SRC}"
          data-splide-lazy="${src}"
          data-splide-lazy-srcset="${srcset}"`
      : `src="${src}"
          srcset="${srcset}"`;

  return `<img
          class="${options.className}"
          ${sources}
          sizes="${options.loading === "lazy" ? `auto, ${options.sizes}` : options.sizes}"
          width="${image.width}"
          height="${image.height}"
          alt="${escapeHtml(image.alt)}"
          ${options.loading === "lazy" ? 'loading="lazy"' : ""}
          decoding="async"
          ${options.highPriority ? 'fetchpriority="high"' : ""}
        />`.replace(/\n\s*\n/g, "\n");
}

export function renderCarouselSlides(
  slides: { artwork: Artwork; brighten?: boolean }[],
) {
  return slides
    .map(({ artwork, brighten }, index) => {
      const isLast = index === slides.length - 1;
      const image = renderImage(artwork.cover, {
        sizes: CAROUSEL_TILE_SIZES,
        loading: index < CAROUSEL_EAGER_IMAGES_COUNT ? "eager" : "splide",
        highPriority: index < 2,
        className: [
          "h-full w-full object-cover",
          brighten && "brightness-110",
          isLast && "transition-[scale] duration-300",
        ]
          .filter(Boolean)
          .join(" "),
      });

      const itemAttributes = `class="splide__slide carousel-item flex justify-center items-center overflow-hidden${isLast ? " relative" : ""}" style="--i: ${index}"`;

      if (!isLast) {
        return `<div ${itemAttributes}>
        ${image}
      </div>`;
      }

      return `<div ${itemAttributes}>
        <a
          class="bg-black/50 absolute left-0 top-0 h-full w-full z-10 text-neutral-50 font-semibold [&:hover+img]:scale-110 [&:focus-visible+img]:scale-110 hover:font-bold cursor-help! flex items-center justify-center"
          href="/moje-prace"
        >Zobacz więcej<span class="sr-only"> prac</span></a>
        ${image}
      </div>`;
    })
    .join("\n      ");
}

export function renderGalleryItems(artworks: Artwork[]) {
  return artworks
    .map((artwork, index) => {
      const { cover } = artwork;
      const image = renderImage(cover, {
        sizes: GALLERY_THUMBNAIL_SIZES,
        loading: index < GALLERY_EAGER_IMAGES_COUNT ? "eager" : "lazy",
        highPriority: index === 0,
        className:
          "block w-full h-auto duration-300 transition-all pointer-events-none",
      });

      return `<li class="gallery-item break-inside-avoid mb-4" style="--i: ${index}">
      <button
        type="button"
        class="block w-full overflow-hidden rounded-xl hover:rounded-md focus-visible:rounded-md cursor-pointer [&:hover>img]:scale-105 [&:focus-visible>img]:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-50"
        style="background-color: ${cover.color}"
        data-artwork="${artwork.slug}"
        aria-haspopup="dialog"
      >
        ${image}
      </button>
    </li>`;
    })
    .join("\n    ");
}

/**
 * Wraps every character of the text in its own span, so they can be animated
 * one by one (`.split-char` in main.css). The element gets the whole text as
 * its accessible name, so screen readers don't spell it out.
 */
export function splitHeadingChars(html: string) {
  return html.replace(
    /<(h[1-6])\b([^>]*)\sdata-split-chars([^>]*)>([^<]*)<\/\1>/g,
    (_, tag: string, before: string, after: string, rawText: string) => {
      if (rawText.includes("&")) {
        throw new Error(`Headings with data-split-chars can't contain HTML entities: "${rawText.trim()}"`);
      }

      const text = rawText.trim().replace(/\s+/g, " ");
      let index = 0;

      const words = text.split(" ").map((word) => {
        const chars = [...word]
          .map((char) => `<span class="split-char inline-block" style="--i: ${index++}">${char}</span>`)
          .join("");
        return `<span class="inline-block whitespace-nowrap">${chars}</span>`;
      });

      return `<${tag}${before}${after} aria-label="${escapeHtml(text)}"><span aria-hidden="true">${words.join(" ")}</span></${tag}>`;
    },
  );
}
