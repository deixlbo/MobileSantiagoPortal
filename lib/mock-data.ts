// Comprehensive mock data for Barangay Santiago Management System
// Contains 80+ records for statistics and testing

import { 
  Resident, 
  DocumentRequest, 
  BlotterReport, 
  Announcement, 
  Project, 
  Ordinance,
  Notification 
} from './database'

// Helper to generate dates
const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const daysFromNow = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

// Filipino names for realistic data
const firstNames = [
  "Juan", "Maria", "Jose", "Ana", "Pedro", "Rosa", "Carlos", "Elena", "Miguel", "Carmen",
  "Antonio", "Lucia", "Francisco", "Teresa", "Manuel", "Josefa", "Rafael", "Dolores", "Fernando", "Pilar",
  "Ricardo", "Concepcion", "Andres", "Remedios", "Eduardo", "Esperanza", "Roberto", "Gloria", "Enrique", "Mercedes",
  "Alberto", "Felicidad", "Alfredo", "Rosario", "Arturo", "Soledad", "Cesar", "Victoria", "Daniel", "Paz"
]

const lastNames = [
  "Santos", "Reyes", "Cruz", "Bautista", "Garcia", "Mendoza", "Torres", "Flores", "Gonzales", "Ramos",
  "Dela Cruz", "De Guzman", "Fernandez", "Lopez", "Martinez", "Rodriguez", "Hernandez", "Perez", "Aquino", "Castro",
  "Villanueva", "Soriano", "Tan", "Lim", "Chua", "Ong", "Go", "Sy", "Co", "Ang",
  "Rivera", "Ramirez", "Morales", "Jimenez", "Diaz", "Romero", "Navarro", "Ruiz", "Alvarez", "Ortega"
]

const puroks = ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6", "Purok 7", "Purok 8"]

const purposes = [
  "Employment", "Travel Abroad", "Local Employment", "Bank Transaction", "School Requirement",
  "Business Permit", "Postal ID Application", "NBI Clearance", "Police Clearance", "Scholarship Application",
  "Medical Assistance", "DSWD Assistance", "SSS Transaction", "PhilHealth Transaction", "Pag-IBIG Transaction",
  "Voter Registration", "Court Requirement", "Immigration", "Passport Application", "Driver's License"
]

const blotterNatures = [
  "Noise Complaint", "Property Dispute", "Verbal Altercation", "Physical Altercation", "Theft",
  "Trespassing", "Vandalism", "Harassment", "Domestic Dispute", "Animal Complaint",
  "Parking Dispute", "Boundary Dispute", "Loan Dispute", "Business Complaint", "Environmental Complaint"
]

// Generate 40 residents
export const mockResidents: Resident[] = Array.from({ length: 40 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length]
  const lastName = lastNames[i % lastNames.length]
  const birthYear = 1960 + Math.floor(Math.random() * 45)
  const birthMonth = Math.floor(Math.random() * 12)
  const birthDay = Math.floor(Math.random() * 28) + 1
  
  return {
    id: `RES-${String(i + 1).padStart(4, '0')}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}${i}@email.com`,
    firstName,
    lastName,
    role: 'resident',
    purok: puroks[i % puroks.length],
    gender: i % 3 === 0 ? 'female' : 'male',
    address: `${Math.floor(Math.random() * 500) + 1} ${puroks[i % puroks.length]}, Barangay Santiago, San Antonio, Zambales`,
    dateOfBirth: new Date(birthYear, birthMonth, birthDay),
    contactNumber: `09${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
    verificationStatus: i % 5 === 0 ? 'pending' : 'verified',
    createdAt: daysAgo(Math.floor(Math.random() * 365) + 30),
    updatedAt: daysAgo(Math.floor(Math.random() * 30))
  }
})

// Generate 100 document requests
export const mockDocumentRequests: DocumentRequest[] = Array.from({ length: 100 }, (_, i) => {
  const documentTypes: DocumentRequest['documentType'][] = [
    'barangay_clearance', 'certificate_of_residency', 'certificate_of_indigency',
    'barangay_business_clearance', 'certificate_to_file_action', 'medical_assistance_certificate'
  ]
  const statuses: DocumentRequest['status'][] = ['pending', 'approved', 'rejected']
  const resident = mockResidents[i % mockResidents.length]
  const status = statuses[Math.floor(Math.random() * 3)]
  const createdAt = daysAgo(Math.floor(Math.random() * 90))
  
  return {
    id: `DOC-${String(i + 1).padStart(5, '0')}`,
    residentId: resident.id,
    documentType: documentTypes[i % documentTypes.length],
    status,
    controlNumber: `BRGY-STG-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
    purpose: purposes[i % purposes.length],
    createdAt,
    approvedAt: status === 'approved' ? new Date(createdAt.getTime() + Math.random() * 86400000 * 3) : undefined,
    approvedBy: status === 'approved' ? 'OFF-0001' : undefined,
    rejectionReason: status === 'rejected' ? 'Incomplete requirements' : undefined,
    createdBy: resident.id
  }
})

