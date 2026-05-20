/**
 * Tech Ops — ambient background workforce scene
 */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    const ambient = document.querySelector(".tech-ops--ambient");
    if (!ambient || window.innerWidth < 1025) return;

    if (!reduced) {
      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            const y = window.scrollY;
            ambient.style.setProperty("--ops-parallax", `${y * 0.05}px`);
            document.body.classList.toggle("is-scrolled-deep", y > window.innerHeight * 1.2);
            ticking = false;
          });
        },
        { passive: true }
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
