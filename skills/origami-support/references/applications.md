# Origami Application Pages & Integrations

Origami ships with five built-in application types, all pre-installed under the **Apps**
navigation group. Each can only exist once per account. This reference covers setup,
configuration, and troubleshooting for each.

---

## Table of contents

1. WhatsApp Application (connecting WhatsApp Business API)
2. Email Application
3. PBX Application (telephony / Voicenter)
4. SMS Sender
5. Weaver (Node-RED automation)
6. Omnichannel Widget (embedding in records)
7. Web Forms
8. Documents and Agreements
9. Meeting Schedule

---

## 1. WhatsApp Application

**Page title:** "WhatsApp (Beta)"
**Location:** Apps navigation group > WhatsApp page

### What it does
Full messaging interface inside Origami for sending and receiving WhatsApp messages linked
to entity records. Includes a conversation list view and a chat detail view (CometChat-based).

### Message log
The main view shows a table with columns: From, To, Date, Sending Type (Incoming/Outgoing),
and Message. Click a row to open the full conversation thread for that contact.

### Menu actions
- **"Manage Whatsapp"** — opens the main message list
- **"Whatsapp Manage Config"** — opens the admin configuration panel
- **Export** button — exports the current message list

---

### Connecting WhatsApp Business API (step-by-step)

This is the most common support question for WhatsApp. Here's exactly how it works:

#### Prerequisites
- A **WhatsApp Business API** account set up in **Meta Business Manager**
  (business.facebook.com)
- Your **App ID**, **App Secret**, and **System User API Token** from Meta
- A registered phone number with **Phone Number ID** and **Business Account ID**

#### Step-by-step setup

1. Go to the **WhatsApp application page** in Origami (under Apps)
2. Click the **"Whatsapp Manage Config"** menu action
3. In the left sidebar, click **"Add Account"** (the + button)
4. Choose a connection method:
   - **"Login with Facebook"** — OAuth flow (simpler, recommended)
   - **"Manual Configuration"** — enter credentials manually

#### If using Manual Configuration, fill in:

**WhatsApp Settings section:**
| Field | Value | Notes |
|---|---|---|
| Account Name | Your label (e.g., "Company WhatsApp") | Required |
| App ID | From Meta Business Manager | Required |
| App Secret | From Meta Business Manager | Required |
| System User API Token | From Meta Business Manager | Required, long-lived token |
| Webhook Verify Token | Any string you choose | Required — use this same token in Meta's webhook config |
| Account Status | Select "Approved" | Required |
| Endpoint URL | **Auto-populated by Origami** | This is the webhook URL you copy into Meta |

**WhatsApp Numbers section:**
| Field | Value | Notes |
|---|---|---|
| WhatsApp Number | Your registered number | Required |
| Phone Number ID | From Meta Business Manager | Required |
| Business Account ID | From Meta Business Manager | Required |

Click **"Add +"** to register multiple numbers per account.

**Permission Settings section:**
- **Full Permission for All** — checkbox to grant all users access
- **Full Permission** — multi-select to pick specific user groups

5. Click **"Save Whatsapp Config"**

#### Getting the Webhook URL for Meta

This is the key step most people need help with:

1. In the WhatsApp Manage Config panel, select your connected account
2. The **Endpoint URL** field is **auto-populated** by Origami with the system's public
   webhook URL
3. **Copy this URL**
4. In **Meta Business Manager** > your WhatsApp app > **Configuration** > **Webhook**:
   - Paste the Origami Endpoint URL as the **Callback URL**
   - Enter the same **Webhook Verify Token** you set in Origami
   - Click **Verify and Save**
5. Subscribe to the webhook fields you need (typically: `messages`)

#### Message Templates

WhatsApp Business requires pre-approved message templates for outbound messages.

In the Manage Config panel, click **"Message templates"** in the left sidebar:
- View all templates in a table: Account, WhatsApp Number, Template Name, Category,
  Language, Status
- **Create Template:** click the button and fill in:
  - Account (dropdown), WhatsApp Number (dropdown)
  - Template Name, Category (Marketing or Utility), Language
  - Content (max 1000 characters)
  - Template Buttons (optional interactive buttons)
- Templates must be approved by WhatsApp/Meta before they can be used
- Status shows: pending, approved, or rejected

---

