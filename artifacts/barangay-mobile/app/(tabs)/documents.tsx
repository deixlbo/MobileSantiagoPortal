import { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Modal, Platform, ActivityIndicator, Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type DocStatus = "approved" | "pending" | "processing" | "rejected" | "needs-docs" | "awaiting-payment" | "paid";
type PayMethod = "gcash" | "bank" | "cash";

interface DocRequest {
  id: string;
  type: string;
  purpose: string;
  status: DocStatus;
  date: string;
  residentName?: string;
  paymentAmount?: number;
  paymentMethod?: PayMethod;
  paymentRef?: string;
  paymentDate?: string;
}

const documentTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Clearance",
  "Certificate of Good Moral Character",
  "Cedula (Community Tax Certificate)",
];

const initialDocs: DocRequest[] = [
  { id: "doc-001", type: "Barangay Clearance", purpose: "Job application", status: "approved", date: "2026-04-01" },
];

const officialDocs: DocRequest[] = [
  { id: "doc-001", type: "Barangay Clearance", purpose: "Job application", status: "approved", date: "2026-04-01", residentName: "Juan dela Cruz" },
  { id: "doc-002", type: "Certificate of Indigency", purpose: "PhilHealth application", status: "pending", date: "2026-04-05", residentName: "Maria Santos" },
  { id: "doc-003", type: "Certificate of Residency", purpose: "School enrollment", status: "processing", date: "2026-04-07", residentName: "Pedro Reyes" },
  { id: "doc-004", type: "Business Clearance", purpose: "Sari-sari store renewal", status: "rejected", date: "2026-03-28", residentName: "Ana Ramos" },
];