// Generate 50 blotter reports
export const mockBlotterReports: BlotterReport[] = Array.from({ length: 50 }, (_, i) => {
  const statuses: BlotterReport['status'][] = ['pending', 'ongoing', 'resolved']
  const complainant = mockResidents[i % mockResidents.length]
  const respondent = mockResidents[(i + 5) % mockResidents.length]
  const status = statuses[i % 3]
  const createdAt = daysAgo(Math.floor(Math.random() * 120))
  
  return {
    id: `BLT-${String(i + 1).padStart(4, '0')}`,
    residentId: complainant.id,
    complainantName: `${complainant.firstName} ${complainant.lastName}`,
    respondentName: `${respondent.firstName} ${respondent.lastName}`,
    natureOfCase: blotterNatures[i % blotterNatures.length],
    dateOfIncident: new Date(createdAt.getTime() - Math.random() * 86400000 * 7),
    status,
    scheduledHearingDate: status === 'ongoing' ? daysFromNow(Math.floor(Math.random() * 14) + 1) : undefined,
    notes: status === 'resolved' ? 'Case settled through mediation. Both parties agreed to the terms.' : 
           status === 'ongoing' ? 'Scheduled for mediation hearing.' : 
           'Awaiting initial review.',
    createdAt,
    updatedAt: status === 'resolved' ? new Date(createdAt.getTime() + Math.random() * 86400000 * 14) : createdAt,
    createdBy: complainant.id
  }
})

