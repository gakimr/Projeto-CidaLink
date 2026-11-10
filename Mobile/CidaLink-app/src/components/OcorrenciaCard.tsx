import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type OcorrenciaCardProps = {
  nome: string;
  local: string;
  foto?: string | null;
  tempo: string;
  descricao?: string;
  categoria?: string;
  status?: string;
};

const categorias: Record<string, string> = {
  buraco: "Buraco na via",
  iluminacao: "Iluminação pública",
  lixo: "Coleta de lixo",
  saneamento: "Saneamento",
  outro: "Outro problema",
};

export default function OcorrenciaCard({ nome, local, foto, tempo, descricao, categoria, status }: OcorrenciaCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.userRow}>
        <View style={styles.avatar}><Ionicons name="person" size={18} color="#5b8def" /></View>
        <View style={styles.userInfo}>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.local} numberOfLines={2}>{local}</Text>
        </View>
      </View>
      {foto ? (
        <Image source={{ uri: foto }} style={styles.foto} resizeMode="cover" />
      ) : (
        <View style={[styles.foto, styles.semFoto]}><Ionicons name="image-outline" size={42} color="#aaa" /><Text style={styles.semFotoTexto}>Sem foto</Text></View>
      )}
      <View style={styles.conteudo}>
        {!!categoria && <Text style={styles.categoria}>{categorias[categoria] || categoria}</Text>}
        {!!descricao && <Text style={styles.descricao}>{descricao}</Text>}
        {!!status && <Text style={styles.status}>Status: {status === "andamento" ? "Em andamento" : status === "resolvida" ? "Resolvida" : "Pendente"}</Text>}
      </View>
      <View style={styles.footer}><Text style={styles.tempo}>{tempo}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", marginBottom: 12 },
  userRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#dbe6fd", justifyContent: "center", alignItems: "center", marginRight: 10 },
  userInfo: { flex: 1 },
  nome: { fontWeight: "bold", fontSize: 14, color: "#1a1a1a" },
  local: { fontSize: 12, color: "#888", marginTop: 2 },
  foto: { width: "100%", height: 220, backgroundColor: "#eee" },
  semFoto: { justifyContent: "center", alignItems: "center" },
  semFotoTexto: { color: "#999", fontSize: 12, marginTop: 5 },
  conteudo: { paddingHorizontal: 16, paddingTop: 12 },
  categoria: { color: "#2e7d32", fontWeight: "700", fontSize: 12, marginBottom: 5 },
  descricao: { color: "#333", fontSize: 14, lineHeight: 20 },
  status: { color: "#777", fontSize: 11, marginTop: 8 },
  footer: { alignItems: "flex-end", paddingHorizontal: 16, paddingVertical: 10 },
  tempo: { fontSize: 12, color: "#999" },
});
