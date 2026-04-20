import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { PortalLayout } from "@/components/portal/portal-layout";
import { Chatbot } from "@/components/chatbot/chatbot";
import NotFound from "@/pages/not-found";

// Public pages
import LandingPage from "@/pages/landing";
import ResidentLoginPage from "@/pages/login/resident-login";
import OfficialLoginPage from "@/pages/login/official-login";
import AdminLoginPage from "@/pages/login/admin-login";
import RegisterPage from "@/pages/register-new";

// Resident portal pages
import ResidentDashboard from "@/pages/resident/dashboard";
import ResidentDocumentsPage from "@/pages/resident/documents";
import ResidentAnnouncementsPage from "@/pages/resident/announcements";
import ResidentBlotterPage from "@/pages/resident/blotter";
import ResidentProfilePage from "@/pages/resident/profile";
import ResidentOrdinancesPage from "@/pages/resident/ordinances";

// Admin portal pages
import AdminDashboard from "@/pages/admin/dashboard";

// Official portal pages
import OfficialDashboard from "@/pages/official/dashboard";
import OfficialDocumentsPage from "@/pages/official/documents";
import OfficialBlotterPage from "@/pages/official/blotter";
import OfficialResidentsPage from "@/pages/official/residents";
import OfficialProjectsPage from "@/pages/official/projects";
import OfficialAnnouncementsPage from "@/pages/official/announcements";
import OfficialAssetsPage from "@/pages/official/assets";
import OfficialOrdinancesPage from "@/pages/official/ordinances";
import OfficialBusinessesPage from "@/pages/official/businesses";
import OfficialProfilePage from "@/pages/official/profile";

const queryClient = new QueryClient();

function RequireAuth({ role, children }: { role?: "admin" | "resident" | "official"; children: React.ReactNode }) {
  const { user, userData } = useAuth();
  const [location] = useLocation();

  if (!user) {
    const loginPath = role === "official" ? "/login/official" : role === "admin" ? "/login/admin" : "/login/resident";
    return <Redirect to={loginPath} />;
  }

  if (role && userData?.role !== role) {
    return <Redirect to={userData?.role === "admin" ? "/admin/dashboard" : userData?.role === "official" ? "/official/dashboard" : "/resident/dashboard"} />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/login/resident" component={ResidentLoginPage} />
      <Route path="/login/official" component={OfficialLoginPage} />
      <Route path="/login/admin" component={AdminLoginPage} />
      <Route path="/register" component={RegisterPage} />

      {/* Admin portal routes */}
      <Route path="/admin/dashboard">
        <RequireAuth role="admin">
          <AdminDashboard />
        </RequireAuth>
      </Route>

      {/* Resident portal routes */}
      <Route path="/resident/dashboard">
        <RequireAuth role="resident">
          <PortalLayout><ResidentDashboard /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/resident/documents">
        <RequireAuth role="resident">
          <PortalLayout><ResidentDocumentsPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/resident/announcements">
        <RequireAuth role="resident">
          <PortalLayout><ResidentAnnouncementsPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/resident/blotter">
        <RequireAuth role="resident">
          <PortalLayout><ResidentBlotterPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/resident/profile">
        <RequireAuth role="resident">
          <PortalLayout><ResidentProfilePage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/resident/ordinances">
        <RequireAuth role="resident">
          <PortalLayout><ResidentOrdinancesPage /></PortalLayout>
        </RequireAuth>
      </Route>

      {/* Official portal routes */}
      <Route path="/official/dashboard">
        <RequireAuth role="official">
          <PortalLayout><OfficialDashboard /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/documents">
        <RequireAuth role="official">
          <PortalLayout><OfficialDocumentsPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/blotter">
        <RequireAuth role="official">
          <PortalLayout><OfficialBlotterPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/residents">
        <RequireAuth role="official">
          <PortalLayout><OfficialResidentsPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/projects">
        <RequireAuth role="official">
          <PortalLayout><OfficialProjectsPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/announcements">
        <RequireAuth role="official">
          <PortalLayout><OfficialAnnouncementsPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/assets">
        <RequireAuth role="official">
          <PortalLayout><OfficialAssetsPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/ordinances">
        <RequireAuth role="official">
          <PortalLayout><OfficialOrdinancesPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/businesses">
        <RequireAuth role="official">
          <PortalLayout><OfficialBusinessesPage /></PortalLayout>
        </RequireAuth>
      </Route>
      <Route path="/official/profile">
        <RequireAuth role="official">
          <PortalLayout><OfficialProfilePage /></PortalLayout>
        </RequireAuth>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
          <Chatbot />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