### WhatsApp Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Messages not sending | Account not connected or token expired | Recheck credentials in Manage Config; regenerate System User API Token in Meta |
| Webhook not receiving messages | Endpoint URL not set in Meta | Copy Origami's Endpoint URL to Meta webhook config |
| "Verify Token mismatch" in Meta | Token in Origami doesn't match Meta | Ensure Webhook Verify Token is identical in both systems |
| Template rejected by WhatsApp | Content violates WhatsApp policy | Review Meta's template guidelines; resubmit |
| Phone number not recognized | Phone Number ID or Business Account ID wrong | Verify IDs in Meta Business Manager match Origami config |
| Messages going to wrong number | Multiple numbers registered; wrong one selected | Check which number is selected in the workflow or send action |

---

## 2. Email Application

**Page title:** "Email App"
**Location:** Apps navigation group > Emails page

### What it does
Full email client embedded in Origami. Connect one or more email accounts (OAuth or SMTP),
view inbox, sent items, and link emails to entity records.

### Menu actions
- **"Manage Email App"** — opens the main outbox list
- **"Configurations"** — opens the admin settings panel

### Email accounts
The left sidebar shows two sections:
- **OAuth connections** — for Gmail or Microsoft 365 (OAuth-authenticated)
- **SMTP connections** — for standard SMTP accounts

### Configuration
- **Account Name** — label for the account
- **Account Email** — read-only once connected
- **Provider** — Gmail or Microsoft 365 (for OAuth connections)
- **Permission Settings** — control which user groups can access the email app

### Outbox columns
From, To, CC, Subject, Message, Attachment, Date

**Note:** This is separate from the SMTP accounts configured in **Settings > System
Preferences > Email** (which are used for workflow email actions). The Email App is for
interactive email, while System Preferences SMTP is for automated workflow emails.

---

## 3. PBX Application (Telephony)

**Page title:** "PBX Application (Beta)"
**Location:** Apps navigation group > PBX page

### What it does
Integrates with a telephony system (e.g., Voicenter) for call management: call logs,
click-to-call, and call routing. Calls can be linked to entity records for CRM-style
call tracking.

### Call log columns
Call ID, Call Type (Inbound/Outbound), Caller Number, Callee Number, Representative,
Extension, Call Status (Answered/Rejected/Calling), Start Time, End Time, Duration,
Creation Date

### Menu actions
- **"Manage PBX App"** — main call log list
- **"PBX App Manage Config"** — admin telephony configuration

### Configuration

