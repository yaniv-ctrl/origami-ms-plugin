# Origami Troubleshooting Guide

Diagnosis trees for the most common Origami problems. For each issue category, follow
the numbered steps in order — they're sorted by likelihood (most common cause first).

---

## Table of contents

1. Workflow not firing
2. Import failing or showing conflicts
3. User can't see records (or sees records they shouldn't)
4. Field not showing in a view or record
5. Formula field showing wrong value or error
6. Email notifications not sending
7. Performance is slow
8. Record won't save
9. Relation field not working correctly
10. Data appears missing after import
11. Scheduled workflow not running on time
12. Workflow runs but action has no effect
13. Web form not working
14. WhatsApp messages not sending
15. API / Make.com integration issues
16. Google Calendar sync problems
17. PDF / document generation issues
18. Dashboard widgets not updating
19. Smart search not working correctly
20. Repeating group display issues

---

## 1. Workflow not firing

Navigate to **Settings > Automation** and open the workflow.

1. **Is it enabled?** Check the active/inactive toggle at the top. If it's off, nothing
   runs regardless of other settings. Turn it on.

2. **Check the trigger type.** Open the Trigger tab. Confirm:
   - The correct entity is selected
   - The correct event type is set (Record Created / Field Changed / Scheduled / Button)
   - For "Field Changed" triggers: the correct field is selected and the value condition
     is right (e.g., "equals Active" vs. "changed from any value")

3. **Check conditions.** Open the Conditions tab.
   - A condition on a Relation field must use "is not empty" or "is empty" — value
     comparisons on relation fields don't work as expected.
   - Multiple conditions are AND by default. If any one fails, the workflow won't fire.
   - Remove conditions temporarily to test if the trigger itself works.

4. **Timing matters.** "Field Changed" triggers fire on **save**, not on intermediate
   edits in the UI. Confirm the user clicked Save after changing the field value.

5. **Test manually.** Open a record that should trigger the workflow. Look for a "Run
   workflow" or "Test" button (check the record's action menu or the workflow editor).
   This forces execution and surfaces any runtime error.

6. **Check for conflicting workflows.** If another workflow on the same trigger changes
   the same field back, it can cancel out the effect. Review all workflows on this entity.

---

## 2. Import failing or showing conflicts

Navigate to **Settings > Data Management > Import Data**.

1. **File format.** Must be .xlsx or .csv. Check the file isn't corrupted or
   password-protected. Max size: 30 MB.

2. **Column mapping errors (Phase 2).** Every required field on the entity must be mapped
   to a column, or the import won't proceed.
   - Map required fields first
   - Unmapped optional columns can be set to "Do not import"
   - If the file has multiple sheets (XLSX), select the correct sheet at the top

3. **Conflicts screen.** Records listed here failed validation:
   - **Type mismatch** — text in a number field, wrong date format, etc.
   - **Required field empty** — rows missing values for required fields
   - **Uniqueness violation** — duplicate values in a field marked "Unique for Entity"
   - **Invalid relation reference** — the linked record doesn't exist
   - Use **Download Invalid Records** to get all failing rows (the screen only shows 50)
   - Fix in the spreadsheet, then re-import just the fixed rows

4. **Relation fields.** Relations can't be imported in the same pass as the parent entity.
   Import parent records first. Then import child records where the relation column
   contains the parent record's **display name** (must match character-for-character,
   including case and spacing).

5. **Date format.** Origami expects dates in ISO format (YYYY-MM-DD). Excel dates stored
   as serial numbers need to be formatted as text first (Format Cells > Text > re-enter
   the date).

6. **Large imports timing out.** Disable workflows on the target entity before importing.
   Split files larger than 10K rows into batches.

---

## 3. User can't see records (or sees records they shouldn't)

Navigate to **Settings > Permissions** and select the relevant entity + user group.

1. **View permission not enabled.** The user's group needs View permission on the entity.
   Check that it's ticked.

2. **View-level filter hiding records.** Go to the view the user is looking at. Check if
   a filter is applied (filter icon in the view toolbar). A saved default filter can
   silently exclude records. Clear the filter and see if records appear.

3. **Wrong user group.** Go to **Settings > User Management**, find the user, and confirm
   they're assigned to the correct group.

