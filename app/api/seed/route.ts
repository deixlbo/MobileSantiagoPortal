import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

// Mock data for document requests (matches actual database schema)
const mockDocumentRequests = [
  {
    document_type: "barangay_clearance",
    purpose: "Employment",
    status: "pending",
    control_number: "DOC-2024-001",
  },
  {
    document_type: "certificate_of_residency",
    purpose: "School Enrollment",
    status: "pending",
    control_number: "DOC-2024-002",
  },
  {
    document_type: "barangay_business_clearance",
    purpose: "Business Registration",
    status: "approved",
    control_number: "DOC-2024-003",
    approved_at: new Date().toISOString(),
  },
  {
    document_type: "certificate_of_indigency",
    purpose: "Medical Assistance",
    status: "approved",
    control_number: "DOC-2024-004",
    approved_at: new Date().toISOString(),
  },
  {
    document_type: "barangay_clearance",
    purpose: "Loan Application",
    status: "released",
    control_number: "DOC-2024-005",
    approved_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    document_type: "certificate_of_residency",
    purpose: "Bank Account Opening",
    status: "declined",
    control_number: "DOC-2024-006",
    rejection_reason: "Missing valid ID and proof of address",
  },
  {
    document_type: "barangay_clearance",
    purpose: "Visa Application",
    status: "pending",
    control_number: "DOC-2024-007",
  },
]

// Mock data for announcements
const mockAnnouncements = [
  {
    title: "Barangay General Assembly Meeting",
    content: "All residents are invited to attend the quarterly General Assembly Meeting. Important matters regarding community development, budget allocation, and upcoming projects will be discussed. Light refreshments will be served. Please bring your barangay ID for verification.",
    priority: "important",
    status: "published",
    category: "Governance",
    publish_date: new Date().toISOString().split("T")[0],
    expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    author: "Kap. Maria Santos",
    views: 156,
  },
  {
    title: "URGENT: Water Service Interruption",
    content: "Due to emergency pipeline repairs, water service will be interrupted on Saturday, from 6:00 AM to 6:00 PM. Please store enough water for your household needs. We apologize for any inconvenience caused.",
    priority: "urgent",
    status: "published",
    category: "Utilities",
    publish_date: new Date().toISOString().split("T")[0],
    expiry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    author: "Brgy. Secretary",
    views: 423,
  },
  {
    title: "Free Medical Mission",
    content: "The barangay, in partnership with the Municipal Health Office, will conduct a free medical mission. Services include general check-up, dental consultation, and free medicines. Bring your barangay ID and PhilHealth card if available.",
    priority: "important",
    status: "published",
    category: "Health",
    publish_date: new Date().toISOString().split("T")[0],
    expiry_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    author: "Health Committee",
    views: 289,
  },
  {
    title: "Barangay Basketball League Registration",
    content: "Registration for the annual Barangay Basketball League is now open! Teams must have at least 10 players. Registration fee is PHP 500 per team. Submit your team roster at the barangay hall.",
    priority: "normal",
    status: "published",
    category: "Events",
    publish_date: new Date().toISOString().split("T")[0],
    expiry_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    author: "Sports Committee",
    views: 178,
  },
  {
    title: "Clean-up Drive Schedule",
    content: "Join our monthly clean-up drive this weekend. Meet at the barangay plaza at 7:00 AM. Cleaning materials will be provided. Volunteers will receive a certificate of participation.",
    priority: "normal",
    status: "published",
    category: "Environment",
    publish_date: new Date().toISOString().split("T")[0],
    expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    author: "Environment Committee",
    views: 92,
  },
  {
    title: "Senior Citizen Pension Distribution",
    content: "Social pension distribution for senior citizens will be held at the barangay hall. Please bring your senior citizen ID and authorization letter if claiming on behalf of another. Distribution starts at 8:00 AM.",
    priority: "important",
    status: "published",
    category: "Social Services",
    publish_date: new Date().toISOString().split("T")[0],
    expiry_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    author: "OSCA Coordinator",
    views: 341,
  },
  {
    title: "New Business Permit Requirements (Draft)",
    content: "Updated requirements for business permit applications will take effect next month. This announcement is still in draft and pending final approval from the Sangguniang Barangay.",
    priority: "normal",
    status: "draft",
    category: "Governance",
    publish_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    author: "Brgy. Treasurer",
    views: 0,
  },
  {
    title: "Holiday Schedule Announcement",
    content: "The barangay hall will be closed during the upcoming holidays. Emergency services will still be available through the hotline. Regular operations will resume after the holiday period.",
    priority: "normal",
    status: "archived",
    category: "Governance",
    publish_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    expiry_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    author: "Brgy. Secretary",
    views: 567,
  },
]

export async function POST() {
  try {
    // Insert document requests
    const { error: docError } = await supabaseServer
      .from('document_requests')
      .insert(mockDocumentRequests)

    if (docError) {
      console.error('Error inserting document requests:', docError)
      return NextResponse.json({ error: 'Failed to seed document requests', details: docError.message }, { status: 500 })
    }

    // Insert announcements
    const { error: annError } = await supabaseServer
      .from('announcements')
      .insert(mockAnnouncements)

    if (annError) {
      console.error('Error inserting announcements:', annError)
      return NextResponse.json({ error: 'Failed to seed announcements', details: annError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Mock data seeded successfully',
      counts: {
        documentRequests: mockDocumentRequests.length,
        announcements: mockAnnouncements.length
      }
    })
  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Delete all document requests
    await supabaseServer.from('document_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Delete all announcements
    await supabaseServer.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    return NextResponse.json({ 
      success: true, 
      message: 'All mock data cleared'
    })
  } catch (error) {
    console.error('Error clearing data:', error)
    return NextResponse.json({ error: 'Failed to clear data' }, { status: 500 })
  }
}
