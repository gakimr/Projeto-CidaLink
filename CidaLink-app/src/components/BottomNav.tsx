import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const activeColor = "#ffffff";
  const inactiveColor = "rgba(255, 255, 255, 0.6)";

  return (
    <View style={styles.bottomNav}>
      <Ionicons
        name={pathname === "/feed" ? "home" : "home-outline"}
        size={24}
        color={pathname === "/feed" ? activeColor : inactiveColor}
        onPress={() => router.push("/feed")}
      />
      <Ionicons name="notifications-outline" size={24} color={inactiveColor} />
      <Ionicons
        name={pathname === "/publicar" ? "add-circle" : "add-circle-outline"}
        size={24}
        color={pathname === "/publicar" ? activeColor : inactiveColor}
        onPress={() => router.push("/publicar")}
      />
      <Ionicons
        name={pathname === "/mapa" ? "location" : "location-outline"}
        size={24}
        color={pathname === "/mapa" ? activeColor : inactiveColor}
        onPress={() => router.push("/mapa")}
      />
      <Ionicons name="chatbubble-outline" size={24} color={inactiveColor} />
      <Ionicons
        name="log-out-outline"
        size={24}
        color={inactiveColor}
        onPress={() => router.push("/")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: "#2e7d32",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