4. **Row-level access rules.** Some setups use a relation field (e.g., "Assigned To") to
   restrict records to those owned by or related to the logged-in user. Check the entity's
   permissions for any "Record visibility" or row-level access rules.

5. **User is disabled.** A disabled user account can't access anything. Check their status
   in **Settings > User Management**.

6. **Seeing too much.** If a user sees records they shouldn't:
   - Check if they belong to multiple groups (permissions are additive — most permissive wins)
   - Check if the entity has no restrictions (all users can view by default)
   - Review row-level filtering rules

---

## 4. Field not showing in a view or record

1. **Not added to this view.** Click the column settings icon (gear or column picker) in
   the view toolbar and add the field. Fields must be explicitly added per view — creating
   a field doesn't auto-add it to existing views.

2. **Hidden by conditional visibility.** Go to **Settings > [Entity] > Visual Editor**.
   Check whether the field has a visibility rule (eye icon with conditions) that hides it
   based on another field's value. The field may only appear when certain conditions are met.

3. **Field is in a different field group.** The field might exist on the entity but be
   placed in a field group that's collapsed, hidden, or in a different tab. Check the
   Visual Editor for the field's location.

4. **Field is suspended.** A suspended field still exists but isn't shown. Check the field's
   context menu for a "Suspended" toggle.

5. **Permission issue.** The user's group might not have View permission on that specific
   field. Check **Settings > Permissions** at the field level.

6. **Relation/Reference field with no data.** The column appears empty (not missing). If
   it's missing entirely, see point 1.

---

## 5. Formula field showing wrong value or error

Open **Settings > [Entity] > Fields > [Formula field] > Edit**.

1. **Use the test tool first.** Enter a record ID in the test runner at the bottom of the
   formula editor and click Run. This shows the actual output and any error message.

2. **Empty field / null errors.** The #1 cause. If any referenced field is empty on the
   test record, arithmetic on it will produce 0 or throw an error. Add null guards:
   ```
   #field != "" ? #field * #rate : 0
   ```

3. **Type mismatch.** String operations on number fields (or vice versa) cause errors.
   Cast explicitly: `(string)#number_field` or `(float)#text_field`.

4. **Field variable name changed.** If the field was renamed after the formula was written,
   the variable reference breaks. Re-insert the field using the `#` picker.

5. **Circular reference.** If field A references field B and B references A, both will
   error. Break the cycle by using an intermediate hidden field.

6. **Date math issues.** Date fields must be wrapped in `strtotime()` before doing
   arithmetic. Raw date strings can't be added or subtracted directly.

7. **Use the AI assistant.** If the formula is complex, describe what you want in plain
   text to the AI agent in the formula editor. Mention empty-field handling explicitly.

---

## 6. Email notifications not sending

1. **SMTP not configured.** Go to **Settings > System Preferences > Email**. At least one
   SMTP account must be configured and set to **Active**. Without valid SMTP, email
   actions silently fail with no error shown.

2. **Wrong SMTP account selected.** Open the workflow's Send Email action and check which
   email account is selected. It might be pointing to an inactive or misconfigured account.

3. **Test the SMTP account.** Use the "Test Send" button in **Settings > System Preferences >
   Email** to verify the SMTP account can actually send.

4. **Recipient field empty.** If the email action uses an email field from the record, and
   that field is empty on the triggering record, no email sends. Check the record data.

5. **Workflow conditions blocking it.** The email action might be in a workflow whose
   conditions aren't being met. See "Workflow not firing" above.

6. **Email in spam.** The email may be sending but landing in the recipient's spam folder.
   Check spam, and consider configuring SPF/DKIM records for your domain.

---

## 7. Performance is slow

1. **Too many records in an unfiltered view.** Add a default filter to limit the initial
   load. Views loading thousands of records will be slow.

2. **Heavy Reference fields.** Reference fields that pull values from deeply nested
   relations compound on large record sets. Consider denormalizing — store the value
   directly on the record if it's queried often.

3. **Many workflows on a large import.** Each imported record can trigger multiple
   workflows. Disable workflows before bulk imports, re-enable after.

