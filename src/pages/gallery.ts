import { Splide } from "@splidejs/splide";

import {
  findArtwork,
  getSrcset,
  type Artwork,
  type ArtworkImage,
} from "../lib/artworks.ts";
import { SPLIDE_I18N } from "../lib/carousel.ts";
import { initNavigation } from "../lib/navigation.ts";

/** Search param of the art piece opened in the dialog, e.g. `?zdjecie=2pac` */
const ARTWORK_SEARCH_PARAM = "zdjecie";

const gallery = document.querySelector<HTMLUListElement>("#gallery")!;
const dialog = document.querySelector<HTMLDialogElement>("#artwork-dialog")!;
const dialogTitle = dialog.querySelector<HTMLElement>("#artwork-dialog-title")!;
const dialogCarousel = dialog.querySelector<HTMLElement>("[data-dialog-carousel]")!;

let carousel: Splide | null = null;
let openedSlug: string | null = null;

initNavigation();

/**
 * Rendered size of a photo inside the dialog: it is contained in a box of
 * the dialog's width and ~75vh height (see the dialog classes).
 */
function getDialogImageSizes({ width, height }: ArtworkImage) {
  const ratio = (width / height).toFixed(3);
  const fitHeight = (offset: number) => `calc((75vh - ${offset}px) * ${ratio})`;

  return [
    "(max-width: 639px) calc(95vw - 20px)",
    `(max-width: 767px) min(calc(95vw - 48px), ${fitHeight(100)})`,
    `(max-width: 1023px) min(calc(85vw - 96px), ${fitHeight(146)})`,
    `(max-width: 1759px) min(calc(70vw - 96px), ${fitHeight(146)})`,
    `min(calc(60vw - 96px), ${fitHeight(146)})`,
  ].join(", ");
}

function createSlide(image: ArtworkImage) {
  const slide = document.createElement("div");
  slide.className = "splide__slide flex justify-center items-center";

  const img = document.createElement("img");
  img.className = "sm:h-full max-sm:h-fit max-sm:w-full object-contain";
  img.width = image.width;
  img.height = image.height;
  img.alt = image.alt;
  img.decoding = "async";
  img.sizes = getDialogImageSizes(image);
  // Loaded by Splide when the slide is close to being shown
  img.dataset.splideLazy = image.variants.at(-1)!.url;
  img.dataset.splideLazySrcset = getSrcset(image.variants);

  slide.append(img);
  return slide;
}

function renderCarousel(artwork: Artwork) {
  carousel?.destroy();

  const root = document.createElement("section");
  root.className = "splide h-full flex flex-col justify-between gap-6";
  root.setAttribute("aria-label", `Zdjęcia pracy: ${artwork.title}`);

  const track = document.createElement("div");
  track.className = "splide__track h-full";

  const list = document.createElement("div");
  list.className = "splide__list items-center";
  list.append(...artwork.images.map(createSlide));

  track.append(list);
  root.append(track);
  dialogCarousel.replaceChildren(root);

  dialogTitle.textContent = artwork.title;

  return root;
}

function openArtwork(artwork: Artwork) {
  // Reopening the same art piece keeps the already loaded carousel
  const root = openedSlug === artwork.slug ? null : renderCarousel(artwork);
  openedSlug = artwork.slug;

  if (!dialog.open) dialog.showModal();

  if (!root) return;

  // Splide measures the slides, so mount once the dialog is displayed
  requestAnimationFrame(() => {
    carousel = new Splide(root, {
      height: "100%",
      perPage: 1,
      perMove: 1,
      pagination: artwork.images.length > 1,
      arrows: artwork.images.length > 1,
      lazyLoad: "nearby",
      preloadPages: 1,
      i18n: SPLIDE_I18N,
    }).mount();
  });
}

function getArtworkFromUrl() {
  const key = new URL(window.location.href).searchParams.get(ARTWORK_SEARCH_PARAM);
  return key ? findArtwork(key) : undefined;
}

function setArtworkInUrl(slug: string | null, mode: "push" | "replace") {
  const url = new URL(window.location.href);

  if (slug) url.searchParams.set(ARTWORK_SEARCH_PARAM, slug);
  else url.searchParams.delete(ARTWORK_SEARCH_PARAM);

  if (mode === "push") history.pushState({ artwork: slug }, "", url);
  else history.replaceState(null, "", url);
}

gallery.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-artwork]",
  );
  const artwork = button && findArtwork(button.dataset.artwork!);

  if (!artwork) return;

  openArtwork(artwork);
  setArtworkInUrl(artwork.slug, "push");
});

// Clicking the backdrop (the dialog element itself, outside of its content) closes it
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog
  .querySelector("[data-dialog-close]")!
  .addEventListener("click", () => dialog.close());

dialog.addEventListener("close", () => {
  if (!getArtworkFromUrl()) return;

  // Undo the history entry added when opening, so the back button does not reopen it
  if (history.state?.artwork) history.back();
  else setArtworkInUrl(null, "replace");
});

window.addEventListener("popstate", () => {
  const artwork = getArtworkFromUrl();

  if (artwork) openArtwork(artwork);
  else if (dialog.open) dialog.close();
});

// Opens the art piece from a shared link
const linkedArtwork = getArtworkFromUrl();

if (linkedArtwork) {
  setArtworkInUrl(linkedArtwork.slug, "replace");
  openArtwork(linkedArtwork);
}
