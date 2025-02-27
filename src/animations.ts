import gsap from "gsap";
import SplitType from "split-type";

// NavBar
const navBar = document.querySelector("nav");
gsap.from(navBar, {
  y: "-200%",
  delay: 0.1,
  duration: 1,
  ease: "circ.out",
});

// About me heading
const aboutMeHeading = new SplitType("#about-me-heading", {
  types: "chars",
});
gsap.fromTo(
  aboutMeHeading.chars,
  {
    y: 100,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    stagger: 0.05,
    delay: 0.75,
    duration: 2,
    ease: "power4.out",
  }
);

// About me paragraph
const aboutMeParagraph = document.querySelector("#about-me-paragraph");
gsap.from(aboutMeParagraph, {
  opacity: 0,
  duration: 2.5,
  delay: 0.5,
  y: 200,
  ease: "power4.out",
  skewY: 10,
  stagger: 0.04,
});

// About me CTA button
const aboutMeCTA = document.querySelector("#about-me-cta");
gsap.from(aboutMeCTA, {
  opacity: 0,
  duration: 1.25,
  delay: 2,
  ease: "circ.in",
});

// About me slider
const aboutMeSliderSlides = document.querySelectorAll(".splide__slide");
gsap.from(aboutMeSliderSlides, {
  y: -50,
  opacity: 0,
  duration: 2.75,
  delay: 0.3,
  stagger: 0.05,
  ease: "elastic",
});

export function animateAboutMeSliderArrows() {
  const aboutMeSliderArrows = document.querySelectorAll(".splide__arrow");
  gsap.from(aboutMeSliderArrows, {
    opacity: 0,
    duration: 2,
    delay: 1.4,
  });
}

// Gallery heading
const galleryHeading = new SplitType("#gallery-heading", {
  types: "chars",
});
gsap.fromTo(
  galleryHeading.chars,
  {
    y: 100,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    stagger: 0.05,
    delay: 0.75,
    duration: 2,
    ease: "power4.out",
  }
);

// Gallery images
export function animateGalleryImages() {
  const galleryImages = document.querySelectorAll(".gallery-image");
  gsap.fromTo(
    galleryImages,
    {
      x: -100,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      stagger: 0.01,
      delay: 0.25,
      duration: 1.5,
      ease: "power4.out",
    }
  );
}

// Contact heading
const contactHeading = new SplitType("#contact-heading", {
  types: "chars",
});
gsap.fromTo(
  contactHeading.chars,
  {
    y: 100,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    stagger: 0.05,
    delay: 0.75,
    duration: 2,
    ease: "power4.out",
  }
);

// Contact info list
const contactInfoList = document.querySelector("#contact-info-list");
gsap.from(contactInfoList?.children || null, {
  x: -50,
  opacity: 0,
  delay: 0.65,
  duration: 1,
  stagger: 0.25,
});

// Contact logo image
const contactLogoImage = document.querySelector("#contact-logo-image");
gsap.from(contactLogoImage, {
  opacity: 0,
  duration: 3.25,
  delay: 0.5,
  ease: "back.inOut",
});
