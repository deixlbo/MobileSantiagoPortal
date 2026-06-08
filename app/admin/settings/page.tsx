"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud, Settings2, Globe, Loader, CheckCircle } from "lucide-react"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [barangayName, setBarangayName] = useState("Barangay Santiago")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [officeHours, setOfficeHours] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
        const result = await response.json()
        if (result.success && result.data) {
          setBarangayName(result.data.BARANGAY_NAME || "Barangay Santiago")
          setAddress(result.data.BARANGAY_ADDRESS || "")
          setPhone(result.data.BARANGAY_PHONE || "")
          setEmail(result.data.BARANGAY_EMAIL || "")
          setMessage(result.data.PUBLIC_MESSAGE || "")
          setOfficeHours(result.data.OFFICE_HOURS || "")
        }
      } catch (error) {
        console.error('[v0] Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      // Save all settings
      const settings = {
        BARANGAY_NAME: barangayName,
        BARANGAY_ADDRESS: address,
        BARANGAY_PHONE: phone,
        BARANGAY_EMAIL: email,
        PUBLIC_MESSAGE: message,
        OFFICE_HOURS: officeHours
      }

      for (const [key, value] of Object.entries(settings)) {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
          },
          body: JSON.stringify({ key, value })
        })

        if (!response.ok) {
          throw new Error(`Failed to save ${key}`)
        }
      }

      setLastSaved(new Date())
      toast({
        title: "Success",
        description: "Settings saved successfully!",
        duration: 3000
      })
    } catch (error) {
      console.error('[v0] Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
        duration: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">Configure portal settings</h1>
        <p className="max-w-2xl text-sm text-muted-foreground mt-2">
          Update barangay details, system information, and manage portal configuration.
        </p>
        {lastSaved && (
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Barangay Information */}
        <Card>
          <CardHeader>
            <CardTitle>Barangay Information</CardTitle>
            <CardDescription>System name and public details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="barangay-name">Barangay Name</Label>
              <Input 
                id="barangay-name" 
                value={barangayName} 
                onChange={(e) => setBarangayName(e.target.value)}
                placeholder="e.g., Barangay Santiago"
              />
              <p className="text-xs text-muted-foreground mt-1">This name will display across all portals</p>
            </div>

            <div>
              <Label htmlFor="barangay-address">Address</Label>
              <Input 
                id="barangay-address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, City, Province"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="barangay-phone">Phone</Label>
                <Input 
                  id="barangay-phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+63 47 555-0123"
                />
              </div>
              <div>
                <Label htmlFor="barangay-email">Email</Label>
                <Input 
                  id="barangay-email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@santiago.gov.ph"
                  type="email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="office-hours">Office Hours</Label>
              <Input 
                id="office-hours" 
                value={officeHours} 
                onChange={(e) => setOfficeHours(e.target.value)}
                placeholder="Monday - Friday, 8:00 AM - 5:00 PM"
              />
            </div>
          </CardContent>
        </Card>

        {/* Public Message & Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Public Communication</CardTitle>
            <CardDescription>Messages and branding settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="public-message">Welcome Message</Label>
              <Textarea 
                id="public-message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter welcome message for residents..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">Displayed on landing page and resident portal</p>
            </div>

            <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6 text-center bg-muted/50">
              <Globe className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-3 text-sm text-muted-foreground">Logo and branding uploads coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Cancel
        </Button>
        <Button 
          onClick={save}
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Settings2 className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
