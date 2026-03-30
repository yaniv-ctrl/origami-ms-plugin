# Origami FAQ — Quick Answers

Frequently asked questions about Origami.ms, organized by topic.

---

## General

**What is Origami?**
Origami (origami.ms) is a no-code/low-code platform for building custom business
applications. You create entities (data types), add fields, build views, set up workflows,
and manage permissions — all without writing code. It's used for CRMs, project management,
help desks, HR systems, property management, and many other business processes.

**What browsers does Origami support?**
Origami works in modern browsers: Chrome, Firefox, Edge, Safari. Chrome is recommended for
the best experience.

**Is there a mobile app?**
Origami has a responsive web interface that works on mobile browsers. Check with your
account manager for the latest on native mobile app availability.

**What languages does Origami support?**
English, Hebrew, Spanish, French, Dutch, Chinese, Arabic, Portuguese, German, Russian,
Japanese, Italian, Hindi, Bengali, Korean, Turkish, and Vietnamese. Hebrew and Arabic
automatically switch to RTL layout.

**What's the difference between a Category and an Entity?**
A **Category** is a top-level navigation grouping (like a folder). An **Entity** is a
data type inside a category (like a spreadsheet or database table). Categories show in
the top nav bar; entities show as tabs in the second row.

---

## Fields

**What field types are available?**
Origami has 25+ field types including: Text, Single Selection, Multiple Selection, Free
Multi Selection, Email, Checkbox, Hyperlink, Telephone, Address, Text Area, HTML Editor,
File Upload, Instance Relation, Multi Instance Relation, User Relation, Multi User
Selection, Reference (lookup), Read Only, Hidden, Time Selector, Number Range, Range
Selector, Metadata, Formula, Signature, Password, Icon, and Color Picker.

**What's the difference between Instance Relation and Reference?**
An **Instance Relation** creates a link between two records (like a foreign key). A
**Reference** field is a read-only lookup that displays a value FROM a linked record.
You need an Instance Relation first, then you can add Reference fields to pull data through it.

**Can I make a field required after data already exists?**
Yes, but existing records with empty values for that field will become invalid. Add the
field as non-required first, populate values on existing records, then make it required.

**Can I rename a field?**
Yes. Go to the field settings and change the name. Note: if the field is referenced in
formulas, the formula variable may break. Re-insert the field via the `#` picker in the
formula editor.

**What's a Repeating Group?**
A field group with the "Repeating" toggle enabled. It creates a mini-table inside a record
where users can add multiple rows — like line items on an invoice or entries in a time log.

---

## Views

**What view types are available?**
Table, Kanban, Calendar, Map, Gantt, and Gallery.

**Why don't my records show up in a view?**
Most likely: (1) a filter is active that excludes them, (2) the user doesn't have View
permission, or (3) the records don't have the required field populated (e.g., date for
Calendar view, address for Map view).

**Can different users see different views?**
Yes. You can set different default views per user group, and users can switch between
available views. Permissions control which entities and fields each group can see.

**What are Top Filters vs. Side Filters?**
Side Filters are a fixed sidebar panel — always visible, simple filtering. Top Filters are
an icon-triggered dropdown with advanced features: column reordering, visibility toggles,
and saved filter presets.

---

## Workflows

**What can trigger a workflow?**
Record creation, field update, record deletion, record view, a user clicking an action
button, a scheduled time, and repeatable group creation/deletion.

**How many actions can a workflow have?**
There's no hard limit. You can chain multiple actions in sequence. But keep workflows
focused — it's better to have two clear workflows than one complex one.

**Can a workflow update a related record?**
Yes. The **Update Fields** action can target the current record or navigate through
relation fields to update related records.

**Why does my email workflow fail silently?**
Almost always because SMTP is not configured. Go to **Settings > System Preferences >
Email** and ensure at least one SMTP account is Active. Use "Test Send" to verify.

**Can I use AI in workflows?**
Yes. The **AI Automation** action lets you use ChatGPT, Gemini, Grok, or Claude in
workflows. You need at least one AI provider API key configured in **Settings > System
Preferences > AI Settings**.

**What's the difference between "Before" and "After" trigger timing?**
"Before" fires before the triggering action completes (useful for validation — you can
block a save). "After" fires after the action is done (default — good for notifications
and updates).

