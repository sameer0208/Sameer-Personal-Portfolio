/**
 * Portfolio Quest — Nexus Station (click-to-walk · character · sector drawer)
 */
(function () {
  const OPERATOR = {
    name: "Sayyed Sameer Basir",
    title: "Associate Developer · Full Stack Engineer",
    company: "Thoughtworks",
    location: "Hyderabad, Telangana, India",
  };

  const SECTORS = [
    {
      id: "home",
      module: "core.init",
      label: "Nexus Core",
      short: "Core",
      nx: 0.5,
      ny: 0.72,
      color: "#38bdf8",
      desc: "Command center — who you are and what you build today.",
      bio: "Sayyed Sameer Basir is an Associate Developer at Thoughtworks and a Full Stack Engineer from Hyderabad. He builds production web apps with React.js, Node.js, Express, MongoDB, and MERN, while exploring AI, cloud, and clean architecture. This Nexus OS portfolio is his live engineering showcase.",
      stats: [
        ["Name", "Sayyed Sameer Basir"],
        ["Role", "Associate Developer"],
        ["Company", "Thoughtworks"],
        ["Location", "Hyderabad, India"],
        ["Stack", "React · Node · Express · MongoDB · MERN"],
      ],
      highlights: [
        "Alumni Gold Medal · CSE · KL University · CGPA 9.91",
        "Live nexus-console with filesystem easter eggs",
        "Tech pulse feed & orbiting skill nodes",
      ],
      perks: ["Hero terminal & Typed.js roles", "Galaxy canvas & tech marquee"],
      href: "#home",
      xp: 120,
    },
    {
      id: "about",
      module: "profile.sys",
      label: "Profile Bay",
      short: "Profile",
      nx: 0.22,
      ny: 0.5,
      color: "#a78bfa",
      desc: "Identity matrix — education, skills, and community.",
      bio: "B.Tech CSE (Honors) from KL University — CGPA 9.91, Alumni Gold Medal. Full stack developer focused on MERN, AI, and cloud. EPICS & NSS contributor; YouTube channel Learning With Sameer for programming education.",
      stats: [
        ["Degree", "B.Tech CSE (Honors)"],
        ["University", "KL University"],
        ["CGPA", "9.91 · Gold Medal"],
        ["Tabs", "Skills · Experience · Education"],
      ],
      highlights: ["React · Node · Python · Java · MongoDB", "ServiceNow · AWS fundamentals", "Collaborative · continuous learner"],
      perks: ["Interactive tab cards", "Skills / experience / education panels"],
      href: "#about",
      xp: 100,
    },
    {
      id: "experience",
      module: "work.log",
      label: "Work Log",
      short: "Work",
      nx: 0.78,
      ny: 0.48,
      color: "#34d399",
      desc: "Career timeline — Thoughtworks to internships.",
      bio: "Associate Developer at Thoughtworks (Jul 2025–Present, TWU 92). Product Engineering Intern at EffiGO (Jan–May 2025). Freelance Content Developer at Turito. Data Analytics Intern at XtraLeap; Web Dev Intern at CodeClause; roles at Basta and more.",
      stats: [
        ["Current", "Thoughtworks · Associate Developer"],
        ["Recent", "EffiGO · Product Engineering Intern"],
        ["Creator", "Turito · Content Developer"],
        ["Past", "XtraLeap · CodeClause · Basta"],
      ],
      highlights: ["Thoughtworks — global engineering consulting", "EffiGO — procurement / product engineering", "Timeline PDFs & GitHub repos"],
      perks: ["Role badges on timeline", "Offer letters & project links"],
      href: "#experience",
      xp: 130,
    },
    {
      id: "certifications",
      module: "cred.db",
      label: "Cred Vault",
      short: "Certs",
      nx: 0.14,
      ny: 0.3,
      color: "#fbbf24",
      desc: "10+ verified credentials — cloud, data, stack.",
      bio: "Certifications across AWS, ServiceNow Digital Nurture, full-stack web, data science, Java, Python, and more — each with verification links proving structured upskilling.",
      stats: [
        ["Count", "10+ certifications"],
        ["Cloud", "AWS · cloud programs"],
        ["Platform", "ServiceNow · Digital Nurture"],
        ["Stack", "MERN · Full stack · Data science"],
      ],
      highlights: ["ServiceNow deep skilling project on GitHub", "AWS & full-stack completions", "Badge grid with verify URLs"],
      perks: ["Holo certification cards", "External credential links"],
      href: "#certifications",
      xp: 90,
    },
    {
      id: "services",
      module: "svc.mesh",
      label: "Service Mesh",
      short: "Services",
      nx: 0.4,
      ny: 0.22,
      color: "#f472b6",
      desc: "Freelance & creator — hire Sameer for missions.",
      bio: "Open for freelance: full-stack web apps, REST APIs, MERN projects, content creation, and consulting. Runs YouTube channel Learning With Sameer. Based in Hyderabad, remote-friendly.",
      stats: [
        ["Mode", "Freelance · Open to work"],
        ["Build", "Web apps · APIs · MERN"],
        ["Content", "YouTube · Technical writing"],
        ["Contact", "Comm-link form"],
      ],
      highlights: ["End-to-end delivery", "Service cards with tech tags", "Creator + engineer dual role"],
      perks: ["Service mesh section", "Routes to contact uplink"],
      href: "#services",
      xp: 85,
    },
    {
      id: "portfolio",
      module: "repo.grid",
      label: "Repo Grid",
      short: "Repos",
      nx: 0.68,
      ny: 0.24,
      color: "#60a5fa",
      desc: "15+ projects — clones, tools, conference sites.",
      bio: "Flipkart Clone, Sameer Type Writer, International Conference Webpage, TODO app, Standard Clock, YouTube Channel site, All-In-One App, nutrition app, Covid analysis (R), Django blog creator, and more on github.com/sameer0208.",
      stats: [
        ["Count", "15+ repos showcased"],
        ["Stacks", "HTML · CSS · JS · React · MERN · Python"],
        ["Stars", "Flipkart clone · Typewriter · IC site"],
        ["GitHub", "github.com/sameer0208"],
      ],
      highlights: ["Flipkart Clone — full e-commerce UI", "Sameer Type Writer — creative JS", "Conference webpage — KLH design"],
      perks: ["Holo repo cards", "GitHub & live demo links"],
      href: "#portfolio",
      xp: 110,
    },
    {
      id: "contact",
      module: "comm.link",
      label: "Comm Link",
      short: "Comm",
      nx: 0.56,
      ny: 0.4,
      color: "#22d3ee",
      desc: "Hire & connect — form, LinkedIn, GitHub, YouTube.",
      bio: "Comm Link form sends packets to Google Sheets with animated progress. Also on LinkedIn, GitHub (sameer0208), Instagram, and YouTube @learningwithsameer2863 — for hiring, freelance, or collaboration.",
      stats: [
        ["Form", "Packet transmit · Sheets ACK"],
        ["LinkedIn", "Sayyed Sameer Basir"],
        ["GitHub", "sameer0208"],
        ["YouTube", "Learning With Sameer"],
      ],
      highlights: ["TLS-style uplink UI", "Google Sheets integration", "Hyderabad · India"],
      perks: ["Live comm-link animation", "Success message-id on send"],
      href: "#contact",
      xp: 100,
    },
  ];

  const SHARDS = [
    { id: "s1", nx: 0.34, ny: 0.58, fact: "Gold Medal · KL University · CGPA 9.91" },
    { id: "s2", nx: 0.62, ny: 0.6, fact: "Thoughtworks Associate Developer · TWU 92" },
    { id: "s3", nx: 0.3, ny: 0.36, fact: "10+ certifications · AWS · ServiceNow · MERN" },
    { id: "s4", nx: 0.58, ny: 0.34, fact: "15+ projects · github.com/sameer0208" },
    { id: "s5", nx: 0.46, ny: 0.52, fact: "YouTube · Learning With Sameer · Hyderabad" },
  ];

  const BOOT_LINES = [
    "Spawning operator avatar...",
    "Rendering Nexus Station deck...",
    "Linking sector portals...",
    "Loading holographic UI...",
    "Calibrating nav mesh...",
    "Station online.",
  ];

  const TUTORIAL = [
    {
      title: "Step 1 — Open a sector",
      body: "Click any glowing portal on the map OR a chip on the right (Core, Work, Services…). Your character walks there and the sector panel opens.",
    },
    {
      title: "Step 2 — Switch anytime",
      body: "Use the colored tabs at the top of the panel to jump between sectors. The map stays on the left. Press Map to hide the panel.",
    },
    {
      title: "Step 3 — Claim & preview",
      body: "Press Claim XP for rewards. Preview on site scrolls the real portfolio — then tap the big Resume Quest button. Esc closes the panel.",
    },
  ];

  const ARRIVE_DIST = 0.018;
  const WALK_SPEED = 0.55;
  const SHARD_RADIUS = 0.04;
  const PORTAL_HIT_PX = 44;
  const XP_PER_LEVEL = 400;

  let overlay,
    canvas,
    ctx,
    minimap,
    mctx,
    running = false,
    screen = "boot",
    player = { nx: 0.5, ny: 0.72, facing: 0, frame: 0, state: "idle" },
    moveTarget = null,
    stick = { x: 0, y: 0 },
    keys = {},
    activeSector = null,
    visited = new Set(),
    shardsGot = new Set(),
    xp = 0,
    claimed = new Set(),
    rafId = null,
    cam = { nx: 0.5, ny: 0.55 },
    stars = [],
    nebulae = [],
    particles = [],
    pathDots = [],
    time = 0,
    drawerOpen = false,
    tutorialStep = 0,
    reducedMotion = false,
    audioCtx = null;

  function $(id) {
    return document.getElementById(id);
  }

  function playTone(freq, dur, vol = 0.05) {
    if (reducedMotion) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.frequency.value = freq;
      g.gain.value = vol;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.stop(audioCtx.currentTime + dur);
    } catch (_) {}
  }

  function levelFromXp(n) {
    return Math.floor(n / XP_PER_LEVEL) + 1;
  }

  function xpPct(n) {
    return ((n % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  }

  function dist(a, b) {
    return Math.hypot(a.nx - b.nx, a.ny - b.ny);
  }

  function q(sel) {
    const id = sel.startsWith("#") ? sel.slice(1) : sel;
    return document.getElementById(id);
  }

  function syncXpHud() {
    const lvl = q("#ng-level");
    const lvlDrawer = q("#ng-level-drawer");
    const xpEl = q("#ng-xp");
    const xpTotal = q("#ng-xp-total");
    const fill = q("#ng-xp-fill");
    const ping = q("#ng-ping");
    const level = levelFromXp(xp);
    const pct = xpPct(xp);

    if (lvl) lvl.textContent = String(level);
    if (lvlDrawer) lvlDrawer.textContent = String(level);
    if (xpEl) {
      xpEl.textContent = String(xp);
      xpEl.classList.remove("ng-xp-pop");
      void xpEl.offsetWidth;
      xpEl.classList.add("ng-xp-pop");
    }
    if (xpTotal) xpTotal.textContent = String(xp);
    if (fill) {
      fill.style.transition = "none";
      fill.style.width = `${pct}%`;
      requestAnimationFrame(() => {
        fill.style.transition = "width 0.45s cubic-bezier(0.34, 1.2, 0.64, 1)";
      });
    }
    if (ping) ping.textContent = `${8 + Math.floor(Math.random() * 16)}ms`;
    const d = q("#ng-sectors-done");
    const s = q("#ng-shards-done");
    if (d) d.textContent = String(visited.size);
    if (s) s.textContent = String(shardsGot.size);
  }

  function addXp(amount, label) {
    xp += amount;
    syncXpHud();
    renderQuests();
    if (label) toast(`+${amount} XP · ${label}`);
  }

  function updateHud() {
    syncXpHud();
  }

  function renderQuests() {
    const list = $("ng-quest-list");
    if (!list) return;
    list.innerHTML = "";
    [
      { text: "Visit all 7 portals", done: visited.size >= 7, active: visited.size < 7 },
      ...SECTORS.map((sec) => ({
        text: `${sec.short} — ${sec.desc}`,
        done: visited.has(sec.id),
        active: activeSector?.id === sec.id,
      })),
      { text: "5 data shards", done: shardsGot.size >= 5, active: shardsGot.size < 5 },
    ].forEach((q) => {
      const li = document.createElement("li");
      li.textContent = q.text;
      if (q.done) li.classList.add("is-done");
      else if (q.active) li.classList.add("is-active");
      list.appendChild(li);
    });
  }

  function toast(msg) {
    const el = $("ng-toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.hidden = true;
    }, 2800);
  }

  function showScreen(name) {
    screen = name;
    document.querySelectorAll(".ng-screen").forEach((s) => {
      const on = s.dataset.screen === name;
      s.classList.toggle("is-active", on);
      s.hidden = !on;
    });
  }

  function setNavHint(text) {
    const el = $("ng-nav-hint-text");
    if (el) el.textContent = text;
  }

  function setCmdStatus(text) {
    const el = $("ng-cmd-status");
    if (el) el.textContent = `Status: ${text}`;
  }

  function setCommandsOpen(open) {
    const panel = $("ng-commands-panel");
    const body = $("ng-commands-body");
    const toggle = $("ng-commands-toggle");
    if (!panel || !body) return;
    panel.classList.toggle("is-collapsed", !open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  /* ---- World transform (camera + split layout) ---- */
  function getViewBounds() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    /* Canvas already lives in the left column — render full width, no extra split */
    return { w, h, viewW: w, pad: 36, scale: Math.min(w, h) * 0.82 };
  }

  function worldToScreen(nx, ny) {
    const { viewW, h, pad, scale } = getViewBounds();
    const cx = viewW / 2;
    const cy = h * 0.58;
    return {
      x: cx + (nx - cam.nx) * scale,
      y: cy + (ny - cam.ny) * scale,
    };
  }

  function screenToWorld(px, py) {
    const { viewW, h, scale } = getViewBounds();
    const cx = viewW / 2;
    const cy = h * 0.58;
    return {
      nx: cam.nx + (px - cx) / scale,
      ny: cam.ny + (py - cy) / scale,
    };
  }

  function hitPortal(px, py) {
    let best = null;
    let bestD = PORTAL_HIT_PX;
    SECTORS.forEach((sec) => {
      const p = worldToScreen(sec.nx, sec.ny);
      const d = Math.hypot(p.x - px, p.y - py);
      if (d < bestD) {
        bestD = d;
        best = sec;
      }
    });
    return best;
  }

  /* ---- Character & environment rendering ---- */
  function initWorld() {
    stars = Array.from({ length: reducedMotion ? 60 : 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      s: Math.random() * 2 + 0.5,
    }));
    nebulae = [
      { x: 0.25, y: 0.2, r: 0.35, c: "124, 92, 255" },
      { x: 0.75, y: 0.15, r: 0.28, c: "56, 189, 248" },
      { x: 0.5, y: 0.65, r: 0.4, c: "236, 72, 153" },
    ];
  }

  function drawBackground(w, h, viewW) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#03050c");
    sky.addColorStop(0.45, "#0a1020");
    sky.addColorStop(1, "#050810");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, viewW, h);

    nebulae.forEach((n, i) => {
      const pulse = 0.08 + Math.sin(time * 0.0008 + i) * 0.04;
      const g = ctx.createRadialGradient(
        n.x * viewW,
        n.y * h * 0.5,
        0,
        n.x * viewW,
        n.y * h * 0.5,
        n.r * viewW
      );
      g.addColorStop(0, `rgba(${n.c}, ${pulse + 0.06})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, viewW, h);
    });

    stars.forEach((s) => {
      const px = s.x * viewW + (cam.nx - 0.5) * 30;
      const py = s.y * h * 0.55 + (cam.ny - 0.5) * 20;
      const tw = 0.3 + Math.sin(time * 0.003 + s.z * 8) * 0.25;
      ctx.fillStyle = `rgba(220, 230, 255, ${tw * s.s * 0.4})`;
      ctx.fillRect(px, py, s.s, s.s);
    });

    /* distant planets */
    [[0.12, 0.18, 28, "#1e3a5f"], [0.88, 0.22, 22, "#312e81"]].forEach(([px, py, r, col]) => {
      const x = px * viewW;
      const y = py * h;
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      g.addColorStop(0, col);
      g.addColorStop(1, "#020408");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawStationDeck(viewW, h) {
    const floorY = h * 0.62;
    const grd = ctx.createLinearGradient(0, floorY - 20, 0, h);
    grd.addColorStop(0, "rgba(12, 20, 40, 0.6)");
    grd.addColorStop(0.4, "rgba(8, 14, 28, 0.95)");
    grd.addColorStop(1, "#04060e");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(viewW, floorY);
    ctx.lineTo(viewW, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
    ctx.lineWidth = 1;
    const lines = 14;
    for (let i = 0; i <= lines; i++) {
      const t = i / lines;
      const x = t * viewW;
      ctx.beginPath();
      ctx.moveTo(viewW / 2 + (x - viewW / 2) * 0.15, floorY);
      ctx.lineTo(x, h - 8);
      ctx.stroke();
    }
    for (let j = 0; j < 8; j++) {
      const ty = floorY + ((h - floorY) * j) / 8;
      ctx.beginPath();
      ctx.moveTo(0, ty);
      ctx.lineTo(viewW, ty);
      ctx.stroke();
    }

    /* central hub ring */
    const hub = worldToScreen(0.5, 0.55);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(hub.x, hub.y + 20, 80, 24, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawPortal(sec) {
    const p = worldToScreen(sec.nx, sec.ny);
    const active = activeSector?.id === sec.id;
    const done = visited.has(sec.id);
    const pulse = 0.5 + Math.sin(time * 0.004 + sec.nx * 10) * 0.2;
    const gateW = 36;
    const gateH = 52;

    if (active || dist(player, sec) < 0.06) {
      ctx.strokeStyle = `${sec.color}99`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 8, gateW + 16, 14, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(p.x, p.y);

    /* pillars */
    ctx.fillStyle = "rgba(20, 28, 48, 0.95)";
    ctx.fillRect(-gateW, -gateH, 10, gateH);
    ctx.fillRect(gateW - 10, -gateH, 10, gateH);

    /* energy field */
    const eg = ctx.createLinearGradient(0, -gateH, 0, 0);
    eg.addColorStop(0, `rgba(${hexToRgb(sec.color)}, ${pulse * 0.9})`);
    eg.addColorStop(1, `rgba(${hexToRgb(sec.color)}, 0.05)`);
    ctx.fillStyle = eg;
    ctx.fillRect(-gateW + 10, -gateH + 4, gateW * 2 - 20, gateH - 8);

    ctx.strokeStyle = sec.color;
    ctx.lineWidth = done ? 3 : 2;
    ctx.strokeRect(-gateW + 10, -gateH + 4, gateW * 2 - 20, gateH - 8);

    /* arch */
    ctx.beginPath();
    ctx.arc(0, -gateH + 4, gateW - 6, Math.PI, 0);
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = "#fff";
    ctx.font = "600 12px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sec.label, p.x, p.y + 22);
    ctx.font = "500 9px IBM Plex Mono, monospace";
    ctx.fillStyle = sec.color;
    ctx.fillText(sec.module, p.x, p.y + 36);
    if (activeSector?.id === sec.id || visited.has(sec.id)) {
      ctx.font = "400 8px Outfit, sans-serif";
      ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
      const hint = (sec.short || sec.label) + " · " + (sec.stats?.[0]?.[1] || sec.desc).slice(0, 28);
      ctx.fillText(hint.length > 32 ? hint.slice(0, 31) + "…" : hint, p.x, p.y + 50);
    }
  }

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const n = parseInt(h, 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  }

  function drawCharacter() {
    const p = worldToScreen(player.nx, player.ny);
    const moving = player.state === "walk";
    player.frame = moving ? (player.frame + 0.18) % 8 : 0;
    const bob = moving ? Math.sin(player.frame * Math.PI) * 3 : Math.sin(time * 0.002) * 1.5;
    const px = p.x;
    const py = p.y + bob;

    /* shadow */
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(px, p.y + 14, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(px, py);
    if (Math.abs(player.facing) > 0.1) {
      ctx.scale(player.facing < 0 ? -1 : 1, 1);
    }

    const legOff = moving ? Math.sin(player.frame * Math.PI) * 5 : 0;

    /* thruster glow */
    ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
    ctx.beginPath();
    ctx.ellipse(-6, 8, 8, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();

    /* legs */
    ctx.fillStyle = "#1a2238";
    ctx.fillRect(-7, 4 + legOff, 5, 14);
    ctx.fillRect(2, 4 - legOff, 5, 14);

    /* body suit */
    const bodyG = ctx.createLinearGradient(-12, -20, 12, 10);
    bodyG.addColorStop(0, "#3d4f6f");
    bodyG.addColorStop(0.5, "#2a3548");
    bodyG.addColorStop(1, "#1e2838");
    ctx.fillStyle = bodyG;
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(-11, -18, 22, 24, 4);
      ctx.fill();
    } else {
      ctx.fillRect(-11, -18, 22, 24);
    }

    /* chest light */
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 12;
    ctx.fillRect(-3, -8, 6, 6);
    ctx.shadowBlur = 0;

    /* arms */
    ctx.fillStyle = "#2a3548";
    ctx.fillRect(-16, -14, 6, 18);
    ctx.fillRect(10, -14, 6, 18);

    /* helmet */
    ctx.fillStyle = "#4a5568";
    ctx.beginPath();
    ctx.arc(0, -26, 13, 0, Math.PI * 2);
    ctx.fill();
    const visor = ctx.createLinearGradient(-10, -30, 10, -22);
    visor.addColorStop(0, "rgba(56, 189, 248, 0.9)");
    visor.addColorStop(0.5, "rgba(167, 139, 250, 0.7)");
    visor.addColorStop(1, "rgba(56, 189, 248, 0.4)");
    ctx.fillStyle = visor;
    ctx.beginPath();
    ctx.ellipse(0, -26, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawPath() {
    if (!moveTarget) return;
    const a = worldToScreen(player.nx, player.ny);
    const b = worldToScreen(moveTarget.nx, moveTarget.ny);
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(b.x, b.y, 6 + Math.sin(time * 0.01) * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawShards() {
    SHARDS.forEach((sh) => {
      if (shardsGot.has(sh.id)) return;
      const p = worldToScreen(sh.nx, sh.ny);
      const pulse = 0.7 + Math.sin(time * 0.008) * 0.3;
      ctx.save();
      ctx.translate(p.x, p.y - 8);
      ctx.rotate(time * 0.002);
      ctx.fillStyle = `rgba(251, 191, 36, ${pulse})`;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 16;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(4, 0);
        ctx.lineTo(0, 10);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawWorld() {
    const { w, h, viewW } = getViewBounds();
    time = performance.now();
    drawBackground(w, h, viewW);
    drawStationDeck(viewW, h);

    SECTORS.forEach((s) => {
      const a = worldToScreen(0.5, 0.55);
      const b = worldToScreen(s.nx, s.ny);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + 10);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    drawShards();
    SECTORS.forEach(drawPortal);
    drawPath();
    drawCharacter();

    particles = particles.filter((p) => p.life > 0);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
    });
    ctx.globalAlpha = 1;

    drawMinimap();
  }

  function drawMinimap() {
    if (!mctx || !minimap) return;
    const w = minimap.width;
    const h = minimap.height;
    mctx.fillStyle = "rgba(4,8,16,0.92)";
    mctx.fillRect(0, 0, w, h);
    SECTORS.forEach((s) => {
      mctx.fillStyle = visited.has(s.id) ? s.color : "#555";
      mctx.beginPath();
      mctx.arc(s.nx * w, s.ny * h, activeSector?.id === s.id ? 5 : 3, 0, Math.PI * 2);
      mctx.fill();
    });
    mctx.fillStyle = "#38bdf8";
    mctx.beginPath();
    mctx.arc(player.nx * w, player.ny * h, 4, 0, Math.PI * 2);
    mctx.fill();
  }

  function spawnParticles(x, y, color, n = 16) {
    if (reducedMotion) return;
    for (let i = 0; i < n; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1,
        color,
      });
    }
  }

  /* ---- Movement ---- */
  function goToSector(sec, openPanel = true) {
    activeSector = sec;
    moveTarget = { nx: sec.nx, ny: sec.ny + 0.02 };
    pendingOpen = null;
    refreshTabs();

    if (openPanel) {
      openDrawer(sec);
      setNavHint(`Viewing ${sec.label} — use tabs to switch sector`);
      setCmdStatus(`Sector open: ${sec.label}`);
    } else {
      setNavHint(`Walking to ${sec.label}…`);
      setCmdStatus(`Traveling to ${sec.label}`);
    }
    playTone(400, 0.05);
  }

  function updateMovement(dt) {
    let ax = stick.x;
    let ay = stick.y;
    if (keys.left) ax -= 1;
    if (keys.right) ax += 1;
    if (keys.up) ay -= 1;
    if (keys.down) ay += 1;

    if (!moveTarget && (ax !== 0 || ay !== 0)) {
      const len = Math.hypot(ax, ay) || 1;
      player.nx += (ax / len) * WALK_SPEED * dt * 0.5;
      player.ny += (ay / len) * WALK_SPEED * dt * 0.5;
      player.facing = ax / len;
      player.state = "walk";
    } else if (moveTarget) {
      const dx = moveTarget.nx - player.nx;
      const dy = moveTarget.ny - player.ny;
      const d = Math.hypot(dx, dy);
      if (d < ARRIVE_DIST) {
        player.nx = moveTarget.nx;
        player.ny = moveTarget.ny;
        player.state = "idle";
        moveTarget = null;
        setNavHint("Arrived — click another portal or use tabs to switch");
        setCmdStatus(drawerOpen ? `At ${activeSector?.label || "sector"}` : "Ready — click a portal");
      } else {
        const step = WALK_SPEED * dt;
        player.nx += (dx / d) * step;
        player.ny += (dy / d) * step;
        player.facing = dx < 0 ? -1 : 1;
        player.state = "walk";
      }
    } else {
      player.state = "idle";
    }

    player.nx = Math.max(0.06, Math.min(0.94, player.nx));
    player.ny = Math.max(0.2, Math.min(0.82, player.ny));

    cam.nx += (player.nx - cam.nx) * 0.06;
    cam.ny += (player.ny - cam.ny) * 0.06;

    SHARDS.forEach((sh) => {
      if (shardsGot.has(sh.id)) return;
      if (dist(player, sh) < SHARD_RADIUS) {
        shardsGot.add(sh.id);
        const p = worldToScreen(sh.nx, sh.ny);
        spawnParticles(p.x, p.y, "#fbbf24");
        addXp(50, sh.fact || "Data shard");
        playTone(880, 0.05);
        checkVictory();
      }
    });
  }

  /* ---- Drawer / sectors ---- */
  function buildSectorTabs() {
    const nav = $("ng-sector-tabs");
    if (!nav) return;
    nav.innerHTML = "";
    SECTORS.forEach((sec) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ng-tab";
      btn.dataset.sector = sec.id;
      btn.style.setProperty("--tab-color", sec.color);
      btn.textContent = sec.short;
      btn.addEventListener("click", () => switchSector(sec));
      nav.appendChild(btn);
    });
  }

  function buildSectorRail() {
    const rail = $("ng-sector-rail");
    if (!rail) return;
    rail.innerHTML = "";
    SECTORS.forEach((sec) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ng-rail-chip";
      btn.dataset.sector = sec.id;
      btn.style.setProperty("--chip-color", sec.color);
      btn.innerHTML = `<span class="ng-rail-dot"></span>${sec.short}`;
      btn.addEventListener("click", () => switchSector(sec));
      rail.appendChild(btn);
    });
  }

  function refreshTabs() {
    document.querySelectorAll(".ng-tab").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.sector === activeSector?.id);
    });
    document.querySelectorAll(".ng-rail-chip").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.sector === activeSector?.id);
      btn.classList.toggle("is-visited", visited.has(btn.dataset.sector));
    });
  }

  function switchSector(sec) {
    goToSector(sec, true);
  }

  function fillDrawer(sec) {
    const player = q("#ng-drawer-player");
    if (player) {
      player.textContent = `${OPERATOR.name} · ${OPERATOR.title}`;
    }
    syncXpHud();

    const mod = q("#ng-sector-module");
    const name = q("#ng-sector-name");
    const desc = q("#ng-sector-desc");
    const bio = q("#ng-sector-bio");
    if (mod) mod.textContent = sec.module;
    if (name) name.textContent = sec.label;
    if (desc) desc.textContent = sec.desc;
    if (bio) bio.textContent = sec.bio || sec.desc;

    const stats = q("#ng-sector-stats");
    if (stats) {
      stats.innerHTML = "";
      sec.stats.forEach(([k, v]) => {
        const dt = document.createElement("dt");
        dt.textContent = k;
        const dd = document.createElement("dd");
        dd.textContent = v;
        stats.appendChild(dt);
        stats.appendChild(dd);
      });
    }

    const hi = q("#ng-sector-highlights");
    if (hi) {
      hi.innerHTML = "";
      (sec.highlights || []).forEach((h) => {
        const li = document.createElement("li");
        li.textContent = h;
        hi.appendChild(li);
      });
    }

    const perks = q("#ng-sector-perks");
    if (perks) {
      perks.innerHTML = "";
      sec.perks.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = p;
        perks.appendChild(li);
      });
    }

    const rewardXp = q("#ng-reward-xp");
    if (rewardXp) rewardXp.textContent = String(sec.xp);
    const claim = q("#ng-collect-reward");
    if (claim) {
      const done = claimed.has(sec.id);
      claim.disabled = done;
      claim.innerHTML = done
        ? '<i class="bx bx-check"></i> Claimed'
        : `<i class="bx bx-trophy"></i> Claim +${sec.xp} XP`;
    }
  }

  function openDrawer(sec) {
    activeSector = sec;
    drawerOpen = true;
    visited.add(sec.id);
    const panel = $("ng-sector-panel");
    const layout = $("ng-hub-layout");
    if (panel) panel.hidden = false;
    if (layout) layout.classList.add("has-drawer");
    setCommandsOpen(false);
    requestAnimationFrame(resizeCanvas);
    fillDrawer(sec);
    refreshTabs();
    updateHud();
    renderQuests();
    playTone(620, 0.07);
    setNavHint("Tabs switch sector · Map closes this panel");
    setCmdStatus(`Reading ${sec.label} — press Claim XP`);
  }

  function closeDrawer() {
    drawerOpen = false;
    const panel = $("ng-sector-panel");
    const layout = $("ng-hub-layout");
    if (panel) panel.hidden = true;
    if (layout) layout.classList.remove("has-drawer");
    requestAnimationFrame(resizeCanvas);
    setCommandsOpen(true);
    setNavHint("Click a glowing portal or a chip on the right");
    setCmdStatus("Map view — pick a sector");
    playTone(300, 0.06);
  }

  function claimReward() {
    if (!activeSector) {
      toast("Open a sector first (click a portal)");
      return;
    }
    if (!drawerOpen) openDrawer(activeSector);
    if (claimed.has(activeSector.id)) {
      toast("Already claimed for this sector");
      return;
    }
    const amount = activeSector.xp;
    const label = activeSector.label;
    claimed.add(activeSector.id);
    addXp(amount, label);
    playTone(784, 0.08);
    fillDrawer(activeSector);
    checkVictory();
  }

  let peekRestoreDrawer = false;

  function peekSite() {
    if (!activeSector) {
      toast("Open a sector first");
      return;
    }
    peekRestoreDrawer = drawerOpen;
    overlay?.classList.add("ng-peek");
    document.body.classList.remove("portfolio-game-active");
    const resume = $("ng-resume-quest");
    if (resume) resume.hidden = false;
    const el = document.querySelector(activeSector.href);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    setCmdStatus("Previewing site — tap Resume Quest");
    toast("Previewing portfolio — tap Resume Quest below to return");
  }

  function resumeQuest() {
    overlay?.classList.remove("ng-peek");
    document.body.classList.add("portfolio-game-active");
    const resume = $("ng-resume-quest");
    if (resume) resume.hidden = true;
    if (peekRestoreDrawer && activeSector) {
      openDrawer(activeSector);
    }
    setCmdStatus(drawerOpen ? `Back in game — ${activeSector?.label}` : "Map view — pick a sector");
  }

  function checkVictory() {
    if (visited.size >= SECTORS.length && shardsGot.size >= SHARDS.length) {
      const vic = $("ng-victory");
      if (vic) {
        vic.hidden = false;
        const sc = $("ng-final-score");
        if (sc) sc.textContent = String(xp);
      }
    }
  }

  /* ---- Game lifecycle ---- */
  function openGame() {
    overlay = $("ng-overlay");
    if (!overlay) return;
    overlay.hidden = false;
    overlay.classList.remove("ng-peek");
    document.body.classList.add("portfolio-game-active");
    window.dispatchEvent(new CustomEvent("nexus-scroll-busy", { detail: { busy: true } }));
    showScreen("boot");
    runBoot();
    playTone(440, 0.08);
  }

  function closeGame() {
    stopLoop();
    closeDrawer();
    resumeQuest();
    if (overlay) overlay.hidden = true;
    document.body.classList.remove("portfolio-game-active");
    const vic = $("ng-victory");
    if (vic) vic.hidden = true;
    $("ng-tutorial").hidden = true;
    window.dispatchEvent(new CustomEvent("nexus-scroll-busy", { detail: { busy: false } }));
    screen = "boot";
  }

  function runBoot() {
    const fill = $("ng-boot-fill");
    const status = $("ng-boot-status");
    let step = 0;
    const tick = () => {
      const pct = Math.min(100, ((step + 1) / BOOT_LINES.length) * 100);
      if (fill) fill.style.width = `${pct}%`;
      if (status) status.textContent = BOOT_LINES[step];
      step += 1;
      if (step < BOOT_LINES.length) setTimeout(tick, 300);
      else if (status) status.textContent = "Press Start to enter Nexus Station";
    };
    tick();
  }

  function startHub() {
    showScreen("hub");
    canvas = $("ng-canvas");
    minimap = $("ng-minimap");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    if (minimap) mctx = minimap.getContext("2d");
    initWorld();
    buildSectorTabs();
    buildSectorRail();
    running = true;
    player.nx = SECTORS[0].nx;
    player.ny = SECTORS[0].ny + 0.04;
    cam.nx = player.nx;
    cam.ny = player.ny;
    updateHud();
    renderQuests();
    setNavHint("Click a glowing portal on the map to start");
    setCmdStatus("Pick a sector — Core, Work, Services…");
    setCommandsOpen(false);
    bindCanvasOnce();
    watchCanvasResize();
    requestAnimationFrame(() => {
      resizeCanvas();
      requestAnimationFrame(resizeCanvas);
    });
    loop();
    showTutorial();
    playTone(523, 0.1);
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const wrap = canvas.parentElement;
    const w = wrap?.clientWidth || canvas.clientWidth;
    const h = wrap?.clientHeight || canvas.clientHeight;
    if (w < 2 || h < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  let last = 0;
  function loop(ts) {
    if (!running) return;
    const dt = Math.min(0.032, (ts - last || 16) / 1000);
    last = ts;
    updateMovement(dt);
    drawWorld();
    rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  function showTutorial() {
    if (sessionStorage.getItem("ng-tutorial-v2")) return;
    tutorialStep = 0;
    renderTutorialStep();
    $("ng-tutorial").hidden = false;
  }

  function renderTutorialStep() {
    const t = TUTORIAL[tutorialStep];
    if (!t) return;
    $("ng-tutorial-step").textContent = `${tutorialStep + 1} / ${TUTORIAL.length}`;
    $("ng-tutorial-title").textContent = t.title;
    $("ng-tutorial-body").textContent = t.body;
    $("ng-tutorial-next").textContent = tutorialStep === TUTORIAL.length - 1 ? "Enter station" : "Next";
  }

  function dismissTutorial() {
    $("ng-tutorial").hidden = true;
    sessionStorage.setItem("ng-tutorial-v2", "1");
  }

  function bindJoystick() {
    const base = $("ng-joystick");
    const knob = $("ng-joystick-knob");
    if (!base || !knob) return;
    const maxR = 34;
    const reset = () => {
      knob.style.transform = "translate(0,0)";
      stick.x = 0;
      stick.y = 0;
    };
    const move = (cx, cy) => {
      const r = base.getBoundingClientRect();
      let dx = cx - (r.left + r.width / 2);
      let dy = cy - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      if (len > maxR) {
        dx = (dx / len) * maxR;
        dy = (dy / len) * maxR;
      }
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      stick.x = dx / maxR;
      stick.y = dy / maxR;
    };
    base.addEventListener("pointerdown", (e) => {
      base.setPointerCapture(e.pointerId);
      move(e.clientX, e.clientY);
    });
    base.addEventListener("pointermove", (e) => {
      if (base.hasPointerCapture(e.pointerId)) move(e.clientX, e.clientY);
    });
    base.addEventListener("pointerup", reset);
    base.addEventListener("pointercancel", reset);
  }

  let resizeObs = null;
  function watchCanvasResize() {
    const wrap = canvas?.parentElement;
    if (!wrap || resizeObs) return;
    resizeObs = new ResizeObserver(() => running && resizeCanvas());
    resizeObs.observe(wrap);
  }

  let canvasBound = false;
  function bindCanvasOnce() {
    if (canvasBound || !canvas) return;
    canvasBound = true;
    canvas.addEventListener("click", (e) => {
      if (screen !== "hub" || overlay?.classList.contains("ng-peek")) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const hit = hitPortal(px, py);
      if (hit) {
        goToSector(hit, true);
      } else {
        toast("Click a glowing portal (gateway), not empty floor");
      }
    });
  }

  function bindControls() {
    $("ps5-launch")?.addEventListener("click", openGame);
    $("ng-boot-start")?.addEventListener("click", startHub);
    $("ng-exit")?.addEventListener("click", closeGame);
    $("ng-help")?.addEventListener("click", () => {
      setCommandsOpen(true);
      $("ng-commands-panel")?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
      sessionStorage.removeItem("ng-tutorial-v2");
      showTutorial();
    });
    $("ng-commands-toggle")?.addEventListener("click", () => {
      const panel = $("ng-commands-panel");
      setCommandsOpen(panel?.classList.contains("is-collapsed"));
    });
    $("ng-sector-back")?.addEventListener("click", closeDrawer);
    $("ng-collect-reward")?.addEventListener("click", claimReward);
    $("ng-visit-section")?.addEventListener("click", peekSite);
    $("ng-resume-quest")?.addEventListener("click", resumeQuest);
    $("ng-victory-close")?.addEventListener("click", closeGame);
    $("ng-tutorial-skip")?.addEventListener("click", dismissTutorial);
    $("ng-tutorial-next")?.addEventListener("click", () => {
      tutorialStep += 1;
      if (tutorialStep >= TUTORIAL.length) dismissTutorial();
      else renderTutorialStep();
    });

    bindJoystick();

    window.addEventListener("keydown", (e) => {
      if (overlay?.hidden) return;
      if (overlay?.classList.contains("ng-peek") && e.key === "Escape") {
        resumeQuest();
        return;
      }
      if (e.key === "Escape") {
        if (drawerOpen) closeDrawer();
        else closeGame();
        return;
      }
      if (screen === "boot" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        startHub();
        return;
      }
      if (screen !== "hub") return;
      const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (map[key]) {
        e.preventDefault();
        keys[map[key]] = true;
      }
      if (e.key === "Enter" && drawerOpen) {
        e.preventDefault();
        claimReward();
      }
      if (e.key === "m" || e.key === "M") {
        if (drawerOpen) closeDrawer();
        else if (activeSector) openDrawer(activeSector);
      }
    });
    window.addEventListener("keyup", (e) => {
      const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (map[key]) keys[map[key]] = false;
    });
    window.addEventListener("resize", () => running && resizeCanvas());
  }

  function init() {
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("ng-sectors-total").textContent = "7";
    $("ng-shards-total").textContent = "5";
    bindControls();
  }

  window.NexusPortfolioQuest = { open: openGame, close: closeGame };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
