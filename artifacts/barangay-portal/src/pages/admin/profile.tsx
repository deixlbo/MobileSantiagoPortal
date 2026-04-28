import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "Hon. Roberto S. Dela Cruz",
    title: "Punong Barangay",
    email: "admin@santiago.gov.ph",
    phone: "09123456789",
    address: "Barangay Hall, Purok 1",
  });

  useEffect(() => {
    const saved = localStorage.getItem("adminProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
    toast.success("Profile saved successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-700 p-4 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Active Admin Session</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Profile</h2>
          <p className="text-muted-foreground">Manage your official information and session details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your public official details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                    <AvatarImage src="/official-1.png" alt={profile.name} className="object-cover" />
                    <AvatarFallback className="text-2xl">RD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG or PNG up to 5MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={profile.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="title">Official Title</Label>
                    <Input id="title" name="title" value={profile.title} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Office Address</Label>
                    <Input id="address" name="address" value={profile.address} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="px-8">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your current session details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Active Sessions</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="font-medium">Today, 08:30 AM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Online
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
