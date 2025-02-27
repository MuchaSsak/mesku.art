import Splide from "@splidejs/splide";

import getArtPieces from "../services/getArtPieces";
import { GALLERY_HIGH_FETCH_PRIORITY_IMAGES_AMOUNT } from "../utils/constants";
import { animateGalleryImages } from "./animations";

// Insert each art pieces blocks into main container dynamically
const galleryContainer = document.querySelector("#gallery-container")!;

(async function () {
  try {
    const artPieces = await getArtPieces();
    if (!artPieces)
      throw new Error("Something went wrong whilst fetching the art pieces");

    const previewImages: ArtPieceImage[] = artPieces.map((folder) =>
      folder.find((image: ArtPieceImage) => image.imageName === "0")
    );

    galleryContainer.insertAdjacentHTML(
      "beforeend",
      previewImages
        .map(
          // Art piece block
          (image, i) => `
          <button class="gallery-image overflow-hidden mb-4 rounded-xl hover:rounded-md focus-within:rounded-md cursor-pointer [&:hover>img]:scale-105 [&:focus-within>img]:scale-105" onclick="document.querySelector('.gallery-dialog-${i}').showModal()">
              <img class="duration-300 transition-all pointer-events-none" src=${
                image.imageUrl
              } data-image-name="${
            image.imageName
          }" alt="Zdjęcie graffiti podgląd wszystkich prac mesku.art" ${
            i < GALLERY_HIGH_FETCH_PRIORITY_IMAGES_AMOUNT
              ? 'fetchpriority="high"'
              : ""
          } />
          </button>
      `
        )
        .join("")
    );

    animateGalleryImages();

    galleryContainer.insertAdjacentHTML(
      "afterend",
      artPieces
        .map(
          (folder: ArtPieceImage[], i) => `
      <dialog
        tabindex="-1"
        class="gallery-dialog-${i} gallery-dialog fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-md:w-[95%] md:w-[85%] lg:w-[70%] 2xl:w-[60%] max-sm:h-fit sm:h-3/4 bg-black/25 backdrop-blur-md rounded-xl shadow-2xl border border-neutral-50/50 backdrop:bg-black/40 backdrop:fixed backdrop:z-40 backdrop:left-0 backdrop:top-0 backdrop:w-screen backdrop:h-screen text-neutral-50"
        onclick="document.querySelector('.gallery-dialog-${i}').close()"
      >
        <div class="relative h-full overflow-x-hidden md:p-12 sm:p-6 max-sm:px-2.5 max-sm:py-6" onclick="event.stopPropagation()">
          <button
            id="gallery-dialog-close-btn"
            class="absolute z-[60] right-2.5 top-4 text-xl hover:scale-110 focus-within:scale-110 transition-[scale] duration-100 origin-center px-1.5"
            onclick="document.querySelector('.gallery-dialog-${i}').close()"
            autofocus
          >
            &#10006;
          </button>

          <div class="splide splide-${i} h-full flex flex-col justify-between gap-6" aria-label="Wgląd mojej pracy wraz ze związanymi zdjęciami w karuzeli">
            <div class="splide__track h-full">
              <ul class="splide__list items-center">
                ${folder.map(
                  (
                    image
                  ) => `<li class="splide__slide flex justify-center items-center">
                   <img src="${image.imageUrl}" class="sm:h-full max-sm:h-fit max-sm:w-full object-cover" />
                </li>`
                )}
              </ul>
            </div>
          </div>
        </div>
      </dialog>
    `
        )
        .join("")
    );

    artPieces.forEach((_, i) => {
      const splide = new Splide(`.splide-${i}`, {
        height: "100%",
        perPage: 1,
        perMove: 1,
        pagination: true,
        grid: {
          dimensions: [
            [1, 1],
            [1, 1],
            [1, 1],
          ],
          gap: {
            row: "6px",
            col: "6px",
          },
        },
      });

      splide.mount();
    });

    galleryContainer.addEventListener("click", (e) => {
      // @ts-ignore
      if (e.target?.tagName.toLowerCase() !== "button") return;

      const buttonEl = e.target as HTMLButtonElement;
      const clickedFilename = buttonEl
        .querySelector("img")!
        .getAttribute("src")!
        .split("/")
        .at(-1)!
        .split(".")[0];

      // @ts-ignore
      const url = new URL(window.location);
      url.searchParams.set("zdjecie", clickedFilename);
      history.pushState(null, "", url);
    });
  } catch (err) {
    console.error(err);
  }
})();
