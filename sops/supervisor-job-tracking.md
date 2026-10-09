# Job Tracker & Checklists

Every job carries the full SOP checklist: Admin Info, Pre-Start, Start-Up, Commissioning and Closeout. 

The <strong>tracker</strong> shows overall job status. 
The <strong>checklist</strong> is where phase tasks are logged.


## What each page is for:

<div class="table-scroll">
<table>
<thead><tr><th>Page</th><th>What it's for</th><th>How often</th></tr></thead>
<tbody>
<tr><td>Job Tracker</td><td>One row per job: phase, progress, lead, PM</td><td>Daily glance</td></tr>
<tr><td>Job Checklists</td><td>Tick each checkpoint Done or N/A</td><td>As work happens</td></tr>
<tr><td>SOP Checklist</td><td>Master list every job copies</td><td>When the SOP changes</td></tr>
</tbody>
</table>
</div>

## Job status

<div class="bubble-columns">
<div class="bubble-column">
<h4 class="align-left">BACKLOG: Booked, not started.</h4>
</div>
</div>
<div class="bubble-column">
<h4 class="align-left">ACTIVE: Work underway.</h4>
<div class="bubble">Status changes and checklist is created <strong>automatically</strong> once jobs have Job Number, Lead Tech and PM.</div>
</div>
<div class="bubble-column">
<h4 class="align-left">ON HOLD: Paused.</h4>
<div class="bubble">Set by hand. Set to Active to resume.</div>
</div>
<div class="bubble-column">
<h4 class="align-left">ARCHIVED: Finished.</h4>
<div class="bubble">Happens <strong>automatically</strong> when every checkpoint is closed (100%).</div>
</div>
</div>

<div class="carousel">
<figure class="shot">
  <img src="assets/img/supervisor/job-tracker.png" alt="Job Tracker Active tab with current phase and progress for each job" loading="lazy">
  <figcaption>Most pressing deadline at the top. Tap to enlarge.</figcaption>
</figure>
<figure class="shot">
  <img src="assets/img/supervisor/job-tracker-detail.png" alt="Backlog queue." loading="lazy">
</figure>
<figure class="shot">
  <img src="assets/img/supervisor/job-tracker-backlog.png" alt="Backlog queue." loading="lazy">
</figure>
<figure class="shot">
  <img src="assets/img/supervisor/status-on-hold.png" alt="Manually adjust status for On Hold, everything else is automatic." loading="lazy">
</figure>


## Starting a job

<div class="numbered-group">
<h4>Set up a new job</h4>
<ol>
<li><strong>Job Tracker</strong> → <strong>Planned</strong>, open job.</li>
<li>Add the <strong>Deadline</strong> if there is one.</li>
<li>Tick <strong>Commissioning In Scope</strong> if Cx applies (you can change this later).</li>
<li>Add <strong>Job Number</strong>, <strong>Lead Tech</strong> and <strong>PM</strong>. (Once all three are in, job turns Active and checklist appears.)</li>
</ol>
</div>


<div class="callout"><strong>Commissioning can change mid-job.</strong> Unticked, the commissioning steps show as <em>Not in scope</em> and count as closed. Tick the box later and they reopen right away.</div>



## Schedule status
Every job with a deadline gets a status. Job Tracker and Service Dashboard sort by it.

<div class="table-scroll">
<table>
<thead><tr><th>Status</th><th>Means</th></tr></thead>
<tbody>
<tr><td>🔴 Overdue</td><td>Past the deadline and not finished</td></tr>
<tr><td>🟠 Behind</td><td>Under the expected pace for time used</td></tr>
<tr><td>🟡 Due soon</td><td>14 days or fewer left</td></tr>
<tr><td>🟢 On track</td><td>Keeping pace</td></tr>
<tr><td>⚪ No deadline</td><td>Add one to track pace</td></tr>
</tbody>
</table>
</div>

Pace is measured from the job's first day on the dispatch board. If work began later, fill in <strong>Job Start</strong> and the status recalculates.


## Working the checklist
Grouped by phase, in SOP order.
<!-- CAPTURE: Job Checklists with one job selected, Pre-Start group expanded, a few items ticked. Save as assets/img/supervisor/job-checklist.png -->
<figure class="shot">
  <img src="assets/img/supervisor/job-checklist.png" alt="Job Checklists page grouped by phase with Done and N/A checkboxes" loading="lazy">
</figure>

- Pick the job in the **Job** dropdown, or collapse to see all jobs on the page.
- Tick **Done** when a step is complete. Time is auto-stamped in **Closed At**.
- Tick **N/A** when a step doesn't apply to this job. (This counts as closed.)
- Use **Notes** for anything the next person needs: what's confirmed, outstanding, etc.
- **Recurring** steps (weekly workforce review, 24/48/72-hour checks): tick once the routine is set up or the last check is done.
- **Checkpoint Status** reads Done, N/A, Not in scope, or Open.


## Reading progress
- **Progress** is the share of checkpoints that are Done, N/A, or Not in scope.
- **Current Phase** moves forward on its own as each phase closes out. When every item is closed, the job reaches 100% and is archived automatically.
