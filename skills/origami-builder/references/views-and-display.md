# Views and Display Reference

## View Types Overview

Origami supports six built-in view types, plus the ability to create custom named views. All views can be enabled/disabled and one can be set as default.

---

## Table View
Spreadsheet-style grid showing records as rows and fields as columns.

**Configuration:**
- **Field Selection**: Choose which fields to display as columns
- **Display in Table Toggle**: Enable/disable visibility per field
- **Filter Display Option**: Make fields available as quick filters
- **Quick Edit Functionality**: Allow inline editing from table cells

**Key Settings:**
- Set as default view for entity
- Column order determined by field order in configuration
- Multiple users can have different column arrangements with Top Filters (see below)

**Best Practices:**
- Prioritize essential fields; avoid over-crowding
- Enable quick edit for frequently-updated fields
- Use filters strategically to reduce clutter

---

## Kanban View
Card-based board grouped into columns by status or workflow stage.

**Configuration:**
- **Select Flow Field**: Choose status/dropdown field that defines board columns
- **Title Field**: Field displayed as card title
- **Description Fields**: Multiple fields shown on card for context
- **Filter Fields**: Available quick filters for board

**Key Settings:**
- Flow field values become board columns
- Users drag cards between columns to update flow field
- Multiple cards per column supported
- Useful for workflow visualization and progress tracking

**Best Practices:**
- Use finite status field (5-10 values) for clear columns
- Title field should uniquely identify task
- Descriptions should fit on card without scrolling

---

## Calendar View
Records displayed as events on a calendar, with date/time positioning.

**Configuration:**
- **Title Field**: Event name displayed on calendar
- **Description Field**: Additional event details
- **Filter Fields**: Available quick filters
- **Working Hours Start/End**: Display hours range on calendar
- **Event Slot Duration**: Time resolution (e.g., 30 minutes)
- **Event Default Duration**: Duration for newly-created events (default 30 min)
- **Send Calendar Events**: Option to send invitations to linked users
- **Allow Override by Conditional Design**: Conditional rules override user color selection

**Key Settings:**
- Records must have date or date-range fields to appear
- Events positioned by date; multiple events per day supported
- Monthly, weekly, daily views available
- Drag-to-create new events or drag-to-reschedule existing events

**Resources View** (Calendar enhancement):
- **Resource Definition**: Up to 2 resources (single-link or dropdown fields)
- **Category Filter**: Additional filtering dimension per resource
- **Views**: General calendar, Resources in List (one per row), Horizontal layout

**Best Practices:**
- Ensure date fields are properly populated
- Use title field that clearly identifies event
- Set working hours to match organization schedule
- Keep descriptions short for calendar display

---

## Map View
Records displayed as pins on a geographic map (Google Maps integration).

**Configuration:**
- **Title Field**: Marker name
- **Description Field**: Smaller text displayed under title on marker
- **Location Field**: Address field type (required) for marker positioning
- **Filter Fields**: Available quick filters

**Key Settings:**
- Requires Address field type (not text)
- Zoom and pan controls for map interaction
- Click markers to view title and description
- Range radius filtering: Find records within distance from given address

**Use Cases:**
- Service location networks
- Customer/site mapping
- Logistics and delivery tracking
- Territory or branch visualization

**Best Practices:**
- Ensure Address field populated and valid
- Title field should identify location clearly
- Use range filters for location-based searches

---

## Gantt View
Timeline bar chart for project and schedule visualization.

**Configuration:**
- **Display as Line Title**: Field for row label
- **Display as Line Description**: Additional context per bar
- **Conditional Design Field**: Field for color/styling rules on bars
- **Fields to Show**: Additional fields displayed alongside bars
- **Maximum Years Scale Length**: Timeline span (2-20 years, default 4)
- **Filter Fields**: Available quick filters

**Key Settings:**
- Records must have date-range fields for bar positioning
- Bar start/end determined by date fields
- Horizontal timeline; time scale configurable
- Conditional styling applies color coding to bars

**Best Practices:**
- Set Maximum Years Scale to match typical project duration
- Title clearly identifies task/project
- Use descriptions for supplementary info
- Ensure date-range fields completed

