"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Users,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Eye,
  LogOut,
  ClipboardList,
} from "lucide-react"

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "Rolando C. Borja",
    email: "rolando@barangaysantiago.gov.ph",
    role: "Admin",
    status: "active",
    lastLogin: "Today at 2:30 PM",
    department: "Administration",
    actions: ["View All", "Edit Records", "Approve Requests", "Generate Reports", "Manage Users"],
    logs: [
      { action: "Logged in", time: "Today at 2:30 PM" },
      { action: "Approved 3 document requests", time: "Today at 1:45 PM" },
      { action: "Generated monthly report", time: "Today at 12:00 PM" },
    ]
  },
  {
    id: 2,
    name: "Maria Cruz",
    email: "maria@barangaysantiago.gov.ph",
    role: "Staff",
    status: "active",
    lastLogin: "Today at 1:15 PM",
    department: "Documents",
    actions: ["View Assigned", "Process Requests", "Upload Documents"],
    logs: [
      { action: "Logged in", time: "Today at 1:15 PM" },
      { action: "Processed 5 clearance requests", time: "Today at 10:30 AM" },
    ]
  },
  {
    id: 3,
    name: "Juan Reyes",
    email: "juan@barangaysantiago.gov.ph",
    role: "Staff",
    status: "active",
    lastLogin: "Yesterday at 4:00 PM",
    department: "Blotter",
    actions: ["View Assigned", "Process Cases", "Schedule Hearings"],
    logs: [
      { action: "Logged in", time: "Yesterday at 4:00 PM" },
      { action: "Filed 2 new blotter cases", time: "Yesterday at 3:15 PM" },
    ]
  },
  {
    id: 4,
    name: "Ana Gabrielle Santos",
    email: "ana@barangaysantiago.gov.ph",
    role: "Official",
    status: "active",
    lastLogin: "Today at 3:45 PM",
    department: "Leadership",
    actions: ["View All", "Approve Requests", "Sign Documents"],
    logs: [
      { action: "Logged in", time: "Today at 3:45 PM" },
      { action: "Signed 5 documents", time: "Today at 3:00 PM" },
    ]
  },
]

