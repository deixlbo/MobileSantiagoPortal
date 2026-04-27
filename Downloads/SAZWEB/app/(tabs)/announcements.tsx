import { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

type Priority = "high" | "medium" | "low";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: Priority;
  date: string;
  author: string;
}

const mockAnnouncements: Announcement[] = [
  { id: "1", title: "Clean-Up Drive - April 13, 2026", content: "All residents are invited to join the Clean-Up Drive on April 13, 2026 at 6:00 AM. Assembly at Barangay Hall.", category: "Event", priority: "medium", date: "2026-04-09", author: "Kap. Rolando C. Borja" },
  { id: "2", title: "Free Medical Mission", content: "The barangay in partnership with the Municipality of San Antonio will hold a Free Medical Mission on April 20, 2026. Services include general check-up, dental, and eye examination.", category: "Event", priority: "high", date: "2026-04-07", author: "Kap. Rolando C. Borja" },
  { id: "3", title: "Water Supply Interruption Notice", content: "MAYNILAD will conduct maintenance work on April 15, 2026 from 8:00 AM to 5:00 PM. Water supply will be interrupted in Puroks 1-3.", category: "Maintenance", priority: "high", date: "2026-04-05", author: "Sec. Maria D. Santos" },
  { id: "4", title: "Barangay Assembly - April 28, 2026", content: "Mandatory General Assembly for all Barangay Officials and Household Representatives on April 28, 2026 at 9:00 AM.", category: "Meeting", priority: "high", date: "2026-04-03", author: "Sec. Maria D. Santos" },
  { id: "5", title: "Summer Sports Festival Registration", content: "Registration for the Barangay Summer Sports Festival is now open! Events include basketball, volleyball, badminton, and swimming.", category: "Event", priority: "low", date: "2026-04-01", author: "Coun. Mark Santos" },
];

export default function AnnouncementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isOfficial = user?.role === "official";

  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "Event", priority: "medium" as Priority });

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const priorityConfig: Record<Priority, { color: string; bg: string; icon: string }> = {
    high: { color: "#dc2626", bg: "#fee2e2", icon: "warning" },
    medium: { color: "#ca8a04", bg: "#fef9c3", icon: "megaphone" },
    low: { color: "#16A34A", bg: "#dcfce7", icon: "megaphone-outline" },
  };

  const handleAddAnnouncement = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: form.title,
      content: form.content,
      category: form.category,
      priority: form.priority,
      date: new Date().toISOString().split("T")[0],
      author: user?.fullName ?? "Official",
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setShowForm(false);
    setForm({ title: "", content: "", category: "Event", priority: "medium" });
  };

  type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.sidebar,
      paddingTop: topPad + 12,
      paddingBottom: 16,
      paddingHorizontal: 20,
    },
    headerRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 },
    headerTitle: { color: colors.sidebarForeground, fontFamily: "Inter_700Bold", fontSize: 24 },
    addBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 4 },
    addBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },
    searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: colors.radius, paddingHorizontal: 12, gap: 8 },
    searchInput: { flex: 1, paddingVertical: 10, color: colors.sidebarForeground, fontFamily: "Inter_400Regular", fontSize: 14 },
    card: {
      flexDirection: "row",
      gap: 12,
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    iconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" },
    catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: colors.primary + "15", alignSelf: "flex-start", marginBottom: 2 },
    catText: { fontFamily: "Inter_500Medium", fontSize: 11, color: colors.primary },
    title: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.foreground },
    meta: { fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>Announcements</Text>
          {isOfficial && (
            <TouchableOpacity style={s.addBtn} onPress={() => setShowForm(true)} testID="button-post">
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={s.addBtnText}>Post</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={s.searchWrap}>
          <Ionicons name="search" size={16} color="rgba(240,253,244,0.6)" />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search announcements..."
            placeholderTextColor="rgba(240,253,244,0.4)"
            testID="input-search"
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
        renderItem={({ item }) => {
          const cfg = priorityConfig[item.priority];
          return (
            <TouchableOpacity style={s.card} onPress={() => setSelected(item)} testID={`ann-item-${item.id}`}>
              <View style={[s.iconWrap, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon as IoniconsName} size={20} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.catBadge}><Text style={s.catText}>{item.category}</Text></View>
                <Text style={s.title} numberOfLines={2}>{item.title}</Text>
                <Text style={s.meta} numberOfLines={1}>{item.author} · {new Date(item.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <Ionicons name="megaphone-outline" size={48} color={colors.mutedForeground + "60"} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: colors.mutedForeground }}>No announcements found</Text>
          </View>
        }
      />

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ backgroundColor: colors.sidebar, padding: 20, paddingTop: 40 }}>
              <TouchableOpacity onPress={() => setSelected(null)} style={{ marginBottom: 16 }}>
                <Ionicons name="close" size={24} color={colors.sidebarForeground} />
              </TouchableOpacity>
              <View style={{ backgroundColor: colors.primary + "20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start", marginBottom: 8 }}>
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: colors.sidebarForeground }}>{selected.category}</Text>
              </View>
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: colors.sidebarForeground, lineHeight: 28 }}>{selected.title}</Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "rgba(240,253,244,0.65)", marginTop: 8 }}>
                {selected.author} · {new Date(selected.date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
              </Text>
            </View>
            <View style={{ flex: 1, padding: 20 }}>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: colors.foreground, lineHeight: 24 }}>{selected.content}</Text>
            </View>
          </View>
        )}
      </Modal>

      {/* Add Form Modal (Officials only) */}
      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowForm(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: colors.foreground }}>Post Announcement</Text>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Ionicons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.foreground, marginBottom: 6 }}>Title</Text>
          <TextInput value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} placeholder="Announcement title..." placeholderTextColor={colors.mutedForeground} style={{ backgroundColor: colors.card, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, padding: 12, fontFamily: "Inter_400Regular", fontSize: 14, color: colors.foreground, marginBottom: 16 }} testID="input-title" />
          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.foreground, marginBottom: 6 }}>Priority</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
            {(["high", "medium", "low"] as Priority[]).map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => setForm(prev => ({ ...prev, priority: p }))}
                style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: colors.radius, backgroundColor: form.priority === p ? colors.primary : colors.muted }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: form.priority === p ? "#fff" : colors.mutedForeground, textTransform: "capitalize" }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.foreground, marginBottom: 6 }}>Content</Text>
          <TextInput value={form.content} onChangeText={v => setForm(p => ({ ...p, content: v }))} placeholder="Write announcement content..." placeholderTextColor={colors.mutedForeground} style={{ backgroundColor: colors.card, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, padding: 12, fontFamily: "Inter_400Regular", fontSize: 14, color: colors.foreground, minHeight: 120, textAlignVertical: "top", marginBottom: 24 }} multiline testID="input-content" />
          <TouchableOpacity
            onPress={handleAddAnnouncement}
            disabled={!form.title.trim() || !form.content.trim()}
            style={{ backgroundColor: colors.primary, borderRadius: colors.radius, paddingVertical: 15, alignItems: "center", opacity: !form.title.trim() || !form.content.trim() ? 0.5 : 1 }}
            testID="button-post-announcement"
          >
            <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 }}>Post Announcement</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
