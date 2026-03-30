# Origami How-To Guide

Step-by-step instructions for the most common tasks in Origami.

---

## Table of contents

1. Creating a category and entity
2. Adding fields to an entity
3. Setting up the record layout (Visual Editor)
4. Creating and configuring views
5. Building a workflow
6. Importing data
7. Managing users and groups
8. Setting permissions
9. Creating a formula field
10. Setting up linked views (reverse links)
11. Configuring email (SMTP)
12. Setting up conditional styling
13. Creating an action button
14. Configuring a dashboard / widget page
15. Exporting data and reports

---

## 1. Creating a category and entity

**Categories** are the top-level groupings in Origami's navigation bar (like "CRM", "HR",
"Operations"). **Entities** are the data types within a category (like "Clients", "Deals").

### Create a category
1. Click the **"+" at the right end of the top navigation bar**
2. Enter a **Category Name** (e.g., "Sales")
3. Choose a **Category Icon**
4. Click **Save/Create**

### Create an entity
1. Select the category you want to add the entity to (click it in the top bar)
2. Click the **"+" at the right end of the second row** (tab bar)
3. Choose **Entity Page**
4. Enter the **Entity Name** (must be unique across the entire account)
5. Optionally enter a **Singular Name** (used in UI labels like "New [Singular Name]")
6. Configure initial permission settings if desired
7. Click **"Create a New Entity"** at the bottom

**Gotchas:**
- Entity names are globally unique. If you get "Value already exists," use a more specific
  name (e.g., "Sales Leads" instead of "Leads")
- Your account has a plan-based entity limit. If you hit it, archive unused entities first.

---

## 2. Adding fields to an entity

1. Navigate to the entity (click its tab in the second row)
2. Go to **Settings** (gear icon) > **Fields** or open the **Visual Editor**
3. In the Visual Editor: drag a field type from the **left palette** into a **field group**
   on the right
4. Click the **gear icon** on the new field to configure it:
   - **Name**: What users see (e.g., "Client Name")
   - **Required**: Whether the field must be filled to save
   - **Default Value**: Pre-populate on new records
   - **Unique**: Enforce uniqueness across all records
   - Other settings vary by field type (see feature-reference.md)
5. Click **Save** on the field settings
6. Click **Save Changes** on the Visual Editor when done

### Quick field type guide
- Text → Text Field
- Long text → Text Area
- Rich text → HTML Editor
- Number → Text Field with numeric Data Type (or Number Range)
- Date → Date/Time Field
- Status/category → Single Selection
- Tags → Multiple Selection or Free Multi Selection
- Link to another record → Instance Relation (single) or Multi Instance Relation (many)
- Link to a user → User Relation
- Calculated value → Formula
- Value from a linked record → Reference
- File attachment → File Upload
- Yes/No → Checkbox

---

## 3. Setting up the record layout (Visual Editor)

The Visual Editor controls how a record looks when someone opens it.

1. Go to the entity > **Settings** > **Fields** > **Visual Editor** tab
2. You'll see:
   - **Left side**: toolbar with buttons for Tab Groups, Field Groups, Widgets, and Fields
   - **Right side**: the canvas showing the current layout

### Organize with tabs
1. Click **"New Tab Group"** to add a tabbed container
2. Click **"+ New Tab"** at the right end to add tabs
3. Name each tab (pencil icon) — e.g., "Overview", "Finance", "Activity"
4. Drag field groups into the appropriate tab

### Arrange fields
- Drag fields between groups or reorder within a group
- Set field width: 25%, 50%, 75%, or 100% — multiple narrow fields sit side by side
- Use the column grid buttons to set fields-per-row (2, 3, 4, etc.)

### Add embedded widgets
- Click **Widgets** in the toolbar
- Choose from 13 widget types (Data Table, Pie Chart, KPIs panel, etc.)
- Configure the widget's data source and display options

### Save
Click **"Save Changes"** — all edits are staged locally until you save.

---

## 4. Creating and configuring views

Views control how records are displayed in the main list.

### Add a new view
1. Navigate to the entity
2. Click the **Views** panel (usually on the left or in the toolbar)
3. Click **"Add View"** or the "+" button
4. Choose the view type:
   - **Table** — spreadsheet-style grid
   - **Kanban** — card board grouped by a status/dropdown field
   - **Calendar** — events positioned by date
   - **Map** — pins on a geographic map (requires Address field)
   - **Gantt** — timeline bar chart
   - **Gallery** — card grid with image thumbnails

