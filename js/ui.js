/**
 * Modern UI interactions — parallax, tilt, nav pill, counters
 */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ambient orbs follow cursor subtly */
  function initParallax() {
    if (reduced) return;
    const orbs = document.querySelectorAll(".orb");
    if (!orbs.length) return;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    document.addEventListener(
      "mousemove",
      (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 24;
        ty = (e.clientY / window.innerHeight - 0.5) * 24;
      },
      { passive: true }
    );

    function tick() {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      orbs.forEach((orb, i) => {
        const f = (i + 1) * 0.35;
        orb.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* 3D tilt on cards */
  function initTilt() {
    if (reduced) return;
    const max = 8;

    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(600px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });

    /* Tech cards use glow in digital.js — tilt only on [data-tilt] stats */
  }

  /* Nav sliding indicator */
  function initNavIndicator() {
    if (document.querySelector(".nexus-navbar")) return;
    const nav = document.querySelector(".navbar");
    const indicator = document.querySelector(".nav-indicator");
    const links = document.querySelectorAll(".navbar a");
    if (!nav || !indicator || !links.length) return;

    function moveTo(link) {
      if (!link || window.innerWidth <= 768) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.opacity = "1";
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.left = `${linkRect.left - navRect.left}px`;
    }

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => moveTo(link));
      link.addEventListener("focus", () => moveTo(link));
    });

    nav.addEventListener("mouseleave", () => {
      const active = nav.querySelector("a.active");
      moveTo(active);
    });

    const active = nav.querySelector("a.active");
    moveTo(active);
    window.addEventListener("resize", () => moveTo(nav.querySelector("a.active")));

    const observer = new MutationObserver(() => {
      moveTo(nav.querySelector("a.active"));
    });
    links.forEach((l) => {
      observer.observe(l, { attributes: true, attributeFilter: ["class"] });
    });
  }

  /* Stat counters */
  function initCounters() {
    const els = document.querySelectorAll(".stat-value[data-count]");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.done) return;
          entry.target.dataset.done = "1";
          const el = entry.target;
          const target = parseInt(el.dataset.count || el.textContent, 10);
          const suffix = el.dataset.suffix || "";
          if (reduced) {
            el.textContent = target + suffix;
            return;
          }
          let n = 0;
          const step = Math.max(1, Math.ceil(target / 30));
          const tick = () => {
            n += step;
            if (n >= target) {
              el.textContent = target + suffix;
              return;
            }
            el.textContent = n + suffix;
            requestAnimationFrame(tick);
          };
          tick();
          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => observer.observe(el));
  }

  function init() {
    initParallax();
    initTilt();
    initNavIndicator();
    initCounters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
