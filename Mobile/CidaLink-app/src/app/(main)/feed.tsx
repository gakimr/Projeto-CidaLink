import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OcorrenciaCard from "@/components/OcorrenciaCard";
import { mensagemDeErro, urlArquivo } from "@/services/api";
import {
  listarOcorrencias,
  localDaOcorrencia,
  tempoDecorrido,
  type Ocorrencia,
} from "@/services/ocorrencias";

export default function FeedScreen() {
  const router = useRouter();
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      setOcorrencias(await listarOcorrencias());
    } catch (e) {
      setErro(mensagemDeErro(e, "Não foi possível carregar o feed."));
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

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

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      ) : (
        <FlatList
          data={ocorrencias}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <OcorrenciaCard
              nome={item.autor.nome}
              local={localDaOcorrencia(item)}
              foto={urlArquivo(item.foto)}
              fotoPerfil={urlArquivo(item.autor.fotoPerfil)}
              tempo={tempoDecorrido(item.criadoEm)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={atualizando}
          onRefresh={() => {
            setAtualizando(true);
            carregar();
          }}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Ionicons
                name={erro ? "cloud-offline-outline" : "document-outline"}
                size={40}
                color="#999"
              />
              <Text style={styles.vazioTexto}>
                {erro ?? "Nenhuma ocorrência publicada ainda."}
              </Text>
              {erro && (
                <TouchableOpacity style={styles.botao} onPress={carregar}>
                  <Text style={styles.botaoTexto}>Tentar novamente</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
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
    flexGrow: 1,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  vazioTexto: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
