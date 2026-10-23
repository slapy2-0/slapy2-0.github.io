/* Renders the cards from machines.js. You do not need to edit this file. */
const LEVELS = ["Easy", "Medium", "Hard", "Insane"];
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const data = [...MACHINES].sort((a, b) => String(b.date).localeCompare(String(a.date)));
let level = "All";
let query = "";

/* hero numbers */
function stats() {
  const rooted = data.filter((m) => m.status === "Rooted");
  $("#total").textContent = data.length;
  $("#split").innerHTML = LEVELS.map((l) => {
    const n = rooted.filter((m) => m.difficulty === l).length;
    return `<li><span>${l}</span><span>${n}</span></li>`;
  }).join("");
  const target = rooted.length, out = $("#rooted");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || target === 0) { out.textContent = target; return; }
  const t0 = performance.now(), dur = 900;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    out.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* filter chips */
function chips() {
  $("#chips").innerHTML = ["All", ...LEVELS]
    .map((l) => `<button class="chip" data-l="${l}" aria-pressed="${l === level}">${l}</button>`).join("");
}

/* cards */
function card(m, i) {
  const n = LEVELS.indexOf(m.difficulty) + 1;
  const bars = LEVELS.map((_, k) => `<i class="${k < n ? "on" : ""}"></i>`).join("");
  const steps = (m.steps || []).map((s) => `<li><b>${esc(s.title)}.</b> <span>${esc(s.text)}</span></li>`).join("");
  const tags = (m.tags || []).map((t) => `<span>${esc(t)}</span>`).join("");
  const state = String(m.status || "").split(" ")[0];
  return `<article class="m" data-open="false">
    <button class="m-head" aria-expanded="false" aria-controls="p${i}">
      <span class="dot ${esc(state)}" title="${esc(m.status)}"></span>
      <span class="m-name">${esc(m.name)}</span>
      <span class="m-os">${esc(m.os)} · ${esc(m.type)}</span>
      <span class="lvl"><span class="bars">${bars}</span>${esc(m.difficulty)}</span>
      <span class="m-date">${esc(m.date)}</span>
      <span class="chev"></span>
    </button>
    <div class="m-body" id="p${i}"><div class="m-clip"><div class="pad">
      <p>${esc(m.summary)}</p>
      ${tags ? `<div class="tags">${tags}</div>` : ""}
      ${steps ? `<ol class="steps">${steps}</ol>` : ""}
      ${m.lesson ? `<p class="lesson">${esc(m.lesson)}</p>` : ""}
      ${m.link ? `<a class="read" href="${esc(m.link)}" target="_blank" rel="noopener">Full write-up</a>` : ""}
    </div></div></div>
  </article>`;
}

function render() {
  const q = query.trim().toLowerCase();
  const rows = data.filter((m) =>
    (level === "All" || m.difficulty === level) &&
    (!q || (m.name + " " + (m.tags || []).join(" ")).toLowerCase().includes(q)));
  $("#list").innerHTML = rows.map(card).join("");
  $("#empty").hidden = rows.length > 0;
}

$("#chips").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  level = b.dataset.l;
  chips();
  render();
});
$("#search").addEventListener("input", (e) => { query = e.target.value; render(); });
$("#list").addEventListener("click", (e) => {
  const h = e.target.closest(".m-head");
  if (!h) return;
  const card = h.parentElement, open = card.dataset.open !== "true";
  card.dataset.open = open;
  h.setAttribute("aria-expanded", open);
});

stats();
chips();
render();
