# System Setup Reference

## UI Navigation Overview

Understanding the two-level navigation is essential before building anything:

**Top navigation bar (categories)**
- Each item is a **category** — a logical grouping of entities (e.g. "CRM", "HR", "Support").
- Click the **"+" at the right end of the top bar** to add a new category. Enter a name and icon.
- Categories show in the top bar; if there are many, overflow items appear in the "≡" hamburger menu.

**Second row (tab bar — pages within the selected category)**
- Each tab is a **page** inside the current category. Most pages are Entity Pages.
- Click the **"+" at the right end of the second row** to add a new page. Choose:
  - **Entity Page** — a standard data entity with fields, views, and records
  - **Page with Application** — embeds a third-party app or iframe
  - **Dashboard** — a widget/report page
- After confirming, the entity creation form opens. Fill in the Entity Name, optional Singular Name, and any permission settings, then click **"Create a New Entity"** at the bottom.

**Key gotchas:**
- Entity names must be **globally unique** across the entire Origami account (not just within the category). "Value already exists" means the name is taken — use a more specific name.
- Accounts have a **plan-based entity limit** (e.g. 100 entities). If you hit it, you'll see "Unable to create more than N entities as per your package." Archive or delete unused entities to free up slots.

---

## System Preferences

### Access Control
- **Country Authorization**: Restrict logins by country. Set to "Use" to specify allowed countries.
- **API IP Authorization**: Restrict API access to specific IP addresses (independent of login restrictions).

### Menu Settings
- **Menu Position**: Choose between Top Menu (default) or Side Menu.

### General Settings
- **System Language**: Supports English, Hebrew, Spanish, French, Dutch, Chinese, Arabic, Portuguese, German, Russian, Japanese, Italian, Hindi, Bengali, Korean, Turkish, Vietnamese. Determines text direction (RTL for Hebrew/Arabic, LTR for others).
- **Date Format**: Global date format setting.
- **Timezone**: Set organization timezone.
- **Number Format**: Configure number display format.
- **Allow Chat**: Enable/disable global chat feature.
- **Upload Logo**: Upload organization logo for interface header and generated documents.

### Email Settings
- **Multiple SMTP Accounts**: Built-in "Origami System Email" (no-reply@origami.ms) always available.
- **Custom SMTP Configuration**:
  - Name: Identify account (e.g., "Company SMTP")
  - Auth Type: None, SSL, or TLS
  - Host Server URL: Mail server URL
  - Email From: Sender email address
  - Email Alias: Sender alias
  - Port Number: Mail server port
  - Username/Password: SMTP credentials
- **Account Status**: Active/Inactive toggle (only active accounts send emails)
- **Test Send**: Verify SMTP configuration per account

### SMS Settings
- **Phone Number and Country**: Configure SMS source number and country
- **Custom Number Activation**: Contact finance@origami.ms for verification

---

## Security Settings

### IP Authorization
- Restrict logins to specific IP address ranges
- Set to "Use" to enable
- Admin users always exempt (prevents accidental lockouts)

### Multi-Factor Authentication (MFA)
- **MFA Setting**: Off, Optional, or Mandatory
- Requires OTP app (e.g., Google Authenticator)
- **Session Length**: Inactivity timeout before auto-logout
  - Options: 15 Minutes to 1 Month

### Password Policy
- **Change Password Every**: Never, 1 Month, 3 Months, 6 Months, 1 Year
- **Minimum Length**: Default 8 characters (configurable)
- **Complexity Requirements**:
  - Letters and numbers
  - Letters, numbers, special characters
  - Letters, numbers, special characters, uppercase

---

## Active Directory Settings (SSO)

### LDAP (Active Directory)
- **Type**: "Without", "Use Active Directory" (LDAP), or "Use Azure" (Azure AD/SSO)
- **Port Number**: Connection port
- **Domain DN**: Domain Distinguished Name
- **User DN**: User Distinguished Name
- **Password**: Domain credentials

### Azure Active Directory
- **Client ID**: Azure application ID
- **App Secret**: Application secret
- **Entity ID**: Entity identifier
- **Tenant ID**: Tenant identifier (note: UI sometimes labels as "Tenent Id")
- **X509 Certificate**: Security certificate
- **Account Sync Time**: Scheduled sync time (e.g., 02:00 for 2 AM daily)
- **Sync Now**: Manual sync button
- **Map Fields**: Map Azure AD attributes to Origami user fields

---

## AI Settings
- **AI Provider API Keys**: Configure keys for multiple providers
- **Supported Providers**:
  - ChatGPT (OpenAI)
  - Gemini (Google)
  - Grok (xAI)
  - Claude (Anthropic)
- **Requirement**: At least one provider configured to enable AI workflow actions

---

## File Manager
- Centralized repository for uploaded files
- View, organize, delete stored files
- Accessible from System Preferences navigation

---

## User Management

### User List
- Displays all users organized by user groups in accordion format
- Shows multiple group memberships per user
- View group members and assignments

### User Edit Page - Minimal Fields
- **User First Name**: User's first name
- **User Last Name**: User's last name
- **User Email**: Primary email address
- **Password**: Reset user password

### Custom Fields
- Add custom fields per user group
- Common examples: department, role-specific data, contact info

### User Group Management
- **User Groups Membership**: Assign/change group memberships
- **Manages User Groups**: Designate user as group manager
- Group managers can view all assignments and activities in managed groups

### Static Fields (Read-only)
- **Last Login Time**: Date/time of most recent login
- **Last Login IP Address**: IP address of last access

### Enabling/Disabling Users
- Toggle user account active/inactive status
- Disabled users: cannot access system, invisible in user lists
- Disabled users' records remain intact and linked
- Records stay accessible for audit/reference
- Reactivate anytime to restore access

---

## Permissions Management

### Overview
Granular control over user access at multiple levels: entity, field group, or individual field.

### User Groups and Permissions
- Users can belong to one or more groups
- Permissions assigned to groups, applicable across entities

### Permission Scope Levels
1. **Entity Level**: Controls access to entire entity
2. **Field Group Level**: Controls access to groups of related fields
3. **Field Level**: Most granular; controls individual field access

### Permission Vectors (Assignment Types)
1. **Group Membership**: Apply to users in a specific group
2. **Creator-Specific**: Apply only if user created the record (not for others' records)
3. **Assignment-Based**: Apply based on assignment via relation fields to user

### Setting Permissions
- **Entity Settings Page**: Global entity permissions
- **Field Group Edit Screen**: Permissions for field groups
- **Field Settings**: Individual field permissions

### Inclusion/Exclusion Strategy
- Grant broad permissions on entity, exclude specific fields
- Example: Edit access to entity except sensitive fields (view-only)

### Best Practices
- Clearly define user groups aligned with organizational roles
- Periodically review and update permissions with role changes
- Balance accessibility with security
- Document permission structure for consistency
