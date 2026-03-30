# Data Model - Field Types Reference

## Text Field (Input Field)
A versatile text input field for capturing and managing textual data with extensive customization options.

**Key Settings:**
- Name, description (tooltip), uneditable toggle
- Data Type: Pre-made validations (positive/negative numbers, regex, IP addresses, Luhn's algorithm)
- Default Value: Pre-populate on record creation
- Min/Max Length: Control input length constraints
- Pre Text/Post Text: Add static text before/after value (e.g., currency symbols, units)
- Unique for Entity: Enforce uniqueness across all records
- Required checkbox

**Common Use Cases:** Generic text input, identifiers, descriptions
**Gotcha:** Pre/Post text is for display context only, not part of stored value

---

## Single Selection Field
Dropdown field allowing users to select one option from a predefined list.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Values List: Define selectable options
- Default Value: Pre-select an option
- Dynamic Option Availability: Show/hide options based on other field values
- User Group-Based Availability: Show different options per user group

**Common Use Cases:** Status, priority, category selection
**Gotcha:** Options can be conditional; options shown depend on record state and user group

---

## Multiple Selection Field
Allow users to select multiple options from a predefined list.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Values List: Define available options
- Min/Max Selection Limits: Require min/max number of selections
- Alphabetical Sorting: Sort options A-Z
- Close on Selection: Auto-close dropdown after selection

**Common Use Cases:** Tags, multi-category assignments, skills
**Gotcha:** Min/max limits must be satisfied or record won't save

---

## Free Multi Selection Field
Multiple selection field that also allows users to enter custom values (tagging field).

**Key Settings:**
- Name, description, required, uneditable checkboxes
- User-Generated Options: Users can add custom entries
- Min/Max Selection Limits: Control number of selections (including user-created)
- Built-in options + custom entries

**Common Use Cases:** Tagging, dynamic categorization, open-ended selections
**Gotcha:** User-created values are stored; no validation on custom entries

---

## Email Field
Specialized text field for email addresses with validation and integration capabilities.

**Key Settings:**
- Name, description, required checkbox
- Default Value: Set default email address
- Unique for Entity: Prevent duplicate emails
- Mailbox Integration: Link to Microsoft 365, Gmail, or Google Workspace
- Email Autocomplete: Suggest from user's existing contacts

**Common Use Cases:** Contact email, notification recipients, login identifiers
**Gotcha:** Integration with email services requires separate authentication setup

---

## Checkbox Field
Binary true/false field for yes/no decisions.

**Key Settings:**
- Name, description, required checkbox
- Uneditable: Lock value after creation
- Default Value: Set to checked (true) or unchecked (false)

**Common Use Cases:** Agreements, toggles, binary flags
**Gotcha:** Default matters; unchecked by default may confuse users

---

## Hyperlink Field
Specialized field for storing and displaying clickable URLs.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Default Value: Set default URL
- Displays as clickable link in record view

**Common Use Cases:** External resource links, documentation references
**Gotcha:** Field stores full URL; no automatic link validation beyond format check

---

## Telephone Field
Dedicated field for phone numbers with format customization.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Format: Choose country-specific format
- Default Country Code: Set default country for format

**Common Use Cases:** Contact numbers, emergency contacts, phone-based lookups
**Gotcha:** Format enforcement helps consistency; international numbers need proper prefix

---

## Address Field
Field for storing address data with map view integration.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Map View Enablement: Enable display on maps
- Stores complete address (street, city, state, zip, country)

**Common Use Cases:** Location data, customer addresses, service locations
**Gotcha:** Used by Map view type; ensure field enabled if using Map view

---

## Text Area Field
Multi-line text field for longer text content without HTML formatting.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Min/Max Length: Control total character count
- Default Value: Pre-populate with text
- Row Height: Customize display size

**Common Use Cases:** Comments, notes, descriptions, summaries
**Gotcha:** Plain text only; use HTML Editor for formatted content

---

## HTML Editor Field
Rich text editor field supporting HTML formatting.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Default Value: Can include formatted HTML
- Min/Max Length: Control content length
- Full HTML editing capabilities (bold, italic, lists, etc.)

**Common Use Cases:** Rich content, formatted documents, styled descriptions
**Gotcha:** Stores HTML; ensure end users understand formatting tools

---

## File Upload Field
Field for uploading and storing files.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Min/Max Size Limits: Restrict file size (in KB)
- Allowed File Types: Whitelist specific file extensions
- Multiple files per record allowed

**Common Use Cases:** Document storage, attachments, media files
**Gotcha:** File type restrictions enforce security; max size limits prevent storage overflow

---

## Instance Relation Field
Single-link field to another entity (one-to-one or many-to-one relationship).

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Target Entity: Select which entity to link to
- Filter Related Records: Optionally show only matching records
- Display Style: How to show related record (name, custom format)

**Common Use Cases:** Owner relationships, single assignments, master records
**Gotcha:** Deletion of related record may require handling; use with cascading rules if needed

---

## Multi Instance Relation Field
Multiple-link field to another entity (one-to-many or many-to-many relationship).

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Target Entity: Select entity to link to
- Min/Max Related Records: Control quantity of links
- Filter Related Records: Show only matching records
- Reverse Link Field: Create back-reference in related entity

**Common Use Cases:** Tag relationships, multi-assignments, collection ownership
**Gotcha:** Min/max constraints must be satisfied for valid record; reverse links create dependencies

---

## User Relation Field
Single-link field to user records (assigns user to record).

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Select single user for assignment
- Only links to enabled users

**Common Use Cases:** Record owner, primary contact, assigned reviewer
**Gotcha:** Disabled users won't appear in selection; use current user as default if needed

---

## Multi User Selection Field
Multiple-link field allowing assignment of multiple users to a record.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Min/Max User Limits: Control number of assignees
- Only links to enabled users

**Common Use Cases:** Team assignments, multiple reviewers, stakeholder tracking
**Gotcha:** Disabled users excluded from selections; limits must be satisfied

---

## Reference Field
Read-only field that displays data from a related record (lookup/foreign key).

**Key Settings:**
- Name, description
- Source Relation Field: Select relation field to pull data through
- Source Field: Select field from related entity to display
- Automatic lookup (calculated, not editable)

**Common Use Cases:** Display customer name from order, show project details
**Gotcha:** Read-only; changes in source automatically reflect here; breaks if source deleted

---

## Read Only Field
Text field that displays content but cannot be edited by end users.

**Key Settings:**
- Name, description
- Default Value: Content to display
- Uneditable by nature
- May be populated by workflows or formulas

**Common Use Cases:** Display calculated values, system-generated IDs
**Gotcha:** Content can only change via workflows or direct admin edit

---

## Hidden Field
Field invisible to users but accessible to workflows, formulas, and backend logic.

**Key Settings:**
- Name (administrative label only)
- Default Value: Key feature; stores static, calculated, or dynamic data
- Invisible to users; appears in API/workflows

**Common Use Cases:** Internal flags, workflow counters, tracking data
**Gotcha:** Hidden doesn't mean encrypted; don't store sensitive user data

---

## Time Selector Field
Field for capturing time-of-day values (hours and minutes).

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Default Value: Pre-set time
- Format: 12-hour or 24-hour display
- Stores time portion only (no date)

**Common Use Cases:** Appointment times, business hours, shift schedules
**Gotcha:** Separate from Date fields; use together for date+time range

---

## Number Range Field
Field for capturing a range with minimum and maximum numeric values.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Stores two values: min and max
- Numeric validation

**Common Use Cases:** Price ranges, age ranges, quantity estimates
**Gotcha:** Both min and max required; stores as pair, not individual values

---

## Range Selector Field
Visual field for selecting numeric values or ranges with slider interface.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Minimum Value: Lowest allowed value
- Maximum Value: Highest allowed value
- Default Value: Pre-selected value or range
- Step Size: Increment between selectable values

**Common Use Cases:** Rating scales, percentage sliders, quality levels
**Gotcha:** Step size must divide evenly into range for proper slider behavior

---

## Metadata Field
Field for storing system or structural metadata about records.

**Key Settings:**
- Name, description
- Auto-populated with metadata (not user-entered)
- May include timestamps, IDs, or system information

**Common Use Cases:** Record creation date, modification tracking
**Gotcha:** Content auto-generated; don't override without clear reason

---

## Formula Field
Calculated field that runs a PHP-like script to derive a value from other fields on the
same record. Recalculates automatically whenever any referenced field changes.

**Key Settings:**
- Name, description
- **Formula editor** — write the script directly, or use the built-in AI assistant (see below)
- **Field variables** — click `#` in the editor to insert a field reference; the field's
  current value is injected as a variable at runtime
- Dynamic recalculation on referenced field changes

**AI formula assistant:** The formula editor has an AI agent you can describe the
calculation to in plain text. It writes the formula script for you, taking into account the
available fields on the entity and the PHP-like syntax constraints. Use this as a starting
point, then tweak as needed.

**Testing tool:** Below the editor there's a test runner — enter the ID of any existing
record from the same entity and the formula will execute against that record's real data,
showing you the output and any errors. Use this before saving to catch syntax errors and
verify the logic is correct.

**Language constraints:** The formula language is a restricted PHP-like syntax. It supports:
- Variables (injected field values via `#field_name`)
- Arithmetic operators (`+`, `-`, `*`, `/`, `%`)
- String concatenation (`.`)
- Conditionals (`if` / `elseif` / `else`)
- Common PHP string functions (`strlen`, `strtoupper`, `strtolower`, `trim`, `substr`, `str_replace`, `strpos`)
- Common math functions (`round`, `ceil`, `floor`, `abs`, `max`, `min`)
- Date functions (`date`, `strtotime`, `mktime`)
- Type casting (`(int)`, `(float)`, `(string)`)
- Ternary operator (`condition ? value_if_true : value_if_false`)

It does NOT support: database queries, file I/O, network calls, loops over external data,
`eval`, or any PHP standard library functions beyond the above.

Read `references/formula-reference.md` for common patterns with worked examples.

**Common Use Cases:** Totals, concatenation of name fields, conditional labels, date differences, derived status
**Gotcha:** Empty field handling — if a referenced field is null/empty, arithmetic on it
will produce 0 or an error. Always guard with an `if` check or ternary before using a field
value in calculations. The AI assistant is good at this if you describe the null case.

---

## Signature Field
Field for capturing digital signatures.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Captures handwritten or typed signature
- Stores as image/vector

**Common Use Cases:** Approvals, consent documentation, legal agreements
**Gotcha:** Signature becomes immutable once captured; useful for audit trails

---

## Password Field
Field for storing encrypted password values.

**Key Settings:**
- Name, description
- Always stored encrypted
- Not displayed in forms (masked)

**Common Use Cases:** Credentials, secure stored credentials (e.g., for integrations)
**Gotcha:** Cannot be retrieved in plain text; workflows can set but cannot read

---

## Icon Field
Field for selecting and storing icons from a predefined set.

**Key Settings:**
- Name, description, required checkbox
- Icon Selection Interface: Visual picker
- Stores icon identifier/name

**Common Use Cases:** Status icons, category markers, visual identifiers
**Gotcha:** Limited to predefined icon library; no custom icon uploads

---

## Color Picker Field
Field for selecting and storing color values.

**Key Settings:**
- Name, description, required, uneditable checkboxes
- Color Selection Interface: Visual color picker
- Stores hexadecimal color value

**Common Use Cases:** Theme settings, visual tagging, category colors
**Gotcha:** Stores hex value; may need conversion for display in different formats

---

## Summary Table: Common Field Settings

| Setting | Text | Single Select | Multi Select | Email | Checkbox | Relation |
|---------|------|---|---|---|---|---|
| Name & Description | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Required | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Uneditable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Default Value | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Unique | ✓ | — | — | ✓ | — | — |
| Min/Max Length | ✓ | — | — | — | — | — |
| Min/Max Count | — | — | ✓ | — | — | ✓ |

---

## Field Permission Levels
All fields support:
- Entity-level access control
- Field group-level access control
- Field-level access control (view/edit/none)
- Based on user group, creator, or assignment

---

## Field Validation Strategy
- Use Data Type on Text fields for format validation
- Use Required checkbox to enforce presence
- Use Min/Max on numeric and selection fields
- Use Unique for constraint enforcement
- Use Read Only/Hidden for system fields
- Use Formula fields for complex multi-field validation
