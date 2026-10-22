/* =========================================================================
   NAV-CONFIG.JS
   This is the ONLY file most people will ever need to touch.

   It controls: (1) which SOPs exist, (2) which roles can see each one,
   (3) which SOPs are "featured" (shown first) for each role, and
   (4) the menu group each SOP sits in.

   HOW TO ADD A NEW SOP:
   1. Save your SOP as a .md file inside the /sops folder.
   2. Copy one of the blocks below, paste it into SOP_LIBRARY, and edit it.
   3. Save. That's it. The menu, search, and home cards update on their own.

   The order of SOP_LIBRARY is the order of the left menu and of the
   Previous / Next buttons at the bottom of each page.
   ========================================================================= */

const SOP_LIBRARY = [
  /* ---------- Supervisor: Airtable dispatch + job tracking guides ---------- */
  {
    id: "dispatch-board",
    title: "Dispatch Board",
    blurb: "Book, move, and split assignments on the Airtable timeline.",
    file: "sops/supervisor-dispatch-board.md",
    group: "Supervisor tools",
    roles: ["supervisor"],
    featured: ["supervisor"]
  },
  {
    id: "job-tracking",
    title: "Job Tracker & Checklists",
    blurb: "Job status, schedule pace, and the per-job SOP checklist.",
    file: "sops/supervisor-job-tracking.md",
    group: "Supervisor tools",
    roles: ["supervisor"],
    featured: ["supervisor"]
  },
  {
    id: "sop-templates",
    title: "Editing the SOP Checklist",
    blurb: "Change the master list every new job copies.",
    file: "sops/supervisor-sop-templates.md",
    group: "Supervisor tools",
    roles: ["supervisor"],
    featured: ["supervisor"]
  },

  /* ---------- Start-up procedures ---------- */
  {
    id: "start-up-lifecycle",
    title: "Start-Up Lifecycle",
    blurb: "The whole job in five stages, from kickoff to warranty.",
    file: "sops/start-up-lifecycle.md",
    group: "The start-up process",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: ["apprentice", "tech", "lead"]
  },
  {
    id: "admin-info",
    title: "Admin Info",
    blurb: "Everything to collect from the PM team before work starts.",
    file: "sops/admin-info.md",
    group: "The start-up process",
    roles: ["lead", "supervisor"],
    featured: ["lead"]
  },
  {
    id: "pre-start",
    title: "Pre-Start",
    blurb: "Set the crew, the plan, and the paperwork before startup.",
    file: "sops/pre-start.md",
    group: "The start-up process",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: ["tech", "lead"]
  },
  {
    id: "start-up",
    title: "Start-Up",
    blurb: "From final inspection to turnover, in order.",
    file: "sops/start-up.md",
    group: "The start-up process",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: ["tech", "lead"]
  },
  {
    id: "commissioning",
    title: "Commissioning",
    blurb: "Functional testing with the Cx agent, when it's in scope.",
    file: "sops/commissioning.md",
    group: "The start-up process",
    roles: ["tech", "lead", "supervisor"],
    featured: ["tech", "lead"]
  },
  {
    id: "field-tasking",
    title: "Field Tasking",
    blurb: "The lead's to-do list for every phase, with a saved checklist.",
    file: "sops/field-tasking.md",
    group: "The start-up process",
    roles: ["lead", "supervisor"],
    featured: ["lead"]
  },

  /* ---------- Clean and flush: HHW systems, with a record form for each stage ---------- */
  {
    id: "clean-flush",
    title: "Clean and Flush",
    blurb: "Flush, clean, and treat an HHW system, with a record form for each stage.",
    file: "sops/clean-flush.md",
    group: "Clean and flush",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: ["tech", "lead"]
  },
  {
    id: "clean-flush-pre-flush",
    title: "Pre-Flush",
    blurb: "Get the system ready and calculate its volume.",
    file: "sops/clean-flush-pre-flush.md",
    group: "Clean and flush",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: []
  },
  {
    id: "clean-flush-flushing",
    title: "Flushing",
    blurb: "Bleed and feed with ICW for at least 4 hours.",
    file: "sops/clean-flush-flushing.md",
    group: "Clean and flush",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: []
  },
  {
    id: "clean-flush-cleaning",
    title: "Cleaning",
    blurb: "Circulate cleaner, test the solution, and flush it out.",
    file: "sops/clean-flush-cleaning.md",
    group: "Clean and flush",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: []
  },
  {
    id: "clean-flush-treatment",
    title: "Treatment",
    blurb: "Charge the system with corrosion inhibitor.",
    file: "sops/clean-flush-treatment.md",
    group: "Clean and flush",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: []
  },

  /* ---------- Reference ---------- */
  {
    id: "best-practices",
    title: "Best Practices",
    blurb: "Day-to-day rules for time, dispatch, tools, vehicles, and safety.",
    file: "sops/best-practices.md",
    group: "Field reference",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: ["apprentice"]
  },
  {
    id: "contacts",
    title: "Contacts",
    blurb: "Where to find phone numbers and emails.",
    file: "sops/contacts.md",
    group: "Field reference",
    roles: ["apprentice", "tech", "lead", "supervisor"],
    featured: []
  }
];

// Full label for each role
const ROLE_LABELS = {
  apprentice: "Apprentice",
  tech: "Technician",
  lead: "Lead Technician",
  supervisor: "Supervisor",
  pm: "Project Manager"
};

// One line about each role. Shown on the role buttons.
const ROLE_BLURBS = {
  apprentice: "Learning the systems and supporting the crew on site.",
  tech: "Start-up, pre-functional, and commissioning steps in the field.",
  lead: "Running the job: admin setup, field tasking, and turnover.",
  supervisor: "Dispatch, job tracking, and every SOP in one place.",
  pm: "What the start-up team needs from you."
};

// Links to Airtable. Each one shows at the top of its menu group and as a
// button on that role's home page. They open in a new tab.
const ROLE_EXTRAS = {
  supervisor: [
    { label: "Open Service Workspace ↗", url: "https://airtable.com/appe3ibHthgBJFYUs/pagJFZqMkCM45r6QJ", group: "Supervisor tools" }
  ]
};

// Role switcher: roles listed here get buttons to preview the other role views.
const ROLE_SWITCHER = {
  supervisor: ["apprentice", "tech", "lead"]
};

// Used for the "Edit this page" link at the bottom of every SOP.
const REPO = "crystal-jeffers/start-up-procedures";
const BRANCH = "main";
