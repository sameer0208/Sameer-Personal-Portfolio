/**
 * Hero boot chain — console whoami / role.txt → Typed.js roles
 */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ROLE_STRINGS = [
    "Associate Developer",
    "Full Stack Developer",
    "Freelancer",
    "Content Creator",
  ];

  const BOOT_LINES = [
    { type: "cmd", text: "nexus@portfolio:~$ whoami" },
    { type: "out", text: "sameer_basir" },
    { type: "cmd", text: "nexus@portfolio:~$ cat role.txt" },
    { type: "out", text: "Associate Developer @ Thoughtworks" },
    { type: "out", text: "Full Stack · Hyderabad · IN" },
    { type: "out", text: "status: ONLINE · nexus.os v2.0.26" },
  ];

  let typedInstance = null;

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function renderBootLine(el, line, showCursor) {
    const cls = line.type === "cmd" ? "boot-cmd" : "boot-out";
    const prefix = line.type === "cmd" ? "" : "→ ";
    const cursor = showCursor ? '<span class="boot-cursor">_</span>' : "";
    return `<span class="${cls}">${prefix}${line.text}</span>${cursor}`;
  }

  async function runConsoleBoot() {
    const bootEl = document.getElementById("hero-console-boot");
    const outWrap = document.getElementById("hero-console-output");
    const outText = outWrap?.querySelector(".output-text");
    if (!bootEl) return;

    bootEl.innerHTML = "";
    if (outText) outText.textContent = "";

    const stepMs = reduced ? 120 : 280;
    const pauseMs = reduced ? 200 : 520;

    for (let i = 0; i < BOOT_LINES.length; i++) {
      const lines = BOOT_LINES.slice(0, i + 1);
      bootEl.innerHTML =
        lines
          .map((ln, idx) =>
            renderBootLine(null, ln, idx === lines.length - 1)
          )
          .join("\n") +
        (i < BOOT_LINES.length - 1 ? "" : '\n<span class="boot-cursor">_</span>');
      await delay(stepMs);
      if (i < BOOT_LINES.length - 1) await delay(pauseMs);
    }

    await delay(reduced ? 300 : 700);
    bootEl.innerHTML = BOOT_LINES.map((ln) => renderBootLine(null, ln, false)).join("\n");

    if (outText) {
      outText.textContent = "Boot complete — starting role stream…";
    }
  }

  function startTyped() {
    const el = document.querySelector(".multiple-text");
    if (!el || typeof Typed === "undefined" || el.dataset.typedReady) return;
    el.dataset.typedReady = "1";

    if (typedInstance) typedInstance.destroy();

    typedInstance = new Typed(el, {
      strings: ROLE_STRINGS,
      typeSpeed: reduced ? 40 : 55,
      backSpeed: reduced ? 30 : 40,
      backDelay: reduced ? 1200 : 2000,
      loop: true,
      showCursor: true,
      cursorChar: "▋",
    });
  }

  function updateOutputReady() {
    const outText = document.querySelector("#hero-console-output .output-text");
    if (outText) {
      outText.textContent = "Nexus ready — scroll to traverse sectors →";
    }
  }

  let bootDone = false;

  async function onNexusReady() {
    if (bootDone) return;
    bootDone = true;

    await runConsoleBoot();
    startTyped();
    updateOutputReady();
    document.dispatchEvent(new CustomEvent("hero:boot-complete"));

    const codeDelay = reduced ? 400 : 900;
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent("hero:code-start"));
    }, codeDelay);
  }

  window.addEventListener("nexus:ready", onNexusReady, { once: true });

  if (!document.body.classList.contains("loader-active")) {
    onNexusReady();
  }
})();
