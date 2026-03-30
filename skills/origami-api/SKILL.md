---
name: origami-api
description: >
  Use this skill when the user asks about the Origami API, wants to "integrate with Origami",
  "connect to Origami", "use the Origami API", "create records via API", "query Origami data",
  "build an Origami integration", "automate Origami", or needs help with API calls, filters,
  endpoints, authentication, error handling, or any programmatic interaction with Origami.ms.
metadata:
  version: "1.0.0"
---

# Origami API Integration Guide

Help users integrate with the Origami.ms REST API. All requests are POST with JSON bodies.
Authentication is inline (username + api_secret in every request body — no Bearer tokens).

## Quick Reference

Three base URL patterns exist:

- **Entity API**: `https://<ACCOUNT>.origami.ms/entities/api/<ENDPOINT>/format/json`
- **Invoice API**: `https://<ACCOUNT>.origami.ms/invoices/api/<ENDPOINT>`
- **UI API**: `https://<ACCOUNT>.origami.ms/ui/api/<ENDPOINT>`

## MCP Tools Available

When the Origami MCP server is connected, use these tools directly:

| Tool | Purpose |
|------|---------|
| `origami_list_entities` | Discover all entities in the account |
| `origami_entity_structure` | Get full schema (fields, groups, types) for an entity |
| `origami_create_instance` | Create a new record |
| `origami_query_instances` | Read/search records with filters and pagination |
| `origami_update_instance` | Update fields on existing records |
| `origami_remove_instance` | Permanently delete records |
| `origami_upload_file` | Attach a file to a record |
| `origami_add_group_repetition` | Add a row to a repeatable group |
| `origami_remove_group_repetition` | Remove a row from a repeatable group |
| `origami_archive` | Soft-delete (archive) or restore a record |
| `origami_query_protected` | Query protected entities like origami_users |
| `origami_create_invoice` | Create invoice documents |
| `origami_query_invoices` | Query existing invoices |
| `origami_push_notification` | Send push notification to a user |

## Working with Records

### Discovery flow (always do this first)

1. Call `origami_list_entities` to find the entity_data_name
2. Call `origami_entity_structure` with that entity_data_name to get field names and group names
3. Now create, read, update, or delete records using the correct data_names

### Create: use form_data with group objects

```json
{
  "entity_data_name": "e_725",
  "form_data": [
    {
      "group_data_name": "g_1790",
      "data": [{ "fld_11693": "John", "fld_11694": "Doe" }]
    }
  ]
}
```

The `data` array must contain a **single object** with all field key-value pairs. Never send separate objects per field.

### Read: use filters as array-of-arrays

```json
{
  "entity_data_name": "e_725",
  "filter": [["fld_11693", "=", "John"]]
}
```

**Critical**: Wrong filter format (e.g. array of objects) silently returns ALL records without error.

### Update: uses filter + field triplets (NOT form_data)

```json
{
  "entity_data_name": "e_725",
  "filter": [["_id", "=", "abc123"]],
  "field": [["fld_11693", "New Name", 0]]
}
```

Field triplet format: `[field_data_name, new_value, group_index]`. group_index is 0 for non-repeatable groups.

### Delete: use _ids array or filter

```json
{ "entity_data_name": "e_725", "_ids": ["abc123"] }
```

## Critical Gotchas

1. **All responses return HTTP 200** — check the JSON body for errors
2. **Filters must be array-of-arrays** — wrong format silently returns all data
3. **Create uses form_data, Update uses filter+field** — completely different formats
4. **Phone format**: must be `XXX-XXXXXXX` (e.g. `050-1234567`)
5. **Archive endpoint** has NO `/format/json` suffix and uses `id` (not `_id`)
6. **Invoice endpoints** use `/invoices/api/`, not `/entities/api/`

## Detailed Reference

Read `references/api-complete.md` for the full API documentation including all field types,
filter operators, date filters, geo-location filters, calendar events, repeatable groups,
file uploads, invoice system, and error reference.
