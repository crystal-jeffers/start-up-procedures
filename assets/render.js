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

  if (rest.length) {
    const label2 = document.createElement("div");
    label2.className = "section-label";
    label2.textContent = "All other SOPs";
    container.appendChild(label2);
    rest.forEach(s => addCard(s, false));
  }

  if (!visible.length) {
    container.innerHTML = "<p>No SOPs assigned to this view yet.</p>";
  }
}

/* ---------- SOP CONTENT PAGE (sop.html) ---------- */
async function renderSopPage() {
  const role = getQueryParam("role") || "tech";
  const file = getQueryParam("file");

  document.getElementById("role-tag").textContent = ROLE_LABELS[role] + " View";
  document.getElementById("back-link").href = role + ".html";

  const entry = SOP_LIBRARY.find(s => s.file === file) ||
                Object.values(ROLE_EXTRAS).flat().find(e => e.file === file);

  if (!entry) {
    document.getElementById("sop-content").innerHTML = "<p>SOP not found.</p>";
    return;
  }

  document.title = entry.title || entry.label;

  const res = await fetch(file);
  const mdText = await res.text();
  const html = marked.parse(mdText);
  const contentDiv = document.getElementById("sop-content");
  contentDiv.innerHTML = html;

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
