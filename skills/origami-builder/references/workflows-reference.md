# Workflows Reference

## Anatomy of a Workflow

Every workflow has three layers:

### 1. Trigger
Event that initiates the workflow execution. Examples: record creation, field update, scheduled time, user action button click.

### 2. Conditions
Filters evaluated after trigger fires. Workflow only proceeds if all conditions met. Can be based on field values, user roles, dates, etc.

### 3. Actions
Series of tasks executed in order if conditions pass. Range from sending emails to creating records to external integrations.

---

## Trigger Types

### Workflow Configuration - Common Fields
- **Rule Name**: Descriptive identifier for workflow
- **Workflow Description**: Required; minimum 10 characters
- **Reflection of UI Changes**: When visual effects display
  - When all actions finished (default)
  - On each action
- **Execute Trigger Timing**: Relative to initiating action
  - Default: standard timing
  - Before: fires before action completes
  - After: fires after action completes

---

## Data Type Triggers

Based on record or field data changes.

**On Instance Create**
- Fires when new record created
- Use: Auto-assign, send notifications on new record

**On Repeatable Group Create**
- Fires when repeatable group row added to record
- Use: Track additions to dynamic datasets

**On Field Update**
- Fires when specific field updated
- Field Selection: Choose specific field or leave open for any field
- Use: Trigger on status change or critical updates

**On Instance Delete**
- Fires when record deleted
- Use: Cleanup, archival, dependent record management

**On Repeatable Group Delete**
- Fires when repeatable group row deleted
- Use: Data consistency, dependency handling

**On Instance View**
- Fires when record opened/viewed
- Use: Display alerts, messages based on record status

---

## Action Button Triggers

User-initiated workflow execution through button in UI.

**Configuration:**
- **Button Text**: Label displayed on button
- **Button Type Options**:
  - Place on instance view as bulk: Bulk action button in tables
  - Place on single instance edit: Inner button during editing
  - Place as outer quick action: Quick action in table rows
  - Place on Field Group: Button positioned in specific field group
- **Select View** (conditional): Which saved view loads when activated
- **Icon Selection**: Visual icon for button
- **Color Picker**: Button color for visibility

**Best Practices:**
- Clear, descriptive button text
- Strategic UI placement for visibility
- Consistent design across entity
- Consider conditional visibility to reduce clutter
- Provide immediate feedback after button press

---

## Scheduled Triggers

Time-based workflow execution at regular intervals.

**Frequency Options:**
- Every Round Hour (start of each hour)
- 15, 30, 45 Minutes Past the Hour
- Specific Hour of Day (e.g., 1 AM, 2 PM) for daily tasks
- Specific Day of Month (e.g., 1st, 15th) for monthly tasks
- Specific Month (e.g., January, July) for seasonal/annual tasks
- Specific Day of Week (e.g., Sunday, Wednesday) for weekly tasks

**Best Practices:**
- Align schedule with operational needs and peak activity times
- Avoid overlap with other critical system operations
- Review periodically and adjust as operational needs evolve
- Consider timezone implications

---

## Workflow Conditions & Permissions

After trigger fires, conditions determine if workflow proceeds.

**Filter Conditions:**
- Set field-based conditions (e.g., "Status = Active")
- Multiple conditions combined with AND/OR logic
- Can reference field values, dates, user properties

**Permissions:**
- Control who can execute workflow (if action button)
- Can restrict to specific user groups
- Can restrict based on creator or assignment

---

## Workflow Actions (22 Types)

### 1. Send Email Action
Send automated emails to static or dynamic recipients.

**Configuration:**
- **Email Account Selection**: Choose SMTP account (or use default)
- **Email Recipients**:
  - Entity Email Fields: Select email field from current entity
  - Related Entities: Select email fields from related records
  - Static Email Addresses: Enter fixed recipient addresses
- **Message Composition**:
  - Subject line
  - Email body (plain text or HTML)
  - Value tags from record for personalization
- **Attachments**: Optionally attach documents generated from workflow
- **Send After Delay**: Option to queue email for later sending

**Use Cases:** Notifications, confirmations, status updates, approvals

---

### 2. Open New Window Action
Open URL in new browser window with optional record context.

**Configuration:**
- **URL**: Static URL or dynamic URL with field values
- **URL Parameters**: Pass record data to external system
- **Window Target**: New tab or new window

