import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft, UserPlus, CheckCircle2, Eye, EyeOff, AlertCircle, Users, Shield
} from "lucide-react";
import { registerUser } from "@/lib/auth-service";

const PUROKS = [
  "Purok 1 - Saranay", "Purok 2 - Kaunlaran", "Purok 3 - Bonifacio",
  "Purok 4 - Pagkakaisa", "Purok 5 - Maligaya", "Purok 6 - Masagana",
];

const POSITIONS = [
  "Barangay Captain", "Barangay Secretary", "Barangay Treasurer",
  "Barangay Councilor", "Barangay Health Worker", "Barangay Tanod",
];

type Step = "type" | "form" | "success";
type UserType = "resident" | "official" | null;

export default function RegisterNewPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("type");
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    purok: PUROKS[0],
    position: POSITIONS[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const e: Record<string, string> = {};
    
    if (!form.fullName.trim()) {
      e.fullName = "Full name is required";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Valid email is required";
    }
    if (!form.contactNumber.trim()) {
      e.contactNumber = "Contact number is required";
    }
    if (!form.password || form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setError("");
    setLoading(true);

    try {
      await registerUser({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        contactNumber: form.contactNumber,
        userType: userType as "resident" | "official",
        purok: userType === "resident" ? form.purok : undefined,
        position: userType === "official" ? form.position : undefined,
      });

      setStep("success");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setField = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) {
      setErrors(p => { const n = { ...p }; delete n[k]; return n; });
    }
  };

  // Step 1: Select user type
  if (step === "type") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-primary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fadeUp">
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <Card className="p-8 shadow-xl border-primary/20">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">Select your account type</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setUserType("resident");
                  setStep("form");
                }}
                className="w-full p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">Resident Account</h3>
                    <p className="text-sm text-muted-foreground">Request documents and services</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setUserType("official");
                  setStep("form");
                }}
                className="w-full p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">Official Account</h3>
                    <p className="text-sm text-muted-foreground">Manage barangay operations</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                Both account types require approval from a barangay official before you can access the portal.
              </p>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login/resident" className="text-primary hover:text-primary/90 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Registration form
  if (step === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-primary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fadeUp">
          <button
            onClick={() => setStep("type")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <Card className="p-8 shadow-xl border-primary/20">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {userType === "resident" ? <Users className="w-6 h-6 text-primary" /> : <Shield className="w-6 h-6 text-primary" />}
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Register as {userType === "resident" ? "Resident" : "Official"}</h1>
              <p className="text-muted-foreground text-sm">Fill in your details below</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 border-input focus:border-primary"
                  disabled={loading}
                />
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 border-input focus:border-primary"
                  disabled={loading}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <Label htmlFor="contactNumber" className="text-foreground">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={form.contactNumber}
                  onChange={(e) => setField("contactNumber", e.target.value)}
                  placeholder="09123456789"
                  className="mt-1 border-input focus:border-primary"
                  disabled={loading}
                />
                {errors.contactNumber && <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>}
              </div>

              {/* Purok (for residents) */}
              {userType === "resident" && (
                <div>
                  <Label htmlFor="purok" className="text-foreground">Purok</Label>
                  <select
                    id="purok"
                    value={form.purok}
                    onChange={(e) => setField("purok", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background focus:border-primary focus:outline-none"
                    disabled={loading}
                  >
                    {PUROKS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Position (for officials) */}
              {userType === "official" && (
                <div>
                  <Label htmlFor="position" className="text-foreground">Position *</Label>
                  <select
                    id="position"
                    value={form.position}
                    onChange={(e) => setField("position", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background focus:border-primary focus:outline-none"
                    disabled={loading}
                  >
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-foreground">Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="At least 8 characters"
                    className="border-input focus:border-primary pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  placeholder="Re-enter your password"
                  className="mt-1 border-input focus:border-primary"
                  disabled={loading}
                />
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Step 3: Success
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeUp">
        <Card className="p-8 text-center shadow-xl border-primary/20">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Account Created!</h1>
          <p className="text-muted-foreground mb-6">
            Your account has been created successfully. Please wait for a barangay official to approve your registration before you can log in.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>What&apos;s next?</strong> Check your email for updates on your account status. This typically takes 1-2 business days.
            </p>
          </div>

          <Link href="/">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Return to Home
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login/resident" className="text-primary hover:text-primary/90 font-medium">
              Sign in instead
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
