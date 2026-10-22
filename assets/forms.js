/* =========================================================================
   FORMS.JS: fillable record forms ("Type: Form" pages).
   Writers never need to touch this file. In a page, type:
     [[Label]]                 a text box
     [[Label: date]]           also: time, datetime, number, long (a big box)
     [[Label: shared]]         the same value on every form (System ID, ...)
     [[Label: = {A} - {B}]]    worked out from other boxes; dates give hours
     [[= avg]]                 in a table row: the average of that row
     ..., min 12  /  , max 11  /  , within 20   adds a pass or check flag
   In a table, [[]] or [[: number]] makes a box labeled by its row and column.
   Everything is saved on this device, like the checklists.
   ========================================================================= */
(function () {
  const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9%]+/g, "");
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const save = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); if (v === "") localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } };
  const TYPES = { date: "date", time: "time", datetime: "datetime-local", number: "number", long: "long", text: "text" };

  /* A tiny calculator: numbers, + - * / and brackets. No eval. */
  function calc(expr) {
    const t = expr.match(/\d*\.?\d+|[-+*/()]/g) || [];
    let i = 0;
    const num = () => {
      const x = t[i++];
      if (x === "(") { const v = add(); i++; return v; }
      if (x === "-") return -num();
      const v = parseFloat(x); if (isNaN(v)) throw 0; return v;
    };
    const mul = () => { let v = num(); while (t[i] === "*" || t[i] === "/") { const o = t[i++]; const r = num(); v = o === "*" ? v * r : v / r; } return v; };
    const add = () => { let v = mul(); while (t[i] === "+" || t[i] === "-") { const o = t[i++]; const r = mul(); v = o === "+" ? v + r : v - r; } return v; };
    const v = add(); return isFinite(v) ? v : NaN;
  }

  window.buildForm = function (root, ctx) {
    const page = ctx.pageKey, group = ctx.group || "forms";
    const fields = {}; // norm label -> {input, label, shared}
    const calcs = [];
    const keyFor = (label, shared) => "form:" + (shared ? group : page) + ":" + norm(label);

    function makeField(spec, autoLabel) {
      // spec: "Label: type | flag"
      let [main, flag] = spec.split(/\s*\|\s*|,\s*(?=(?:min|max|within)\s)/).map(s => (s || "").trim());
      let label = main, type = "text", formula = null, shared = false;
      const c = main.indexOf(":");
      if (c >= 0) { label = main.slice(0, c).trim(); const rest = main.slice(c + 1).trim(); if (rest.startsWith("=")) formula = rest.slice(1).trim(); else rest.split(/\s+/).forEach(w => { if (w === "shared") shared = true; else if (TYPES[w]) type = w; }); }
      else if (main.startsWith("=")) { label = ""; formula = main.slice(1).trim(); }
      if (!label) label = autoLabel || "Entry";
      const wrap = document.createElement("span");
      wrap.className = "field" + (formula ? " field-calc" : "") + (type === "long" ? " field-long" : "") + (autoLabel ? " field-cell" : "");
      let input;
      if (formula) {
        input = document.createElement("output");
        input.className = "calc-out";
      } else if (type === "long") {
        input = document.createElement("textarea"); input.rows = 3;
      } else {
        input = document.createElement("input"); input.type = TYPES[type];
        if (type === "number") { input.inputMode = "decimal"; input.step = "any"; }
      }
      input.setAttribute("aria-label", label);
      if (!autoLabel) {
        const cap = document.createElement("span"); cap.className = "field-label"; cap.textContent = label;
        wrap.appendChild(cap);
      }
      wrap.appendChild(input);
      const f = { input, label, shared, formula, flag, wrap, cell: !!autoLabel };
      fields[norm(label)] = f;
      if (formula) calcs.push(f);
      else {
        const k = keyFor(label, shared);
        input.value = save(k) || "";
        input.addEventListener("input", () => { save(k, input.value); if (shared) document.querySelectorAll("[data-shared='" + norm(label) + "']").forEach(o => { if (o !== input) o.value = input.value; }); recalc(); });
        if (shared) input.dataset.shared = norm(label);
      }
      return wrap;
    }

    function valueOf(label) {
      const f = fields[norm(label)];
      let v = f && !f.formula ? f.input.value : f ? f.input.dataset.value : save("form:" + group + ":" + norm(label));
      if (v == null || v === "") return NaN;
      if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).getTime() / 3.6e6; // hours
      return parseFloat(v);
    }
    function recalc() {
      calcs.forEach(f => {
        let v;
        if (/^avg$/i.test(f.formula)) {
          const row = f.wrap.closest("tr");
          const nums = row ? Array.from(row.querySelectorAll("input")).map(i => parseFloat(i.value)).filter(n => !isNaN(n)) : [];
          v = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : NaN;
        } else {
          let missing = false;
          const expr = f.formula.replace(/\{([^}]+)\}/g, (m, l) => { const n = valueOf(l); if (isNaN(n)) missing = true; return "(" + n + ")"; });
          v = missing ? NaN : calc(expr);
        }
        const out = f.input;
        out.dataset.value = isNaN(v) ? "" : String(Math.round(v * 100) / 100);
        out.textContent = isNaN(v) ? "—" : String(Math.round(v * 100) / 100);
        let flag = f.wrap.querySelector(".calc-flag");
        if (f.flag) {
          const m = f.flag.match(/^(min|max|within)\s+([\d.]+)/i);
          if (!flag) { flag = document.createElement("span"); f.wrap.appendChild(flag); }
          let ok = null;
          if (m && !isNaN(v)) { const n = parseFloat(m[2]); const k = m[1].toLowerCase(); ok = k === "min" ? v >= n : k === "max" ? v <= n : Math.abs(v) <= n; }
          const want = m ? ({ min: "at least ", max: "at most ", within: "within ±" })[m[1].toLowerCase()] + m[2] : "";
          flag.className = "calc-flag" + (ok === true ? " is-ok" : ok === false ? " is-off" : "");
          flag.textContent = ok === null ? "Needs " + want : ok ? "Meets " + want : "Outside " + want;
        }
      });
    }

    // Tables: each cell knows its column name, so rows can stack as cards on a phone
    root.querySelectorAll("table").forEach(t => {
      if (!/\[\[/.test(t.textContent)) return;
      t.classList.add("form-table");
      const head = t.querySelector("thead tr");
      const names = head ? Array.from(head.children).map(c => c.textContent.trim()) : [];
      t.querySelectorAll("tbody tr").forEach(tr => Array.from(tr.children).forEach((td, i) => { if (i && names[i]) td.dataset.col = names[i]; if (!td.textContent.trim()) td.classList.add("is-empty"); }));
    });

    // Swap [[...]] in the page text for boxes
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const hits = [];
    while (walker.nextNode()) if (/\[\[[^\]]*\]\]/.test(walker.currentNode.nodeValue)) hits.push(walker.currentNode);
    hits.forEach(node => {
      const cell = node.parentNode.closest && node.parentNode.closest("td");
      let auto = null;
      if (cell) {
        const row = cell.parentNode, table = cell.closest("table");
        const col = Array.prototype.indexOf.call(row.children, cell);
        const head = table.querySelector("thead tr") || table.querySelector("tr");
        auto = (row.children[0].textContent.trim() + " " + (head && head.children[col] ? head.children[col].textContent.trim() : "")).trim();
      }
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\[\[[^\]]*\]\])/).forEach(part => {
        const m = part.match(/^\[\[([^\]]*)\]\]$/);
        if (m) frag.appendChild(makeField(m[1].trim(), auto));
        else if (part.trim()) frag.appendChild(document.createTextNode(part));
      });
      node.replaceWith(frag);
    });
    // Line breaks between boxes aren't needed: boxes stack on their own
    root.querySelectorAll(".field + br, br + .field").forEach(n => { if (n.tagName === "BR") n.remove(); else if (n.previousSibling && n.previousSibling.tagName === "BR") n.previousSibling.remove(); });
    root.querySelectorAll("p").forEach(p => { if (p.querySelector(".field") && !p.textContent.replace(/\s/g, "").length) p.classList.add("field-group"); else if (p.querySelector(".field")) p.classList.add("field-group"); });
    // A box inside a checklist item sits under the item, not inside its tick area
    root.querySelectorAll(".checklist li").forEach(li => {
      const text = li.querySelector(":scope > .check-row .check-text");
      if (!text) return;
      const boxes = Array.from(text.querySelectorAll(".field"));
      if (!boxes.length) return;
      const g = document.createElement("div"); g.className = "field-group in-item";
      boxes.forEach(b => g.appendChild(b));
      text.querySelectorAll("br").forEach(b => { if (!b.nextSibling || b.nextSibling.nodeType !== 3 || !b.nextSibling.nodeValue.trim()) b.remove(); });
      li.appendChild(g);
    });

    // Every activity gets "Performed by" initials and a date. Ticking fills them in.
    const lastInit = "form:initials";
    root.querySelectorAll(".checklist > li").forEach((li, i) => {
      const box = li.querySelector(":scope > .check-row input[type=checkbox]");
      if (!box) return;
      const row = document.createElement("div"); row.className = "performed";
      const ini = document.createElement("input"); ini.type = "text"; ini.maxLength = 6; ini.placeholder = "Initials"; ini.setAttribute("aria-label", "Performed by (initials)");
      const dt = document.createElement("input"); dt.type = "date"; dt.setAttribute("aria-label", "Date performed");
      const kI = "form:" + page + ":by" + i, kD = "form:" + page + ":on" + i;
      ini.value = save(kI) || ""; dt.value = save(kD) || "";
      ini.addEventListener("input", () => { save(kI, ini.value); if (ini.value) save(lastInit, ini.value); });
      dt.addEventListener("input", () => save(kD, dt.value));
      box.addEventListener("change", () => {
        if (!box.checked) return;
        if (!dt.value) { dt.value = today(); save(kD, dt.value); }
        if (!ini.value && save(lastInit)) { ini.value = save(lastInit); save(kI, ini.value); }
      });
      const lab = document.createElement("span"); lab.className = "performed-label"; lab.textContent = "Performed by";
      row.append(lab, ini, dt);
      li.appendChild(row);
    });

    // Each "## Section" folds open and closed. The first one starts open.
    root.querySelectorAll(":scope > .sec").forEach((sec, n) => {
      const h = sec.querySelector(":scope > h2"); if (!h) return;
      const d = document.createElement("details"); d.className = "accordion form-sec"; d.open = n === 0;
      if (h.id) d.id = h.id;
      const sum = document.createElement("summary");
      const checks = sec.querySelectorAll(".checklist input[type=checkbox]");
      sum.innerHTML = '<span class="acc-n">' + String(n + 1).padStart(2, "0") + '</span><span class="acc-title"></span>' + (checks.length ? '<span class="acc-count"></span>' : "");
      sum.querySelector(".acc-title").textContent = h.textContent;
      h.remove();
      const body = document.createElement("div"); body.className = "accordion-body";
      while (sec.firstChild) body.appendChild(sec.firstChild);
      d.append(sum, body);
      sec.replaceWith(d);
      if (checks.length) {
        const cnt = sum.querySelector(".acc-count");
        const upd = () => { const done = Array.from(checks).filter(c => c.checked).length; cnt.textContent = done + " of " + checks.length; d.classList.toggle("is-complete", done === checks.length); };
        checks.forEach(c => c.addEventListener("change", upd)); upd();
      }
    });
    recalc();

    // The toolbar: Save as PDF, Email, Clear form
    const bar = document.createElement("div"); bar.className = "form-bar";
    bar.innerHTML = '<button type="button" class="form-btn fb-pdf">Save as PDF</button><button type="button" class="form-btn fb-mail">Email</button><button type="button" class="form-btn fb-clear">Clear form</button><span class="form-note">Saved on this device</span>';
    const head = root.closest("article").querySelector(".page-head");
    head.after(bar);

    bar.querySelector(".fb-pdf").addEventListener("click", () => window.print());
    window.addEventListener("beforeprint", () => root.querySelectorAll("details").forEach(d => { d.dataset.wasOpen = d.open ? "1" : ""; d.open = true; }));
    window.addEventListener("afterprint", () => root.querySelectorAll("details").forEach(d => { if (d.dataset.wasOpen !== undefined) d.open = !!d.dataset.wasOpen; }));

    bar.querySelector(".fb-mail").addEventListener("click", () => {
      const sysId = (fields[norm("System ID")] && fields[norm("System ID")].input.value) || "";
      const lines = [ctx.title + " record" + (sysId ? ", " + sysId : ""), ""];
      root.querySelectorAll(":scope > details.form-sec").forEach(d => {
        lines.push(d.querySelector(".acc-title").textContent.toUpperCase());
        d.querySelectorAll(".accordion-body > *").forEach(n => {
          if (n.matches("ul.checklist")) n.querySelectorAll(":scope > li").forEach(li => {
            const c = li.querySelector("input[type=checkbox]"), p = li.querySelectorAll(".performed input");
            const t = li.querySelector(".check-text").textContent.trim().replace(/\s+/g, " ");
            lines.push((c && c.checked ? "[x] " : "[ ] ") + t + (p[0] && (p[0].value || p[1].value) ? " (" + [p[0].value, p[1].value].filter(Boolean).join(", ") + ")" : ""));
            li.querySelectorAll(".field").forEach(f => lines.push("    " + fieldText(f)));
          });
          else n.querySelectorAll ? n.querySelectorAll(".field:not(.field-cell)").forEach(f => { if (!f.closest(".checklist")) lines.push(fieldText(f)); }) : 0;
          if (n.querySelector && n.querySelector("table") || (n.matches && n.matches(".table-wrap, table"))) {
            (n.matches("table") ? n : n.querySelector("table")).querySelectorAll("tbody tr").forEach(tr => {
              const cells = Array.from(tr.children).map(td => { const i = td.querySelector("input, output"); return i ? (i.value || i.textContent || "") : td.textContent.trim(); });
              lines.push(cells.join(" | "));
            });
          }
        });
        lines.push("");
      });
      let body = lines.join("\n");
      if (body.length > 1700) body = body.slice(0, 1700) + "\n...\n(Too long for one email. Attach the PDF for the full record.)";
      const subject = "Clean and Flush: " + ctx.title + (sysId ? " for " + sysId : "");
      location.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
    function fieldText(f) {
      const lab = f.querySelector(".field-label"), i = f.querySelector("input, textarea, output");
      const flag = f.querySelector(".calc-flag");
      return (lab ? lab.textContent : i.getAttribute("aria-label")) + ": " + ((i.value !== undefined && i.tagName !== "OUTPUT" ? i.value : i.textContent) || "") + (flag && flag.classList.contains("is-off") ? " (" + flag.textContent + ")" : "");
    }

    bar.querySelector(".fb-clear").addEventListener("click", () => {
      if (!window.confirm("Clear everything on this form? Shared details (System ID, description, and volume) stay, so the next form still has them.")) return;
      Object.keys(localStorage).forEach(k => { if (k.indexOf("form:" + page + ":") === 0 || k.indexOf("check:" + page + ":") === 0) localStorage.removeItem(k); });
      location.reload();
    });
  };
})();