**Use Cases:** Link to external tools, open reports, third-party integrations

---

### 3. Call an External Service Action
Make HTTP requests to external APIs/webhooks.

**Configuration:**
- **URL**: Endpoint to call (static or dynamic)
- **Request Type**: GET, POST, PUT, DELETE, PATCH
- **Headers**: Custom headers (e.g., Authorization, Content-Type)
- **Body**: JSON payload with record data
- **Authentication**: Basic auth, Bearer token, custom headers

**Use Cases:** Trigger external systems, sync data, call webhooks, API integrations

---

### 4. Bulk Update Action
Update multiple records matching criteria.

**Configuration:**
- **Filter Criteria**: Which records to update
- **Field Mappings**: Which fields to change and to what values
- **Update All Matching**: Affects all records meeting criteria

**Use Cases:** Bulk status changes, batch updates, data corrections

---

### 5. Authentication Request Action
Force user re-authentication before proceeding with sensitive actions.

**Configuration:**
- **Force Re-authentication**: User must enter credentials again
- **Credentials Required**: Even if currently logged in
- **Insert into Inner Instance Comments Checkbox**: Log authentication attempt in record comments
- **Compliance Trail**: Creates audit log of verification

**Use Cases:** Sensitive data modification, compliance requirements, high-risk operations

---

### 6. Archive Action
Move records to archive (hide from views but retain for reporting).

**Configuration:**
- **Action Type**:
  - Archive: Move to archive
  - Unarchive: Restore from archive
- **Accessibility**: Archived records still accessible for reporting/historical reference

**Use Cases:** Data management, keeping views clean, compliance/historical retention

---

### 7. Send SMS Action
Send automated text messages.

**Configuration:**
- **Phone Account**: Configure sending number in System Preferences › SMS Settings
- **Phone Field Selection**:
  - Local entity phone fields
  - Related entity phone fields
  - Static phone numbers
- **Message Content**: Compose SMS with text and value tags
- **Dynamic Personalization**: Use record-specific tags

**Use Cases:** Alerts, confirmations, customer notifications, urgent communications

---

### 8. Update Fields Action
Automatically update field values in current or related records.

**Configuration:**
- **Target Records**: Current record or related records
- **Field Updates**:
  - Static Values: Fixed values (e.g., status = "Active")
  - Formula Values: Dynamic calculations
  - Unlimited field updates in single action
- **Related Records**: Extend updates through relation fields

**Use Cases:** Status progression, calculated field updates, cascading data changes

---

### 9. Copy Instance Action
Duplicate records from one entity to another.

**Configuration:**
- **Target Entity**: Entity where record will be copied
- **Field Mapping**: Source field → Target field mapping
- **Data Compatibility**: Ensure field types compatible
- **Multiple Copies**: Can create multiple copies from single source
- **Custom Values**: Assign static values or formulas to copied fields

**Use Cases:** Data replication, template utilization, operational efficiency

---

### 10. Report Export Action
Generate and export report files.

**Configuration:**
- **Report Selection**: Choose which report to generate
- **Export Format**: PDF, Excel, CSV, etc.
- **Filter Criteria**: What data to include in export
- **Email Export**: Optionally email result to recipients
- **Destination**: File storage or email delivery

**Use Cases:** Generate reports on demand, scheduled reporting, email distributions

---

### 11. Lock/Unlock Action
Lock or unlock records to prevent/allow editing.

**Configuration:**
- **Action Type**:
  - Lock: Prevent editing
  - Unlock: Allow editing
- **Locked Records**: Cannot be modified; read-only status

**Use Cases:** Prevent accidental changes, enforce approval workflows, archive protection

---

### 12. Validation Action
Validate record data against rules and reject if invalid.

**Configuration:**
- **Validation Rules**: Conditions that must be met
- **Error Message**: Message displayed if validation fails
- **Block Record Save**: Prevent save if invalid

**Use Cases:** Data quality checks, enforce business rules, prevent invalid states

---

### 13. Remove Instance Action
Delete records from system.

**Configuration:**
- **Target Records**: Current record or related records
- **Cascading Deletes**: Handle dependent records
- **Permanent Removal**: Records deleted from system

**Use Cases:** Cleanup operations, automated deletion, data archival

---

