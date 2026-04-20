import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users, CheckCircle2, X, Plus, Mail, Phone, UserCheck, Trash2, Edit2, Eye
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getPendingUsers, approveUser, rejectUser, deleteUser, getAllUsers } from "@/lib/admin-service";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { userData, user } = useAuth();
  const [, navigate] = useLocation();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });
  const [approveConfirm, setApproveConfirm] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });
  const [rejectConfirm, setRejectConfirm] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });

  // Protect route - only admins can access
  useEffect(() => {
    if (userData && userData.role !== "admin") {
      navigate("/");
    }
  }, [userData, navigate]);

  // Load pending users
  useEffect(() => {
    loadPendingUsers();
    loadAllUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      const users = await getPendingUsers();
      setPendingUsers(users);
    } catch (error) {
      console.error("Failed to load pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Failed to load all users:", error);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId);
      setPendingUsers(pendingUsers.filter((u) => u.id !== userId));
      loadAllUsers();
      setApproveConfirm({ open: false, userId: null });
    } catch (error) {
      console.error("Failed to approve user:", error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await rejectUser(userId);
      setPendingUsers(pendingUsers.filter((u) => u.id !== userId));
      loadAllUsers();
      setRejectConfirm({ open: false, userId: null });
    } catch (error) {
      console.error("Failed to reject user:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      setPendingUsers(pendingUsers.filter((u) => u.id !== userId));
      setAllUsers(allUsers.filter((u) => u.id !== userId));
      setDeleteConfirm({ open: false, userId: null });
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage user accounts and approvals</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Logged in as: {user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Users</p>
                <p className="text-2xl font-bold text-foreground">{pendingUsers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">{allUsers.filter((u) => u.status === "active").length}</p>
              </div>
            </div>
          </Card>

          <Card className="border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{allUsers.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "pending" ? "default" : "outline"}
            onClick={() => setActiveTab("pending")}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Pending Approvals ({pendingUsers.length})
          </Button>
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            All Users ({allUsers.length})
          </Button>
        </div>

        {/* Pending Users Tab */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {loading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Loading pending users...</p>
              </Card>
            ) : pendingUsers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No pending users awaiting approval</p>
              </Card>
            ) : (
              pendingUsers.map((user) => (
                <Card key={user.id} className="border-border/50 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{user.fullName}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700">
                          {user.userType}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.contactNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {user.contactNumber}
                          </div>
                        )}
                        {user.userType === "resident" && user.residentData?.purok && (
                          <div className="text-sm">Purok: {user.residentData.purok}</div>
                        )}
                        {user.userType === "official" && user.officialData?.position && (
                          <div className="text-sm">Position: {user.officialData.position}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                        onClick={() => setApproveConfirm({ open: true, userId: user.id })}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-500/50 hover:bg-red-50"
                        onClick={() => setRejectConfirm({ open: true, userId: user.id })}
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Reject</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* All Users Tab */}
        {activeTab === "all" && (
          <div className="space-y-4">
            {loading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Loading all users...</p>
              </Card>
            ) : allUsers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No users found</p>
              </Card>
            ) : (
              allUsers.map((user) => (
                <Card key={user.id} className="border-border/50 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{user.fullName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active" 
                            ? "bg-green-500/10 text-green-700"
                            : user.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-700"
                            : "bg-red-500/10 text-red-700"
                        }`}>
                          {user.status}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700">
                          {user.userType}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.contactNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {user.contactNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-500/50 hover:bg-red-50"
                        onClick={() => setDeleteConfirm({ open: true, userId: user.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveConfirm.open} onOpenChange={() => setApproveConfirm({ open: false, userId: null })}>
        <AlertDialogContent>
          <AlertDialogTitle>Approve User</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to approve this user account? They will be able to access the portal immediately.</AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={() => approveConfirm.userId && handleApprove(approveConfirm.userId)}
            >
              Approve
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectConfirm.open} onOpenChange={() => setRejectConfirm({ open: false, userId: null })}>
        <AlertDialogContent>
          <AlertDialogTitle>Reject User</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to reject this user application? They will not be able to access the portal.</AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => rejectConfirm.userId && handleReject(rejectConfirm.userId)}
            >
              Reject
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={() => setDeleteConfirm({ open: false, userId: null })}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this user account? This action cannot be undone.</AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteConfirm.userId && handleDelete(deleteConfirm.userId)}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
