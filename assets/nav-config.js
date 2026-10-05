/* =========================================================================
   NAV-CONFIG.JS
   This is the ONLY file most people will ever need to touch.

   It controls: (1) which SOPs exist, (2) which roles can see each one,
   (3) which SOPs are "featured" (shown first) for each role, and
   (4) extra shortcut buttons that only appear for certain roles.

   HOW TO ADD A NEW SOP:
   1. Save your SOP as a .md file inside the /sops folder.
   2. Copy one of the blocks below, paste it into SOP_LIBRARY, and edit it.
   3. Save. That's it — no other file needs to change.
   ========================================================================= */

const SOP_LIBRARY = [
  /* ---------- Supervisor: Airtable dispatch + job tracking guides ---------- */
  {
    id: "dispatch-board",
    title: "Dispatch Board (Timeline & Calendar)",
    file: "sops/supervisor-dispatch-board.md",
    roles: ["supervisor"],
    featured: ["supervisor"]
  },
  {
    id: "job-tracking",
    title: "Job Tracker & Checklists",
    file: "sops/supervisor-job-tracking.md",
    roles: ["supervisor"],
    featured: ["supervisor"]
  },
  {
