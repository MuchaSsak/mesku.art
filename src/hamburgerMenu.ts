const mediumBreakpoint = 768; // 48rem (TailwindCSS default)

const navBar: HTMLElement = document.querySelector("nav")!;
const hamburgerMenuBtn: HTMLButtonElement = document.querySelector(
  "#hamburger-menu-btn"
)!;

hamburgerMenuBtn.addEventListener("click", () => {
  hamburgerMenuBtn.classList.toggle("hamburger-menu-btn-active");
  navBar.classList.toggle("hamburger-menu-nav-active");
});

window.addEventListener("resize", () => {
  // Remove hamburger menu if user resizes window above the `medium` breakpoint
  if (window.innerWidth >= mediumBreakpoint) {
    hamburgerMenuBtn.classList.remove("hamburger-menu-btn-active");
    navBar.classList.remove("hamburger-menu-nav-active");
  }
});
