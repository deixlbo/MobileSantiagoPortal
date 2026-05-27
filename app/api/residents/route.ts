import { NextRequest, NextResponse } from 'next/server'
import { Resident } from '@/lib/database'

// In-memory storage for residents
const residents: Map<string, Resident> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      purok,
      gender,
      address,
      dateOfBirth,
      contactNumber,
    } = body

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const resident: Resident = {
      id: `resident-${Date.now()}`,
      email,
      firstName,
      lastName,
      role: 'resident',
      purok: purok || 'Unknown',
      gender: gender || 'other',
      address: address || '',
      dateOfBirth: new Date(dateOfBirth),
      contactNumber: contactNumber || '',
      verificationStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    residents.set(resident.id, resident)

    return NextResponse.json({
      success: true,
      resident,
    })
  } catch (error) {
    console.error('Error creating resident:', error)
    return NextResponse.json(
      { error: 'Failed to create resident' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const residentId = searchParams.get('id')
    const email = searchParams.get('email')
    const status = searchParams.get('status')

    if (residentId) {
      const resident = residents.get(residentId)
      if (!resident) {
        return NextResponse.json(
          { error: 'Resident not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(resident)
    }

    if (email) {
      const resident = Array.from(residents.values()).find(
        (r) => r.email === email
      )
      return NextResponse.json(resident || null)
    }

    let allResidents = Array.from(residents.values())

    if (status) {
      allResidents = allResidents.filter(
        (r) => r.verificationStatus === status
      )
    }

    return NextResponse.json(allResidents)
  } catch (error) {
    console.error('Error fetching residents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch residents' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, verificationStatus, ...updates } = body

    const resident = residents.get(id)
    if (!resident) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      )
    }

    if (verificationStatus) {
      resident.verificationStatus = verificationStatus
    }

    Object.assign(resident, updates)
    resident.updatedAt = new Date()

    residents.set(id, resident)

    return NextResponse.json({
      success: true,
      resident,
    })
  } catch (error) {
    console.error('Error updating resident:', error)
    return NextResponse.json(
      { error: 'Failed to update resident' },
      { status: 500 }
    )
  }
}
