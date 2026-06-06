# AI-Assisted Barangay Santiago Portal: Smart Document Processing and Resident Service Automation Admin Portal Features

This presentation document summarizes the features available in the admin portal.

## Admin Dashboard
- Central hub for portal operations.
- Metrics overview: total residents, total households, pending verifications, pending document requests.
- Quick navigation cards for core admin workflows.
- Summary panels for verification status and document request activity.

## Resident Verification
- Search and filter resident verification queue.
- Approve or reject resident accounts.
- View resident profile details, valid ID references, and status badges.
- Supports quick status updates with touch-friendly action buttons.
- Includes a verification guide explaining pending / verified / rejected states.

## Resident Management
- Full resident CRUD workflow.
- Resident search and filter by name, purok, or household.
- Resident cards display status, household, and contact information.
- Edit resident details in place and delete records.
- Export CSV workflow stub for data reporting.

## Household Management
- Household directory with head, address, and member count.
- Add new households using a dedicated form.
- Edit and delete household records.
- Responsive layout for simple management of household units.

## Official Accounts
- Create and manage barangay official users.
- Assign roles: Captain, Secretary, Kagawad, Staff.
- Activate or deactivate accounts.
- Reset official passwords and track password reset requests.
- Edit or delete official accounts.

## Document Requests
- Track live document requests and status transitions.
- Approve, mark ready to print, release, print, or download requests.
- Create, edit, and delete request entries.
- Includes timeline and audit details for request activity.

## Activity Logs
- Ordered list of recent admin actions.
- Capture verification approvals, document approvals, official account updates, and system changes.
- Designed for quick auditing and traceability.

## Settings
- Manage barangay portal metadata and public messages.
- Upload logo/branding assets and configure portal templates.
- Store settings for site-wide display and official documentation.

## Authentication & Security
- Admin guard protects `/admin/*` routes behind login.
- Admin session state is managed in the portal.
- Only authorized admins can access admin pages.

## Responsive Experience
- Sidebar converts to off-canvas menu on smaller screens.
- Pages collapse from multi-column layout into vertical flows.
- Buttons and forms are optimized for mobile touch interactions.

## Notes for Implementation
- The current portal is structured for future integration with a Supabase backend.
- Tables and types in `supabase-structure.md` can be used to define the database schema.
- Admin pages should use API routes or Supabase queries for persistent CRUD operations.

## Related Portal Documentation
- `official-portal-features.md` for the official workspace, page flows, and approval workflows.
- `resident-portal-flow.md` for the resident-facing portal experience and resident request flow.
