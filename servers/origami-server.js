#!/usr/bin/env node

/**
 * Origami.ms MCP Server
 * Exposes all Origami API endpoints as MCP tools for Claude.
 *
 * Environment variables:
 *   ORIGAMI_ACCOUNT   — account subdomain (e.g. "mycompany" for mycompany.origami.ms)
 *   ORIGAMI_USERNAME  — API user email
 *   ORIGAMI_API_SECRET — API secret from Origami settings
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const ACCOUNT = process.env.ORIGAMI_ACCOUNT;
const USERNAME = process.env.ORIGAMI_USERNAME;
const API_SECRET = process.env.ORIGAMI_API_SECRET;

if (!ACCOUNT || !USERNAME || !API_SECRET) {
  console.error(
    "Missing required env vars: ORIGAMI_ACCOUNT, ORIGAMI_USERNAME, ORIGAMI_API_SECRET"
  );
  process.exit(1);
}

const BASE = `https://${ACCOUNT}.origami.ms`;

// ── helpers ────────────────────────────────────────────────────────────

async function post(path, body = {}) {
  const url = `${BASE}${path}`;
  const payload = { username: USERNAME, api_secret: API_SECRET, ...body };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text, http_status: res.status };
    }
  } catch (err) {
    return { error: `Network error: ${err.message}`, url };
  }
}

async function postMultipart(path, fields, fileBuffer, fileName) {
  const url = `${BASE}${path}`;
  const form = new FormData();
  form.append("username", USERNAME);
  form.append("api_secret", API_SECRET);
  for (const [k, v] of Object.entries(fields)) {
    form.append(k, v);
  }
  form.append("file", new Blob([fileBuffer]), fileName);
  try {
    const res = await fetch(url, { method: "POST", body: form });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text, http_status: res.status };
    }
  } catch (err) {
    return { error: `Network error: ${err.message}`, url };
  }
}

function ok(data) {
  const isError = !!(data?.error || data?.error?.type);
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    ...(isError && { isError: true }),
  };
}

// ── server ─────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "origami-ms",
  version: "1.0.0",
});

// 1. List all entities
server.tool(
  "origami_list_entities",
  "List all entities (tables) in the Origami account. Returns entity names and data_names needed for all other calls.",
  {},
  async () => ok(await post("/entities/api/entities_list/format/json"))
);

// 2. Get entity structure (fields & groups)
server.tool(
  "origami_entity_structure",
  "Get the full schema of an entity — all field groups, field names, types, and data_names. Essential before creating or updating records.",
  { entity_data_name: z.string().describe("Entity identifier, e.g. 'e_725' or a custom API name") },
  async ({ entity_data_name }) =>
    ok(await post("/entities/api/entity_structure/format/json", { entity_data_name }))
);

// 3. Create instance (record)
server.tool(
  "origami_create_instance",
  "Create a new record in an entity. Provide form_data as an array of group objects, each with group_data_name and a data array containing one object of field key-value pairs.",
  {
    entity_data_name: z.string().describe("Entity identifier"),
    form_data: z
      .array(
        z.object({
          group_data_name: z.string(),
          data: z.array(z.record(z.any())),
        })
      )
      .describe("Array of { group_data_name, data: [{ field: value, ... }] }"),
  },
  async ({ entity_data_name, form_data }) =>
    ok(await post("/entities/api/create_instance/format/json", { entity_data_name, form_data }))
);

// 4. Read / query records
server.tool(
  "origami_query_instances",
  "Query records from an entity with optional filters, pagination, and archive inclusion. Filters use array-of-arrays syntax: [[field, operator, value], ...].",
  {
    entity_data_name: z.string().describe("Entity identifier"),
    filter: z
      .array(z.array(z.any()))
      .optional()
      .describe('Filter conditions, e.g. [["fld_123", "=", "value"]]'),
    andxor: z
      .array(z.array(z.any()))
      .optional()
      .describe("OR conditions (combined with filter using OR logic)"),
    limit: z.number().optional().describe("Records per page (default 500)"),
    page: z.number().optional().describe("Page number (1-based)"),
    with_archive: z.boolean().optional().describe("Include archived records"),
  },
  async ({ entity_data_name, filter, andxor, limit, page, with_archive }) => {
    const body = { entity_data_name };
    if (filter) body.filter = filter;
    if (andxor) body.andxor = andxor;
    if (limit) body.limit = limit;
    if (page) body.page = page;
    if (with_archive) body.with_archive = with_archive;
    return ok(await post("/entities/api/instance_data/format/json", body));
  }
);

// 5. Update instance fields
server.tool(
  "origami_update_instance",
  "Update fields on existing records. Use filter to target records (usually by _id) and field array with triplets [field_data_name, new_value, group_index]. group_index is 0 for regular groups.",
  {
    entity_data_name: z.string().describe("Entity identifier"),
    filter: z
      .array(z.array(z.any()))
      .describe('Filter to target records, e.g. [["_id", "=", "abc123"]]'),
    field: z
      .array(z.array(z.any()))
      .describe('Field updates as triplets: [["fld_123", "new value", 0], ...]'),
  },
  async ({ entity_data_name, filter, field }) =>
    ok(
      await post("/entities/api/update_instance_fields/format/json", {
        entity_data_name,
        filter,
        field,
      })
    )
);

// 6. Remove instance
server.tool(
  "origami_remove_instance",
  "Permanently delete records from an entity. Use _ids array (preferred) or filter. This cannot be undone — use archive for soft-delete.",
  {
    entity_data_name: z.string().describe("Entity identifier"),
    _ids: z.array(z.string()).optional().describe("Array of record IDs to delete"),
    filter: z
      .array(z.array(z.any()))
      .optional()
      .describe("Filter to target records for deletion"),
  },
  async ({ entity_data_name, _ids, filter }) => {
    const body = { entity_data_name };
    if (_ids) body._ids = _ids;
    if (filter) body.filter = filter;
    return ok(await post("/entities/api/remove_instance/format/json", body));
  }
);

// 7. Upload file
server.tool(
  "origami_upload_file",
  "Upload a file to a file-type field on an existing record. Provide the file as base64-encoded content.",
  {
    entity_data_name: z.string().describe("Entity identifier"),
    instance_id: z.string().describe("Record ID to attach file to"),
    field_data_name: z.string().describe("File field identifier"),
    file_base64: z.string().describe("Base64-encoded file content"),
    file_name: z.string().describe("Original file name with extension"),
  },
  async ({ entity_data_name, instance_id, field_data_name, file_base64, file_name }) => {
    const buf = Buffer.from(file_base64, "base64");
    return ok(
      await postMultipart(
        "/entities/api/upload_file/format/json",
        { entity_data_name, instance_id, field_data_name },
        buf,
        file_name
      )
    );
  }
);

// 8. Add group repetition
server.tool(
  "origami_add_group_repetition",
  "Add a new empty row to a repeatable group on a record. After adding, use update_instance to populate the fields with the correct group_index.",
  {
    entity_data_name: z.string().describe("Entity identifier"),
    _id: z.string().describe("Record ID"),
    group_data_name: z.string().describe("Repeatable group identifier"),
  },
  async ({ entity_data_name, _id, group_data_name }) =>
    ok(
      await post("/entities/api/add_group_repetition/format/json", {
        entity_data_name,
        _id,
        group_data_name,
      })
    )
);

// 9. Remove group repetition
server.tool(
  "origami_remove_group_repetition",
  "Remove a specific row from a repeatable group. Index is 0-based. Remaining rows shift down.",
  {
    entity_data_name: z.string().describe("Entity identifier"),
    _id: z.string().describe("Record ID"),
    group_data_name: z.string().describe("Repeatable group identifier"),
    index: z.number().describe("0-based index of the row to remove"),
  },
  async ({ entity_data_name, _id, group_data_name, index }) =>
    ok(
      await post("/entities/api/remove_group_repetition/format/json", {
        entity_data_name,
        _id,
        group_data_name,
        index,
      })
    )
);

// 10. Archive / unarchive
server.tool(
  "origami_archive",
  "Archive or unarchive a record (soft-delete). Use type 'in' to archive, 'out' to restore.",
  {
    entity_data_name: z.string().describe("Entity identifier"),
    id: z.string().describe("Record ID (note: 'id', not '_id')"),
    type: z.enum(["in", "out"]).describe("'in' = archive, 'out' = unarchive"),
  },
  async ({ entity_data_name, id, type }) =>
    ok(await post("/entities/api/archive_action", { entity_data_name, id, type }))
);

// 11. Query protected entity (e.g. origami_users)
server.tool(
  "origami_query_protected",
  "Query records from a protected entity (e.g. origami_users). Same parameters as regular query but uses the protected endpoint.",
  {
    entity_data_name: z.string().describe("Protected entity identifier, e.g. 'origami_users'"),
    filter: z.array(z.array(z.any())).optional().describe("Filter conditions"),
    limit: z.number().optional(),
    page: z.number().optional(),
  },
  async ({ entity_data_name, filter, limit, page }) => {
    const body = { entity_data_name };
    if (filter) body.filter = filter;
    if (limit) body.limit = limit;
    if (page) body.page = page;
    return ok(await post("/entities/api/instance_data_protected/format/json", body));
  }
);

// 12. Create invoice
server.tool(
  "origami_create_invoice",
  "Create an invoice document. Types: tax_receipt, tax_invoice, receipt, deal_invoice (proforma), refund_invoice (credit). For refund_invoice also provide attach_type.",
  {
    type: z
      .enum(["tax_receipt", "tax_invoice", "receipt", "deal_invoice", "refund_invoice"])
      .describe("Invoice document type"),
    form_data: z
      .array(
        z.object({
          group_data_name: z.string(),
          data: z.array(z.record(z.any())),
        })
      )
      .describe("Invoice form data (group_data_name is usually 'origami_invoices_general_details')"),
    attach_type: z
      .string()
      .optional()
      .describe("Required for refund_invoice — type of invoice being credited"),
    saved_id: z.string().optional().describe("Saved invoice template ID (empty string for none)"),
    round_total: z.number().optional().describe("Rounding setting (default 0)"),
  },
  async ({ type, form_data, attach_type, saved_id, round_total }) => {
    const body = { type, form_data, saved_id: saved_id ?? "", round_total: round_total ?? 0 };
    if (attach_type) body.attach_type = attach_type;
    return ok(await post("/invoices/api/create_invoice", body));
  }
);

// 13. Query invoices
server.tool(
  "origami_query_invoices",
  "Query existing invoice documents by type. Returns same structure as entity instance_data.",
  {
    invoice_type: z
      .enum(["tax_receipt", "tax_invoice", "receipt", "deal_invoice", "refund_invoice"])
      .describe("Invoice type to query"),
    filter: z.array(z.array(z.any())).optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  },
  async ({ invoice_type, filter, limit, page }) => {
    const body = { invoice_type };
    if (filter) body.filter = filter;
    if (limit) body.limit = limit;
    if (page) body.page = page;
    return ok(await post("/invoices/api/instance_data/format/json", body));
  }
);

// 14. Push notification
server.tool(
  "origami_push_notification",
  "Send a real-time push notification to an Origami user. Appears in their Origami interface.",
  {
    user_id: z.string().describe("Origami user ID to notify"),
    text: z.string().describe("Notification message"),
    duration: z.string().optional().describe("Display duration in seconds (default '10')"),
    id: z.string().optional().describe("Notification ID"),
    button: z
      .object({
        text: z.string(),
        type: z.string(),
      })
      .optional()
      .describe("Optional interactive button"),
  },
  async ({ user_id, text, duration, id, button }) => {
    const body = { user_id, text, duration: duration ?? "10" };
    if (id) body.id = id;
    if (button) body.button = button;
    return ok(await post("/ui/api/push_notification", body));
  }
);

// ── start ──────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
