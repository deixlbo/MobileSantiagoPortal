// Mock users data for authentication
export const mockUsers = {
  residents: [
    {
      id: "resident-1",
      email: "juan@example.com",
      password: "password123",
      firstName: "Juan",
      lastName: "Dela Cruz",
      purok: "Purok 1",
      gender: "male",
      role: "resident" as const,
    },
    {
      id: "resident-2",
      email: "maria@example.com",
      password: "password123",
      firstName: "Maria",
      lastName: "Santos",
      purok: "Purok 2",
      gender: "female",
      role: "resident" as const,
    },
  ],
  officials: [
    {
      id: "official-1",
      email: "admin@barangaysantiago.gov.ph",
      password: "admin123",
      firstName: "Rolando",
      lastName: "Borja",
      position: "Barangay Captain",
      role: "official" as const,
    },
    {
      id: "official-2",
      email: "secretary@barangaysantiago.gov.ph",
      password: "admin123",
      firstName: "Elena",
      lastName: "Reyes",
      position: "Barangay Secretary",
      role: "official" as const,
    },
  ],
}

export type MockResident = (typeof mockUsers.residents)[number]
export type MockOfficial = (typeof mockUsers.officials)[number]
export type MockUser = MockResident | MockOfficial

// Mock authentication functions
export function authenticateResident(email: string, password: string): MockResident | null {
  const user = mockUsers.residents.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  return user || null
}

export function authenticateOfficial(email: string, password: string): MockOfficial | null {
  const user = mockUsers.officials.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  return user || null
}

export function registerResident(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  purok: string
  gender: string
}): MockResident {
  const newUser: MockResident = {
    id: `resident-${Date.now()}`,
    ...data,
    role: "resident",
  }
  // In a real app, this would be saved to a database
  mockUsers.residents.push(newUser)
  return newUser
}