### 14. Notification Action
Display in-app notification messages to users.

**Configuration:**
- **Message Content**: Notification text
- **Message Type**: Info, warning, success, error
- **Recipients**: Display to specific user groups or all users
- **Display Duration**: How long notification shows

**Use Cases:** User alerts, process notifications, status updates

---

### 15. Create New Repeatable Group Action
Add row to repeatable group (table field) in record.

**Configuration:**
- **Target Repeatable Group**: Which repeatable field to add to
- **Field Values**: Populate new row fields with static/formula values
- **Multiple Rows**: Can add multiple rows in single action

**Use Cases:** Auto-add line items, generate invoice rows, create task checklists

---

### 16. Redirect to Instance Action
Navigate user to different record.

**Configuration:**
- **Target Entity**: Which entity record to navigate to
- **Target Record**: Specific record (static ID or dynamic reference)
- **View**: Which view to open (optional)

**Use Cases:** Navigation, process flow direction, context switching

---

### 17. External Database Action
Execute operations in external databases.

**Configuration:**
- **Database Connection**: External database connection credentials
- **Query Type**: SELECT, INSERT, UPDATE, DELETE
- **SQL Query**: Custom SQL with record data substitution
- **Result Handling**: What to do with query results

**Use Cases:** External data sync, legacy system integration, cross-database updates

---

### 18. Send a Contract Action
Generate and send contract/agreement document.

**Configuration:**
- **Contract Template**: Which document template to use
- **Recipient Email**: Who receives the document
- **Document Format**: PDF, Word, etc.
- **Signature Required**: Optional e-signature flow

**Use Cases:** Automated contract generation, agreement workflows, document distribution

---

### 19. Display User Message Action
Show custom message to user in modal/popup.

**Configuration:**
- **Message Text**: Content of message
- **Message Type**: Info, warning, error, success
- **Display Duration**: How long to show (seconds)
- **User Interaction**: Modal (requires acknowledgment) or toast (auto-dismiss)

**Use Cases:** User feedback, workflow confirmations, informational alerts

---

### 20. AI Automation Action
Use AI to generate content or make decisions.

**Configuration:**
- **AI Provider**: ChatGPT, Gemini, Grok, Claude
- **Prompt**: Instruction for AI (can include field values)
- **Output Field**: Where to store AI result
- **Temperature/Parameters**: Adjust response creativity/consistency

**Requirements:** At least one AI provider API key configured in System Preferences

**Use Cases:** Content generation, intelligent categorization, response composition

---

### 21. Effects Action
Apply visual effects to records (styling, highlighting, etc.).

**Configuration:**
- **Effect Type**: Highlight, color, animation, etc.
- **Target**: Current record or related records
- **Duration**: How long effect displays

**Use Cases:** Visual feedback, status indication, attention-drawing

---

### 22. Fill up a Document Action
Populate document/template fields from record data.

**Configuration:**
- **Document Template**: Template to populate
- **Field Mapping**: Record field → Document field
- **Output Format**: PDF, Word, etc.
- **Delivery**: Email, save to file, display to user

**Use Cases:** Invoice generation, report creation, automated document production

---

## Additional Workflow Actions

**Lock File Action**
- Lock files to prevent modification
- Lock file versions

**Send WhatsApp Message Action**
- Send WhatsApp messages to linked contacts
- Requires WhatsApp Business account integration
- Configuration similar to SMS action

---

## Workflow Best Practices

**Design & Testing:**
- Clear objectives for each workflow
- Start simple, gradually add complexity
- Thoroughly test in controlled environment
- Iterate based on feedback and performance
- Document complex workflows for maintenance

**Performance:**
- Avoid overlapping scheduled triggers
- Disable workflows during large data imports
- Monitor cascading effects of actions
- Test with large datasets

**Maintenance:**
- Regularly review active workflows
- Update permissions as roles change
- Archive obsolete workflows
- Track interdependencies between workflows
- Document trigger-condition-action logic clearly

**Targeted Triggers:**
- Set triggers on fields that significantly impact workflows
- Avoid duplicate triggers/actions across workflows
- Maintain clear configuration documentation

**Action Configuration:**
- Verify formula accuracy before deployment
- Understand cascading effects on related records
- Test email/SMS formatting
- Back up critical workflow configurations
- Consider user experience impact
