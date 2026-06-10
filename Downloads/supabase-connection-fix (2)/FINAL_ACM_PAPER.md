# Barangay Santiago Portal: A Supabase-enabled Digital Citizen Services Platform

**Authors:** SDG Forge

## Abstract
This paper describes the design, implementation, and evaluation of the Barangay Santiago Portal, a digital citizen service platform built with Next.js and Supabase. The portal addresses the need for a secure, user-friendly local government service interface that supports resident registration, document requests, incident reporting, and official communications. We present the system architecture, database and security model, workflow integration, and the results of an initial user acceptance testing plan.

## Keywords
Supabase, Next.js, citizen services, local government, digital portal, row-level security, authentication, document requests

## 1 Introduction
Local barangay offices in many communities still rely on manual processes for resident registration, document issuance, and incident reporting. This leads to delays, inconsistent record keeping, and reduced transparency. The Barangay Santiago Portal aims to modernize these services through a cloud-first, mobile-friendly web application.

## 2 Related Work
Recent work in citizen service platforms emphasizes secure authentication, access control, and data privacy. Cloud backend solutions such as Supabase provide integrated authentication, database, and storage services suitable for municipal applications. Unlike generic municipal systems, the Barangay Santiago Portal is tailored for barangay-level workflows with resident and official roles, request tracking, and secure document uploads.

## 3 System Architecture

### 3.1 Overview
The solution is a web-based platform with a Next.js frontend and Supabase backend. The frontend delivers responsive interfaces for residents and officials while Supabase handles persistent storage, authentication, row-level security (RLS), and file storage.

### 3.2 Functional Components
- Resident registration and profile management
- Document request submission and tracking
- Official validation and document fulfillment
- Complaint and incident reporting
- Official announcements and notifications

### 3.3 Deployment
The portal is designed for cloud deployment. Supabase services are used for database hosting and storage, minimizing local infrastructure requirements. The frontend can be deployed to any modern hosting provider that supports Next.js.

## 4 Data Model and Security

### 4.1 Data Tables
Key entities include residents, profiles, document requests, complaints, announcements, and assets. The schema supports secure document uploads and structured workflow state transitions.

### 4.2 Authentication
Authentication is implemented using Supabase Auth. Users are classified as residents or officials, with role-based access enforced through application logic and Supabase policies.

### 4.3 Row-Level Security
Supabase row-level security policies ensure that users can access only their own records and that officials can manage the records within their scope. Sensitive data such as personal identifiers and uploaded documents are protected through private storage buckets.

## 5 Implementation

### 5.1 Frontend
The frontend is built with Next.js and TypeScript. It includes components for registration, document upload, request tracking, complaint submission, announcement viewing, and dashboards for officials.

### 5.2 Backend
The backend uses Supabase for database operations, authentication, and storage. Server-side API routes and Supabase client utilities coordinate request workflows, notifications, and policy enforcement.

### 5.3 Storage
Resident uploads such as IDs and registration documents are stored in Supabase Storage buckets. Access is controlled so that only authorized users and officials can retrieve protected files.

## 6 Evaluation

### 6.1 Testing Approach
The system is evaluated through user acceptance testing scenarios that validate registration, request submission, document processing, and complaint workflows.

### 6.2 Security Evaluation
The use of Supabase RLS and authentication reduces risk by enforcing least-privilege access across resident and official roles. Private storage buckets protect uploaded documents, while application logic validates workflow transitions.

## 7 Discussion
The Barangay Santiago Portal demonstrates that a modern local government service platform can be built quickly with integrated cloud services. The architecture supports future extensions such as biometric verification, appointment booking, and analytics.

## 8 Conclusion
This paper presents a practical digital transformation for barangay-level citizen services using Next.js and Supabase. The portal improves transparency, speeds up service delivery, and sets a foundation for future municipal-scale expansion.

## References
[1] Supabase. "Supabase: The open source Firebase alternative." https://supabase.com

[2] Next.js. "The React Framework for Production." https://nextjs.org

[3] United Nations. "Sustainable Development Goals." https://sdgs.un.org/goals
