// Mock data for the Barangay Management System

export interface Resident {
  id: string
  residentId: string
  fullName: string
  firstName: string
  middleName: string
  lastName: string
  suffix?: string
  birthDate: string
  age: number
  gender: string
  civilStatus: string
  address: string
  purok: string
  contactNumber: string
  email: string
  occupation: string
  yearsOfResidency: number
  validIdType: string
  validIdNumber: string
  registeredAt: string
}

export const mockResidents: Resident[] = [
  {
    id: '1',
    residentId: 'RES-2024-001',
    fullName: 'Juan Dela Cruz',
    firstName: 'Juan',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    birthDate: '1990-05-15',
    age: 35,
    gender: 'Male',
    civilStatus: 'Married',
    address: 'Purok 1, Barangay Santiago, San Antonio, Zambales',
    purok: 'Purok 1',
    contactNumber: '0917-123-4567',
    email: 'juan.delacruz@email.com',
    occupation: 'Farmer',
    yearsOfResidency: 15,
    validIdType: 'National ID',
    validIdNumber: '1234-5678-9012-3456',
    registeredAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    residentId: 'RES-2024-002',
    fullName: 'Maria Clara Reyes',
    firstName: 'Maria Clara',
    middleName: 'Lopez',
    lastName: 'Reyes',
    birthDate: '1985-08-22',
    age: 40,
    gender: 'Female',
    civilStatus: 'Widow',
    address: 'Purok 3, Barangay Santiago, San Antonio, Zambales',
    purok: 'Purok 3',
    contactNumber: '0918-234-5678',
    email: 'maria.reyes@email.com',
    occupation: 'Vendor',
    yearsOfResidency: 20,
    validIdType: "Driver's License",
    validIdNumber: 'N01-23-456789',
    registeredAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '3',
    residentId: 'RES-2024-003',
    fullName: 'Pedro Penduko',
    firstName: 'Pedro',
    middleName: 'Garcia',
    lastName: 'Penduko',
    birthDate: '1988-03-10',
    age: 38,
    gender: 'Male',
    civilStatus: 'Single',
    address: 'Purok 2, Barangay Santiago, San Antonio, Zambales',
    purok: 'Purok 2',
    contactNumber: '0919-345-6789',
    email: 'pedro.penduko@email.com',
    occupation: 'Business Owner',
    yearsOfResidency: 10,
    validIdType: 'Passport',
    validIdNumber: 'P1234567890',
    registeredAt: '2024-02-01T14:00:00Z'
  }
]

export const mockOfficials = [
  {
    id: '1',
    fullName: 'Hon. Roberto S. Dela Cruz',
    position: 'Punong Barangay',
    order: 1,
    email: 'captain@barangaysantiago.gov.ph',
    phone: '0917-123-4567',
    bio: 'Serving the community since 2018',
    avatarUrl: ''
  },
  {
    id: '2',
    fullName: 'Maria Santos',
    position: 'Barangay Secretary',
    order: 2,
    email: 'secretary@barangaysantiago.gov.ph',
    phone: '0918-234-5678',
    bio: 'Ensuring efficient record management',
    avatarUrl: ''
  },
  {
    id: '3',
    fullName: 'Pedro Reyes',
    position: 'Barangay Treasurer',
    order: 3,
    email: 'treasurer@barangaysantiago.gov.ph',
    phone: '0919-345-6789',
    bio: 'Managing barangay finances with integrity',
    avatarUrl: ''
  },
  {
    id: '4',
    fullName: 'Ana Gonzales',
    position: 'Barangay Kagawad',
    order: 4,
    email: 'kagawad1@barangaysantiago.gov.ph',
    phone: '0920-456-7890',
    bio: 'Committee on Health and Sanitation',
    avatarUrl: ''
  },
  {
    id: '5',
    fullName: 'Jose Mendoza',
    position: 'Barangay Kagawad',
    order: 5,
    email: 'kagawad2@barangaysantiago.gov.ph',
    phone: '0921-567-8901',
    bio: 'Committee on Peace and Order',
    avatarUrl: ''
  },
  {
    id: '6',
    fullName: 'Elena Garcia',
    position: 'SK Chairperson',
    order: 6,
    email: 'sk@barangaysantiago.gov.ph',
    phone: '0922-678-9012',
    bio: 'Empowering the youth of Santiago',
    avatarUrl: ''
  }
]

