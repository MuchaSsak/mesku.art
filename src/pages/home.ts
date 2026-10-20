import { Splide } from "@splidejs/splide";
import { Grid } from "@splidejs/splide-extension-grid";

import { SPLIDE_I18N } from "../lib/carousel.ts";
import { initNavigation } from "../lib/navigation.ts";

initNavigation();

new Splide("#featured-carousel", {
  type: "loop",
  // Same as the track height in index.html, which reserves the space before mounting
  height: "18rem",
  autoplay: true,
  perPage: 2,
  perMove: 1,
  pagination: false,
  // Images after the first page are loaded a page before being shown
  lazyLoad: "nearby",
  preloadPages: 1,
  i18n: SPLIDE_I18N,
  grid: {
    dimensions: [
      [1, 1],
      [2, 2],
      [1, 1],
      [1, 2],
      [2, 2],
      [3, 2],
    ],
    gap: {
      row: "6px",
      col: "6px",
    },
  },
  breakpoints: {
    640: {
      height: "18rem",
      perPage: 1,
      grid: {
        dimensions: [
          [2, 2],
          [1, 2],
          [2, 2],
          [1, 2],
          [2, 2],
        ],
      },
    },
  },
}).mount({ Grid });
