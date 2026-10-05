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
    id: "sop-templates",
    title: "Editing the SOP Checklist",
    file: "sops/supervisor-sop-templates.md",
    roles: ["supervisor"],
    featured: ["supervisor"]
  },
  {
    id: "view-only-schedule",
    title: "Reading the Crew Schedule",
    file: "sops/view-only-schedule.md",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: ["apprentice"]
  },

  /* ---------- Start-up procedures ---------- */
  {
    id: "start-up-lifecycle",
    title: "Start-Up Lifecycle",
    file: "sops/start-up-lifecycle.md",
    roles: ["tech", "lead", "supervisor"],
    featured: ["tech", "lead"]
  },
  {
    id: "admin-info",
    title: "Admin Info",
    file: "sops/admin-info.md",
    roles: ["lead", "supervisor"],
    featured: ["lead"]
  },
  {
    id: "field-tasking",
    title: "Field Tasking",
    file: "sops/field-tasking.md",
    roles: ["lead", "supervisor"],
    featured: ["lead"]
  },
  {
    id: "pre-start",
    title: "Pre-Start",
    file: "sops/pre-start.md",
    roles: ["tech", "lead", "supervisor"],
    featured: ["tech", "lead"]
  },
  {
    id: "start-up",
    title: "Start-Up",
    file: "sops/start-up.md",
    roles: ["tech", "lead", "supervisor"],
    featured: ["tech", "lead"]
  },
  {
    id: "commissioning",
    title: "Commissioning",
    file: "sops/commissioning.md",
    roles: ["tech", "lead", "supervisor"],
    featured: ["tech", "lead"]
  },
  {
    id: "best-practices",
    title: "Best Practices",
    file: "sops/best-practices.md",
    roles: ["tech", "lead", "supervisor"],
    featured: []
  },
  {
    id: "contacts",
    title: "Contacts",
    file: "sops/contacts.md",
    roles: ["tech", "lead", "supervisor"],
    featured: []
  }
];

// Full label shown in the sticky header for each role
const ROLE_LABELS = {
  apprentice: "Apprentice",
  tech: "Technician",
  lead: "Lead Technician",
  supervisor: "Supervisor",
  pm: "Project Manager"
};

// Extra shortcut buttons that appear ONLY in a given role's sticky header.
// Leave the array empty ( [] ) for a role with no extra shortcuts.
const ROLE_EXTRAS = {
  apprentice: [],
  tech: [],
  lead: [],
  supervisor: [
    { label: "Dispatch board", file: "sops/supervisor-dispatch-board.md" }
  ],
  pm: []
};

// Role switcher: roles listed here show buttons for these other role views
// in place of the "All other SOPs" list.
const ROLE_SWITCHER = {
  supervisor: ["apprentice", "tech", "lead", "pm"]
};
