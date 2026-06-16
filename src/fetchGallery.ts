import Splide from "@splidejs/splide";

import getArtPieces from "../services/getArtPieces";
import { GALLERY_HIGH_FETCH_PRIORITY_IMAGES_AMOUNT } from "../utils/constants";
import { animateGalleryImages } from "./animations";

const galleryContainer =
  document.querySelector<HTMLDivElement>("#gallery-container");

if (!galleryContainer) {
  throw new Error("#gallery-container was not found");
}

const mountedSplides = new Map<number, Splide>();

function getPreviewImage(folder: ArtPieceImage[]): ArtPieceImage | null {
  return folder.find((image) => image.imageName === "0") ?? folder[0] ?? null;
}

function getFilenameFromUrl(url: string) {
  return url.split("/").at(-1)?.split(".")[0] ?? "";
}

function createPreviewButtonHtml(image: ArtPieceImage, index: number) {
  const isPriorityImage = index < GALLERY_HIGH_FETCH_PRIORITY_IMAGES_AMOUNT;

  return `
    <button
      type="button"
      class="gallery-image block w-full break-inside-avoid overflow-hidden mb-4 rounded-xl hover:rounded-md focus-within:rounded-md cursor-pointer [&:hover>img]:scale-105 [&:focus-within>img]:scale-105"
      data-gallery-index="${index}"
      aria-label="Otwórz galerię pracy"
    >
      <img
        class="duration-300 transition-all pointer-events-none block w-full h-auto"
        src="${image.imageUrl}"
        data-image-name="${image.imageName}"
        alt="Zdjęcie graffiti podgląd wszystkich prac mesku.art"
        loading="${isPriorityImage ? "eager" : "lazy"}"
        decoding="async"
        ${isPriorityImage ? 'fetchpriority="high"' : ""}
      />
    </button>
  `;
}

function createDialogHtml(folder: ArtPieceImage[], index: number) {
  return `
    <dialog
      tabindex="-1"
      class="gallery-dialog-${index} gallery-dialog fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-md:w-[95%] md:w-[85%] lg:w-[70%] 2xl:w-[60%] max-sm:h-fit sm:h-3/4 bg-black/25 backdrop-blur-md rounded-xl shadow-2xl border border-neutral-50/50 backdrop:bg-black/40 backdrop:fixed backdrop:z-40 backdrop:left-0 backdrop:top-0 backdrop:w-screen backdrop:h-screen text-neutral-50"
    >
      <div
        class="relative h-full overflow-x-hidden md:p-12 sm:p-6 max-sm:px-2.5 max-sm:py-6"
        data-dialog-content
      >
        <button
          type="button"
          data-dialog-close
          class="absolute z-[60] right-2.5 top-4 text-xl hover:scale-110 focus-within:scale-110 transition-[scale] duration-100 origin-center px-1.5"
          aria-label="Zamknij galerię"
          autofocus
        >
          &#10006;
        </button>

        <div
          class="splide splide-${index} h-full flex flex-col justify-between gap-6"
          aria-label="Wgląd mojej pracy wraz ze związanymi zdjęciami w karuzeli"
        >
          <div class="splide__track h-full">
            <ul class="splide__list items-center">
              ${folder
                .map(
                  (image) => `
                    <li class="splide__slide flex justify-center items-center">
                      <img
                        data-splide-lazy="${image.imageUrl}"
                        class="sm:h-full max-sm:h-fit max-sm:w-full object-contain"
                        alt="Zdjęcie pracy mesku.art"
                        decoding="async"
                      />
                    </li>
                  `,
                )
                .join("")}
            </ul>
          </div>
        </div>
      </div>
    </dialog>
  `;
}

function createDialogIfNeeded(folder: ArtPieceImage[], index: number) {
  let dialog = document.querySelector<HTMLDialogElement>(
    `.gallery-dialog-${index}`,
  );

  if (dialog) return dialog;

  document.body.insertAdjacentHTML(
    "beforeend",
    createDialogHtml(folder, index),
  );

  dialog = document.querySelector<HTMLDialogElement>(
    `.gallery-dialog-${index}`,
  );

  if (!dialog) {
    throw new Error(`Dialog .gallery-dialog-${index} could not be created`);
  }

  const dialogContent = dialog.querySelector<HTMLElement>(
    "[data-dialog-content]",
  );

  const closeButton = dialog.querySelector<HTMLButtonElement>(
    "[data-dialog-close]",
  );

  dialog.addEventListener("click", () => {
    dialog?.close();
  });

  dialogContent?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  closeButton?.addEventListener("click", () => {
    dialog?.close();
  });

  dialog.addEventListener("cancel", () => {
    dialog?.close();
  });

  return dialog;
}

function mountSplideIfNeeded(index: number) {
  if (mountedSplides.has(index)) return;

  const splide = new Splide(`.splide-${index}`, {
    height: "100%",
    perPage: 1,
    perMove: 1,
    pagination: true,
    arrows: true,

    lazyLoad: "nearby",
    preloadPages: 1,
  });

  splide.mount();

  mountedSplides.set(index, splide);
}

function updateUrlWithClickedImage(buttonElement: HTMLButtonElement) {
  const imageElement = buttonElement.querySelector<HTMLImageElement>("img");
  const imageUrl = imageElement?.getAttribute("src");

  if (!imageUrl) return;

  const clickedFilename = getFilenameFromUrl(imageUrl);

  if (!clickedFilename) return;

  const url = new URL(window.location.href);
  url.searchParams.set("zdjecie", clickedFilename);
  history.pushState(null, "", url);
}

(async function initGallery() {
  try {
    const artPieces = await getArtPieces();

    if (!artPieces || artPieces.length === 0) {
      throw new Error("Something went wrong whilst fetching the art pieces");
    }

    const previewImages = artPieces
      .map((folder) => getPreviewImage(folder))
      .filter((image): image is ArtPieceImage => Boolean(image));

    galleryContainer.insertAdjacentHTML(
      "beforeend",
      previewImages
        .map((image, index) => createPreviewButtonHtml(image, index))
        .join(""),
    );

    animateGalleryImages();

    galleryContainer.addEventListener("click", (event) => {
      const buttonElement = (
        event.target as HTMLElement
      ).closest<HTMLButtonElement>("[data-gallery-index]");

      if (!buttonElement) return;

      const galleryIndex = Number(buttonElement.dataset.galleryIndex);

      if (Number.isNaN(galleryIndex)) return;

      const folder = artPieces[galleryIndex];

      if (!folder) return;

      const dialog = createDialogIfNeeded(folder, galleryIndex);

      dialog.showModal();

      requestAnimationFrame(() => {
        mountSplideIfNeeded(galleryIndex);
      });

      updateUrlWithClickedImage(buttonElement);
    });
  } catch (err) {
    console.error(err);
  }
})();
