// Mobile menu — handled by nexus-nav.js when .nexus-navbar exists
const menuToggle = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

if (!document.querySelector(".nexus-navbar")) {
  menuToggle?.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("active");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".navbar a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active");
      menuToggle?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });
}

// Scroll: active nav, sticky header, progress bar
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nexus-navbar a.nav-slot, .navbar a");
const header = document.querySelector(".header");
const scrollProgress = document.querySelector(".scroll-progress");

let scrollTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const headerOffset =
        parseInt(
          getComputedStyle(document.body).getPropertyValue("--header-h"),
          10
        ) || 108;

      if (scrollProgress && docHeight > 0) {
        scrollProgress.style.width = `${(scrollY / docHeight) * 100}%`;
      }

      header?.classList.toggle("sticky", scrollY > 40);

      sections.forEach((sec) => {
        const top = scrollY;
        const offset = sec.offsetTop - headerOffset - 24;
        const height = sec.offsetHeight;
        const id = sec.getAttribute("id");

        if (top >= offset && top < offset + height) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });

      if (!document.querySelector(".nexus-navbar")) {
        navbar?.classList.remove("active");
        menuToggle?.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
      }

      scrollTicking = false;
    });
  },
  { passive: true }
);

// About tabs
const tabLinks = document.querySelectorAll(".tab-links");
const tabContents = document.querySelectorAll(".tab-contents");

tabLinks.forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabId = tab.getAttribute("data-tab");

    tabLinks.forEach((t) => {
      t.classList.remove("active-link");
      t.setAttribute("aria-selected", "false");
    });
    tabContents.forEach((c) => c.classList.remove("active-tab"));

    tab.classList.add("active-link");
    tab.setAttribute("aria-selected", "true");
    document.getElementById(tabId)?.classList.add("active-tab");
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ScrollReveal — skip on mobile / coarse pointer (smoother native scroll)
const useScrollReveal =
  typeof ScrollReveal !== "undefined" &&
  window.innerWidth >= 900 &&
  !window.matchMedia("(pointer: coarse)").matches;

if (useScrollReveal) {
  const sr = ScrollReveal({
    reset: false,
    distance: "32px",
    duration: 800,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    delay: 80,
  });

  sr.reveal(".hero-console", { origin: "bottom", distance: "36px", delay: 350 });
  sr.reveal(".home-content > *", { origin: "left", interval: 100 });
  sr.reveal(".profile-frame", { origin: "right", delay: 200, distance: "40px" });
  sr.reveal(".orbit-system", { origin: "bottom", delay: 400, opacity: 0.6 });
  sr.reveal(".hero-stats .stat", { origin: "bottom", interval: 80, delay: 350 });
  sr.reveal(".section-header", { origin: "top", distance: "24px" });
  sr.reveal(".highlight-chip", { origin: "bottom", interval: 60, delay: 150 });
  sr.reveal(".exp-timeline-item", { origin: "left", interval: 100, distance: "24px" });
  sr.reveal(".exp-linkedin-cta", { origin: "bottom", delay: 150 });
  sr.reveal(".service-card, .cert-card, .repo-card", {
    origin: "bottom",
    interval: 50,
    distance: "20px",
  });
  sr.reveal(".github-view-all", { origin: "bottom", delay: 150 });
  sr.reveal(".comm-uplink-grid", { origin: "bottom", distance: "28px" });
  sr.reveal(".comm-hub", { origin: "left", delay: 80 });
  sr.reveal(".comm-composer", { origin: "right", delay: 160 });
}

// Typed.js
if (typeof Typed !== "undefined") {
  new Typed(".multiple-text", {
    strings: [
      "Associate Developer",
      "Full Stack Developer",
      "Freelancer",
      "Content Creator",
    ],
    typeSpeed: 55,
    backSpeed: 40,
    backDelay: 2000,
    loop: true,
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
