/* =========================================================================
   RENDER.JS: the engine. You should not need to edit this file.
   Menus and roles live in nav-config.js. Page content lives in /sops.

   What this file does with plain Markdown in an SOP:
   - "Type: Timeline" under the title: each "### Stage" becomes a stage
     on a numbered timeline.
   - "Type: Checklist" (or any "- [ ] item"): a tick box that remembers
     what you ticked on this device, with a progress bar.
   - "## Steps" (or any numbered list): numbered step markers on a rail.
     A list that starts at 7 keeps counting from 7.
   - "## Numbers to know": each "**value** label" item becomes a tile.
   - A list where every item starts with "**Label:**" becomes black tags
     with white bubbles.
   - "> Tip:", "> Note:", "> Important:", "> Warning:" become callouts.
   - Back-to-back pictures (or a <div class="carousel">) become a slideshow.
   ========================================================================= */

/* ---------- small helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const slugify = s => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function store(key, val) {
  try { if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null"); localStorage.setItem(key, JSON.stringify(val)); }
  catch (e) { return null; }
}
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
function getQueryParam(name) { return new URLSearchParams(window.location.search).get(name); }
async function getText(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(res.status);
  return res.text();
}
const sopHref = (role, file) => "sop.html?role=" + role + "&file=" + encodeURIComponent(file);
const visibleFor = role => SOP_LIBRARY.filter(s => s.roles.includes(role));
const roleLabel = role => ROLE_LABELS[role] || "Team";
const extrasFor = role => (typeof ROLE_EXTRAS !== "undefined" && ROLE_EXTRAS[role]) || [];

/* ---------- the frame every page shares: top bar, menu, page, contents ---------- */
function buildShell(role) {
  document.body.classList.add("app");
  document.body.innerHTML =
    '<a class="skip-link" href="#content">Skip to content</a>' +
    '<header class="topbar">' +
      '<button class="menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '<a class="brand" href="' + role + '.html"><span class="brand-mark" aria-hidden="true"></span>' +
        '<span class="brand-text">Start-Up SOPs<small>' + esc(roleLabel(role)) + ' view</small></span></a>' +
      '<div class="search" role="search">' +
        '<input id="search" type="search" placeholder="Search the SOPs" autocomplete="off" aria-label="Search the SOPs">' +
        '<kbd class="search-key" aria-hidden="true">/</kbd>' +
        '<div class="search-results" id="search-results" hidden></div>' +
      "</div>" +
    "</header>" +
    '<div class="layout">' +
      '<nav class="sidebar" id="sidebar" aria-label="SOP menu"></nav>' +
      '<main id="content" tabindex="-1"><p class="loading">Loading…</p></main>' +
      '<aside class="toc" id="toc" aria-label="On this page"></aside>' +
    "</div>" +
    '<div class="scrim" id="scrim" hidden></div>';

  $("#menu-btn").addEventListener("click", () => document.body.classList.contains("menu-open") ? closeMenu() : openMenu());
  $("#scrim").addEventListener("click", closeMenu);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
}
function openMenu() { document.body.classList.add("menu-open"); $("#scrim").hidden = false; $("#menu-btn").setAttribute("aria-expanded", "true"); }
function closeMenu() { document.body.classList.remove("menu-open"); $("#scrim").hidden = true; $("#menu-btn").setAttribute("aria-expanded", "false"); }

/* ---------- left menu ---------- */
function sideGroup(key, title, open) {
  const d = el("details", "side-group");
  const saved = store("nav-open-" + key);
  d.open = saved === null ? open : saved;
  d.addEventListener("toggle", () => store("nav-open-" + key, d.open));
  d.appendChild(el("summary", "", esc(title)));
  return d;
}

function buildSidebar(role, activeFile) {
  const side = $("#sidebar");
  side.innerHTML = "";
  const home = el("a", "side-home" + (activeFile ? "" : " active"), esc(roleLabel(role)) + " home");
  home.href = role + ".html";
  side.appendChild(home);

  const groups = [];
  visibleFor(role).forEach(s => {
    const name = s.group || "SOPs";
    let g = groups.find(x => x.name === name);
    if (!g) { g = { name, items: [] }; groups.push(g); }
    g.items.push(s);
  });
  groups.forEach(g => {
    const box = sideGroup(role + "/" + slugify(g.name), g.name, true);
    extrasFor(role).filter(e => e.group === g.name).forEach(e => {
      const a = el("a", "side-link side-app", esc(e.label));
      a.href = e.url; a.target = "_blank"; a.rel = "noopener";
      box.appendChild(a);
    });
    g.items.forEach(s => {
      const a = el("a", "side-link", esc(s.title));
      a.href = sopHref(role, s.file);
      if (s.file === activeFile) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
        box.open = true;
      }
      box.appendChild(a);
    });
    side.appendChild(box);
  });

  const switchTo = (typeof ROLE_SWITCHER !== "undefined" && ROLE_SWITCHER[role]) || [];
  if (switchTo.length) {
    const box = sideGroup(role + "/role-views", "Role views", true);
    switchTo.forEach(r => {
      const a = el("a", "side-link side-role", esc(roleLabel(r)) + " view");
      a.href = r + ".html";
      box.appendChild(a);
    });
    side.appendChild(box);
  }
  side.appendChild(el("div", "side-foot",
    '<a href="https://github.com/' + REPO + '#readme" target="_blank" rel="noopener">How to edit these pages</a>'));
}