---

## Imports

**What file formats does Origami accept for import?**
CSV and XLSX (Excel). Max file size: 30 MB.

**Can I import relations between records?**
Yes, but import parent records first. Then import child records where the relation column
contains the parent record's display name (must match exactly).

**How do I update existing records via import?**
In Phase 2 of the import wizard, enable **"Update by Key Field"** at the bottom. Select
the field(s) that uniquely identify records (e.g., email, ID). Origami matches rows by
key field and updates existing records.

**Why are my dates importing wrong?**
Origami expects ISO format (YYYY-MM-DD). Excel dates stored as serial numbers won't
import correctly — format them as text in the spreadsheet first.

**What happens to workflows during import?**
Workflows on the target entity will fire for each imported record. For large imports,
disable workflows first to avoid slowdowns, then re-enable after.

---

## Permissions

**How does the permission system work?**
Permissions are assigned to **user groups**, not individual users. You set View/Edit/Create/Delete
at three levels: entity, field group, or individual field. The most permissive rule wins
when a user belongs to multiple groups.

**Can I make records visible only to their creator?**
Yes. Use "Creator-Specific" permission vectors — these apply only to records the user
created.

**Can I restrict access based on a field value?**
Yes. Use "Assignment-Based" permissions with a User Relation field, or set up row-level
access rules that filter records based on the logged-in user's assignment.

---

## Formulas

