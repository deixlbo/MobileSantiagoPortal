"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
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
  id: 1,
  name: "Rolando C. Borja",
  position: "Barangay Captain",
  yearElected: 2023,
  age: 52,
  gender: "Male",
  email: "rolando@barangaysantiago.gov.ph",
  avatar: "/placeholder-avatar.jpg",
  status: "active",
  department: "Administration",
  termEnd: "2026",
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

  useEffect(() => {
    const loadProfile = async () => {
      const { profile, error } = await getProfile()
      if (error) {
        console.error("Profile fetch error:", error)
      }
      if (profile) {
        setOfficialProfile((prev) => ({
          ...prev,
          name: `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || prev.name,
          email: profile.email ?? prev.email,
          position: profile.position ?? prev.position,
          gender: profile.gender
            ? `${profile.gender.charAt(0).toUpperCase()}${profile.gender.slice(1)}`
            : prev.gender,
          status: profile.verification_status === "verified" ? "active" : prev.status,
        }))
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
              <Avatar className="h-24 w-24 ring-4 ring-emerald-100">
                <AvatarImage src={officialProfile.avatar} alt={officialProfile.name} />
                <AvatarFallback className="bg-emerald-700 text-white text-2xl font-bold">
                  {officialProfile.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
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

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Calendar className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Year Elected</p>
                  <p className="text-sm font-medium">{officialProfile.yearElected}</p>
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
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Official details and account information</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</p>
                <p className="mt-1 font-semibold">{officialProfile.name}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Position</p>
                <p className="mt-1 font-semibold">{officialProfile.position}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Year Elected</p>
                <p className="mt-1 font-semibold">{officialProfile.yearElected}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Age</p>
                <p className="mt-1 font-semibold">{officialProfile.age} years old</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Gender</p>
                <p className="mt-1 font-semibold">{officialProfile.gender}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Email Address</p>
                <p className="mt-1 font-semibold text-sm">{officialProfile.email}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Department</p>
                <p className="mt-1 font-semibold">{officialProfile.department}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Term Ends</p>
                <p className="mt-1 font-semibold">{officialProfile.termEnd}</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                <Badge className="mt-1 bg-emerald-100 text-emerald-700">Active</Badge>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  )
}
