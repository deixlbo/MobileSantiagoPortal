# Final Bound Manuscript

## Barangay Santiago Portal
**Team:** SDG Forge

### Institution
Barangay Santiago Local Government Unit

### Date
June 2026

---

## Abstract
Barangay Santiago Portal is a digital citizen service platform designed to address the manual and fragmented service delivery processes of Barangay Santiago. The system combines Next.js and Supabase to provide secure citizen registration, document request management, incident reporting, official announcements, and role-based access control.

## Acknowledgements
We acknowledge the support of Barangay Santiago officials and community stakeholders for providing the requirements and feedback that shaped this project. We also thank the Supabase and Next.js communities for the technologies that enabled rapid development.

## Executive Summary
This manuscript documents the final version of the Barangay Santiago Portal, including system design, development, testing, and acceptance criteria. The platform provides an integrated digital workflow for residents and officials, reducing paper-based processes and improving transparency.

## 1. Introduction
The portal was developed to solve the challenge of slow and insecure barangay service delivery. It supports resident onboarding, document requests, complaint tracking, and secure record management.

## 2. Problem Statement
Barangay Santiago currently relies on manual processes for resident service requests, leading to:
- Delays in document issuance
- Fragmented communication between residents and officials
- Lack of secure record keeping
- Poor visibility into service status

## 3. Project Objectives
- Enable online resident registration and profile management
- Allow residents to submit and monitor document requests
- Provide officials with a secure dashboard for approvals and announcements
- Securely store resident uploads and official records
- Improve transparency and communication through notifications and status updates

## 4. System Architecture
The platform uses a cloud-first approach with:
- Next.js frontend for responsive interfaces
- Supabase backend for database, authentication, and storage
- Row-level security to protect sensitive records
- Private storage for uploaded documents

### 4.1 User Roles
- Resident: registers, submits requests, views status
- Official: reviews requests, approves documents, publishes announcements
- Administrator: manages configuration and system settings

## 5. Development Process
Development followed an iterative workflow:
1. Requirements gathering
2. Database schema design and RLS configuration
3. Frontend component development
4. Backend integration with Supabase
5. Integration testing and user acceptance scenarios

## 6. Implementation Highlights
- Resident registration with secure authentication
- Document request submission and tracking
- Official document validation workflow
- Complaint reporting and status timeline
- Announcement and notification system
- Offline data support and mobile-friendly UI components

## 7. Security and Privacy
The system uses Supabase authentication and row-level security policies to ensure that:
- residents only access their own records
- officials access only authorized service requests
- sensitive uploads are stored in private buckets
- all interactions are logged and traceable

## 8. Testing and Validation
User acceptance testing covered:
- resident onboarding
- service request submission
- document upload and retrieval
- official review and approval workflows
- dashboard and notification flows

## 9. Deployment Plan
The portal is ready for deployment in a cloud environment with the following steps:
1. Provision Supabase project and database
2. Apply database schema and RLS policies
3. Deploy Next.js application to hosting
4. Configure authentication and storage buckets
5. Train barangay staff on system operation

## 10. Conclusion
The Barangay Santiago Portal provides a feasible, scalable digital solution for barangay-level citizen services. It addresses key gaps in registration, service delivery, and data privacy while supporting future enhancements.

## Appendix

### Appendix A: Glossary
- RLS: Row-level security
- UI: User interface
- UAT: User acceptance testing

### Appendix B: Future Roadmap
- Phase 2: Incident reporting, asset tracking, appointment booking, emergency alerts
- Phase 3: Analytics, biometric verification, inter-barangay integration
