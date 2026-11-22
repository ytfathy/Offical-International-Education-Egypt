/* International Education Egypt — site behaviour.
   All content comes from js/config.js (window.IEE_CONFIG). */
{
  const C = window.IEE_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Data model ---------------- */
  const SUB = Object.fromEntries(C.subjects.map(s => [s.key, s]));
  const GR = Object.fromEntries(C.grades.map(g => [g.key, g]));
  const PROGRAMS = C.programs
    .filter(p => SUB[p.subject] && GR[p.grade])
    .map(p => {
      const s = SUB[p.subject], g = GR[p.grade];
      return { ...p, id: `${p.grade}-${p.subject}`, s, g, title: `${g.label} ${s.name} Program`, features: (p.features || []).filter(k => C.featureLibrary[k]) };
    });
  const byId = Object.fromEntries(PROGRAMS.map(p => [p.id, p]));

  /* ---------------- WhatsApp ---------------- */
  const waDigits = String(C.site.whatsappNumber || "").replace(/\D/g, "");
  const waReady = waDigits.length >= 8;
  const wa = msg => `https://wa.me/${waReady ? waDigits : ""}?text=${encodeURIComponent(msg)}`;
  const appLink = p => /^https?:\/\//.test(p.appUrl || "") ? p.appUrl : waProgram(p, true);
  const appAria = p => p.appUrl ? `Open the ${p.title} app (opens in a new tab)` : `Request access to the ${p.title} app on WhatsApp`;
  const waProgram = (p, buy) => wa((buy ? C.site.whatsappBuyTemplate : C.site.whatsappTemplate).replace("{program}", p.title));
  if (!waReady) console.info("[IEE] WhatsApp number not set in js/config.js — links open WhatsApp with the message so the visitor can pick a contact.");
  $$("[data-wa=general]").forEach(a => (a.href = wa(C.site.whatsappGeneral)));
  const waIcon = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-wa"/></svg>';

  /* ---------------- Subject artwork ---------------- */
  const icon = (key, cls = "") => `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true"><use href="#sub-${key}"/></svg>`;
  const PATTERNS = {
    math: '<pattern id="pm" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0 .5H28M.5 0V28" stroke="#fff"/><path d="M14 9v10M9 14h10" stroke="#fff" stroke-width="2"/></pattern>',
    science: '<pattern id="ps" width="34" height="30" patternUnits="userSpaceOnUse"><path d="M8.5 1 25.5 1 34 15 25.5 29 8.5 29 0 15Z" fill="none" stroke="#fff" stroke-width="1.5"/></pattern>',
    english: '<pattern id="pe" width="40" height="22" patternUnits="userSpaceOnUse"><path d="M0 11h26" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="11" r="2" fill="#fff"/></pattern>',
    social: '<pattern id="pso" width="80" height="80" patternUnits="userSpaceOnUse"><circle cx="40" cy="40" r="12" fill="none" stroke="#fff"/><circle cx="40" cy="40" r="24" fill="none" stroke="#fff"/><circle cx="40" cy="40" r="36" fill="none" stroke="#fff"/></pattern>',
    german: '<pattern id="pg" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V22" stroke="#fff" stroke-width="6"/></pattern>',
    arabic: '<pattern id="pa" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M18 4l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="none" stroke="#fff" stroke-width="1.5"/></pattern>'
  };
  const PID = { math: "pm", science: "ps", english: "pe", social: "pso", german: "pg", arabic: "pa" };
  const pattern = key => PATTERNS[key]
    ? `<svg class="pattern" aria-hidden="true" width="100%" height="100%"><defs>${PATTERNS[key]}</defs><rect width="100%" height="100%" fill="url(#${PID[key]})"/></svg>`
    : "";
  // Pattern ids are reused; that's fine because each definition is identical.

  const playSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';

  /* ---------------- Hero bits ---------------- */
  $("#heroDots").innerHTML = C.subjects.map(s => `<i style="background:${s.color}"></i>`).join("");
  $("#heroStrip").innerHTML = C.subjects.map(s =>
    `<a href="#programs" data-filter="${s.key}" style="--c:${s.color}"><i></i>${esc(s.name)}</a>`).join("");
  $$("#heroStrip a").forEach(a => a.addEventListener("click", () => setFilter(a.dataset.filter)));

  // pointer parallax
  const stage = $("#stage");
  if (stage && !reduced && matchMedia("(pointer:fine)").matches) {
    const layers = $$("[data-depth]", stage);
    let raf = 0;
    $(".hero").addEventListener("pointermove", e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        layers.forEach(l => {
          const d = +l.dataset.depth;
          l.style.transform = l.classList.contains("device")
            ? `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
            : `translate(${x * d}px, ${y * d}px)`;
        });
      });
    });
    $(".hero").addEventListener("pointerleave", () => layers.forEach(l => (l.style.transform = "")));
  }

  /* ---------------- Program cards ---------------- */
  let filter = "all";
  const cardHTML = p => `
    <article class="card" style="--c:${p.s.color}" data-subject="${p.subject}">
      <div class="card-art">
        ${pattern(p.subject)}
        <span class="grade-tag">${esc(p.g.label)}</span>
        ${icon(p.subject, "hero-ic")}
        <button class="play" data-video="${p.id}" aria-label="Watch the ${esc(p.title)} video"><b>${playSvg}</b>Watch video</button>
      </div>
      <div class="card-body">
        <h4>${esc(p.s.name)}<small>${esc(p.g.label)} · <span lang="ar">${esc(p.s.nameAr)}</span></small></h4>
        <p>${esc(p.description)}</p>
        <ul class="ticks">${p.features.slice(0, 5).map(k => `<li>${esc(C.featureLibrary[k].title)}</li>`).join("")}</ul>
        <div class="card-ctas">
          <a class="btn btn-outline view" href="#program-${p.id}">View program</a>
          <a class="btn btn-dark" href="${appLink(p)}" target="_blank" rel="noopener" aria-label="${esc(appAria(p))}">Open app</a>
          <a class="btn btn-wa" href="${waProgram(p)}" target="_blank" rel="noopener">${waIcon}Contact us</a>
        </div>
      </div>
    </article>`;

  function renderRails() {
    C.grades.forEach(g => {
      const rail = $(`#rail-${g.key}`);
      if (!rail) return;
      const list = PROGRAMS.filter(p => p.grade === g.key && (filter === "all" || p.subject === filter));
      rail.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty">${esc(SUB[filter]?.name || "This subject")} isn’t offered for ${esc(g.label)}.</p>`;
      rail.scrollLeft = 0;
      updateArrows(g.key);
    });
  }
  function updateArrows(key) {
    const rail = $(`#rail-${key}`);
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth - 2;
    $$(`[data-rail=${key}]`).forEach(b => {
      b.disabled = +b.dataset.dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max;
    });
  }
  $$("[data-rail]").forEach(b => b.addEventListener("click", () => {
    const rail = $(`#rail-${b.dataset.rail}`);
    const card = rail.querySelector(".card");
    const step = card ? card.getBoundingClientRect().width + 18 : 340;
    rail.scrollBy({ left: +b.dataset.dir * step, behavior: reduced ? "auto" : "smooth" });
  }));
  C.grades.forEach(g => {
    const rail = $(`#rail-${g.key}`);
    if (rail) rail.addEventListener("scroll", () => updateArrows(g.key), { passive: true });
  });
  const railsRO = new ResizeObserver(() => C.grades.forEach(g => updateArrows(g.key)));
  $$(".rail").forEach(r => railsRO.observe(r));

  // subject filters
  const filterBox = $("#subjectFilters");
  filterBox.innerHTML = `<button class="chip" data-f="all" aria-pressed="true">All subjects</button>` +
    C.subjects.map(s => `<button class="chip" data-f="${s.key}" aria-pressed="false" style="--c:${s.color}"><i></i>${esc(s.name)}</button>`).join("");
  function setFilter(f) {
    filter = f;
    $$("#subjectFilters .chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.f === f)));
    renderRails();
  }
  filterBox.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) setFilter(b.dataset.f); });
  $$("[data-grade-link]").forEach(a => a.addEventListener("click", () => { if (filter !== "all") setFilter("all"); }));

  // card video + delegated clicks
  document.addEventListener("click", e => {
    const sh = e.target.closest("[data-shot]");
    if (sh) {
      lastFocus = sh;
      vmFrame.innerHTML = `<img src="${esc(sh.dataset.shot)}" alt="${esc(sh.querySelector("img")?.alt || "")}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#060f2b">`;
      $("#vmTitle").textContent = sh.querySelector("img")?.alt || "";
      vm.hidden = false; $("#vmClose").focus();
      return;
    }
    const v = e.target.closest("[data-video]");
    if (v) { e.preventDefault(); openVideo(byId[v.dataset.video], v); }
  });

  /* ---------------- Video helpers ---------------- */
  function embed(url, title, poster) {
    if (!url) return "";
    const u = String(url).trim();
    let m;
    if ((m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)))
      return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&autoplay=1" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    if ((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
      return `<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=1" title="${esc(title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    return `<video src="${esc(u)}" ${poster ? `poster="${esc(poster)}"` : ""} controls autoplay playsinline preload="metadata" aria-label="${esc(title)}"></video>`;
  }
  const placeholder = p => `<div class="ph"><div>
      <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="10" width="40" height="28" rx="6" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M20 18v12l10-6z" fill="#fff"/></svg>
      <b>${esc(p.title)} video</b>
      <small>${C.site.showEditorHints ? 'Promotional video coming soon. To publish it, add the YouTube, Vimeo or MP4 link to this program’s <code>video</code> field in js/config.js.' : 'The promotional video for this program is coming soon.'}</small>
    </div></div>`;

  /* ---------------- Video modal ---------------- */
  const vm = $("#vmodal"), vmFrame = $("#vmFrame");
  let lastFocus = null;
  function openVideo(p, from) {
    if (!p) return;
    lastFocus = from || document.activeElement;
    vmFrame.style.setProperty("--c", p.s.color);
    vmFrame.innerHTML = p.video ? embed(p.video, p.title, p.poster) : `<div class="slide-media" style="position:absolute;inset:0;--c:${p.s.color}">${pattern(p.subject)}</div>${placeholder(p)}`;
    $("#vmTitle").textContent = p.title;
    vm.hidden = false;
    document.body.style.overflow = "hidden";
    $("#vmClose").focus();
  }
  function closeVideo() {
    vm.hidden = true;
    vmFrame.innerHTML = "";
    if (show.hidden) document.body.style.overflow = "";
    lastFocus?.focus?.();
  }
  $("#vmClose").addEventListener("click", closeVideo);
  vm.addEventListener("click", e => { if (e.target === vm) closeVideo(); });

  /* ---------------- Video showcase grid ---------------- */
  let vFilter = "all";
  $("#videoFilters").innerHTML = `<button class="chip" data-vf="all" aria-pressed="true">All grades</button>` +
    C.grades.map(g => `<button class="chip" data-vf="${g.key}" aria-pressed="false">${esc(g.label)}</button>`).join("");
  function renderVideos() {
    $("#videoGrid").innerHTML = PROGRAMS.filter(p => vFilter === "all" || p.grade === vFilter).map(p => `
      <button class="vthumb reveal" data-video="${p.id}" style="--c:${p.s.color}" aria-label="Play the ${esc(p.title)} video">
        ${p.poster ? `<img class="v-poster" src="${esc(p.poster)}" alt="" loading="lazy">` : pattern(p.subject) + icon(p.subject, "v-ic")}
        ${p.video ? "" : '<span class="v-soon">Video coming soon</span>'}
        <span class="v-play">${playSvg}</span>
        <span class="v-meta"><b>${esc(p.s.name)}</b><small>${esc(p.g.label)}</small></span>
      </button>`).join("");
  }
  $("#videoFilters").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    vFilter = b.dataset.vf;
    $$("#videoFilters .chip").forEach(c => c.setAttribute("aria-pressed", String(c === b)));
    renderVideos();
  });

  /* ---------------- Program showcase ---------------- */
  const show = $("#show"), showBody = $("#showBody");
  let cur = null, showOpener = null;
  $("#showGrades").innerHTML = C.grades.map(g => `<button data-g="${g.key}" aria-pressed="false">${esc(g.label)}</button>`).join("");
  $("#showSubjects").innerHTML = C.subjects.map(s => `<button data-s="${s.key}" aria-pressed="false" style="--c:${s.color}"><i></i>${esc(s.name)}</button>`).join("");

  const shotMock = (p, n) => {
    const rows = [[70, 40, 100, 100], [55, 85, 60, 40], [80, 30, 90, 65]][n % 3];
    return `<div class="shot"><div class="mini"><i style="height:10px;width:${rows[0]}%;background:${p.s.color}"></i><i style="height:7px;width:${rows[1]}%"></i><i style="height:20px;width:${rows[2]}%"></i><i style="height:20px;width:${rows[3]}%"></i><i style="height:7px;width:45%;margin-top:auto"></i></div></div>`;
  };

  function slideHTML(p) {
    const shots = p.screenshots && p.screenshots.length
      ? `<div class="shots">${p.screenshots.slice(0, 6).map((src, i) => `<button class="shot" data-shot="${esc(src)}" aria-label="Enlarge ${esc(p.title)} screen ${i + 1}"><img src="${esc(src)}" alt="${esc(p.title)} screen ${i + 1}" loading="lazy"></button>`).join("")}</div>`
      : `<div class="shots">${[0, 1, 2].map(i => shotMock(p, i)).join("")}</div>${C.site.showEditorHints ? '<p class="shots-note">Illustrated preview. Add real platform screenshots to this program’s <code>screenshots</code> list in js/config.js.</p>' : ""}`;
    return `
      <div class="slide" style="--c:${p.s.color}">
        <div class="slide-media">
          ${pattern(p.subject)}
          <div class="s-title">${icon(p.subject)}<div><h2 id="showTitle">${esc(p.s.name)}</h2><p>${esc(p.g.label)} program · <span lang="ar">${esc(p.s.nameAr)}</span></p></div></div>
          <div class="player">${p.video ? embed(p.video, p.title, p.poster).replace("autoplay=1", "autoplay=0").replace(" autoplay ", " ") : placeholder(p)}</div>
          ${shots}
        </div>
        <div class="slide-info">
          <p>${esc(p.description)}</p>
          <div><h3>Key learning benefits</h3><ol class="benefits">${p.benefits.map((b, i) => `<li><b>${i + 1}</b>${esc(b)}</li>`).join("")}</ol></div>
          <div><h3>Feature highlights</h3><div class="chips">${p.features.map(k => `<span>${esc(C.featureLibrary[k].title)}</span>`).join("")}</div></div>
          <div class="slide-ctas">
            <a class="btn btn-dark btn-lg" href="${appLink(p)}" target="_blank" rel="noopener" aria-label="${esc(appAria(p))}">Open app</a>
            <a class="btn btn-wa btn-lg" href="${waProgram(p)}" target="_blank" rel="noopener">${waIcon}Contact us</a>
          </div>
        </div>
      </div>`;
  }

  function renderShow(p, dir = 0) {
    cur = p;
    showBody.innerHTML = slideHTML(p);
    showBody.scrollTop = 0;
    if (dir && !reduced) showBody.firstElementChild.classList.add(dir > 0 ? "enter-r" : "enter-l");
    $$("#showGrades button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.g === p.grade)));
    $$("#showSubjects button").forEach(b => {
      b.setAttribute("aria-pressed", String(b.dataset.s === p.subject));
      b.disabled = !byId[`${p.grade}-${b.dataset.s}`];
      b.hidden = b.disabled;
    });
    const act = $("#showSubjects [aria-pressed=true]");
    if (act) { const box = $("#showSubjects"); box.scrollLeft = act.offsetLeft - box.clientWidth / 2 + act.clientWidth / 2; }
    const same = PROGRAMS.filter(x => x.grade === p.grade);
    $("#showDots").innerHTML = same.map(x => `<button style="--c:${x.s.color}" data-id="${x.id}" aria-label="${esc(x.title)}" ${x.id === p.id ? 'aria-current="true"' : ""}></button>`).join("");
    $("#showDots").style.setProperty("--c", p.s.color);
    try { history.replaceState(null, "", `#program-${p.id}`); } catch (_) {}
  }
  function openShow(id, opener) {
    const p = byId[id]; if (!p) return;
    showOpener = opener || document.activeElement;
    show.hidden = false;
    document.body.style.overflow = "hidden";
    renderShow(p);
    $("#showClose").focus();
  }
  function closeShow() {
    show.hidden = true;
    showBody.innerHTML = "";
    document.body.style.overflow = "";
    try { history.replaceState(null, "", "#programs"); } catch (_) {}
    showOpener?.focus?.();
  }
  function step(d) {
    const i = PROGRAMS.indexOf(cur);
    renderShow(PROGRAMS[(i + d + PROGRAMS.length) % PROGRAMS.length], d);
  }
  $("#showPrev").addEventListener("click", () => step(-1));
  $("#showNext").addEventListener("click", () => step(1));
  $("#showClose").addEventListener("click", closeShow);
  show.addEventListener("click", e => { if (e.target === show) closeShow(); });
  $("#showDots").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const to = byId[b.dataset.id];
    renderShow(to, PROGRAMS.indexOf(to) > PROGRAMS.indexOf(cur) ? 1 : -1);
  });
  $("#showGrades").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.dataset.g === cur.grade) return;
    const to = byId[`${b.dataset.g}-${cur.subject}`] || PROGRAMS.find(x => x.grade === b.dataset.g);
    if (to) renderShow(to, PROGRAMS.indexOf(to) > PROGRAMS.indexOf(cur) ? 1 : -1);
  });
  $("#showSubjects").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.disabled) return;
    const to = byId[`${cur.grade}-${b.dataset.s}`];
    if (to && to !== cur) renderShow(to, PROGRAMS.indexOf(to) > PROGRAMS.indexOf(cur) ? 1 : -1);
  });
  // touch swipe
  let sx = null;
  showBody.addEventListener("touchstart", e => (sx = e.touches[0].clientX), { passive: true });
  showBody.addEventListener("touchend", e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 70) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  // open from links (#program-g6-math)
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#program-"]');
    if (!a) return;
    e.preventDefault();
    openShow(a.getAttribute("href").slice(9), a);
  });
  const fromHash = () => { const h = location.hash; if (h.startsWith("#program-") && byId[h.slice(9)]) openShow(h.slice(9)); };
  window.addEventListener("hashchange", fromHash);

  /* ---------------- Keyboard + focus trap ---------------- */
  document.addEventListener("keydown", e => {
    const modal = !vm.hidden ? vm : !show.hidden ? show : null;
    if (!modal) return;
    if (e.key === "Escape") { modal === vm ? closeVideo() : closeShow(); }
    else if (modal === show && (e.key === "ArrowRight" || e.key === "ArrowLeft") && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) step(e.key === "ArrowRight" ? 1 : -1);
    else if (e.key === "Tab") {
      const f = $$('a[href],button:not([disabled]),iframe,video,[tabindex]:not([tabindex="-1"])', modal).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- Features list + demo ---------------- */
  const FI = {
    interactive: '<path d="M9 3v8M5 7h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11l9 4-4 1.5L13.5 21z" fill="currentColor"/>',
    quizzes: '<rect x="4" y="3" width="16" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16.5" r="1.6" fill="currentColor"/>',
    autocorrect: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    feedback: '<path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 8v3M12 13.5v.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    videos: '<rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9v6l5-3z" fill="currentColor"/>',
    visual: '<path d="M3 20l6-8 4 5 3-4 5 7z" fill="currentColor" opacity=".5"/><circle cx="16" cy="7" r="3" fill="currentColor"/>',
    progress: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    practice: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    audio: '<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    glossary: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="11.5" cy="10.5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13.4 12.4l2.3 2.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    game: '<path d="M6 8h12a4 4 0 0 1 4 4v2a3.5 3.5 0 0 1-6 2.4L14.5 15h-5L8 16.4A3.5 3.5 0 0 1 2 14v-2a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 10.5v3M5.5 12h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="11" r="1.2" fill="currentColor"/><circle cx="18" cy="13.4" r="1.2" fill="currentColor"/>',
    friendly: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 14a4.5 4.5 0 0 0 8 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="9.5" r="1.3" fill="currentColor"/><circle cx="15" cy="9.5" r="1.3" fill="currentColor"/>'
  };
  $("#featList").innerHTML = Object.entries(C.featureLibrary).map(([k, f]) =>
    `<li class="reveal"><span class="fi"><svg viewBox="0 0 24 24" aria-hidden="true">${FI[k] || FI.interactive}</svg></span><div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div></li>`).join("");

  const DEMO = [
    { q: "Which fraction is equal to 0.75?", o: ["2/3", "3/4", "4/5", "7/10"], a: 1, why: "0.75 = 75/100, which simplifies to 3/4." },
    { q: "Which gas do plants take in to make their food?", o: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], a: 2, why: "Plants use carbon dioxide, water and sunlight in photosynthesis." },
    { q: "Choose the correct word: She ___ to school every day.", o: ["go", "goes", "going", "gone"], a: 1, why: "With he, she or it in the present simple, the verb takes -s: goes." }
  ];
  let dq = 0, dScore = 0;
  function renderDemo() {
    const d = DEMO[dq];
    $("#demoQ").textContent = d.q;
    $("#demoOpts").innerHTML = d.o.map((o, i) => `<button data-i="${i}">${esc(o)}</button>`).join("");
    $("#demoFb").textContent = ""; $("#demoFb").className = "demo-fb";
    $("#demoNext").hidden = true;
    $("#demoBar").style.width = `${(dq / DEMO.length) * 100}%`;
    $("#demoScore").textContent = `${dScore} / ${DEMO.length}`;
  }
  $("#demoOpts").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.disabled) return;
    const d = DEMO[dq], i = +b.dataset.i, ok = i === d.a;
    $$("#demoOpts button").forEach((x, j) => { x.disabled = true; if (j === d.a) x.classList.add("right"); });
    if (!ok) b.classList.add("wrong"); else dScore++;
    $("#demoFb").textContent = (ok ? "Correct! " : "Not quite. ") + d.why;
    $("#demoFb").className = "demo-fb " + (ok ? "good" : "bad");
    $("#demoBar").style.width = `${((dq + 1) / DEMO.length) * 100}%`;
    $("#demoScore").textContent = `${dScore} / ${DEMO.length}`;
    $("#demoNext").textContent = dq < DEMO.length - 1 ? "Next question" : "Try again";
    $("#demoNext").hidden = false;
  });
  $("#demoNext").addEventListener("click", () => {
    if (dq < DEMO.length - 1) dq++; else { dq = 0; dScore = 0; }
    renderDemo();
    $("#demoOpts button")?.focus();
  });

  /* ---------------- Stats + testimonials ---------------- */
  const stats = C.stats && C.stats.length ? C.stats : [
    { value: C.grades.length, label: "Grade levels" },
    { value: new Set(PROGRAMS.map(p => p.subject)).size, label: "Subjects" },
    { value: PROGRAMS.length, label: "Interactive programs" }
  ];
  $("#stats").innerHTML = stats.map(s => `<div class="stat"><b data-to="${+s.value}" data-suffix="${esc(s.suffix || "")}">${+s.value}${esc(s.suffix || "")}</b><span>${esc(s.label)}</span></div>`).join("");
  if (!reduced) {
    const statIO = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      statIO.unobserve(en.target);
      const el = en.target, to = +el.dataset.to, suf = el.dataset.suffix, t0 = performance.now();
      const tick = t => { const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - (1 - k) ** 3)) + suf; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    $$("#stats b").forEach(b => statIO.observe(b));
  }
  const T = C.testimonials || [];
  $("#testimonials").innerHTML = T.length
    ? `<h3 style="margin-bottom:16px">What parents say</h3><div class="testi-grid">${T.map(t => `<figure class="testi"><blockquote>“${esc(t.quote)}”</blockquote><p><b>${esc(t.name)}</b>${t.detail ? " · " + esc(t.detail) : ""}</p></figure>`).join("")}</div>`
    : C.site.showEditorHints ? `<p class="hint"><b>Parent testimonials:</b> this space will show authentic parent feedback once it's added to <code>testimonials</code> in js/config.js. Verified figures can be added to <code>stats</code>.</p>` : "";

  /* ---------------- Contact form ---------------- */
  const gSel = $("#askGrade"), sSel = $("#askSubject"), nIn = $("#askName"), iSel = $("#askIntent");
  gSel.innerHTML = C.grades.map(g => `<option value="${g.key}">${esc(g.label)}</option>`).join("");
  const fillSubjects = () => {
    const keep = sSel.value;
    const list = PROGRAMS.filter(p => p.grade === gSel.value);
    sSel.innerHTML = list.map(p => `<option value="${p.subject}">${esc(p.s.name)}</option>`).join("");
    if (list.some(p => p.subject === keep)) sSel.value = keep;
  };
  fillSubjects();
  gSel.addEventListener("change", fillSubjects);
  function updateAsk() {
    const p = byId[`${gSel.value}-${sSel.value}`];
    const name = nIn.value.trim().replace(/\s+/g, " ").slice(0, 60);
    let msg = p
      ? (iSel.value === "buy" ? C.site.whatsappBuyTemplate : C.site.whatsappTemplate).replace("{program}", p.title)
      : C.site.whatsappGeneral;
    if (name) msg = msg.replace("Hello International Education Egypt,", `Hello International Education Egypt, my name is ${name}.`).replace(/\.\s+I /, ". I ");
    $("#askPreview").textContent = msg;
    $("#askSend").href = wa(msg);
    $("#askPreview").classList.add("flash");
    setTimeout(() => $("#askPreview").classList.remove("flash"), 250);
  }
  [gSel, sSel, iSel].forEach(el => el.addEventListener("change", updateAsk));
  nIn.addEventListener("input", updateAsk);
  $("#askForm").addEventListener("submit", e => { e.preventDefault(); $("#askSend").click(); });
  updateAsk();
  const pretty = waReady ? "+" + waDigits : "";
  $("#waNumber").innerHTML = waReady ? `WhatsApp: <b>${esc(pretty)}</b>` : (C.site.showEditorHints ? 'Add the WhatsApp Business number in <code>whatsappNumber</code> in js/config.js.' : "");

  /* ---------------- Footer ---------------- */
  C.grades.forEach(g => {
    const box = $(`#foot${g.key.toUpperCase()}`);
    if (box) box.innerHTML = PROGRAMS.filter(p => p.grade === g.key).map(p => `<a href="#program-${p.id}">${esc(p.s.name)}</a>`).join("");
  });
  $("#year").textContent = new Date().getFullYear();
  const SOC = {
    facebook: '<path fill="currentColor" d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H16l.6-4h-3.1V8.9c0-.6.3-.9.9-.9z"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9v6l5-3z" fill="currentColor"/>',
    tiktok: '<path fill="currentColor" d="M15.5 3c.4 2.3 1.8 3.7 4 4v3.2a7.3 7.3 0 0 1-4-1.3v6.4A5.7 5.7 0 1 1 9.8 9.6v3.3a2.5 2.5 0 1 0 2.5 2.5V3z"/>',
    linkedin: '<path fill="currentColor" d="M4 9h3.5v11H4zM5.8 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM9.5 9H13v1.6c.6-1 1.8-1.9 3.6-1.9 3.4 0 4 2.2 4 5.1V20H17v-5.4c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H9.5z"/>'
  };
  const soc = Object.entries(C.site.social || {}).filter(([k, v]) => v && SOC[k] && /^https?:\/\//.test(v));
  $("#socials").innerHTML = soc.length
    ? soc.map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener" aria-label="International Education Egypt on ${k[0].toUpperCase() + k.slice(1)}"><svg viewBox="0 0 24 24" aria-hidden="true">${SOC[k]}</svg></a>`).join("")
    : C.site.showEditorHints ? '<p class="hint">Social links appear here once added to <code>social</code> in js/config.js.</p>' : "";

  /* ---------------- Navigation ---------------- */
  const nav = $(".nav"), burger = $("#burger"), links = $("#navLinks");
  const setMenu = open => { links.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && links.classList.contains("open")) { setMenu(false); burger.focus(); } });
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 20), { passive: true });

  const sections = ["home", "programs", "grade-6", "grade-8", "features", "about", "contact"].map(id => document.getElementById(id)).filter(Boolean);
  const navIO = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      const id = en.target.id;
      $$("#navLinks a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => navIO.observe(s));

  /* ---------------- Reveal markers + boot ---------------- */
  $$(".sec-head, .grade-head, .pillars article, .steps li, .stat, .why-top, .contact-copy, .ask").forEach(el => el.classList.add("reveal"));
  renderRails();
  renderVideos();
  renderDemo();
  fromHash();
}
