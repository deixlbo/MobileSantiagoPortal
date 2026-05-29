# Supabase Structure

This document describes the logical database structure for the Barangay Santiago Admin Portal, modeled after a Supabase/PostgreSQL schema.

## Tables

### `residents`
- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `purok` (text)
- `household_id` (uuid, foreign key -> `households.id`)
- `status` (text) - `Pending`, `Verified`, `Rejected`
- `valid_id` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `households`
- `id` (uuid, primary key)
- `head` (text)
- `address` (text)
- `members_count` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `official_accounts`
- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `role` (text) - `Captain`, `Secretary`, `Kagawad`, `Staff`
- `status` (text) - `Active`, `Deactivated`
- `password_reset_requested` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `document_requests`
- `id` (uuid, primary key)
- `resident_id` (uuid, foreign key -> `residents.id`)
- `resident_name` (text)
- `document_type` (text)
- `status` (text) - `Pending`, `Approved`, `Ready to Print`, `Released`
- `requested_at` (timestamp)
- `updated_at` (timestamp)

### `activity_logs`
- `id` (uuid, primary key)
- `actor` (text)
- `action` (text)
- `target_type` (text)
- `target_id` (uuid)
- `details` (text)
- `logged_at` (timestamp)

### `admin_sessions`
- `id` (uuid, primary key)
- `admin_email` (text)
- `session_token` (text)
- `expires_at` (timestamp)
- `created_at` (timestamp)

### `settings`
- `id` (uuid, primary key)
- `barangay_name` (text)
- `address` (text)
- `public_message` (text)
- `logo_url` (text)
- `template_settings` (jsonb)
- `updated_at` (timestamp)

## Example data types

### `Resident`
```ts
export type Resident = {
  id: string
  name: string
  email: string
  purok: string
  householdId: string | null
  status: "Pending" | "Verified" | "Rejected"
  validId: string
  createdAt: string
  updatedAt: string
}
```

### `Household`
```ts
export type Household = {
  id: string
  head: string
  address: string
  membersCount: number
  createdAt: string
  updatedAt: string
}
```

### `OfficialAccount`
```ts
export type OfficialAccount = {
  id: string
  name: string
  email: string
  role: "Captain" | "Secretary" | "Kagawad" | "Staff"
  status: "Active" | "Deactivated"
  passwordResetRequested: boolean
  createdAt: string
  updatedAt: string
}
```

### `DocumentRequest`
```ts
export type DocumentRequest = {
  id: string
  residentId: string
  residentName: string
  documentType: string
  status: "Pending" | "Approved" | "Ready to Print" | "Released"
  requestedAt: string
  updatedAt: string
}
```

### `ActivityLog`
```ts
export type ActivityLog = {
  id: string
  actor: string
  action: string
  targetType: string
  targetId: string
  details: string
  loggedAt: string
}
```

### `Setting`
```ts
export type Setting = {
  id: string
  barangayName: string
  address: string
  publicMessage: string
  logoUrl: string | null
  templateSettings: Record<string, unknown>
  updatedAt: string
}
```
