import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type OcorrenciaCardProps = {
  nome: string;
  local: string;
  foto?: string | null;
  fotoPerfil?: string | null;
  tempo: string;
};

export default function OcorrenciaCard({
  nome,
  local,
  foto,
  fotoPerfil,
  tempo,
}: OcorrenciaCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.avatarImagem} />
          ) : (
            <Ionicons name="person" size={18} color="#5b8def" />
          )}
        </View>
        <View>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.local}>{local}</Text>
        </View>
      </View>

      {foto ? <Image source={{ uri: foto }} style={styles.foto} /> : null}

      <View style={styles.footer}>
        <View style={styles.votes}>
          <TouchableOpacity style={styles.voteButton}>
            <Ionicons name="arrow-up" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.voteButton}>
            <Ionicons name="arrow-down" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.tempo}>{tempo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dbe6fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarImagem: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  nome: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1a1a1a",
  },
  local: {
    fontSize: 12,
    color: "#888",
  },
  foto: {
    width: "100%",
    height: 220,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  votes: {
    flexDirection: "row",
    gap: 8,
  },
  voteButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#3b6fd6",
    justifyContent: "center",
    alignItems: "center",
  },
  tempo: {
    fontSize: 12,
    color: "#999",
  },
});
