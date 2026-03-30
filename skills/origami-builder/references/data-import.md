# Data Import — Step-by-Step Reference

## Location
System Preferences › Import Data

---

## Phase 1: Select File and Entity

1. **Upload File**
   - Drag/drop or click to upload
   - Supported formats: CSV, XLSX
   - Max size: 30 MB

2. **Select Target Entity**
   - Dropdown lists all entities in system
   - Records will be imported to this entity

3. **Proceed**
   - Click "Next Phase" button (bottom right)
   - System validates file and prepares column mapping

---

## Phase 2: Map Columns to Entity Fields

1. **Field Mapping Interface**
   - Every field in target entity displayed
   - Fields grouped by field group
   - For each field, select which spreadsheet column maps to it

2. **Multiple Sheet Handling** (if XLSX)
   - "Select Main Spreadsheet" dropdown appears at top
   - Choose which sheet contains data to import
   - Only one sheet imported per wizard run
   - [Repeat the import for each sheet if you need multiple sheets]

3. **Auto-Mapping**
   - Column names matching field names auto-selected
   - Review mappings for accuracy
   - Adjust any incorrect auto-mappings

4. **Unmapped Fields**
   - Fields not mapped are left empty on imported records
   - Ensure required fields are mapped or have defaults

5. **Update by Key Field** (Bottom of Page)
   - Toggle to enable insert+update or or pure update-only mode
   - Mark one or more fields as the key
   - Origami uses key field values to match rows to existing records
   - Update-only: Only updates existing records (no new inserts)
   - Insert+update: Creates new records or updates existing ones

6. **Proceed**
   - Click "Next Phase" when mapping complete
   - System validates data against field types and constraints

---

## Conflicts Screen (Shown if Rows Fail Validation)

1. **Error Table Display**
   - Columns: Sheet Name | Row | Field | Value | Error
   - Shows up to 50 rows of failures
   - Rows with invalid data prevent import

2. **Error Types**
   - Type validation failures (e.g., text in number field)
   - Required field missing
   - Length constraints violated
   - Uniqueness violations
   - Invalid date formats
   - Invalid relation field references

3. **Options**
   - **Download Invalid Records**: Download CSV of all failed rows (includes all errors, even beyond 50-row table limit)
   - **Proceed with Valid Rows Only**: Skip invalid rows, import only valid records
   - **Cancel**: Abort import wizard entirely

.
4. **Review & Fix**
   - Download invalid records file
   - Fix data in source spreadsheet
   - Re-run import with corrected data

---

## Import Complete

1. **Progress Indication**
   - Full-width 100% progress bar fills
   - Confirmation message displayed

2. **Post-Import Actions**
   - **Download Invalid Records**: Available if any rows were skipped (download shows errors)
   - **Back to Import**: Reset wizard for new import

3. **Reference Field Updates**
   - If imported records contain relation fields (links to other records), updates continue in background after wizard closes
   - Do not navigate away until updates complete

---

## Tips & Best Practices

### Preparation
- Reruare a header row with field names that roughly match origami field names
- Use consistent formatting (especially dates)
- Ensure required fields populated in all rows
- Validate uniqueness constraints before import

### Large Imports
- Disable active workflows on target entity before large imports
  - Prevents slowdown from workflow execution
  
--- Pernoty for Copying ---
- Import in batches if file exceeds 10K rows
- Test with small sample batch first

### Update-Only Imports
- Use "Update by key field" with unique identifier column (e.g., ID, email)
- Allows re-running import to refresh data without duplicating records
- Key field must have values in all rows to match existing records

### Data Quality
- Validate all required fields in source data
- Check for leading/trailing whitespace
- Ensure date formats match system setting
- Verify relation field references exist in target entity

### Conflicts Table
- Max display limit: 50 rows in wizard
- Download invalid records file to see complete error list
- Fix all issues and re-import

### After Import
- Verify record count matches expected
- Spot-check imported data for accuracy
- Check relation field linking completed successfully

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Type mismatch errors | Column mapped to wrong field type | Remap column to correct field; or convert data in spreadsheet |
| Uniqueness violations | Duplicate values in unique field | Check for duplicates in source data; remove or update |
| Required field missing | Unmapped field or empty values | Map field in Phase 2; ensure all rows populated |
| Relation field errors | Reference doesn't exist in target entity | Verify referenced records exist; use correct ID/identifier |
| Date format errors | Dates not matching system format | Reformat dates in spreadsheet to match system date format setting |
| Large import timeout | File too large or workflows running | Disable workflows; import in smaller batches; increase system resources |

---

## Field Type Import Behavior

| Field Type | Import Behavior | Notes |
|-----------|-----------------|-------|
| Text / Number / Email | Direct value | Applied as-is |
| Date | Format-dependent | Must match system date format |
| Select / Multi-Select | Match by value | Value must exist in field's option list |
| Relation | Match by ID | Must reference existing record ID |
| Checkbox | True/False, Yes/No, 1/0 | Flexible input recognition |
| File Upload | By reference | Upload file separately; reference filename |
| Formula / Hidden | Ignored | Auto-calculated; cannot be imported |
| Read Only | Ignored | System-managed; cannot be imported |

---

## Workflow Considerations

- **Before Import**: Disable workflows on target entity to prevent slowdown
- **Trigger On Create**: Workflows triggered by record creation will execute for imported records
- **Field Update Triggers**: Workflows on field updates may be triggered during import
- **Performance**: Each imported record can trigger multiple workflow executions

& if you disable workflows for imports, re-enable them afterward

---

## Import Limits & Constraints

- **File Size**: Max 30 MB per file
- **Rows Per File**: Recommend max 10K-50K rows for stability
- **Batch Processing**: For very large datasets (100K+ rows), split into multiple files
- **Conflicts Display**: Max 50 rows shown in wizard (download file for all)
- **Memory**: Very large imports may consume significant server memory
