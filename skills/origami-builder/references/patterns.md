# Common Origami System Patterns

Ready-to-use data model blueprints for the most common business systems. Each pattern lists
entities, key fields per entity (with Origami field types), relationships, suggested views,
and workflow ideas. Adapt names and fields to the client's terminology.

---

## Table of contents

1. CRM — Accounts, Contacts, Deals, Activities
2. Project Management — Projects, Tasks, Milestones, Time Entries
3. Help Desk / Ticketing — Tickets, Agents, Categories, SLAs
4. HR / People Management — Employees, Departments, Leave, Reviews
5. Property Management — Properties, Units, Tenants, Leases, Maintenance

---

## 1. CRM

### Entities and fields

**Account** (a company or organisation)
- Name — Text Field *(primary display field)*
- Industry — Single Selection (Technology, Finance, Healthcare, Retail, Manufacturing, Other)
- Size — Single Selection (1–10, 11–50, 51–200, 201–1000, 1000+)
- Website — URL Field
- Phone — Phone Field
- Address — Text Area
- Account Owner — User Relation
- Status — Single Selection (Prospect, Active, Churned)
- Notes — Text Area

**Contact** (a person at an account)
- Full Name — Text Field *(primary display field)*
- Account — Instance Relation → Account
- Job Title — Text Field
- Email — Email Field
- Phone — Phone Field
- LinkedIn — URL Field
- Primary Contact — Boolean (Yes/No Field)
- Notes — Text Area

**Deal** (a sales opportunity)
- Deal Name — Text Field *(primary display field)*
- Account — Instance Relation → Account
- Primary Contact — Instance Relation → Contact
- Owner — User Relation
- Stage — Single Selection (Prospecting, Qualified, Proposal, Negotiation, Closed Won, Closed Lost)
- Value — Number Field (currency, min 0)
- Close Date — Date Field
- Probability % — Number Field (0–100)
- Source — Single Selection (Inbound, Outbound, Referral, Partner, Event)
- Notes — Text Area

**Activity** (calls, emails, meetings logged against a deal or contact)
- Subject — Text Field *(primary display field)*
- Type — Single Selection (Call, Email, Meeting, Demo, Other)
- Related Deal — Instance Relation → Deal
- Related Contact — Instance Relation → Contact
- Date — Date/Time Field
- Duration (mins) — Number Field
- Outcome — Single Selection (Positive, Neutral, Negative, No Answer)
- Notes — Text Area
- Logged By — User Relation

### Relationships
- Account → many Contacts (Contact has Instance Relation to Account)
- Account → many Deals (Deal has Instance Relation to Account)
- Deal → many Activities (Activity has Instance Relation to Deal)
- Contact → many Activities (Activity has Instance Relation to Contact)

### Suggested views
- Accounts: Table view with Status filter; Kanban by Status
- Deals: Kanban by Stage (classic pipeline); Table sorted by Close Date
- Contacts: Table with Account column; filter by Account
- Activities: Table sorted by Date desc, filtered to current user's records

### Workflow ideas
- When Deal Stage → "Closed Won": send congratulations email to owner; create follow-up Activity
- When Deal Close Date is within 7 days and Stage not Closed: send reminder email to owner
- When Activity is created: update "Last Activity Date" on the related Deal (using Update Record action)

---

## 2. Project Management

### Entities and fields

**Project**
- Project Name — Text Field *(primary display field)*
- Client — Instance Relation → Account *(if CRM is also present)*
- Project Manager — User Relation
- Status — Single Selection (Not Started, In Progress, On Hold, Completed, Cancelled)
- Start Date — Date Field
- Due Date — Date Field
- Budget — Number Field (currency)
- Description — Text Area
- Priority — Single Selection (Low, Medium, High, Critical)

**Milestone**
- Name — Text Field *(primary display field)*
- Project — Instance Relation → Project
- Due Date — Date Field
- Status — Single Selection (Pending, In Progress, Completed)
- Description — Text Area

**Task**
- Title — Text Field *(primary display field)*
- Project — Instance Relation → Project
- Milestone — Instance Relation → Milestone *(optional)*
- Assignee — User Relation
- Status — Single Selection (To Do, In Progress, In Review, Done, Blocked)
- Priority — Single Selection (Low, Medium, High, Critical)
- Due Date — Date Field
- Estimated Hours — Number Field
- Description — Text Area

