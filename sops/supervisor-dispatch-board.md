# Dispatch Board

Goodbye monthly spreadsheet, hello Airtable dispatch board! 
Each assignment is one record with a technician, job, type and date range.

<div class="callout"><strong>Who edits?</strong> Supervisor only. 

Everyone else views a read-only live feed that only shows their assignments. They will also receive an automated email each Friday afternoon outlining what jobs they have for the upcoming week.</div>

<figure class="shot">
  <img src="assets/img/supervisor/my-schedule-email.png">
</figure>


## Reading the board

<!-- CAPTURE: Dispatch Timeline, two-week view, all technicians, no filters. Crop to the board. Save as assets/img/supervisor/timeline-overview.png -->
<figure class="shot">
  <img src="assets/img/supervisor/timeline-overview.png" alt="Dispatch Timeline showing one row per technician across two weeks, bars colored by technician" loading="lazy">
</figure>

- **Rows**: One row per technician.
- **Bars**: Each bar is one assignment.
- **Colors:** Each technician has their own color. Anyone **Out** shows in gray, so absences stand out at a glance.
- **Weekends** are hidden by default. Switch views to see weekends as needed.
- **Timeline**: "who is where this week."
- **Calendar**: "what's happening on this job this month."


## Filtering

Use the **Technician** and **Job** dropdowns at the top of either page. (Clear the filter to see everyone again)

<!-- CAPTURE: Dispatch Calendar with the Job dropdown open. Save as assets/img/supervisor/filters.png -->
<figure class="shot">
  <img src="assets/img/supervisor/filters.png" alt="Technician and Job filter dropdowns open above the calendar" loading="lazy">
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
<li>Click <strong>+</strong> in the technician's row or start day.</li>
<li>Pick the <strong>Technician</strong>, <strong>Type</strong> and <strong>Job</strong>.</li>
<li>Set <strong>Start Date</strong> and <strong>End Date</strong>.</li>
<li>The label and color fill in on their own a few seconds later.</li>
</ol>
</div>

<div class="numbered-group">
<h4>Move or reassign</h4>
<ol>
<li><strong>Drag</strong> bar left or right to change its dates.</li>
<li><strong>Drag</strong> to another row to reassign.</li>
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




## Absences and privacy

- Book absences as **Type = Out** and leave notes as needed. Shared pages only shows as *Out*, in gray.
- **Supervisor Notes** are only visible to you. They will not appear on the technician's personal view. 
- **Notes** (without "Supervisor") are visible to everyone. Use them for job details like *"Steam blowdown Sunday."*
- **Holidays** live in their own list with the union locals that observe them. They don't appear on the board yet, so book holiday days as *Out* for the techs who take them.

<figure class="shot">
  <img src="assets/img/supervisor/supervisor-notes.png">
</figure>

## Adding a new technician

<ol class="chunked-list">
<li>Everything happens on the <strong>Crew</strong> page.</li>

<li>Enter their <strong>Name</strong>, <strong>Email</strong>, and <strong>Union Local</strong> and tick <strong>Active</strong>.
<li>Add their name as a new option in <strong>Calendar Color</strong> and pick a color. Without this step their bars stay uncolored.</li>
<li>Book their first assignment as usual.</li>

<li><strong>Someone leaving?</strong> Untick <strong>Active</strong> on the Crew page. They drop off the schedule email and the active list, but history stays intact.</li>
</ol>



