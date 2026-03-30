# Origami Feature Reference

Comprehensive reference for all Origami platform features. Use this for detailed specs
when the FAQ or how-to guide isn't enough.

---

## Table of contents

1. Field types (all 25+)
2. View types (all 6)
3. Workflow triggers
4. Workflow actions (all 22+)
5. Formula language reference
6. System settings
7. Permission model

---

## 1. Field Types

### Text-based fields
| Field | Purpose | Key settings |
|---|---|---|
| **Text Field** | Short text input | Data Type validation (regex, numeric, IP, Luhn), default, min/max length, pre/post text, unique |
| **Text Area** | Multi-line plain text | Min/max length, row height, default |
| **HTML Editor** | Rich text with formatting | Min/max length, default (can include HTML) |
| **Email** | Email with validation | Default, unique, mailbox integration (M365/Gmail), autocomplete |
| **Hyperlink** | Clickable URL | Default |
| **Telephone** | Phone number | Country format, default country code |
| **Password** | Encrypted text (masked) | Always encrypted, never displayed |

### Selection fields
| Field | Purpose | Key settings |
|---|---|---|
| **Single Selection** | One option from list | Values list, default, dynamic option availability, group-based availability |
| **Multiple Selection** | Multiple from list | Values list, min/max selections, alphabetical sort, close-on-select |
| **Free Multi Selection** | Multi-select + custom values | User can add new options, min/max limits |

### Numeric fields
| Field | Purpose | Key settings |
|---|---|---|
| **Number Range** | Min/max pair | Both values required |
| **Range Selector** | Slider interface | Min/max value, default, step size |

### Date/Time fields
| Field | Purpose | Key settings |
|---|---|---|
| **Date/Time** | Date with optional time | Format follows system settings |
| **Time Selector** | Time only (no date) | 12h or 24h format |

### Relation fields
| Field | Purpose | Key settings |
|---|---|---|
| **Instance Relation** | Link to one record | Target entity, filter, display style |
| **Multi Instance Relation** | Link to many records | Target entity, min/max count, filter, reverse link |
| **User Relation** | Link to one user | Only active users shown |
| **Multi User Selection** | Link to many users | Min/max user count |
| **Reference** | Read-only lookup | Source relation + source field (auto-calculated) |

### Special fields
| Field | Purpose | Key settings |
|---|---|---|
| **Checkbox** | Boolean yes/no | Default value (checked/unchecked) |
| **File Upload** | Attach files | Min/max size, allowed file types, multiple files |
| **Formula** | Calculated value | PHP-like script, AI assistant, test runner |
| **Read Only** | Display-only text | Populated by workflows or admin |
| **Hidden** | Invisible to users | For internal flags, workflow counters |
| **Address** | Full address + map | Enables Map view |
| **Signature** | Digital signature capture | Immutable once captured |
| **Metadata** | System metadata | Auto-populated (creation date, etc.) |
| **Icon** | Icon picker | From predefined library |
| **Color Picker** | Color selection | Stores hex value |

---

## 2. View Types

### Table View
- Spreadsheet-style grid
- Configurable columns, inline quick edit, filters
- Best for: general data browsing, editing

### Kanban View
- Card board grouped by a Single Selection field
- Drag cards between columns to update the flow field
- Best for: status-based workflows (sales pipeline, task boards)

### Calendar View
- Events positioned by date fields
- Monthly/weekly/daily views, drag-to-create, drag-to-reschedule
- Optional Resources view (split by resource fields)
- Best for: scheduling, appointments, deadlines

### Map View
- Google Maps integration with pins from Address fields
- Range radius filtering
- Best for: location-based data (service areas, customer mapping)

### Gantt View
- Timeline bar chart based on date ranges
- Configurable scale (2-20 years), conditional styling on bars
- Best for: project timelines, scheduling

### Gallery View
- Card grid with image thumbnails from File Upload fields
- Best for: product catalogs, media libraries, visual inventory

### Filters
- **Side Filters**: always-visible sidebar, basic field filtering
- **Top Filters**: icon-triggered dropdown with column reordering, visibility toggles,
  and saved filter presets

---

## 3. Workflow Triggers

| Trigger | Fires when | Notes |
|---|---|---|
| **On Instance Create** | New record created | |
| **On Field Update** | Specific field changes | Can target specific field or any field |
| **On Instance Delete** | Record deleted | |
| **On Instance View** | Record opened | Good for alerts |
| **On Repeatable Group Create** | Row added to repeating group | |
| **On Repeatable Group Delete** | Row removed from repeating group | |
| **Action Button** | User clicks custom button | Configurable placement and appearance |
| **Scheduled** | At set time/interval | Hourly, daily, weekly, monthly options |

