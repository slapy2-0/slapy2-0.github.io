/* Builds the main page from site.js (and machines.js / profile.js for the HTB part).
   You do not need to edit this file. */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const chips = (a) => (a && a.length ? `<div class="tags">${a.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : "");
const ext = (u) => (/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : "");

const MS = typeof MACHINES !== "undefined" ? [...MACHINES].sort((a, b) => String(b.date).localeCompare(String(a.date))) : [];
const rooted = MS.filter((m) => m.status === "Rooted").length;

/* hero */
$("#home").innerHTML = `
  <div class="hero-text">
    <p class="hi">${esc(SITE.hello)}</p>
    <h1>${esc(SITE.name)}</h1>
    <h2>${esc(SITE.title)}</h2>
    <ul class="roles">${SITE.roles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
    ${SITE.intro.map((p) => `<p class="lead">${esc(p)}</p>`).join("")}
    <div class="btns">
      <a class="go" href="#projects">View My Work</a>
      <a class="go ghost" href="#contact">Contact Me</a>
    </div>
  </div>
  <aside class="hero-side" aria-label="Hack The Box progress">
    <div class="big" id="rooted">${rooted}</div>
    <div class="cap">${MS.length ? "Hack The Box machines rooted" : "Higher National Diploma"}</div>
    <ul class="split">${SITE.roles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
  </aside>`;

/* count up once */
(function () {
  const out = $("#rooted");
  if (!rooted || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const t0 = performance.now(), dur = 900;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    out.textContent = Math.round(rooted * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
})();

/* about */
$("#about-body").innerHTML = `
  <div class="bio">${ABOUT.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
  <dl class="facts">${ABOUT.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
$("#approach").innerHTML = ABOUT.approach.map((s) => `<li><b>${esc(s.title)}</b><span>${esc(s.text)}</span></li>`).join("");

/* HTB lab (live from machines.js) */
if (MS.length) {
  const lvl = typeof PROFILE !== "undefined" ? `<p class="lab-meta">${esc(PROFILE.title || "")}${PROFILE.level ? ` · Level ${esc(PROFILE.level)}` : ""}</p>` : "";
  $("#lab-body").innerHTML = `${lvl}
    <div class="lab-list">${MS.slice(0, 4).map((m) => `
      <a class="lab-row" href="htb.html">
        <span class="dot ${esc(String(m.status || "").split(" ")[0])}"></span>
        <span class="lab-name">${esc(m.name)}</span>
        <span class="lab-os">${esc(m.os)}</span>
        <span class="lab-d">${esc(m.difficulty)}</span>
        <span class="lab-os">${esc(m.date)}</span>
      </a>`).join("")}</div>
    <a class="go" href="htb.html">Read all lab notes</a>`;
} else {
  $("#lab").hidden = true;
}

/* skills, projects, certs, links */
$("#skills-body").innerHTML = SKILLS.map((s) => `<article class="skill"><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></article>`).join("");

$("#projects-body").innerHTML = PROJECTS.length
  ? PROJECTS.map((p) => `<article class="proj"><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p>${chips(p.tags)}${p.link ? `<a class="read" href="${esc(p.link)}"${ext(p.link)}>View project</a>` : ""}</article>`).join("")
  : `<p class="empty">Projects coming soon.</p>`;

$("#certs-body").innerHTML = CERTS.length
  ? CERTS.map((c) => `<article class="cert"><h3>${esc(c.name)}</h3><p>${esc(c.issuer)}${c.year ? ` · ${esc(c.year)}` : ""}</p>${c.link ? `<a class="read" href="${esc(c.link)}"${ext(c.link)}>View credential</a>` : ""}</article>`).join("")
  : `<p class="empty">Certifications coming soon.</p>`;

$("#links").innerHTML = LINKS.map((l) => `<a href="${esc(l.url)}"${ext(l.url)}>${esc(l.label)}</a>`).join("");
