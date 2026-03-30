---
name: origami-builder
description: >
  Use this skill when the user wants to "build an Origami environment", "design a data model
  in Origami", "set up Origami for a client", "create an Origami system", "implement Origami",
  or needs help planning entities, fields, relationships, views, workflows, permissions, or
  imports for a new or existing Origami.ms deployment. Also trigger when discussing ERDs,
  Miro boards, or briefs that need to be translated into an Origami configuration.
metadata:
  version: "1.0.0"
---

# Origami Implementation Guide

Help users design and build complete Origami.ms environments from requirements, briefs,
ERDs, or Miro boards.

## Phase 1 — Understand Requirements

Extract from any input:

1. **Entities** — the main things in the system (nouns: Client, Case, Invoice, Task)
2. **Fields per entity** — what data lives on each, what type
3. **Relationships** — how entities connect (Client has many Cases, etc.)
4. **Workflows** — what happens automatically (email on status change, notify on approval)
5. **Views** — how users see data (table, kanban, calendar)
6. **Users and access** — who uses it, role-based permissions needed?

Confirm the design with the user before building.

## Phase 2 — Design the Data Model

Map business concepts to Origami:

| Business concept | Origami concept |
|---|---|
| Category of entities (CRM, HR) | Category (top nav) |
| Type of thing (clients, cases) | Entity (Entity Page) |
| Piece of data | Field |
| One belongs to another | Instance Relation field |
| Many-to-many | Multi Instance Relation field |
| Assigned user | User Relation field |
| Fixed options (status) | Single/Multiple Selection |
| Calculated value | Formula field |
| Auto-fill from linked record | Reference field |

### Field type quick rules

- Free text → Text Field
- Long text → Text Area
- Rich content → HTML Editor
- Numbers → Number (check positive-only, ranges)
- Dates → Date/Time
- Fixed options → Single Selection
- Tags → Multiple or Free Multi Selection
- Link to record → Instance Relation (one) or Multi Instance Relation (many)
- Calculated → Formula
- From linked record → Reference
- User assignment → User Relation

### Relationships

Instance Relation fields go on the child/many side:
- Case belongs to Client → Instance Relation on Case → Client
- Case has many Tasks → Instance Relation on Task → Case

## Phase 3 — Build Sequence

Follow this order to avoid dependency issues:

1. **System setup** — preferences, timezone, email/SMTP, user groups, users
2. **Categories and entities** — create in top nav, entity names must be globally unique
3. **Fields** — core fields first, then relations (target entities must exist)
4. **Views** — default table view minimum, plus kanban/calendar as needed
5. **Visual Editor** — arrange field layout per entity
6. **Permissions** — view/edit/create/delete per entity per user group
7. **Workflows** — triggers, conditions, actions; test on small set first
8. **Data import** — parent records first, then children with relation matching
9. **Test** — end-to-end walkthrough of key user journeys

## Common Patterns

Read `references/patterns.md` for ready-to-use blueprints:
- CRM (Accounts, Contacts, Deals, Activities)
- Project Management (Projects, Tasks, Milestones, Time Entries)
- Help Desk (Tickets, Agents, Categories, SLAs)
- HR (Employees, Departments, Leave Requests, Reviews)
- Property Management (Properties, Units, Tenants, Leases)

## Detailed References

- `references/data-model.md` — All field types with settings and gotchas
- `references/views-and-display.md` — View types, Visual Editor, Dashboards
- `references/workflows-reference.md` — Triggers, conditions, all action types
- `references/data-import.md` — Import wizard walkthrough
- `references/formula-reference.md` — Formula syntax, patterns, and fixes
- `references/system-setup.md` — System Preferences, Users, Permissions
