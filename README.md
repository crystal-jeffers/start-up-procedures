# Start-Up SOPs

Standard operating procedures for the Southland NorCal Start-Up team, published with GitHub Pages.

**Live site:** https://crystal-jeffers.github.io/start-up-procedures/

The site opens on the Supervisor view. Each role has its own home page that shows only the SOPs for that role:

| Role | Link |
|---|---|
| Supervisor | `supervisor.html` (shows every SOP and links to the other views) |
| Lead Technician | `lead.html` |
| Technician | `tech.html` |
| Apprentice | `apprentice.html` |

> This repository is public. Don't put names, phone numbers, emails, job numbers, cost codes, or customer details in any file or screenshot. Link to SharePoint instead (a Southland login is required to open it).

## What's in the folder

| Path | What it is |
|---|---|
| `sops/` | One Markdown file per SOP. This is where almost all editing happens. |
| `assets/nav-config.js` | The list of SOPs: titles, one-line descriptions, menu groups, which roles see each one, and the Airtable links (`ROLE_EXTRAS`). |
| `assets/img/` | Screenshots. Blur anything sensitive before uploading. |
| `assets/render.js` | The engine. You shouldn't need to touch it. |
| `assets/style.css` | The look. Colors are set at the top of the file. |
| `*.html` | Small shells, one per role, plus `sop.html` for a single SOP. `index.html` sends visitors to the Supervisor view. |

## Edit an SOP

1. Open the file in `sops/` (or click **Edit this page** at the bottom of any SOP on the live site).
2. Click the pencil icon, make your change, and click **Commit changes**.
3. The site updates in a minute or two. Refresh with Ctrl + Shift + R if you still see the old version.

## Add a new SOP

1. Create a new file in `sops/`, for example `sops/cleanup.md`. Start it with `# Title`.
2. Open `assets/nav-config.js` and copy one of the blocks in `SOP_LIBRARY`. Change `id`, `title`, `blurb`, `file`, `group`, `roles`, and `featured`.
3. Commit. The menu, search, home cards, and Previous / Next buttons update on their own.

## Writing guide

SOPs are plain Markdown. The engine styles them automatically.

| Write this | You get |
|---|---|
| `## Heading` | A white section card, listed under **On this page** |
| `1. Step` | Numbered step markers on a rail. A list that starts at `7.` keeps counting from 7. |
| `### Group name` above a numbered list | An orange group label that splits long step lists into chunks |
| `- [ ] Item` | A tick box that's saved on that person's device, with a progress bar and **Clear all** |
| Short bullets indented under a step or check | Small chips (good for lists like BOD, Drawings, SOO) |
| `- **Label:** text` on every line of a list | Black tags on the left, white bubbles on the right |
| `## Numbers to know`, then `- **$200** what it means` | Big number tiles on a black card |
| `> Tip:`, `> Note:`, `> Important:`, `> Warning:` | Colored callouts |
| Two or more pictures back to back | A slideshow with arrows |
| `[text](https://...sharepoint.com/...)` | A link with a lock and a "Southland login" badge |
| `[text](#add-something)` | A grey "link coming" placeholder, for links you don't have yet |

Lines right under the title change the whole page:

| Line | Effect |
|---|---|
| `Type: Timeline` | Each `### Stage` becomes a numbered stage, with stage buttons that follow you down the page. Used on Start-Up Lifecycle. |
| `Type: Checklist` | The home card counts checks instead of steps. Used on Admin Info. |
| `Type: Reference` | Each `## Section` folds into a numbered black bar you click to open. Used on Best Practices. |

Each extra blank line adds a line's worth of space. Blank lines just before a `## Heading` add space between the cards.

## Notes

- Ticks in checklists live in each person's browser. They aren't shared and nobody else can see them. Clearing browser data clears them.
- Search covers every SOP the current role can see.
- The fonts (Barlow) come from Google Fonts, which is free. If they ever fail to load, the site falls back to the system font.
