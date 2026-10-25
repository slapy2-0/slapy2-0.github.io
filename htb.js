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

/* A machine is locked while its "unlock" date is in the future */
function isLocked(m) {
  if (!m.unlock) return false;
  const d = new Date(m.unlock + "T00:00:00");
  return !isNaN(d) && d > new Date();
}
const LOCK_SVG = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

/* cards */
function card(m, i) {
  if (isLocked(m)) {
    const n = LEVELS.indexOf(m.difficulty) + 1;
    const bars = LEVELS.map((_, k) => `<i class="${k < n ? "on" : ""}"></i>`).join("");
    return `<article class="m lock">
      <div class="m-head" title="Write-up locked until ${esc(m.unlock)}">
        <span class="lk">${LOCK_SVG}</span>
        <span class="m-name">${esc(m.name)}</span>
        <span class="m-os">${esc(m.os)} · ${esc(m.type)}</span>
        <span class="lvl"><span class="bars">${bars}</span>${esc(m.difficulty)}</span>
        <span class="m-date">Unlocks ${esc(m.unlock)}</span>
        <span></span>
      </div>
    </article>`;
  }
  const n = LEVELS.indexOf(m.difficulty) + 1;
  const bars = LEVELS.map((_, k) => `<i class="${k < n ? "on" : ""}"></i>`).join("");
  const steps = (m.steps || []).map((s) => `<li><b>${esc(s.title)}.</b> <span>${esc(s.text)}</span></li>`).join("");
  const tags = (m.tags || []).map((t) => `<span>${esc(t)}</span>`).join("");
  const state = String(m.status || "").split(" ")[0];
  const av = m.avatar ? `<img class="m-av" src="${esc(m.avatar)}" alt="${esc(m.name)} machine icon" width="64" height="64" loading="lazy">` : "";
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
      <div class="m-top">${av}<p>${esc(m.summary)}</p></div>
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
    (!q || (m.name + " " + (isLocked(m) ? "" : (m.tags || []).join(" "))).toLowerCase().includes(q)));
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

/* ---------- profile card (reads profile.js) ---------- */
const RANKS = [
  ["Beginner", "#a9b4e6", [1, 6, 11]], ["Apprentice", "#22d3ee", [16, 21, 26]],
  ["Skilled", "#e255e8", [31, 36, 41]], ["Professional", "#34d399", [46, 51, 56]],
  ["Master", "#f2556a", [61, 66, 71]], ["Prodigy", "#a3e635", [76, 81, 86]],
  ["Grandmaster", "#e2e8f0", [91, 100, 106]]
];
const ROMAN = ["I", "II", "III"];
const TIERS = [
  ["Bronze", "#cd7f32"], ["Silver", "#cbd5e1"], ["Gold", "#facc15"],
  ["Ruby", "#ff6b81", 8], ["Platinum", "#b24bf3", 12], ["Holo", "#7dd3fc", 17]
];

function rankOf(lvl) {
  const steps = RANKS.flatMap(([n, c, ls]) => ls.map((l, g) => ({ n, c, g, l })));
  let i = 0;
  steps.forEach((s, k) => { if (lvl >= s.l) i = k; });
  const cur = steps[i], nxt = steps[i + 1];
  const pct = nxt ? Math.min(100, Math.max(0, ((lvl - cur.l) / (nxt.l - cur.l)) * 100)) : 100;
  return { cur, nxt, pct };
}
const hex = (r) => [0, 1, 2, 3, 4, 5].map((k) => {
  const a = ((60 * k - 90) * Math.PI) / 180;
  return (50 + r * Math.cos(a)).toFixed(1) + "," + (50 + r * Math.sin(a)).toFixed(1);
}).join(" ");

function shield(c) {
  return `<svg viewBox="0 0 100 100" class="em" aria-hidden="true"><path d="M50 95 8 42 20 16l30 14 30-14 12 26Z" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="3" stroke-linejoin="round"/><path d="M50 78 24 44l8-12 18 8 18-8 8 12Z" fill="none" stroke="${c}" stroke-width="2" opacity=".7"/><path d="M50 40 60 54 50 68 40 54Z" fill="${c}"/></svg>`;
}
function tierSvg(name, c, id) {
  const holo = name === "Holo", s = holo ? `url(#hg${id})` : c;
  const defs = holo ? `<defs><linearGradient id="hg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset=".35" stop-color="#c084fc"/><stop offset=".7" stop-color="#f9a8d4"/><stop offset="1" stop-color="#fde68a"/></linearGradient></defs>` : "";
  return `<svg viewBox="0 0 100 100" class="em" aria-hidden="true">${defs}<polygon points="${hex(46)}" fill="none" stroke="${s}" stroke-width="3"/><polygon points="${hex(36)}" fill="none" stroke="${s}" stroke-width="1.5" opacity=".6"/><polygon points="${hex(15)}" fill="${s}"/></svg>`;
}

function profile() {
  const P = PROFILE, lvl = Number(P.level) || 1;
  const { cur, nxt, pct } = rankOf(lvl);
  const key = String(P.tier).replace(/\s*tier$/i, "").trim().toLowerCase();
  const ti = TIERS.findIndex((t) => t[0].toLowerCase() === key);
  const tier = ti >= 0 ? TIERS[ti] : [String(P.tier), "#2bd96b"];
  const diamonds = [0, 1, 2].map((g) => `<b class="${g <= cur.g ? "on" : ""}"></b>`).join("");
  const left = nxt ? `${nxt.l - lvl} level${nxt.l - lvl === 1 ? "" : "s"} to ${nxt.n} ${ROMAN[nxt.g]}` : "Top rank reached";
  const ladder = TIERS.slice(3).map((t, k) => {
    const idx = k + 3;
    const cls = idx === ti ? "ld now" : idx < ti ? "ld reached" : "ld";
    return `<div class="${cls}" style="--c:${t[1]}">${tierSvg(t[0], t[1], k)}<p>${t[0]}</p><small>${t[2]} flags</small></div>`;
  }).join("");
  const avatar = P.avatar ? `<img src="${esc(P.avatar)}" alt="">` : esc(String(P.name).charAt(0));

  $("#player").innerHTML = `
    <div class="who">
      <div class="av">${avatar}</div>
      <div><h2>${esc(P.name)}<span class="cc">#${esc(P.country)}</span></h2><span class="ttl">${esc(P.title)}</span></div>
      ${P.url ? `<a class="vp" href="${esc(P.url)}" target="_blank" rel="noopener">HTB profile</a>` : ""}
    </div>
    <div class="cards">
      <article class="pc rank" style="--c:${cur.c}">
        ${shield(cur.c)}
        <div class="grow">
          <h3>${esc(cur.n)}</h3>
          <p class="lv">Level ${lvl}</p>
          <div class="lvlbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i></i></div>
          <div class="dm">${diamonds}<span>Grade ${ROMAN[cur.g]} · ${left}</span></div>
        </div>
      </article>
      <article class="pc season" style="--c:${tier[1]}">
        <div class="top">
          ${tierSvg(tier[0], tier[1], "t")}
          <div><h3>${esc(tier[0])} Tier</h3><p class="lv">Season ${esc(P.season)}</p></div>
          <div class="rk">#${esc(P.seasonRank)}<small>season rank</small></div>
        </div>
        <div class="ladder">${ladder}</div>
      </article>
    </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => { $(".lvlbar i").style.width = pct + "%"; }));
}

profile();
stats();
chips();
render();
