/**
 * Quantum cursor + particle trail
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 768) return;

  document.body.classList.add("nexus-x");

  const cursor = document.createElement("div");
  cursor.className = "quantum-cursor";
  const dot = document.createElement("div");
  dot.className = "quantum-cursor-dot";
  const trailCanvas = document.createElement("canvas");
  trailCanvas.id = "cursor-trail-canvas";
  document.body.append(cursor, dot, trailCanvas);

  const ctx = trailCanvas.getContext("2d");
  const particles = [];
  const MAX = 12;
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx;
  let ty = cy;

  function resize() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  document.addEventListener(
    "mousemove",
    (e) => {
      tx = e.clientX;
      ty = e.clientY;
      particles.push({ x: tx, y: ty, life: 1 });
      if (particles.length > MAX) particles.shift();
    },
    { passive: true }
  );

  const hoverTargets = "a, button, .btn, .repo-card, .tech-card, .cmd-item, input, textarea";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) cursor.classList.add("is-hover");
    else cursor.classList.remove("is-hover");
  });

  document.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));

  function tick() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
    dot.style.left = `${tx}px`;
    dot.style.top = `${ty}px`;

    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    particles.forEach((p, i) => {
      p.life -= 0.04;
      if (p.life <= 0) return;
      const size = p.life * 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 92, 255, ${p.life * 0.5})`;
      ctx.fill();
      if (i > 0 && particles[i - 1].life > 0) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${p.life * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i - 1].x, particles[i - 1].y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(tick);
  }
  tick();
})();
