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
    id: "ductwork-lod-checkpoint",
    title: "Ductwork LOD Readiness Checkpoint",
    file: "sops/ductwork-lod-checkpoint.md",
    roles: ["apprentice", "tech", "lead", "pm"],
    featured: ["tech", "lead"]
  },
  {
    id: "rfi-submission-process",
    title: "RFI Submission & Log Ownership",
    file: "sops/rfi-submission-process.md",
    roles: ["tech", "lead", "pm"],
    featured: ["lead", "pm"]
  },
  {
    id: "field-reporting-app",
    title: "Field Reporting App — Daily Use",
    file: "sops/field-reporting-app.md",
    roles: ["apprentice", "tech", "lead", "pm"],
    featured: ["apprentice", "tech"]
  }
];

const ROLE_LABELS = {
  apprentice: "Apprentice",
  tech: "Technician",
  lead: "Lead Technician",
  pm: "Project Manager"
};

const ROLE_EXTRAS = {
  apprentice: [],
  tech: [],
  lead: [
    { label: "Escalation Contacts", file: "sops/escalation-contacts.md" }
  ],
  pm: [
    { label: "Escalation Contacts", file: "sops/escalation-contacts.md" },
    { label: "Cost Impact Log", file: "sops/cost-impact-log.md" }
  ]
};
