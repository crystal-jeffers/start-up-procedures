/* Starts the page. The data-role on this file's script tag says which view to show. */
(function () {
  var role = document.currentScript && document.currentScript.getAttribute("data-role");
  if (typeof SOP_LIBRARY === "undefined" || typeof renderHub === "undefined") {
    if (window.showSiteProblem) window.showSiteProblem("assets/nav-config.js or assets/render.js", 0, "The SOPs couldn't start because one of these files is missing or has a mistake.");
    return;
  }
  if (role) renderHub(role); else renderSopPage();
})();
