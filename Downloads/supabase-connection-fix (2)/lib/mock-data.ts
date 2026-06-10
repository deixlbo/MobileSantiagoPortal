// Mock data for all features
// Pre-populated with realistic sample data

export const MOCK_DATA = {
  documents: [
    {
      id: 'doc-001',
      resident_id: 'resident-001',
      document_type: 'barangay_certificate',
      status: 'approved',
      control_number: 'BC-2024-001',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        first_name: 'Juan',
        last_name: 'Dela Cruz',
      },
    },
    {
      id: 'doc-002',
      resident_id: 'resident-002',
      document_type: 'residency_certificate',
      status: 'pending',
      control_number: 'RC-2024-002',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        first_name: 'Maria',
        last_name: 'Santos',
      },
    },
    {
      id: 'doc-003',
      resident_id: 'resident-003',
      document_type: 'business_permit',
      status: 'ready_to_print',
      control_number: 'BP-2024-003',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        first_name: 'Carlos',
        last_name: 'Reyes',
      },
    },
    {
      id: 'doc-004',
      resident_id: 'resident-004',
      document_type: 'indigency_certificate',
      status: 'declined',
      control_number: 'IC-2024-004',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        first_name: 'Rosa',
        last_name: 'Cruz',
      },
    },
    {
      id: 'doc-005',
      resident_id: 'resident-005',
      document_type: 'barangay_certificate',
      status: 'released',
      control_number: 'BC-2024-005',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        first_name: 'Pedro',
        last_name: 'Fernandez',
      },
    },
  ],

  complaints: [
    {
      id: 'complaint-001',
      resident_id: 'resident-001',
      title: 'Stray dogs in the area',
      description: 'There are multiple stray dogs roaming around Purok 1 causing disturbance',
      status: 'open',
      priority: 'high',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'animal_control',
    },
    {
      id: 'complaint-002',
      resident_id: 'resident-002',
      title: 'Road damage near barangay hall',
      description: 'Large pothole on the main road near barangay hall needs immediate repair',
      status: 'in_progress',
      priority: 'high',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'infrastructure',
    },
    {
      id: 'complaint-003',
      resident_id: 'resident-003',
      title: 'Illegal dumping site',
      description: 'Residents are dumping garbage in the vacant lot near the school',
      status: 'resolved',
      priority: 'medium',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'sanitation',
    },
    {
      id: 'complaint-004',
      resident_id: 'resident-004',
      title: 'Noise complaint from neighbors',
      description: 'Excessive noise from karaoke every night until late hours',
      status: 'open',
      priority: 'medium',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'noise',
    },
    {
      id: 'complaint-005',
      resident_id: 'resident-005',
      title: 'Water supply interruption',
      description: 'No water supply for 3 days, affecting multiple households',
      status: 'resolved',
      priority: 'high',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'utilities',
    },
  ],

  appointments: [
    {
      id: 'apt-001',
      resident_id: 'resident-001',
      type: 'document_inquiry',
      purpose: 'Discussion about barangay certificate requirements',
      scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 30,
      status: 'confirmed',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'apt-002',
      resident_id: 'resident-002',
      type: 'community_program',
      purpose: 'Discuss community development programs',
      scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 45,
      status: 'confirmed',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'apt-003',
      resident_id: 'resident-003',
      type: 'business_permit',
      purpose: 'Submit and discuss business permit application',
      scheduled_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 60,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    },
    {
      id: 'apt-004',
      resident_id: 'resident-004',
      type: 'complaint_followup',
      purpose: 'Follow up on filed complaint regarding noise disturbance',
      scheduled_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 30,
      status: 'completed',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],

  announcements: [
    {
      id: 'ann-001',
      title: 'Barangay Fiesta 2024 - Save the Date!',
      content: 'Mark your calendars for the annual Barangay Santiago Fiesta happening on June 15-17, 2024. Expect fun activities, food, and community engagement.',
      author_id: 'official-001',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'published',
    },
    {
      id: 'ann-002',
      title: 'Road Maintenance Project Notice',
      content: 'The barangay will be conducting road maintenance on July 2-5, 2024. Please expect minor traffic disruptions during this period.',
      author_id: 'official-001',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'published',
    },
    {
      id: 'ann-003',
      title: 'Health and Wellness Program for Seniors',
      content: 'Free health checkup and wellness activities for senior citizens every Wednesday at the Barangay Community Center.',
      author_id: 'official-001',
      created_at: new Date().toISOString(),
      status: 'published',
    },
  ],

  ordinances: [
    {
      id: 'ord-001',
      number: '01',
      year: '2026',
      title: 'Clean Barangay Ordinance',
      fullTitle: 'An Ordinance Promoting Cleanliness and Proper Waste Disposal in Barangay Santiago',
      status: 'Published',
      date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: 'Punong Barangay',
      whereas: [
        'WHEREAS, maintaining cleanliness in barangay public areas is essential for community health and safety;',
        'WHEREAS, proper waste segregation and disposal reduce the risk of disease and environmental pollution;',
      ],
      sections: [
        {
          title: 'Waste Segregation',
          content: 'All households and establishments must segregate waste into biodegradable, non-biodegradable, and recyclable materials before disposal.',
        },
        {
          title: 'Community Clean-Up',
          content: 'The barangay shall organize monthly clean-up drives in public spaces, with participation from residents encouraged and supported.',
        },
      ],
      category: 'Ordinance',
    },
    {
      id: 'ord-002',
      number: '02',
      year: '2026',
      title: 'Noise Control Ordinance',
      fullTitle: 'An Ordinance Regulating Noise Levels and Quiet Hours Within Barangay Santiago',
      status: 'Published',
      date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: 'Barangay Secretary',
      whereas: [
        'WHEREAS, excessive noise disturbs the peace, safety, and welfare of residents;',
        'WHEREAS, setting quiet hours supports restful sleep and community well-being;',
      ],
      sections: [
        {
          title: 'Quiet Hours',
          content: 'Quiet hours are from 10:00 PM to 6:00 AM daily. All amplified sound systems and activities must be kept at a reasonable volume.',
        },
        {
          title: 'Penalties',
          content: 'Violations of this ordinance may result in warnings and fines as determined by the barangay council.',
        },
      ],
      category: 'Ordinance',
    },
    {
      id: 'ord-003',
      number: '03',
      year: '2026',
      title: 'Community Safety Resolution',
      fullTitle: 'A Resolution Supporting Community Safety Measures and Neighborhood Watch Programs',
      status: 'Published',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: 'Punong Barangay',
      whereas: [
        'WHEREAS, active community participation strengthens barangay safety and security;',
        'WHEREAS, a neighborhood watch program helps prevent crime and encourages cooperation among residents;',
      ],
      sections: [
        {
          title: 'Neighborhood Watch',
          content: 'Residents are encouraged to form neighborhood watch groups and report suspicious activities to barangay officials.',
        },
        {
          title: 'Public Safety',
          content: 'The barangay shall coordinate with local authorities for regular patrols and safety briefings.',
        },
      ],
      category: 'Resolution',
    },
  ],

  residents: [
    {
      id: 'resident-001',
      email: 'resident@demo.com',
      first_name: 'Juan',
      last_name: 'Dela Cruz',
      purok: 'Purok 1',
      gender: 'Male',
      occupation: 'Mechanic',
      verification_status: 'verified',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'resident-002',
      email: 'maria@demo.com',
      first_name: 'Maria',
      last_name: 'Santos',
      purok: 'Purok 2',
      gender: 'Female',
      occupation: 'Teacher',
      verification_status: 'verified',
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'resident-003',
      email: 'carlos@demo.com',
      first_name: 'Carlos',
      last_name: 'Reyes',
      purok: 'Purok 3',
      gender: 'Male',
      occupation: 'Businessman',
      verification_status: 'verified',
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'resident-004',
      email: 'rosa@demo.com',
      first_name: 'Rosa',
      last_name: 'Cruz',
      purok: 'Purok 1',
      gender: 'Female',
      occupation: 'Housewife',
      verification_status: 'verified',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'resident-005',
      email: 'pedro@demo.com',
      first_name: 'Pedro',
      last_name: 'Fernandez',
      purok: 'Purok 2',
      gender: 'Male',
      occupation: 'Farmer',
      verification_status: 'pending',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],

  qr_codes: [
    {
      id: 'qr-001',
      document_id: 'doc-001',
      qr_data: 'https://barangay-santiago.demo/verify/qr-001',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      verified_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'verified',
    },
    {
      id: 'qr-002',
      document_id: 'doc-003',
      qr_data: 'https://barangay-santiago.demo/verify/qr-002',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      verified_at: null,
      status: 'pending',
    },
  ],
}

// Helper functions to filter and search mock data
export function getMockDocuments() {
  return MOCK_DATA.documents
}

export function getMockComplaints() {
  return MOCK_DATA.complaints
}

export function getMockAppointments() {
  return MOCK_DATA.appointments
}

export function getMockAnnouncements() {
  return MOCK_DATA.announcements
}

export function getMockOrdinances() {
  return MOCK_DATA.ordinances
}

export function getMockResidents() {
  return MOCK_DATA.residents
}

export function getMockQRCodes() {
  return MOCK_DATA.qr_codes
}

export function getMockComplaintStats(days: number = 30) {
  const recentComplaints = MOCK_DATA.complaints.filter(c => {
    const createdDate = new Date(c.created_at).getTime()
    const pastDate = Date.now() - days * 24 * 60 * 60 * 1000
    return createdDate > pastDate
  })

  const statusCounts = {
    open: recentComplaints.filter(c => c.status === 'open').length,
    in_progress: recentComplaints.filter(c => c.status === 'in_progress').length,
    resolved: recentComplaints.filter(c => c.status === 'resolved').length,
  }

  const categoryCounts = recentComplaints.reduce((acc: any, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1
    return acc
  }, {})

  return {
    total: recentComplaints.length,
    statusCounts,
    categoryCounts,
  }
}

export function getMockDocumentStats(days: number = 30) {
  const recentDocs = MOCK_DATA.documents.filter(d => {
    const createdDate = new Date(d.created_at).getTime()
    const pastDate = Date.now() - days * 24 * 60 * 60 * 1000
    return createdDate > pastDate
  })

  const statusCounts = {
    pending: recentDocs.filter(d => d.status === 'pending').length,
    approved: recentDocs.filter(d => d.status === 'approved').length,
    ready_to_print: recentDocs.filter(d => d.status === 'ready_to_print').length,
    released: recentDocs.filter(d => d.status === 'released').length,
    declined: recentDocs.filter(d => d.status === 'declined').length,
  }

  return {
    total: recentDocs.length,
    statusCounts,
  }
}

export function getMockAppointmentStats(days: number = 30) {
  const recentApts = MOCK_DATA.appointments.filter(a => {
    const createdDate = new Date(a.created_at).getTime()
    const pastDate = Date.now() - days * 24 * 60 * 60 * 1000
    return createdDate > pastDate
  })

  const statusCounts = {
    pending: recentApts.filter(a => a.status === 'pending').length,
    confirmed: recentApts.filter(a => a.status === 'confirmed').length,
    completed: recentApts.filter(a => a.status === 'completed').length,
  }

  return {
    total: recentApts.length,
    statusCounts,
  }
}
