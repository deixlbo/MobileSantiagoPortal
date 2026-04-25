'use client';

import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";
import { User, Phone, MapPin, Mail, Shield, IdCard, Calendar } from "lucide-react";

export default function ResidentProfilePage() {
  const { userData } = useAuth();

  const infoItems = [
    { icon: <User className="w-4 h-4" />, label: "Full Name", value: userData?.fullName ?? "—" },
    { icon: <Mail className="w-4 h-4" />, label: "Email Address", value: userData?.email ?? "—" },
    { icon: <Phone className="w-4 h-4" />, label: "Phone Number", value: userData?.phone ?? "Not provided" },
    { icon: <MapPin className="w-4 h-4" />, label: "Address", value: userData?.address ?? "Not provided" },
    { icon: <IdCard className="w-4 h-4" />, label: "Resident ID", value: userData?.uid ?? "—" },
    { icon: <Shield className="w-4 h-4" />, label: "Account Role", value: "Resident" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="My Profile" description="Your personal information" onMenuClick={toggle} />

      <div className="p-4 sm:p-6 space-y-5">
        {/* Avatar & Name Banner */}
        <Card className="p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold text-primary">{userData?.fullName?.charAt(0) ?? "R"}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{userData?.fullName}</h2>
              <p className="text-muted-foreground text-sm">{userData?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <Shield className="w-3 h-3" /> Verified Resident
                </span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {infoItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                <span className="text-primary mt-0.5 shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notice */}
        <Card className="p-5 border-primary/20 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-3">Important Information</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span>
              Your profile information is used for all document requests and official communications.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span>
              Ensure your address matches your barangay record for proper document processing.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span>
              For profile updates or corrections (name change, address update, etc.), please visit the Barangay Hall with a valid ID.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">•</span>
              Office hours: Monday to Friday, 8:00 AM – 5:00 PM.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
