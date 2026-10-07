/* =========================================================================
   RENDER.JS — the "engine." You should not need to edit this file.
   All customization happens in nav-config.js.
   ========================================================================= */

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- HOMEPAGE (one per role: apprentice.html, tech.html, etc.) ---------- */
function renderHub(role) {
  document.getElementById("role-tag").textContent = ROLE_LABELS[role] + " View";
  document.title = "SOPs — " + ROLE_LABELS[role];

  const extrasRow = document.getElementById("extras-row");
  const extras = ROLE_EXTRAS[role] || [];
  extras.forEach(e => {
    const a = document.createElement("a");
    a.href = "sop.html?role=" + role + "&file=" + encodeURIComponent(e.file);
    a.textContent = e.label;
    extrasRow.appendChild(a);
  });

  const visible = SOP_LIBRARY.filter(s => s.roles.includes(role));
  const featured = visible.filter(s => s.featured.includes(role));
  const rest = visible.filter(s => !s.featured.includes(role));

  const headerMenu = document.getElementById("jump-nav-menu");
  const headerToggle = document.getElementById("jump-nav-toggle");
  if (headerMenu && headerToggle) {
    if (!visible.length) {
      headerToggle.style.display = "none";
    } else {
      visible.forEach(s => {
        const a = document.createElement("a");
        a.href = "sop.html?role=" + role + "&file=" + encodeURIComponent(s.file);
        a.textContent = s.title;
        headerMenu.appendChild(a);
      });
      headerToggle.addEventListener("click", () => headerMenu.classList.toggle("open"));
    }
  }

  const container = document.getElementById("sop-list");

  function addCard(sop, isFeatured) {
    const a = document.createElement("a");
    a.href = "sop.html?role=" + role + "&file=" + encodeURIComponent(sop.file);
    a.className = "sop-card" + (isFeatured ? " featured" : "");
    a.innerHTML = '<div class="sop-title">' + sop.title + "</div>";
    container.appendChild(a);
  }

  if (featured.length) {
    const label = document.createElement("div");
    label.className = "section-label";
    label.textContent = "Most relevant to you";
    container.appendChild(label);
    featured.forEach(s => addCard(s, true));
  }

  // Roles with a role switcher (see ROLE_SWITCHER in nav-config.js) show
  // buttons for the other role views instead of "All other SOPs".
  const switchTo = (typeof ROLE_SWITCHER !== "undefined" && ROLE_SWITCHER[role]) || null;
  if (switchTo && switchTo.length) {
    // Extra space above the role buttons. Change 1.5rem to adjust.
    const gap = document.createElement("div");
    gap.style.height = "1.5rem";
    container.appendChild(gap);
    const label3 = document.createElement("div");
    label3.className = "section-label";
    label3.textContent = "See what each role sees";
    container.appendChild(label3);
    const grid = document.createElement("div");
    grid.className = "role-switcher";
    switchTo.forEach(r => {
      const a = document.createElement("a");
      a.href = r + ".html";
      a.className = "role-switch";
      a.textContent = ROLE_LABELS[r];
      grid.appendChild(a);
    });
    container.appendChild(grid);
  } else if (rest.length) {
    const label2 = document.createElement("div");
    label2.className = "section-label";
    label2.textContent = "All other SOPs";
    container.appendChild(label2);
    rest.forEach(s => addCard(s, false));
  }

  if (!visible.length && !switchTo) {
    container.innerHTML = "<p>No SOPs assigned to this view yet.</p>";
  }
}

/* ---------- Extra blank lines in a .md file = extra space on the page ----------
   Markdown normally collapses blank lines. Here, every blank line beyond the
   first one becomes a spacer, so adding blank lines in the file adds space. */
function addSpacers(md) {
  return md.replace(/\r\n/g, "\n").replace(/\n[ \t]*\n((?:[ \t]*\n)+)/g, (m, extra) => {
    const count = (extra.match(/\n/g) || []).length;
    return "\n\n" + '<div class="md-spacer" style="height:1rem"></div>\n\n'.repeat(count);
  });
}

