import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Eye, EyeOff, AlertCircle, Shield, ArrowLeft, UserPlus, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ResidentLoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      setLocation("/resident/dashboard");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeUp">
        <Link href="/">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </Link>
        <Card className="p-8 border-primary/20 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20 overflow-hidden mx-auto mb-4">
              <img src="/santiago.jpg" alt="Barangay Santiago Saz" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Barangay Santiago</h1>
            <p className="text-muted-foreground text-sm mt-1">Resident Portal</p>
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 rounded-lg mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Resident Login</span>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm animate-fadeUp" data-testid="error-login">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 border-input focus:border-primary"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  data-testid="input-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-input focus:border-primary pr-10"
                  required
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
              data-testid="button-submit-login"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in as Resident"
              )}
            </Button>
          </form>



          <div className="mt-4 space-y-3">
            <Link href="/register">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 transition text-sm font-medium">
                <UserPlus className="w-4 h-4" /> Create a Resident Account
              </button>
            </Link>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>New registrations require barangay official approval before you can log in.</span>
            </div>

            <div className="text-center">
              <Link href="/login/official">
                <button className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1 mx-auto">
                  <Shield className="w-3.5 h-3.5" /> Login as Official instead
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
