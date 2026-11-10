import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";
import { Redirect, Slot } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function MainLayout() {
  const { usuario, carregando } = useAuth();

  if (carregando) return null;

  // sem login, volta pra tela de entrada
  if (!usuario) return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      <Slot />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
