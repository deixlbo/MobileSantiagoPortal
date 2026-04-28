import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Stub Auth
    localStorage.setItem("isAdminAuth", "true");
    setLocation("/admin");
  };

  return (
    <PublicLayout>
      <div className="flex-1 flex items-center justify-center p-4 py-20 bg-muted/20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Official Portal</h1>
            <p className="text-muted-foreground mt-2">Sign in to access the Barangay Admin Dashboard</p>
          </div>

          <Card className="border-border/50 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl">Admin Authentication</CardTitle>
              <CardDescription>
                Authorized personnel only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="admin@santiago.gov.ph" required defaultValue="admin@santiago.gov.ph" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required defaultValue="password123" />
                </div>
                <Button type="submit" className="w-full mt-6 h-11 text-base font-medium">
                  Continue as Admin
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  (This is a stub auth. Clicking continue will log you in.)
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
