import { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Platform, Image
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth, UserRole } from "@/context/AuthContext";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, authError, clearError } = useAuth();

  const [role, setRole] = useState<UserRole>("resident");
  const [email, setEmail] = useState("juan@email.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (r: UserRole) => {
    setRole(r);
    clearError();
    setEmail(r === "resident" ? "juan@email.com" : "captain@brgy-santiago.gov.ph");
    setPassword("password");
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    const success = await login(email, password, role);
    setLoading(false);
    if (success) {
      router.replace("/(tabs)");
    }
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.sidebar,
    },
    scroll: {
      flex: 1,
    },
    content: {
      minHeight: "100%",
      paddingTop: topPad + 20,
      paddingBottom: insets.bottom + 30,
      paddingHorizontal: 24,
    },
    logoWrap: {
      alignItems: "center",
      marginBottom: 32,
    },
    logoCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderWidth: 3,
      borderColor: "rgba(255,255,255,0.3)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      overflow: "hidden",
    },
    logoTitle: {
      color: colors.sidebarForeground,
      fontFamily: "Inter_700Bold",
      fontSize: 22,
      textAlign: "center",
    },
    logoSub: {
      color: "rgba(240,253,244,0.65)",
      fontFamily: "Inter_400Regular",
      fontSize: 14,
      textAlign: "center",
      marginTop: 4,
    },
    roleRow: {
      flexDirection: "row",
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: colors.radius,
      padding: 4,
      marginBottom: 24,
    },
    roleBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: colors.radius - 2,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    roleBtnActive: {
      backgroundColor: colors.primary,
    },
    roleBtnText: {
      color: "rgba(240,253,244,0.6)",
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
    },
    roleBtnTextActive: {
      color: "#fff",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: colors.radius + 4,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
    },
    label: {
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
      fontSize: 13,
      marginBottom: 6,
    },
    inputWrap: {
      backgroundColor: colors.background,
      borderRadius: colors.radius,
      borderWidth: 1.5,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 14,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      fontSize: 15,
    },
    errorBox: {
      backgroundColor: "#fef2f2",
      borderWidth: 1,
      borderColor: "#fecaca",
      borderRadius: colors.radius,
      padding: 12,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    errorText: {
      color: "#dc2626",
      fontFamily: "Inter_400Regular",
      fontSize: 13,
      flex: 1,
    },
    loginBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 15,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    loginBtnText: {
      color: "#fff",
      fontFamily: "Inter_700Bold",
      fontSize: 16,
    },
    hint: {
      backgroundColor: "rgba(0,0,0,0.15)",
      borderRadius: colors.radius,
      padding: 12,
      marginTop: 20,
    },
    hintText: {
      color: "rgba(240,253,244,0.7)",
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      textAlign: "center",
    },
    hintBold: {
      color: colors.sidebarForeground,
      fontFamily: "Inter_600SemiBold",
    },
  });

  return (
    <View style={s.container}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.logoWrap}>
          <Image
            source={require("@/assets/images/santiago.jpg")}
            style={s.logoCircle}
            resizeMode="cover"
          />
          <Text style={s.logoTitle}>Barangay Santiago Saz</Text>
          <Text style={s.logoSub}>San Antonio, Zambales</Text>
        </View>

        {/* Role Toggle */}
        <View style={s.roleRow}>
          {(["resident", "official"] as UserRole[]).map(r => (
            <TouchableOpacity
              key={r}
              onPress={() => handleRoleSwitch(r)}
              style={[s.roleBtn, role === r && s.roleBtnActive]}
              testID={`role-${r}`}
            >
              <Ionicons
                name={r === "resident" ? "people" : "shield-checkmark"}
                size={16}
                color={role === r ? "#fff" : "rgba(240,253,244,0.6)"}
              />
              <Text style={[s.roleBtnText, role === r && s.roleBtnTextActive]}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.card}>
          {authError && (
            <View style={s.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#dc2626" />
              <Text style={s.errorText}>{authError}</Text>
            </View>
          )}

          <Text style={s.label}>Email Address</Text>
          <View style={s.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} style={{ marginRight: 8 }} />
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter email"
              placeholderTextColor={colors.mutedForeground}
              testID="input-email"
            />
          </View>

          <Text style={s.label}>Password</Text>
          <View style={s.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} style={{ marginRight: 8 }} />
            <TextInput
              style={s.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter password"
              placeholderTextColor={colors.mutedForeground}
              testID="input-password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[s.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            testID="button-login"
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <>
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={s.loginBtnText}>Sign In</Text>
              </>
            }
          </TouchableOpacity>
        </View>

        <View style={s.hint}>
          <Text style={s.hintText}>
            {role === "resident"
              ? <>Demo: <Text style={s.hintBold}>juan@email.com</Text> / any 4+ char password</>
              : <>Demo: <Text style={s.hintBold}>captain@brgy-santiago.gov.ph</Text> / any 4+ char password</>
            }
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
