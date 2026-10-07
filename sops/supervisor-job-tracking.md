# Job Tracker & Checklists

Every job carries the full SOP checklist: Admin Info, Pre-Start, Start-Up, Commissioning and Closeout. The <strong>tracker</strong> shows where each job is. The <strong>checklist</strong> is where the work gets ticked off.


## What each page is for:

<div class="table-scroll">
<table>
<thead><tr><th>Page</th><th>What it's for</th><th>How often</th></tr></thead>
<tbody>
<tr><td>Job Tracker</td><td>One row per job: current phase, progress, lead, PM</td><td>Daily glance</td></tr>
<tr><td>Job Checklists</td><td>Tick each checkbox Done or N/A</td><td>As work happens</td></tr>
<tr><td>SOP Checklist (Templates)</td><td>Mster list every job copies</td><td>Only when the SOP changes</td></tr>
</tbody>
</table>
</div>

## Job status

<div class="bubble-columns">
<div class="bubble-column">
<h4>Planned</h4>
<div class="bubble">Booked, not started.</div>
</div>
<div class="bubble-column">
<h4>Active</h4>
<div class="bubble">Work underway. Happens <strong>automatically</strong> once the job has a Job Number, Lead Tech and PM. The checklist is created at the same moment.</div>
</div>
<div class="bubble-column">
<h4>On Hold</h4>
<div class="bubble">Paused. Set by hand. Set it back to Active to resume.</div>
</div>
<div class="bubble-column">
<h4>Archived</h4>
<div class="bubble">Finished. Happens <strong>automatically</strong> when every checkpoint is closed (100%).</div>
</div>
</div>

<!-- CAPTURE: Job Tracker, Active tab, showing Current Phase and Progress columns. Save as assets/img/supervisor/job-tracker.png -->
<figure class="shot">
  <img src="assets/img/supervisor/job-tracker.png" alt="Job Tracker Active tab with current phase and progress for each job" loading="lazy">
<figcaption>Most pressing deadline at the top. Tap to enlarge.</figcaption>
</figure>


## Starting a job

<div class="numbered-group">
<h4>Set up a new job</h4>
<ol>
<li><strong>Job Tracker</strong> → <strong>Planned</strong>, open job.</li>
<li>Add the <strong>Deadline</strong> if there is one.</li>
<li>Tick <strong>Commissioning In Scope</strong> if Cx applies (you can change this later).</li>
<li>Add <strong>Job Number</strong>, <strong>Lead Tech</strong> and <strong>PM</strong>. Once all three are in, the job turns Active and its checklist appears.</li>
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

<!-- CAPTURE: Job Checklists with one job selected, Pre-Start group expanded, a few items ticked. Save as assets/img/supervisor/job-checklist.png -->
<figure class="shot">
  <img src="assets/img/supervisor/job-checklist.png" alt="Job Checklists page grouped by phase with Done and N/A checkboxes" loading="lazy">
</figure>

- Pick the job in the **Job** dropdown. Grouped by phase, in SOP order.
- Tick **Done** when a step is complete. The time is stamped automatically in **Closed At**.
- Tick **N/A** when a step doesn't apply to this job. It counts as closed.
- Use **Notes** for anything the next person needs: who confirmed, what's outstanding.
- **Recurring** steps (weekly workforce review, 24/48/72-hour checks): tick once the routine is set up or the last check is done.
- **Checkpoint Status** reads Done, N/A, Not in scope, or Open.


## Reading progress

- **Progress** is the share of checkpoints that are Done, N/A, or Not in scope.
- **Current Phase** moves forward on its own as each phase closes out. When every item is closed, the job reaches 100% and is archived automatically.