**Time Entry**
- Description — Text Field *(primary display field)*
- Task — Instance Relation → Task
- Logged By — User Relation
- Date — Date Field
- Hours — Number Field (min 0, max 24)
- Billable — Yes/No Field

### Relationships
- Project → many Milestones
- Project → many Tasks
- Milestone → many Tasks
- Task → many Time Entries

### Suggested views
- Projects: Table + Kanban by Status
- Tasks: Kanban by Status (the main work view); Calendar by Due Date; Table filtered to My Tasks
- Milestones: Calendar by Due Date; Table grouped by Project
- Time Entries: Table sorted by Date, grouped by Task or Project

### Workflow ideas
- When Task Status → "Done": check if all sibling tasks are done, update Milestone status
- When Task Due Date passes and Status is not Done: notify Assignee by email
- When Project Status → "Completed": send summary email to Project Manager

---

## 3. Help Desk / Ticketing

### Entities and fields

**Ticket**
- Title — Text Field *(primary display field)*
- Requester — Instance Relation → Contact *(or Text Field if no CRM)*
- Assigned Agent — User Relation
- Category — Instance Relation → Category
- Priority — Single Selection (Low, Medium, High, Critical)
- Status — Single Selection (Open, In Progress, Waiting on Customer, Resolved, Closed)
- Created Date — Date/Time Field (auto-set via workflow on creation)
- Resolved Date — Date/Time Field
- SLA Due Date — Date/Time Field (set by workflow based on priority)
- Description — Text Area *(HTML Editor for rich formatting)*
- Resolution Notes — Text Area

**Category**
- Name — Text Field *(primary display field)*
- Default Agent — User Relation
- SLA Hours — Number Field (e.g. Critical=4, High=8, Medium=24, Low=72)
- Description — Text Area

**Agent** *(can often use the built-in User system instead of a separate entity)*
- Name — Text Field
- Email — Email Field
- Team — Single Selection
- Active — Yes/No Field

**Comment / Update**
- Ticket — Instance Relation → Ticket
- Author — User Relation
- Date — Date/Time Field
- Message — Text Area (HTML Editor)
- Internal Only — Yes/No Field (hide from customer-facing views)

### Relationships
- Category → many Tickets
- Ticket → many Comments
- Agent (User) assigned to many Tickets

### Suggested views
- Tickets: Table with Status filter; Kanban by Status; filtered view "My Open Tickets"
- All Open Tickets (manager view): Table sorted by SLA Due Date
- Overdue Tickets: Table filtered to SLA Due Date < Today and Status not Resolved/Closed

### Workflow ideas
- When Ticket created: set SLA Due Date based on Category's SLA Hours + Created Date; send confirmation email to Requester; assign to Category's Default Agent
- When Ticket Status → "Resolved": send resolution email to Requester; set Resolved Date
- When SLA Due Date < Now and Status is Open/In Progress: notify Assigned Agent and manager

---

## 4. HR / People Management

### Entities and fields

**Employee**
- Full Name — Text Field *(primary display field)*
- Employee ID — Text Field
- Department — Instance Relation → Department
- Job Title — Text Field
- Manager — Instance Relation → Employee *(self-referential)*
- Start Date — Date Field
- Employment Type — Single Selection (Full-time, Part-time, Contractor, Intern)
- Status — Single Selection (Active, On Leave, Terminated)
- Email — Email Field
- Phone — Phone Field
- Location — Single Selection (or Text Field)
- Salary — Number Field *(restrict access to HR group only)*

**Department**
- Name — Text Field *(primary display field)*
- Head — Instance Relation → Employee
- Description — Text Area
- Headcount — Formula Field (count of related Employees)

**Leave Request**
- Employee — Instance Relation → Employee *(primary display field can be formula: Employee name + dates)*
- Type — Single Selection (Annual, Sick, Parental, Unpaid, Other)
- Start Date — Date Field
- End Date — Date Field
- Days — Number Field (or Formula)
- Status — Single Selection (Pending, Approved, Rejected, Cancelled)
- Approver — User Relation
- Notes — Text Area
- Approved/Rejected Date — Date Field

