/**
 * Nexus Buttons — command tags & contextual micro-labels
 */
(function () {
  const TAG_MAP = [
    { match: /download|cv|resume/i, tag: "GET" },
    { match: /collaborat|contact|let's/i, tag: "LINK" },
    { match: /linkedin/i, tag: "EXT" },
    { match: /github|code|repo|view all/i, tag: "GIT" },
    { match: /youtube|channel/i, tag: "YT" },
    { match: /cert|pdf/i, tag: "DOC" },
    { match: /work|shutter|view/i, tag: "OPEN" },
  ];

  function tagFor(btn) {
    const text = btn.textContent.trim();
    const href = btn.getAttribute("href") || "";
    for (const { match, tag } of TAG_MAP) {
      if (match.test(text) || match.test(href)) return tag;
    }
    if (btn.classList.contains("btn-primary")) return "RUN";
    if (btn.classList.contains("btn-outline")) return "CMD";
    return "GO";
  }

  function init() {
    if (!document.body.classList.contains("nexus-x")) return;

    document.querySelectorAll(".btn:not(.comm-transmit-btn)").forEach((btn) => {
      if (btn.querySelector(".btn-nexus-tag")) return;
      const tag = document.createElement("span");
      tag.className = "btn-nexus-tag";
      tag.setAttribute("aria-hidden", "true");
      tag.textContent = tagFor(btn);
      btn.appendChild(tag);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
