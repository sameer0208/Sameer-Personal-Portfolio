/**
 * Nexus SYS — topology, HUD network, packets, dmesg, TLS, process monitor
 */
(function () {
  const SECTORS = [
    { id: "home", module: "core.init", label: "core", ip: "10.0.0.1" },
    { id: "about", module: "profile.sys", label: "profile", ip: "10.0.0.2" },
    { id: "experience", module: "work.log", label: "work", ip: "10.0.0.3" },
    { id: "certifications", module: "cred.db", label: "certs", ip: "10.0.0.4" },
    { id: "services", module: "svc.mesh", label: "svc", ip: "10.0.0.5" },
    { id: "portfolio", module: "repo.grid", label: "repos", ip: "10.0.0.6" },
    { id: "contact", module: "comm.link", label: "comm", ip: "10.0.0.7" },
  ];

  const DMESG_MSGS = [
    "[OK] Mounted sector: {module}",
    "[OK] Routing table updated → {module}",
    "[SYS] sector {module} active (running)",
    "[OK] Loaded module {module}",
  ];

  const NETSTAT_STATIC = [
    { host: "github.com", port: 443, proto: "HTTPS" },
    { host: "linkedin.com", port: 443, proto: "HTTPS" },
    { host: "thoughtworks.com", port: 443, proto: "HTTPS" },
  ];

  let activeSector = SECTORS[0];
  let scrollVel = 0;
  let lastScrollY = 0;
  let lastScrollT = Date.now();
  let lastDmesgAt = 0;

  function showDmesg(module, opts = {}) {
    const now = Date.now();
    if (!opts.force && now - lastDmesgAt < 2200) return;
    lastDmesgAt = now;
    const el = document.getElementById("dmesg-toast");
    if (!el) return;
    const tpl = DMESG_MSGS[Math.floor(Math.random() * DMESG_MSGS.length)];
    el.textContent = tpl.replace("{module}", module);
    el.classList.add("visible");
    setTimeout(() => el.classList.remove("visible"), 2800);
  }

  window.NexusSys = {
    showDmesg,
    setActiveSector,
    SECTORS,
    get activeSector() {
      return activeSector;
    },
  };

  function setActiveSector(sector) {
    if (!sector) return;
    activeSector = sector;
    updateHudNetwork(sector);
    updateTopology(sector.id);
    updateProcessMonitor(sector.id);
  }

  function updateHudNetwork(sector) {
    const trace = document.getElementById("hud-trace");
    const netstat = document.getElementById("hud-netstat");
    const hop = SECTORS.findIndex((s) => s.id === sector.id) + 1;
    if (trace) {
      trace.textContent = `hop ${hop} → ${sector.module} (${sector.ip})`;
    }
    if (netstat) {
      const lines = NETSTAT_STATIC.map(
        (c) => `${c.proto} ${c.host}:${c.port}`
      ).join(" · ");
      netstat.textContent = lines;
      netstat.title = lines;
    }
  }

  function updateTopology(activeId) {
    document.querySelectorAll(".net-node").forEach((g) => {
      const on = g.dataset.sector === activeId;
      g.classList.toggle("active", on);
    });
    const idx = SECTORS.findIndex((s) => s.id === activeId);
    document.querySelectorAll(".net-topology-svg line").forEach((line, i) => {
      line.classList.toggle("active", i === idx || i === idx - 1);
    });
  }

  function initTopology() {
    if (window.innerWidth < 1024) return;
    const wrap = document.getElementById("net-topology");
    if (!wrap) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "net-topology-svg");
    svg.setAttribute("viewBox", "0 0 200 200");

    const cx = 100;
    const cy = 100;
    const r = 72;

    SECTORS.forEach((s, i) => {
      const next = SECTORS[(i + 1) % SECTORS.length];
      const a1 = (i / SECTORS.length) * Math.PI * 2 - Math.PI / 2;
      const a2 = (((i + 1) % SECTORS.length) / SECTORS.length) * Math.PI * 2 - Math.PI / 2;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(cx + Math.cos(a1) * r));
      line.setAttribute("y1", String(cy + Math.sin(a1) * r));
      line.setAttribute("x2", String(cx + Math.cos(a2) * r));
      line.setAttribute("y2", String(cy + Math.sin(a2) * r));
      svg.appendChild(line);
    });

    SECTORS.forEach((s, i) => {
      const a = (i / SECTORS.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "net-node");
      g.dataset.sector = s.id;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      circle.setAttribute("r", "10");
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(x));
      text.setAttribute("y", String(y + 22));
      text.setAttribute("text-anchor", "middle");
      text.textContent = s.label;
      g.appendChild(circle);
      g.appendChild(text);
      g.addEventListener("click", () => {
        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
      });
      svg.appendChild(g);
    });

    wrap.appendChild(svg);
  }

  function initPacketLabels() {
    const protos = ["TCP", "HTTPS", "TLS", "DNS", "SSH"];
    document.querySelectorAll(".data-stream").forEach((stream) => {
      for (let i = 0; i < 4; i++) {
        const p = document.createElement("span");
        p.className = "packet-label";
        p.textContent = `${protos[i % protos.length]} 10.0.0.${(i % 7) + 1}`;
        p.style.animationDelay = `${i * 1.1 + (stream.classList.contains("data-stream--right") ? 2 : 0)}s`;
        p.style.animationDuration = `${3.5 + i * 0.4}s`;
        stream.appendChild(p);
      }
    });
  }

  function initProcessMonitor() {
    if (window.innerWidth < 1024) return;
    const list = document.getElementById("sys-proc-list");
    if (!list) return;

    list.innerHTML = `<div class="sys-proc-head"><span>PID</span><span>NAME</span><span>CPU</span><span>MEM</span></div>`;
    SECTORS.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "sys-proc-row";
      row.dataset.sector = s.id;
      row.innerHTML = `<span>${i + 1}</span><span class="proc-name">${s.module}</span><span class="cpu">0%</span><span class="mem">0%</span>`;
      list.appendChild(row);
    });
  }

  function updateProcessMonitor(activeId) {
    document.querySelectorAll(".sys-proc-row").forEach((row) => {
      const on = row.dataset.sector === activeId;
      row.classList.toggle("active", on);
      if (on) {
        const cpu = Math.min(99, Math.round(scrollVel * 2 + 5));
        const mem = Math.min(
          99,
          Math.round(
            (window.scrollY /
              (document.documentElement.scrollHeight -
                window.innerHeight || 1)) *
              80 +
              10
          )
        );
        row.querySelector(".cpu").textContent = `${cpu}%`;
        row.querySelector(".mem").textContent = `${mem}%`;
      }
    });
  }

  function initHudLoad() {
    const load = document.getElementById("hud-load");
    if (!load) return;
    const update = () => {
      const t = Date.now();
      const dy = Math.abs(window.scrollY - lastScrollY);
      const dt = Math.max(t - lastScrollT, 16);
      scrollVel = scrollVel * 0.85 + (dy / dt) * 0.15;
      lastScrollY = window.scrollY;
      lastScrollT = t;
      const loadAvg = (0.15 + scrollVel * 0.5).toFixed(2);
      load.textContent = `load: ${loadAvg} ${(loadAvg * 0.9).toFixed(2)} ${(loadAvg * 0.8).toFixed(2)}`;
      if (activeSector) updateProcessMonitor(activeSector.id);
    };
    window.addEventListener("scroll", update, { passive: true });
    setInterval(update, 400);
  }

  function initTlsContact() {
    if (document.querySelector(".comm-composer")) return;
    const form = document.querySelector(".contact-form");
    const strip = document.getElementById("tls-strip");
    const status = document.getElementById("tls-status");
    if (!form || !strip || !status) return;

    let secured = false;
    const inputs = form.querySelectorAll("input, textarea");

    inputs.forEach((inp) => {
      inp.addEventListener("focus", () => {
        if (secured) return;
        strip.classList.add("handshake");
        strip.classList.remove("secure");
        status.textContent = "TLS 1.3 handshake...";
      });
    });

    const observer = new MutationObserver(() => {
      const msg = document.getElementById("msg");
      if (msg?.classList.contains("success")) {
        secured = true;
        strip.classList.remove("handshake");
        strip.classList.add("secure");
        status.textContent = "TLS 1.3 · AES-256-GCM · channel verified";
      }
    });
    const msgEl = document.getElementById("msg");
    if (msgEl) {
      observer.observe(msgEl, { attributes: true, attributeFilter: ["class"] });
    }

    form.addEventListener("submit", () => {
      strip.classList.add("handshake");
      status.textContent = "Encrypting payload...";
    });
  }

  function initSystemdTags() {
    document.querySelectorAll(".section-module-tag").forEach((tag) => {
      tag.classList.add("systemd");
      const text = tag.textContent;
      if (!text.includes(".service")) {
        tag.textContent = `${text}.service`;
      }
    });
  }

  function initSectorObserver() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sector = SECTORS.find((s) => s.id === entry.target.id);
          if (sector) {
            setActiveSector(sector);
            showDmesg(sector.module);
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 }
    );
    SECTORS.forEach(({ id }) => {
      const el =
        document.querySelector(`main section#${id}`) ||
        document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  function initWormholeDmesg() {
    document.querySelectorAll(".wormhole-divider").forEach((wh) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const next = e.target.nextElementSibling;
            if (next?.dataset?.module) {
              showDmesg(`tunnel → ${next.dataset.module}`, { force: true });
            } else if (next?.id) {
              const s = SECTORS.find((x) => x.id === next.id);
              if (s) showDmesg(`tunnel → ${s.module}`, { force: true });
            }
          });
        },
        { threshold: 0.6 }
      );
      obs.observe(wh);
    });
  }

  function init() {
    initTopology();
    initPacketLabels();
    initProcessMonitor();
    initHudLoad();
    initTlsContact();
    initSystemdTags();
    initSectorObserver();
    initWormholeDmesg();
    setActiveSector(SECTORS[0]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