const rolePermissions = [
  {
    role: "Admin",
    permissions: ["View All Data", "Approve/Reject Requests", "Manage Users", "Generate Reports", "Edit Settings"],
    badge: "bg-red-100 text-red-700",
    description: "Full system access and management capabilities",
  },
  {
    role: "Official",
    permissions: ["View All Data", "Approve/Reject Requests", "Sign Documents", "View Reports"],
    badge: "bg-purple-100 text-purple-700",
    description: "Leadership and approval authority",
  },
  {
    role: "Staff",
    permissions: ["View Assigned Tasks", "Process Requests", "Upload Documents", "Update Status"],
    badge: "bg-blue-100 text-blue-700",
    description: "Execute assigned tasks and process requests",
  },
]

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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(mockUsers)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null)
  const [editedUserData, setEditedUserData] = useState({ name: "", email: "", department: "", role: "Staff" as "Admin" | "Official" | "Staff" })
  const [newUserRole, setNewUserRole] = useState<"Admin" | "Official" | "Staff">("Staff")
  const [newUserData, setNewUserData] = useState({ name: "", email: "", department: "" })

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = () => {
    if (newUserData.name && newUserData.email) {
      const newUser = {
        id: users.length + 1,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserRole,
        status: "active",
        lastLogin: "Never",
        department: newUserData.department,
        actions: newUserRole === "Admin" ? ["View All", "Edit Records", "Approve Requests", "Generate Reports", "Manage Users"] : 
                 newUserRole === "Official" ? ["View All", "Approve Requests", "Sign Documents"] :
                 ["View Assigned", "Process Requests", "Upload Documents"],
        logs: [{ action: "Account created", time: "Just now" }]
      }
      setUsers([...users, newUser])
      setShowAddDialog(false)
      setNewUserData({ name: "", email: "", department: "" })
    }
  }

  const getRoleActions = (role: "Admin" | "Official" | "Staff") =>
    role === "Admin"
      ? ["View All", "Edit Records", "Approve Requests", "Generate Reports", "Manage Users"]
      : role === "Official"
      ? ["View All", "Approve Requests", "Sign Documents"]
      : ["View Assigned", "Process Requests", "Upload Documents"]

  const openEditDialog = (user: typeof mockUsers[0]) => {
    setEditingUser(user)
    setEditedUserData({ name: user.name, email: user.email, department: user.department, role: user.role as "Admin" | "Official" | "Staff" })
    setShowEditDialog(true)
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    const updatedUser = {
      ...editingUser,
      name: editedUserData.name,
      email: editedUserData.email,
      department: editedUserData.department,
      role: editedUserData.role,
      actions: getRoleActions(editedUserData.role),
      logs: [{ action: "Profile updated", time: "Just now" }, ...editingUser.logs],
    }

    setUsers(users.map(u => (u.id === editingUser.id ? updatedUser : u)))
    setEditingUser(null)
    setShowEditDialog(false)
  }

  const handleRemoveUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId))
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User & Role Management</h1>
          <p className="text-muted-foreground mt-1">Manage staff accounts and permissions</p>
        </div>
        <Button 
          className="w-full md:w-auto gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Role Permissions Overview */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 lg:grid-cols-3">
          {rolePermissions.map((role) => (
            <Card key={role.role}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{role.role}</CardTitle>
                  <Badge className={role.badge}>{role.role}</Badge>
                </div>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {role.permissions.map((permission, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Staff members and their access permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Department: {user.department}</p>
                    <p className="text-xs text-muted-foreground">Last Login: {user.lastLogin}</p>
                    
                    {/* Permissions */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {user.actions.map((action, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:flex-col sm:gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2" onClick={() => openEditDialog(user)}>
                      <Edit2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2 text-red-600 hover:text-red-700" onClick={() => handleRemoveUser(user.id)}>
                      <Trash2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Log */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>User Activity Log</CardTitle>
            <CardDescription>Recent actions performed by staff members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { user: "Maria Cruz", action: "Approved Document Request", time: "2 hours ago", type: "success" },
                { user: "Juan Reyes", action: "Filed New Blotter Case", time: "4 hours ago", type: "info" },
                { user: "Rolando C. Borja", action: "Generated Monthly Report", time: "6 hours ago", type: "success" },
                { user: "Ana Gabrielle Santos", action: "Signed 5 Documents", time: "8 hours ago", type: "success" },
                { user: "Maria Cruz", action: "Rejected Clearance Request", time: "10 hours ago", type: "warning" },
              ].map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                    log.type === "success" ? "bg-emerald-500" :
                    log.type === "warning" ? "bg-amber-500" :
                    "bg-blue-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.user}</p>
                    <p className="text-sm text-muted-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md mx-4 md:mx-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new staff account with assigned role and department</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name *</Label>
              <Input
                id="user-name"
                placeholder="Enter full name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email Address *</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="user@barangaysantiago.gov.ph"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-department">Department *</Label>
              <Input
                id="user-department"
                placeholder="e.g., Documents, Administration"
                value={newUserData.department}
                onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role *</Label>
              <Select value={newUserRole} onValueChange={(v: any) => setNewUserRole(v)}>
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin - Full system access</SelectItem>
                  <SelectItem value="Official">Official - Leadership approval</SelectItem>
                  <SelectItem value="Staff">Staff - Process requests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false)
              setNewUserData({ name: "", email: "", department: "" })
              setNewUserRole("Staff")
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (newUserData.name && newUserData.email && newUserData.department) {
                handleAddUser()
              }
            }}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={() => {
        setShowEditDialog(false)
        setEditingUser(null)
      }}>
        <DialogContent className="max-w-md mx-4 md:mx-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and role assignments</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-user-name">Full Name *</Label>
              <Input
                id="edit-user-name"
                placeholder="Enter full name"
                value={editedUserData.name}
                onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-email">Email Address *</Label>
              <Input
                id="edit-user-email"
                type="email"
                placeholder="user@barangaysantiago.gov.ph"
                value={editedUserData.email}
                onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-department">Department *</Label>
              <Input
                id="edit-user-department"
                placeholder="e.g., Documents, Administration"
                value={editedUserData.department}
                onChange={(e) => setEditedUserData({ ...editedUserData, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-role">Role *</Label>
              <Select value={editedUserData.role} onValueChange={(v: any) => setEditedUserData({ ...editedUserData, role: v })}>
                <SelectTrigger id="edit-user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin - Full system access</SelectItem>
                  <SelectItem value="Official">Official - Leadership approval</SelectItem>
                  <SelectItem value="Staff">Staff - Process requests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false)
              setEditingUser(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={!editedUserData.name || !editedUserData.email || !editedUserData.department}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
