import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type OcorrenciaPopupProps = {
  titulo: string;
  categoria: string;
  local: string;
  descricao: string;
  status: "em_andamento" | "resolvido";
  foto: string;
  onClose: () => void;
};

export default function OcorrenciaPopup({
  titulo,
  categoria,
  local,
  descricao,
  status,
  foto,
  onClose,
}: OcorrenciaPopupProps) {
  const statusConfig = {
    em_andamento: { label: "EM ANDAMENTO", color: "#f5a623" },
    resolvido: { label: "RESOLVIDO", color: "#2e7d32" },
  };
  const { label, color } = statusConfig[status];

  return (
    <View style={styles.popup}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={18} color="#333" />
      </TouchableOpacity>

      <Image source={{ uri: foto }} style={styles.foto} />

      <View style={styles.content}>
        <Text style={styles.local}>{local}</Text>
        <View style={styles.categoriaRow}>
          <Ionicons name="warning" size={14} color="#f5a623" />
          <Text style={styles.categoria}>{titulo}</Text>
        </View>
        <Text style={styles.descricao}>{descricao}</Text>

        <View style={[styles.statusBadge, { backgroundColor: color }]}>
          <Text style={styles.statusText}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    bottom: 110,
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  foto: {
    width: "100%",
    height: 130,
  },
  content: {
    padding: 14,
  },
  local: {
    fontSize: 13,
    color: "#3b6fd6",
    fontWeight: "bold",
    marginBottom: 2,
  },
  categoriaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  categoria: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginLeft: 4,
  },
  descricao: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
