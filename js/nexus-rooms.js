/**
 * Scroll-snapped sector rooms + room toast
 */
(function () {
  const ROOMS = [
    { id: "home", name: "core.init", title: "Core Sector" },
    { id: "about", name: "profile.sys", title: "Profile Matrix" },
    { id: "experience", name: "work.log", title: "Work Log Station" },
    { id: "certifications", name: "cred.db", title: "Credentials Vault" },
    { id: "services", name: "svc.mesh", title: "Service Mesh" },
    { id: "portfolio", name: "repo.grid", title: "Repository Grid" },
    { id: "contact", name: "comm.link", title: "Comm Link" },
  ];

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    if (reduced || window.innerWidth < 1200) return;

    document.documentElement.classList.add("nexus-rooms-enabled");

    const toast = document.getElementById("room-toast");
    const nameEl = document.getElementById("room-toast-name");
    let hideTimer;

    function showRoom(room) {
      if (!toast || !nameEl || !room) return;
      nameEl.textContent = room.name;
      toast.classList.add("visible");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
    }

    const sections = ROOMS.map(
      (r) =>
        document.querySelector(`main section#${r.id}`) ||
        document.getElementById(r.id)
    ).filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const room = ROOMS.find((r) => r.id === entry.target.id);
          sections.forEach((s) => s.classList.remove("room-active"));
          entry.target.classList.add("room-active");
          showRoom(room);

          const moduleEl = document.getElementById("hud-module");
          if (moduleEl && room) moduleEl.textContent = room.name;
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((sec) => obs.observe(sec));
    showRoom(ROOMS[0]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
