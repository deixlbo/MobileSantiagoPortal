import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, UserPlus } from "lucide-react";
import { useCreateResident } from "@workspace/api-client-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Register() {
  const [success, setSuccess] = useState(false);
  const createResident = useCreateResident();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createResident.mutate({
      data: {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        purok: formData.get("purok") as string,
        gender: formData.get("gender") as string,
        civilStatus: formData.get("civilStatus") as string,
        birthDate: formData.get("birthDate") as string,
        address: formData.get("address") as string,
        status: "pending",
        documentType: "National ID", // Default visual
      }
    }, {
      onSuccess: () => {
        setSuccess(true);
        toast.success("Registration submitted successfully");
      },
      onError: () => {
        toast.error("Failed to submit registration");
      }
    });
  };

  return (
    <PublicLayout>
      <div className="flex-1 flex items-center justify-center p-4 py-12 md:py-20 bg-muted/20">
        <div className="w-full max-w-2xl">
          
          {success ? (
            <Card className="text-center py-12 border-primary/20 shadow-lg shadow-primary/5">
              <CardContent className="space-y-6 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Registration Submitted!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your resident registration is now pending review by the barangay staff. You will receive an email once your account is activated.
                  </p>
                </div>
                <Button onClick={() => window.location.href = '/'} variant="outline" className="mt-4">
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Resident Registration</h1>
                <p className="text-muted-foreground mt-2">Create your official citizen account to access digital services.</p>
              </div>

              <Card className="border-border/50 shadow-xl shadow-primary/5">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6 pt-6">
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" name="fullName" placeholder="Juan Dela Cruz" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthDate">Birth Date</Label>
                          <Input id="birthDate" name="birthDate" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select name="gender" defaultValue="Male">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="civilStatus">Civil Status</Label>
                          <Select name="civilStatus" defaultValue="Single">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Widowed">Widowed</SelectItem>
                              <SelectItem value="Divorced">Divorced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Contact & Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" name="email" type="email" placeholder="juan@example.com" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" placeholder="09123456789" required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Detailed Address</Label>
                          <Input id="address" name="address" placeholder="House No., Street Name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purok">Purok</Label>
                          <Select name="purok" defaultValue="Purok 1">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 7 }).map((_, i) => (
                                <SelectItem key={`purok-${i+1}`} value={`Purok ${i+1}`}>Purok {i+1}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password (for Portal Login)</Label>
                          <Input id="password" name="password" type="password" required />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Verification</h3>
                      <div className="space-y-2">
                        <Label>Upload Valid ID</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                          <UserPlus className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                  <CardFooter className="bg-muted/30 border-t p-6 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground max-w-sm">
                      By submitting this form, you certify that the information provided is true and correct.
                    </p>
                    <Button type="submit" className="px-8" disabled={createResident.isPending}>
                      {createResident.isPending ? "Submitting..." : "Submit Registration"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