**What language do formulas use?**
A restricted PHP-like syntax. It supports variables (#field_name), arithmetic, string
functions, date functions, conditionals (if/else, ternary), and type casting. No loops,
database queries, or network calls.

**My formula works on some records but errors on others. Why?**
Almost certainly because some records have empty fields. The formula tries to do math or
string operations on null values. Add null checks: `#field != "" ? #field * #rate : 0`

**Can a formula reference fields from a related record?**
No. Formulas only access fields on the same record. To use a value from a related record,
create a Reference field to pull that value, then reference the Reference field in your formula.

**Is there an AI that can write formulas for me?**
Yes. The formula editor has a built-in AI assistant. Click the AI button and describe what
you want in plain English. It knows the available fields and syntax constraints.

---

## System and Security

**How do I set up MFA?**
Go to **Settings > System Preferences > Security**. Set MFA to "Optional" or "Mandatory."
Users will need an OTP app like Google Authenticator.

**Can I restrict access by IP address?**
Yes. Go to **Settings > System Preferences > Security > IP Authorization**. Admin users
are always exempt to prevent accidental lockouts.

**Does Origami support SSO?**
Yes. Origami supports LDAP (Active Directory) and Azure AD. Configure in **Settings >
System Preferences > Active Directory Settings**.

**How do I change the system timezone?**
Go to **Settings > System Preferences > General Settings > Timezone**.

**Where can I get more help?**
Contact Origami support at **support@origami.ms** or reach out to your account manager.

---

## Web Forms

**What are Origami web forms?**
Web forms are external-facing forms that allow people outside your organization (or without
Origami accounts) to submit data directly into an Origami entity. They're commonly used for
lead capture, support ticket submission, customer intake forms, and similar use cases.

**My web form isn't working / submissions aren't going through. What should I check?**
The most common causes are: required fields on the entity that aren't included in the form
(submissions fail silently), conditional visibility rules that behave differently in web
forms than in the internal UI, and Validation workflows that block record creation. Start
by testing the form yourself and checking the entity for new records.

**Can web forms have conditional fields?**
Yes, but conditional visibility in web forms can be limited compared to the internal UI.
Test thoroughly with different field value combinations. If conditionally visible fields
are also required, they may block submission when hidden.

**Can I customize the look of web forms?**
Web forms have basic styling options. For advanced customization, you can embed the form
in an iframe on your own website and style the surrounding page.

---

## API and Integrations

**Does Origami have an API?**
Yes. Origami provides a REST API that allows external systems to create, read, update, and
delete records. You need an API token from your account settings.

**How do I connect Origami to Make.com (Integromat)?**
Use your Origami subdomain and API token to set up the connection in Make.com. The
subdomain is the part before `.origami.ms` in your URL (e.g., if your system is at
`mycompany.origami.ms`, your subdomain is `mycompany`).

**Can Origami send data to external systems?**
Yes. Use the "Call External Service" workflow action to make HTTP requests (GET, POST, PUT,
DELETE, PATCH) to any external API or webhook. You can pass record data in the request body
using value tags.

**How do I connect Origami to Google Calendar?**
Calendar integration is configured in the Calendar view settings. You'll need to
authenticate with your Google account. Events from Origami's calendar view can sync
with Google Calendar.

---

## WhatsApp

**Can Origami send WhatsApp messages?**
Yes. Origami has a full WhatsApp Application (under Apps navigation) that integrates with
WhatsApp Business API via Meta. It supports both sending and receiving messages, message
templates, and links conversations to entity records. You can also use the "Send WhatsApp
Message" workflow action for automated messages.

**How do I connect WhatsApp Business API to Origami?**
Go to the WhatsApp application page > "Whatsapp Manage Config" > "Add Account". You can
connect via "Login with Facebook" (OAuth, simpler) or "Manual Configuration". For manual
setup, you need your App ID, App Secret, System User API Token, and Webhook Verify Token
from Meta Business Manager. See `applications.md` for the full step-by-step guide.

**Where do I find the Webhook URL to put in Meta?**
In the WhatsApp Manage Config panel, select your connected account. The **Endpoint URL**
field is auto-populated by Origami with your system's public webhook URL. Copy this URL
and paste it as the Callback URL in Meta's webhook configuration. Use the same Webhook
Verify Token in both places.

**My WhatsApp messages aren't sending. What's wrong?**
Common causes: account not connected or token expired (recheck credentials), phone numbers
not in international format (must include country code like +972...), message templates not
approved by WhatsApp, or webhook not configured in Meta. Check the Workflows Inspector
(bottom panel) to see if the workflow ran.

---

## Document Generation

**Can Origami generate PDFs or documents?**
Yes. Use the "Fill up a Document" workflow action with a template. Origami populates
template placeholders with record field values and can output PDF or Word documents.

**My generated document has missing data / wrong formatting.**
Check that the template placeholders match the field mappings exactly (case-sensitive).
For RTL languages (Hebrew, Arabic), ensure the template and fonts support RTL rendering.

---

## Bulk Operations

**Can I edit multiple records at once?**
Yes. Use the bulk action feature in table views — select multiple records and use bulk
update options. You can also create a workflow with a "Bulk Update" action that updates
all records matching certain criteria.

**Can I bulk delete records?**
Bulk deletion is available through the table view selection. Select records and use the
delete option. Be careful — this is permanent. Consider archiving instead.

---

## Application Pages

**What application pages does Origami have?**
Origami ships with five built-in applications under the Apps navigation group: WhatsApp
(messaging), Email App (full email client), PBX (telephony/Voicenter), SMS Sender
(bulk SMS campaigns), and Weaver (Node-RED visual automation). Each can only exist once
per account. See `applications.md` for full setup details.

**What is the Omnichannel Widget?**
A widget type you can embed in records (via Visual Editor) or on dashboard pages. It
consolidates messages from WhatsApp, Email, and SMS into a single unified view for each
record, so agents can see all communication history in one place. Requires at least one
communication application to be configured.

**What is Weaver?**
Weaver is Origami's advanced automation tool, powered by Node-RED. It provides a visual
drag-and-drop interface for building data pipelines, scheduled tasks, webhook integrations,
and custom API connections. It's more powerful than standard workflows but requires more
technical knowledge.

**How do I connect a PBX / telephony system (e.g., Voicenter)?**
Go to Apps > PBX Application > "PBX App Manage Config". Fill in your account details, copy
the auto-populated Call Entry URL (webhook endpoint) to your PBX provider, set a shared
Secret Key, and configure Call ID Mapping to match incoming callers to your CRM records.
See `applications.md` for the full guide.

**How do I debug a workflow that isn't working?**
Use the **Workflows Inspector** — a real-time monitoring panel in the bottom of the Origami
interface (available on all pages). Switch to the "Workflows Inspector" tab to see live and
recent workflow executions with details on which actions ran. Use the "Myself" checkbox to
filter to your own triggers.
