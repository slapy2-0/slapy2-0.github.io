/* Animated background: drifting network nodes, soft light orbs.
   Self-contained: it makes its own canvas, no CSS needed.

   CHANGE THE COLOURS HERE (r,g,b). List a colour more than once to
   make it more common. Photo look (blue + red) would be:
   ["56,189,248","56,189,248","244,63,94"]                          */
const BG_COLORS = ["43,217,107", "43,217,107", "43,217,107", "125,255,170", "20,170,120"];

(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  Object.assign(cv.style, { position: "fixed", inset: "0", width: "100%", height: "100%", zIndex: "-1", pointerEvents: "none" });
  document.body.prepend(cv);
  const ctx = cv.getContext("2d");
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = () => BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
  const LINK = 150;
  let W = 0, H = 0, nodes = [], orbs = [], last = 0;

  function init() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, Math.max(28, (W * H) / 20000)));
    nodes = Array.from({ length: n }, () => {
      const z = Math.random();               // depth: far (0) to near (1)
      return { x: rnd(0, W), y: rnd(0, H), z, r: 0.8 + z * 2.2, col: pick(), ph: rnd(0, 6.28),
               vx: rnd(-0.12, 0.12) * (0.4 + z), vy: rnd(-0.12, 0.12) * (0.4 + z) };
    });
    orbs = Array.from({ length: Math.round(W / 170) + 4 }, () => ({
      x: rnd(0, W), y: rnd(0, H), r: rnd(20, 75), a: rnd(0.04, 0.1), col: pick(),
      vx: rnd(-0.05, 0.05), vy: rnd(-0.04, 0.04) }));
  }

  function frame(t) {
    const dt = Math.min((t - last) / 16.7 || 1, 3);
    last = t;
    ctx.clearRect(0, 0, W, H);

    for (const o of orbs) {                  // soft out-of-focus lights
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `rgba(${o.col},${o.a})`);
      g.addColorStop(1, `rgba(${o.col},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 6.283); ctx.fill();
      if (!reduce) {
        o.x += o.vx * dt; o.y += o.vy * dt;
        if (o.x < -o.r) o.x = W + o.r; else if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; else if (o.y > H + o.r) o.y = -o.r;
      }
    }

    ctx.lineWidth = 1;                       // connections
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
        const d = Math.hypot(dx, dy);
        if (d > LINK) continue;
        const al = (1 - d / LINK) * 0.3 * (0.35 + Math.min(a.z, b.z) * 0.65);
        ctx.strokeStyle = `rgba(${a.col},${al})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    for (const n of nodes) {                 // nodes
      const tw = 0.7 + 0.3 * Math.sin(t * 0.0012 + n.ph);
      if (n.z > 0.6) {
        ctx.fillStyle = `rgba(${n.col},${0.12 * tw})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3.2, 0, 6.283); ctx.fill();
      }
      ctx.fillStyle = `rgba(${n.col},${(0.35 + n.z * 0.6) * tw})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill();
      if (!reduce) {
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }

  let rw = innerWidth, rh = innerHeight, timer;
  addEventListener("resize", () => {         // ignore small mobile address-bar changes
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth === rw && Math.abs(innerHeight - rh) < 120) return;
      rw = innerWidth; rh = innerHeight; init();
      if (reduce) frame(0);
    }, 200);
  });

  init();
  reduce ? frame(0) : requestAnimationFrame(frame);
})();
