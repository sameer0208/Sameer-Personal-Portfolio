/**
 * Dynamic tab title + pulsing SVG favicon
 */
(function () {
  const TITLE_IDLE = "nexus.os · Sameer";
  const TITLE_LIVE = "● LIVE · Sameer";
  const TITLE_ALT = "◆ nexus.os · Sameer";

  let faviconLink = null;
  let pulsePhase = 0;
  let titleTimer = null;
  let pulseTimer = null;
  let altFlip = false;

  function setTitle() {
    if (document.hidden) {
      document.title = TITLE_IDLE;
      return;
    }
    if (document.hasFocus()) {
      document.title = altFlip ? TITLE_LIVE : TITLE_ALT;
      altFlip = !altFlip;
    } else {
      document.title = TITLE_IDLE;
    }
  }

  function startTitleCycle() {
    clearInterval(titleTimer);
    setTitle();
    titleTimer = setInterval(setTitle, 2200);
  }

  function ensureFaviconLink() {
    faviconLink =
      document.querySelector('link[rel="icon"][data-nexus-dynamic]') ||
      document.querySelector('link[rel="shortcut icon"][data-nexus-dynamic]');
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      faviconLink.type = "image/svg+xml";
      faviconLink.setAttribute("data-nexus-dynamic", "true");
      document.head.appendChild(faviconLink);
    }
    return faviconLink;
  }

  function drawFavicon(glow) {
    const link = ensureFaviconLink();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="6" fill="#04040c"/>
      <rect x="1" y="1" width="30" height="30" rx="5" fill="none" stroke="rgba(56,189,248,${0.25 + glow * 0.5})" stroke-width="1"/>
      <text x="16" y="21" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="rgba(52,211,153,${0.65 + glow * 0.35})">N</text>
      <circle cx="26" cy="6" r="3" fill="rgba(52,211,153,${glow})"/>
    </svg>`;
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  function startFaviconPulse() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    drawFavicon(1);
    if (reduced) return;

    clearInterval(pulseTimer);
    pulseTimer = setInterval(() => {
      pulsePhase += 0.12;
      const glow = 0.45 + Math.sin(pulsePhase) * 0.45;
      drawFavicon(document.hidden ? 0.35 : glow);
    }, 480);
  }

  function init() {
    document.title = TITLE_IDLE;
    startTitleCycle();
    startFaviconPulse();

    document.addEventListener("visibilitychange", setTitle);
    window.addEventListener("focus", setTitle);
    window.addEventListener("blur", setTitle);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
