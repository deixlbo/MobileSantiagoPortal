import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

const mockAnnouncements = [
  { id: "1", title: "Clean-Up Drive - April 13", category: "Event", priority: "medium" },
  { id: "2", title: "Free Medical Mission", category: "Event", priority: "high" },
  { id: "3", title: "Water Supply Interruption Notice", category: "Maintenance", priority: "high" },
];

const mockStats = {
  resident: [
    { label: "Pending Requests", value: "2", icon: "document-text" as const, color: "#FACC15" },
    { label: "Active Cases", value: "1", icon: "clipboard" as const, color: "#ef4444" },
    { label: "Announcements", value: "5", icon: "megaphone" as const, color: "#3b82f6" },
    { label: "Programs", value: "4", icon: "folder" as const, color: "#8b5cf6" },
  ],
  official: [
    { label: "Pending Docs", value: "3", icon: "document-text" as const, color: "#FACC15" },
    { label: "Active Cases", value: "4", icon: "clipboard" as const, color: "#ef4444" },
    { label: "Residents", value: "4,825", icon: "people" as const, color: "#3b82f6" },
    { label: "Projects", value: "4", icon: "folder" as const, color: "#8b5cf6" },
  ],
};

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const isOfficial = user.role === "official";
  const stats = isOfficial ? mockStats.official : mockStats.resident;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.sidebar,
      paddingTop: topPad + 12,
      paddingBottom: 24,
      paddingHorizontal: 20,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    greeting: {
      color: "rgba(240,253,244,0.7)",
      fontFamily: "Inter_400Regular",
      fontSize: 13,
    },
    name: {
      color: colors.sidebarForeground,
      fontFamily: "Inter_700Bold",
      fontSize: 22,
    },
    badge: {
      backgroundColor: isOfficial ? colors.primary : "rgba(255,255,255,0.15)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    badgeText: {
      color: isOfficial ? "#fff" : colors.sidebarForeground,
      fontFamily: "Inter_600SemiBold",
      fontSize: 12,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 4,
    },
    statCard: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: "rgba(255,255,255,0.12)",
      borderRadius: colors.radius,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    statIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    statValue: {
      color: colors.sidebarForeground,
      fontFamily: "Inter_700Bold",
      fontSize: 20,
    },
    statLabel: {
      color: "rgba(240,253,244,0.65)",
      fontFamily: "Inter_400Regular",
      fontSize: 10,
    },
    content: {
      padding: 16,
      gap: 16,
    },
    sectionTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 16,
      color: colors.foreground,
      marginBottom: 10,
    },
    annCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    annIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    annTitle: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
      color: colors.foreground,
    },
    annCat: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      color: colors.mutedForeground,
      marginTop: 2,
    },
    quickTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: 16,
      color: colors.foreground,
      marginBottom: 10,
    },
    quickGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    quickBtn: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    quickBtnText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 12,
      color: colors.foreground,
      textAlign: "center",
    },
  });

  const quickActions = isOfficial
    ? [
      { icon: "document-text" as IoniconsName, label: "Document Requests", tab: "/documents", color: colors.primary },
      { icon: "clipboard" as IoniconsName, label: "Blotter Cases", tab: "/blotter", color: "#ef4444" },
      { icon: "megaphone" as IoniconsName, label: "Announcements", tab: "/announcements", color: "#3b82f6" },
      { icon: "person" as IoniconsName, label: "My Profile", tab: "/profile", color: "#8b5cf6" },
    ]
    : [
      { icon: "document-text" as IoniconsName, label: "Request Document", tab: "/documents", color: colors.primary },
      { icon: "clipboard" as IoniconsName, label: "File Blotter", tab: "/blotter", color: "#ef4444" },
      { icon: "megaphone" as IoniconsName, label: "Announcements", tab: "/announcements", color: "#3b82f6" },
      { icon: "person" as IoniconsName, label: "My Profile", tab: "/profile", color: "#8b5cf6" },
    ];

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerRow}>
            <View>
              <Text style={s.greeting}>Good day,</Text>
              <Text style={s.name}>{user.fullName.split(" ")[0]}</Text>
            </View>
            <View style={s.badge}>
              <Ionicons name={isOfficial ? "shield-checkmark" : "person"} size={14} color={isOfficial ? "#fff" : colors.sidebarForeground} />
              <Text style={s.badgeText}>{isOfficial ? "Official" : "Resident"}</Text>
            </View>
          </View>

          <View style={s.statsGrid}>
            {stats.map((stat, i) => (
              <View key={i} style={s.statCard}>
                <View style={[s.statIconWrap, { backgroundColor: stat.color + "30" }]}>
                  <Ionicons name={stat.icon} size={18} color={stat.color} />
                </View>
                <View>
                  <Text style={s.statValue}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={s.content}>
          {/* Quick Actions */}
          <View>
            <Text style={s.quickTitle}>Quick Actions</Text>
            <View style={s.quickGrid}>
              {quickActions.map((qa, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.quickBtn}
                  onPress={() => router.push(`/(tabs)${qa.tab}` as any)}
                  testID={`quick-action-${i}`}
                >
                  <View style={[s.statIconWrap, { backgroundColor: qa.color + "20" }]}>
                    <Ionicons name={qa.icon} size={22} color={qa.color} />
                  </View>
                  <Text style={s.quickBtnText}>{qa.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Announcements */}
          <View>
            <Text style={s.sectionTitle}>Latest Announcements</Text>
            {mockAnnouncements.map(ann => (
              <TouchableOpacity
                key={ann.id}
                style={s.annCard}
                onPress={() => router.push("/(tabs)/announcements")}
                testID={`ann-${ann.id}`}
              >
                <View style={[s.annIcon, {
                  backgroundColor: ann.priority === "high" ? "#fee2e2" : ann.priority === "medium" ? "#fef9c3" : "#dcfce7"
                }]}>
                  <Ionicons
                    name={ann.priority === "high" ? "warning" : "megaphone"}
                    size={18}
                    color={ann.priority === "high" ? "#dc2626" : ann.priority === "medium" ? "#ca8a04" : colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.annTitle} numberOfLines={2}>{ann.title}</Text>
                  <Text style={s.annCat}>{ann.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Barangay Info */}
          <View style={{
            backgroundColor: colors.primary + "15",
            borderRadius: colors.radius,
            borderWidth: 1,
            borderColor: colors.primary + "30",
            padding: 16,
          }}>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.foreground, marginBottom: 8 }}>
              Barangay Santiago Saz
            </Text>
            {[
              { icon: "call" as IoniconsName, text: "Office: 0912-345-6789" },
              { icon: "time" as IoniconsName, text: "Mon-Fri: 8:00 AM - 5:00 PM" },
              { icon: "location" as IoniconsName, text: "San Antonio, Zambales" },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Ionicons name={item.icon} size={14} color={colors.primary} />
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground }}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