// Generate 20 announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "ANN-001",
    title: "Community Clean-up Drive",
    content: "Join us for a community-wide clean-up drive this Saturday at 7:00 AM. Meet at the Barangay Hall. Bring your own cleaning materials.",
    targetAudience: "all",
    postedAt: daysAgo(2),
    createdBy: "OFF-0001",
    isActive: true
  },
  {
    id: "ANN-002",
    title: "Free Medical Check-up",
    content: "Free medical check-up for all residents at the Barangay Health Center on April 28. Bring your Barangay ID.",
    targetAudience: "residents",
    postedAt: daysAgo(5),
    createdBy: "OFF-0002",
    isActive: true
  },
  {
    id: "ANN-003",
    title: "Barangay Assembly Meeting",
    content: "All residents are invited to attend the quarterly Barangay Assembly at 2:00 PM on May 1 at the Barangay Hall.",
    targetAudience: "all",
    postedAt: daysAgo(7),
    createdBy: "OFF-0001",
    isActive: true
  },
  {
    id: "ANN-004",
    title: "Senior Citizen Cash Assistance",
    content: "Senior citizens may claim their cash assistance at the Barangay Hall from May 5-10, 2026. Please bring valid ID.",
    targetAudience: "residents",
    postedAt: daysAgo(10),
    createdBy: "OFF-0003",
    isActive: true
  },
  {
    id: "ANN-005",
    title: "Road Closure Notice",
    content: "The main road near Purok 3 will be closed from May 15-20 for road improvement works. Please use alternate routes.",
    targetAudience: "all",
    postedAt: daysAgo(12),
    createdBy: "OFF-0001",
    isActive: true
  },
  {
    id: "ANN-006",
    title: "Vaccination Schedule",
    content: "COVID-19 booster shots available every Wednesday at the Barangay Health Center. No appointment needed.",
    targetAudience: "residents",
    postedAt: daysAgo(15),
    createdBy: "OFF-0002",
    isActive: true
  },
  {
    id: "ANN-007",
    title: "Feeding Program",
    content: "Daily feeding program for children at the Day Care Center. Registration open for new participants.",
    targetAudience: "residents",
    postedAt: daysAgo(18),
    createdBy: "OFF-0002",
    isActive: true
  },
  {
    id: "ANN-008",
    title: "Business Permit Renewal",
    content: "Reminder: Business permits for 2026 must be renewed before January 31. Avoid penalties by renewing early.",
    targetAudience: "residents",
    postedAt: daysAgo(20),
    createdBy: "OFF-0003",
    isActive: true
  },
  {
    id: "ANN-009",
    title: "Fiesta Celebration",
    content: "Join us for the annual Barangay Fiesta on June 24. Programs include mass, parade, and cultural presentations.",
    targetAudience: "all",
    postedAt: daysAgo(25),
    createdBy: "OFF-0001",
    isActive: true
  },
  {
    id: "ANN-010",
    title: "Scholarship Application",
    content: "Applications for the Barangay Scholarship Program are now open. Deadline is May 30, 2026.",
    targetAudience: "residents",
    postedAt: daysAgo(28),
    createdBy: "OFF-0003",
    isActive: true
  },
  {
    id: "ANN-011",
    title: "Water Service Interruption",
    content: "Water service will be interrupted on May 8 from 8 AM to 5 PM for maintenance. Please store water.",
    targetAudience: "all",
    postedAt: daysAgo(30),
    createdBy: "OFF-0001",
    isActive: true
  },
  {
    id: "ANN-012",
    title: "Sports Festival",
    content: "Annual Barangay Sports Festival on June 12-15. Registration for basketball, volleyball, and chess now open.",
    targetAudience: "all",
    postedAt: daysAgo(32),
    createdBy: "OFF-0001",
    isActive: true
  },
  {
    id: "ANN-013",
    title: "Tree Planting Activity",
    content: "Join the tree planting activity at the Barangay Park on June 5. Seedlings will be provided.",
    targetAudience: "all",
    postedAt: daysAgo(35),
    createdBy: "OFF-0002",
    isActive: true
  },
  {
    id: "ANN-014",
    title: "Livelihood Training",
    content: "Free livelihood training on food processing. Limited slots available. Register at the Barangay Hall.",
    targetAudience: "residents",
    postedAt: daysAgo(38),
    createdBy: "OFF-0003",
    isActive: true
  },
  {
    id: "ANN-015",
    title: "Night Patrol Schedule",
    content: "Updated barangay tanod night patrol schedule posted at the Barangay Hall. Volunteers welcome.",
    targetAudience: "all",
    postedAt: daysAgo(40),
    createdBy: "OFF-0001",
    isActive: true
  },
  {
    id: "ANN-016",
    title: "Dengue Prevention Campaign",
    content: "Weekly 4 o'clock habit clean-up drive. Let's work together to eliminate mosquito breeding grounds.",
    targetAudience: "all",
    postedAt: daysAgo(42),
    createdBy: "OFF-0002",
    isActive: true
  },
  {
    id: "ANN-017",
    title: "PWD ID Registration",
    content: "PWD ID registration and renewal at the Barangay Hall every Tuesday and Thursday.",
    targetAudience: "residents",
    postedAt: daysAgo(45),
    createdBy: "OFF-0003",
    isActive: true
  },
  {
    id: "ANN-018",
    title: "Solar Street Light Installation",
    content: "New solar street lights to be installed along the main road next week.",
    targetAudience: "all",
    postedAt: daysAgo(48),
    createdBy: "OFF-0001",
    isActive: true
  },
  {
    id: "ANN-019",
    title: "Youth Development Program",
    content: "Youth leadership training program starting June 1. Open to ages 15-24. Register now!",
    targetAudience: "residents",
    postedAt: daysAgo(50),
    createdBy: "OFF-0002",
    isActive: true
  },
  {
    id: "ANN-020",
    title: "Emergency Hotline Update",
    content: "New barangay emergency hotline: 0917-123-4567. Save this number for emergencies.",
    targetAudience: "all",
    postedAt: daysAgo(52),
    createdBy: "OFF-0001",
    isActive: true
  }
]