export const mockAnnouncements = [
  {
    id: '1',
    title: 'Community Clean-Up Drive',
    body: 'Join us in our monthly community clean-up drive this Saturday. Let us work together to keep our barangay clean and green. Volunteers will receive snacks and certificates.',
    category: 'Event',
    scheduledDate: '2026-05-03',
    scheduledTime: '07:00',
    venue: 'Barangay Hall',
    published: true,
    createdAt: '2026-04-25T08:00:00Z'
  },
  {
    id: '2',
    title: 'Free Medical Mission',
    body: 'In partnership with the Municipal Health Office, we are conducting a free medical mission for all residents. Services include general check-up, dental services, and free medicines.',
    category: 'Health',
    scheduledDate: '2026-05-10',
    scheduledTime: '08:00',
    venue: 'Barangay Covered Court',
    published: true,
    createdAt: '2026-04-24T10:00:00Z'
  },
  {
    id: '3',
    title: 'Barangay Assembly Meeting',
    body: 'All residents are encouraged to attend the quarterly Barangay Assembly Meeting. Important matters regarding community development will be discussed.',
    category: 'Meeting',
    scheduledDate: '2026-05-15',
    scheduledTime: '14:00',
    venue: 'Barangay Hall',
    published: true,
    createdAt: '2026-04-23T14:00:00Z'
  },
  {
    id: '4',
    title: 'Senior Citizen Pension Distribution',
    body: 'Social pension for senior citizens will be distributed on the scheduled date. Please bring valid ID and senior citizen booklet.',
    category: 'Announcement',
    scheduledDate: '2026-05-05',
    scheduledTime: '09:00',
    venue: 'Barangay Hall',
    published: true,
    createdAt: '2026-04-22T09:00:00Z'
  }
]

export const mockOrdinances = [
  {
    id: '1',
    ordinanceNumber: '2026-001',
    title: 'Anti-Littering Ordinance',
    purpose: 'To promote cleanliness and proper waste disposal in the barangay',
    body: 'Section 1. It shall be unlawful for any person to throw, dump, or dispose of garbage, waste materials, or any refuse in public places within the territorial jurisdiction of Barangay Santiago.\n\nSection 2. Violators shall be fined as follows:\n- First offense: Php 500.00\n- Second offense: Php 1,000.00\n- Third offense: Php 2,000.00 and community service',
    seriesYear: 2026,
    enactedDate: '2026-01-15',
    status: 'enacted'
  },
  {
    id: '2',
    ordinanceNumber: '2026-002',
    title: 'Curfew for Minors Ordinance',
    purpose: 'To ensure the safety and welfare of minors within the barangay',
    body: 'Section 1. Minors (persons below 18 years of age) are prohibited from loitering in public places from 10:00 PM to 4:00 AM unless accompanied by a parent or guardian.\n\nSection 2. Exceptions shall be made for minors attending school activities, emergencies, or with valid written permission.',
    seriesYear: 2026,
    enactedDate: '2026-02-01',
    status: 'enacted'
  },
  {
    id: '3',
    ordinanceNumber: '2025-015',
    title: 'Business Permit and Licensing Ordinance',
    purpose: 'To regulate business establishments within the barangay',
    body: 'Section 1. All business establishments operating within Barangay Santiago shall secure a Barangay Business Clearance before operating.\n\nSection 2. Application requirements include valid ID, DTI registration, and proof of residency or lease contract.',
    seriesYear: 2025,
    enactedDate: '2025-06-20',
    status: 'enacted'
  },
  {
    id: '4',
    ordinanceNumber: '2025-012',
    title: 'Noise Pollution Control Ordinance',
    purpose: 'To regulate noise levels and ensure peace and order in the community',
    body: 'Section 1. Loud music, karaoke, and other noise-producing activities are prohibited from 10:00 PM to 6:00 AM.\n\nSection 2. Special permits may be secured from the Barangay for special occasions.',
    seriesYear: 2025,
    enactedDate: '2025-04-10',
    status: 'enacted'
  }
]

