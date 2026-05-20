/**
 * Nexus Footer — telemetry, sector matrix, console, uplink
 */
(function () {
  const CIRCUMFERENCE = 2 * Math.PI * 44;
  const SHOW_AFTER = 380;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SECTORS = [
    { id: "home", mod: "core.init" },
    { id: "about", mod: "profile.sys" },
    { id: "experience", mod: "work.log" },
    { id: "certifications", mod: "cred.db" },
    { id: "services", mod: "svc.mesh" },
    { id: "portfolio", mod: "repo.grid" },
    { id: "contact", mod: "comm.link" },
  ];

  const CONSOLE_LINES = [
    "watch -n1 sector.status --all",
    "ls -la ~/sectors/ | grep mounted",
    "ping comm.link -c 3 · avg 22ms",
    "git status · branch main · clean",
    "kubectl get pods -n nexus-portfolio",
    "tail -f /var/log/nexus.access.log",
    "openssl s_client -connect comm.link:443",
    "node -e \"require('./nexus').boot()\"",
    "df -h /dev/nexus0 · 94% free",
    "systemctl is-active nexus-footer-dock",
  ];

  function initRingGradient() {
    const svg = document.querySelector("#uplink-launcher .uplink-ring");
    if (!svg || svg.querySelector("#uplink-gradient")) return;
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.id = "uplink-gradient";
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "100%");
    grad.innerHTML =
      '<stop offset="0%" stop-color="#7c5cff"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#34d399"/>';
    defs.appendChild(grad);
    svg.insertBefore(defs, svg.firstChild);
    const prog = document.getElementById("uplink-ring-progress");
    if (prog) prog.setAttribute("stroke", "url(#uplink-gradient)");
  }

  function initClock() {
    const clock = document.getElementById("footer-clock");
    if (!clock) return;
    const tick = () => {
      const d = new Date();
      clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((n) => String(n).padStart(2, "0"))
        .join(":");
    };
    tick();
    setInterval(tick, 1000);
  }

  function initPing() {
    const el = document.getElementById("footer-ping");
    if (!el || reduced) return;
    setInterval(() => {
      el.textContent = `~${18 + Math.floor(Math.random() * 16)}ms`;
    }, 2400);
  }

  function initConsole() {
    const line = document.getElementById("footer-console-line");
    if (!line || reduced) return;
    let i = 0;
    setInterval(() => {
      line.classList.add("is-fade");
      setTimeout(() => {
        i = (i + 1) % CONSOLE_LINES.length;
        line.textContent = CONSOLE_LINES[i];
        line.classList.remove("is-fade");
      }, 200);
    }, 3200);
  }

  function initScroll() {
    const btn = document.getElementById("uplink-launcher");
    const ring = document.getElementById("uplink-ring-progress");
    const depthEl = document.getElementById("footer-depth");
    const depthBar = document.getElementById("footer-depth-bar");
      const modTag = document.getElementById("footer-active-mod");
      const sealRoute = document.getElementById("footer-seal-route");
      const sectorLinks = document.querySelectorAll(".footer-sector");

    function update() {
      const doc = document.documentElement;
      const scrollY = window.scrollY;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const pct = Math.min(100, Math.round((scrollY / max) * 100));

      if (depthEl) depthEl.textContent = `${pct}%`;
      if (depthBar) depthBar.style.width = `${pct}%`;

      if (ring) {
        ring.style.strokeDasharray = String(CIRCUMFERENCE);
        ring.style.strokeDashoffset = String(
          CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE
        );
      }

      if (btn) btn.classList.toggle("is-visible", scrollY > SHOW_AFTER);

      let activeId = "home";
      document.querySelectorAll("main > section.section[id]").forEach((sec) => {
        const top = scrollY;
        const offset = sec.offsetTop - 140;
        const height = sec.offsetHeight;
        if (top >= offset && top < offset + height) activeId = sec.id;
      });

      const active = SECTORS.find((s) => s.id === activeId) || SECTORS[0];
      if (modTag) modTag.textContent = active.mod;
      if (sealRoute) sealRoute.textContent = `route → ${active.mod}`;

      sectorLinks.forEach((link) => {
        const on = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("active", on);
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function scrollToHome() {
    const btn = document.getElementById("uplink-launcher");
    const home = document.getElementById("home");
    if (btn) btn.classList.add("is-launching");
    const toast = document.getElementById("dmesg-toast");
    if (toast) {
      toast.textContent = "dmesg: uplink → core.init";
      toast.classList.add("visible");
      setTimeout(() => toast.classList.remove("visible"), 2200);
    }
    window.scrollTo({ top: home?.offsetTop ?? 0, behavior: reduced ? "auto" : "smooth" });
    setTimeout(() => btn?.classList.remove("is-launching"), reduced ? 100 : 700);
  }

  function initUplink() {
    const btn = document.getElementById("uplink-launcher");
    if (!btn) return;
    btn.addEventListener("click", scrollToHome);
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToHome();
      }
    });
  }

  function initEof() {
    document.getElementById("footer-eof-btn")?.addEventListener("click", scrollToHome);
  }

  function initFooterNav() {
    document.querySelectorAll(".footer-sector").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href?.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      });
    });
  }

  function init() {
    initRingGradient();
    initClock();
    initPing();
    initConsole();
    initScroll();
    initUplink();
    initEof();
    initFooterNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
