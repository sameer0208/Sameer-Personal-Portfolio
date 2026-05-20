/**
 * About section — profile telemetry (accurate counts from portfolio data)
 */
(function () {
  const PROFILE = {
    name: "Sayyed Sameer Basir",
    role: "Associate Developer",
    org: "Thoughtworks",
    location: "Hyderabad, IN",
    degree: "B.Tech CSE (Honors)",
    university: "KL University",
    currentSince: "Jul 2025",
    cgpa: 9.91,
    cgpaScale: 10,
    githubRepos: "35+",
    githubUser: "sameer0208",
    certTotalLabel: "10+",
    certBaseline: 10,
    yearsExpLabel: "2+",
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countFromPage() {
    const skills = document.querySelectorAll("#skills .tags span");
    const groups = document.querySelectorAll("#skills .skill-group");
    const roles = document.querySelectorAll("#experience-tab .timeline-item");
    const edu = document.querySelectorAll("#education .timeline-item");
    const certs = document.querySelectorAll("#certifications .cert-card");

    return {
      skills: skills.length,
      skillGroups: groups.length,
      roles: roles.length,
      education: edu.length,
      certsShown: certs.length,
    };
  }

  function buildLogLines(counts) {
    return [
      `CGPA ${PROFILE.cgpa} · ${PROFILE.university} · Gold Medal (CSE)`,
      `${counts.skills} skills in ${counts.skillGroups} categories (Skills tab)`,
      `${counts.roles} roles & internships · Oct 2022 – present`,
      `${counts.certsShown} certs on site · ${PROFILE.certTotalLabel} on LinkedIn`,
      `${PROFILE.githubRepos} repos · github.com/${PROFILE.githubUser}`,
      `${PROFILE.role} @ ${PROFILE.org} since ${PROFILE.currentSince}`,
      `${PROFILE.degree} · ${PROFILE.university} (2021–2025)`,
      `${PROFILE.yearsExpLabel} yrs experience · ${PROFILE.location}`,
    ];
  }

  function tabViewLabel(tabId, counts) {
    switch (tabId) {
      case "skills":
        return `Skills · ${counts.skills} listed`;
      case "experience-tab":
        return `Experience · ${counts.roles} roles`;
      case "education":
        return `Education · ${counts.education} entries`;
      default:
        return `Skills · ${counts.skills} listed`;
    }
  }

  function applyCounts(dock, counts) {
    const skillsMetric = dock.querySelector('[data-metric="skills"]');
    const rolesMetric = dock.querySelector('[data-metric="roles"]');
    const certsMetric = dock.querySelector('[data-metric="certs"]');

    if (skillsMetric && counts.skills > 0) {
      skillsMetric.dataset.value = String(counts.skills);
      skillsMetric.dataset.max = String(counts.skills);
      skillsMetric.querySelector(".profile-metric-val").textContent = String(counts.skills);
      const hint = skillsMetric.querySelector(".profile-metric-hint");
      if (hint) hint.textContent = `${counts.skillGroups} categories · Skills tab`;
    }

    if (rolesMetric && counts.roles > 0) {
      rolesMetric.dataset.value = String(counts.roles);
      rolesMetric.dataset.max = String(counts.roles);
      rolesMetric.querySelector(".profile-metric-val").textContent = String(counts.roles);
    }

    if (certsMetric && counts.certsShown > 0) {
      certsMetric.dataset.value = String(counts.certsShown);
      certsMetric.querySelector(".profile-metric-val").textContent =
        `${counts.certsShown} / ${PROFILE.certTotalLabel}`;
      const hint = certsMetric.querySelector(".profile-metric-hint");
      if (hint) {
        hint.textContent = `${counts.certsShown} on portfolio · ${PROFILE.certTotalLabel} on LinkedIn`;
      }
    }

    const viewEl = document.getElementById("profile-meta-view");
    if (viewEl) viewEl.textContent = tabViewLabel("skills", counts);
  }

  function initMetrics(dock) {
    const counts = countFromPage();
    applyCounts(dock, counts);

    dock.querySelectorAll(".profile-metric[data-value][data-max]").forEach((m) => {
      const value = parseFloat(m.dataset.value, 10);
      const max = parseFloat(m.dataset.max, 10);
      const bar = m.querySelector(".profile-metric-bar span");
      if (!bar || !max) return;
      const pct = Math.min(100, Math.round((value / max) * 1000) / 10);
      bar.style.setProperty("--fill", `${pct}%`);
      bar.setAttribute("aria-valuenow", String(value));
      bar.setAttribute("aria-valuemax", String(max));
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            dock.classList.add("metrics-live");
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(dock);
  }

  function initLogTicker(counts) {
    const textEl = document.querySelector("#profile-log .profile-log-text");
    if (!textEl) return;

    const lines = buildLogLines(counts);
    textEl.textContent = lines[0];

    if (reduced) return;

    let i = 0;
    setInterval(() => {
      i = (i + 1) % lines.length;
      textEl.classList.add("fade");
      setTimeout(() => {
        textEl.textContent = lines[i];
        textEl.classList.remove("fade");
      }, 260);
    }, 4200);
  }

  function initTabView(counts, signalCtrl) {
    const viewEl = document.getElementById("profile-meta-view");
    const tabs = document.querySelectorAll(".about-content .tab-links");
    if (!viewEl || !tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-tab");
        viewEl.textContent = tabViewLabel(id, counts);
        if (signalCtrl) signalCtrl.setMode(id);
      });
    });
  }

  const MONTH_IDX = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };

  function toMonthIndex(y, m) {
    return (y - 2022) * 12 + m;
  }

  function parseMonthToken(token, fallbackYear) {
    const parts = token.trim().toLowerCase().match(/([a-z]+)?\s*(\d{4})?/);
    if (!parts) return toMonthIndex(fallbackYear, 0);
    const mon = parts[1] ? MONTH_IDX[parts[1].slice(0, 3)] : 0;
    const year = parts[2] ? parseInt(parts[2], 10) : fallbackYear;
    return toMonthIndex(year, mon ?? 0);
  }

  function parseTimelineStart(dateText) {
    const t = dateText.trim().toLowerCase();
    if (/^\d{4}\s*–/.test(t)) {
      const y = parseInt(t, 10);
      return toMonthIndex(y, 0);
    }
    const present = t.match(/([a-z]+)\s+(\d{4})\s*–\s*present/);
    if (present) return parseMonthToken(`${present[1]} ${present[2]}`, 2025);

    const range = t.match(/([a-z]+)\s*–\s*(?:[a-z]+\s+)?(\d{4})/);
    if (range) return parseMonthToken(`${range[1]} ${range[2]}`, 2025);

    const single = t.match(/([a-z]+)\s+(\d{4})/);
    if (single) return parseMonthToken(`${single[1]} ${single[2]}`, 2025);

    const yearOnly = t.match(/(\d{4})/);
    if (yearOnly) return toMonthIndex(parseInt(yearOnly[1], 10), 0);
    return toMonthIndex(2022, 0);
  }

  function shortOrg(orgText) {
    const org = (orgText || "").split("·")[0].trim();
    if (org.length <= 10) return org;
    if (/thoughtworks/i.test(org)) return "TW";
    if (/effigo/i.test(org)) return "EffiGO";
    if (/turito/i.test(org)) return "Turito";
    if (/codsoft/i.test(org)) return "CodSoft";
    if (/xtraleap/i.test(org)) return "XtraLeap";
    if (/codeclause/i.test(org)) return "CodeClause";
    if (/basta/i.test(org)) return "BASTA";
    if (/elt/i.test(org)) return "ELT@I";
    return org.slice(0, 8);
  }

  function roleWeight(role, isCurrent) {
    if (isCurrent) return 1;
    const r = (role || "").toLowerCase();
    if (/freelance/.test(r)) return 0.72;
    if (/intern/.test(r)) return 0.62;
    if (/curriculum|engineer|developer/.test(r)) return 0.78;
    return 0.65;
  }

  function parseCareerTimeline() {
    const items = document.querySelectorAll("#experience-tab .timeline-item");
    const events = Array.from(items).map((el) => {
      const dateText = el.querySelector(".timeline-date")?.textContent || "";
      const role = el.querySelector(".timeline-role")?.textContent || "";
      const org = el.querySelector(".timeline-org")?.textContent || "";
      const isCurrent = el.classList.contains("timeline-item--current");
      return {
        t: parseTimelineStart(dateText),
        weight: roleWeight(role, isCurrent),
        label: shortOrg(org),
        role,
        isCurrent,
      };
    });
    events.sort((a, b) => a.t - b.t);
    const tMin = Math.min(...events.map((e) => e.t), toMonthIndex(2022, 9));
    const now = new Date();
    const tMax = toMonthIndex(now.getFullYear(), now.getMonth());
    return { events, tMin, tMax };
  }

  const SKILL_AXIS_LABELS = {
    "full stack & web": "Full stack",
    "backend & frameworks": "Backend",
    programming: "Languages",
    "data & analytics": "Data",
    "design & media": "Design",
    "soft skills": "Soft skills",
  };

  function parseSkillBands() {
    return Array.from(document.querySelectorAll("#skills .skill-group")).map(
      (g) => {
        const full = (g.querySelector("h4")?.textContent || "").trim();
        const key = full.toLowerCase();
        return {
          label: SKILL_AXIS_LABELS[key] || full,
          full,
          count: g.querySelectorAll(".tags span").length,
        };
      }
    );
  }

  function parseEducationBands() {
    return Array.from(document.querySelectorAll("#education .timeline-item"))
      .map((el) => {
        const dateText = el.querySelector(".timeline-date")?.textContent || "";
        const y = parseInt(dateText, 10) || 2020;
        const p = el.querySelector("p")?.textContent || "";
        const cgpa = p.match(/CGPA:\s*([\d.]+)/i);
        const grade = p.match(/Grade:\s*([\d.]+)/i);
        let value = 0.9;
        let display = "—";
        if (cgpa) {
          value = parseFloat(cgpa[1], 10) / 10;
          display = cgpa[1];
        } else if (grade) {
          value = parseFloat(grade[1], 10) / 100;
          display = `${grade[1]}%`;
        }
        return {
          t: toMonthIndex(y, 0),
          label: String(y),
          value,
          display,
        };
      })
      .sort((a, b) => a.t - b.t);
  }

  function initSignalCanvas() {
    const canvas = document.getElementById("profile-signal");
    const section = document.getElementById("about");
    const stage = canvas?.closest(".profile-signal-stage");
    const labelEl = document.getElementById("profile-signal-label");
    const rangeEl = document.getElementById("profile-signal-range");
    const axisEl = document.getElementById("profile-signal-axis");
    const dotEl = document.getElementById("profile-signal-dot");
    if (!canvas || !section || !stage) return null;

    const career = parseCareerTimeline();
    const skillBands = parseSkillBands();
    const eduBands = parseEducationBands();
    const skillMax = Math.max(...skillBands.map((b) => b.count), 1);

    const modes = {
      skills: {
        label: "Skill signal",
        range: `${skillBands.reduce((s, b) => s + b.count, 0)} skills · 6 groups`,
        color: { line: "rgba(167, 139, 250, 0.95)", fill: "rgba(124, 92, 255, 0.18)" },
      },
      "experience-tab": {
        label: "Career signal",
        range: "BASTA 2022 → Thoughtworks",
        color: { line: "rgba(56, 189, 248, 0.95)", fill: "rgba(56, 189, 248, 0.14)" },
      },
      education: {
        label: "Academic signal",
        range: eduBands.length
          ? `CGPA ${eduBands.find((e) => parseFloat(e.display) > 4)?.display || "9.91"} · KL Univ.`
          : "KL University",
        color: { line: "rgba(52, 211, 153, 0.95)", fill: "rgba(52, 211, 153, 0.12)" },
      },
    };

    const activeTab = document.querySelector(".about-content .tab-links.active-link");
    let mode = activeTab?.getAttribute("data-tab") || "skills";
    if (!modes[mode]) mode = "skills";

    let ctx;
    let w = 280;
    let h = 64;
    let phase = 0;
    let pulse = 0;
    let running = false;
    let raf = 0;
    function setupCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = stage.getBoundingClientRect();
      w = Math.max(200, Math.floor(rect.width) || 280);
      h = 64;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function careerEnvelope(xn) {
      const t = lerp(career.tMin, career.tMax, xn);
      let v = 0.12;
      career.events.forEach((e) => {
        v = Math.max(v, e.weight * Math.exp(-((t - e.t) ** 2) / 14));
      });
      return Math.min(1, v);
    }

    function skillsEnvelope(xn) {
      const n = skillBands.length || 1;
      const seg = xn * n;
      const i = Math.min(n - 1, Math.floor(seg));
      const frac = seg - i;
      const c0 = skillBands[i]?.count ?? 0;
      const c1 = skillBands[Math.min(n - 1, i + 1)]?.count ?? c0;
      return lerp(c0, c1, frac) / skillMax;
    }

    function educationEnvelope(xn) {
      if (!eduBands.length) return 0.3;
      const tMin = eduBands[0].t;
      const tMax = eduBands[eduBands.length - 1].t + 6;
      const t = lerp(tMin, tMax, xn);
      let v = 0.1;
      eduBands.forEach((e) => {
        v = Math.max(v, e.value * Math.exp(-((t - e.t) ** 2) / 20));
      });
      return v;
    }

    function getEnvelope(xn) {
      if (mode === "skills") return 0.25 + skillsEnvelope(xn) * 0.75;
      if (mode === "education") return 0.2 + educationEnvelope(xn) * 0.8;
      return 0.2 + careerEnvelope(xn) * 0.8;
    }

    function buildAxis(modeKey) {
      if (!axisEl) return;
      axisEl.className = "profile-signal-axis";
      let items = [];

      if (modeKey === "skills") {
        axisEl.classList.add("profile-signal-axis--skills");
        items = skillBands.map((b) => ({
          text: b.label,
          title: b.full,
          peak: b.count === skillMax,
        }));
      } else {
        axisEl.classList.remove("profile-signal-axis--skills");
        if (modeKey === "education") {
          items = eduBands.map((e) => ({
            text: e.display,
            title: `${e.label} · ${e.display}`,
            peak: e.value >= 0.95,
          }));
        } else {
          items = [
            { text: "2022", title: "Career start · BASTA", peak: false },
            { text: "2023", title: "Internships", peak: false },
            { text: "2024", title: "Turito · roles", peak: false },
            { text: "TW", title: "Thoughtworks · now", peak: true },
          ];
        }
      }

      axisEl.innerHTML = items
        .map((it) => {
          const cls = it.peak ? "axis-peak" : "";
          const title = it.title ? ` title="${it.title.replace(/"/g, "&quot;")}"` : "";
          return `<span class="${cls}"${title}>${it.text}</span>`;
        })
        .join("");
    }

    function drawFrame() {
      if (!ctx) return;
      const mid = h * 0.5;
      const amp = h * 0.26;
      const colors = modes[mode]?.color || modes.skills.color;
      const points = [];

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();

      for (let x = 0; x <= w; x++) {
        const xn = x / w;
        const env = getEnvelope(xn);
        const ripple =
          Math.sin(xn * Math.PI * 4 + phase) * 0.22 +
          Math.sin(xn * Math.PI * 9 + phase * 1.4) * 0.1;
        const breathe = reduced ? 0 : Math.sin(pulse + xn * 2) * 0.06;
        const y = mid - amp * (env + ripple + breathe);
        points.push({ x, y });
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, mid);
      points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, mid);
      ctx.closePath();
      ctx.fillStyle = colors.fill;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x++) {
        const xn = x / w;
        const y = mid + Math.sin(xn * Math.PI * 6 + phase * 0.7) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (labelEl && modes[mode]) labelEl.textContent = modes[mode].label;
      if (rangeEl && modes[mode]) rangeEl.textContent = modes[mode].range;

      if (dotEl && points.length && !reduced) {
        const t = (Math.sin(pulse * 0.5) * 0.5 + 0.5) * (points.length - 1);
        const i = Math.floor(t);
        const frac = t - i;
        const p0 = points[i];
        const p1 = points[Math.min(i + 1, points.length - 1)];
        const dx = lerp(p0.x, p1.x, frac);
        const dy = lerp(p0.y, p1.y, frac);
        dotEl.style.left = `${dx}px`;
        dotEl.style.top = `${dy}px`;
        dotEl.classList.add("visible");
      } else if (dotEl) {
        dotEl.classList.remove("visible");
      }
    }

    function tick() {
      if (!reduced) {
        phase += 0.07;
        pulse += 0.05;
      }
      drawFrame();
      if (running) raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      setupCanvas();
      buildAxis(mode);
      drawFrame();
      running = true;
      tick();
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    setupCanvas();
    buildAxis(mode);
    drawFrame();

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
        else stop();
      },
      { threshold: 0.08 }
    );
    obs.observe(section);

    const ro = new ResizeObserver(() => {
      setupCanvas();
      drawFrame();
    });
    ro.observe(stage);

    if (reduced) {
      stop();
      drawFrame();
    } else {
      start();
    }

    return {
      setMode(tabId) {
        const next =
          tabId === "skills" || tabId === "education" ? tabId : "experience-tab";
        if (next === mode) return;
        mode = next;
        buildAxis(mode);
        if (labelEl && modes[mode]) labelEl.textContent = modes[mode].label;
        if (rangeEl && modes[mode]) rangeEl.textContent = modes[mode].range;
      },
    };
  }

  function init() {
    const dock = document.querySelector(".profile-dock");
    if (!dock) return;
    const counts = countFromPage();
    initMetrics(dock);
    initLogTicker(counts);
    const signalCtrl = initSignalCanvas();
    initTabView(counts, signalCtrl);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
