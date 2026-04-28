import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import DocumentsPublic from "@/pages/documents";

import Dashboard from "@/pages/admin/dashboard";
import Residents from "@/pages/admin/residents";
import Blotter from "@/pages/admin/blotter";
import Projects from "@/pages/admin/projects";
import Announcements from "@/pages/admin/announcements";
import Ordinances from "@/pages/admin/ordinances";
import DocumentsAdmin from "@/pages/admin/documents";
import Assets from "@/pages/admin/assets";
import Settings from "@/pages/admin/settings";

import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AdminRoute({ component: Component, ...rest }: any) {
  const [location, setLocation] = useLocation();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAdminAuth");
    if (!auth) {
      setLocation("/login");
    } else {
      setIsAuth(true);
    }
  }, [location, setLocation]);

  if (!isAuth) return null;

  return <Route {...rest} component={Component} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/documents" component={DocumentsPublic} />
      
      <AdminRoute path="/admin" component={Dashboard} />
      <AdminRoute path="/admin/residents" component={Residents} />
      <AdminRoute path="/admin/blotter" component={Blotter} />
      <AdminRoute path="/admin/projects" component={Projects} />
      <AdminRoute path="/admin/announcements" component={Announcements} />
      <AdminRoute path="/admin/ordinances" component={Ordinances} />
      <AdminRoute path="/admin/documents" component={DocumentsAdmin} />
      <AdminRoute path="/admin/assets" component={Assets} />
      <AdminRoute path="/admin/settings" component={Settings} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