export const mockDocumentTypes = [
  {
    id: '1',
    name: 'Barangay Clearance',
    description: 'Clearance for legal purposes within the barangay',
    category: 'Legal Documents',
    fee: 50,
    available: true
  },
  {
    id: '2',
    name: 'Certificate of Residency',
    description: 'Issued to residents to prove residency in the barangay',
    category: 'Certificates',
    fee: 30,
    available: true
  },
  {
    id: '3',
    name: 'Certificate of Indigency',
    description: 'For residents applying for financial assistance',
    category: 'Certificates',
    fee: 0,
    available: true
  },
  {
    id: '4',
    name: 'Business Permit',
    description: 'Permit to operate a business within the barangay',
    category: 'Permits',
    fee: 200,
    available: true
  },
  {
    id: '5',
    name: 'Barangay Blotter',
    description: 'Record of incidents and disputes in the barangay',
    category: 'Legal Documents',
    fee: 0,
    available: true
  },
  {
    id: '6',
    name: 'Certificate of Good Moral Character',
    description: 'Certification of good moral character of a resident',
    category: 'Certificates',
    fee: 50,
    available: true
  }
]

export interface DocumentRequest {
  id: string
  residentId: string
  residentName: string
  documentType: string
  purpose: string
  address: string
  status: string
  notes: string
  controlNumber?: string
  orNumber?: string
  fee?: number
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

// Resident-specific data (only visible after login)
export const mockDocumentRequests: DocumentRequest[] = [
  {
    id: '1',
    residentId: 'RES-2024-001',
    residentName: 'Juan Dela Cruz',
    documentType: 'Barangay Clearance',
    purpose: 'Employment Requirement',
    address: 'Purok 1, Barangay Santiago, San Antonio, Zambales',
    status: 'approved',
    notes: '',
    controlNumber: 'BC-2026-0001',
    orNumber: 'OR-2026-0015',
    fee: 50,
    approvedBy: 'Hon. Roberto S. Dela Cruz',
    approvedAt: '2026-04-22T14:00:00Z',
    createdAt: '2026-04-20T10:00:00Z',
    updatedAt: '2026-04-22T14:00:00Z'
  },
  {
    id: '2',
    residentId: 'RES-2024-001',
    residentName: 'Juan Dela Cruz',
    documentType: 'Certificate of Residency',
    purpose: 'Bank Account Opening',
    address: 'Purok 1, Barangay Santiago, San Antonio, Zambales',
    status: 'pending',
    notes: '',
    createdAt: '2026-04-25T09:00:00Z',
    updatedAt: '2026-04-25T09:00:00Z'
  },
  {
    id: '3',
    residentId: 'RES-2024-002',
    residentName: 'Maria Clara Reyes',
    documentType: 'Certificate of Indigency',
    purpose: 'Medical Assistance',
    address: 'Purok 3, Barangay Santiago, San Antonio, Zambales',
    status: 'approved',
    notes: '',
    controlNumber: 'CI-2026-0002',
    orNumber: 'OR-2026-0014',
    fee: 0,
    approvedBy: 'Hon. Roberto S. Dela Cruz',
    approvedAt: '2026-04-19T10:00:00Z',
    createdAt: '2026-04-18T11:00:00Z',
    updatedAt: '2026-04-19T10:00:00Z'
  },
  {
    id: '4',
    residentId: 'RES-2024-003',
    residentName: 'Pedro Penduko',
    documentType: 'Business Permit',
    purpose: 'Sari-sari Store',
    address: 'Purok 2, Barangay Santiago, San Antonio, Zambales',
    status: 'processing',
    notes: 'Awaiting inspection',
    createdAt: '2026-04-23T08:00:00Z',
    updatedAt: '2026-04-24T16:00:00Z'
  },
  {
    id: '5',
    residentId: 'RES-2024-002',
    residentName: 'Maria Clara Reyes',
    documentType: 'Barangay Clearance',
    purpose: 'Travel Abroad',
    address: 'Purok 3, Barangay Santiago, San Antonio, Zambales',
    status: 'pending',
    notes: '',
    createdAt: '2026-04-26T08:00:00Z',
    updatedAt: '2026-04-26T08:00:00Z'
  }
]

export interface BlotterReport {
  id: string
  blotterNumber?: string
  residentId: string
  complainantName: string
  complainantAddress: string
  respondentName: string
  respondentAddress?: string
  incidentType: string
  caseNature: 'civil' | 'criminal'
  description: string
  incidentDate: string
  incidentTime: string
  location: string
  purpose: string
  status: string
  remarks?: string
  handledBy?: string
  createdAt: string
  updatedAt: string
}

export const mockBlotterReports: BlotterReport[] = [
  {
    id: '1',
    blotterNumber: 'BLT-2026-0001',
    residentId: 'RES-2024-001',
    complainantName: 'Juan Dela Cruz',
    complainantAddress: 'Purok 1, Barangay Santiago',
    respondentName: 'Unknown',
    incidentType: 'Noise Complaint',
    caseNature: 'civil',
    description: 'Loud karaoke from neighboring house past 10 PM causing disturbance to the neighborhood.',
    incidentDate: '2026-04-15',
    incidentTime: '23:00',
    location: 'Purok 1, Barangay Santiago',
    purpose: 'For mediation / settlement',
    status: 'resolved',
    remarks: 'Both parties agreed to limit noise after 10 PM',
    handledBy: 'Jose Mendoza',
    createdAt: '2026-04-16T08:00:00Z',
    updatedAt: '2026-04-18T10:00:00Z'
  },
  {
    id: '2',
    blotterNumber: 'BLT-2026-0002',
    residentId: 'RES-2024-002',
    complainantName: 'Maria Clara Reyes',
    complainantAddress: 'Purok 3, Barangay Santiago',
    respondentName: 'N/A',
    incidentType: 'Lost Item',
    caseNature: 'civil',
    description: 'Lost wallet containing IDs and cash near the barangay plaza. Wallet is black leather with initials MCR.',
    incidentDate: '2026-04-20',
    incidentTime: '14:00',
    location: 'Barangay Plaza',
    purpose: 'For record purposes only',
    status: 'pending',
    createdAt: '2026-04-20T15:00:00Z',
    updatedAt: '2026-04-20T15:00:00Z'
  },
  {
    id: '3',
    blotterNumber: 'BLT-2026-0003',
    residentId: 'RES-2024-001',
    complainantName: 'Juan Dela Cruz',
    complainantAddress: 'Purok 1, Barangay Santiago',
    respondentName: 'Stray dogs',
    incidentType: 'Animal Complaint',
    caseNature: 'civil',
    description: 'Stray dogs roaming around the street causing disturbance and potential danger to children.',
    incidentDate: '2026-04-22',
    incidentTime: '06:00',
    location: 'Purok 1, Barangay Santiago',
    purpose: 'For identification of respondent(s)',
    status: 'investigating',
    handledBy: 'Jose Mendoza',
    createdAt: '2026-04-22T07:00:00Z',
    updatedAt: '2026-04-23T09:00:00Z'
  }
]

export const mockProjects = [
  {
    id: '1',
    name: 'Road Repair Project',
    type: 'Infrastructure',
    description: 'Repair of damaged roads in Purok 3 and Purok 4 including strategic improvement for better drainage.',
    budget: 500000,
    fundSource: 'LGU Funds',
    status: 'ongoing',
    startDate: '2026-04-01',
    targetCompletion: '2026-06-30',
    progress: 70,
    assignedTo: 'Engr. Santos',
    members: ['Juan Dela Cruz', 'Pedro Santos'],
    timeline: [
      { date: '2026-04-01', update: 'Project Started' },
      { date: '2026-04-15', update: 'Materials Purchased' },
      { date: '2026-04-28', update: '50% Completed' },
      { date: '2026-05-01', update: '70% Completed' }
    ],
    files: []
  },
  {
    id: '2',
    name: 'Clean-Up Drive',
    type: 'Program',
    description: 'Monthly barangay-wide clean-up initiative to maintain cleanliness and environmental awareness.',
    budget: 50000,
    fundSource: 'Barangay Funds',
    status: 'ongoing',
    startDate: '2026-01-01',
    targetCompletion: '2026-12-31',
    progress: 40,
    assignedTo: 'Ana Gonzales',
    members: ['Community Volunteers'],
    timeline: [
      { date: '2026-01-15', update: 'First clean-up completed' },
      { date: '2026-02-15', update: 'Second clean-up completed' },
      { date: '2026-03-15', update: 'Third clean-up completed' },
      { date: '2026-04-15', update: 'Fourth clean-up completed' }
    ],
    files: []
  },
  {
    id: '3',
    name: 'Basketball Court Rehab',
    type: 'Infrastructure',
    description: 'Rehabilitation of the barangay basketball court including new backboards and court resurfacing.',
    budget: 200000,
    fundSource: 'LGU Funds',
    status: 'planning',
    startDate: '2026-05-01',
    targetCompletion: '2026-07-31',
    progress: 25,
    assignedTo: 'Jose Mendoza',
    members: ['SK Members'],
    timeline: [
      { date: '2026-04-01', update: 'Project proposal submitted' },
      { date: '2026-04-20', update: 'Budget approved' }
    ],
    files: []
  },
  {
    id: '4',
    name: 'Day Care Building',
    type: 'Infrastructure',
    description: 'Construction of new day care center building with modern facilities.',
    budget: 800000,
    fundSource: 'DSWD Grant',
    status: 'completed',
    startDate: '2025-06-01',
    targetCompletion: '2025-12-31',
    progress: 100,
    assignedTo: 'Engr. Reyes',
    members: ['Construction Team'],
    timeline: [
      { date: '2025-06-01', update: 'Groundbreaking ceremony' },
      { date: '2025-08-15', update: 'Foundation completed' },
      { date: '2025-10-30', update: 'Building structure completed' },
      { date: '2025-12-20', update: 'Project completed and turned over' }
    ],
    files: []
  }
]

export const mockAssets = [
  {
    id: '1',
    name: 'asset1.jpg',
    type: 'Image',
    category: 'Project',
    linkedTo: 'Road Repair Project',
    linkedId: '1',
    uploadedAt: '2026-04-15T10:00:00Z',
    uploadedBy: 'Admin',
    size: '2.4 MB',
    url: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'budget.pdf',
    type: 'Document',
    category: 'Project',
    linkedTo: 'Road Repair Project',
    linkedId: '1',
    uploadedAt: '2026-04-10T08:00:00Z',
    uploadedBy: 'Admin',
    size: '1.2 MB',
    url: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'report.docx',
    type: 'Document',
    category: 'Announcement',
    linkedTo: 'Clean-Up Drive',
    linkedId: '2',
    uploadedAt: '2026-04-25T14:00:00Z',
    uploadedBy: 'Admin',
    size: '856 KB',
    url: '/placeholder.svg'
  }
]

// Helper function to generate control numbers
export function generateControlNumber(docType: string): string {
  const prefixes: Record<string, string> = {
    'Barangay Clearance': 'BC',
    'Certificate of Residency': 'CR',
    'Certificate of Indigency': 'CI',
    'Business Permit': 'BP',
    'Certificate of Good Moral Character': 'GMC',
    'Barangay Blotter': 'BLT'
  }
  const prefix = prefixes[docType] || 'DOC'
  const year = new Date().getFullYear()
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `${prefix}-${year}-${random}`
}

export function generateORNumber(): string {
  const year = new Date().getFullYear()
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `OR-${year}-${random}`
}

export function generateBlotterNumber(): string {
  const year = new Date().getFullYear()
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `BLT-${year}-${random}`
}

// Get resident by ID
export function getResidentById(residentId: string): Resident | undefined {
  return mockResidents.find(r => r.residentId === residentId)
}
