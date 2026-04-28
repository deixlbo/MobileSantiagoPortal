import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  useLookupResidentByEmail,
  getLookupResidentByEmailQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/public-layout";

export default function ResidentLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // use query but don't enable it automatically, only trigger it on submit
  // To keep it simple, we'll just use the fetcher directly or enable it conditionally
  // Wait, orval hook uses useQuery, we can use enabled: false and refetch
  const { refetch, isFetching } = useLookupResidentByEmail(
    { email },
    {
      query: {
        enabled: false,
        retry: false,
        queryKey: getLookupResidentByEmailQueryKey({ email }),
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    try {
      const { data: resident, isError, error } = await refetch();
      if (!resident || isError) {
        toast.error("No resident found with that email — please register.");
      } else if (resident.status === "pending") {
        toast.info("Your account is awaiting admin verification.");
      } else if (resident.status === "active") {
        localStorage.setItem("residentId", String(resident.id));
        localStorage.setItem("residentEmail", resident.email);
        toast.success(`Welcome back, ${resident.fullName}`);
        setLocation("/resident");
      } else {
        toast.error("Your account is inactive.");
      }
    } catch (err) {
      toast.error("Error logging in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("juan.delacruz@email.com");
  };

  return (
    <PublicLayout>
      <div className="flex-1 flex items-center justify-center p-4 py-20 bg-muted/20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Resident Portal</h1>
            <p className="text-muted-foreground mt-2">Sign in to access digital barangay services.</p>
          </div>

          <Card className="border-border/50 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription>
                Enter your registered email address
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs text-muted-foreground"
                  onClick={handleDemoFill}
                >
                  Quick Fill: juan.delacruz@email.com (Demo)
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting || isFetching}>
                  {isSubmitting || isFetching ? "Signing in..." : "Sign In"}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account? <Link href="/register" className="text-primary hover:underline">Register here</Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