// Generate 15 projects
export const mockProjects: Project[] = [
  {
    id: "PRJ-001",
    title: "Road Improvement Project - Phase 1",
    description: "Concreting of main road from Purok 1 to Purok 4",
    startDate: daysAgo(60),
    endDate: daysFromNow(30),
    progress: 65,
    budget: 1500000,
    spent: 975000,
    location: "Purok 1-4 Main Road",
    status: "ongoing",
    createdAt: daysAgo(90),
    updatedAt: daysAgo(2),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-002",
    title: "Health Center Renovation",
    description: "Complete renovation of barangay health center including new equipment",
    startDate: daysAgo(120),
    endDate: daysAgo(15),
    progress: 100,
    budget: 2000000,
    spent: 1850000,
    location: "Barangay Health Center",
    status: "completed",
    createdAt: daysAgo(150),
    updatedAt: daysAgo(15),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-003",
    title: "Solar Street Lights Installation",
    description: "Installation of 50 solar-powered street lights along main roads",
    startDate: daysFromNow(15),
    progress: 0,
    budget: 1000000,
    location: "All Puroks",
    status: "planning",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-004",
    title: "Day Care Center Construction",
    description: "New day care center building with modern facilities",
    startDate: daysAgo(45),
    progress: 40,
    budget: 800000,
    spent: 320000,
    location: "Purok 2",
    status: "ongoing",
    createdAt: daysAgo(60),
    updatedAt: daysAgo(5),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-005",
    title: "Drainage System Improvement",
    description: "Construction of proper drainage system to prevent flooding",
    startDate: daysAgo(90),
    endDate: daysAgo(30),
    progress: 100,
    budget: 500000,
    spent: 480000,
    location: "Purok 5-6",
    status: "completed",
    createdAt: daysAgo(120),
    updatedAt: daysAgo(30),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-006",
    title: "Multi-Purpose Hall Extension",
    description: "Extension of barangay multi-purpose hall to accommodate more residents",
    startDate: daysAgo(30),
    progress: 25,
    budget: 1200000,
    spent: 300000,
    location: "Barangay Hall Compound",
    status: "ongoing",
    createdAt: daysAgo(45),
    updatedAt: daysAgo(3),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-007",
    title: "Community Garden Project",
    description: "Establishment of community vegetable garden for food security",
    startDate: daysAgo(60),
    endDate: daysAgo(10),
    progress: 100,
    budget: 100000,
    spent: 95000,
    location: "Vacant lot near Purok 7",
    status: "completed",
    createdAt: daysAgo(75),
    updatedAt: daysAgo(10),
    createdBy: "OFF-0002"
  },
  {
    id: "PRJ-008",
    title: "CCTV Installation Project",
    description: "Installation of CCTV cameras at strategic locations for peace and order",
    startDate: daysAgo(20),
    progress: 55,
    budget: 300000,
    spent: 165000,
    location: "All major intersections",
    status: "ongoing",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(1),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-009",
    title: "Basketball Court Renovation",
    description: "Complete renovation of barangay basketball court with new flooring and lights",
    startDate: daysFromNow(30),
    progress: 0,
    budget: 400000,
    location: "Barangay Sports Complex",
    status: "planning",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-010",
    title: "Water System Rehabilitation",
    description: "Repair and upgrade of barangay water distribution system",
    startDate: daysAgo(150),
    endDate: daysAgo(60),
    progress: 100,
    budget: 750000,
    spent: 720000,
    location: "All Puroks",
    status: "completed",
    createdAt: daysAgo(180),
    updatedAt: daysAgo(60),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-011",
    title: "Senior Citizen Center",
    description: "Construction of dedicated center for senior citizen activities",
    startDate: daysAgo(15),
    progress: 15,
    budget: 600000,
    spent: 90000,
    location: "Near Barangay Hall",
    status: "ongoing",
    createdAt: daysAgo(25),
    updatedAt: daysAgo(2),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-012",
    title: "Footbridge Construction",
    description: "Construction of footbridge over creek connecting Purok 3 and 4",
    startDate: daysAgo(180),
    endDate: daysAgo(90),
    progress: 100,
    budget: 350000,
    spent: 340000,
    location: "Purok 3-4 Creek",
    status: "completed",
    createdAt: daysAgo(200),
    updatedAt: daysAgo(90),
    createdBy: "OFF-0001"
  },
  {
    id: "PRJ-013",
    title: "Livelihood Center",
    description: "Construction of livelihood training center for skills development",
    startDate: daysFromNow(45),
    progress: 0,
    budget: 900000,
    location: "Purok 8",
    status: "planning",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    createdBy: "OFF-0003"
  },
  {
    id: "PRJ-014",
    title: "Playground Equipment Installation",
    description: "Installation of playground equipment at barangay park",
    startDate: daysAgo(40),
    progress: 80,
    budget: 200000,
    spent: 160000,
    location: "Barangay Park",
    status: "ongoing",
    createdAt: daysAgo(50),
    updatedAt: daysAgo(4),
    createdBy: "OFF-0002"
  },
  {
    id: "PRJ-015",
    title: "Road Improvement Project - Phase 2",
    description: "Concreting of internal roads in Purok 5-8",
    startDate: daysFromNow(60),
    progress: 0,
    budget: 1800000,
    location: "Purok 5-8",
    status: "planning",
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
    createdBy: "OFF-0001"
  }
]

