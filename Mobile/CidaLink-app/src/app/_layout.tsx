import { AuthProvider } from "@/context/AuthContext";
import { DarkTheme, DefaultTheme, ThemeProvider, Slot } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
  );
}
