/**
 * Comm Link Uplink Station — radar, packet composer, secure transmit
 */
(function () {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyY-Sqpml5xU63m5pGsg-sUJPu75KYnoT4Ywtmd1gPg7LZiviswCKtVfjzq-Gtgm4a-/exec";

  const FIELD_WEIGHTS = {
    name: 25,
    email: 25,
    message: 35,
    mobile: 7,
    subject: 8,
  };

  const FIELDS = [
    { id: "name", required: true, log: "origin.name" },
    { id: "email", required: true, log: "origin.mail" },
    { id: "mobile", required: false, log: "origin.tel" },
    { id: "subject", required: false, log: "uplink.subject" },
    { id: "message", required: true, log: "payload.body" },
  ];

  const NODE_POS = {
    you: { x: 0.5, y: 0.12 },
    inet: { x: 0.88, y: 0.42 },
    hub: { x: 0.14, y: 0.72 },
    dest: { x: 0.82, y: 0.88 },
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let logCount = 0;
  let radarRaf = null;

  function ts() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  }

  function appendLog(text, type = "") {
    const body = document.getElementById("comm-log-body");
    const countEl = document.getElementById("comm-log-count");
    if (!body) return;

    logCount += 1;
    if (countEl) countEl.textContent = `${logCount} event${logCount === 1 ? "" : "s"}`;

    const line = document.createElement("span");
    line.className = `comm-log-line${type ? ` ${type}` : ""}`;
    line.textContent = `[${ts()}] ${text}`;
    body.appendChild(line);
    body.appendChild(document.createTextNode("\n"));
    body.scrollTop = body.scrollHeight;

    while (body.childNodes.length > 24) {
      body.removeChild(body.firstChild);
    }
  }

  function initRadar() {
    const canvas = document.getElementById("comm-radar");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let sweep = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      if (!w || !h) return;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(cx, cy) * 0.92;

      ctx.clearRect(0, 0, w, h);

      for (let r = 0.25; r <= 1; r += 0.25) {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${0.08 + r * 0.06})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(124, 92, 255, 0.12)";
      ctx.lineWidth = 1;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
        ctx.stroke();
      }

      Object.entries(NODE_POS).forEach(([key, pos]) => {
        const nx = pos.x * w;
        const ny = pos.y * h;
        const active = document
          .querySelector(`.comm-node[data-node="${key}"]`)
          ?.classList.contains("active");
        ctx.beginPath();
        ctx.arc(nx, ny, active ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = active ? "rgba(52, 211, 153, 0.9)" : "rgba(56, 189, 248, 0.5)";
        ctx.fill();
        if (active) {
          ctx.beginPath();
          ctx.arc(nx, ny, 10, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(52, 211, 153, 0.35)";
          ctx.stroke();
        }
      });

      if (!reduced) {
        sweep += 0.025;
        const angle = sweep % (Math.PI * 2);
        const grad = ctx.createConicGradient(angle, cx, cy);
        grad.addColorStop(0, "rgba(52, 211, 153, 0.35)");
        grad.addColorStop(0.08, "transparent");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.fill();
      }

      radarRaf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  function setActiveNode(nodeKey) {
    document.querySelectorAll(".comm-node[data-node]").forEach((n) => {
      n.classList.toggle("active", n.dataset.node === nodeKey);
    });
    const ping = document.getElementById("comm-radar-ping");
    const pos = NODE_POS[nodeKey];
    if (ping && pos) {
      const wrap = ping.parentElement;
      const rect = wrap.getBoundingClientRect();
      ping.style.left = `${pos.x * 100}%`;
      ping.style.top = `${pos.y * 100}%`;
      ping.classList.add("visible");
    }
  }

  function setRouteHop(index) {
    const hops = document.querySelectorAll(".comm-route-hop");
    const lines = document.querySelectorAll(".comm-route-line");
    hops.forEach((hop, i) => {
      hop.classList.remove("active", "transmitting");
      if (i < index) hop.classList.add("active");
      if (i === index) hop.classList.add("transmitting");
    });
    lines.forEach((line, i) => {
      line.classList.toggle("active", i < index);
    });
  }

  function calcReadiness() {
    let pct = 0;
    const ready = FIELDS.filter((f) => f.required).every((f) => {
      const el = document.getElementById(f.id);
      return el && (el.value || "").trim().length > 0;
    });

    FIELDS.forEach(({ id }) => {
      const el = document.getElementById(id);
      const ok = el && (el.value || "").trim().length > 0;
      document
        .querySelector(`.comm-packet-seg[data-field="${id}"]`)
        ?.classList.toggle("filled", ok);
      if (ok) pct += FIELD_WEIGHTS[id] || 0;
    });

    return { pct: Math.min(100, pct), ready };
  }

  function updateReadiness() {
    const { pct, ready } = calcReadiness();
    const fill = document.getElementById("comm-readiness-fill");
    const pctEl = document.getElementById("comm-readiness-pct");
    const btn = document.getElementById("comm-transmit-btn");
    const form = document.getElementById("comm-composer");

    if (fill) fill.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (btn) btn.disabled = !ready;
    form?.classList.toggle("comm-ready", ready);
  }

  function initFields() {
    const form = document.getElementById("comm-composer");
    const strip = document.getElementById("tls-strip");
    const tlsStatus = document.getElementById("tls-status");
    if (!form) return;

    FIELDS.forEach(({ id, log }) => {
      const el = document.getElementById(id);
      const wrap = form.querySelector(`.comm-field[data-field="${id}"]`);
      if (!el) return;

      let wasEmpty = !(el.value || "").trim();

      el.addEventListener("focus", () => {
        wrap?.classList.add("comm-field--active");
        setActiveNode("you");
        if (strip && tlsStatus) {
          strip.classList.add("handshake");
          strip.classList.remove("secure");
          tlsStatus.textContent = "TLS 1.3 handshake in progress…";
        }
        appendLog(`sync FIELD::${log}`);
      });

      el.addEventListener("blur", () => {
        wrap?.classList.remove("comm-field--active");
      });

      el.addEventListener("input", () => {
        updateReadiness();
        const ok = (el.value || "").trim().length > 0;
        if (ok && wasEmpty) {
          appendLog(`buffer ${log} [${el.value.trim().length}B]`);
          wasEmpty = false;
        }
        if (!ok) wasEmpty = true;
      });
    });

    updateReadiness();
  }

  function initLatency() {
    const el = document.getElementById("comm-latency");
    if (!el || reduced) return;
    setInterval(() => {
      el.textContent = `~${18 + Math.floor(Math.random() * 14)}ms`;
    }, 2200);
  }

  async function animateTransmit() {
    const nodes = ["you", "inet", "hub", "dest"];
    const hops = [0, 1, 2, 3];
    const form = document.getElementById("comm-composer");
    form?.classList.add("transmitting");

    for (let i = 0; i < nodes.length; i++) {
      setActiveNode(nodes[i]);
      setRouteHop(hops[i]);
      appendLog(`route → ${nodes[i].toUpperCase()}`, i === hops.length - 1 ? "" : "");
      await delay(reduced ? 80 : 420);
    }

    setRouteHop(3);
    appendLog("encrypt payload AES-256-GCM");
    await delay(reduced ? 100 : 500);
    appendLog("transmit TLS 1.3 uplink…");
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function showSuccess() {
    const overlay = document.getElementById("comm-success-overlay");
    const trace = document.getElementById("comm-success-trace");
    const strip = document.getElementById("tls-strip");
    const tlsStatus = document.getElementById("tls-status");
    const form = document.getElementById("comm-composer");

    if (trace) {
      trace.textContent = `trace_id=${Date.now().toString(36)} · hop=4 · verified`;
    }
    if (overlay) overlay.hidden = false;
    if (strip && tlsStatus) {
      strip.classList.remove("handshake");
      strip.classList.add("secure");
      tlsStatus.textContent = "TLS 1.3 · AES-256-GCM · channel verified";
    }
    form?.classList.remove("transmitting");
    setRouteHop(4);
    document.querySelectorAll(".comm-route-hop").forEach((h) => h.classList.add("active"));
    document.querySelectorAll(".comm-route-line").forEach((l) => l.classList.add("active"));
    setActiveNode("dest");
    appendLog("ACK received · packet delivered ✓");
  }

  function initForm() {
    const form = document.forms["submit-to-google-sheet"];
    const msg = document.getElementById("msg");
    const btn = document.getElementById("comm-transmit-btn");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { ready } = calcReadiness();
      if (!ready) {
        appendLog("uplink blocked — required fields missing", "warn");
        return;
      }

      if (btn) {
        btn.classList.add("transmitting");
        btn.disabled = true;
      }
      if (msg) {
        msg.textContent = "";
        msg.classList.remove("success");
      }

      const strip = document.getElementById("tls-strip");
      const tlsStatus = document.getElementById("tls-status");
      if (strip && tlsStatus) {
        strip.classList.add("handshake");
        tlsStatus.textContent = "Encrypting payload…";
      }

      appendLog("INIT uplink sequence");

      try {
        await animateTransmit();
        await fetch(SCRIPT_URL, { method: "POST", body: new FormData(form) });
        showSuccess();
        if (msg) {
          msg.textContent = "Uplink complete — message received.";
          msg.classList.add("success");
        }
        form.reset();
        updateReadiness();
        setTimeout(() => {
          const overlay = document.getElementById("comm-success-overlay");
          if (overlay) overlay.hidden = true;
          if (msg) {
            msg.textContent = "";
            msg.classList.remove("success");
          }
          setRouteHop(0);
          setActiveNode("you");
          document.querySelectorAll(".comm-route-hop").forEach((h) => {
            h.classList.remove("active", "transmitting");
          });
          document.querySelectorAll(".comm-route-line").forEach((l) => l.classList.remove("active"));
          if (strip && tlsStatus) {
            strip.classList.remove("handshake", "secure");
            tlsStatus.textContent = "comm.link · awaiting secure handshake";
          }
        }, 6000);
      } catch (err) {
        appendLog(`ERROR ${err.message || "transmit failed"}`, "err");
        if (msg) msg.textContent = "Transmit failed — try again.";
        form.classList.remove("transmitting");
      } finally {
        if (btn) {
          btn.classList.remove("transmitting");
          updateReadiness();
        }
      }
    });
  }

  function initChannels() {
    document.querySelectorAll(".comm-channel").forEach((ch) => {
      ch.addEventListener("mouseenter", () => {
        appendLog(`channel ping ${ch.dataset.protocol || "ext"}:// OPEN`);
      });
    });
  }

  function initSectionEnter() {
    const section = document.getElementById("contact");
    if (!section) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          appendLog("comm.link sector online · HYB node reachable");
          setActiveNode("hub");
          setRouteHop(2);
          obs.disconnect();
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(section);
  }

  function init() {
    initRadar();
    initFields();
    initForm();
    initLatency();
    initChannels();
    initSectionEnter();
    setRouteHop(0);
    setActiveNode("you");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("beforeunload", () => {
    if (radarRaf) cancelAnimationFrame(radarRaf);
  });
})();
