import Splide from "@splidejs/splide";
import { Grid } from "@splidejs/splide-extension-grid";

import { animateAboutMeSliderArrows } from "./animations";

const splide = new Splide(".splide", {
  type: "loop",
  height: "18rem",
  autoplay: true,
  perPage: 2,
  perMove: 1,
  pagination: false,
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
});

splide.mount({ Grid });
animateAboutMeSliderArrows();
