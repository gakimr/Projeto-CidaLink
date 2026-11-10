import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OcorrenciaCard from "@/components/OcorrenciaCard";
import api, { mensagemDeErro, urlArquivo } from "@/services/api";

type Postagem = {
  id: number | string;
  categoria: string;
  descricao: string;
  logradouro?: string;
  bairro?: string;
  foto?: string | null;
  status?: string;
  criadoEm?: string;
  autor?: { nome?: string; fotoPerfil?: string | null };
};

function tempoDecorrido(data?: string) {
  if (!data) return "Agora";
  const dataNormalizada = data.includes("T") ? data : data.replace(" ", "T");
  const instante = new Date(dataNormalizada).getTime();
  if (Number.isNaN(instante)) return "";
  const minutos = Math.max(0, Math.floor((Date.now() - instante) / 60000));
  if (minutos < 1) return "Agora";
  if (minutos < 60) return `Há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Há ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `Há ${dias} dia${dias === 1 ? "" : "s"}`;
  return new Date(instante).toLocaleDateString("pt-BR");
}

export default function FeedScreen() {
  const router = useRouter();
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarPostagens = useCallback(async (puxando = false) => {
    if (puxando) setAtualizando(true);
    else setCarregando(true);
    setErro("");
    try {
      const resposta = await api.get("/postagens");
      const lista = resposta.data?.data?.postagens;
      setPostagens(Array.isArray(lista) ? lista : []);
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível carregar as ocorrências."));
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPostagens();
    }, [carregarPostagens]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar">
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image source={require("@/assets/images/LogoCida.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => carregarPostagens(true)} accessibilityLabel="Atualizar feed">
          <Ionicons name="refresh-outline" size={23} color="#333" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.mensagem}>Carregando ocorrências...</Text>
        </View>
      ) : erro ? (
        <View style={styles.centro}>
          <Ionicons name="cloud-offline-outline" size={42} color="#888" />
          <Text style={styles.erro}>{erro}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={() => carregarPostagens()}>
            <Text style={styles.botaoTentarTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={postagens}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <OcorrenciaCard
              nome={item.autor?.nome || "Cidadão"}
              local={[item.bairro, item.logradouro].filter(Boolean).join(" - ") || "Local não informado"}
              foto={urlArquivo(item.foto)}
              tempo={tempoDecorrido(item.criadoEm)}
              descricao={item.descricao}
              categoria={item.categoria}
              status={item.status}
            />
          )}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={() => carregarPostagens(true)} colors={["#2e7d32"]} />}
          contentContainerStyle={postagens.length ? styles.listContent : styles.listaVazia}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Ionicons name="document-text-outline" size={48} color="#aaa" />
              <Text style={styles.vazioTitulo}>Nenhuma ocorrência por enquanto</Text>
              <Text style={styles.mensagem}>Seja a primeira pessoa a registrar um problema no seu bairro.</Text>
              <TouchableOpacity style={styles.botaoTentar} onPress={() => router.push("/publicar")}>
                <Text style={styles.botaoTentarTexto}>Criar ocorrência</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", paddingHorizontal: 18, paddingTop: 8 },
  logo: { width: 92, height: 62, resizeMode: "contain" },
  listContent: { paddingBottom: 110 },
  listaVazia: { flexGrow: 1, paddingBottom: 100 },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  mensagem: { color: "#777", textAlign: "center", marginTop: 10, lineHeight: 20 },
  erro: { color: "#b3261e", textAlign: "center", marginTop: 12, lineHeight: 21 },
  vazioTitulo: { fontSize: 17, fontWeight: "700", color: "#333", marginTop: 14 },
  botaoTentar: { marginTop: 18, backgroundColor: "#2e7d32", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12 },
  botaoTentarTexto: { color: "#fff", fontWeight: "700" },
});
