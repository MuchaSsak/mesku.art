/** Matches TailwindCSS `md` breakpoint, above which the hamburger menu is hidden. */
const MEDIUM_BREAKPOINT_QUERY = "(min-width: 48rem)";

export function initNavigation() {
  const navBar = document.querySelector<HTMLElement>("#site-nav");
  const hamburgerMenuBtn = document.querySelector<HTMLButtonElement>(
    "#hamburger-menu-btn",
  );

  if (!navBar || !hamburgerMenuBtn) return;

  const isOpen = () => hamburgerMenuBtn.getAttribute("aria-expanded") === "true";

  const setOpen = (open: boolean) => {
    hamburgerMenuBtn.setAttribute("aria-expanded", String(open));
    hamburgerMenuBtn.classList.toggle("hamburger-menu-btn-active", open);
    navBar.classList.toggle("hamburger-menu-nav-active", open);
  };

  hamburgerMenuBtn.addEventListener("click", () => setOpen(!isOpen()));

  navBar.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    hamburgerMenuBtn.focus();
  });

  // Close the menu if the window is resized above the breakpoint
  window.matchMedia(MEDIUM_BREAKPOINT_QUERY).addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}
