/** Site wide constants and per page metadata used by the HTML templates. */

export const SITE_URL = "https://www.mesku.pl";
export const SITE_NAME = "mesku.art";
export const THEME_COLOR = "#0bf";

export const ARTIST = {
  name: "Mariusz Chabasiński",
  /** Polish genitive case, e.g. "prace Mariusza Chabasińskiego" */
  nameGenitive: "Mariusza Chabasińskiego",
  alternateName: "mesku",
  birthYear: 1986,
  city: "Kołobrzeg",
  email: "chabasinskimariusz04@gmail.com",
  phone: "+48534012933",
  phoneDisplay: "+48 534 012 933",
};

/** Gallery thumbnails loaded eagerly, the top of the first column. Others are lazy. */
export const GALLERY_EAGER_IMAGES_COUNT = 2;
/** Carousel images loaded with the page (about what a wide layout shows), others are loaded by Splide when needed. */
export const CAROUSEL_EAGER_IMAGES_COUNT = 5;

export type PageId = "home" | "gallery" | "contact" | "notFound";

export interface PageMeta {
  id: PageId;
  /** Canonical path, `null` for pages which should not be indexed */
  path: string | null;
  title: string;
  description: string;
}

/** Keyed by the HTML entry file name. */
export const PAGES: Record<string, PageMeta> = {
  "index.html": {
    id: "home",
    path: "/",
    title: "mesku.art – graffiti i obrazy malowane aerografem | Mariusz Chabasiński",
    description:
      "Mariusz Chabasiński (mesku.art) z Kołobrzegu – graffiti, murale i obrazy malowane aerografem na płótnie i ścianach. Poznaj artystę i zobacz jego prace.",
  },
  "moje-prace.html": {
    id: "gallery",
    path: "/moje-prace",
    title: "Moje prace – graffiti, murale i aerograf | mesku.art",
    description:
      "Galeria ponad 120 prac Mariusza Chabasińskiego: portrety i obrazy malowane aerografem, graffiti na płótnie i murach oraz murale. Zobacz zdjęcia prac i ich pierwowzory.",
  },
  "kontakt.html": {
    id: "contact",
    path: "/kontakt",
    title: "Kontakt – zamów obraz aerografem lub graffiti | mesku.art",
    description:
      "Skontaktuj się z Mariuszem Chabasińskim (mesku.art) w sprawie obrazu malowanego aerografem, portretu, graffiti lub muralu. Telefon: +48 534 012 933.",
  },
  "404.html": {
    id: "notFound",
    path: null,
    title: "Nie znaleziono strony | mesku.art",
    description: "Ta strona nie istnieje lub została przeniesiona.",
  },
};

export const NAV_LINKS = [
  { href: "/moje-prace", label: "MOJE PRACE", icon: "images" },
  { href: "/kontakt", label: "KONTAKT", icon: "circleUser" },
] as const;

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).href;
}
