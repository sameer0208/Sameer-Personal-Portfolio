/**
 * Nexus Command Deck — slot laser, sector status, mobile gateway
 */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initSlotLaser() {
    const nav = document.querySelector(".nexus-navbar");
    const laser = document.getElementById("nav-slot-laser");
    const sectorEl = document.getElementById("nav-status-sector");
    const links = document.querySelectorAll(".nexus-navbar a.nav-slot");
    if (!nav || !laser || !links.length) return;

    function moveTo(link) {
      if (!link || window.innerWidth <= 768) {
        laser.style.opacity = "0";
        return;
      }
      laser.style.opacity = "1";
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      laser.style.width = `${linkRect.width}px`;
      laser.style.left = `${linkRect.left - navRect.left}px`;
      if (sectorEl && link.dataset.module) {
        sectorEl.textContent = `SECTOR :: ${link.dataset.module}`;
      }
    }

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => moveTo(link));
      link.addEventListener("focus", () => moveTo(link));
    });

    nav.addEventListener("mouseleave", () => moveTo(nav.querySelector("a.active")));

    const sync = () => moveTo(nav.querySelector("a.active"));
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener(
      "scroll",
      () => requestAnimationFrame(sync),
      { passive: true }
    );

    const observer = new MutationObserver(sync);
    links.forEach((l) => {
      observer.observe(l, { attributes: true, attributeFilter: ["class"] });
    });
  }

  function initGateway() {
    const toggle = document.getElementById("menu-icon");
    const nav = document.querySelector(".nexus-navbar");
    const backdrop = document.getElementById("nav-gateway-backdrop");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("active", open);
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      backdrop?.classList.toggle("active", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("active")));
    backdrop?.addEventListener("click", () => setOpen(false));
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
    window.addEventListener("scroll", () => {
      if (nav.classList.contains("active")) setOpen(false);
    }, { passive: true });
  }

  function initSignalBars() {
    if (reduced) return;
    const bars = document.querySelectorAll(".deck-bars span");
    setInterval(() => {
      bars.forEach((bar) => {
        bar.style.height = `${4 + Math.floor(Math.random() * 8)}px`;
      });
    }, 400);
  }

  function init() {
    initSlotLaser();
    initGateway();
    initSignalBars();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
