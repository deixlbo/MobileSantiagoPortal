"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud, Settings2, Globe } from "lucide-react"

export default function AdminSettingsPage() {
  const [barangayName, setBarangayName] = useState("AI-Assisted Barangay Santiago Portal: Smart Document Processing and Resident Service Automation")
  const [address, setAddress] = useState("123 Barangay Road, City")
  const [message, setMessage] = useState("Welcome to the official barangay portal. Use this space to keep residents updated.")

  const save = () => {
    window.alert("Settings saved.")
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Configure portal settings</h1>
        <p className="max-w-2xl text-sm text-slate-600 mt-2">
          Update barangay details, upload official seal, and manage site templates.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Barangay information</CardTitle>
            <CardDescription>Public metadata and address details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="barangay-name">Barangay name</Label>
              <Input id="barangay-name" value={barangayName} onChange={(e) => setBarangayName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="barangay-address">Address</Label>
              <Input id="barangay-address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="barangay-message">Public announcement message</Label>
              <Textarea id="barangay-message" value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[120px]" />
            </div>
          </CardContent>
          <div className="p-4">
            <Button className="w-full" onClick={save}>
              <Settings2 className="mr-2 h-4 w-4" /> Save settings
            </Button>
          </div>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Logo and branding</CardTitle>
            <CardDescription>Upload barangay seal and templates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center">
              <Globe className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-3 text-sm text-slate-600">Upload the official logo used across admin documents and public pages.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.alert("Upload flow not connected.")}>Upload logo</Button>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Template settings</p>
              <p className="mt-2">Configure letterhead text, document footer, and resident portal branding.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
