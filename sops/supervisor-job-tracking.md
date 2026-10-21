# Job Tracker & Checklists

Every job carries the full SOP checklist: Admin Info, Pre-Start, Start-Up, Commissioning, and Closeout.

The **tracker** shows overall job status.
The **checklist** is where phase tasks are logged.

<div class="carousel">
<figure class="shot">
  <img src="assets/img/supervisor/job-tracker.png" alt="Job Tracker Active tab with current phase and progress for each job" loading="lazy">
  <figcaption>Most pressing deadline at the top. Tap to enlarge.</figcaption>
</figure>
<figure class="shot">
  <img src="assets/img/supervisor/job-tracker-detail.png" alt="One job opened in the Job Tracker" loading="lazy">
  <figcaption>Open a job to see its phase, progress, and team.</figcaption>
</figure>
<figure class="shot">
  <img src="assets/img/supervisor/job-tracker-backlog.png" alt="Backlog queue" loading="lazy">
  <figcaption>The Backlog queue.</figcaption>
</figure>
<figure class="shot">
  <img src="assets/img/supervisor/status-on-hold.png" alt="Setting a job to On Hold" loading="lazy">
  <figcaption>Set On Hold by hand. Everything else is automatic.</figcaption>
</figure>
</div>

## What each page is for

| Page | What it's for | How often |
|---|---|---|
| Job Tracker | One row per job: phase, progress, lead, PM | Daily glance |
| Job Checklists | Tick each checkpoint Done or N/A | As work happens |
| SOP Checklist | Master list every job copies | When the SOP changes |

## Job status
- **Backlog:** Booked, not started.
- **Active:** Work underway. The status changes and the checklist is created **automatically** once a job has a Job Number, Lead Tech, and PM.
- **On Hold:** Paused. Set by hand. Set it back to Active to resume.
- **Archived:** Finished. Happens **automatically** when every checkpoint is closed (100%).

## Starting a job

### Set up a new job
1. Go to **Job Tracker**, then **Planned**, and open the job.
2. Add the **Deadline** if there is one.
3. Tick **Commissioning In Scope** if Cx applies (you can change this later).
4. Add the **Job Number**, **Lead Tech**, and **PM**. Once all three are in, the job turns Active and its checklist appears.

> Important: Commissioning can change mid-job. Unticked, the commissioning steps show as *Not in scope* and count as closed. Tick the box later and they reopen right away.

## Schedule status
Every job with a deadline gets a status. The Job Tracker and Service Dashboard sort by it.

| Status | Means |
|---|---|
| 🔴 Overdue | Past the deadline and not finished |
| 🟠 Behind | Under the expected pace for time used |
| 🟡 Due soon | 14 days or fewer left |
| 🟢 On track | Keeping pace |
| ⚪ No deadline | Add one to track pace |

Pace is measured from the job's first day on the dispatch board. If work began later, fill in **Job Start** and the status recalculates.

## Working the checklist
Grouped by phase, in SOP order.

![Job Checklists page grouped by phase with Done and N/A checkboxes](assets/img/supervisor/job-checklist.png)

- Pick the job in the **Job** dropdown, or collapse it to see all jobs on the page.
- Tick **Done** when a step is complete. The time is stamped in **Closed At** automatically.
- Tick **N/A** when a step doesn't apply to this job. (This counts as closed.)
- Use **Notes** for anything the next person needs: what's confirmed, what's outstanding, and so on.
- **Recurring** steps (weekly workforce review, 24, 48, and 72-hour checks): tick once the routine is set up or the last check is done.
- **Checkpoint Status** reads Done, N/A, Not in scope, or Open.

## Reading progress
- **Progress** is the share of checkpoints that are Done, N/A, or Not in scope.
- **Current Phase** moves forward on its own as each phase closes out. When every item is closed, the job reaches 100% and is archived automatically.
