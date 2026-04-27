import { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Modal, Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

type BlotterStatus = "reported" | "investigating" | "mediation" | "resolved" | "escalated";

interface BlotterCase {
  id: string;
  incidentType: string;
  location: string;
  date: string;
  time: string;
  description: string;
  status: BlotterStatus;
  reportedBy: string;
}

const initialCases: BlotterCase[] = [
  {
    id: "BLT-0031",
    incidentType: "Noise Complaint",
    location: "Purok 1 - Mabini",
    date: "2026-04-01",
    time: "14:30",
    description: "Loud music from neighbor's house disturbing peace.",
    status: "investigating",
    reportedBy: "Juan dela Cruz",
  },
];

const allCases: BlotterCase[] = [
  { id: "BLT-0031", incidentType: "Noise Complaint", location: "Purok 1", date: "2026-04-01", time: "14:30", description: "Loud music from neighbor.", status: "investigating", reportedBy: "Juan dela Cruz" },
  { id: "BLT-0030", incidentType: "Property Dispute", location: "Purok 2", date: "2026-03-28", time: "09:15", description: "Boundary dispute with neighbor.", status: "mediation", reportedBy: "Maria Santos" },
  { id: "BLT-0029", incidentType: "Theft", location: "Purok 3", date: "2026-03-25", time: "22:45", description: "Motorcycle stolen from residence.", status: "reported", reportedBy: "Ana Torres" },
  { id: "BLT-0028", incidentType: "Verbal Abuse", location: "Purok 4", date: "2026-03-20", time: "11:00", description: "Verbal altercation in the marketplace.", status: "resolved", reportedBy: "Rosa Magtoto" },
];

const statusConfig: Record<BlotterStatus, { color: string; bg: string }> = {
  reported: { color: "#6b7280", bg: "#f3f4f6" },
  investigating: { color: "#2563eb", bg: "#dbeafe" },
  mediation: { color: "#ca8a04", bg: "#fef9c3" },
  resolved: { color: "#16A34A", bg: "#dcfce7" },
  escalated: { color: "#dc2626", bg: "#fee2e2" },
};

const incidentTypes = [
  "Noise Complaint", "Property Dispute", "Physical Altercation",
  "Verbal Abuse", "Theft/Burglary", "Vandalism", "Domestic Issue", "Others"
];

export default function BlotterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isOfficial = user?.role === "official";

  const [cases, setCases] = useState<BlotterCase[]>(isOfficial ? allCases : initialCases);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    incidentType: incidentTypes[0],
    location: "",
    description: "",
    respondent: "",
    time: new Date().toTimeString().slice(0, 5),
  });

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSubmit = async () => {
    if (!form.location.trim() || !form.description.trim()) return;
    const newCase: BlotterCase = {
      id: `BLT-00${32 + cases.length}`,
      incidentType: form.incidentType,
      location: form.location,
      date: new Date().toISOString().split("T")[0],
      time: form.time,
      description: form.description,
      status: "reported",
      reportedBy: user?.fullName ?? "Resident",
    };
    setCases(prev => [newCase, ...prev]);
    setShowModal(false);
    setForm({ incidentType: incidentTypes[0], location: "", description: "", respondent: "", time: new Date().toTimeString().slice(0, 5) });
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.sidebar,
      paddingTop: topPad + 12,
      paddingBottom: 20,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    headerTitle: { color: colors.sidebarForeground, fontFamily: "Inter_700Bold", fontSize: 24 },
    headerSub: { color: "rgba(240,253,244,0.6)", fontFamily: "Inter_400Regular", fontSize: 13 },
    addBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    addBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },
    content: { padding: 16, gap: 10 },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    cardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
    caseId: { fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground },
    caseType: { fontFamily: "Inter_700Bold", fontSize: 15, color: colors.foreground },
    desc: { fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground },
    meta: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    metaText: { fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11, textTransform: "capitalize" },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Blotter</Text>
          <Text style={s.headerSub}>{isOfficial ? `${cases.filter(c => c.status !== "resolved").length} active cases` : "My reports"}</Text>
        </View>
        {!isOfficial && (
          <TouchableOpacity style={s.addBtn} onPress={() => setShowModal(true)} testID="button-file-blotter">
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={s.addBtnText}>File Report</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {cases.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <Ionicons name="clipboard-outline" size={48} color={colors.mutedForeground + "60"} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: colors.mutedForeground }}>No blotter reports filed</Text>
            {!isOfficial && (
              <TouchableOpacity style={[s.addBtn, { paddingHorizontal: 20 }]} onPress={() => setShowModal(true)}>
                <Text style={s.addBtnText}>File a Report</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          cases.map(c => {
            const cfg = statusConfig[c.status];
            return (
              <View key={c.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.caseId}>{c.id} · {new Date(c.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</Text>
                    <Text style={s.caseType}>{c.incidentType}</Text>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[s.statusText, { color: cfg.color }]}>{c.status}</Text>
                  </View>
                </View>
                <Text style={s.desc} numberOfLines={2}>{c.description}</Text>
                <View style={s.meta}>
                  <View style={s.metaItem}>
                    <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
                    <Text style={s.metaText}>{c.location}</Text>
                  </View>
                  <View style={s.metaItem}>
                    <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
                    <Text style={s.metaText}>{c.time}</Text>
                  </View>
                  {isOfficial && (
                    <View style={s.metaItem}>
                      <Ionicons name="person-outline" size={12} color={colors.mutedForeground} />
                      <Text style={s.metaText}>{c.reportedBy}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Report Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModal(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: colors.foreground }}>File Blotter Report</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {[
              { label: "Incident Type", isSelect: true },
              { label: "Location", placeholder: "Where did it happen?", key: "location" as const },
              { label: "Respondent (Optional)", placeholder: "Person involved (if known)", key: "respondent" as const },
              { label: "Description", placeholder: "Describe what happened...", key: "description" as const, multiline: true },
            ].map((field, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.foreground, marginBottom: 6 }}>{field.label}</Text>
                {field.isSelect ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      {incidentTypes.map(it => (
                        <TouchableOpacity
                          key={it}
                          onPress={() => setForm(p => ({ ...p, incidentType: it }))}
                          style={{
                            paddingHorizontal: 12, paddingVertical: 8, borderRadius: colors.radius,
                            backgroundColor: form.incidentType === it ? colors.primary : colors.muted,
                          }}
                        >
                          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: form.incidentType === it ? "#fff" : colors.mutedForeground }}>{it}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <TextInput
                    value={form[field.key as keyof typeof form]}
                    onChangeText={v => setForm(p => ({ ...p, [field.key!]: v }))}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.mutedForeground}
                    style={{
                      backgroundColor: colors.card, borderRadius: colors.radius,
                      borderWidth: 1, borderColor: colors.border, padding: 12,
                      fontFamily: "Inter_400Regular", fontSize: 14, color: colors.foreground,
                      minHeight: field.multiline ? 80 : undefined, textAlignVertical: field.multiline ? "top" : "center",
                    }}
                    multiline={field.multiline}
                    testID={`input-${field.key}`}
                  />
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!form.location.trim() || !form.description.trim()}
              style={{
                backgroundColor: colors.primary, borderRadius: colors.radius, paddingVertical: 15,
                alignItems: "center", opacity: !form.location.trim() || !form.description.trim() ? 0.5 : 1, marginTop: 8,
              }}
              testID="button-submit-blotter"
            >
              <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 }}>Submit Report</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