// Generate 10 ordinances
export const mockOrdinances: Ordinance[] = [
  {
    id: "ORD-001",
    title: "Noise Regulation Ordinance",
    content: "An ordinance regulating noise levels in Barangay Santiago to ensure peace and order.",
    category: "Peace and Order",
    filePath: "/documents/ordinances/noise-regulation.pdf",
    uploadedAt: daysAgo(180),
    uploadedBy: "OFF-0001"
  },
  {
    id: "ORD-002",
    title: "Waste Management Ordinance",
    content: "An ordinance implementing proper waste segregation and disposal in the barangay.",
    category: "Environment",
    filePath: "/documents/ordinances/waste-management.pdf",
    uploadedAt: daysAgo(150),
    uploadedBy: "OFF-0001"
  },
  {
    id: "ORD-003",
    title: "Curfew Ordinance for Minors",
    content: "An ordinance imposing curfew hours for minors to ensure their safety.",
    category: "Peace and Order",
    filePath: "/documents/ordinances/curfew-minors.pdf",
    uploadedAt: daysAgo(120),
    uploadedBy: "OFF-0001"
  },
  {
    id: "ORD-004",
    title: "Business Permit Guidelines",
    content: "An ordinance establishing guidelines for business permit applications and renewals.",
    category: "Business",
    filePath: "/documents/ordinances/business-permit.pdf",
    uploadedAt: daysAgo(90),
    uploadedBy: "OFF-0003"
  },
  {
    id: "ORD-005",
    title: "Anti-Littering Ordinance",
    content: "An ordinance prohibiting littering in public places with corresponding penalties.",
    category: "Environment",
    filePath: "/documents/ordinances/anti-littering.pdf",
    uploadedAt: daysAgo(75),
    uploadedBy: "OFF-0002"
  },
  {
    id: "ORD-006",
    title: "Animal Control Ordinance",
    content: "An ordinance regulating the keeping of pets and livestock in the barangay.",
    category: "Health",
    filePath: "/documents/ordinances/animal-control.pdf",
    uploadedAt: daysAgo(60),
    uploadedBy: "OFF-0002"
  },
  {
    id: "ORD-007",
    title: "Liquor Ban Ordinance",
    content: "An ordinance regulating the sale and consumption of alcoholic beverages.",
    category: "Peace and Order",
    filePath: "/documents/ordinances/liquor-ban.pdf",
    uploadedAt: daysAgo(45),
    uploadedBy: "OFF-0001"
  },
  {
    id: "ORD-008",
    title: "Road Safety Ordinance",
    content: "An ordinance promoting road safety and traffic management in the barangay.",
    category: "Traffic",
    filePath: "/documents/ordinances/road-safety.pdf",
    uploadedAt: daysAgo(30),
    uploadedBy: "OFF-0001"
  },
  {
    id: "ORD-009",
    title: "Fire Safety Ordinance",
    content: "An ordinance requiring fire safety measures for all establishments.",
    category: "Safety",
    filePath: "/documents/ordinances/fire-safety.pdf",
    uploadedAt: daysAgo(20),
    uploadedBy: "OFF-0001"
  },
  {
    id: "ORD-010",
    title: "Social Hall Usage Guidelines",
    content: "An ordinance establishing guidelines for the use of barangay social hall.",
    category: "Administration",
    filePath: "/documents/ordinances/social-hall.pdf",
    uploadedAt: daysAgo(10),
    uploadedBy: "OFF-0001"
  }
]

// Generate notifications
export const mockNotifications: Notification[] = Array.from({ length: 30 }, (_, i) => {
  const types: Notification['type'][] = ['approval', 'rejection', 'announcement', 'blotter_update', 'general']
  const type = types[i % types.length]
  
  const titles = {
    approval: 'Document Request Approved',
    rejection: 'Document Request Rejected',
    announcement: 'New Announcement',
    blotter_update: 'Blotter Report Update',
    general: 'System Notification'
  }
  
  const messages = {
    approval: 'Your document request has been approved. You may now download or claim your document.',
    rejection: 'Your document request has been rejected. Please check the requirements and resubmit.',
    announcement: 'A new announcement has been posted. Check it out!',
    blotter_update: 'There is an update on your blotter report. Please check the status.',
    general: 'Welcome to Barangay Santiago Management System!'
  }
  
  return {
    id: `NOTIF-${String(i + 1).padStart(4, '0')}`,
    userId: mockResidents[i % mockResidents.length].id,
    title: titles[type],
    message: messages[type],
    type,
    read: i > 10,
    createdAt: daysAgo(i)
  }
})

