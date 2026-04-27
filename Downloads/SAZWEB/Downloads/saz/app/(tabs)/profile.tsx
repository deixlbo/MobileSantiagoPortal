import { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Alert, Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

const barangayOfficials = [
  { name: "Hon. Rolando C. Borja", position: "Barangay Captain" },
  { name: "Sec. Maria D. Santos", position: "Barangay Secretary" },
  { name: "Hon. Jose L. Reyes", position: "Councilor" },
  { name: "Hon. Ana Maria Reyes", position: "Councilor" },
  { name: "Hon. Mark Santos", position: "Councilor" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone ?? "09123456789");
  const [address, setAddress] = useState(user?.address ?? "Purok 1, Barangay Santiago");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: async () => { await logout(); router.replace("/login"); } },
      ]
    );
  };

  const handleSave = () => {
    setEditing(false);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.sidebar,
      paddingTop: topPad + 12,
      paddingBottom: 32,
      paddingHorizontal: 20,
      alignItems: "center",
    },
    avatarWrap: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + "30",
      borderWidth: 3,
      borderColor: colors.primary + "60",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    avatarText: {
      fontFamily: "Inter_700Bold",
      fontSize: 32,
      color: colors.sidebarForeground,
    },
    name: {
      fontFamily: "Inter_700Bold",
      fontSize: 20,
      color: colors.sidebarForeground,
      textAlign: "center",
    },
    email: {
      fontFamily: "Inter_400Regular",
      fontSize: 13,
      color: "rgba(240,253,244,0.7)",
      marginTop: 2,
    },
    roleBadge: {
      marginTop: 10,
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    roleBadgeText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
      color: "#fff",
      textTransform: "capitalize",
    },
    content: {
      padding: 16,
      paddingBottom: bottomPad + 16,
      gap: 16,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 15,
      color: colors.foreground,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "60",
    },
    rowLabel: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      color: colors.mutedForeground,
    },
    rowValue: {
      fontFamily: "Inter_500Medium",
      fontSize: 14,
      color: colors.foreground,
    },
    input: {
      fontFamily: "Inter_400Regular",
      fontSize: 14,
      color: colors.foreground,
      backgroundColor: colors.background,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
      paddingVertical: 6,
      flex: 1,
    },
    logoutBtn: {
      backgroundColor: "#fee2e2",
      borderRadius: colors.radius,
      paddingVertical: 15,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: "#fecaca",
    },
    logoutText: {
      fontFamily: "Inter_700Bold",
      fontSize: 15,
      color: "#dc2626",
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.avatarWrap}>
          <Text style={s.avatarText}>{user?.fullName.charAt(0) ?? "U"}</Text>
        </View>
        <Text style={s.name}>{user?.fullName}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.roleBadge}>
          <Ionicons name={user?.role === "official" ? "shield-checkmark" : "person"} size={14} color="#fff" />
          <Text style={s.roleBadgeText}>{user?.role}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Personal Information</Text>
            <TouchableOpacity onPress={editing ? handleSave : () => setEditing(true)}>
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.primary }}>
                {editing ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>
          {[
            { icon: "person-outline" as const, label: "Full Name", value: user?.fullName, editable: false },
            { icon: "mail-outline" as const, label: "Email", value: user?.email, editable: false },
            { icon: "call-outline" as const, label: "Phone", value: phone, editable: true, setter: setPhone },
            { icon: "location-outline" as const, label: "Address", value: address, editable: true, setter: setAddress },
          ].map((item, i) => (
            <View key={i} style={[s.row, i === 3 && { borderBottomWidth: 0 }]}>
              <Ionicons name={item.icon} size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{item.label}</Text>
                {editing && item.editable && item.setter ? (
                  <TextInput
                    value={item.value}
                    onChangeText={item.setter}
                    style={s.input}
                    placeholderTextColor={colors.mutedForeground}
                  />
                ) : (
                  <Text style={s.rowValue}>{item.value}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Officials */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Barangay Officials</Text>
          </View>
          {barangayOfficials.map((o, i) => (
            <View key={i} style={[s.row, i === barangayOfficials.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary + "20", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.primary }}>{o.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={s.rowValue}>{o.name}</Text>
                <Text style={s.rowLabel}>{o.position}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Emergency Contacts</Text>
          </View>
          {[
            { icon: "call" as const, label: "Barangay Office", value: "0912-345-6789" },
            { icon: "shield-checkmark" as const, label: "Police (PNP)", value: "911" },
            { icon: "flame" as const, label: "Fire Department", value: "160" },
            { icon: "medkit" as const, label: "Medical Emergency", value: "143" },
          ].map((item, i) => (
            <View key={i} style={[s.row, i === 3 && { borderBottomWidth: 0 }]}>
              <Ionicons name={item.icon} size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{item.label}</Text>
                <Text style={s.rowValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} testID="button-logout">
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