### Configure a Table view
1. Open view settings (gear icon)
2. Select which fields to show as columns
3. Enable **Quick Edit** on frequently-updated fields
4. Set **Filter Fields** to enable quick filtering

### Configure a Kanban view
1. Set the **Flow Field** (the Single Selection field that defines columns, e.g., Status)
2. Set the **Title Field** (what appears as the card title)
3. Add **Description Fields** for additional context on cards

### Set a default view
- Toggle the **"Set as Default"** option in the view settings

### Add filters
- **Side Filters**: always-visible sidebar panel
- **Top Filters**: icon-triggered dropdown with column customization and preset saving

---

## 5. Building a workflow

Workflows automate actions based on triggers and conditions.

### Create a workflow
1. Go to **Settings > Automation** (or the Automation section)
2. Click **"New Workflow"** or "+"
3. Fill in:
   - **Rule Name**: descriptive name (e.g., "Notify manager on deal closed")
   - **Workflow Description**: minimum 10 characters

### Set the trigger
Choose what starts the workflow:
- **On Instance Create** — when a new record is created
- **On Field Update** — when a specific field changes
- **On Instance Delete** — when a record is deleted
- **Action Button** — when a user clicks a custom button
- **Scheduled** — at a set time/interval
- **On Instance View** — when a record is opened

### Add conditions (optional)
- Click **"Add Condition"**
- Set field-based filters (e.g., Status = "Active")
- Multiple conditions combine with AND (all must be true)

### Add actions
Click **"Add Action"** and choose from 22+ action types:
- **Send Email** — automated email to static or dynamic recipients
- **Update Fields** — change field values on current or related records
- **Copy Instance** — duplicate a record to another entity
- **Notification** — in-app notification to users
- **Validation** — block save if conditions aren't met
- **Call External Service** — HTTP request to an API
- **AI Automation** — use AI to generate content
- And many more (see feature-reference.md)

### Test
- Save the workflow and ensure it's **enabled** (active toggle)
- Create or update a record that should trigger it
- Check that the expected action happened

---

## 6. Importing data

### Prepare the file
- Format: .xlsx or .csv (max 30 MB)
- Name columns to match Origami field names for auto-mapping
- Use ISO dates (YYYY-MM-DD)
- Import parent records before child records (for relations)

### Run the import
1. Go to **Settings > Data Management > Import Data**
2. Upload the file
3. Select the **Target Entity**
4. Click **"Next Phase"**

### Map columns (Phase 2)
- Review the auto-mapped fields — adjust any incorrect mappings
- Map all required fields
- Set unmapped columns to "Do not import"
- To update existing records: enable **"Update by Key Field"** at the bottom and select the
  key field(s)

### Handle conflicts
- If rows fail validation, the Conflicts screen appears
- Click **"Download Invalid Records"** to get all failing rows
- Options: proceed with valid rows only, or cancel and fix everything first

### After import
- Verify record count matches expected
- Spot-check data for accuracy
- Relation fields may still be linking in the background — wait a few minutes

**Pro tip:** Disable workflows on the target entity before large imports (re-enable after).

---

## 7. Managing users and groups

### Create a user group
1. Go to **Settings > User Management**
2. Click **"Add Group"** or manage existing groups
3. Name the group to match an organizational role (e.g., "Sales Team", "Managers", "Admins")

### Create a user
1. Go to **Settings > User Management**
2. Click **"Add User"**
3. Fill in: First Name, Last Name, Email, Password
4. Assign to one or more **User Groups**
5. Save

### Enable/disable a user
- Find the user in **Settings > User Management**
- Toggle their active/inactive status
- Disabled users can't log in but their records and links remain intact

### Group managers
- You can designate a user as a group manager
- Group managers can view all assignments and activities in their managed groups

---

## 8. Setting permissions

### Permission levels
Origami has three scope levels for permissions:
1. **Entity Level** — controls access to the entire entity
2. **Field Group Level** — controls access to groups of related fields
3. **Field Level** — controls individual field access (most granular)

### Permission types
For each level, you can set:
- **View** — can see the data
- **Edit** — can modify the data
- **Create** — can create new records
- **Delete** — can delete records

### How to set permissions
1. Go to **Settings > Permissions**
2. Select an **Entity**
3. Select a **User Group**
4. Check/uncheck permission boxes for View, Edit, Create, Delete
5. For field-level permissions: go into the entity's field settings and set per-field
   access per group

### Permission strategies
- **Broad then restrict**: Give edit access at the entity level, then restrict sensitive
  fields to view-only