**Trigger timing options:**
- Default, Before (fires before action completes), After (fires after action completes)

---

## 4. Workflow Actions

| # | Action | What it does |
|---|---|---|
| 1 | **Send Email** | Automated email to static/dynamic recipients |
| 2 | **Open New Window** | Open URL in new browser window |
| 3 | **Call External Service** | HTTP request (GET/POST/PUT/DELETE/PATCH) to API |
| 4 | **Bulk Update** | Update multiple records matching criteria |
| 5 | **Authentication Request** | Force re-authentication for sensitive actions |
| 6 | **Archive** | Move record to/from archive |
| 7 | **Send SMS** | Automated text message |
| 8 | **Update Fields** | Change field values on current or related records |
| 9 | **Copy Instance** | Duplicate record to another entity |
| 10 | **Report Export** | Generate and export report (PDF/Excel/CSV) |
| 11 | **Lock/Unlock** | Prevent or allow record editing |
| 12 | **Validation** | Block save if conditions not met |
| 13 | **Remove Instance** | Delete record(s) |
| 14 | **Notification** | In-app notification to users |
| 15 | **Create Repeatable Group** | Add row to repeating group |
| 16 | **Redirect to Instance** | Navigate user to different record |
| 17 | **External Database** | Execute SQL on external database |
| 18 | **Send Contract** | Generate and send contract document |
| 19 | **Display User Message** | Show popup/modal message |
| 20 | **AI Automation** | AI-generated content (ChatGPT/Gemini/Grok/Claude) |
| 21 | **Effects** | Visual effects on records |
| 22 | **Fill up a Document** | Populate document template from record data |
| — | **Lock File** | Lock files to prevent modification |
| — | **Send WhatsApp** | WhatsApp message (requires Business account) |

---

## 5. Formula Language Reference

### Available constructs
- **Variables**: `#field_name` (injected field values)
- **Arithmetic**: `+`, `-`, `*`, `/`, `%`
- **String**: `.` (concatenation), `strlen`, `strtoupper`, `strtolower`, `trim`, `substr`,
  `str_replace`, `strpos`
- **Math**: `round`, `ceil`, `floor`, `abs`, `max`, `min`
- **Date**: `date`, `strtotime`, `mktime`, `time`
- **Conditionals**: `if`/`elseif`/`else`, ternary (`? :`)
- **Casting**: `(int)`, `(float)`, `(string)`

### NOT supported
- Loops, database queries, file I/O, network calls, `eval`, most PHP standard library

### Common patterns
```
Full name:           #first_name . " " . #last_name
Percentage:          round((#score / #max_score) * 100, 1) . "%"
Days until date:     round((strtotime(#due_date) - time()) / 86400)
Null-safe math:      #field != "" ? #field * #rate : 0
Conditional label:   #status == "Active" ? "green" : "grey"
```

---

## 6. System Settings

### General Settings
- System Language (17 languages, RTL for Hebrew/Arabic)
- Date Format, Timezone, Number Format
- Chat toggle, Logo upload

### Security
- IP Authorization (restrict logins by IP)
- Country Authorization (restrict by country)
- MFA (Off / Optional / Mandatory)
- Session Length (15 min to 1 month)
- Password Policy (change interval, min length, complexity)

### SSO
- LDAP (Active Directory)
- Azure AD (Client ID, App Secret, Tenant ID, X509 cert, sync schedule)

### Email (SMTP)
- Multiple accounts supported
- Built-in Origami system email always available
- Custom SMTP: host, port, auth type (None/SSL/TLS), credentials
- Test Send button per account

### SMS
- Phone number and country configuration
- Custom number activation via finance@origami.ms

### AI
- API keys for: ChatGPT (OpenAI), Gemini (Google), Grok (xAI), Claude (Anthropic)
- At least one provider needed for AI workflow actions

---

## 7. Permission Model

### Scope levels
1. **Entity** — access to the whole entity
2. **Field Group** — access to a section of fields
3. **Field** — access to individual fields

### Permission vectors
1. **Group Membership** — applies to all users in a group
2. **Creator-Specific** — applies only if user created the record
3. **Assignment-Based** — applies based on User Relation field assignment

### Rules
- Permissions assigned to **groups**, not individuals
- Users can belong to multiple groups
- Most permissive rule wins (permissions are additive)
- Disabled users can't access anything but records remain intact