const statusConfig: Record<DocStatus, { color: string; icon: string; bg: string; label: string }> = {
  approved: { color: "#16A34A", icon: "checkmark-circle", bg: "#dcfce7", label: "Approved" },
  pending: { color: "#ca8a04", icon: "time", bg: "#fef9c3", label: "Pending" },
  processing: { color: "#2563eb", icon: "sync-circle", bg: "#dbeafe", label: "Processing" },
  rejected: { color: "#dc2626", icon: "close-circle", bg: "#fee2e2", label: "Rejected" },
  "needs-docs": { color: "#7c3aed", icon: "document", bg: "#ede9fe", label: "Needs Docs" },
  "awaiting-payment": { color: "#ea580c", icon: "card", bg: "#ffedd5", label: "Pay Required" },
  paid: { color: "#0d9488", icon: "cash", bg: "#ccfbf1", label: "Paid" },
};

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function DocumentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isOfficial = user?.role === "official";

  const [docs, setDocs] = useState<DocRequest[]>([]);

  useEffect(() => {
    api.documents.list(isOfficial ? undefined : user?.uid)
      .then(data => setDocs(data as DocRequest[]))
      .catch(() => setDocs(isOfficial ? officialDocs : initialDocs));
  }, [isOfficial, user?.uid]);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPayNotifyModal, setShowPayNotifyModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocRequest | null>(null);

  const [docType, setDocType] = useState(documentTypes[0]);
  const [purpose, setPurpose] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("gcash");
  const [payRef, setPayRef] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSubmitRequest = async () => {
    if (!purpose.trim()) return;
    setLoading(true);
    try {
      const created = await api.documents.create({
        type: docType,
        purpose,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        residentId: user?.uid,
        residentName: user?.fullName,
      });
      setDocs(prev => [created as DocRequest, ...prev]);
    } catch {
      const newDoc: DocRequest = { id: `doc-${Date.now()}`, type: docType, purpose, status: "pending", date: new Date().toISOString().split("T")[0] };
      setDocs(prev => [newDoc, ...prev]);
    }
    setPurpose(""); setShowRequestModal(false); setLoading(false);
  };

  const handleNotifyPay = async () => {
    if (!selectedDoc || !payAmount) return;
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return;
    setLoading(true);
    try {
      await api.documents.update(selectedDoc.id, { status: "awaiting-payment", paymentAmount: amount });
    } catch {}
    setDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: "awaiting-payment", paymentAmount: amount } : d));
    setShowPayNotifyModal(false); setShowDetailModal(false); setPayAmount(""); setLoading(false);
  };

  const handlePay = async () => {
    if (!selectedDoc) return;
    if ((payMethod === "gcash" || payMethod === "bank") && !payRef.trim()) return;
    setLoading(true);
    const now = new Date().toISOString().split("T")[0];
    const patch = { status: "paid" as DocStatus, paymentMethod: payMethod, paymentRef: payRef || undefined, paymentDate: now };
    try {
      await api.documents.update(selectedDoc.id, patch);
    } catch {}
    setDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, ...patch } : d));
    const paid = { ...selectedDoc, ...patch };
    setSelectedDoc(paid);
    setShowPayModal(false); setPayRef(""); setShowReceiptModal(true); setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: DocStatus) => {
    try {
      await api.documents.update(id, { status });
    } catch {}
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const pendingPayCount = docs.filter(d => d.status === "awaiting-payment").length;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.sidebar, paddingTop: topPad + 12, paddingBottom: 20, paddingHorizontal: 20, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
    headerTitle: { color: colors.sidebarForeground, fontFamily: "Inter_700Bold", fontSize: 24 },
    headerSub: { color: "rgba(240,253,244,0.6)", fontFamily: "Inter_400Regular", fontSize: 13 },
    addBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 4 },
    addBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },
    content: { padding: 16, gap: 10 },
    docCard: { backgroundColor: colors.card, borderRadius: colors.radius, padding: 14, borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
    docTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.foreground },
    docSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
    statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, alignSelf: "flex-start", marginTop: 8 },
    statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
    actionRow: { flexDirection: "row", gap: 8, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
    actionBtn: { flex: 1, paddingVertical: 7, borderRadius: 6, alignItems: "center" },
    payBanner: { marginTop: 10, padding: 12, backgroundColor: "#fff7ed", borderRadius: 8, borderWidth: 1, borderColor: "#fed7aa" },
    payBannerTitle: { fontFamily: "Inter_700Bold", fontSize: 13, color: "#c2410c", marginBottom: 2 },
    payBannerAmount: { fontFamily: "Inter_700Bold", fontSize: 22, color: "#ea580c", marginBottom: 6 },
    payBannerSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: "#9a3412", marginBottom: 8 },
    payNowBtn: { backgroundColor: "#ea580c", borderRadius: 8, paddingVertical: 10, alignItems: "center" },
    payNowBtnText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 13 },
    paidBadge: { marginTop: 8, padding: 8, backgroundColor: "#ccfbf1", borderRadius: 8, borderWidth: 1, borderColor: "#99f6e4", flexDirection: "row", alignItems: "center", gap: 6 },
    paidText: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#0f766e", flex: 1 },
    empty: { alignItems: "center", paddingTop: 60, gap: 12 },
    emptyText: { fontFamily: "Inter_400Regular", fontSize: 15, color: colors.mutedForeground },
    modalContainer: { flex: 1, backgroundColor: colors.background },
    modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: colors.border },
    modalTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: colors.foreground },
    label: { fontFamily: "Inter_500Medium", fontSize: 13, color: colors.foreground, marginBottom: 6 },
    textInput: { backgroundColor: colors.card, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, padding: 14, fontFamily: "Inter_400Regular", fontSize: 14, color: colors.foreground, marginBottom: 16 },
    submitBtn: { backgroundColor: colors.primary, borderRadius: colors.radius, paddingVertical: 15, alignItems: "center" },
    submitBtnText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 },
    amountBox: { backgroundColor: "#fff7ed", borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: "#fed7aa" },
    amountLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: "#c2410c", marginBottom: 4 },
    amountValue: { fontFamily: "Inter_700Bold", fontSize: 32, color: "#ea580c" },
    methodBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, borderWidth: 2, marginBottom: 8 },
    methodLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
    methodSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
    receiptBox: { margin: 20, backgroundColor: colors.card, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: colors.border },
    receiptHeader: { alignItems: "center", marginBottom: 16 },
    receiptTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: colors.foreground, textAlign: "center", letterSpacing: 2 },
    receiptSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground, textAlign: "center" },
    receiptRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
    receiptLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground },
    receiptValue: { fontFamily: "Inter_500Medium", fontSize: 12, color: colors.foreground, textAlign: "right", flex: 1, marginLeft: 8 },
    receiptTotal: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 2, borderTopColor: colors.border },
    receiptTotalLabel: { fontFamily: "Inter_700Bold", fontSize: 14, color: colors.foreground },
    receiptTotalValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#0d9488" },
    badge: { position: "absolute", top: -4, right: -4, backgroundColor: "#ea580c", width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    badgeText: { color: "#fff", fontSize: 10, fontFamily: "Inter_700Bold" },
  });

  const payMethodConfig = [
    { id: "gcash" as PayMethod, label: "GCash", icon: "phone-portrait-outline" as IoniconsName, desc: "Pay via GCash mobile wallet", color: "#2563eb", bg: "#dbeafe" },
    { id: "bank" as PayMethod, label: "Bank Transfer", icon: "business-outline" as IoniconsName, desc: "Transfer to barangay account", color: "#7c3aed", bg: "#ede9fe" },
    { id: "cash" as PayMethod, label: "Cash", icon: "cash-outline" as IoniconsName, desc: "Pay in person at barangay hall", color: "#16A34A", bg: "#dcfce7" },
  ];

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Documents</Text>
          <Text style={s.headerSub}>{isOfficial ? `${docs.filter(d => d.status === "pending").length} pending review` : "Your requests"}</Text>
        </View>
        {!isOfficial && (
          <View>
            <TouchableOpacity style={s.addBtn} onPress={() => setShowRequestModal(true)}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={s.addBtnText}>Request</Text>
            </TouchableOpacity>
            {pendingPayCount > 0 && (
              <View style={s.badge}><Text style={s.badgeText}>{pendingPayCount}</Text></View>
            )}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {docs.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.mutedForeground + "60"} />
            <Text style={s.emptyText}>No document requests yet</Text>
            {!isOfficial && (
              <TouchableOpacity style={[s.addBtn, { paddingHorizontal: 20 }]} onPress={() => setShowRequestModal(true)}>
                <Text style={s.addBtnText}>Request a Document</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          docs.map(doc => {
            const cfg = statusConfig[doc.status];
            return (
              <View key={doc.id} style={s.docCard}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.primary + "15", justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="document-text" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.docTitle}>{doc.type}</Text>
                    {isOfficial && doc.residentName && <Text style={s.docSub}>{doc.residentName}</Text>}
                    <Text style={s.docSub}>Purpose: {doc.purpose}</Text>
                    <Text style={s.docSub}>{new Date(doc.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</Text>
                    {doc.status === "awaiting-payment" && doc.paymentAmount && (
                      <Text style={[s.docSub, { color: "#ea580c", fontFamily: "Inter_600SemiBold" }]}>Fee: ₱{doc.paymentAmount.toFixed(2)}</Text>
                    )}
                    <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
                      <Ionicons name={cfg.icon as IoniconsName} size={12} color={cfg.color} />
                      <Text style={[s.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                  </View>
                </View>

                {/* Payment Banner for Resident */}
                {!isOfficial && doc.status === "awaiting-payment" && (
                  <View style={s.payBanner}>
                    <Text style={s.payBannerTitle}>💳 Payment Required</Text>
                    <Text style={s.payBannerAmount}>��{(doc.paymentAmount ?? 0).toFixed(2)}</Text>
                    <Text style={s.payBannerSub}>The barangay office has assessed a fee. Pay to proceed.</Text>
                    <TouchableOpacity style={s.payNowBtn} onPress={() => { setSelectedDoc(doc); setShowPayModal(true); }}>
                      <Text style={s.payNowBtnText}>Pay Now (GCash / Bank / Cash)</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Paid confirmation for Resident */}
                {!isOfficial && doc.status === "paid" && (
                  <View style={s.paidBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#0d9488" />
                    <Text style={s.paidText}>Paid via {doc.paymentMethod === "gcash" ? "GCash" : doc.paymentMethod === "bank" ? "Bank" : "Cash"}</Text>
                    <TouchableOpacity onPress={() => { setSelectedDoc(doc); setShowReceiptModal(true); }}>
                      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#0d9488" }}>View Receipt</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Official Actions */}
                {isOfficial && (
                  <View style={s.actionRow}>
                    {doc.status !== "approved" && doc.status !== "rejected" && doc.status !== "awaiting-payment" && doc.status !== "paid" && (
                      <>
                        <TouchableOpacity style={[s.actionBtn, { backgroundColor: "#dcfce7" }]} onPress={() => handleUpdateStatus(doc.id, "approved")}>
                          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#16A34A" }}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.actionBtn, { backgroundColor: "#ffedd5" }]} onPress={() => { setSelectedDoc(doc); setShowPayNotifyModal(true); }}>
                          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#ea580c" }}>Notify Pay</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.actionBtn, { backgroundColor: "#fee2e2" }]} onPress={() => handleUpdateStatus(doc.id, "rejected")}>
                          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#dc2626" }}>Reject</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {doc.status === "awaiting-payment" && (
                      <TouchableOpacity style={[s.actionBtn, { flex: 1, backgroundColor: "#ffedd5" }]} onPress={() => { setSelectedDoc(doc); setShowReceiptModal(true); }}>
                        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#ea580c" }}>₱{(doc.paymentAmount ?? 0).toFixed(2)} — Awaiting Payment</Text>
                      </TouchableOpacity>
                    )}
                    {doc.status === "paid" && (
                      <TouchableOpacity style={[s.actionBtn, { flex: 1, backgroundColor: "#ccfbf1" }]} onPress={() => { setSelectedDoc(doc); setShowReceiptModal(true); }}>
                        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#0d9488" }}>View Receipt</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* New Request Modal */}
      <Modal visible={showRequestModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowRequestModal(false)}>
        <View style={s.modalContainer}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>New Document Request</Text>
            <TouchableOpacity onPress={() => setShowRequestModal(false)}><Ionicons name="close" size={24} color={colors.mutedForeground} /></TouchableOpacity>
          </View>
          <ScrollView style={{ padding: 20 }}>
            <Text style={s.label}>Document Type</Text>
            <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: "hidden" }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 6 }}>
                {documentTypes.map(dt => (
                  <TouchableOpacity key={dt} onPress={() => setDocType(dt)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: colors.radius, marginRight: 6, backgroundColor: docType === dt ? colors.primary : colors.muted }}>
                    <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: docType === dt ? "#fff" : colors.mutedForeground }}>{dt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Text style={s.label}>Purpose</Text>
            <TextInput value={purpose} onChangeText={setPurpose} placeholder="e.g., Job application, School enrollment..." placeholderTextColor={colors.mutedForeground} style={s.textInput} multiline numberOfLines={3} />
            <TouchableOpacity onPress={handleSubmitRequest} disabled={loading || !purpose.trim()} style={[s.submitBtn, { opacity: loading || !purpose.trim() ? 0.6 : 1 }]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitBtnText}>Submit Request</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Official: Notify Pay Modal */}
      <Modal visible={showPayNotifyModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPayNotifyModal(false)}>
        <View style={s.modalContainer}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Notify to Pay</Text>
            <TouchableOpacity onPress={() => setShowPayNotifyModal(false)}><Ionicons name="close" size={24} color={colors.mutedForeground} /></TouchableOpacity>
          </View>
          <View style={{ padding: 20 }}>
            {selectedDoc && <Text style={[s.label, { color: colors.mutedForeground }]}>{selectedDoc.type} · {selectedDoc.residentName ?? "Resident"}</Text>}
            <Text style={[s.label, { marginTop: 16 }]}>Fee Amount (₱)</Text>
            <TextInput value={payAmount} onChangeText={setPayAmount} placeholder="e.g., 50.00" placeholderTextColor={colors.mutedForeground} keyboardType="decimal-pad" style={s.textInput} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground, marginBottom: 16 }}>The resident will be notified to pay via GCash, bank transfer, or cash.</Text>
            <TouchableOpacity onPress={handleNotifyPay} disabled={loading || !payAmount} style={[s.submitBtn, { backgroundColor: "#ea580c", opacity: loading || !payAmount ? 0.6 : 1 }]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitBtnText}>Send Payment Notification</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Resident: Pay Modal */}
      <Modal visible={showPayModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPayModal(false)}>
        <View style={s.modalContainer}>
          <View style={s.modalHeader}>
            <View>
              <Text style={s.modalTitle}>Pay Document Fee</Text>
              {selectedDoc && <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>{selectedDoc.type}</Text>}
            </View>
            <TouchableOpacity onPress={() => setShowPayModal(false)}><Ionicons name="close" size={24} color={colors.mutedForeground} /></TouchableOpacity>
          </View>
          <ScrollView style={{ padding: 20 }}>
            {/* Amount */}
            <View style={s.amountBox}>
              <Text style={s.amountLabel}>Amount Due</Text>
              <Text style={s.amountValue}>₱{(selectedDoc?.paymentAmount ?? 0).toFixed(2)}</Text>
            </View>

            <Text style={[s.label, { marginBottom: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", fontSize: 11, color: colors.mutedForeground, letterSpacing: 1 }]}>Choose Payment Method</Text>

            {payMethodConfig.map(pm => (
              <TouchableOpacity key={pm.id} style={[s.methodBtn, { borderColor: payMethod === pm.id ? pm.color : colors.border, backgroundColor: payMethod === pm.id ? pm.bg : colors.card }]} onPress={() => setPayMethod(pm.id)}>
                <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: payMethod === pm.id ? "#fff" : colors.muted, justifyContent: "center", alignItems: "center" }}>
                  <Ionicons name={pm.icon} size={20} color={pm.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.methodLabel, { color: payMethod === pm.id ? pm.color : colors.foreground }]}>{pm.label}</Text>
                  <Text style={s.methodSub}>{pm.desc}</Text>
                </View>
                {payMethod === pm.id && <Ionicons name="checkmark-circle" size={20} color={pm.color} />}
              </TouchableOpacity>
            ))}

            {(payMethod === "gcash" || payMethod === "bank") && (
              <View style={{ marginTop: 8 }}>
                <Text style={s.label}>Reference / Transaction Number</Text>
                <TextInput value={payRef} onChangeText={setPayRef} placeholder={payMethod === "gcash" ? "e.g., 1234 5678 9012" : "e.g., TXN-20260416-XXXX"} placeholderTextColor={colors.mutedForeground} style={s.textInput} />
              </View>
            )}

            {payMethod === "cash" && (
              <View style={{ backgroundColor: "#dcfce7", borderRadius: 8, padding: 12, marginTop: 8, marginBottom: 16, borderWidth: 1, borderColor: "#bbf7d0" }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#15803d" }}>Cash Payment</Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#166534", marginTop: 4 }}>Visit the barangay hall and pay to the collection officer. A receipt will be issued upon payment.</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handlePay}
              disabled={loading || ((payMethod === "gcash" || payMethod === "bank") && !payRef.trim())}
              style={[s.submitBtn, { marginTop: 8, opacity: loading || ((payMethod === "gcash" || payMethod === "bank") && !payRef.trim()) ? 0.6 : 1 }]}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitBtnText}>Confirm Payment</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Receipt Modal */}
      <Modal visible={showReceiptModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowReceiptModal(false)}>
        <View style={s.modalContainer}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Payment Receipt</Text>
            <TouchableOpacity onPress={() => setShowReceiptModal(false)}><Ionicons name="close" size={24} color={colors.mutedForeground} /></TouchableOpacity>
          </View>
          <ScrollView>
            <View style={s.receiptBox}>
              <View style={s.receiptHeader}>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground }}>Republic of the Philippines</Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground }}>Province of Zambales · Municipality of San Antonio</Text>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.foreground, marginTop: 4 }}>BARANGAY SANTIAGO SAZ</Text>
                <View style={{ height: 2, backgroundColor: colors.foreground, width: "100%", marginVertical: 10 }} />
                <Text style={s.receiptTitle}>OFFICIAL RECEIPT</Text>
                <Text style={s.receiptSub}>{`OR-${(selectedDoc?.id ?? "").replace("doc-", "").toUpperCase()}`}</Text>
              </View>

              {[
                { label: "Received from", value: user?.fullName ?? "Resident" },
                { label: "Document Type", value: selectedDoc?.type ?? "" },
                { label: "Purpose", value: selectedDoc?.purpose ?? "" },
                { label: "Date Paid", value: selectedDoc?.paymentDate ? new Date(selectedDoc.paymentDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) : "" },
                { label: "Payment Method", value: selectedDoc?.paymentMethod === "gcash" ? "GCash" : selectedDoc?.paymentMethod === "bank" ? "Bank Transfer" : "Cash" },
                ...(selectedDoc?.paymentRef ? [{ label: "Reference No.", value: selectedDoc.paymentRef }] : []),
              ].map((item, i) => (
                <View key={i} style={s.receiptRow}>
                  <Text style={s.receiptLabel}>{item.label}</Text>
                  <Text style={s.receiptValue}>{item.value}</Text>
                </View>
              ))}

              <View style={s.receiptTotal}>
                <Text style={s.receiptTotalLabel}>Total Amount Paid</Text>
                <Text style={s.receiptTotalValue}>₱{(selectedDoc?.paymentAmount ?? 0).toFixed(2)}</Text>
              </View>

              <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border, alignItems: "center" }}>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 13, color: colors.foreground }}>HON. ROLANDO C. BORJA</Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}>Punong Barangay / Authorized Collecting Officer</Text>
              </View>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: colors.mutedForeground, textAlign: "center", marginTop: 12 }}>Official receipt of Barangay Santiago Saz</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