**Review** (performance review cycle)
- Employee — Instance Relation → Employee
- Review Period — Single Selection (Q1 2025, Q2 2025, etc. — or Date Field)
- Reviewer — User Relation
- Overall Rating — Single Selection (Exceeds, Meets, Below Expectations)
- Goals Achieved — Text Area
- Development Plan — Text Area
- Status — Single Selection (Draft, Submitted, Finalised)

### Relationships
- Department → many Employees
- Employee → many Leave Requests
- Employee → many Reviews (as reviewee)

### Suggested views
- Employees: Table with Department filter; grouped by Department
- Leave Requests: Kanban by Status; Calendar by Start Date; filtered "Pending Approval"
- Reviews: Table filtered by current review period

### Workflow ideas
- When Leave Request Status → "Approved": send confirmation email to Employee
- When Leave Request created: send approval request email to Approver with approve/reject link
- When Employee Status → "Terminated": notify IT team to revoke access

---

## 5. Property Management

### Entities and fields

**Property**
- Property Name — Text Field *(primary display field)*
- Address — Text Area
- Type — Single Selection (Residential, Commercial, Mixed Use)
- Total Units — Number Field
- Manager — User Relation
- Notes — Text Area

**Unit**
- Unit Number — Text Field *(primary display field)*
- Property — Instance Relation → Property
- Bedrooms — Number Field
- Bathrooms — Number Field
- Floor Area (m²) — Number Field
- Status — Single Selection (Vacant, Occupied, Under Maintenance)
- Monthly Rent — Number Field (currency)

**Tenant**
- Full Name — Text Field *(primary display field)*
- Email — Email Field
- Phone — Phone Field
- ID Number — Text Field
- Emergency Contact Name — Text Field
- Emergency Contact Phone — Phone Field
- Notes — Text Area

**Lease**
- Reference — Text Field *(primary display field, e.g. "Unit 4B – John Smith")*
- Unit — Instance Relation → Unit
- Tenant — Instance Relation → Tenant
- Start Date — Date Field
- End Date — Date Field
- Monthly Rent — Number Field (currency)
- Security Deposit — Number Field (currency)
- Status — Single Selection (Active, Expired, Terminated)
- Signed Date — Date Field
- Notes — Text Area

**Rent Payment**
- Reference — Text Field *(e.g. "April 2025 – Unit 4B")*
- Lease — Instance Relation → Lease
- Month — Date Field (store as first day of the month)
- Amount Due — Number Field (currency)
- Amount Paid — Number Field (currency)
- Paid — Yes/No Field
- Payment Date — Date Field
- Payment Method — Single Selection (Bank Transfer, Cash, Card, Other)
- Notes — Text Area

**Maintenance Request**
- Title — Text Field *(primary display field)*
- Unit — Instance Relation → Unit
- Reported By — Instance Relation → Tenant *(optional)*
- Category — Single Selection (Plumbing, Electrical, HVAC, Structural, Appliance, General, Other)
- Priority — Single Selection (Low, Medium, High, Emergency)
- Status — Single Selection (Open, In Progress, Awaiting Parts, Completed)
- Date Reported — Date Field
- Target Completion — Date Field
- Actual Completion — Date Field
- Assigned To — Text Field (contractor name) *(or User Relation if internal staff)*
- Estimated Cost — Number Field (currency)
- Actual Cost — Number Field (currency)
- Notes — Text Area

### Relationships
- Property → many Units
- Unit → many Leases (only one Active at a time)
- Tenant → many Leases
- Lease → many Rent Payments
- Unit → many Maintenance Requests

### Suggested views
- Units: Table with Status filter; grouped by Property
- Active Leases: Table filtered Status=Active, sorted by End Date (upcoming expirations)
- Rent Payments: Table filtered to current month; Kanban by Paid status
- Maintenance Requests: Kanban by Status; filtered "Open + High/Emergency priority"

### Workflow ideas
- When Lease End Date is 60 days away: send renewal reminder to Property Manager
- When Maintenance Request Priority = "Emergency": send immediate email to Property Manager
- When Rent Payment Paid → true: send receipt confirmation email to Tenant (via Lease → Tenant email)
- When Lease Status → "Active": update linked Unit Status to "Occupied"
- When Lease Status → "Expired" or "Terminated": update linked Unit Status to "Vacant"
