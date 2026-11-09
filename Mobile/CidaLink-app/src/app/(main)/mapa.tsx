import { StyleSheet, View, Image, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import OcorrenciaPopup from "@/components/OcorrenciaPopup";

export default function MapaScreen() {
  const MOCK_OCORRENCIAS = [
    {
      id: "1",
      titulo: "Buraco na Rua",
      categoria: "Buraco na Rua",
      local: "Centro",
      descricao: "Buraco na rua atrapalhando o trânsito",
      status: "em_andamento" as const,
      foto: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=800",
      latitude: -21.4053,
      longitude: -48.5124,
    },
    {
      id: "2",
      titulo: "Iluminação Pública",
      categoria: "Iluminação Pública",
      local: "Bairro São José",
      descricao: "Poste de luz apagado há uma semana",
      status: "resolvido" as const,
      foto: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
      latitude: -21.409,
      longitude: -48.516,
    },
  ];

  const [selecionada, setSelecionada] = useState<
    (typeof MOCK_OCORRENCIAS)[0] | null
  >(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -21.4053,
          longitude: -48.5124,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {MOCK_OCORRENCIAS.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            pinColor={item.status === "em_andamento" ? "#f5a623" : "#2e7d32"}
            onPress={() => setSelecionada(item)}
          />
        ))}
      </MapView>
      <View style={styles.header}>
        <Ionicons name="search-outline" size={24} color="#333" />
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/LogoCida.png")}
            style={styles.logoIcon}
          />
        </View>
        <Ionicons name="person-circle-outline" size={32} color="#333" />
      </View>

      <View style={styles.header}>
        <Ionicons name="search-outline" size={24} color="#333" />
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/LogoCida.png")}
            style={styles.logoIcon}
          />
        </View>
        <Ionicons name="person-circle-outline" size={32} color="#333" />
      </View>

      {selecionada && (
        <OcorrenciaPopup
          titulo={selecionada.titulo}
          categoria={selecionada.categoria}
          local={selecionada.local}
          descricao={selecionada.descricao}
          status={selecionada.status}
          foto={selecionada.foto}
          onClose={() => setSelecionada(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginRight: 6,
  },
});
