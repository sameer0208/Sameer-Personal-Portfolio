/**
 * Tech World Pulse — live-style activity feed + sector activity bars
 */
(function () {
  const FEED = [
    { tag: "deploy", tagClass: "deploy", icon: "bx-rocket", text: "CI/CD · main branch deployed · build 2m 14s" },
    { tag: "npm", tagClass: "", icon: "bx-package", text: "npm · react@19.x · 2.4M downloads this week" },
    { tag: "k8s", tagClass: "deploy", icon: "bx-server", text: "Kubernetes · 3 pods scaled · us-east-1" },
    { tag: "git", tagClass: "", icon: "bx-git-branch", text: "GitHub · 35+ repos active · open-source pulse" },
    { tag: "AI", tagClass: "ai", icon: "bx-brain", text: "ML pipeline · model inference · batch queued" },
    { tag: "cloud", tagClass: "data", icon: "bx-cloud", text: "AWS · Lambda warm · edge CDN cache hit 98%" },
    { tag: "DB", tagClass: "data", icon: "bx-data", text: "MongoDB · replica heartbeat OK · MERN stack live" },
    { tag: "web", tagClass: "", icon: "bx-globe", text: "Vercel · production deploy · TTFB 184ms" },
    { tag: "TS", tagClass: "", icon: "bx-code-alt", text: "TypeScript · strict mode · 0 errors in CI" },
    { tag: "test", tagClass: "deploy", icon: "bx-check-shield", text: "Jest · 142 tests passed · coverage 87%" },
    { tag: "API", tagClass: "data", icon: "bx-plug", text: "REST · rate limit 10k/min · latency p99 42ms" },
    { tag: "learn", tagClass: "ai", icon: "bx-video", text: "YouTube · Learning With Sameer · stream encoding" },
  ];

  const SECTORS = [
    { id: "cloud", label: "Cloud", base: 72 },
    { id: "oss", label: "OSS", base: 88 },
    { id: "ai", label: "AI", base: 65 },
    { id: "web", label: "Web", base: 94 },
  ];

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function renderItem(item) {
    const tagCls = item.tagClass ? ` tech-pulse-tag--${item.tagClass}` : "";
    return `<li class="tech-pulse-item">
      <span class="tech-pulse-tag${tagCls}">${item.tag}</span>
      <i class="bx ${item.icon}" aria-hidden="true"></i>
      <span>${item.text}</span>
    </li>`;
  }

  function buildSectors(container) {
    if (!container) return;
    container.innerHTML = SECTORS.map(
      (s) => `
      <div class="tech-pulse-sector" data-sector="${s.id}">
        <span>${s.label}</span>
        <div class="tech-pulse-sector-bars" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
        <span class="tech-pulse-sector-val" data-sector-val="${s.id}">${s.base}%</span>
      </div>`
    ).join("");
  }

  function tickSectorVals() {
    document.querySelectorAll("[data-sector-val]").forEach((el) => {
      const base = parseInt(el.textContent, 10) || 70;
      const jitter = Math.round((Math.random() - 0.5) * 8);
      el.textContent = `${Math.min(99, Math.max(52, base + jitter))}%`;
    });
  }

  function init() {
    const track = document.getElementById("tech-pulse-track");
    const staticList = document.getElementById("tech-pulse-static");
    const sectors = document.getElementById("tech-pulse-sectors");
    if (!track) return;

    const html = FEED.map(renderItem).join("");
    track.innerHTML = html + html;

    if (staticList) {
      staticList.innerHTML = FEED.slice(0, 4).map(renderItem).join("");
    }

    buildSectors(sectors);

    if (!reduced) {
      setInterval(tickSectorVals, 2800);
      tickSectorVals();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