/* ---------- loading every SOP once, for search and the home cards ---------- */
const index = { pages: [], loaded: false };

async function loadIndex(role) {
  index.pages = visibleFor(role).map(s => ({ ...s }));
  await Promise.all(index.pages.map(async p => {
    try {
      const md = await getText(p.file);
      p.md = md;
      const { meta, body } = splitMeta(md);
      p.meta = meta;
      p.count = countFor(meta, body);
      p.text = body.replace(/<[^>]+>/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*_`|\-\[\]]+/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
      p.lower = p.text.toLowerCase();
    } catch (e) { p.text = ""; p.lower = ""; }
  }));
  index.loaded = true;
}

function countFor(meta, body) {
  const type = (meta.type || "").toLowerCase();
  if (type === "timeline") { const n = (body.match(/^###\s+/gm) || []).length; return n ? n + " stages" : ""; }
  const checks = (body.match(/^\s*[-*]\s+\[[ xX]\]/gm) || []).length;
  const steps = (body.match(/^\d+\.\s+/gm) || []).length;
  if ((type === "checklist" || type === "form") && checks) return checks + " checks";
  if (steps >= 6) return steps + " steps";
  if (checks) return checks + " checks";
  return "";
}

/* ---------- Markdown → page ---------- */
function splitMeta(md) {
  // "Type: Timeline" (and similar) right under the title.
  const meta = {};
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let i = 0, title = "";
  while (i < lines.length && !lines[i].trim()) i++;
  if (lines[i] && /^#\s+/.test(lines[i])) { title = lines[i].replace(/^#\s+/, "").trim(); i++; }
  else if (lines[i] && /^<h1>/i.test(lines[i].trim())) { title = lines[i].replace(/<\/?h1>/gi, "").trim(); i++; }
  while (i < lines.length) {
    const t = lines[i].trim();
    const m = t.match(/^(Type|Status|Owner|Last reviewed|Updated):\s*(.+)$/i);
    if (m) { meta[m[1].toLowerCase()] = m[2].trim(); i++; }
    else if (!t) i++;
    else break;
  }
  return { title, meta, body: lines.slice(i).join("\n") };
}

function addSpacers(md) {
  // Extra blank lines in a file become extra space on the page.
  return md.replace(/\n[ \t]*\n((?:[ \t]*\n)+)/g, (m, extra) =>
    "\n\n" + '<div class="spacer"></div>\n\n'.repeat((extra.match(/\n/g) || []).length));
}

function renderMarkdown(md) {
  marked.setOptions({ gfm: true, breaks: true });
  return cleanHTML(marked.parse(addSpacers(md)));
}

/* Safety filter: removes scripts and other risky code from page text before it shows. */
function cleanHTML(html) {
  if (typeof DOMPurify === "undefined" || !DOMPurify.isSupported) {
    throw new Error("The safety filter (assets/vendor/purify.min.js) didn't load, so pages can't be shown.");
  }
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] })
    .replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async" ');
}


const SECTION_KINDS = {
  "steps": "steps", "how to do it": "steps",
  "numbers to know": "numbers", "at a glance": "numbers", "key numbers": "numbers",
  "watch out for": "errors", "common mistakes": "errors"
};
const CALLOUTS = {
  "tip": "tip", "note": "note", "important": "important", "warning": "warning",
  "heads up": "warning", "example": "note", "remember": "note"
};

/* Wrap each "## Heading" and what follows it in its own card. */
function wrapSections(root) {
  const out = document.createDocumentFragment();
  let current = null, n = 0;
  Array.from(root.childNodes).forEach(node => {
    if (node.nodeType === 1 && node.tagName === "H2") {
      const kind = SECTION_KINDS[node.textContent.trim().toLowerCase().replace(/[:?]$/, "")] || "plain";
      current = el("section", "sec sec-" + kind);
      current.dataset.n = String(++n).padStart(2, "0");
      current.appendChild(node);
      out.appendChild(current);
    } else if (current) current.appendChild(node);
    else out.appendChild(node);
  });
  root.innerHTML = "";
  root.appendChild(out);
  // Blank lines typed just before a "## Heading" add space between the cards,
  // not inside the bottom of the card above.
  $$(".sec", root).forEach(sec => {
    let last = sec.lastElementChild;
    while (last && last.classList.contains("spacer")) {
      sec.after(last);
      last = sec.lastElementChild;
    }
  });
}

/* Numbered lists keep counting across groups: a list that starts at 7 shows 7. */
function continueNumbers(root) {
  $$("ol", root).forEach(ol => {
    const s = parseInt(ol.getAttribute("start") || "1", 10);
    ol.style.counterReset = "step " + (s - 1);
  });
}

function styleCallouts(root) {
  $$("blockquote", root).forEach(bq => {
    const p = bq.querySelector("p");
    const text = p ? p.textContent.trim() : "";
    const m = text.match(/^([A-Za-z ]{2,16}):/);
    const kind = m && CALLOUTS[m[1].toLowerCase().trim()];
    bq.className = "callout callout-" + (kind || "note");
    if (kind) {
      const first = p.firstChild;
      if (first && first.nodeType === 3) first.textContent = first.textContent.replace(/^\s*[A-Za-z ]{2,16}:\s*/, "");
      else if (first && first.nodeType === 1 && /^(STRONG|B)$/.test(first.tagName)) first.remove();
      bq.insertBefore(el("div", "callout-label", esc(m[1].trim())), bq.firstChild);
    }
  });
  // Older pages use <div class="callout">: treat it as "Important".
  $$("div.callout", root).forEach(d => d.classList.add("callout-important"));
}

function styleLinks(root) {
  $$("a[href]", root).forEach(a => {
    const href = a.getAttribute("href");
    if (/^https?:/i.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    if (/sharepoint\.com/i.test(href)) { a.classList.add("sp-link"); a.title = "Opens SharePoint. Southland login required."; }
    if (/^(#add|ADD-)/i.test(href)) { a.classList.add("todo-link"); a.title = "Link still to be added"; a.removeAttribute("href"); }
    const sop = SOP_LIBRARY.find(s => s.file === href || s.file === "sops/" + href || s.id === href);
    if (sop) a.href = sopHref(currentRole, sop.file);
  });
}

/* Pictures: one on its own is a figure. Back-to-back pictures become a slideshow. */
function styleImages(root) {
  $$(".carousel", root).forEach(box => {
    const figs = $$("figure", box);
    if (figs.length > 1) box.replaceWith(buildSlideshow(figs));
    else if (figs.length === 1) box.replaceWith(figs[0]);
  });
  $$("p", root).forEach(p => {
    if (p.querySelector("img") && !p.textContent.trim() && !p.closest("figure")) p.classList.add("figure-row");
  });
  $$("img", root).forEach(img => {
    img.loading = "lazy";
    let fig = img.closest("figure");
    if (!fig) {
      fig = el("figure", "shot");
      img.replaceWith(fig);
      fig.appendChild(img);
      if (img.alt) fig.appendChild(el("figcaption", "", esc(img.alt)));
    } else fig.classList.add("shot");
    img.addEventListener("click", () => openLightbox(img));
  });
  $$("p.figure-row", root).forEach(r => {
    if (!r.parentNode) return;
    const figs = [];
    let n = r;
    while (n && n.tagName === "P" && n.classList.contains("figure-row")) {
      figs.push(...$$("figure", n));
      const next = n.nextElementSibling;
      if (n !== r) n.remove();
      n = next;
    }
    if (figs.length === 1) r.replaceWith(figs[0]);
    else if (figs.length > 1) r.replaceWith(buildSlideshow(figs));
  });
}

function buildSlideshow(figs) {
  const box = el("div", "slides");
  box.tabIndex = 0;
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", "Slideshow, " + figs.length + " pictures");
  const stage = el("div", "slides-stage");
  figs.forEach(f => stage.appendChild(f));
  const prev = el("button", "slides-arrow prev", "<span aria-hidden='true'>‹</span>");
  const next = el("button", "slides-arrow next", "<span aria-hidden='true'>›</span>");
  prev.type = next.type = "button";
  prev.setAttribute("aria-label", "Previous picture");
  next.setAttribute("aria-label", "Next picture");
  stage.append(prev, next);
  const bar = el("div", "slides-bar");
  const count = el("span", "slides-count");
  const dots = el("div", "slides-dots");
  figs.forEach((_, i) => {
    const d = el("button", "slides-dot");
    d.type = "button";
    d.setAttribute("aria-label", "Picture " + (i + 1));
    d.addEventListener("click", () => go(i));
    dots.appendChild(d);
  });
  bar.append(count, dots);
  box.append(stage, bar);
  let at = 0;
  function go(i) {
    at = Math.max(0, Math.min(figs.length - 1, i));
    figs.forEach((f, k) => f.classList.toggle("is-current", k === at));
    $$(".slides-dot", dots).forEach((d, k) => d.classList.toggle("active", k === at));
    count.textContent = (at + 1) + " of " + figs.length;
    prev.disabled = at === 0;
    next.disabled = at === figs.length - 1;
  }
  prev.addEventListener("click", () => go(at - 1));
  next.addEventListener("click", () => go(at + 1));
  box.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(at + 1); }
  });
  let x0 = null;
  stage.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(at + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  go(0);
  return box;
}

function openLightbox(img) {
  const box = el("div", "lightbox");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", img.alt || "Picture");
  const big = el("img");
  big.src = img.src; big.alt = img.alt || "";
  const close = el("button", "lb-close", "×");
  close.setAttribute("aria-label", "Close");
  box.append(close, big);
  const cap = img.closest("figure") && img.closest("figure").querySelector("figcaption");
  const capText = cap ? cap.textContent : img.alt;
  if (capText) box.appendChild(el("p", "", esc(capText)));
  const shut = () => { box.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") shut(); };
  box.addEventListener("click", shut);
  document.addEventListener("keydown", onKey);
  document.body.appendChild(box);
  close.focus();
}

function wrapTables(root) {
  $$("table", root).forEach(t => {
    const old = t.parentElement;
    if (old && old.classList.contains("table-scroll")) { old.className = "table-wrap"; return; }
    const w = el("div", "table-wrap");
    t.replaceWith(w);
    w.appendChild(t);
  });
}

/* "Type: Timeline": every "### Stage" and what follows it becomes a stage. */
function buildTimeline(root) {
  const heads = $$("h3", root);
  if (heads.length < 2) return;
  const line = el("div", "timeline");
  const nav = el("div", "stage-nav");
  nav.setAttribute("role", "list");
  heads[0].before(nav);
  nav.after(line);
  heads.forEach((h, i) => {
    const stage = el("div", "stage reveal");
    const id = "stage-" + slugify(h.textContent);
    stage.id = id;
    stage.appendChild(el("div", "stage-num", String(i + 1)));
    const body = el("div", "stage-body");
    let n = h.nextSibling;
    body.appendChild(el("div", "stage-kicker", "Stage " + (i + 1) + " of " + heads.length));
    body.appendChild(h);
    while (n && !(n.nodeType === 1 && /^H[23]$/.test(n.tagName))) {
      const next = n.nextSibling;
      body.appendChild(n);
      n = next;
    }
    stage.appendChild(body);
    line.appendChild(stage);
    const b = el("a", "stage-chip", '<span class="stage-chip-n">' + (i + 1) + "</span>" + esc(h.textContent));
    b.href = "#" + id;
    b.setAttribute("role", "listitem");
    b.addEventListener("click", e => { e.preventDefault(); stage.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); });
    nav.appendChild(b);
  });
  // The rail fills in as you scroll, and the stage in the middle of the screen lights up.
  const stages = $$(".stage", line), chips = $$(".stage-chip", nav);
  function onScroll() {
    const r = line.getBoundingClientRect(), mid = window.innerHeight * 0.55;
    const pct = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    line.style.setProperty("--fill", (pct * 100).toFixed(1) + "%");
    let cur = 0;
    stages.forEach((s, i) => { if (s.getBoundingClientRect().top < mid) cur = i; });
    stages.forEach((s, i) => { s.classList.toggle("is-current", i === cur); s.classList.toggle("is-past", i < cur); });
    chips.forEach((c, i) => { c.classList.toggle("is-current", i === cur); c.classList.toggle("is-past", i < cur); });
  }
  window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  requestAnimationFrame(onScroll);
}

/* "## Numbers to know": "**value** label" items become tiles. */
function buildTiles(root) {
  $$(".sec-numbers ul", root).forEach(ul => {
    ul.classList.add("tiles");
    $$(":scope > li", ul).forEach(li => {
      li.classList.add("reveal");
      const s = li.querySelector("strong, b");
      if (!s) return;
      const v = el("span", "tile-value", s.innerHTML);
      s.remove();
      const rest = li.innerHTML.replace(/^\s*[:–-]?\s*/, "");
      li.innerHTML = "";
      li.append(v, el("span", "tile-label", rest));
    });
  });
}

/* A list where every item starts with "**Label:**" becomes black tags with white bubbles. */
function buildTagRows(root) {
  $$("ul", root).forEach(ul => {
    if (ul.closest(".tiles, .checklist")) return;
    const lis = $$(":scope > li", ul);
    if (lis.length < 2) return;
    const ok = lis.every(li => {
      const f = li.firstElementChild;
      if (!f || !/^(STRONG|B)$/.test(f.tagName) || li.firstChild !== f) return false;
      const after = f.nextSibling ? (f.nextSibling.textContent || "") : "";
      return /:\s*$/.test(f.textContent) || /^\s*:/.test(after);
    });
    if (!ok) return;
    ul.classList.add("tags");
    lis.forEach(li => {
      const f = li.firstElementChild;
      const tag = el("span", "tag", esc(f.textContent.replace(/:\s*$/, "")));
      f.remove();
      const body = el("div", "tag-body");
      while (li.firstChild) body.appendChild(li.firstChild);
      if (body.firstChild && body.firstChild.nodeType === 3) body.firstChild.textContent = body.firstChild.textContent.replace(/^\s*:\s*/, "");
      li.append(tag, body);
      li.classList.add("reveal");
    });
  });
}

/* "Type: Reference": each "## Section" folds into a numbered black bar you click to open. */
function buildReferenceAccordions(root) {
  let n = 0;
  $$(".sec-plain", root).forEach(sec => {
    const h = sec.querySelector(":scope > h2");
    if (!h) return;
    const d = el("details", "accordion ref");
    const count = sec.querySelectorAll(":scope > ul > li").length;
    d.appendChild(el("summary", "", '<span class="acc-n">' + String(++n).padStart(2, "0") + '</span><span class="acc-title">' + h.innerHTML + "</span>" +
      (count ? '<span class="acc-count">' + count + "</span>" : "")));
    h.remove();
    const body = el("div", "accordion-body ref-body");
    while (sec.firstChild) body.appendChild(sec.firstChild);
    d.appendChild(body);
    sec.replaceWith(d);
  });
}

/* Nested bullets under a step or a checklist item show as small chips. */
function buildChips(root) {
  $$("li > ul", root).forEach(ul => {
    const lis = $$(":scope > li", ul);
    if (!lis.length || lis.some(li => li.querySelector("input, ul, ol"))) return;
    if (lis.every(li => li.textContent.trim().length <= 28)) ul.classList.add("chips");
  });
}

/* "- [ ] item": a saved checklist. */
let pageKey = "";
function buildChecklists(root) {
  $$("ul", root).forEach((ul, listIndex) => {
    const items = $$(":scope > li", ul).filter(li => li.querySelector(":scope > input[type=checkbox], :scope > p > input[type=checkbox]"));
    if (!items.length) return;
    ul.classList.add("checklist");
    items.forEach((li, i) => {
      const box = li.querySelector("input");
      const key = "check:" + pageKey + ":" + listIndex + ":" + i;
      box.disabled = false;
      box.checked = !!store(key);
      li.classList.toggle("done", box.checked);
      const label = el("label", "check-row");
      box.replaceWith(label);
      label.appendChild(box);
      label.appendChild(el("span", "check-mark"));
      const span = el("span", "check-text");
      while (label.nextSibling && !(label.nextSibling.nodeType === 1 && /^(UL|OL)$/.test(label.nextSibling.tagName))) span.appendChild(label.nextSibling);
      label.appendChild(span);
      box.addEventListener("change", () => {
        store(key, box.checked);
        li.classList.toggle("done", box.checked);
        if (box.checked && !reduceMotion) { li.classList.remove("pop"); void li.offsetWidth; li.classList.add("pop"); }
        updateProgress();
      });
    });
  });
  updateProgress();
}

function updateProgress() {
  const boxes = $$("#content .checklist input[type=checkbox]");
  let p = $("#content .progress");
  if (boxes.length < 4) { if (p) p.remove(); return; }
  const done = boxes.filter(b => b.checked).length;
  if (!p) {
    p = el("div", "progress",
      '<div class="progress-row"><span class="progress-text"></span>' +
      '<span class="progress-note">Saved on this device</span>' +
      '<button type="button" class="progress-clear">Clear all</button></div>' +
      '<div class="progress-track"><div class="progress-fill"></div></div>');
    const firstList = $("#content .checklist");
    const sec = firstList.closest(".sec") || firstList;
    sec.before(p);
    $(".progress-clear", p).addEventListener("click", () => {
      $$("#content .checklist input[type=checkbox]").forEach(b => { if (b.checked) { b.checked = false; b.dispatchEvent(new Event("change")); } });
    });
  }
  $(".progress-text", p).textContent = done + " of " + boxes.length + " done";
  $(".progress-fill", p).style.width = (100 * done / boxes.length) + "%";
  p.classList.toggle("is-complete", done === boxes.length);
}

function markReveals(root) {
  $$(".sec, .sec-steps ol > li, .checklist > li, figure.shot, .slides, details.accordion, .numbered-group, .callout, .table-wrap", root)
    .forEach(n => n.classList.add("reveal"));
}

function headingIds(root) {
  const used = {};
  $$("h2, h3, details.accordion > summary", root).forEach(h => {
    if (h.closest(".stage") && h.tagName === "H3") return;
    let id = slugify((h.querySelector(".acc-title") || h).textContent) || "section";
    used[id] = (used[id] || 0) + 1;
    if (used[id] > 1) id += "-" + used[id];
    (h.tagName === "SUMMARY" ? h.parentElement : h).id = id;
  });
}

/* ---------- on this page ---------- */
function buildToc(root) {
  const toc = $("#toc");
  toc.innerHTML = "";
  let targets = $$(".article-body h2", root);
  if (targets.length < 2) targets = targets.concat($$(".stage", root), $$("details.accordion", root));
  if (targets.length < 2) { document.body.classList.add("no-toc"); return; }
  document.body.classList.remove("no-toc");
  const links = targets.map(t => {
    const text = t.tagName === "DETAILS" ? (t.querySelector(".acc-title") || t.querySelector("summary")).textContent
      : t.classList.contains("stage") ? t.querySelector("h3").textContent : t.textContent;
    const a = el("a", "", esc(text));
    a.href = "#" + t.id;
    a.addEventListener("click", e => {
      e.preventDefault();
      if (t.tagName === "DETAILS") t.open = true;
      t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", "#" + t.id);
      const m = $("#toc-mobile");
      if (m) m.open = false;
    });
    return { a, t };
  });
  toc.appendChild(el("div", "toc-title", "On this page"));
  const list = el("div", "toc-list");
  links.forEach(({ a }) => list.appendChild(a));
  toc.appendChild(list);

  // Smaller screens: the same list, folded at the top of the page.
  const mob = el("details", "toc-mobile");
  mob.id = "toc-mobile";
  mob.appendChild(el("summary", "", "On this page <span>" + links.length + "</span>"));
  const mlist = el("div", "toc-list");
  links.forEach(({ a, t }) => {
    const b = a.cloneNode(true);
    b.addEventListener("click", e => { e.preventDefault(); a.click(); });
    mlist.appendChild(b);
  });
  mob.appendChild(mlist);
  $(".page-head", root).after(mob);

  // Highlight the section you're reading.
  function spy() {
    let cur = 0;
    links.forEach(({ t }, i) => { if (t.getBoundingClientRect().top < window.innerHeight * 0.45) cur = i; });
    links.forEach(({ a }, i) => a.classList.toggle("active", i === cur));
    $$("a", mlist).forEach((a, i) => a.classList.toggle("active", i === cur));
  }
  window.addEventListener("scroll", () => requestAnimationFrame(spy), { passive: true });
  spy();
}

/* ---------- gentle motion as things scroll into view ---------- */
function startReveals() {
  const items = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) { items.forEach(n => n.classList.add("in")); return; }
  document.documentElement.classList.add("motion");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const n = e.target;
      const sibs = n.parentElement ? $$(":scope > .reveal:not(.in)", n.parentElement) : [];
      n.style.transitionDelay = Math.min(sibs.indexOf(n), 6) * 50 + "ms";
      n.classList.add("in");
      io.unobserve(n);
    });
  }, { rootMargin: "0px 0px -6% 0px" });
  items.forEach(n => {
    if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add("in");
    else io.observe(n);
  });
}

/* ---------- arriving from search: mark the words and jump to the first one ---------- */
function highlightTerms(root, q) {
  const terms = q.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  if (!terms.length) return;
  const re = new RegExp("(" + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "ig");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) if (re.test(walker.currentNode.textContent)) nodes.push(walker.currentNode);
  nodes.forEach(t => {
    re.lastIndex = 0;
    const span = document.createElement("span");
    span.innerHTML = esc(t.textContent).replace(re, '<mark class="hit">$1</mark>');
    t.replaceWith(...span.childNodes);
  });
  const first = $("mark.hit", root);
  if (first) {
    const d = first.closest("details");
    if (d) d.open = true;
    setTimeout(() => first.scrollIntoView({ block: "center" }), 60);
  }
}

/* ---------- search ----------
   Every word typed must appear on the page. Each word scores 10 points if
   it's in the page title, plus 1 point per mention in the text (up to 5). */
function runSearch(q) {
  const box = $("#search-results");
  q = q.trim().toLowerCase();
  if (q.length < 2 || !index.loaded) { box.hidden = true; return; }
  const terms = q.split(/\s+/).map(t => t.length > 4 ? t.replace(/(ing|ed|es|s|e)$/, "") : t);
  const hits = index.pages.map(p => {
    const t = p.title.toLowerCase();
    let score = 0;
    for (const term of terms) {
      const inTitle = t.includes(term);
      const n = p.lower.split(term).length - 1;
      if (!n && !inTitle) return null;
      score += (inTitle ? 10 : 0) + Math.min(n, 5);
    }
    return { p, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8);
  if (!hits.length) { box.innerHTML = '<div class="sr-empty">No SOPs match "' + esc(q) + '".</div>'; box.hidden = false; return; }
  const re = new RegExp("(" + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "ig");
  box.innerHTML = hits.map(({ p }) => {
    const at = p.lower.indexOf(terms[0]);
    const start = Math.max(0, at - 50);
    let snip = at >= 0 ? (start ? "…" : "") + p.text.slice(start, at + 90) + "…" : "";
    snip = esc(snip).replace(re, "<mark>$1</mark>");
    return '<a class="sr" href="' + sopHref(currentRole, p.file) + "&q=" + encodeURIComponent(q) + '">' +
      '<span class="sr-sec">' + esc(p.group || "SOP") + "</span>" +
      '<span class="sr-title">' + esc(p.title) + "</span>" + (snip ? '<span class="sr-snip">' + snip + "</span>" : "") + "</a>";
  }).join("");
  box.hidden = false;
}
function closeSearch() { const b = $("#search-results"); if (b) b.hidden = true; }
function wireSearch() {
  const input = $("#search");
  let timer;
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => runSearch(input.value), 100); });
  input.addEventListener("focus", () => { if (input.value) runSearch(input.value); });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") { const a = $("#search-results .sr"); if (a) location.href = a.getAttribute("href"); }
    if (e.key === "Escape") { input.value = ""; closeSearch(); input.blur(); }
  });
  document.addEventListener("click", e => { if (!e.target.closest(".search")) closeSearch(); });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
}

let currentRole = "tech";

/* ---------- ROLE HOME (apprentice.html, tech.html, lead.html, supervisor.html) ---------- */
async function renderHub(role) {
  currentRole = role;
  buildShell(role);
  buildSidebar(role, null);
  wireSearch();
  document.body.classList.add("no-toc", "is-hub");
  document.title = "Start-Up SOPs · " + roleLabel(role);
  await loadIndex(role);

  const pages = index.pages;
  const featured = pages.filter(s => s.featured.includes(role));
  const rest = pages.filter(s => !s.featured.includes(role));
  const card = (s, big) =>
    '<a class="home-card reveal' + (big ? " is-featured" : "") + '" href="' + sopHref(role, s.file) + '">' +
      '<span class="home-card-top"><span class="home-card-kicker">' + esc(s.group || "SOP") + "</span>" +
      (s.count ? '<span class="home-card-count">' + esc(s.count) + "</span>" : "") + "</span>" +
      "<h3>" + esc(s.title) + "</h3>" +
      (s.blurb ? "<p>" + esc(s.blurb) + "</p>" : "") +
      '<span class="home-card-go" aria-hidden="true">Open <span>→</span></span></a>';

  // The job at a glance: stage names pulled from the lifecycle page.
  let strip = "";
  const life = pages.find(p => p.id === "start-up-lifecycle");
  if (life && life.md) {
    const names = (splitMeta(life.md).body.match(/^###\s+(.+)$/gm) || []).map(s => s.replace(/^###\s+/, "").trim());
    if (names.length) {
      strip = '<section class="home-block"><h2 class="home-label">The job at a glance</h2><ol class="glance">' +
        names.map((n, i) => '<li class="reveal"><a href="' + sopHref(role, life.file) + "#stage-" + slugify(n) + '"><span class="glance-n">' + (i + 1) + "</span>" + esc(n) + "</a></li>").join("") +
        "</ol></section>";
    }
  }

  const switchTo = (typeof ROLE_SWITCHER !== "undefined" && ROLE_SWITCHER[role]) || [];
  const roles = switchTo.length
    ? '<section class="home-block"><h2 class="home-label">See what each role sees</h2><div class="role-switcher">' +
      switchTo.map(r => '<a class="role-switch reveal" href="' + r + '.html"><span class="role-switch-name">' + esc(roleLabel(r)) +
        '<span class="role-switch-go" aria-hidden="true">→</span></span><span class="role-switch-desc">' + esc(ROLE_BLURBS[r] || "") + "</span></a>").join("") +
      "</div></section>"
    : "";
  const others = !switchTo.length && rest.length
    ? '<section class="home-block"><h2 class="home-label">Everything else</h2><div class="home-cards is-small">' + rest.map(s => card(s, false)).join("") + "</div></section>"
    : "";

  $("#content").innerHTML =
    '<section class="hero"><div class="hero-inner">' +
      '<p class="hero-kicker">NorCal Start-Up · ' + esc(roleLabel(role)) + " view</p>" +
      "<h1>Start-Up SOPs</h1>" +
      '<p class="hero-sub">' + esc(ROLE_BLURBS[role] || "") + "</p>" +
      '<div class="hero-actions"><button class="hero-search" type="button" id="hero-search">Search ' + pages.length + " SOPs <kbd>/</kbd></button>" +
      extrasFor(role).map(e => '<a class="hero-btn" href="' + esc(e.url) + '" target="_blank" rel="noopener">' + esc(e.label) + "</a>").join("") + "</div>" +
    "</div></section>" +
    '<div class="home">' +
      (featured.length ? '<section class="home-block"><h2 class="home-label">Most relevant to you</h2><div class="home-cards">' + featured.map(s => card(s, true)).join("") + "</div></section>" : "") +
      strip + roles + others +
      (!pages.length ? "<p>No SOPs are assigned to this view yet.</p>" : "") +
    "</div>";
  $("#hero-search").addEventListener("click", () => $("#search").focus());
  startReveals();
}

/* ---------- ONE SOP (sop.html?role=...&file=...) ---------- */
async function renderSopPage() {
  const role = getQueryParam("role") || "tech";
  const file = getQueryParam("file");
  currentRole = role;
  buildShell(role);
  buildSidebar(role, file);
  wireSearch();
  loadIndex(role);

  const main = $("#content");
  const entry = SOP_LIBRARY.find(s => s.file === file);
  if (!entry) {
    main.innerHTML = '<article class="article"><div class="page-head"><h1>Page not found</h1></div>' +
      '<p>This SOP isn\'t in the menu. Pick one from the list, or <a href="' + role + '.html">go back to the ' + esc(roleLabel(role)) + " home</a>.</p></article>";
    document.title = "Not found · Start-Up SOPs";
    return;
  }

  let md;
  try { md = await getText(file); }
  catch (err) {
    main.innerHTML = '<article class="article"><div class="page-head"><h1>Couldn\'t load this page</h1></div>' +
      "<p>The file <code>" + esc(file) + "</code> wasn't found (" + esc(err.message) + "). Check that it's in the sops folder and the name matches exactly.</p></article>";
    return;
  }

  const { title, meta, body } = splitMeta(md);
  const type = (meta.type || "").toLowerCase();
  const shown = title || entry.title;
  pageKey = entry.id || file;
  document.title = shown + " · Start-Up SOPs";

  const art = el("article", "article type-" + (slugify(type) || "page"));
  const count = countFor(meta, body);
  const roles = entry.roles.filter(r => r !== "supervisor").map(roleLabel);
  art.innerHTML =
    '<header class="page-head">' +
      '<div class="crumbs"><a href="' + role + '.html">' + esc(roleLabel(role)) + " view</a><span>" + esc(entry.group || "SOP") + "</span></div>" +
      "<h1>" + esc(shown) + "</h1>" +
      '<div class="meta-row">' +
        (count ? '<span class="chip chip-count">' + esc(count) + "</span>" : "") +
        (roles.length ? '<span class="chip">For ' + esc(roles.join(", ")) + "</span>" : "") +
        '<a class="edit-link" target="_blank" rel="noopener" href="https://github.com/' + REPO + "/edit/" + BRANCH + "/" + esc(file) + '">Edit this page</a>' +
      "</div>" +
    "</header>";
  const box = el("div", "article-body", renderMarkdown(body));
  art.appendChild(box);

  styleCallouts(box);
  styleImages(box);
  wrapTables(box);
  styleLinks(box);
  wrapSections(box);
  if (type === "timeline") buildTimeline(box);
  continueNumbers(box);
  buildTiles(box);
  buildTagRows(box);
  buildChips(box);
  if (type === "reference") buildReferenceAccordions(box);
  headingIds(box);

  // Previous / next, in menu order.
  const list = visibleFor(role);
  const i = list.indexOf(entry);
  const prev = list[i - 1], next = list[i + 1];
  if (i >= 0 && (prev || next)) {
    const pn = el("nav", "prev-next");
    pn.setAttribute("aria-label", "Previous and next SOP");
    pn.innerHTML = (prev ? '<a class="pn prev" href="' + sopHref(role, prev.file) + '"><small>← Previous</small>' + esc(prev.title) + "</a>" : "<span></span>") +
                   (next ? '<a class="pn next" href="' + sopHref(role, next.file) + '"><small>Next →</small>' + esc(next.title) + "</a>" : "<span></span>");
    art.appendChild(pn);
  }

  main.innerHTML = "";
  main.appendChild(art);
  buildChecklists(box);
  if (type === "form" && window.buildForm) buildForm(box, { pageKey: pageKey, group: slugify(entry.group || "forms"), title: shown });
  markReveals(box);
  buildToc(main);

  const q = getQueryParam("q");
  if (q) highlightTerms(box, q);
  else if (location.hash) {
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) { if (t.tagName === "DETAILS") t.open = true; setTimeout(() => t.scrollIntoView({ block: t.classList.contains("stage") ? "center" : "start" }), 60); }
  }
  startReveals();
}
