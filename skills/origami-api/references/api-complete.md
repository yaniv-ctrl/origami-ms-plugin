# Origami API — Complete Documentation

**Version:** 2.3 (Calendar fields documented from internal docs — March 26, 2026)
**Last Updated:** March 25, 2026
**Verified Against:** stage.origami.ms

---

## Table of Contents

1. [Authentication & Base URL](#1-authentication--base-url)
2. [Entity Structure](#2-entity-structure)
3. [Create Instance](#3-create-instance)
4. [Read / Query Data](#4-read--query-data)
5. [Filters](#5-filters)
6. [Update Fields](#6-update-fields)
7. [Remove Instance](#7-remove-instance)
8. [Repeatable Groups](#8-repeatable-groups)
9. [File Upload](#9-file-upload)
10. [Archive](#10-archive)
11. [Calendar Events](#11-calendar-events)
12. [Protected Entities](#12-protected-entities)
13. [Push Notifications](#13-push-notifications)
14. [Invoice System](#14-invoice-system)
15. [Error Reference](#15-error-reference)
16. [Common Mistakes](#16-common-mistakes)

---

## 1. Authentication & Base URL

The Origami API uses a simple REST-style approach: every request is a **POST** with a JSON body. There are no Bearer tokens, no OAuth flows, and no special headers required — authentication credentials are sent directly in the request body alongside your parameters.

Origami exposes three separate API base paths depending on what you're working with:

**Entity API** — for all standard record operations (create, read, update, delete, file uploads, repeatable groups):
```
POST https://<ACCOUNT_NAME>.origami.ms/entities/api/<ENDPOINT>/format/json
```

**Invoice API** — for creating and querying invoices, receipts, and credit notes:
```
POST https://<ACCOUNT_NAME>.origami.ms/invoices/api/<ENDPOINT>
```

**UI API** — for user-facing actions like push notifications:
```
POST https://<ACCOUNT_NAME>.origami.ms/ui/api/<ENDPOINT>
```

Replace `<ACCOUNT_NAME>` with your Origami account subdomain (e.g., `mycompany` for `mycompany.origami.ms`).

**Authentication** is included in the JSON body of every request (NOT as a Bearer token or header):
```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>"
}
```

Your `username` is the email address of the API user, and the `api_secret` is generated in your Origami account settings. Every single request must include both fields — there is no session or token persistence between calls.

---

## 2. Entity Structure

Before you start working with records, you'll need to know which entities (tables) exist in your account and what fields they contain. These two endpoints let you discover the data model.

> **Tip: Custom API Names** — By default, Origami auto-generates internal names like `e_725` for entities, `g_1790` for field groups, and `fld_11693` for fields. These can be hard to work with. You can assign custom, human-readable API names (e.g., `leads`, `lead_details`, `first_name`) in **Origami Settings → General Settings → Developer Section**. Custom names make your API calls much easier to read and maintain — we strongly recommend setting them up before building any integration.

### List All Entities

**Endpoint:** `/entities/api/entities_list/format/json`

Returns every entity the API user has permission to access. Use this to discover `entity_data_name` values (e.g., `e_725`) which you'll need for all subsequent calls.

**Request:**
```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>"
}
```

**Response:**
```json
[
  {
    "entity_name": "Leads.",
    "entity_data_name": "e_725",
    "protected_entity": "0"
  },
  {
    "entity_name": "origami_users",
    "entity_data_name": "origami_users",
    "protected_entity": "1"
  }
]
```

### Get Entity Structure (Fields & Groups)

**Endpoint:** `/entities/api/entity_structure/format/json`

Returns the full schema of a specific entity — all field groups, field names, field types, data names, and validation rules. This is essential for building create/update requests, since you'll need the exact `group_data_name` and `field_data_name` values.

**Request:**
```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725"
}
```

**Response:**
```json
{
  "entity_data": {
    "entity_name": "Leads.",
    "entity_data_name": "e_725",
    "permissions": { "type": "full", "code": "1" },
    "protected_entity": "0",
    "view": "data table"
  },
  "instance_data": [
    {
      "field_group_data": {
        "group_name": "Lead Details",
        "group_data_name": "g_1790",
        "repeatable_group": "0",
        "permissions": { "type": "full", "code": "1" }
      },
      "fields_data": [
        {
          "field_name": "First Name",
          "field_type_name": "input-text",
          "field_data_name": "fld_11693",
          "placeholder": "Enter your text...",
          "custom_validation": { "unable_to_edit": "0", "data_type": "0" }
        }
      ]
    }
  ]
}
```

**Note:** The schema comes back in `instance_data` (an array of group objects), NOT in `data`. Each group contains a `fields_data` array listing every field with its type, data name, and validation constraints. Pay attention to `field_data_name` — that's the key you'll use in create and update calls.

---

## 3. Create Instance

Creates a new record (called an "instance") in a given entity. You provide the data organized by field groups — each group bundles related fields together (e.g., "Lead Details", "Address Info"). The response returns the new record's `_id`, which you'll need for subsequent updates or deletions.

**Endpoint:** `/entities/api/create_instance/format/json`

> **WARNING:** The endpoint is `create_instance`, NOT `create`.

**Request:**
```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "form_data": [
    {
      "group_data_name": "g_1790",
      "data": [
        {
          "fld_11693": "John",
          "fld_11694": "Doe",
          "fld_11695": "123456789",
          "fld_11696": "050-1234567",
          "fld_11731": "john@example.com"
        }
      ]
    }
  ]
}
```

**Key Rules:**
- `form_data` is an array of group objects
- Each group has `group_data_name` and `data`
- `data` must be an array with a **single object** containing all field key-value pairs
- Do NOT send separate objects per field — this causes `block_number` errors
- Phone fields require format `XXX-XXXXXXX` (e.g., `050-1234567`)

**Success Response:**
```json
{
  "success": "ok",
  "results": {
    "_id": "69c238525da1c30aa3094e56"
  }
}
```

### Create Instance with Multiple Groups

If your entity has more than one field group, include each group as a separate object in the `form_data` array. For example, a lead with both personal details and notes:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "form_data": [
    {
      "group_data_name": "g_1790",
      "data": [{ "fld_11693": "John", "fld_11694": "Doe" }]
    },
    {
      "group_data_name": "g_1791",
      "data": [{ "fld_11703": "Some notes here" }]
    }
  ]
}
```

---

## 4. Read / Query Data

Retrieves records from an entity. You can fetch all records, paginate through large datasets, filter by specific criteria, or look up a single record by its `_id`. The response includes pagination info, entity metadata, and the full field data for each matching record.

**Endpoint:** `/entities/api/instance_data/format/json`

> **Note:** The endpoint is `instance_data`, NOT `select`, `select_data`, or `get_data`.

### Basic Query

Fetches all records in the entity (up to the default page size of 500):

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725"
}
```

### With Pagination

For large datasets, use `limit` and `page` to control how many records come back per request and which page you're on:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "limit": 10,
  "page": 1
}
```

### Select Specific Instance

To fetch a single record, filter by its `_id`:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "filter": [["_id", "=", "69c2363b4ee1d5cba6063e37"]]
}
```

### With Archived Records

By default, archived records are excluded from results. Add `with_archive: true` to include them:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "with_archive": true
}
```

### Response Structure

The response contains three main sections: `info` (pagination metadata), `entity_data` (entity metadata), and `data` (the actual records). Each record's fields are nested inside `field_groups` → `fields_data`:

```json
{
  "info": {
    "total_count": 58,
    "current_page_total_count": 2,
    "max_each_page": 500,
    "current_page_number": 1,
    "total_pages": 1
  },
  "entity_data": {
    "entity_name": "Leads.",
    "entity_data_name": "e_725",
    "permissions": { "type": "full", "code": "1" },
    "view": "data table"
  },
  "data": [
    {
      "instance_data": {
        "_id": "69c2363b4ee1d5cba6063e37",
        "insertTimestamp": "2026-03-24T08:59:07+0200",
        "lastModified": "2026-03-24T08:59:07+0200",
        "archived": false,
        "field_groups": [
          {
            "field_group_data": {
              "group_name": "Lead Details",
              "group_data_name": "g_1790",
              "repeatable_group": "0"
            },
            "fields_data": [
              [
                {
                  "field_name": "First Name",
                  "field_type_name": "input-text",
                  "field_data_name": "fld_11693",
                  "value": "John",
                  "group_index": 0
                }
              ]
            ]
          }
        ]
      }
    }
  ]
}
```

**Response Structure Notes:**
- `data` is an **array** of instance objects
- `field_groups` is an **array** of group objects
- `fields_data` is a **nested array**: outer = repetitions (for repeatable groups), inner = field objects
- Each field object has a `value` property containing the actual data

---

## 5. Filters

Filters let you narrow down which records are returned by the `instance_data` endpoint. They can also be used in `update_instance_fields` and `remove_instance` to target specific records. Filters use an **array of arrays** syntax where each inner array represents one condition: `["field_data_name", "operator", "value"]`.

> **CRITICAL WARNING:** Using the wrong filter format (e.g., an array of objects instead of array of arrays) will NOT throw an error — it silently returns ALL records unfiltered. This is one of the most common integration bugs.

### Correct Filter Syntax

A single filter condition — find all records where the first name equals "John":

```json
"filter": [["fld_11693", "=", "John"]]
```

### Multiple Filters (AND logic)

Add more arrays to the `filter` to combine conditions with AND logic — all conditions must match:

```json
"filter": [
  ["fld_11693", "=", "John"],
  ["fld_11694", "=", "Doe"]
]
```

### Available Operators

Origami supports a wide range of comparison, text search, list, and emptiness operators:

| Operator | Description | Example |
|----------|-------------|---------|
| `=` | Equal | `["fld_123", "=", "value"]` |
| `<` | Less than | `["fld_123", "<", "100"]` |
| `<=` | Less than or equal | `["fld_123", "<=", "100"]` |
| `>` | Greater than | `["fld_123", ">", "100"]` |
| `>=` | Greater than or equal | `["fld_123", ">=", "100"]` |
| `like` | Contains text | `["fld_123", "like", "search"]` |
| `not like` | Does not contain | `["fld_123", "not like", "text"]` |
| `IN` | In list | `["fld_123", "IN", ["a","b","c"]]` |
| `NOT IN` | Not in list | `["fld_123", "NOT IN", ["a","b"]]` |
| `EMPTY` | Field is empty | `["fld_123", "EMPTY", ""]` |
| `NOT EMPTY` | Field not empty | `["fld_123", "NOT EMPTY", ""]` |

### Date Filters

Date fields support both absolute dates and relative/dynamic date expressions, which are especially useful for recurring reports and automations:

| Operator | Value | Description |
|----------|-------|-------------|
| `=` | `"2023-06-28"` | Exact date |
| `>` | `"2023-06-28"` | After date |
| `<` | `"2023-06-28"` | Before date |
| `date_range` | `["2023-01-01","2023-12-31"]` | Between dates |
| `x_days_back` | `"7"` | Last X days |
| `x_days_forward` | `"30"` | Next X days |
| `today` | `""` | Today only |
| `yesterday` | `""` | Yesterday only |
| `tomorrow` | `""` | Tomorrow only |
| `current_week` | `""` | Current week |
| `last_7_days` | `""` | Last 7 days |
| `last_30_days` | `""` | Last 30 days |

### Combined Filters (OR logic with andxor)

To combine conditions with OR logic, use the `andxor` parameter alongside `filter`. Records matching either the `filter` OR the `andxor` conditions will be returned:

```json
"filter": [["fld_11693", "like", "John"]],
"andxor": [["fld_11693", "like", "Jane"]]
```

### Geo-Location Filter

For location fields, you can search by proximity — find all records within a given radius (in km) of a latitude/longitude point:

```json
"filter": [["fld_location", "geo", { "lat": 32.0853, "lng": 34.7818, "radius": 5 }]]
```

---

## 6. Update Fields

Modifies one or more field values on existing records. You identify which records to update using a `filter` (typically by `_id`), then specify which fields to change. Note that the body format here is completely different from create — this is a common source of confusion.

**Endpoint:** `/entities/api/update_instance_fields/format/json`

> **IMPORTANT:** The update format uses `filter` + `field` arrays, NOT `form_data`. See the Common Mistakes section if you're getting unexpected results.

### Update a Field in a Regular Group

Each field in the `field` array is a triplet: `[field_data_name, new_value, group_index]`. For regular (non-repeatable) groups, `group_index` is always `0`:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "filter": [
    ["_id", "=", "69c2363b4ee1d5cba6063e37"]
  ],
  "field": [
    ["fld_11693", "New First Name", 0]
  ]
}
```

**Field format:** `["field_data_name", "new_value", group_index]`
- `group_index` is `0` for regular (non-repeatable) groups

### Update Multiple Fields

You can update several fields in a single call by adding more entries to the `field` array:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "filter": [["_id", "=", "69c2363b4ee1d5cba6063e37"]],
  "field": [
    ["fld_11693", "Updated Name", 0],
    ["fld_11694", "Updated Last", 0],
    ["fld_11731", "newemail@example.com", 0]
  ]
}
```

### Update a Field in a Repeatable Group

For repeatable groups (e.g., line items, contacts), the third element in each field triplet specifies which repetition to update. Index `0` is the first row, `1` is the second, and so on:

```json
{
  "field": [
    ["fld_item_name", "Widget A", 0],
    ["fld_item_name", "Widget B", 1],
    ["fld_item_name", "Widget C", 2]
  ]
}
```

### Success Response

```json
{
  "success": "ok",
  "results": {
    "instances_updated": 1,
    "fields_updated_total": 1
  }
}
```

---

## 7. Remove Instance

Permanently deletes one or more records from an entity. This action cannot be undone — if you want to hide records without deleting them, use the Archive endpoint instead. There are two ways to specify which records to delete: by `_ids` array or by `filter`.

**Endpoint:** `/entities/api/remove_instance/format/json`

### Using `_ids` Array (Recommended)

Pass an array of record IDs to delete. This is the clearest approach and supports batch deletion:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "_ids": ["69c238525da1c30aa3094e56"]
}
```

### Using Filter (Alternative)

You can also use the same filter syntax as in queries to target records for deletion. Be careful — if your filter matches multiple records, they will all be deleted:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "filter": [["_id", "=", "69c238525da1c30aa3094e56"]]
}
```

**Note:** Both `_ids` array and `filter` format work. `_ids` supports deleting multiple instances at once.

**Success Response:**
```json
{ "success": "ok" }
```

---

## 8. Repeatable Groups

Repeatable groups are like sub-tables within a record — think line items on an order, multiple phone numbers for a contact, or work history entries. Before you can populate fields in a new repetition, you need to add the repetition first, then use the Update endpoint to fill in its fields.

### Add a New Group Repetition

Adds a new empty row to a repeatable group on a specific record. After adding it, use `update_instance_fields` with the appropriate `group_index` to populate the fields.

**Endpoint:** `/entities/api/add_group_repetition/format/json`

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "_id": "69c2363b4ee1d5cba6063e37",
  "group_data_name": "g_repeatable_group"
}
```

**Note:** Uses `_id` (not `instance_id` or `filter`).

### Remove a Group Repetition

Deletes a specific row from a repeatable group. The `index` is 0-based, so `0` removes the first repetition, `1` removes the second, etc. Remaining rows will shift down to fill the gap.

**Endpoint:** `/entities/api/remove_group_repetition/format/json`

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "_id": "69c2363b4ee1d5cba6063e37",
  "group_data_name": "g_repeatable_group",
  "index": 2
}
```

`index` is the 0-based repetition number to remove.

---

## 9. File Upload

Attaches a file to a file-type field on an existing record. Unlike other endpoints which use JSON, this one requires **multipart form data** encoding. The file will be stored in Origami's file system and linked to the specified field.

**Endpoint:** `/entities/api/upload_file/format/json`

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "instance_id": "<INSTANCE_ID>",
  "field_data_name": "fld_11719",
  "file": "<FILE_DATA>"
}
```

---

## 10. Archive

Archiving is a soft-delete mechanism — the record is hidden from normal queries but not permanently removed. You can archive and unarchive records at any time. Archived records can still be retrieved by adding `with_archive: true` to your query (see Section 4).

**Endpoint:** `/entities/api/archive_action` (no `/format/json` suffix)

### Add to Archive

Moves a record to the archive. The record will no longer appear in standard queries:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "id": "69c2363b4ee1d5cba6063e37",
  "type": "in"
}
```

### Remove from Archive

Restores a previously archived record back to active status:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_725",
  "id": "69c2363b4ee1d5cba6063e37",
  "type": "out"
}
```

**Key differences from other endpoints:**
- URL does NOT end with `/format/json`
- Uses `id` (not `_id`, `instance_id`, or `filter`)
- `type` is `"in"` (archive) or `"out"` (unarchive)

**Success Response:**
```json
{ "success": "ok" }
```

---

## 11. Calendar Events

Origami entities can have a built-in calendar group that stores event data (date, time, all-day flag). Calendar events don't have their own separate API — they use the standard Create and Update endpoints, but with a special group called `origami_calendar_group`.

### Calendar Field Structure

The `origami_calendar_field` is a JSON object with these fields:

| Field | Type | Description |
|-------|------|-------------|
| `all_day` | String | `"0"` for a timed event, `"1"` for an all-day event |
| `start` | String | Start date and time (format: `"YYYY-MM-DD HH:mm"` or `"YYYY-MM-DD"` for all-day) |
| `end` | String | End date and time (format: `"YYYY-MM-DD HH:mm"` or `"YYYY-MM-DD"` for all-day) |

### Create Instance with Calendar Event

Creates a new record with an associated calendar event. The calendar data goes into the `origami_calendar_group` within the `form_data` array. You can include other field groups alongside the calendar group in the same request.

**Endpoint:** `/entities/api/create_instance/format/json`

**Example — Calendar event only:**

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_72",
  "form_data": [
    {
      "group_data_name": "origami_calendar_group",
      "data": [
        {
          "origami_calendar_field": {
            "all_day": "0",
            "start": "2026-03-27 09:00",
            "end": "2026-03-27 10:30"
          }
        }
      ]
    }
  ]
}
```

**Example — Calendar event with additional field groups:**

You can pass multiple groups in the `form_data` array. For instance, a calendar entity that also has a details group (`e_166`) with text, connection, and location fields:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "e_72",
  "form_data": [
    {
      "group_data_name": "origami_calendar_group",
      "data": [
        {
          "origami_calendar_field": {
            "all_day": "1",
            "start": "2026-04-01",
            "end": "2026-04-01"
          }
        }
      ]
    },
    {
      "group_data_name": "e_166",
      "data": [
        {
          "fld_945": "Meeting with client",
          "fld_948": "Confirmed",
          "fld_950": {
            "formatted_address": "Tel Aviv-Yafo, Israel",
            "lngLat": [34.78176759999999, 32.0852999],
            "locality": "Tel Aviv-Yafo",
            "administrative_area_level_1": "Tel Aviv District",
            "country": "IL",
            "value": "Tel Aviv, Israel"
          }
        }
      ]
    }
  ]
}
```

**Note:** The field names (`fld_945`, `fld_948`, `e_166`, etc.) are specific to each Origami account. Use the Entity Structure endpoint (Section 3) to discover the correct `data_name` values for your entities and fields.

### Update Instance with Calendar Event

To modify an existing calendar event, use the standard update endpoint with the calendar field names. The update format follows the same `filter` + `field` pattern described in Section 6.

**Endpoint:** `/entities/api/update_instance_fields/format/json`

---

## 12. Protected Entities

Some entities in Origami are marked as "protected" — most notably the `origami_users` entity that stores user accounts. These entities require a different read endpoint. You can check whether an entity is protected by looking at the `protected_entity` field in the `entities_list` response (Section 2).

### Select Data from Protected Entity

Works just like the regular `instance_data` endpoint, but uses `instance_data_protected` in the URL. Supports the same filters, pagination, and response format.

**Endpoint:** `/entities/api/instance_data_protected/format/json`

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "origami_users"
}
```

### Fetch Specific User Details

You can filter protected entities the same way as regular entities — for example, looking up a specific user by their `_id`:

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "entity_data_name": "origami_users",
  "filter": [["_id", "=", "644a4face9baf533b20af982"]]
}
```

**Note:** Uses `instance_data_protected` instead of `instance_data`. The `origami_users` entity is always a protected entity.

---

## 13. Push Notifications

Sends a real-time notification to a specific Origami user. This is useful for alerting users about events, approvals, or tasks that need attention. The notification appears in the user's Origami interface and can optionally include an interactive button.

Note that this endpoint uses a completely different base path (`/ui/api/`) than all other endpoints.

**Endpoint:** `/ui/api/push_notification`

```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "user_id": "62cbb8b3c86ecd372a387235",
  "text": "Hello There",
  "duration": "10",
  "id": "1111",
  "button": {
    "text": "Click me",
    "type": "location"
  }
}
```

**Key differences:**
- Uses `/ui/api/` base path, NOT `/entities/api/`
- Requires `Content-Type: application/json` header
- `user_id` is the Origami user ID to send the notification to
- `duration` is in seconds
- `button` is optional — adds an interactive button to the notification

**Success Response:**
```json
{ "success": "ok" }
```

---

## 14. Invoice System

Origami includes a built-in invoicing module that supports five document types: Tax Invoice Receipt, Tax Invoice, Receipt, Proforma Invoice, and Credit Invoice. The invoice API lives on a **completely separate base path** (`/invoices/api/`) from the entity API — this is the most common source of confusion when integrating with invoicing for the first time.

All five invoice types share just two endpoints: one for creating and one for querying. The `type` parameter determines which kind of document you're working with.

### 14.1 Create Invoice

Generates a new invoice document. Origami automatically assigns a sequential document number and creates a PDF. The response includes the new `_id`, a `file_id` for the generated PDF, and the `doc_number`.

**Endpoint:** `/invoices/api/create_invoice`

All invoice types use the **same endpoint** — the `type` field in the request body determines which kind of document is created:

| Invoice Type | `type` Value | Additional Fields |
|-------------|-------------|-------------------|
| Tax Invoice Receipt | `"tax_receipt"` | — |
| Tax Invoice | `"tax_invoice"` | — |
| Receipt | `"receipt"` | — |
| Proforma Invoice | `"deal_invoice"` | — |
| Credit Invoice | `"refund_invoice"` | `"attach_type": "tax_invoice"` |

**Request (Tax Invoice Receipt):**
A combined tax invoice and receipt — the most common document type in Israel. Uses the `origami_invoices_general_details` group for form data:
```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "type": "tax_receipt",
  "saved_id": "",
  "round_total": 0,
  "form_data": [
    {
      "group_data_name": "origami_invoices_general_details",
      "data": [
        {
          "<FIELD_DATA_NAME>": "<VALUE>"
        }
      ]
    }
  ]
}
```

**Request (Tax Invoice):**
A tax invoice without a receipt component. All invoice types use the same `group_data_name` — `origami_invoices_general_details`:
```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "type": "tax_invoice",
  "saved_id": "",
  "round_total": 0,
  "form_data": [
    {
      "group_data_name": "origami_invoices_general_details",
      "data": [{ }]
    }
  ]
}
```

**Request (Credit Invoice):**
A credit note (refund document) that references an existing invoice. Requires an additional `attach_type` parameter to specify which type of invoice is being credited:
```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "type": "refund_invoice",
  "attach_type": "tax_invoice",
  "saved_id": "",
  "round_total": 0,
  "form_data": [
    {
      "group_data_name": "origami_invoices_general_details",
      "data": [{ }]
    }
  ]
}
```

**Success Response:**
```json
{
  "success": "ok",
  "results": {
    "_id": "64628206f9c07d2a3e05feca",
    "file_id": "646282071c07d2a3e05fecb",
    "doc_number": 20063
  },
  "async_documents": null
}
```

### 14.2 Select Invoice Data

Retrieves existing invoices. The response format is the same as entity `instance_data` — with `info` (pagination), `entity_data`, and `data` arrays. Use the `invoice_type` parameter to specify which kind of invoices to query.

**Endpoint:** `/invoices/api/instance_data/format/json`

All invoice types use the **same endpoint** — the `invoice_type` field determines which document type to query:

| Invoice Type | `invoice_type` Value |
|-------------|---------------------|
| Tax Invoice Receipt | `"tax_receipt"` |
| Tax Invoice | `"tax_invoice"` |
| Receipt | `"receipt"` |
| Proforma Invoice | `"deal_invoice"` |
| Credit Invoice | `"refund_invoice"` |

**Request:**
```json
{
  "username": "<ACCOUNT_USERNAME>",
  "api_secret": "<API_SECRET>",
  "invoice_type": "tax_receipt"
}
```

**Response:** Same structure as entity `instance_data` with `info`, `entity_data`, and `data` arrays.

### 14.3 Invoice Type Quick Reference

Use this table to quickly look up the correct parameter values for each invoice type. All five types use the same `group_data_name`:

| Document Name | Create `type` | Select `invoice_type` | Create `group_data_name` |
|--------------|---------------|----------------------|--------------------------|
| Tax Invoice Receipt | `tax_receipt` | `tax_receipt` | `origami_invoices_general_details` |
| Tax Invoice | `tax_invoice` | `tax_invoice` | `origami_invoices_general_details` |
| Receipt | `receipt` | `receipt` | `origami_invoices_general_details` |
| Proforma Invoice | `deal_invoice` | `deal_invoice` | `origami_invoices_general_details` |
| Credit Invoice | `refund_invoice` | `refund_invoice` | `origami_invoices_general_details` |

---

## 15. Error Reference

One important thing to know about the Origami API: **all responses return HTTP 200**, even errors. You must check the JSON body to determine if the request succeeded or failed. This is different from most REST APIs where HTTP status codes (400, 404, 500) indicate errors.

### Error Response Types

Here are the error categories you'll encounter:

| Error Type | HTTP Status | Description |
|-----------|-------------|-------------|
| `error` / `unknown method` | 200 | Endpoint name is wrong or not available |
| `error` / `missing parameters` | 200 | Required parameters are missing |
| `validation` | 200 | Field-level validation failed |
| `user_alert` | 200 | Business rule violation (e.g., duplicate phone) |
| `query` / `No Results` | 200 | Filter matched zero records |

### Validation Error Structure

When a field fails validation (wrong format, too short, required field missing, etc.), the error includes the specific field and a human-readable message explaining what went wrong:

```json
{
  "error": {
    "type": "validation",
    "column": [
      {
        "group_data_name": "g_1790",
        "block_number": 0,
        "field_data_name": "fld_11695",
        "field_name": "ID",
        "message": "Minimum 9 length."
      }
    ]
  }
}
```

**Note:** All API responses return HTTP 200 — errors are indicated in the JSON body, not via HTTP status codes.

---

## 16. Common Mistakes

These are the most frequent errors we've seen developers run into when integrating with the Origami API. Each one was discovered through real testing on the staging environment:

### Wrong Filter Format
This is the #1 most dangerous mistake because it fails silently — you get a 200 response with valid-looking data, but it's returning everything instead of your filtered subset.
```json
// WRONG — silently returns ALL records!
"filter": [{"field_data_name": "fld_123", "type": "=", "value": "test"}]

// CORRECT
"filter": [["fld_123", "=", "test"]]
```

### Wrong Create Endpoint
The endpoint name includes the full word "instance" — a common oversight when guessing endpoint names.
```
WRONG:  /entities/api/create/format/json
CORRECT: /entities/api/create_instance/format/json
```

### Wrong Phone Format
Phone fields enforce a strict `XXX-XXXXXXX` format with exactly one hyphen after the 3-digit prefix. International formats, spaces, and parentheses are all rejected.
```json
// WRONG
"fld_phone": "+972501234567"
"fld_phone": "0501234567"

// CORRECT
"fld_phone": "050-1234567"
```

### Using form_data for Update
Create and Update use completely different body formats. If you copy-paste your create request and try to adapt it for updates, it won't work.
```json
// WRONG — update does NOT use form_data
{ "form_data": [{ "group_data_name": "g_1790", "data": [{"fld_123": "val"}] }] }

// CORRECT — update uses filter + field
{ "filter": [["_id", "=", "abc"]], "field": [["fld_123", "val", 0]] }
```

### Using instance_id for Delete
The delete endpoint doesn't accept `instance_id` — use `_ids` (an array) or `filter` instead.
```json
// WRONG
{ "instance_id": "abc123" }

// CORRECT — use _ids array
{ "_ids": ["abc123"] }

// ALSO CORRECT — use filter
{ "filter": [["_id", "=", "abc123"]] }
```

### Wrong Invoice URL
Invoice endpoints live on `/invoices/api/`, not `/entities/api/`. Using the entity path for invoice calls returns "unknown method" with no helpful context.
```
WRONG:  /entities/api/invoice/format/json
CORRECT: /invoices/api/create_invoice
CORRECT: /invoices/api/instance_data/format/json
```

---

## API URL Pattern Summary

Quick reference for all three base URL patterns. When something returns "unknown method", check if you're using the right base path for your endpoint:

| API Section | Base URL Pattern |
|------------|-----------------|
| Entity CRUD | `/entities/api/<endpoint>/format/json` |
| Archive | `/entities/api/archive_action` (no format suffix) |
| Protected Entities | `/entities/api/instance_data_protected/format/json` |
| Invoice Create | `/invoices/api/create_invoice` |
| Invoice Read | `/invoices/api/instance_data/format/json` |
| Push Notifications | `/ui/api/push_notification` |

---

## Complete Endpoint Reference

All 14 API endpoints at a glance. Use this as a quick lookup when you need the exact URL pattern for an operation:

| # | Endpoint | URL Pattern | Purpose |
|---|----------|-------------|---------|
| 1 | `entities_list` | `/entities/api/entities_list/format/json` | List all entities |
| 2 | `entity_structure` | `/entities/api/entity_structure/format/json` | Get entity schema |
| 3 | `create_instance` | `/entities/api/create_instance/format/json` | Create record |
| 4 | `instance_data` | `/entities/api/instance_data/format/json` | Read/query records |
| 5 | `update_instance_fields` | `/entities/api/update_instance_fields/format/json` | Update fields |
| 6 | `remove_instance` | `/entities/api/remove_instance/format/json` | Delete record(s) |
| 7 | `upload_file` | `/entities/api/upload_file/format/json` | Upload file |
| 8 | `add_group_repetition` | `/entities/api/add_group_repetition/format/json` | Add repeatable row |
| 9 | `remove_group_repetition` | `/entities/api/remove_group_repetition/format/json` | Remove repeatable row |
| 10 | `archive_action` | `/entities/api/archive_action` | Archive/unarchive |
| 11 | `instance_data_protected` | `/entities/api/instance_data_protected/format/json` | Read protected entity |
| 12 | `create_invoice` | `/invoices/api/create_invoice` | Create invoice |
| 13 | `instance_data` (invoice) | `/invoices/api/instance_data/format/json` | Read invoice data |
| 14 | `push_notification` | `/ui/api/push_notification` | Send push notification |

---

## Known System Issues

These are bugs and inconsistencies found during testing on the staging environment. They don't break functionality but may cause confusion:

1. **Typo in duplicate phone alert:** "Their is an existing customer" → should be "There is an existing customer"
2. **Typo in repeatable group error:** "Not a reapeatable group" → should be "Not a repeatable group"
3. **Archive endpoint description:** "Send a push notification to a user" is a copy-paste error — should describe archive functionality
4. **Silent filter failure:** Wrong filter format returns all records instead of an error

---

*Documentation verified against stage.origami.ms on March 24, 2026*
*All endpoints tested with successful responses*
