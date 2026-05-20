/**
 * Three.js particle galaxy — hero field
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 768) return;

  const canvas = document.getElementById("galaxy-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const COUNT = 1400;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const c1 = new THREE.Color(0x7c5cff);
  const c2 = new THREE.Color(0x38bdf8);
  const c3 = new THREE.Color(0x34d399);

  for (let i = 0; i < COUNT; i++) {
    const r = 1.8 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = r * Math.cos(phi);
    const mix = Math.random();
    const col = mix < 0.33 ? c1 : mix < 0.66 ? c2 : c3;
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.014,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const ringGeo = new THREE.RingGeometry(2.2, 2.25, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  let mx = 0;
  let my = 0;
  let targetRx = 0;
  let targetRy = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener(
    "mousemove",
    (e) => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRy = mx * 0.35;
      targetRx = my * 0.2;
    },
    { passive: true }
  );

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function animate() {
    requestAnimationFrame(animate);
    rx += (targetRx - rx) * 0.05;
    ry += (targetRy - ry) * 0.05;
    points.rotation.y += 0.0015 + ry * 0.002;
    points.rotation.x = rx * 0.35;
    ring.rotation.z += 0.002;
    camera.position.x = ry * 0.3;
    camera.position.y = -rx * 0.2;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  resize();
  animate();
  window.addEventListener("resize", resize);
})();
