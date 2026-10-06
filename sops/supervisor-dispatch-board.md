# Dispatch Board

Goodbye monthly spreadsheet, hello Airtable dispatch board! Each assignment on the board is one record with a technician, job, type and date range.

**Service Workspace** → **Dispatch Timeline** or **Dispatch Calendar**.

<div class="callout"><strong>Who edits:</strong> supervisor only. 
  Everyone else uses a read-only live feed that only shows their assignments. They will also receive an automated email each Friday afternoon outlining what jobs they have for the upcoming week.</div>

## Reading the board

<!-- CAPTURE: Dispatch Timeline, two-week view, all technicians, no filters. Crop to the board. Save as assets/img/supervisor/timeline-overview.png -->
<figure class="shot">
  <img src="assets/img/supervisor/timeline-overview.png" alt="Dispatch Timeline showing one row per technician across two weeks, bars colored by technician" loading="lazy">
</figure>

- **Rows** are technicians. One row per technician.
- **Bars** are assignments. Each bar is one assignment.
- **Colors:** each technician has their own color. Anyone **Out** shows in muted gray, so absences stand out at a glance.
- **Weekends** are hidden. Weekend work still saves. Switch the view to show weekends when you need it.
- **Timeline** is best for "who is where this week."
- **Calendar** is best for "what's happening on this job this month."


## Filtering

Use the **Technician** and **Job** dropdowns at the top of either page.

<!-- CAPTURE: Dispatch Calendar with the Job dropdown open. Save as assets/img/supervisor/filters.png -->
<figure class="shot">
  <img src="assets/img/supervisor/filters.png" alt="Technician and Job filter dropdowns open above the calendar" loading="lazy">
  <figcaption>Clear the filter to see everyone again.</figcaption>
</figure>

## Assignment types

<div class="table-scroll">
<table>
<thead><tr><th>Type</th><th>Use it for</th><th>Job field</th></tr></thead>
<tbody>
<tr><td>Job</td><td>Start-up work on a site</td><td>Required</td></tr>
<tr><td>Training</td><td>Classes, manufacturer training, owner training days</td><td>The training record</td></tr>
<tr><td>Internal</td><td>Shop, office, service assistance</td><td>The internal record</td></tr>
<tr><td>Out</td><td>Any absence: vacation, sick, leave, holiday</td><td>Leave blank</td></tr>
<tr><td>Unassigned</td><td>Available, nothing booked yet</td><td>Leave blank</td></tr>
</tbody>
</table>
</div>



## Adding, moving and splitting assignments

<div class="numbered-group">
<h4>Add an assignment</h4>
<ol>
<li>On the Timeline, click <strong>+</strong> in the technician's row (or on the Calendar, click the start day).</li>
<li>Pick the <strong>Technician</strong>, <strong>Type</strong> and <strong>Job</strong>.</li>
<li>Set <strong>Start Date</strong> and <strong>End Date</strong>. For one day, use the same date for both.</li>
<li>The label and color fill in on their own a few seconds later.</li>
</ol>
</div>

<div class="numbered-group">
<h4>Move or reassign</h4>
<ol>
<li><strong>Drag</strong> a bar left or right to change its dates.</li>
<li><strong>Drag</strong> it to another technician's row to reassign it.</li>
<li>Drag either <strong>end</strong> of a bar to make it longer or shorter.</li>
</ol>
</div>

<div class="numbered-group">
<h4>Split a day between two sites</h4>
<ol>
<li>Create two assignments for that day, one for each job.</li>
<li>Tick <strong>Half Day</strong> on both.</li>
</ol>
</div>



<!-- CAPTURE: Assignment Detail panel open (side sheet) for one Job assignment. Save as assets/img/supervisor/assignment-detail.png -->
<figure class="shot">
  <img src="assets/img/supervisor/assignment-detail.png" alt="Assignment detail panel showing technician, job, dates, half day and notes" loading="lazy">
  <figcaption>Click any bar to open the full assignment.</figcaption>
</figure>



<div class="callout"><strong>Primary – Do Not Pull:</strong> tick this when a tech is the primary on a job and must not be reassigned. Check it before you drag anyone off a job.</div>

## Absences and privacy

- Book any absence as **Type = Out**. On every shared page it shows only as *Out*, in gray.
- - **Holidays** live in their own list with the union locals that observe them. They don't appear on the board yet, so book holiday days as *Out* for the techs who take them.
- Put the reason in **Supervisor Notes**. It never appears on the timeline, the calendar, or the read-only schedule.
- **Notes** (without "Supervisor") are visible to everyone. Use them for job details like *"Steam blowdown Sunday."*


## Adding a new technician

<ol class="chunked-list">
<li>Add them to the <strong>Technicians</strong> list (name, union local).</li>
<li>Add their name as a new option in <strong>Calendar Color</strong> and pick a color. Without this step their bars stay uncolored.</li>
<li>Book their first assignment as usual.</li>
</ol>



