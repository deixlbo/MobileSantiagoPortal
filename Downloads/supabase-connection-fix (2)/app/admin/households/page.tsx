"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users, Trash2, UserPlus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Resident {
  id: string
  first_name: string
  last_name: string
  purok: string
}

interface HouseholdMember {
  id: string
  first_name: string
  last_name: string
  relationship?: string
}

interface Household {
  id: string
  name: string
  address: string
  member_count: number
  head_of_household_id?: string
}

export default function AdminHouseholdsPage() {
  const [households, setHouseholds] = useState<Household[]>([])
  const [residents, setResidents] = useState<Resident[]>([])
  const [allHouseholdMembers, setAllHouseholdMembers] = useState<HouseholdMember[]>([])
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [selectedHeadOfHousehold, setSelectedHeadOfHousehold] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([])
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [selectedResident, setSelectedResident] = useState("")
  const [selectedRelationship, setSelectedRelationship] = useState("")
  const [isAddingMember, setIsAddingMember] = useState(false)

  useEffect(() => {
    fetchHouseholds()
    fetchResidents()
  }, [])

  const fetchHouseholds = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const response = await fetch('/api/households', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load households')
      }

      setHouseholds(result || [])
      
      // Fetch all members from all households
      await fetchAllHouseholdMembers(result || [])
    } catch (error: any) {
      const message = error?.message || JSON.stringify(error) || 'Unknown error'
      console.error('Failed to load households:', message, error)
      toast.error('Failed to load households')
    }
  }

  const fetchAllHouseholdMembers = async (householdList: Household[]) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const allMembers: HouseholdMember[] = []

      for (const household of householdList) {
        try {
          const response = await fetch(`/api/households?householdId=${household.id}`, {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
          })
          const result = await response.json()

          if (response.ok && result.members) {
            allMembers.push(...result.members)
          }
        } catch (error) {
          console.error(`Failed to load members for household ${household.id}:`, error)
        }
      }

      setAllHouseholdMembers(allMembers)
    } catch (error: any) {
      console.error('Failed to load all household members:', error)
    }
  }

  const fetchResidents = async () => {
    try {
      const response = await fetch('/api/residents')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load residents')
      }

      setResidents(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error('Failed to load residents:', error)
    }
  }

  const fetchHouseholdMembers = async (householdId: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const response = await fetch(`/api/households?householdId=${householdId}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load household members')
      }

      setHouseholdMembers(result.members || [])
    } catch (error: any) {
      console.error('Failed to load household members:', error)
      toast.error('Failed to load household members')
    }
  }

  const addHousehold = async () => {
    if (!name.trim() || !address.trim() || !selectedHeadOfHousehold) {
      toast.error('Please fill in all fields and select a head of household')
      return
    }
    setIsSaving(true)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const response = await fetch('/api/households', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          purok: address.trim(),
          head_id: selectedHeadOfHousehold,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create household')
      }

      const createdHousehold = result
      setHouseholds((current) => [createdHousehold, ...current])
      setName("")
      setAddress("")
      setSelectedHeadOfHousehold("")
      toast.success('Household created successfully')
    } catch (error: any) {
      const message = error?.message || JSON.stringify(error) || 'Unknown error'
      console.error('Failed to create household:', message, error)
      toast.error('Failed to create household')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectHousehold = (household: Household) => {
    setSelectedHousehold(household)
    fetchHouseholdMembers(household.id)
  }

  const handleAddMember = async () => {
    if (!selectedResident || !selectedRelationship) {
      toast.error('Please select a resident and relationship')
      return
    }

    if (!selectedHousehold) return

    setIsAddingMember(true)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const response = await fetch('/api/households/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          householdId: selectedHousehold.id,
          residentId: selectedResident,
          relationship: selectedRelationship,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add member')
      }

      toast.success('Family member added successfully')
      setSelectedResident("")
      setSelectedRelationship("")
      setShowAddMemberDialog(false)
      
      // Refresh household members
      await fetchHouseholdMembers(selectedHousehold.id)
      
      // Refresh households and all members to update filters
      await fetchHouseholds()
    } catch (error: any) {
      console.error('Failed to add member:', error)
      toast.error('Failed to add family member')
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedHousehold) return

    if (!confirm('Remove this member from household?')) return

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      const response = await fetch('/api/households/members', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          householdId: selectedHousehold.id,
          residentId: memberId,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove member')
      }

      toast.success('Member removed successfully')
      
      // Refresh household members
      await fetchHouseholdMembers(selectedHousehold.id)
      
      // Refresh households
      await fetchHouseholds()
    } catch (error: any) {
      console.error('Failed to remove member:', error)
      toast.error('Failed to remove member')
    }
  }

  // Get all resident IDs that are already in households
  const getResidentsInHouseholds = (): Set<string> => {
    const residentIds = new Set<string>()
    
    households.forEach((household) => {
      // Add head of household
      if (household.head_of_household_id) {
        residentIds.add(household.head_of_household_id)
      }
    })

    allHouseholdMembers.forEach((member) => {
      residentIds.add(member.id)
    })

    return residentIds
  }

  // Filter residents to show only those not already in a household
  const getAvailableResidents = (includeCurrentMembers: boolean = false): Resident[] => {
    const residentsInHouseholds = getResidentsInHouseholds()
    
    return residents.filter((resident) => {
      if (includeCurrentMembers && selectedHousehold) {
        // When adding members, also exclude current members of the selected household
        const isMemberOfCurrentHousehold = householdMembers.some(m => m.id === resident.id)
        return !residentsInHouseholds.has(resident.id) && !isMemberOfCurrentHousehold
      }
      return !residentsInHouseholds.has(resident.id)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Household Management</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Manage households</h1>
          <p className="max-w-2xl text-sm text-slate-600 mt-2">
            Create households and manage family members.
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1fr_0.8fr]">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Household directory</CardTitle>
            <CardDescription>Click a household to manage members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {households.map((household) => (
                <button
                  key={household.id}
                  onClick={() => handleSelectHousehold(household)}
                  className={`rounded-3xl border p-4 shadow-sm text-left transition-all ${
                    selectedHousehold?.id === household.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-slate-200 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{household.name}</p>
                      <p className="text-sm text-slate-600">{household.address}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      <Users className="h-4 w-4" /> {household.member_count} members
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Create household</CardTitle>
              <CardDescription>Add a new household.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="household-name">Household Name</Label>
                <Input id="household-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of household" />
              </div>
              <div>
                <Label htmlFor="household-address">Address</Label>
                <Input id="household-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Household address" />
              </div>
              <div>
                <Label htmlFor="household-head">Head of Household</Label>
                <Select value={selectedHeadOfHousehold} onValueChange={setSelectedHeadOfHousehold}>
                  <SelectTrigger id="household-head">
                    <SelectValue placeholder="Select head of household" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableResidents().map((resident) => (
                      <SelectItem key={resident.id} value={resident.id}>
                        {resident.first_name} {resident.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <div className="p-4">
              <Button className="w-full" onClick={addHousehold} disabled={isSaving}>
                <Plus className="mr-2 h-4 w-4" /> Create household
              </Button>
            </div>
          </Card>

          {selectedHousehold && (
            <Card className="space-y-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Household Members</CardTitle>
                    <CardDescription>{selectedHousehold.name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setShowAddMemberDialog(true)}
                  className="w-full"
                  variant="outline"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Add Family Member
                </Button>

                {householdMembers.length > 0 ? (
                  <div className="space-y-3">
                    {householdMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {member.first_name[0]}{member.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.first_name} {member.last_name}</p>
                            <p className="text-xs text-slate-500">{member.relationship || 'Family member'}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No members yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="w-[95vw] sm:w-auto max-w-md">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
            <DialogDescription>
              Select a resident to add to {selectedHousehold?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="resident-select">Resident</Label>
              <Select value={selectedResident} onValueChange={setSelectedResident}>
                <SelectTrigger id="resident-select">
                  <SelectValue placeholder="Select a resident" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableResidents(true).map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.first_name} {resident.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="relationship-select">Relationship</Label>
              <Select value={selectedRelationship} onValueChange={setSelectedRelationship}>
                <SelectTrigger id="relationship-select">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Head of Household">Head of Household</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Grandparent">Grandparent</SelectItem>
                  <SelectItem value="Grandchild">Grandchild</SelectItem>
                  <SelectItem value="Other">Other Family Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)} className="w-full">
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={isAddingMember} className="w-full">
              {isAddingMember ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
