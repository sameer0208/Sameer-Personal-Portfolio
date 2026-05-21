/**
 * Scroll performance — pause heavy layers while scrolling
 */
(function () {
  const mobile = window.matchMedia("(max-width: 899px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (mobile || coarse) {
    document.documentElement.classList.add("nexus-lite");
  }

  let busy = false;
  let timer;

  function setBusy(next) {
    if (busy === next) return;
    busy = next;
    document.body.classList.toggle("is-scrolling", next);
    document.dispatchEvent(
      new CustomEvent(next ? "nexus-scroll-busy" : "nexus-scroll-idle")
    );
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!busy) setBusy(true);
      clearTimeout(timer);
      timer = setTimeout(() => setBusy(false), mobile ? 90 : 140);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) setBusy(true);
    else setBusy(false);
  });
})();
