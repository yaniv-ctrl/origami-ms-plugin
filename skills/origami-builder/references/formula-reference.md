# Origami Formula Reference

Origami formulas are PHP-like scripts that run on a single record and return a value.
They have access to the record's field values via `#field_name` variables, and a restricted
set of PHP functions.

---

## Table of contents

1. How to write a formula
2. Using the AI assistant
3. Using the test tool
4. Language reference
5. Common patterns
6. Error handling and null safety
7. Common errors and fixes

---

## 1. How to write a formula

Open the Formula Field editor. You'll see a code area where you write the script.

- **Insert a field variable:** Click the `#` button (or type `#`) to open a picker showing
  all fields on the current entity. Select a field to insert it as `#field_name`. At
  runtime, this is replaced with the field's current value for that record.
- **Return a value:** The last expression evaluated (or an explicit `return` statement)
  becomes the field's value.
- **Data types:** Field values come in as strings, numbers, or null depending on the
  field type. Cast explicitly when mixing types.

---

## 2. Using the AI assistant

The formula editor includes an AI agent. Click the AI button (usually a sparkle/wand icon)
and describe what you want in plain English. The assistant knows:
- Which fields exist on the entity (their names and types)
- The formula language syntax and constraints
- Common patterns like null handling, date math, conditionals

**Tips for good AI prompts:**
- Name the fields you want to use: *"combine #first_name and #last_name with a space"*
- Describe the null/empty case: *"if #due_date is empty, return 'No due date'"*
- Describe the output format: *"return as a number rounded to 2 decimal places"*
- For conditional logic, give all the cases: *"if #status is 'Active' return 'green', if 'Pending' return 'yellow', otherwise return 'grey'"*

The AI output is a starting point — test it and tweak as needed.

---

## 3. Using the test tool

