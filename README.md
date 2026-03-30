# Origami.ms Plugin for Claude

Connect Claude to your Origami.ms account — read, create, update, and delete records, manage invoices, upload files, and get expert guidance on building Origami environments.

## What's Included

### MCP Server (14 tools)

Direct API access to your Origami account:

- **origami_list_entities** — discover all entities
- **origami_entity_structure** — get field schemas
- **origami_create_instance** — create records
- **origami_query_instances** — search and filter records
- **origami_update_instance** — update record fields
- **origami_remove_instance** — delete records
- **origami_upload_file** — attach files to records
- **origami_add_group_repetition** — add rows to repeatable groups
- **origami_remove_group_repetition** — remove repeatable group rows
- **origami_archive** — archive/unarchive records
- **origami_query_protected** — query protected entities (e.g. users)
- **origami_create_invoice** — create invoice documents
- **origami_query_invoices** — query invoices
- **origami_push_notification** — send push notifications

### Skills (3)

- **origami-api** — API integration guidance, endpoint reference, filter syntax, common gotchas
- **origami-support** — Troubleshooting, how-to guides, FAQ, feature reference for Origami users
- **origami-builder** — Design and build complete Origami environments from requirements

## Setup

### 1. Install dependencies

After installing the plugin, run:

```bash
cd <plugin-directory>/servers
npm install
```

### 2. Set environment variables

The MCP server requires three environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `ORIGAMI_ACCOUNT` | Your account subdomain | `mycompany` (for mycompany.origami.ms) |
| `ORIGAMI_USERNAME` | API user email address | `api@mycompany.com` |
| `ORIGAMI_API_SECRET` | API secret from Origami settings | `abc123...` |

To find your API secret: log into Origami → Settings → General Settings → Developer Section.

### 3. Recommended: set custom API names

By default, Origami uses auto-generated names like `e_725` and `fld_11693`. You can assign
human-readable API names (e.g. `leads`, `first_name`) in Settings → General Settings →
Developer Section. This makes working with the API much easier.

## Usage Examples

**"Show me all leads created this week"**
→ Uses origami_list_entities + origami_query_instances with date filters

**"Create a new contact for Acme Corp"**
→ Uses origami_entity_structure to discover fields, then origami_create_instance

**"My workflow isn't firing"**
→ Triggers the origami-support skill with troubleshooting guidance

**"Design an Origami system for a property management company"**
→ Triggers the origami-builder skill with implementation patterns

## Requirements

- Node.js 18+
- An Origami.ms account with API access enabled