4. **Complex formulas on many records.** Formulas that reference multiple fields or do
   date math recalculate on every save. Simplify or use hidden fields to cache
   intermediate values.

5. **Too many entities loading at once.** If the account has many entities, initial load
   can be slow. Archive unused entities.

---

## 8. Record won't save

1. **Required field empty.** A required field hasn't been filled in. Check all required
   fields (marked with an asterisk *). Some may be hidden by conditional visibility —
   they're still required even when hidden.

2. **Validation workflow blocking save.** A workflow with a Validation action may be
   rejecting the save. Check for error messages. Review workflows with "Before" trigger
   timing that include Validation actions.

3. **Unique constraint violated.** A field marked "Unique for Entity" has a value that
   already exists on another record. Change the value or check for duplicates.

4. **Min/max constraints on selection fields.** Multiple Selection fields can have min/max
   selection limits. Ensure the number of selections meets the requirement.

5. **Relation field constraints.** Multi Instance Relation fields can have min/max related
   record limits. Check the field settings.

---

## 9. Relation field not working correctly

1. **Target entity doesn't exist.** The entity the relation points to may have been
   deleted or renamed. Check the field settings for the target entity.

2. **No records in target entity.** The dropdown is empty because there are no records to
   link to. Create records in the target entity first.

3. **Filter on the relation field.** The field may have a "Filter Related Records" setting
   that's limiting which records appear. Check the field settings.

4. **Display name confusion.** The relation field shows the target entity's primary display
   field. If that field is empty on some records, they'll appear as blank in the dropdown.

5. **Reverse link not showing.** If you expect to see linked records on the "other side"
   of the relationship, you need to set up a Linked View (reverse link). Go to the
   entity's Views panel > Reverse Link section.

---

## 10. Data appears missing after import

1. **Rows failed validation.** Check if the import had conflicts. Download the invalid
   records file to see what was skipped.

2. **View filter hiding imported records.** Clear all filters on the view and check again.

3. **Imported into wrong entity.** Confirm the import targeted the correct entity.

4. **Relation fields not linked.** Relations continue updating in the background after the
   import wizard closes. Wait a few minutes, then refresh.

5. **Update-by-key matched incorrectly.** If you used "Update by key field," records may
   have been updated instead of created (or vice versa). Check the key field values.

---

## 11. Scheduled workflow not running on time

1. **Check the schedule.** Open the workflow and verify the frequency setting matches
   expectations (hourly, daily at specific time, weekly, monthly).

2. **Timezone.** The schedule runs in the system timezone set in **Settings > System
   Preferences > General Settings > Timezone**. If the timezone is wrong, the schedule
   fires at the wrong local time.

3. **Workflow is disabled.** Check the active/inactive toggle.

4. **Conditions filtering out all records.** The workflow fires on schedule, but conditions
   may not match any records at that moment. Check conditions against current data.

---

## 12. Workflow runs but action has no effect

1. **Update Fields action targeting wrong record.** Check whether the action is updating
   the current record or a related record. If targeting a related record, confirm the
   relation path is correct.

2. **Static vs. formula value.** If the update value is a formula, it might be evaluating
   to empty or the same value. Test the formula logic.

3. **Permission issue on the workflow.** In rare cases, the workflow's execution context
   may not have permission to modify certain fields. Check field-level permissions.

4. **Another workflow reverting the change.** If a second workflow triggers on the same
   field change and resets it, the net effect is nothing. Review all workflows on the entity.

5. **Copy Instance action field mapping wrong.** For Copy Instance actions, verify that
   source and target fields are mapped correctly and have compatible types.

---

## 13. Web form not working

Origami web forms are external-facing forms that create records in entities.

1. **Form URL invalid or expired.** Confirm the web form is still active and the URL
   hasn't changed. Re-generate the form link if needed.

2. **Required fields on the entity not mapped to the form.** If the entity has required
   fields that aren't included in the web form, submissions will fail silently. Either
   add those fields to the form or set default values on them.

3. **Conditional visibility fields in web forms.** Fields with conditional visibility
   rules may not behave the same in web forms as in the internal UI. Test the form
   thoroughly with different field combinations.

4. **File upload in web forms.** File upload fields may have size or type restrictions
   that aren't clearly communicated to the external user. Check the field settings for
   max size and allowed types.

