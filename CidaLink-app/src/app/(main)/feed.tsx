import { View, StyleSheet, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OcorrenciaCard from "@/components/OcorrenciaCard";

const MOCK_OCORRENCIAS = [
  {
    id: "1",
    nome: "Cidadã Maria",
    local: "Centro - Avenida Principal",
    foto: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=800",
    tempo: "2 dias atrás",
  },
  {
    id: "2",
    nome: "Cidadão Pedro",
    local: "Centro - Avenida Principal",
    foto: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    tempo: "3 dias atrás",
  },
  {
    id: "3",
    nome: "Cidadão Pedro",
    local: "Centro - Avenida Principal",
    foto: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    tempo: "3 dias atrás",
  },
  {
    id: "4",
    nome: "Cidadão Pedro",
    local: "Centro - Avenida Principal",
    foto: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    tempo: "3 dias atrás",
  },
];

export default function FeedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={20}
          color="#333"
          onPress={() => router.back()}
        />
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/LogoCida.png")}
            style={styles.logoIcon}
          />
        </View>
        <Ionicons name="person-circle-outline" size={32} color="#333" />
      </View>

      <FlatList
        data={MOCK_OCORRENCIAS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OcorrenciaCard
            nome={item.nome}
            local={item.local}
            foto={item.foto}
            tempo={item.tempo}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginRight: 6,
  },

  listContent: {
    paddingBottom: 100,
  },
});
