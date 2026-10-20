/** Structured data (JSON-LD) and the sitemap. */

import {
  artworks,
  getFeaturedArtworks,
  MEDIUM_LABELS,
  type ArtworkImage,
} from "../../src/lib/artworks.ts";
import {
  ARTIST,
  PAGES,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  type PageMeta,
} from "./config.ts";

const ARTIST_ID = absoluteUrl("/#artist");
const WEBSITE_ID = absoluteUrl("/#website");

const largestImageUrl = (image: ArtworkImage) =>
  absoluteUrl(image.variants.at(-1)!.url);

function getArtist() {
  return {
    "@type": "Person",
    "@id": ARTIST_ID,
    name: ARTIST.name,
    alternateName: ARTIST.alternateName,
    jobTitle: "Artysta – graffiti i aerograf",
    birthDate: String(ARTIST.birthYear),
    address: {
      "@type": "PostalAddress",
      addressLocality: ARTIST.city,
      addressCountry: "PL",
    },
    email: `mailto:${ARTIST.email}`,
    telephone: ARTIST.phone,
    url: absoluteUrl("/"),
    knowsAbout: ["Graffiti", "Aerograf", "Malarstwo", "Murale", "Portrety"],
  };
}

const PAGE_TYPES: Record<PageMeta["id"], string> = {
  home: "ProfilePage",
  gallery: "CollectionPage",
  contact: "ContactPage",
  notFound: "WebPage",
};

export function getStructuredData(page: PageMeta) {
  if (!page.path) return null;

  const url = absoluteUrl(page.path);
  const webPage: Record<string, unknown> = {
    "@type": PAGE_TYPES[page.id],
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: "pl-PL",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ARTIST_ID },
  };

  if (page.id === "home") {
    webPage.mainEntity = { "@id": ARTIST_ID };
    const { cover } = getFeaturedArtworks()[0].artwork;
    webPage.primaryImageOfPage = {
      "@type": "ImageObject",
      contentUrl: largestImageUrl(cover),
      width: cover.width,
      height: cover.height,
    };
  }

  if (page.id === "gallery") {
    webPage.mainEntity = {
      "@type": "ImageGallery",
      name: "Prace mesku.art",
      numberOfItems: artworks.length,
      associatedMedia: artworks.map((artwork) => ({
        "@type": "ImageObject",
        contentUrl: largestImageUrl(artwork.cover),
        name: artwork.title,
        description: artwork.cover.alt,
        artMedium: MEDIUM_LABELS[artwork.medium],
        creator: { "@type": "Person", "@id": ARTIST_ID, name: ARTIST.name },
        creditText: ARTIST.name,
        copyrightNotice: `© ${ARTIST.name}`,
      })),
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: absoluteUrl("/"),
        name: SITE_NAME,
        inLanguage: "pl-PL",
        publisher: { "@id": ARTIST_ID },
      },
      getArtist(),
      webPage,
    ],
  };
}

/** Sitemap with an image extension, so all photos get indexed by Google Images. */
export function renderSitemap() {
  const imagesByPath: Record<string, ArtworkImage[]> = {
    "/": getFeaturedArtworks().map(({ artwork }) => artwork.cover),
    "/moje-prace": artworks.flatMap((artwork) => artwork.images),
  };

  const urls = Object.values(PAGES)
    .filter((page) => page.path)
    .map((page) => {
      const images = (imagesByPath[page.path!] ?? [])
        .map((image) => `\n    <image:image><image:loc>${largestImageUrl(image)}</image:loc></image:image>`)
        .join("");

      return `  <url>\n    <loc>${absoluteUrl(page.path!)}</loc>${images}\n  </url>`;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`;
}

export const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
