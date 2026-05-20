/**
 * Cinematic dimensions — scroll progress, warp, holo cards, constellation
 */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MODULES = [
    { id: "home", label: "core" },
    { id: "about", label: "profile" },
    { id: "experience", label: "work" },
    { id: "certifications", label: "certs" },
    { id: "services", label: "svc" },
    { id: "portfolio", label: "repos" },
    { id: "contact", label: "link" },
  ];

  /* Dimension warp flash */
  function initWarp() {
    if (reduced) return;
    const warp = document.createElement("div");
    warp.className = "dimension-warp";
    warp.setAttribute("aria-hidden", "true");
    document.body.appendChild(warp);

    const trigger = () => {
      warp.classList.remove("active");
      void warp.offsetWidth;
      warp.classList.add("active");
    };

    document.querySelectorAll(".wormhole-divider").forEach((wh) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) trigger();
          });
        },
        { threshold: 0.5 }
      );
      obs.observe(wh);
    });
  }

  /* Highlight active section — no blur or scale */
  function initCinematicSections() {
    const sections = document.querySelectorAll("main > section.section");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sections.forEach((s) => s.classList.remove("dimension-active"));
            entry.target.classList.add("dimension-active");
          }
        });
      },
      { rootMargin: "-30% 0px -40% 0px", threshold: 0 }
    );
    sections.forEach((sec) => obs.observe(sec));
  }

  /* Holographic projections on cards — unique command per card */
  function initHoloCards() {
    const cards = document.querySelectorAll(
      ".repo-card, .cert-card, .service-card"
    );
    const usedCommands = new Set();

    function uniqueCommand(base) {
      let cmd = base;
      let n = 2;
      while (usedCommands.has(cmd)) {
        cmd = `${base} #${n}`;
        n += 1;
      }
      usedCommands.add(cmd);
      return cmd;
    }

    function repoSlug(card) {
      const href =
        card.querySelector('.repo-links a[href*="github.com"]')?.getAttribute("href") ||
        "";
      const m = href.match(/github\.com\/[^/]+\/([^/?#]+)/i);
      return m ? m[1] : null;
    }

    function shortSlug(slug, max = 22) {
      if (!slug) return "project";
      return slug.length > max ? `${slug.slice(0, max)}…` : slug;
    }

    function holoForRepo(card) {
      const name = card.querySelector("h3")?.textContent?.trim() || "Repository";
      const lang = card.querySelector(".repo-lang")?.textContent?.trim() || "";
      const slug = repoSlug(card);
      const s = shortSlug(slug);
      const L = lang.toLowerCase();

      let cmd;
      if (L.includes("python") || L.includes("django")) {
        cmd = `git clone ${s} && pip install -r requirements.txt`;
      } else if (L.includes("java")) {
        cmd = `git clone ${s} && mvn clean package -DskipTests`;
      } else if (L.includes("mern")) {
        cmd = `git clone ${s} && npm run dev --workspace=client`;
      } else if (L.includes("react")) {
        cmd = `npx create-react-app ${s} --template typescript`;
      } else if (L.includes("r")) {
        cmd = `Rscript ${s}/analysis.R --input tweets.csv`;
      } else if (L.includes("servicenow")) {
        cmd = `sn-cli apply --scope ${s} --instance dev`;
      } else if (L.includes("css") || L.includes("html")) {
        cmd = `git clone ${s} && npx serve ./public -l 3000`;
      } else if (L.includes("full stack")) {
        cmd = `docker compose -f ${s}/docker-compose.yml up`;
      } else if (name.includes("Weather")) {
        cmd = `fetch(/api/weather?q=Hyderabad&units=metric)`;
      } else if (name.includes("My Chat App") || name.includes("Chat App")) {
        cmd = `socket.io ${s} --pingInterval 25000 --cors`;
      } else if (name.includes("Portfolio")) {
        cmd = `gh-pages -d ./dist -r origin gh-pages`;
      } else if (name.includes("Attendance")) {
        cmd = `python manage.py migrate && runserver 0.0.0.0:8000`;
      } else if (name.includes("AI") || name.includes("Trends")) {
        cmd = `python analyze_trends.py --export report.json`;
      } else if (name.includes("FitTrack") || name.includes("Bodybuilder")) {
        cmd = `vite build ${s} && cap sync ios android`;
      } else if (name.includes("RentAstra") || name.includes("Rent")) {
        cmd = `prisma migrate deploy && npm run seed:properties`;
      } else if (name.includes("Tic-Tac-Toe")) {
        cmd = `node ${s}/game.js --mode minimax --depth 4`;
      } else if (name.includes("Stopwatch")) {
        cmd = `performance.now() // high-res timer loop`;
      } else if (name.includes("Uplyft") || name.includes("Chatbot")) {
        cmd = `uvicorn main:app --reload --port 8080`;
      } else if (name.includes("EffiGO")) {
        cmd = `./mvnw spring-boot:run -Dspring.profiles=dev`;
      } else if (name.includes("COVID") || name.includes("Tweet")) {
        cmd = `tidytext::unnest_tokens(df, word) %>% count(word)`;
      } else if (name.includes("Pet Adoption")) {
        cmd = `npm run dev -- --open /adopt?filter=pending`;
      } else if (name.includes("Music Player")) {
        cmd = `audio.play() // Web Audio API queue`;
      } else if (name.includes("Text Editor")) {
        cmd = `react-scripts build && serve -s build`;
      } else if (name.includes("Blog Creator")) {
        cmd = `python manage.py createsuperuser && runserver`;
      } else if (name.includes("All-In-One")) {
        cmd = `concurrently "npm run server" "npm run client"`;
      } else if (name.includes("KLH")) {
        cmd = `open klh-hub.html --campus=all-sites`;
      } else if (name.includes("Digital Nurture")) {
        cmd = `glide update --wait-for-completion`;
      } else {
        cmd = `git clone https://github.com/sameer0208/${slug || s}`;
      }

      return {
        label: "◈ repo.scan",
        command: uniqueCommand(cmd),
        caption: name.slice(0, 28),
      };
    }

    function holoForCert(card) {
      const name = card.querySelector("h3")?.textContent?.trim() || "Certificate";
      const issuer = card.querySelector(".cert-issuer")?.textContent?.trim() || "";
      const date = card.querySelector(".cert-date")?.textContent?.trim() || "";
      const key = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 20);

      const issuerCmd = {
        freeCodeCamp: `fcc verify --cert ${key}`,
        "LinkedIn Learning": `linkedin learning export --course "${name.slice(0, 18)}"`,
        "Great Learning": `gl cert validate --id ${key}`,
      };

      let cmd =
        issuerCmd[issuer] ||
        `openssl verify -CAfile ca.pem ${key}.crt`;

      if (name.includes("JavaScript Algorithms")) {
        cmd = "node run-tests.js --suite fcc-algorithms";
      } else if (name.includes("Responsive Web")) {
        cmd = "npm run lighthouse -- --preset=mobile";
      } else if (name.includes("Python Programming")) {
        cmd = "python -m pytest certs/python_basics -q";
      } else if (name.includes("Graphic Design")) {
        cmd = "photoshop -script export-portfolio.jsx";
      } else if (name.includes("3D Printing")) {
        cmd = "slicer model.stl --output gcode/plate_1.gcode";
      } else if (name.includes("HTML Essential")) {
        cmd = "html-validate index.html --WCAG2AA";
      }

      return {
        label: "◈ cred.verify",
        command: uniqueCommand(cmd),
        caption: `${issuer} · ${date}`.slice(0, 28),
      };
    }

    function holoForService(card) {
      const name = card.querySelector("h3")?.textContent?.trim() || "Service";
      const serviceCmd = {
        "Web Development": "npm create vite@latest app -- --template react-ts",
        Programming: "javac Solution.java && java Solution < input.in",
        "Graphics Design": "illustrator --export logo.svg,png @2x",
        "Video Editing & Content": "ffmpeg -i raw.mov -vf scale=1920:1080 out.mp4",
      };

      let cmd = serviceCmd[name];
      if (!cmd) {
        const slug = name.toLowerCase().replace(/\s+/g, "-").slice(0, 16);
        cmd = `nexus svc --enable ${slug} --region hyderabad`;
      }

      return {
        label: "◈ svc.mesh",
        command: uniqueCommand(cmd),
        caption: name.slice(0, 28),
      };
    }

    function holoContent(card) {
      if (card.classList.contains("repo-card")) return holoForRepo(card);
      if (card.classList.contains("cert-card")) return holoForCert(card);
      return holoForService(card);
    }

    cards.forEach((card) => {
      if (card.classList.contains("holo-projection")) return;
      card.classList.add("holo-projection");

      const { label, command, caption } = holoContent(card);

      const shine = document.createElement("div");
      shine.className = "holo-shine";
      shine.setAttribute("aria-hidden", "true");

      const back = document.createElement("div");
      back.className = "holo-back-face";
      back.setAttribute("aria-hidden", "true");
      back.innerHTML = `<span>${label}</span><code></code><span></span>`;
      back.querySelector("code").textContent = command;
      back.querySelector("span:last-child").textContent = caption;

      card.appendChild(shine);
      card.appendChild(back);
    });
  }

  /* Constellation bottom navigation */
  function initConstellation() {
    if (document.querySelector(".nexus-header") || window.innerWidth < 1024) return;
    const map = document.createElement("nav");
    map.className = "constellation-map";
    map.setAttribute("aria-label", "Constellation navigation");

    MODULES.forEach((m, i) => {
      if (i > 0) {
        const line = document.createElement("span");
        line.className = "constellation-connector";
        line.setAttribute("aria-hidden", "true");
        map.appendChild(line);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "constellation-star";
      btn.dataset.section = m.id;
      btn.setAttribute("aria-label", `Go to ${m.label}`);
      btn.innerHTML = `<span class="constellation-star-label">${m.label}</span>`;
      btn.addEventListener("click", () => {
        document.getElementById(m.id)?.scrollIntoView({ behavior: "smooth" });
      });
      map.appendChild(btn);
    });

    document.body.appendChild(map);

    const stars = map.querySelectorAll(".constellation-star");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          stars.forEach((s) =>
            s.classList.toggle("active", s.dataset.section === entry.target.id)
          );
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );
    MODULES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  /* Hero title materialize */
  function initHeroReveal() {
    document.querySelector(".hero-title")?.classList.add("nexus-reveal");
    document.querySelector(".hero-badge")?.classList.add("nexus-pulse");
  }

  /* Timeline items activate with section */
  function initTimelineBurst() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("dimension-active");
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".exp-timeline-item").forEach((el) => obs.observe(el));
  }

  function init() {
    initWarp();
    initCinematicSections();
    initHoloCards();
    initConstellation();
    initHeroReveal();
    initTimelineBurst();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
