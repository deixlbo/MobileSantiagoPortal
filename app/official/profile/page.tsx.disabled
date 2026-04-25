'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";
import { Mail, Phone, User } from "lucide-react";

export default function OfficialProfilePage() {
  const { userData } = useAuth();
  const [officials, setOfficials] = useState<any[]>([]);

  useEffect(() => {
    api.users.list().then(users => setOfficials(users.filter(u => u.role === "official"))).catch(console.error);
  }, []);

  const officialInfo = officials.find(o => o.email === userData?.email);

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="My Profile" description="Official account information" onMenuClick={toggle} />

      <div className="p-4 sm:p-6 space-y-5">
        <Card className="p-6">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-24 h-24 rounded-full bg-sidebar/10 border-4 border-sidebar/20 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/santiago.jpg"
                alt="Official"
                className="w-full h-full object-cover"
                onError={e => {
                  const t = e.currentTarget as HTMLImageElement;
                  t.style.display = "none";
                  const p = t.parentElement;
                  if (p) p.innerHTML = `<span style="font-size:2.5rem;font-weight:700;color:#1a6b3c;">${(userData?.fullName ?? "O").replace(/^(Hon\.|Dr\.)\s*/i,"").charAt(0)}</span>`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground">{userData?.fullName}</h2>
              <p className="text-muted-foreground text-sm">{officialInfo?.fullName ? "Barangay Official" : "Barangay Official"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-sidebar/10 text-sidebar border border-sidebar/20">
                  Official
                </span>
                <span className="text-xs text-muted-foreground">Barangay Santiago Saz</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <User className="w-4 h-4" />, label: "Full Name", value: userData?.fullName },
              { icon: <User className="w-4 h-4" />, label: "Role", value: "Barangay Official" },
              { icon: <Mail className="w-4 h-4" />, label: "Official Email", value: userData?.email },
              { icon: <Phone className="w-4 h-4" />, label: "Phone", value: userData?.phone ?? "—" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <span className="text-primary mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Barangay Santiago Saz Officials</h3>
          <div className="space-y-3">
            {officials.map(o => (
              <div key={o.id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{o.fullName.replace(/^(Hon\.|Dr\.)\s*/i,"").charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{o.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{o.email}</p>
                </div>
                {o.email === userData?.email && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">You</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
