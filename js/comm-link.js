/**
 * Comm Link Uplink Station — radar, packet composer, secure transmit
 */
(function () {
  const DEFAULT_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbylpaNBLeQi3i1q9uZLLQKflrzlS20dx7jGgwc4UCq9-FXJzAduhrawudsLNUF9PqdT/exec";

  const SHEET_FIELDS = ["Name", "Email", "Mobile", "Subject", "Message"];

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
  let currentUploadPct = 0;

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

  function getScriptUrl(form) {
    const custom = form?.dataset?.sheetUrl?.trim();
    return custom || DEFAULT_SCRIPT_URL;
  }

  /** URL-encoded body — matches standard Google Apps Script doPost(e.parameter.*) */
  function buildSheetPayload(form) {
    const params = new URLSearchParams();
    SHEET_FIELDS.forEach((key) => {
      const el = form.elements.namedItem(key);
      const value = el && "value" in el ? String(el.value).trim() : "";
      params.append(key, value);
    });
    return params;
  }

  function ensureSheetFrame() {
    let iframe = document.getElementById("comm-sheet-frame");
    if (iframe) return iframe;
    iframe = document.createElement("iframe");
    iframe.id = "comm-sheet-frame";
    iframe.name = "comm-sheet-frame";
    iframe.title = "Google Sheets relay";
    iframe.hidden = true;
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);
    return iframe;
  }

  /** Hidden iframe avoids browser CORS blocks when the web app is public */
  function submitViaHiddenFrame(form, url) {
    return new Promise((resolve, reject) => {
      const iframe = ensureSheetFrame();
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Sheet relay timed out — check Apps Script deployment"));
      }, 20000);

      function cleanup() {
        clearTimeout(timeout);
        iframe.removeEventListener("load", onLoad);
        form.removeAttribute("target");
        form.removeAttribute("action");
      }

      function onLoad() {
        cleanup();
        resolve();
      }

      iframe.addEventListener("load", onLoad);
      form.action = url;
      form.method = "POST";
      form.target = "comm-sheet-frame";
      form.submit();
    });
  }

  async function postToGoogleSheet(form) {
    const url = getScriptUrl(form);
    if (!url || !url.includes("script.google.com")) {
      throw new Error("Invalid Google Apps Script URL on the contact form");
    }

    const body = buildSheetPayload(form);

    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
    } catch (networkErr) {
      appendLog("CORS relay blocked · switching to iframe uplink", "warn");
      await submitViaHiddenFrame(form, url);
      return;
    }

    if (response.status === 403 || response.status === 401) {
      throw new Error("SHEET_ACCESS_DENIED");
    }

    const text = await response.text().catch(() => "");
    if (/access denied|you need access/i.test(text)) {
      throw new Error("SHEET_ACCESS_DENIED");
    }

    if (response.ok && /"ok"\s*:\s*true|"result"\s*:\s*"success"/i.test(text)) {
      return;
    }

    if (!response.ok || !/"ok"\s*:\s*true/i.test(text)) {
      appendLog(
        `HTTP ${response.status} · retrying via iframe relay`,
        "warn"
      );
      await submitViaHiddenFrame(form, url);
    }
  }

  function formatSheetError(err) {
    if (err?.message === "SHEET_ACCESS_DENIED") {
      return (
        "Google Sheet relay denied (403). In Apps Script: Deploy → New deployment → " +
        "Web app → Execute as: Me → Who has access: Anyone. Paste the new /exec URL into " +
        "data-sheet-url on the contact form."
      );
    }
    return err?.message || "Transmit failed — try again.";
  }

  function generateMessageId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    const hex = "0123456789abcdef";
    let id = "";
    for (let i = 0; i < 32; i++) {
      id += hex[Math.floor(Math.random() * 16)];
    }
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
  }

  function setUploadProgress(pct, statusText) {
    const panel = document.getElementById("comm-upload-panel");
    const fill = document.getElementById("comm-upload-fill");
    const pctEl = document.getElementById("comm-upload-pct");
    const packet = document.getElementById("comm-upload-packet");
    const statusEl = document.getElementById("comm-upload-status");
    const btnText = document.querySelector(".comm-transmit-text");

    const clamped = Math.min(100, Math.max(0, Math.round(pct)));
    currentUploadPct = clamped;
    if (fill) fill.style.width = `${clamped}%`;
    if (packet) packet.style.left = `${clamped}%`;
    if (pctEl) pctEl.textContent = `${clamped}%`;
    if (statusEl && statusText) statusEl.textContent = statusText;
    if (btnText && panel && !panel.hidden) {
      btnText.textContent = clamped >= 100 ? "ACK RECEIVED" : `TRANSMITTING ${clamped}%`;
    }
  }

  function showUploadPanel() {
    const panel = document.getElementById("comm-upload-panel");
    const stream = document.getElementById("comm-packet-stream");
    if (panel) {
      panel.hidden = false;
      panel.classList.remove("is-ack", "is-fail");
    }
    if (stream) stream.innerHTML = "";
    setUploadProgress(0, "serializing payload…");
  }

  function hideUploadPanel() {
    const panel = document.getElementById("comm-upload-panel");
    if (panel) panel.hidden = true;
    const btnText = document.querySelector(".comm-transmit-text");
    if (btnText) btnText.textContent = "INITIATE UPLINK";
  }

  function pushPacketChip(label, frag = false) {
    const stream = document.getElementById("comm-packet-stream");
    if (!stream) return;
    const chip = document.createElement("span");
    chip.className = `comm-packet-chip${frag ? " comm-packet-chip--frag" : ""}`;
    chip.textContent = label;
    stream.appendChild(chip);
    while (stream.children.length > 8) {
      stream.removeChild(stream.firstChild);
    }
  }

  async function animatePacketUpload() {
    const steps = reduced
      ? [
          { pct: 50, status: "routing packet…", log: "route mid-hop", chip: "FRAG·1/2" },
          { pct: 100, status: "awaiting ACK…", log: "transmit uplink", chip: "FRAG·2/2", frag: true },
        ]
      : [
          { pct: 8, status: "serializing payload…", log: "serialize JSON frame", chip: "HDR" },
          { pct: 18, status: "chunking into frames…", log: "chunk size=512B · 4 frames", chip: "FRAG·1/4", frag: true },
          { pct: 32, status: "applying TLS 1.3…", log: "handshake complete", chip: "FRAG·2/4", frag: true },
          { pct: 48, status: "routing → INET…", log: "route → INET", chip: "FRAG·3/4", frag: true, node: "inet", hop: 1 },
          { pct: 62, status: "routing → HYB…", log: "route → HUB", chip: "FRAG·4/4", frag: true, node: "hub", hop: 2 },
          { pct: 78, status: "encrypt AES-256-GCM…", log: "encrypt payload AES-256-GCM", chip: "ENC" },
          { pct: 88, status: "transmitting uplink…", log: "transmit TLS 1.3 uplink…", chip: "TX", node: "dest", hop: 3 },
          { pct: 96, status: "awaiting ACK…", log: "poll ACK from dest", chip: "WAIT" },
        ];

    for (const step of steps) {
      setUploadProgress(step.pct, step.status);
      if (step.log) appendLog(step.log);
      if (step.chip) pushPacketChip(step.chip, step.frag);
      if (step.node) setActiveNode(step.node);
      if (step.hop !== undefined) setRouteHop(step.hop);
      await delay(reduced ? 120 : 380);
    }
  }

  async function runTransmitSequence(form) {
    showUploadPanel();
    const formEl = document.getElementById("comm-composer");
    formEl?.classList.add("transmitting");

    appendLog("INIT uplink sequence");
    appendLog("packet.size=" + estimatePayloadBytes(form) + "B");

    const routePromise = animateTransmit();
    const uploadPromise = animatePacketUpload();
    await Promise.all([routePromise, uploadPromise]);

    setUploadProgress(98, "POST /comm/uplink …");
    appendLog("POST /comm/uplink → Google Sheets relay");
    await postToGoogleSheet(form);

    setUploadProgress(100, "ACK received · packet delivered ✓");
    const panel = document.getElementById("comm-upload-panel");
    panel?.classList.add("is-ack");
    pushPacketChip("ACK ✓");
    await delay(reduced ? 200 : 450);
  }

  function estimatePayloadBytes(form) {
    let n = 0;
    new FormData(form).forEach((v) => {
      n += String(v).length;
    });
    return Math.max(n, 64);
  }

  function showSuccess(messageId) {
    const overlay = document.getElementById("comm-success-overlay");
    const trace = document.getElementById("comm-success-trace");
    const msgIdEl = document.getElementById("comm-success-msg-id");
    const strip = document.getElementById("tls-strip");
    const tlsStatus = document.getElementById("tls-status");
    const form = document.getElementById("comm-composer");

    if (msgIdEl) {
      msgIdEl.textContent = `message-id: ${messageId}`;
    }
    if (trace) {
      trace.textContent = `trace_id=${Date.now().toString(36)} · hop=4 · rtt=${18 + Math.floor(Math.random() * 20)}ms`;
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
    appendLog(`ACK received · message-id=${messageId.slice(0, 8)}…`);
  }

  function resetTransmitUi() {
    const overlay = document.getElementById("comm-success-overlay");
    const msg = document.getElementById("msg");
    const strip = document.getElementById("tls-strip");
    const tlsStatus = document.getElementById("tls-status");
    const form = document.getElementById("comm-composer");

    if (overlay) overlay.hidden = true;
    if (msg) {
      msg.textContent = "";
      msg.classList.remove("success");
    }
    hideUploadPanel();
    form?.classList.remove("transmitting");
    setUploadProgress(0, "");
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

      const messageId = generateMessageId();
      appendLog(`assign message-id=${messageId}`);

      try {
        await runTransmitSequence(form);
        showSuccess(messageId);
        if (msg) {
          msg.textContent = `Uplink complete · message-id: ${messageId.slice(0, 13)}…`;
          msg.classList.add("success");
        }
        form.reset();
        updateReadiness();
        setTimeout(resetTransmitUi, 8000);
      } catch (err) {
        const detail = formatSheetError(err);
        appendLog(`ERROR ${detail}`, "err");
        const panel = document.getElementById("comm-upload-panel");
        panel?.classList.add("is-fail");
        setUploadProgress(currentUploadPct, "NACK · relay failed");
        if (msg) msg.textContent = detail;
        document.getElementById("comm-composer")?.classList.remove("transmitting");
        const btnText = document.querySelector(".comm-transmit-text");
        if (btnText) btnText.textContent = "INITIATE UPLINK";
        setTimeout(hideUploadPanel, 4000);
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