**PBX Settings:**
| Field | Value | Notes |
|---|---|---|
| Account Name | Label for the telephony account | Required |
| Status | Toggle switch (enabled/disabled) | Required |
| Take Call URL | Dropdown — URL for inbound call event dispatch | Required |
| Call Entry URL | **Auto-populated** (system's public PBX webhook endpoint) | Copy this to your PBX provider (e.g., Voicenter) |
| Secret Key | Shared secret for authenticating webhook calls | For secure communication |

**Call ID Mapping** (resolves incoming caller IDs to CRM records):
| Field | Purpose |
|---|---|
| Select Entity | Which entity to search (e.g., Contacts) |
| Phone Number | Entity field matched against caller's number |
| First Name | Entity field for caller first name |
| Last Name | Entity field for caller last name |

**Permission Settings:**
- Full Permission for All (checkbox)

### Connecting a PBX provider (e.g., Voicenter)
1. Go to PBX App > **"PBX App Manage Config"**
2. Fill in Account Name, enable Status
3. Copy the **Call Entry URL** (auto-populated webhook endpoint)
4. In your PBX provider's dashboard, paste the Call Entry URL as the webhook/callback URL
5. Set the Secret Key in both Origami and the provider
6. Configure Call ID Mapping to match callers to your CRM entity
7. Save

---

## 4. SMS Sender

**Page title:** "SMS Mailing System"
**Location:** Apps navigation group > SMS page

### What it does
Bulk and individual SMS messaging capabilities. Send SMS campaigns or individual messages
linked to entity records through a connected SMS gateway.

### Main view columns
Campaign Name, Sent To, Campaign Start Time, Campaign Status

### Menu actions
- **"Manage Campaign"** — main campaign list
- **"Configurations"** — admin SMS gateway settings
- **"Reminders Settings"** — configure SMS reminders

### Usage
- Click **"+ New Campaign"** to create a new SMS campaign
- Configure the SMS gateway in Configurations (phone number, provider settings)
- SMS can also be sent via workflow actions (see workflow reference)

---

## 5. Weaver (Node-RED)

**Page title:** "Weaver"
**Location:** Apps navigation group > Weaver page

### What it does
Visual programming environment powered by **Node-RED** for building automation flows.
Wire together APIs, services, and Origami data flows using drag-and-drop nodes. Build
data transformation pipelines, scheduled tasks, or webhook integrations without code.

### How it works
The page loads the Node-RED interface in an embedded iframe. Administrators can:
- Create and deploy automation flows visually
- Connect Origami data to external services
- Build custom webhook endpoints
- Set up scheduled data processing

### Who should use it
Advanced administrators or developers who need automation beyond what standard Origami
workflows offer. Weaver is powerful but requires understanding of the Node-RED paradigm.

---

## 6. Omnichannel Widget

The **Omnichannel Widget** is one of the 13 widget types available in both Widget Pages
(dashboards) and embedded in records via the Visual Editor.

### What it does
Provides a unified communication interface within a record, consolidating messages from
multiple channels (WhatsApp, Email, SMS) into a single view. This lets agents see all
communication history with a contact or account in one place.

### Where to add it
- **Widget Pages:** Click "+" on a widget page > select Omnichannel Widget
- **Record detail view:** Visual Editor > Widgets toolbar > Omnichannel Widget

### Configuration
Set the data source and channel filters. The widget aggregates communication from the
connected applications (WhatsApp, Email, SMS) linked to the current record's entity.

### Prerequisites
At least one communication application (WhatsApp, Email, or SMS) must be configured
and connected for the Omnichannel Widget to show data.

---

## 7. Web Forms

**Location:** Entity gear icon > Forms and Documents

### What they do
Standalone, publicly shareable forms that external users (no Origami login needed) can
fill out. Each submission creates a new record in the linked entity.

### Creating a web form
1. Navigate to the entity > click gear icon > **Forms and Documents**
2. Create a new webform with:
   - **Field selection** — which entity fields to include
   - **Required fields** — mark fields as mandatory on the form
   - **Form title and description**
   - **Success message** — displayed after submission
   - **reCAPTCHA** — anti-spam protection (optional)
3. Save to generate a unique public URL
4. Copy and share the URL, or embed it in a website

### Supported field types in web forms
Text, number, single/multi-select dropdowns, date, checkbox, phone, email, file upload

### Form modes
- **Create mode:** Base URL format: `{base-url}/s/webform/{env}/{form-token}`
  All fields empty; submission creates a new record
- **Edit mode:** Append instance ID: `{base-url}/s/webform/{env}/{form-token}/{instance-id}`
  Fields pre-populated; submission updates the existing record

### Multi-page forms
Web forms can span multiple pages with Previous/Next navigation buttons.

### Common web form issues
See `troubleshooting.md` > section 13 for diagnosis steps.

---

## 8. Documents and Agreements

**Location:** Entity gear icon > Forms and Documents

### What it does
Create reusable document templates (contracts, NDAs, quotes, onboarding packets, service
agreements) tied to an entity. Templates use **merge tags** that reference entity field
values — when generated, Origami substitutes the record's values and produces a formatted
PDF.

### Features
- Merge tags for dynamic field substitution
- PDF output
- Can be downloaded directly or sent for electronic signature
- Triggered via workflow ("Fill up a Document" or "Send a Contract" action) or manually

---

## 9. Meeting Schedule

**Location:** Entity settings

### What it does
Calendar-based appointment booking for external users or leads to book time slots with
a team member. Generates a shareable scheduling page.

### Configuration options
- **Date range** — when meetings can be booked
- **Duration** — preset or custom meeting length in minutes
- **Weekly availability** — select days and time windows (multiple per day)
- **Buffer time** — gap before/after meetings (optional)
- **Minimum notice** — how far in advance bookings must be placed
- **Future scheduling limit** — how far ahead meetings can be booked (optional)
- **Maximum meetings** — cap per day or per week (optional)
- Live calendar preview updates as you configure

---

## Single-Instance Enforcement

Each application type can only exist once per account. The system disables adding a
second copy of any already-installed application. If all five types are installed, no
new application pages can be created. To change an application's category/location,
you'd need to delete and re-add it (which may lose configuration — proceed with caution).

---

## Workflows Inspector

A real-time workflow execution monitor is available in the bottom panel of the Origami
interface on all pages. It has two tabs:
- **System Structure** — shows current page's entity and data layout
- **Workflows Inspector** — shows live and recently completed workflow runs

The inspector table displays: Workflow Name, Action Type, Action, Entity Name, Instance ID,
and User. Use the **"Myself"** checkbox to filter to your own triggered workflows, and the
search box to filter by workflow name.

This is invaluable for debugging — if a workflow isn't firing or is producing unexpected
results, check the Workflows Inspector to see if it ran and what actions it executed.
