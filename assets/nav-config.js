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
  {
    id: "start-up-lifecycle",
    title: "Start-Up Lifecycle",
    file: "sops/start-up-lifecycle.md",
    roles: ["tech", "lead"],
    featured: ["tech", "lead"]
  },
  {
    id: "admin-info",
    title: "Admin Info",
    file: "sops/admin-info.md",
    roles: ["lead"],
    featured: ["lead"]
  },
  {
    id: "field-tasking",
    title: "Field Tasking",
    file: "sops/field-tasking.md",
    roles: ["lead"],
    featured: ["lead"]
  },
  {
    id: "pre-start",
    title: "Pre-Start",
    file: "sops/pre-start.md",
    roles: ["tech", "lead"],
    featured: ["tech", "lead"]
  },
  {
    id: "start-up",
    title: "Start-Up",
    file: "sops/start-up.md",
    roles: ["tech", "lead"],
    featured: ["tech", "lead"]
  },
  {
    id: "commissioning",
    title: "Commissioning",
    file: "sops/commissioning.md",
    roles: ["tech", "lead"],
    featured: ["tech", "lead"]
  },
  {
    id: "best-practices",
    title: "Best Practices",
    file: "sops/best-practices.md",
    roles: ["tech", "lead"],
    featured: []
  },
  {
    id: "contacts",
    title: "Contacts",
    file: "sops/contacts.md",
    roles: ["tech", "lead"],
    featured: []
  }
];

// Full label shown in the sticky header for each role
const ROLE_LABELS = {
  apprentice: "Apprentice",
  tech: "Technician",
  lead: "Lead Technician",
  pm: "Project Manager"
};

// Extra shortcut buttons that appear ONLY in a given role's sticky header.
// Leave the array empty ( [] ) for a role with no extra shortcuts.
const ROLE_EXTRAS = {
  apprentice: [],
  tech: [],
  lead: [],
  pm: []
};