---

## Gallery View
Card layout displaying records with image thumbnails in grid.

**Configuration:**
- **Gallery Image Field**: File/image field for card thumbnail
- **Display as Gallery Title**: Card title field
- **Display as Gallery Description**: Description text on card
- **Filter Fields**: Available quick filters

**Key Settings:**
- Requires file/image field type
- Cards display in responsive grid
- Click card to open full record detail
- Image aspect ratio maintained

**Use Cases:**
- Product catalogs
- Media libraries
- Portfolio galleries
- Visual inventory management

**Best Practices:**
- Use square or consistent aspect ratio images
- Title field should uniquely identify item
- Keep descriptions short for card display

---

## Filters in Views

Origami offers two filter implementations for different workflows.

### Side Filters
- **Location**: Fixed sidebar panel on left
- **Functionality**: Basic field filtering
- **Interaction**: Always visible; field-based selection

**Pros:**
- Immediately accessible
- Straightforward filtering
- Familiar to traditional users

**Cons:**
- No advanced features
- Limited customization
- Takes up screen space

### Top Filters
- **Location**: Icon-triggered dropdown box (cleaner interface)
- **Functionality**: Advanced filtering + column customization
- **Features**:
  - Reorder columns by dragging
  - Toggle column visibility
  - Save filter presets with custom column layout
  - Apply saved presets instantly

**Pros:**
- Space-efficient
- Advanced customization
- Filter preset saving
- Column personalization

**Cons:**
- Requires extra click to access
- Steeper learning curve

**Best Practices:**
- Side Filters: Traditional workflows, simple filtering needs
- Top Filters: Power users, custom column needs, preset-heavy workflows
- Educate users on preset saving capability

---

## Field Group Editor (Record Layout)

Controls the structure and appearance of record detail view when user clicks into a record.

**Organization:**
- Records divided into named field groups (sections)
- Each group has independent editing
- Groups can be arranged in tabs or as standalone blocks

**Interface:**
- Left: Field Type Palette (all 30+ available field types, draggable)
- Right: Drop Zone (current fields in group, reorderable)

**Adding Fields:**
- Drag field type from palette to Drop Zone
- Reorder fields by dragging within Drop Zone
- Clicking gear icon opens field settings for that field

**Field Settings (per field):**
- Field Name, Description/tooltip (up to 1000 chars)
- Required, Not Editable, Hidden toggles
- Data Type validation (plain text, numeric, IP, Luhn, custom Regex)
- Default value
- Min/Max length
- Prefix/Suffix characters
- Unique to entity toggle
- Show Data Name toggle

**Per-Field Context Menu:**
- Permissions (read/write per user group)
- Visibility (conditional show/hide based on field values)
- Move Group (relocate to different field group)
- Duplicate (copy field in same group)
- Suspend (disable without deleting)
- Delete

**Field Width & Layout:**
- Each field stores width percentage (25%, 50%, 75%, 100%)
- Multiple narrow fields sit side-by-side in row
- 100% width field occupies full width

**Field Group Settings:**
- Field Group Name (section heading in record)
- Repeating Group toggle (create repeatable table for multiple entries)
- Show Data Name toggle
- Group-level Permissions (inherited from entity or overridden)
- Group-level Visibility (always visible or conditional)

---

## Visual Editor (Full Canvas Layout)

Complete drag-and-drop interface for designing record detail view layout.

**Access:** Entity toolbar › Fields › Visual Editor tab

**Canvas Model:**
Three block types that can be freely arranged:
1. **Tab Group**: Horizontal tabs organizing content into sections
2. **Field Group**: Named section containing fields
3. **Widget**: Embedded widget (chart, data table, etc.)

Blocks can share a row by using complementary widths (e.g., 49% + 51%).

**Toolbar Controls:**
- New Tab Group: Add tabbed container
- New Field Group: Add standalone field group
- Widgets: Open widget palette
- Fields: Searchable list of existing fields
- Save Changes: Commit all layout edits

