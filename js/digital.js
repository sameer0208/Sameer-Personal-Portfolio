/**
 * Digital Nexus — particles, HUD, command palette, journey, hero code
 */
(function () {
  const MODULES = [
    { id: "home", label: "init", module: "core.init", href: "#home" },
    { id: "about", label: "profile", module: "profile.sys", href: "#about" },
    { id: "experience", label: "work", module: "work.log", href: "#experience" },
    { id: "certifications", label: "certs", module: "cred.db", href: "#certifications" },
    { id: "services", label: "services", module: "svc.mesh", href: "#services" },
    { id: "portfolio", label: "repos", module: "repo.grid", href: "#portfolio" },
    { id: "contact", label: "contact", module: "comm.link", href: "#contact" },
  ];

  function getSection(id) {
    return (
      document.querySelector(`main section#${id}`) ||
      document.getElementById(id)
    );
  }

  const EXTRA_CMDS = [
    { name: "GitHub Profile", module: "ext.github", href: "https://github.com/sameer0208", external: true },
    { name: "LinkedIn", module: "ext.linkedin", href: "https://www.linkedin.com/in/sayyed-sameer-basir-6b3195215/", external: true },
    { name: "Download CV", module: "ext.cv", href: "resume/mycv.pdf", external: true },
    { name: "YouTube Channel", module: "ext.yt", href: "https://www.youtube.com/@learningwithsameer2863", external: true },
  ];

  const CODE_SNIPPET = `const engineer = {
  name: "Sameer Basir",
  role: "Associate Developer",
  company: "Thoughtworks",
  stack: [
    "React.js", "Node.js", "Express",
    "MongoDB", "MySQL", "MERN"
  ],
  langs: ["Java", "Python", "C++"],
  ship: () => build("web apps")
};`;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const liteMode = window.matchMedia("(max-width: 899px), (pointer: coarse)").matches;

  let mouseX = null;
  let mouseY = null;

  /* ---- Particle network (mouse-reactive) ---- */
  function initNetwork() {
    const canvas = document.getElementById("network-canvas");
    if (!canvas || reduced || liteMode) return;

    const ctx = canvas.getContext("2d");
    let w, h, nodes, raf;
    let paused = false;

    const COUNT = 32;
    const DIST = 120;
    const MOUSE_DIST = 140;

    document.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true }
    );

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      nodes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function draw() {
      if (paused) return;
      ctx.clearRect(0, 0, w, h);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        if (mouseX !== null) {
          const dx = mouseX - n.x;
          const dy = mouseY - n.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_DIST && d > 0) {
            n.x -= (dx / d) * 0.8;
            n.y -= (dy / d) * 0.8;
          }
        }
      });

      if (mouseX !== null) {
        nodes.forEach((n) => {
          const d = Math.hypot(mouseX - n.x, mouseY - n.y);
          if (d < MOUSE_DIST) {
            const a = (1 - d / MOUSE_DIST) * 0.18;
            ctx.strokeStyle = `rgba(56, 189, 248, ${a})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        });
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < DIST) {
            const a = (1 - d / DIST) * 0.14;
            ctx.strokeStyle = `rgba(124, 92, 255, ${a})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      });

      if (mouseX !== null) {
        ctx.fillStyle = "rgba(124, 92, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("nexus-scroll-busy", () => {
      paused = true;
      cancelAnimationFrame(raf);
    });
    document.addEventListener("nexus-scroll-idle", () => {
      if (!paused) return;
      paused = false;
      draw();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(raf);
      } else if (!paused) {
        draw();
      }
    });
  }

  /* ---- Matrix rain (subtle) ---- */
  function initMatrixRain() {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas || reduced || liteMode) return;

    const ctx = canvas.getContext("2d");
    let w, h, cols, drops, raf;
    let paused = false;
    const chars = "01アイウエオαβγλ<>/{}";

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const fontSize = 14;
      cols = Math.floor(w / fontSize);
      drops = Array(cols).fill(1);
    }

    function draw() {
      if (paused) return;
      ctx.fillStyle = "rgba(7, 7, 13, 0.12)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(124, 92, 255, 0.15)";
      ctx.font = "14px monospace";

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        ctx.fillText(text, x, y * 14);
        if (y * 14 > h && Math.random() > 0.985) drops[i] = 0;
        drops[i]++;
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("nexus-scroll-busy", () => {
      paused = true;
      cancelAnimationFrame(raf);
    });
    document.addEventListener("nexus-scroll-idle", () => {
      if (!paused) return;
      paused = false;
      draw();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(raf);
      } else if (!paused) {
        draw();
      }
    });
  }

  /* ---- Cursor spotlight ---- */
  function initSpotlight() {
    if (reduced || liteMode) return;
    document.addEventListener(
      "mousemove",
      (e) => {
        document.body.style.setProperty("--mx", `${e.clientX}px`);
        document.body.style.setProperty("--my", `${e.clientY}px`);
      },
      { passive: true }
    );
  }

  /* ---- HUD updates ---- */
  function initHUD() {
    const depthEl = document.getElementById("hud-depth");
    const moduleEl = document.getElementById("hud-module");
    const coordsEl = document.getElementById("hud-coords");

    const bandwidthEl = document.getElementById("hud-bandwidth");

    function update() {
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      const pct = doc > 0 ? Math.round((window.scrollY / doc) * 100) : 0;
      if (depthEl) depthEl.textContent = `DEPTH ${pct}%`;

      if (coordsEl) {
        const x = Math.floor((window.scrollY / (doc || 1)) * 999);
        const y = Math.floor(window.scrollY * 0.3) % 999;
        coordsEl.textContent = `X:${String(x).padStart(3, "0")} Y:${String(y).padStart(3, "0")}`;
      }

      if (bandwidthEl && !reduced) {
        const bw = (800 + Math.random() * 200).toFixed(0);
        bandwidthEl.textContent = `LINK ${bw}Mbps`;
      }
    }

    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const mod = entry.target.dataset.module;
          if (moduleEl && mod) moduleEl.textContent = mod;
          entry.target.classList.add("module-active");
          setTimeout(() => entry.target.classList.remove("module-active"), 1200);
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );

    MODULES.forEach(({ id }) => {
      const el = getSection(id);
      if (el) sectionObs.observe(el);
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---- Journey depth rail ---- */
  function initJourneyRail() {
    const rail = document.getElementById("journey-depth");
    if (!rail) return;

    MODULES.forEach(({ id, label, href }) => {
      const a = document.createElement("a");
      a.href = href;
      a.className = "journey-node";
      a.dataset.section = id;
      a.innerHTML = `<span class="journey-node-dot"></span><span class="journey-node-label">${label}</span>`;
      rail.appendChild(a);
    });

    const nodes = rail.querySelectorAll(".journey-node");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          nodes.forEach((n) =>
            n.classList.toggle("active", n.dataset.section === entry.target.id)
          );
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );

    MODULES.forEach(({ id }) => {
      const sec = getSection(id);
      if (sec) obs.observe(sec);
    });
  }

  /* ---- Command palette ---- */
  function initCommandPalette() {
    const palette = document.getElementById("cmd-palette");
    const input = document.getElementById("cmd-input");
    const list = document.getElementById("cmd-list");
    const trigger = document.getElementById("cmd-trigger");
    const fab = document.getElementById("cmd-fab");
    if (!palette || !input || !list) return;

    const allItems = [
      ...MODULES.map((m) => ({
        name: m.label.charAt(0).toUpperCase() + m.label.slice(1),
        module: m.module,
        href: m.href,
        external: false,
      })),
      ...EXTRA_CMDS,
    ];

    let focused = 0;
    let filtered = [...allItems];

    function render(items) {
      list.innerHTML = "";
      items.forEach((item, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `cmd-item${i === focused ? " focused" : ""}`;
        btn.innerHTML = `<span>${item.name}</span><span class="cmd-item-module">${item.module}</span>`;
        btn.addEventListener("click", () => go(item));
        list.appendChild(btn);
      });
    }

    function go(item) {
      close();
      if (item.external) window.open(item.href, "_blank", "noopener");
      else document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
    }

    function open() {
      palette.classList.add("open");
      palette.setAttribute("aria-hidden", "false");
      input.value = "";
      filtered = [...allItems];
      focused = 0;
      render(filtered);
      setTimeout(() => input.focus(), 50);
    }

    function close() {
      palette.classList.remove("open");
      palette.setAttribute("aria-hidden", "true");
    }

    function filter(q) {
      const query = q.toLowerCase().trim();
      filtered = query
        ? allItems.filter(
            (i) =>
              i.name.toLowerCase().includes(query) ||
              i.module.toLowerCase().includes(query)
          )
        : [...allItems];
      focused = 0;
      render(filtered);
    }

    input.addEventListener("input", () => filter(input.value));

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        focused = Math.min(focused + 1, filtered.length - 1);
        render(filtered);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focused = Math.max(focused - 1, 0);
        render(filtered);
      } else if (e.key === "Enter" && filtered[focused]) {
        e.preventDefault();
        go(filtered[focused]);
      } else if (e.key === "Escape") {
        close();
      }
    });

    palette.querySelector(".cmd-backdrop")?.addEventListener("click", close);
    trigger?.addEventListener("click", open);
    fab?.addEventListener("click", open);

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        palette.classList.contains("open") ? close() : open();
      }
    });
  }

  /* ---- Hero code typing ---- */
  function initHeroCode() {
    const el = document.getElementById("hero-code-content");
    if (!el || reduced) {
      if (el) el.innerHTML = highlightCode(CODE_SNIPPET);
      return;
    }

    let i = 0;
    const cursor = '<span class="cursor"></span>';

    function highlightPartial(text) {
      return highlightCode(text) + cursor;
    }

    function tick() {
      if (i <= CODE_SNIPPET.length) {
        el.innerHTML = highlightPartial(CODE_SNIPPET.slice(0, i));
        i++;
        setTimeout(tick, i < 20 ? 80 : 35);
      } else {
        el.innerHTML = highlightCode(CODE_SNIPPET) + cursor;
      }
    }

    setTimeout(tick, 600);
  }

  function highlightCode(code) {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\b(const|return)\b/g, '<span class="kw">$1</span>')
      .replace(
        /\b(engineer|name|role|company|stack|langs|ship|build)\b/g,
        '<span class="fn">$1</span>'
      )
      .replace(/"([^"]*)"/g, '<span class="str">"$1"</span>')
      .replace(/\[[^\]]+\]/g, (m) => `<span class="str">${m}</span>`);
  }

  /* ---- Section & card tech enhancements ---- */
  function tagSections() {
    MODULES.forEach(({ id, module }) => {
      const sec = getSection(id);
      if (sec) sec.dataset.module = module;
    });
  }

  function addSectionTags() {
    MODULES.filter((m) => m.id !== "home").forEach(({ id, module }) => {
      const header = getSection(id)?.querySelector(".section-header");
      if (!header || header.querySelector(".section-module-tag")) return;
      const tag = document.createElement("span");
      tag.className = "section-module-tag";
      tag.textContent = module;
      header.insertBefore(tag, header.firstChild);
    });
  }

  function wrapSectionPanels() {
    document.querySelectorAll("main > section.section:not(.home)").forEach((sec) => {
      const container = sec.querySelector(":scope > .container");
      if (container) container.classList.add("section-panel");
    });
  }

  function randomHex() {
    return "0x" + Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");
  }

  function enhanceTechCards() {
    const selectors =
      ".repo-card, .cert-card, .service-card, .exp-timeline-body, .stat.glass-card, .contact-form, .highlight-chip, .timeline-item";
    document.querySelectorAll(selectors).forEach((card) => {
      if (card.classList.contains("tech-card")) return;
      card.classList.add("tech-card");

      const corners = document.createElement("div");
      corners.className = "tech-card-corners";
      corners.setAttribute("aria-hidden", "true");
      corners.innerHTML =
        "<span></span><span></span><span></span><span></span>";
      card.appendChild(corners);

      const grid = document.createElement("div");
      grid.className = "tech-card-grid";
      grid.setAttribute("aria-hidden", "true");
      card.appendChild(grid);

      const id = document.createElement("span");
      id.className = "tech-card-id";
      id.textContent = randomHex();
      card.appendChild(id);

      const status = document.createElement("span");
      status.className = "tech-card-status";
      status.innerHTML = '<span class="tech-led"></span> sync';
      card.appendChild(status);

      const scan = document.createElement("div");
      scan.className = "tech-card-scan";
      scan.setAttribute("aria-hidden", "true");
      card.appendChild(scan);
    });
  }

  function initCardGlow() {
    if (reduced) return;
    document.querySelectorAll(".tech-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--gx", `${x}%`);
        card.style.setProperty("--gy", `${y}%`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.removeProperty("--gx");
        card.style.removeProperty("--gy");
      });
    });
  }

  function initSectionReveal() {
    document.querySelectorAll(".section-panel").forEach((panel) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("panel-visible");
              entry.target.classList.add("transmission-active");
              setTimeout(
                () => entry.target.classList.remove("transmission-active"),
                2200
              );
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
      );
      obs.observe(panel);
    });
  }

  /* ---- Wormhole dividers between sectors ---- */
  function initWormholes() {
    const labels = [
      "sector relay",
      "data tunnel",
      "node bridge",
      "signal path",
      "grid link",
      "comm channel",
    ];
    const sections = document.querySelectorAll(
      "main > section.section:not(:last-of-type)"
    );
    sections.forEach((sec, i) => {
      if (sec.nextElementSibling?.classList.contains("wormhole-divider")) return;
      const div = document.createElement("div");
      div.className = "wormhole-divider";
      div.setAttribute("aria-hidden", "true");
      div.innerHTML = `
        <div class="wormhole-core"></div>
        <span class="wormhole-label">${labels[i % labels.length]}</span>
      `;
      sec.after(div);
    });
  }

  /* ---- Console output stream ---- */
  function initConsoleOutput() {
    const outEl = document.querySelector("#hero-console-output .output-text");
    const pingEl = document.getElementById("console-ping");
    if (!outEl) return;

    const lines = [
      "Initializing Sameer Basir profile...",
      "Loading Thoughtworks workspace...",
      "Syncing full-stack modules [React, Node, Python]...",
      "Credentials verified · 10+ certs online",
      "Nexus ready — scroll to traverse the universe →",
    ];

    let idx = 0;

    function cyclePing() {
      if (pingEl) {
        const ms = Math.floor(8 + Math.random() * 24);
        pingEl.textContent = `ping ${ms}ms`;
      }
    }

    function runLines() {
      idx = 0;
      function nextLine() {
        if (idx >= lines.length) return;
        outEl.textContent = lines[idx];
        idx += 1;
        setTimeout(nextLine, idx === 1 ? 1000 : 1600);
      }
      nextLine();
    }

    cyclePing();
    setInterval(cyclePing, 2000);
    setTimeout(runLines, 500);
  }

  function init() {
    tagSections();
    addSectionTags();
    wrapSectionPanels();
    document.dispatchEvent(new CustomEvent("nexus-panels-ready"));
    enhanceTechCards();
    initCardGlow();
    initSectionReveal();
    initWormholes();
    initMatrixRain();
    initNetwork();
    initSpotlight();
    initHUD();
    initJourneyRail();
    initCommandPalette();
    initHeroCode();
    initConsoleOutput();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
