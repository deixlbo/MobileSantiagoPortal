# Barangay Santiago Resident Portal Flow

This document describes the resident portal experience, page flow, and resident-facing features.

## Resident Portal Purpose
- Designed for barangay residents to access announcements, submit requests, view documents, and follow community updates.
- Provides a friendly, mobile-first experience for resident authentication, requests, and notifications.
- Focuses on transparency, community news, and resident self-service.

## Resident Portal Entry Flow
1. Resident opens `/resident/login` to sign in.
2. New residents can register via `/resident/register`.
3. After authentication, residents are redirected to `/resident/dashboard`.
4. The dashboard acts as the resident home screen and navigation hub.

## Resident Dashboard Experience
- Displays latest announcements, project updates, and ordinance highlights.
- Shows quick access buttons for documents, notifications, blotter filing, and profile.
- Includes a notification bell for recent status updates and portal messages.
- Provides contact information for barangay offices and community resources.

## Resident Workflow Pages
- `/resident/announcements` — Read community announcements and advisories.
- `/resident/documents` — Track document requests, approvals, and downloads.
- `/resident/blotter` — File and review blotter cases.
- `/resident/projects` — View barangay projects and progress updates.
- `/resident/ordinances` — Review local ordinances and public policies.
- `/resident/notifications` — See important portal notifications and reminders.
- `/resident/profile` — Manage resident profile data and contact information.

## Notification Flow
- Residents receive alerts for new documents, approvals, announcements, and project updates.
- Notification items link directly to the relevant page for fast action.
- Unread notification badges are displayed on the dashboard.

## Request and Document Flow
- Residents can submit document requests and monitor approval status.
- Approved documents become available for pickup or download.
- The resident portal supports document-driven workflows through an accessible UI.

## Community Information Flow
- Announcements, ordinances, and projects are surfaced on the dashboard for quick discovery.
- Residents can follow barangay activities and see recent updates in a carousel-style display.
- The portal includes bulletin-style cards for events, emergencies, and civic notices.

## Resident Self-Service Flow
- Residents can update basic profile information from `/resident/profile`.
- The portal is built to support identity and contact management without requiring office visits.
- The resident chatbot (`/resident/resident-chatbot.tsx`) provides conversational assistance and guidance.

## Security & Access
- Resident pages are isolated from official and admin portals.
- Only authenticated residents should access `/resident/*` routes.
- The registration and login flow is the primary entry point for new resident users.

## Implementation Notes
- Use `app/resident/layout.tsx` for the resident portal shell and access control.
- Build resident workflows around notifications, announcements, document status, and profile management.
- Keep the user experience simple and mobile-friendly for residents using phones or tablets.