**Tab Groups:**
- Organize content into logical sections ("Overview", "Finance", "Activity", etc.)
- Create with "New Tab Group" button
- Add tabs via "+ New Tab" button at right end
- Edit tab names with pencil icon
- Delete tabs with trash icon
- Drag field groups into tabs to assign

**Tab Group Structure:**
- Each tab stores list of field group references with widths
- Field group can belong to only one tab
- Multiple field groups in one tab sit side-by-side by giving proportional widths

**Field Group Controls:**
- Edit icon: Rename group
- Gear icon: Group settings (repeating, data name, permissions, visibility)
- Permissions icon: Set view/edit access
- Visibility icon: Conditional visibility rules
- Trash icon: Delete entire group

**Column Grid:**
Control fields-per-row layout:
- 1 per row (100% width)
- 2 per row (50% each)
- 3 per row (33.33% each)
- 4 per row (25% each)
- 5 per row (20% each)
- 6 per row (16.66% each)

Individual fields can be resized by dragging edges to custom width percentage.

**Moving Fields Between Groups:**
- Click field's context menu arrow
- Select "Move Group"
- Choose destination group
- Field and settings relocate intact
- Works across standalone groups, tabbed groups, and any tab combination

**Fields Palette:**
- Searchable panel listing all entity fields
- Drag fields from palette into any field group
- Filter by field name for quick location

**Widgets Embedded in Records:**
13 widget types available:
- Omnichannel Widget
- External/iFrame Widget
- Data Table (small)
- Sortable List
- Instance Counter
- Instances Graph
- Pie Chart
- Column Chart
- Speed Chart
- KPIs panel
- Trend Chart
- Funnel Chart
- Financial Widget

Widgets configured with data source, filters, display options. Alternate freely with field groups; multiple widgets share row with percentage widths.

**Saving Changes:**
- All edits staged locally until "Save Changes" clicked
- Single save operation commits entire new layout to server
- Save button greyed out until changes made (visual cue)
- No partial saves; all changes saved together

---

## Linked Views (Reverse Links)

Allow record detail view to embed live interactive table of related records from another entity.

**Use Case:** View all Tasks in a Project record without leaving Project; see all Deals in a Client record inline.

**How It Works:**
- Driven by "Link to record" or "Link to multiple records" field on child entity
- When Entity B links to Entity A, Reverse Link on Entity A shows all Entity B records referencing current Entity A record
- Embedded table fully interactive (view, create, manage without leaving parent)

**Accessing Management:**
Views panel › Reverse Link (Kishur Hafuch) option in sidebar

**Creating a Linked View:**
Click "Add New Link" (Hosaf Kishur Hadash):

- **Link Name (Shem HaKishur)**: Label displayed as section title ("Tasks", "Deals", "Support Tickets")
- **Field Name (Shem Sadeh)**: Dropdown selecting "Link to record" fields in other entities pointing back
- **Button Position (Mikom HaKaftor)**: Where table appears (top of record or after specific field group)
- **Filter by Default (Sanen Mufaim KiVrerit Machdal)**: Auto-filter table to show only records linked to parent

**Managing Linked Views:**
Each Linked View has edit/delete controls. Multiple Linked Views on single entity supported (Project can embed Tasks, Comments, and Documents tables in different positions).

**Example Patterns:**
- CRM: Client embeds Deals table via Link field on Deals pointing to Client
- Project Management: Project embeds Tasks via Task.project link field
- Support: Ticket embeds related interactions via reverse link on interactions

---

## Conditional Styling

Apply visual cues to data in views based on field values (rules change row/field background color).

**Configuration:**
- Rule Name: Identifier for rule
- Pick Color: Background color for rule
- Select Field to Highlight: Specific field or leave empty to color entire row
- Filters for Criteria: Define trigger conditions (field values, status, dates, etc.)

**Use Cases:**
- Red highlighting for high-priority tasks
- Green for completed, yellow for in-progress
- Color-code by status or category
- Data-driven visual differentiation

**Best Practices:**
- Use intuitive colors (red = urgent, green = complete)
- Use sparingly to avoid visual clutter
- Apply consistently across views
- Ensure accessible color choices (color-blind friendly)
- Train users on color meanings
