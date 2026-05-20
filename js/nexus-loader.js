/**
 * Nexus OS Boot Loader — sector mount sequence & uplink online
 */
(function () {
  const MIN_MS = 2800;
  const MAX_MS = 6500;

  const MODULES = [
    { mod: "core.init", pct: 18 },
    { mod: "profile.sys", pct: 30 },
    { mod: "work.log", pct: 42 },
    { mod: "cred.db", pct: 52 },
    { mod: "svc.mesh", pct: 62 },
    { mod: "repo.grid", pct: 74 },
    { mod: "comm.link", pct: 86 },
  ];

  const BOOT_LINES = [
    { pct: 2, text: "[nexus.boot] INIT sequence started", cls: "accent" },
    { pct: 6, text: "loading kernel nexus-x v2.0.26 …", cls: "" },
    { pct: 10, text: "cpu: 8 cores online · mem: 8192MB ok", cls: "dim" },
    { pct: 16, text: "mount /dev/nexus0 [ext4] rw", cls: "" },
    { pct: 22, text: "starting particle.mesh daemon", cls: "" },
    { pct: 28, text: "sync HUD telemetry bus", cls: "dim" },
    { pct: 36, text: "hydrating sector filesystem …", cls: "accent" },
    { pct: 48, text: "loading profile.sys · work.log", cls: "" },
    { pct: 58, text: "cred.db integrity check … OK", cls: "ok" },
    { pct: 68, text: "svc.mesh · repo.grid mapped", cls: "" },
    { pct: 78, text: "comm.link TLS 1.3 preflight", cls: "accent" },
    { pct: 86, text: "compiling viewport shaders", cls: "dim" },
    { pct: 92, text: "binding scroll observers", cls: "" },
    { pct: 97, text: "nexus.render() complete", cls: "ok" },
    { pct: 100, text: "▸ UPLINK ONLINE — welcome to the nexus", cls: "ok" },
  ];

  const PHASES = [
    { max: 14, label: "INITIALIZING" },
    { max: 32, label: "LOADING KERNEL" },
    { max: 58, label: "MOUNTING SECTORS" },
    { max: 78, label: "NETWORK SYNC" },
    { max: 94, label: "RENDERING" },
    { max: 100, label: "UPLINK ONLINE" },
  ];

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let rafId = null;
  let bootStart = 0;
  let pageLoaded = false;
  let progress = 0;
  let firedLines = new Set();
  let mountedMods = new Set();
  let finished = false;

  function $(id) {
    return document.getElementById(id);
  }

  function getPhase(pct) {
    for (const p of PHASES) {
      if (pct <= p.max) return p.label;
    }
    return "UPLINK ONLINE";
  }

  function appendLog(text, cls = "") {
    const log = $("loader-log");
    if (!log) return;
    const line = document.createElement("span");
    line.className = `loader-log-line${cls ? ` ${cls}` : ""}`;
    const t = ((performance.now() - bootStart) / 1000).toFixed(3);
    line.textContent = `[${t.padStart(5, "0")}] ${text}`;
    log.appendChild(line);
    log.appendChild(document.createTextNode("\n"));
    log.scrollTop = log.scrollHeight;
  }

  function setProgress(pct) {
    progress = Math.min(100, Math.max(0, pct));
    const fill = $("loader-progress-fill");
    const pctEl = $("loader-pct");
    const phaseEl = $("loader-phase");
    const loader = $("nexus-loader");
    const segs = document.querySelectorAll("#loader-segments span");

    if (fill) fill.style.width = `${progress}%`;
    if (pctEl) pctEl.textContent = `${Math.floor(progress)}%`;
    if (phaseEl) phaseEl.textContent = getPhase(progress);
    if (loader) loader.setAttribute("aria-valuenow", String(Math.floor(progress)));

    const litCount = Math.ceil((progress / 100) * segs.length);
    segs.forEach((seg, i) => seg.classList.toggle("lit", i < litCount));

    BOOT_LINES.forEach((line) => {
      if (progress >= line.pct && !firedLines.has(line.pct)) {
        firedLines.add(line.pct);
        appendLog(line.text, line.cls);
      }
    });

    MODULES.forEach(({ mod, pct: threshold }) => {
      const el = document.querySelector(`.loader-mod[data-mod="${mod}"]`);
      if (!el) return;
      const state = el.querySelector(".loader-mod-state");
      if (progress >= threshold) {
        if (!mountedMods.has(mod)) {
          mountedMods.add(mod);
          el.classList.remove("mounting");
          el.classList.add("mounted");
          state.textContent = "OK";
          appendLog(`sector ${mod} mounted`, "ok");
        }
      } else if (progress >= threshold - 6) {
        el.classList.add("mounting");
        state.textContent = "MNT";
      }
    });

    if (progress >= 100) {
      loader?.classList.add("nexus-loader--complete");
    }
  }

  function initClock() {
    const el = $("loader-clock");
    if (!el) return;
    const tick = () => {
      const d = new Date();
      el.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((n) => String(n).padStart(2, "0"))
        .join(":");
    };
    tick();
    setInterval(tick, 1000);
  }

  function initCanvas() {
    const canvas = $("loader-canvas");
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let streams = [];
    let hexPoints = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(w / 48) + 2;
      const rows = Math.ceil(h / 42) + 2;
      hexPoints = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * 44 + (row % 2) * 22;
          const y = row * 38;
          hexPoints.push({ x, y, phase: Math.random() * Math.PI * 2 });
        }
      }

      streams = Array.from({ length: 28 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 1.5 + Math.random() * 3,
        len: 8 + Math.random() * 24,
        chars: randomHex(),
      }));
    }

    function randomHex() {
      let s = "";
      for (let i = 0; i < 12; i++) s += Math.floor(Math.random() * 16).toString(16);
      return s;
    }

    function drawHex() {
      const t = performance.now() * 0.001;
      hexPoints.forEach((p) => {
        const pulse = 0.04 + Math.sin(t * 2 + p.phase) * 0.03;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          const px = p.x + Math.cos(a) * 16;
          const py = p.y + Math.sin(a) * 16;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(124, 92, 255, ${pulse})`;
        ctx.stroke();
      });
    }

    function drawStreams() {
      ctx.font = "10px monospace";
      streams.forEach((s) => {
        s.y += s.speed;
        if (s.y > h + 20) {
          s.y = -20;
          s.x = Math.random() * w;
          s.chars = randomHex();
        }
        for (let i = 0; i < s.chars.length; i++) {
          const alpha = 0.15 + (i / s.chars.length) * 0.35;
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.fillText(s.chars[i], s.x, s.y - i * 12);
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawHex();
      drawStreams();

      const cx = w / 2;
      const cy = h * 0.38;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.35);
      grad.addColorStop(0, "rgba(124, 92, 255, 0.12)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function tick() {
    const elapsed = performance.now() - bootStart;
    const minDuration = reduced ? 1100 : MIN_MS;
    const timeTarget = easeOutCubic(Math.min(1, elapsed / minDuration)) * 88;
    const loadTarget = pageLoaded ? 100 : 72;
    const target = Math.min(loadTarget, timeTarget + (pageLoaded ? 12 : 0));
    setProgress(target);

    if (progress >= 100) {
      finish();
      return;
    }
    requestAnimationFrame(tick);
  }

  function finish() {
    if (finished) return;
    finished = true;
    setProgress(100);
    appendLog("releasing boot lock · entering portfolio", "accent");

    const loader = $("nexus-loader");
    setTimeout(() => {
      loader?.classList.add("nexus-loader--exit");
      document.body.classList.remove("loader-active");

      setTimeout(() => {
        loader?.remove();
        if (rafId) cancelAnimationFrame(rafId);
        window.dispatchEvent(new CustomEvent("nexus:ready"));
      }, reduced ? 280 : 720);
    }, reduced ? 200 : 550);
  }

  function init() {
    const loader = $("nexus-loader");
    if (!loader) return;

    bootStart = performance.now();
    appendLog("nexus.bootloader v2.0.26", "accent");
    initClock();
    initCanvas();

    window.addEventListener("load", () => {
      pageLoaded = true;
    });

    if (document.readyState === "complete") pageLoaded = true;

    setTimeout(() => {
      if (!pageLoaded) pageLoaded = true;
    }, MAX_MS);

    requestAnimationFrame(tick);
  }

  init();
})();
