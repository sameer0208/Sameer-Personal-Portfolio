/**
 * Console — filesystem, network scan, snake game, easter eggs
 */
(function () {
  const FS = {
    "/": ["sectors/"],
    "/sectors": [
      "core.init/",
      "profile.sys/",
      "work.log/",
      "cred.db/",
      "svc.mesh/",
      "repo.grid/",
      "comm.link/",
    ],
    "/sectors/core.init": ["engineer.ts", "stats.json", "README.md"],
    "/sectors/profile.sys": ["about_me.txt", "skills.json", "education.txt"],
    "/sectors/work.log": ["experience.log", "thoughtworks.log", "internships.log"],
    "/sectors/cred.db": ["certificates.db", "badges/"],
    "/sectors/svc.mesh": ["services.yml", "offerings.md"],
    "/sectors/repo.grid": ["github_repos/", "portfolio.html"],
    "/sectors/comm.link": ["contact.form", "channels.txt"],
  };

  const CAT_FILES = {
    "/sectors/profile.sys/about_me.txt": `Sayyed Sameer Basir — Associate Developer @ Thoughtworks.
B.Tech CSE (Honors), KL University. Full stack: React.js, Node.js, Express, MongoDB, MERN.`,
    "/sectors/work.log/experience.log": `Thoughtworks — Associate Developer (Jul 2025–Present)
EffiGO — Product Engineering Intern · Turito — Content Developer`,
    "/sectors/core.init/engineer.ts": `const engineer = { company: "Thoughtworks", stack: ["React.js","Node.js","MERN"] };`,
    "/sectors/cred.db/certificates.db": `10+ certifications · ServiceNow · AWS · Full Stack · Data Science`,
    "/sectors/comm.link/contact.form": `Secure channel: LinkedIn, GitHub, email form (TLS).`,
  };

  const SECTION_MAP = {
    home: "#home",
    core: "#home",
    about: "#about",
    profile: "#about",
    experience: "#experience",
    work: "#experience",
    exp: "#experience",
    certs: "#certifications",
    certifications: "#certifications",
    services: "#services",
    svc: "#services",
    portfolio: "#portfolio",
    projects: "#portfolio",
    repos: "#portfolio",
    contact: "#contact",
    comm: "#contact",
  };

  const SCAN_PORTS = {
    home: ["443/HTTPS open", "22/SSH filtered"],
    about: ["443/HTTPS open", "3306/MySQL internal"],
    experience: ["443/HTTPS open", "5432/POSTGRES internal"],
    portfolio: ["443/HTTPS open", "9418/GIT open"],
    contact: ["443/HTTPS open", "25/SMTP filtered", "465/SMTPS open"],
  };

  let game = null;
  let cwd = "/sectors/core.init";
  let wrongCmdCount = 0;

  function log(text, type = "info") {
    const out = document.getElementById("hero-console-output");
    if (!out) return;
    const prefix = out.querySelector(".output-prefix");
    const span = document.createElement("span");
    span.className = `output-text output-text--${type}`;
    if (text.includes("\n")) {
      span.className += " console-output-block";
    }
    span.textContent = text;
    out.innerHTML = "";
    if (prefix) out.appendChild(prefix.cloneNode(true));
    out.appendChild(span);
  }

  function printHelp() {
    log(
      `help · ls [path] · cd <dir> · pwd · cat <file>
goto <sector> · scan · netstat · trace · whoami · uname
game · hack · sudo · clear · quit`,
      "info"
    );
  }

  function showAnomaly() {
    const el = document.getElementById("hud-anomaly");
    if (!el) return;
    el.classList.add("visible");
    setTimeout(() => el.classList.remove("visible"), 1200);
  }

  function resolvePath(arg) {
    if (!arg) return cwd;
    if (arg.startsWith("/")) return arg.replace(/\/+$/, "") || "/";
    if (arg === "..") {
      const parts = cwd.split("/").filter(Boolean);
      parts.pop();
      return "/" + parts.join("/") || "/";
    }
    if (arg === ".") return cwd;
    const base = cwd === "/" ? "" : cwd;
    return `${base}/${arg}`.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
  }

  function runScan() {
    const active = window.NexusSys?.activeSector || { id: "home", module: "core.init" };
    const ports = SCAN_PORTS[active.id] || ["443/HTTPS open"];
    const lines = [
      `Scanning ${active.module} (${active.ip || "10.0.0.x"})...`,
      ...ports.map((p) => `  PORT ${p}`),
      "Scan complete · 0 vulnerabilities (demo)",
    ];
    log(lines.join("\n"), "success");
  }

  function runNetstat() {
    const lines = [
      "Active connections:",
      "  HTTPS  github.com:443        ESTABLISHED",
      "  HTTPS  linkedin.com:443      ESTABLISHED",
      "  HTTPS  thoughtworks.com:443  ESTABLISHED",
      "  TCP    portfolio.local:443  LISTEN",
    ];
    log(lines.join("\n"), "info");
  }

  function runTrace(target) {
    const sector = target || window.NexusSys?.activeSector?.id || "home";
    const hops = ["core.init", "profile.sys", "work.log", "repo.grid"].slice(
      0,
      ["home", "about", "experience", "portfolio"].indexOf(sector) + 1 || 1
    );
    const lines = hops.map((h, i) => `  ${i + 1}  10.0.0.${i + 1}  ${h}  ${8 + i * 3}ms`);
    log(`traceroute to ${sector}:\n${lines.join("\n")}`, "info");
  }

  /* ---- Snake game ---- */
  class NexusSnake {
    constructor(wrap, canvas, scoreEl) {
      this.wrap = wrap;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.scoreEl = scoreEl;
      this.cols = 20;
      this.rows = 10;
      this.cell = 16;
      this.snake = [];
      this.dir = { x: 1, y: 0 };
      this.nextDir = { x: 1, y: 0 };
      this.food = { x: 5, y: 5 };
      this.score = 0;
      this.loop = null;
      this.keyHandler = this.onKey.bind(this);
      canvas.width = this.cols * this.cell;
      canvas.height = this.rows * this.cell;
    }

    start() {
      this.snake = [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ];
      this.dir = { x: 1, y: 0 };
      this.nextDir = { x: 1, y: 0 };
      this.score = 0;
      this.spawnFood();
      this.updateScore();
      this.wrap.classList.add("active");
      document.querySelector(".hero-code-panel")?.classList.add("game-hidden");
      window.addEventListener("keydown", this.keyHandler);
      this.loop = setInterval(() => this.tick(), 110);
    }

    stop() {
      clearInterval(this.loop);
      window.removeEventListener("keydown", this.keyHandler);
      this.wrap.classList.remove("active");
      document.querySelector(".hero-code-panel")?.classList.remove("game-hidden");
    }

    spawnFood() {
      let x, y;
      do {
        x = Math.floor(Math.random() * this.cols);
        y = Math.floor(Math.random() * this.rows);
      } while (this.snake.some((s) => s.x === x && s.y === y));
      this.food = { x, y };
    }

    onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        this.stop();
        log("Game ended. Type 'game' to play again.", "warn");
        game = null;
        return;
      }
      const map = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      if (this.dir.x + d.x !== 0 || this.dir.y + d.y !== 0) {
        this.nextDir = d;
      }
    }

    tick() {
      this.dir = this.nextDir;
      const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };
      if (
        head.x < 0 ||
        head.x >= this.cols ||
        head.y < 0 ||
        head.y >= this.rows ||
        this.snake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        this.stop();
        log(`Game over! Score: ${this.score}. Type 'game' to retry.`, "warn");
        game = null;
        return;
      }
      this.snake.unshift(head);
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        this.updateScore();
        this.spawnFood();
      } else {
        this.snake.pop();
      }
      this.draw();
    }

    updateScore() {
      if (this.scoreEl) this.scoreEl.textContent = String(this.score);
    }

    draw() {
      const { ctx, cell, cols, rows } = this;
      ctx.fillStyle = "#060810";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.strokeStyle = "rgba(124, 92, 255, 0.08)";
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cell, 0);
        ctx.lineTo(x * cell, rows * cell);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cell);
        ctx.lineTo(cols * cell, y * cell);
        ctx.stroke();
      }
      ctx.fillStyle = "#34d399";
      ctx.fillRect(this.food.x * cell + 2, this.food.y * cell + 2, cell - 4, cell - 4);
      this.snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#38bdf8" : "#7c5cff";
        ctx.fillRect(s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2);
      });
    }
  }

  function runCommand(raw) {
    const line = raw.trim();
    if (!line) return;
    const lower = line.toLowerCase();
    const [cmd, ...args] = lower.split(/\s+/);

    switch (cmd) {
      case "help":
        printHelp();
        wrongCmdCount = 0;
        break;
      case "clear":
        log("Console cleared.", "info");
        break;
      case "pwd":
        log(cwd, "info");
        break;
      case "ls": {
        const path = resolvePath(args[0]);
        const list = FS[path];
        if (list) {
          log(`${path}:\n  ${list.join("\n  ")}`, "info");
        } else {
          log(`ls: cannot access '${path}': No such directory`, "warn");
        }
        break;
      }
      case "cd": {
        const path = resolvePath(args[0] || "/sectors");
        if (FS[path]) {
          cwd = path;
          log(`cwd → ${cwd}`, "success");
        } else {
          log(`cd: ${args[0] || ""}: No such directory`, "warn");
        }
        break;
      }
      case "cat": {
        const path = resolvePath(args[0]);
        const content = CAT_FILES[path];
        if (content) log(content, "info");
        else log(`cat: ${args[0] || ""}: No such file`, "warn");
        break;
      }
      case "scan":
        runScan();
        break;
      case "netstat":
        runNetstat();
        break;
      case "trace":
        runTrace(args[0]);
        break;
      case "whoami":
        log("sayyed_sameer_basir — Associate Developer @ Thoughtworks", "success");
        break;
      case "uname":
        log("NEXUS-OS 2.0 nexus-portfolio x86_64 GNU/Linux", "info");
        break;
      case "hack":
        log("Access granted. Welcome to the nexus, traveler.", "success");
        setTimeout(
          () => log("Ethical hacking only — hire me for the legal kind.", "info"),
          1500
        );
        break;
      case "sudo":
        if (args.join(" ") === "hire-me" || args[0] === "hire") {
          log("Permission granted. Scheduling interview...", "success");
        } else if (args.join(" ").includes("rm")) {
          log("sudo: access denied. Nice try.", "warn");
        } else {
          log("sudo: try 'sudo hire-me'", "info");
        }
        break;
      case "game":
      case "snake":
        if (game) game.stop();
        {
          const wrap = document.getElementById("console-game-wrap");
          const canvas = document.getElementById("snake-canvas");
          const scoreEl = document.getElementById("snake-score");
          if (wrap && canvas) {
            game = new NexusSnake(wrap, canvas, scoreEl);
            game.start();
            log("NEXUS SNAKE · Arrows · ESC quit", "success");
          }
        }
        break;
      case "quit":
      case "exit":
        if (game) {
          game.stop();
          game = null;
        }
        log("Session idle.", "info");
        break;
      case "goto":
      case "cd-sector": {
        const target = args[0];
        const href = SECTION_MAP[target];
        if (href) {
          log(`Navigating → ${target}`, "success");
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        } else {
          log(`Unknown sector. Try: about, experience, portfolio, contact`, "warn");
        }
        break;
      }
      default:
        wrongCmdCount += 1;
        if (wrongCmdCount >= 4) {
          showAnomaly();
          wrongCmdCount = 0;
        }
        log(`Unknown: '${cmd}'. Type 'help'.`, "warn");
    }
  }

  function init() {
    const input = document.getElementById("console-cmd-input");
    if (!input) return;

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = input.value;
        input.value = "";
        if (game && !["quit", "exit"].includes(val.trim().toLowerCase())) return;
        runCommand(val);
      }
    });

    input.placeholder = "try: help, ls, scan, game, goto about...";

    setTimeout(() => {
      if (!game) {
        log("Filesystem online. Type 'help' or 'ls /sectors'", "info");
      }
    }, 9500);
  }

  window.NexusConsole = { log, runCommand };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