Below the formula editor is a **test runner**. Enter the ID of any existing record from
the same entity (visible in the record's URL or detail view), then click Run/Test.

The test runner:
- Executes the formula against that record's real field values
- Shows the output value
- Shows any PHP errors or exceptions

**Workflow for debugging:**
1. Write or generate the formula
2. Find a record ID that represents a typical case (and one with empty fields)
3. Test both — a formula that works on populated records often fails on nulls
4. Fix any errors, re-test, then save

---

## 4. Language reference

### Variables
```php
#field_name          // value of the field named "field_name" on this record
```
Field names with spaces use underscores in variable form (e.g. `First Name` → `#first_name`).

### Arithmetic
```php
#price * #quantity
#total - #discount
#score / #max_score * 100
```

### String operations
```php
#first_name . " " . #last_name          // concatenation with .
strtoupper(#name)                        // uppercase
strtolower(#email)                       // lowercase
trim(#notes)                             // strip whitespace
strlen(#description)                     // character count
substr(#reference, 0, 8)                 // first 8 characters
str_replace("-", "/", #code)             // replace characters
strpos(#tags, "urgent") !== false        // contains check
```

### Math functions
```php
round(#amount, 2)     // round to 2 decimal places
ceil(#value)          // round up
floor(#value)         // round down
abs(#balance)         // absolute value
max(#a, #b)           // larger of two values
min(#a, #b)           // smaller of two values
```

### Conditionals
```php
// if / else
if (#status == "Active") {
    return "green";
} else {
    return "grey";
}

// ternary (inline)
#is_paid ? "Paid" : "Outstanding"

// if / elseif / else
if (#score >= 90) {
    return "Excellent";
} elseif (#score >= 70) {
    return "Good";
} else {
    return "Needs improvement";
}
```

### Date operations
```php
// Current date/time
date("Y-m-d")                            // today as "2025-04-15"
date("d/m/Y")                            // today as "15/04/2025"

// Parse a date field value into a timestamp
$ts = strtotime(#due_date);

// Format a date field
date("d M Y", strtotime(#start_date))    // "15 Apr 2025"

// Days between two dates
$days = (strtotime(#end_date) - strtotime(#start_date)) / 86400;
return round($days);

// Days until a future date
$days_left = (strtotime(#due_date) - time()) / 86400;
return max(0, round($days_left));

// Days since a past date
$days_since = (time() - strtotime(#created_date)) / 86400;
return round($days_since);
```

### Type casting
```php
(int)#quantity           // cast to integer
(float)#price            // cast to float
(string)#id_number       // cast to string
```

---

## 5. Common patterns

### Full name from first + last
```php
trim(#first_name . " " . #last_name)
```

### Display label with fallback
```php
#name != "" ? #name : "(Unnamed)"
```

### Percentage
```php
#score > 0 ? round((#score / #max_score) * 100, 1) . "%" : "0%"
```

### Running balance / remaining amount
```php
round(#budget - #spent, 2)
```

### Status label from number
```php
if (#progress >= 100) {
    return "Complete";
} elseif (#progress > 0) {
    return "In progress";
} else {
    return "Not started";
}
```

### Days until deadline (with overdue label)
```php
if (#due_date == "" || #due_date == null) {
    return "No deadline";
}
$days = (strtotime(#due_date) - time()) / 86400;
if ($days < 0) {
    return "Overdue by " . abs(round($days)) . " days";
} elseif ($days == 0) {
    return "Due today";
} else {
    return "Due in " . round($days) . " days";
}
```

### Lease duration in months
```php
$start = strtotime(#lease_start_date);
$end  = strtotime(#lease_end_date);
$months = round(($end - $start) / (30.44 * 86400));
return $months . " months";
```

### Concatenated reference code
```php
// e.g. "PROJ-2025-042"
strtoupper(substr(#hType, 0, 4)) . "-" . date("Y") . "-" . str_pad((string)#sequence_number, 3, "0", STR_PAD_LEFT)
```

### Conditional urgency flag
```php
if (#priority == "Critical" || #days_until_due <= 1) {
    return "🔴 Urgent";
} elseif (#days_until_due <= 3) {
    return "🟡 Soon";
} else {
    return "🟢 Normal";
}
```

### VAT-inclusive total
```php
round(#subtotal * 1.2, 2)
```

### Word count
```php
#description != "" ? count(explode(" ", trim(#description))) : 0
```

---

## 6. Error handling and null safety

The most common source of formula errors is accessing a field that is empty or null.

**Rule of thumb:** Before using a field in any arithmetic or function, check whether it's
empty. The AI assistant handles this if you describe the null case in your prompt.

```php
// Safe arithmetic
#unit_price != "" && #quantity != "" ? #unit_price * #quantity : 0

// Safe date calculation
if (#due_date == "" || #due_date == null) {
    return "—";
}
return date("d M Y", strtotime(#due_date));

// Safe division (avoid divide by zero)
#denominator != 0 ? round(#numerator / #denominator, 2) : 0

// Safe string operation
strlen(trim(#notes)) > 0 ? substr(#notes, 0, 100) . "..." : ""
```

---

## 7. Common errors and fixes

| Error | Likely cause | Fix |
|---|---|---|
| Formula shows blank / empty | Missing `return` or expression returns null | Add `return` before the final value; check null guards |
| "Undefined variable" | Field name typo or field renamed after formula was created | Re-insert the field variable via `#` picker |
| Wrong number (e.g. date math off) | Date field value not parsed with `strtotime()` | Wrap date fields in `strtotime()` before arithmetic |
| Formula errors on some records, not others | Some records have empty fields | Add null/empty checks before using the field value |
| Circular reference error | Formula field A references field B, which references A | Redesign to remove the cycle |
| "Division by zero" | Dividing without checking the denominator first | Guard with `#denominator != 0 ?` ternary |
| Output is integer when decimal expected | PHP integer division | Cast one operand: `(float)#numerator / #denominator` |
| Formula runs slowly | Complex logic on a field referenced by many other formulas | Simplify or cache the intermediate value in a hidden field |