5. **Submission not creating a record.** Check if a Validation workflow is blocking the
   record creation. Also verify the form's target entity is correct.

---

## 14. WhatsApp messages not sending

1. **WhatsApp Business account not connected.** The Send WhatsApp action requires an
   active WhatsApp Business account integration. Verify the connection in system settings.

2. **Phone number format.** WhatsApp requires full international format (e.g., +972...).
   Ensure the phone field on the record has the correct format with country code.

3. **Template not approved.** WhatsApp Business requires message templates to be
   pre-approved. If using a template, confirm it's been approved by WhatsApp.

4. **Workflow conditions not met.** Check that the workflow's conditions are being
   satisfied for the specific record.

---

## 15. API / Make.com integration issues

1. **API token not generated or expired.** Go to your Origami account settings and
   generate or refresh the API token. Make sure you're using the correct token in the
   external service.

2. **Incorrect API endpoint.** The Origami API URL follows the pattern:
   `https://[subdomain].origami.ms/api/...` — confirm the subdomain and endpoint path.

3. **Make.com (formerly Integromat) connection.** When connecting through Make.com:
   - Use the correct subdomain
   - Enter the API token (not your login password)
   - Test the connection before building scenarios

4. **External service webhook not receiving data.** In the "Call External Service"
   workflow action, verify: the URL is correct, headers include Content-Type, the body
   JSON is properly formatted with value tags, and the external service is reachable.

5. **Rate limiting.** Rapid API calls from bulk operations may hit rate limits. Space
   out calls or use batch operations where possible.

---

## 16. Google Calendar sync problems

1. **Calendar integration not configured.** Check that Google Calendar sync is set up
   in the entity's calendar view settings. The integration requires OAuth authentication
   with Google.

2. **Events not syncing.** Ensure the date fields used by the calendar view are properly
   populated. Empty date fields won't create calendar events.

3. **Two-way sync delays.** Changes in Google Calendar may take a few minutes to reflect
   in Origami and vice versa. Allow time for sync to complete.

4. **Permission issues.** The Google account used for sync must have edit permissions on
   the target calendar.

---

## 17. PDF / document generation issues

1. **Template variables not populating.** In the "Fill up a Document" workflow action,
   check that field mappings match the template placeholders exactly (including case).

2. **PDF output is blank or malformed.** The document template may have formatting issues.
   Re-upload a clean template and re-map the fields.

3. **Hebrew/RTL text in PDFs.** RTL languages may render incorrectly in generated PDFs.
   Ensure the template supports RTL formatting and fonts.

4. **Large documents timing out.** Documents with many pages or embedded images may time
   out during generation. Simplify the template or reduce image sizes.

---

## 18. Dashboard widgets not updating

1. **Data source not refreshed.** Dashboard widgets may cache data. Refresh the page or
   check if the widget has an auto-refresh interval setting.

2. **Widget filters stale.** If the widget has date filters or entity filters, check that
   they match the current data you expect to see.

3. **Pie chart / graph showing old data.** Some chart widgets don't update in real-time.
   Navigate away and back, or manually refresh the dashboard.

4. **Widget data source entity changed.** If the underlying entity's fields were renamed
   or removed, the widget may break. Reconfigure the widget's data source.

---

## 19. Smart search not working correctly

1. **Index not updated.** After bulk imports or large data changes, the search index may
   need time to update. Wait a few minutes and try again.

2. **Search scope.** Smart search may not cover all entities or all fields. Check which
   entities and fields are included in the search scope.

3. **Special characters.** Search terms with special characters (quotes, brackets, Hebrew
   characters mixed with English) may not return expected results. Try simpler search terms.

---

## 20. Repeating group display issues

1. **External table view not showing repeating group data.** Repeating group data has
   limited visibility in certain view types. The data is primarily visible in the record
   detail view. For external table views, individual fields within repeating groups may
   not be separately addressable.

2. **Repeating group rows not saving.** Ensure all required fields within the repeating
   group row are filled before saving.

3. **Workflow on repeating group not firing.** Use the "On Repeatable Group Create" or
   "On Repeatable Group Delete" trigger types specifically — regular "On Instance Create"
   won't fire for repeating group row additions.