// Statistics helper functions
export function getDocumentStats() {
  const total = mockDocumentRequests.length
  const pending = mockDocumentRequests.filter(d => d.status === 'pending').length
  const approved = mockDocumentRequests.filter(d => d.status === 'approved').length
  const rejected = mockDocumentRequests.filter(d => d.status === 'rejected').length
  
  // Monthly breakdown
  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() - (11 - i))
    const monthDocs = mockDocumentRequests.filter(d => {
      const docMonth = new Date(d.createdAt)
      return docMonth.getMonth() === month.getMonth() && 
             docMonth.getFullYear() === month.getFullYear()
    })
    return {
      month: month.toLocaleString('default', { month: 'short' }),
      total: monthDocs.length,
      approved: monthDocs.filter(d => d.status === 'approved').length,
      pending: monthDocs.filter(d => d.status === 'pending').length,
      rejected: monthDocs.filter(d => d.status === 'rejected').length
    }
  })
  
  // By type
  const byType = {
    barangay_clearance: mockDocumentRequests.filter(d => d.documentType === 'barangay_clearance').length,
    certificate_of_residency: mockDocumentRequests.filter(d => d.documentType === 'certificate_of_residency').length,
    certificate_of_indigency: mockDocumentRequests.filter(d => d.documentType === 'certificate_of_indigency').length,
    barangay_business_clearance: mockDocumentRequests.filter(d => d.documentType === 'barangay_business_clearance').length,
    certificate_to_file_action: mockDocumentRequests.filter(d => d.documentType === 'certificate_to_file_action').length,
    medical_assistance_certificate: mockDocumentRequests.filter(d => d.documentType === 'medical_assistance_certificate').length
  }
  
  return { total, pending, approved, rejected, monthlyStats, byType }
}

export function getBlotterStats() {
  const total = mockBlotterReports.length
  const pending = mockBlotterReports.filter(b => b.status === 'pending').length
  const ongoing = mockBlotterReports.filter(b => b.status === 'ongoing').length
  const resolved = mockBlotterReports.filter(b => b.status === 'resolved').length
  
  // By nature
  const byNature = blotterNatures.reduce((acc, nature) => {
    acc[nature] = mockBlotterReports.filter(b => b.natureOfCase === nature).length
    return acc
  }, {} as Record<string, number>)
  
  return { total, pending, ongoing, resolved, byNature }
}

export function getResidentStats() {
  const total = mockResidents.length
  const verified = mockResidents.filter(r => r.verificationStatus === 'verified').length
  const pendingVerification = mockResidents.filter(r => r.verificationStatus === 'pending').length
  
  // By purok
  const byPurok = puroks.reduce((acc, purok) => {
    acc[purok] = mockResidents.filter(r => r.purok === purok).length
    return acc
  }, {} as Record<string, number>)
  
  // By gender
  const byGender = {
    male: mockResidents.filter(r => r.gender === 'male').length,
    female: mockResidents.filter(r => r.gender === 'female').length
  }
  
  // Age distribution
  const now = new Date()
  const ageGroups = {
    '0-17': 0,
    '18-30': 0,
    '31-45': 0,
    '46-60': 0,
    '60+': 0
  }
  
  mockResidents.forEach(r => {
    const age = now.getFullYear() - r.dateOfBirth.getFullYear()
    if (age < 18) ageGroups['0-17']++
    else if (age <= 30) ageGroups['18-30']++
    else if (age <= 45) ageGroups['31-45']++
    else if (age <= 60) ageGroups['46-60']++
    else ageGroups['60+']++
  })
  
  return { total, verified, pendingVerification, byPurok, byGender, ageGroups }
}

export function getProjectStats() {
  const total = mockProjects.length
  const completed = mockProjects.filter(p => p.status === 'completed').length
  const ongoing = mockProjects.filter(p => p.status === 'ongoing').length
  const planning = mockProjects.filter(p => p.status === 'planning').length
  
  const totalBudget = mockProjects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const totalSpent = mockProjects.reduce((sum, p) => sum + (p.spent || 0), 0)
  
  return { total, completed, ongoing, planning, totalBudget, totalSpent }
}

// CSV Export helper
export function exportToCSV<T extends Record<string, unknown>>(data: T[], filename: string) {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        if (value instanceof Date) {
          return `"${value.toLocaleDateString()}"`
        }
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      }).join(',')
    )
  ]
  
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}
