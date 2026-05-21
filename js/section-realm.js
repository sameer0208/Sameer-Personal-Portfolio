/**
 * Section Realms — layered animated backgrounds inside section panels
 */
(function () {
  const REALM_TAGS = {
    about: "profile.sys",
    experience: "work.log",
    certifications: "cred.db",
    services: "svc.mesh",
    portfolio: "repo.grid",
    contact: "comm.link",
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lite = window.matchMedia("(max-width: 899px), (pointer: coarse)").matches;

  function buildNodes(count) {
    let html = "";
    for (let i = 0; i < count; i++) {
      const x = 8 + Math.random() * 84;
      const y = 10 + Math.random() * 75;
      const delay = (Math.random() * 3).toFixed(2);
      html += `<span class="panel-node" style="left:${x}%;top:${y}%;animation-delay:${delay}s"></span>`;
    }
    return html;
  }

  function buildFlowLines(count) {
    let html = "";
    for (let i = 0; i < count; i++) {
      const top = 15 + i * (70 / count);
      const delay = (i * 1.2).toFixed(1);
      const w = 25 + Math.floor(Math.random() * 25);
      html += `<span class="panel-flow-line" style="top:${top}%;width:${w}%;animation-delay:${delay}s"></span>`;
    }
    return html;
  }

  function createPanelBg(realm) {
    const wrap = document.createElement("div");
    wrap.className = "panel-bg";
    wrap.dataset.realm = realm;
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `
      <div class="panel-bg-blobs">
        <span class="panel-blob panel-blob--1"></span>
        <span class="panel-blob panel-blob--2"></span>
        <span class="panel-blob panel-blob--3"></span>
      </div>
      <div class="panel-bg-grid-floor"></div>
      <div class="panel-bg-circuit"></div>
      <div class="panel-bg-scanline"></div>
      <div class="panel-bg-nodes">${buildNodes(lite ? 4 : realm === "experience" ? 10 : 7)}</div>
      <div class="panel-bg-flow">${buildFlowLines(lite ? 2 : realm === "experience" ? 5 : 3)}</div>
      <div class="panel-bg-aurora"></div>
      <span class="panel-bg-tag">${REALM_TAGS[realm] || realm}</span>
    `;
    return wrap;
  }

  function initPanelGlow() {
    if (reduced || lite) return;
    document.querySelectorAll(".section-panel").forEach((panel) => {
      panel.addEventListener("mousemove", (e) => {
        const rect = panel.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        panel.style.setProperty("--px", `${x}%`);
        panel.style.setProperty("--py", `${y}%`);
        panel.classList.add("panel-glow");
      });
      panel.addEventListener("mouseleave", () => {
        panel.classList.remove("panel-glow");
      });
    });
  }

  function initPanels() {
    document.querySelectorAll(".section-panel").forEach((panel) => {
      if (panel.querySelector(".panel-bg")) return;
      const section = panel.closest("section.section");
      const realm = section?.id || "about";
      panel.insertBefore(createPanelBg(realm), panel.firstChild);
    });
  }

  function init() {
    initPanels();
    initPanelGlow();
  }

  function boot() {
    init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("nexus-panels-ready", init);
})();
