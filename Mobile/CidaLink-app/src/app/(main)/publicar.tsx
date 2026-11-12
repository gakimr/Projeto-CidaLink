import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import api, { mensagemDeErro } from "@/services/api";

const CATEGORIAS = [
  {
    valor: "buraco",
    titulo: "Buraco na via",
    icone: "alert-circle-outline" as const,
  },
  {
    valor: "iluminacao",
    titulo: "Iluminação pública",
    icone: "bulb-outline" as const,
  },
  { valor: "lixo", titulo: "Lixo e coleta", icone: "trash-outline" as const },
  {
    valor: "saneamento",
    titulo: "Saneamento",
    icone: "water-outline" as const,
  },
  {
    valor: "outro",
    titulo: "Outro problema",
    icone: "ellipsis-horizontal-circle-outline" as const,
  },
];

type FotoSelecionada = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
};

export default function PublicarScreen() {
  const router = useRouter();
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [foto, setFoto] = useState<FotoSelecionada | null>(null);
  const [coordenadas, setCoordenadas] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [localizando, setLocalizando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [modalCategorias, setModalCategorias] = useState(false);

  async function selecionarFoto() {
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso às fotos para anexar uma imagem à ocorrência.",
        );
        return;
      }
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.75,
      });
      if (!resultado.canceled && resultado.assets[0]) {
        const imagem = resultado.assets[0];
        setFoto({
          uri: imagem.uri,
          fileName: imagem.fileName,
          mimeType: imagem.mimeType,
          fileSize: imagem.fileSize,
        });
      }
    } catch {
      Alert.alert("Ops!", "Não foi possível abrir a galeria de fotos.");
    }
  }

  async function obterLocalizacao() {
    setLocalizando(true);
    try {
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          "Autorize o acesso à localização para marcar onde está o problema.",
        );
        return;
      }
      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoordenadas({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      });
      try {
        const enderecos = await Location.reverseGeocodeAsync({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
        });
        const endereco = enderecos[0];
        if (endereco) {
          const rua = [endereco.street, endereco.streetNumber]
            .filter(Boolean)
            .join(", ");
          if (rua) setLogradouro((atual) => atual || rua);
          if (endereco.district || endereco.subregion)
            setBairro(
              (atual) => atual || endereco.district || endereco.subregion || "",
            );
        }
      } catch {
        // As coordenadas continuam válidas mesmo se o endereço não puder ser identificado.
      }
      Alert.alert(
        "Localização obtida",
        "A localização da ocorrência foi marcada com sucesso.",
      );
    } catch {
      Alert.alert(
        "Erro de localização",
        "Não foi possível obter sua localização. Tente novamente em um local aberto.",
      );
    } finally {
      setLocalizando(false);
    }
  }

  async function publicarOcorrencia() {
    if (!categoria)
      return Alert.alert("Atenção", "Selecione a categoria da ocorrência.");
    if (!descricao.trim())
      return Alert.alert("Atenção", "Descreva o problema encontrado.");
    if (descricao.trim().length > 1000)
      return Alert.alert(
        "Atenção",
        "A descrição deve ter no máximo 1000 caracteres.",
      );
    if (!coordenadas)
      return Alert.alert(
        "Localização necessária",
        "Toque em 'Usar minha localização' antes de registrar a ocorrência.",
      );
    if (foto?.fileSize && foto.fileSize > 2 * 1024 * 1024) {
      return Alert.alert(
        "Imagem muito grande",
        "Escolha uma imagem com no máximo 2 MB.",
      );
    }
    if (
      foto?.mimeType &&
      !["image/jpeg", "image/png", "image/webp"].includes(foto.mimeType)
    ) {
      return Alert.alert(
        "Formato não aceito",
        "Escolha uma imagem JPG, PNG ou WEBP.",
      );
    }

    setEnviando(true);
    try {
      const dados = new FormData();
      dados.append("categoria", categoria);
      dados.append("descricao", descricao.trim());
      dados.append("logradouro", logradouro.trim());
      dados.append("bairro", bairro.trim());
      dados.append("latitude", String(coordenadas.latitude));
      dados.append("longitude", String(coordenadas.longitude));
      if (foto) {
        const extensao = foto.uri.split(".").pop()?.toLowerCase() || "jpg";
        const mimeType =
          foto.mimeType ||
          (extensao === "png"
            ? "image/png"
            : extensao === "webp"
              ? "image/webp"
              : "image/jpeg");
        (dados as any).append("foto", {
          uri: foto.uri,
          name: foto.fileName || `ocorrencia-${Date.now()}.${extensao}`,
          type: mimeType,
        });
      }

      await api.post("/postagens", dados, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      Alert.alert(
        "Ocorrência registrada!",
        "Sua ocorrência foi enviada com sucesso.",
        [{ text: "Ver no feed", onPress: () => router.replace("/feed") }],
      );
      setCategoria("");
      setDescricao("");
      setLogradouro("");
      setBairro("");
      setFoto(null);
      setCoordenadas(null);
    } catch (error) {
      Alert.alert(
        "Não foi possível publicar",
        mensagemDeErro(error, "Ocorreu um erro ao registrar a ocorrência."),
      );
    } finally {
      setEnviando(false);
    }
  }

  const categoriaSelecionada = CATEGORIAS.find(
    (item) => item.valor === categoria,
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Criar ocorrência</Text>
          <Text style={styles.subtitulo}>
            Ajude a melhorar sua cidade. Conte para a gente o que está
            acontecendo.
          </Text>
        </View>

        <Text style={styles.label}>Foto do problema</Text>
        <TouchableOpacity
          style={styles.fotoBotao}
          onPress={selecionarFoto}
          activeOpacity={0.8}
        >
          {foto ? (
            <Image source={{ uri: foto.uri }} style={styles.preview} />
          ) : (
            <>
              <View style={styles.cameraIcon}>
                <Ionicons name="camera-outline" size={27} color="#2e7d32" />
              </View>
              <Text style={styles.fotoTitulo}>Adicionar uma foto</Text>
              <Text style={styles.fotoAjuda}>
                Toque para escolher uma imagem (máx. 2 MB)
              </Text>
            </>
          )}
        </TouchableOpacity>
        {foto && (
          <TouchableOpacity
            onPress={() => setFoto(null)}
            style={styles.removerFoto}
          >
            <Ionicons name="trash-outline" size={16} color="#b3261e" />
            <Text style={styles.removerFotoTexto}>Remover foto</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Categoria *</Text>
        <TouchableOpacity
          style={styles.seletor}
          onPress={() => setModalCategorias(true)}
        >
          <Text
            style={
              categoriaSelecionada ? styles.seletorTexto : styles.placeholder
            }
          >
            {categoriaSelecionada?.titulo || "Selecione o tipo de problema"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#777" />
        </TouchableOpacity>

        <Text style={styles.label}>Local da ocorrência *</Text>
        <TouchableOpacity
          style={styles.localizacaoBotao}
          onPress={obterLocalizacao}
          disabled={localizando}
        >
          {localizando ? (
            <ActivityIndicator color="#2e7d32" />
          ) : (
            <Ionicons name="navigate-outline" size={19} color="#2e7d32" />
          )}
          <Text style={styles.localizacaoTexto}>
            {localizando
              ? "Obtendo localização..."
              : coordenadas
                ? "Localização marcada"
                : "Usar minha localização"}
          </Text>
          {coordenadas && (
            <Ionicons name="checkmark-circle" size={19} color="#2e7d32" />
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Rua e número (opcional)"
          placeholderTextColor="#999"
          value={logradouro}
          onChangeText={setLogradouro}
          maxLength={150}
        />
        <TextInput
          style={styles.input}
          placeholder="Bairro (opcional)"
          placeholderTextColor="#999"
          value={bairro}
          onChangeText={setBairro}
          maxLength={100}
        />

        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descreva o problema e informe detalhes importantes..."
          placeholderTextColor="#999"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />
        <Text style={styles.contador}>{descricao.length}/1000</Text>

        <TouchableOpacity
          style={[styles.publicarBotao, enviando && styles.botaoDesabilitado]}
          onPress={publicarOcorrencia}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="send-outline" size={18} color="#fff" />
          )}
          <Text style={styles.publicarTexto}>
            {enviando ? "Enviando ocorrência..." : "Registrar ocorrência"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalCategorias}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCategorias(false)}
      >
        <Pressable
          style={styles.modalFundo}
          onPress={() => setModalCategorias(false)}
        >
          <Pressable style={styles.modalConteudo} onPress={() => undefined}>
            <Text style={styles.modalTitulo}>Selecione uma categoria</Text>
            {CATEGORIAS.map((item) => (
              <TouchableOpacity
                key={item.valor}
                style={styles.opcaoCategoria}
                onPress={() => {
                  setCategoria(item.valor);
                  setModalCategorias(false);
                }}
              >
                <Ionicons name={item.icone} size={22} color="#2e7d32" />
                <Text style={styles.opcaoTexto}>{item.titulo}</Text>
                {categoria === item.valor && (
                  <Ionicons name="checkmark" size={20} color="#2e7d32" />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6f5" },
  scroll: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 125 },
  header: { marginBottom: 22 },
  titulo: { fontSize: 23, fontWeight: "700", color: "#222" },
  subtitulo: { fontSize: 13, color: "#777", lineHeight: 19, marginTop: 6 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 9,
    marginTop: 17,
  },
  fotoBotao: {
    minHeight: 132,
    borderWidth: 1,
    borderColor: "#cbd9cc",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 12,
  },
  cameraIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8f3e8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  fotoTitulo: { color: "#333", fontWeight: "700", fontSize: 14 },
  fotoAjuda: { color: "#888", fontSize: 11, marginTop: 4 },
  preview: { width: "100%", height: 180, borderRadius: 8, resizeMode: "cover" },
  removerFoto: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 5,
    marginTop: 7,
  },
  removerFotoTexto: { color: "#b3261e", fontSize: 12 },
  seletor: {
    minHeight: 48,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seletorTexto: { color: "#333", fontSize: 13 },
  placeholder: { color: "#999", fontSize: 13 },
  localizacaoBotao: {
    minHeight: 46,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#b9d5bb",
    backgroundColor: "#eff7ef",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 9,
  },
  localizacaoTexto: {
    color: "#2e7d32",
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },
  input: {
    minHeight: 46,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingHorizontal: 13,
    paddingVertical: 11,
    color: "#333",
    fontSize: 13,
    marginTop: 8,
  },
  textarea: { height: 125, paddingTop: 12 },
  contador: { color: "#999", textAlign: "right", fontSize: 11, marginTop: 5 },
  publicarBotao: {
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
    marginTop: 23,
  },
  publicarTexto: { color: "#fff", fontWeight: "700", fontSize: 14 },
  botaoDesabilitado: { opacity: 0.65 },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  modalConteudo: { backgroundColor: "#fff", borderRadius: 14, padding: 18 },
  modalTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  opcaoCategoria: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  opcaoTexto: { flex: 1, color: "#333", fontSize: 14 },
});
