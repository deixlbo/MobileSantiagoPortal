"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProfile } from "@/lib/auth"
import {
  User,
  Mail,
  Calendar,
  Shield,
  CheckCircle2,
  FileText,
  Users,
  AlertTriangle,
} from "lucide-react"

const defaultOfficialProfile = {
  id: "",
  name: "",
  position: "",
  email: "",
  avatar: "/placeholder-avatar.jpg",
  createdAt: new Date().toISOString(),
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function OfficialProfilePage() {
  const [officialProfile, setOfficialProfile] = useState(defaultOfficialProfile)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Profile photo must be less than 5MB')
      return
    }

    if (!officialProfile.id) {
      toast.error('Your profile is not ready yet')
      return
    }

    setIsUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('userId', officialProfile.id)
      formData.append('file', file)
      const response = await fetch('/api/profile/photo', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Unable to upload profile photo')
      }

      setOfficialProfile((prev) => ({
        ...prev,
        avatar: result.fileUrl || prev.avatar,
      }))
      toast.success('Profile photo updated successfully')
    } catch (error) {
      console.error('Profile photo upload failed:', error)
      toast.error(error instanceof Error ? error.message : 'Unable to upload profile photo')
    } finally {
      setIsUploadingPhoto(false)
      event.target.value = ''
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { profile, error } = await getProfile()
        if (error) {
          console.error("Profile fetch error:", error instanceof Error ? error.message : String(error))
          return
        }
        if (profile) {
          setOfficialProfile((prev) => ({
            ...prev,
            id: profile.id || prev.id,
            name: `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || prev.name,
            email: profile.email ?? prev.email,
            position: profile.position || prev.position,
            createdAt: profile.created_at || prev.createdAt,
            avatar: profile.avatar_url || profile.profile_image_url || profile.avatar || prev.avatar,
          }))
        }
      } catch (err) {
        console.error("Failed to load profile:", err)
      }
    }

    loadProfile()
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage your official account</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="border rounded-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-emerald-100">
                  <AvatarImage src={officialProfile.avatar} alt={officialProfile.name} />
                  <AvatarFallback className="bg-emerald-700 text-white text-2xl font-bold">
                    {officialProfile.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-sm hover:bg-emerald-50">
                  <input type="file" accept="image/*" className="sr-only" onChange={handleProfilePhotoUpload} />
                  <span className="text-sm font-semibold">+</span>
                </label>
              </div>
              {isUploadingPhoto && <p className="mt-2 text-xs text-emerald-700">Uploading profile photo…</p>}
              <h2 className="mt-4 text-xl font-bold">{officialProfile.name}</h2>
              <p className="text-muted-foreground">{officialProfile.position}</p>
              <Badge className="mt-2 bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Active
              </Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Mail className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{officialProfile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Shield className="h-4 w-4 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Position</p>
                  <p className="text-sm font-medium">{officialProfile.position}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details & Logs */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
        {/* Personal Information */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Account Information</h3>
              <p className="text-sm text-muted-foreground">Your official account details</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">First Name</p>
                <p className="mt-1 font-semibold">{officialProfile.name.split(' ')[0] || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Name</p>
                <p className="mt-1 font-semibold">{officialProfile.name.split(' ').slice(1).join(' ') || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Position</p>
                <p className="mt-1 font-semibold">{officialProfile.position}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Email Address</p>
                <p className="mt-1 font-semibold text-sm">{officialProfile.email}</p>
              </div>
              <div className="p-4 rounded-lg border sm:col-span-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Created</p>
                <p className="mt-1 font-semibold">
                  {officialProfile.createdAt ? new Date(officialProfile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  )
}