/* ---------- SOP CONTENT PAGE (sop.html) ---------- */
async function renderSopPage() {
  const role = getQueryParam("role") || "tech";
  const file = getQueryParam("file");
  const contentDiv = document.getElementById("sop-content");

  document.getElementById("role-tag").textContent = (ROLE_LABELS[role] || "") + " View";
  document.getElementById("back-link").href = role + ".html";

  const entry = SOP_LIBRARY.find(s => s.file === file) ||
                Object.values(ROLE_EXTRAS).flat().find(e => e.file === file);

  if (!entry) {
    contentDiv.innerHTML = "<p>SOP not found.</p>";
    return;
  }

  document.title = entry.title || entry.label;

  let mdText;
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(res.status);
    mdText = await res.text();
  } catch (err) {
    contentDiv.innerHTML = "<p><strong>Couldn't load this page.</strong> The file <code>" + file +
      "</code> wasn't found (" + err.message + "). Check that it's in the right folder and the name matches exactly.</p>";
    return;
  }

  const html = marked.parse(addSpacers(mdText), { breaks: true });
  contentDiv.innerHTML = html;
  enhanceContent(contentDiv);

  // Render any Mermaid flowchart blocks embedded in the SOP's markdown
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: false, theme: "neutral" });
    mermaid.run({ querySelector: ".mermaid" });
  }

  if (entry.pdf) {
    const link = document.createElement("a");
    link.className = "pdf-download";
    link.href = entry.pdf;
    link.textContent = "⬇ Download desktop PDF version";
    contentDiv.appendChild(link);
  }

  const headings = contentDiv.querySelectorAll("h2, h3");
  const menu = document.getElementById("jump-nav-menu");
  const toggle = document.getElementById("jump-nav-toggle");

  if (!headings.length) {
    toggle.style.display = "none";
  } else {
    headings.forEach((h, i) => {
      const id = "section-" + i;
      h.id = id;
      const a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = (h.tagName === "H3" ? "\u2003" : "") + h.textContent;
      a.addEventListener("click", () => menu.classList.remove("open"));
      menu.appendChild(a);
    });
    toggle.addEventListener("click", () => menu.classList.toggle("open"));
  }
}

/* ---------- Page polish: scrollable tables + tap-to-enlarge images ----------
   Styles live here (not in style.css) so nothing needs to be pasted. */
function injectEnhanceStyles() {
  if (document.getElementById("enhance-styles")) return;
  const css = `
    #sop-content .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 1rem 0; }
    #sop-content .table-scroll table { min-width: 560px; }
    #sop-content th, #sop-content td { overflow-wrap: normal; word-break: normal; hyphens: none; }
    #sop-content img { cursor: zoom-in; }
    #sop-content .align-left { text-align: left !important; }
    #sop-content .align-center { text-align: center !important; }
    #sop-content .align-right { text-align: right !important; }
    .lightbox { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.88);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: env(safe-area-inset-top, 0px) 0.75rem env(safe-area-inset-bottom, 0px); cursor: zoom-out; }
    .lightbox img { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 6px; background: #fff; }
    .lightbox p { color: #fff; margin: 0.75rem 0 0; font-size: 0.95rem; text-align: center; }
    .lightbox .lb-close { position: absolute; top: calc(env(safe-area-inset-top, 0px) + 0.5rem); right: 0.75rem;
      background: none; border: 0; color: #fff; font-size: 2rem; line-height: 1; min-width: 44px; min-height: 44px; cursor: pointer; }
  `;
  const style = document.createElement("style");
  style.id = "enhance-styles";
  style.textContent = css;
  document.head.appendChild(style);
}

function enhanceContent(root) {
  injectEnhanceStyles();

  // Every table scrolls sideways inside its own box instead of squeezing words.
  root.querySelectorAll("table").forEach(t => {
    if (t.parentElement && t.parentElement.classList.contains("table-scroll")) return;
    const wrap = document.createElement("div");
    wrap.className = "table-scroll";
    t.parentNode.insertBefore(wrap, t);
    wrap.appendChild(t);
  });

  // Tap or click any image to see it full screen; tap again (or Esc) to close.
  root.querySelectorAll("img").forEach(img => {
    img.addEventListener("click", () => openLightbox(img));
  });
}

function openLightbox(img) {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", img.alt || "Image");
  const big = document.createElement("img");
  big.src = img.src;
  big.alt = img.alt || "";
  const cap = img.closest("figure") && img.closest("figure").querySelector("figcaption");
  const close = document.createElement("button");
  close.className = "lb-close";
  close.setAttribute("aria-label", "Close");
  close.textContent = "\u00d7";
  box.appendChild(close);
  box.appendChild(big);
  if (cap) { const p = document.createElement("p"); p.textContent = cap.textContent; box.appendChild(p); }
  function shut() { box.remove(); document.removeEventListener("keydown", onKey); }
  function onKey(e) { if (e.key === "Escape") shut(); }
  box.addEventListener("click", shut);
  document.addEventListener("keydown", onKey);
  document.body.appendChild(box);
  close.focus();
}
