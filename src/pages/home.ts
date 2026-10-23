import { Splide } from "@splidejs/splide";

import { SPLIDE_I18N } from "../lib/carousel.ts";
import { initNavigation } from "../lib/navigation.ts";

initNavigation();

// A filmstrip: every photo is shown whole at the same height, the slide width
// follows the photo (its aspect ratio is set in the markup)
new Splide("#featured-carousel", {
  type: "loop",
  // Same as the track height in index.html, which reserves the space before mounting
  height: "20rem",
  autoWidth: true,
  autoplay: true,
  perMove: 1,
  gap: "6px",
  pagination: false,
  // Lazy images within `preloadPages + 1` slides of the current one are loaded
  // (perPage is 1), which covers the ~6 slides visible on the widest layouts
  lazyLoad: "nearby",
  preloadPages: 7,
  i18n: SPLIDE_I18N,
}).mount();