- **Creator-based**: Users can only edit records they created
- **Assignment-based**: Users can only see/edit records assigned to them via a User Relation field

---

## 9. Creating a formula field

1. Go to the entity > **Settings** > **Fields**
2. Add a new **Formula** field (drag it from the palette or add from field list)
3. Open the formula editor

### Write the formula
- Click `#` to insert field variables
- Write PHP-like syntax (see feature-reference.md for full language reference)
- Common examples:
  - Full name: `#first_name . " " . #last_name`
  - Total: `#price * #quantity`
  - Status label: `#score >= 90 ? "Excellent" : "Needs work"`

### Use the AI assistant
- Click the AI button (sparkle/wand icon)
- Describe what you want in plain English
- Include null-handling instructions: "if the field is empty, return 0"

### Test before saving
- Enter a record ID in the test runner below the editor
- Click Run to see the output
- Test with both populated and empty records

### Save
- Save the formula field settings
- The field will auto-calculate for all existing and new records

---

## 10. Setting up linked views (reverse links)

Linked views show related records from another entity inside a record (e.g., show all Tasks
inside a Project record).

1. Go to the entity where you want to see linked records (e.g., Project)
2. Open the **Views panel > Reverse Link** section
3. Click **"Add New Link"**
4. Configure:
   - **Link Name**: label shown as section title (e.g., "Tasks")
   - **Field Name**: select the relation field on the other entity that points back (e.g.,
     Task's "Project" Instance Relation field)
   - **Button Position**: where the table appears (top of record or after a specific field group)
   - **Filter by Default**: auto-filter to show only records linked to this parent
5. Save

You can add multiple linked views on one entity (e.g., Project can embed Tasks, Comments,
and Documents).

---

## 11. Configuring email (SMTP)

1. Go to **Settings > System Preferences > Email**
2. The built-in "Origami System Email" (no-reply@origami.ms) is always available
3. To add a custom SMTP account:
   - Click **"Add SMTP Account"**
   - Fill in: Name, Auth Type (None/SSL/TLS), Host Server URL, Email From, Port, Username,
     Password
   - Set status to **Active**
   - Click **"Test Send"** to verify

**Important:** Without a configured and active SMTP account, email workflow actions will
silently fail.

---

## 12. Setting up conditional styling

Apply color-coding to rows or fields in views based on data values.

1. Go to the entity's view settings
2. Find **Conditional Design** or **Conditional Styling**
3. Click **"Add Rule"**
4. Configure:
   - **Rule Name**: identifier
   - **Color**: background color for matching records
   - **Field to Highlight**: specific field, or leave empty to color entire row
   - **Filter Criteria**: conditions that trigger the styling (e.g., Priority = "High")
5. Save

**Tips:**
- Use intuitive colors (red = urgent, green = complete)
- Don't overdo it — too many colors create visual noise
- Ensure colors are accessible (avoid relying solely on color for meaning)

---

## 13. Creating an action button

Action buttons let users trigger workflows manually from a record or view.

1. Go to **Settings > Automation** and create a new workflow
2. Set the trigger type to **Action Button**
3. Configure the button:
   - **Button Text**: label (e.g., "Approve", "Send Invoice")
   - **Button Type**: where it appears
     - Bulk action in table views
     - Inner button during record editing
     - Quick action in table rows
     - On a specific field group
   - **Icon** and **Color** for visual identification
4. Add conditions and actions as with any workflow
5. Save and enable

---

## 14. Configuring a dashboard / widget page

1. Click the **"+" in the second row** (tab bar) of the relevant category
2. Choose **"Dashboard"** as the page type
3. Name the dashboard (e.g., "Sales Dashboard", "Operations Overview")
4. On the dashboard page, add widgets:
   - Data Table, Pie Chart, Column Chart, KPIs panel, Trend Chart, Funnel Chart, etc.
5. Configure each widget's data source, filters, and display options
6. Arrange widgets by dragging and resizing

---

## 15. Exporting data and reports

### Quick export from a view
- Most table views have an **Export** button (usually as a download icon)
- Exports the current view's data (with active filters applied)
- Formats: typically CSV or Excel

### Report export via workflow
- Create a workflow with a **Report Export** action
- Select the report, format (PDF/Excel/CSV), and delivery method (email or file)
- Can be triggered manually (action button) or scheduled

### Building reports
- The Reporting section in Origami lets you build tabular and summarized reports across
  entities
- For visual dashboards, use Widget Pages (see section 14)
