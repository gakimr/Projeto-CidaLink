
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useAuth, type Usuario } from "@/context/AuthContext";
import api, { mensagemDeErro, urlArquivo } from "@/services/api";
import type { Ocorrencia, StatusOcorrencia } from "@/services/ocorrencias";

const VERDE = "#176b4b";
const VERDE_ESCURO = "#07543d";
const FUNDO = "#f4f6f8";
const TEXTO = "#172033";
const SUAVE = "#667085";

const CATEGORIAS: Record<string, string> = {
  buraco: "Buraco na Rua",
  iluminacao: "Iluminação Pública",
  lixo: "Acúmulo de Lixo",
  saneamento: "Problemas de Saneamento",
  outro: "Outro",
};

const STATUS: Record<StatusOcorrencia, string> = {
  pendente: "Pendente",
  andamento: "Em Andamento",
  resolvida: "Resolvida",
};

const CORES_STATUS: Record<
  StatusOcorrencia,
  { fundo: string; texto: string }
> = {
  pendente: { fundo: "#ffeadc", texto: "#c34b16" },
  andamento: { fundo: "#dff1ff", texto: "#0875c9" },
  resolvida: { fundo: "#dcf8e5", texto: "#087443" },
};

function iniciais(nome?: string) {
  return (nome || "Cidadão")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}

function dataFormatada(valor?: string) {
  if (!valor) return "Data não disponível";

  const data = new Date(valor);

  return Number.isNaN(data.getTime())
    ? "Data não disponível"
    : data.toLocaleDateString("pt-BR");
}

export default function PerfilScreen() {
  const router = useRouter();
  const { usuario, atualizarUsuario } = useAuth();

  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [latitude, setLatitude] = useState(usuario?.latitude ?? "");
  const [longitude, setLongitude] = useState(usuario?.longitude ?? "");

  const [editando, setEditando] = useState(
    !usuario?.latitude || !usuario?.longitude
  );

  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [localizando, setLocalizando] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [erro, setErro] = useState("");
  const [erroLista, setErroLista] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    if (!usuario) return;

    setNome(usuario.nome ?? "");
    setEmail(usuario.email ?? "");
    setLatitude(usuario.latitude ?? "");
    setLongitude(usuario.longitude ?? "");
  }, [usuario]);

  const carregarOcorrencias = useCallback(async () => {
    try {
      setErroLista("");

      const resposta = await api.get("/postagens/minhas");

      setOcorrencias(resposta.data.data.postagens ?? []);
    } catch (e) {
      setErroLista(
        mensagemDeErro(e, "Não foi possível carregar suas ocorrências.")
      );
    } finally {
      setCarregandoLista(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarOcorrencias();
    }, [carregarOcorrencias])
  );

  const totais = useMemo(
    () => ({
      pendentes: ocorrencias.filter(
        (o) => o.status === "pendente"
      ).length,

      andamento: ocorrencias.filter(
        (o) => o.status === "andamento"
      ).length,

      resolvidas: ocorrencias.filter(
        (o) => o.status === "resolvida"
      ).length,
    }),
    [ocorrencias]
  );

  const fotoUrl = urlArquivo(usuario?.fotoPerfil);

  async function salvarPerfil() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Atenção", "Preencha seu nome e e-mail.");
      return;
    }

    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const resposta = await api.put("/perfil", {
        nome: nome.trim(),
        email: email.trim(),
        latitude,
        longitude,
      });

      const usuarioAtualizado =
        resposta.data.data.user as Usuario;

      await atualizarUsuario(usuarioAtualizado);

      setEditando(false);
      setSucesso("Dados atualizados com sucesso.");
    } catch (e) {
      setErro(
        mensagemDeErro(e, "Erro ao salvar. Tente novamente.")
      );
    } finally {
      setSalvando(false);
    }
  }

  function cancelarEdicao() {
    setNome(usuario?.nome ?? "");
    setEmail(usuario?.email ?? "");
    setLatitude(usuario?.latitude ?? "");
    setLongitude(usuario?.longitude ?? "");

    setErro("");
    setEditando(false);
  }

  async function escolherFoto() {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso às fotos."
        );
        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (resultado.canceled || !resultado.assets[0]) return;

      const imagem = resultado.assets[0];
      const tipo = imagem.mimeType ?? "image/jpeg";

      if (
        !["image/jpeg", "image/png", "image/webp"].includes(tipo)
      ) {
        Alert.alert(
          "Formato inválido",
          "Envie uma imagem JPG, PNG ou WEBP."
        );
        return;
      }

      if (
        imagem.fileSize &&
        imagem.fileSize > 2 * 1024 * 1024
      ) {
        Alert.alert(
          "Imagem muito grande",
          "A foto deve ter no máximo 2 MB."
        );
        return;
      }

      setEnviandoFoto(true);
      setErro("");
      setSucesso("");

      const formData = new FormData();

      formData.append(
        "foto",
        {
          uri: imagem.uri,
          name: imagem.fileName ?? "foto-perfil.jpg",
          type: tipo,
        } as any
      );

      const resposta = await api.put(
        "/perfil/foto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await atualizarUsuario(
        resposta.data.data.user as Usuario
      );

      setSucesso("Foto atualizada com sucesso.");
    } catch (e) {
      setErro(
        mensagemDeErro(e, "Não foi possível enviar sua foto.")
      );
    } finally {
      setEnviandoFoto(false);
    }
  }

  async function usarLocalizacao() {
    setLocalizando(true);
    setErro("");

    try {
      const permissao =
        await Location.requestForegroundPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          "Autorize o acesso à localização para preencher as coordenadas."
        );
        return;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLatitude(String(posicao.coords.latitude));
      setLongitude(String(posicao.coords.longitude));
      setEditando(true);
    } catch {
      setErro(
        "Não foi possível obter sua localização. Tente novamente."
      );
    } finally {
      setLocalizando(false);
    }
  }

  function confirmarExclusao(id: number) {
    Alert.alert(
      "Excluir ocorrência",
      "Deseja excluir esta ocorrência? Essa ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setErroLista("");

              await api.delete(`/postagens/${id}`);

              setOcorrencias((atual) =>
                atual.filter((item) => item.id !== id)
              );
            } catch (e) {
              setErroLista(
                mensagemDeErro(
                  e,
                  "Não foi possível excluir a ocorrência."
                )
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          style={styles.headerLado}
        >
          <Ionicons
            name="chevron-back"
            size={27}
            color={VERDE_ESCURO}
          />
        </TouchableOpacity>

        <Image
          source={require("@/assets/images/LogoCida.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View
          style={[styles.headerLado, styles.headerDireita]}
        >
          <Ionicons
            name="person-circle-outline"
            size={32}
            color={VERDE_ESCURO}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregarOcorrencias();
              }}
              tintColor={VERDE}
            />
          }
        >
          <Text style={styles.titulo}>Meu Perfil</Text>

          {!usuario?.latitude || !usuario?.longitude ? (
            <View style={styles.aviso}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={VERDE}
              />

              <View style={styles.flex}>
                <Text style={styles.avisoTitulo}>
                  Conclua seu cadastro
                </Text>

                <Text style={styles.avisoTexto}>
                  Falta pouco! Informe sua localização para
                  aproveitar tudo no CidaLink.
                </Text>
              </View>
            </View>
          ) : null}

          {/* CARTÃO DO PERFIL */}
          <View style={styles.cartaoIdentidade}>
            <TouchableOpacity
              style={styles.avatarArea}
              onPress={escolherFoto}
              disabled={enviandoFoto}
              activeOpacity={0.8}
            >
              {fotoUrl ? (
                <Image
                  source={{ uri: fotoUrl }}
                  style={styles.avatarImagem}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarTexto}>
                    {iniciais(usuario?.nome)}
                  </Text>
                </View>
              )}

              <View style={styles.camera}>
                {enviandoFoto ? (
                  <ActivityIndicator
                    size="small"
                    color={TEXTO}
                  />
                ) : (
                  <Ionicons
                    name="camera"
                    size={19}
                    color={TEXTO}
                  />
                )}
              </View>
            </TouchableOpacity>

            <Text style={styles.nomeDestaque}>
              {usuario?.nome ?? "Cidadão"}
            </Text>

            <View style={styles.selo}>
              <Ionicons
                name="shield-checkmark"
                size={17}
                color={VERDE_ESCURO}
              />

              <Text style={styles.seloTexto}>
                {usuario?.tipo === "admin"
                  ? "Administrador"
                  : "Cidadão Ativo"}
              </Text>
            </View>

            <Text style={styles.toqueFoto}>
              Toque na foto para alterar
            </Text>
          </View>

          {/* DADOS CADASTRAIS */}
          <View style={styles.cartao}>
            <View style={styles.cabecalhoCartao}>
              <Text style={styles.tituloCartao}>
                Dados Cadastrais
              </Text>

              {!editando ? (
                <TouchableOpacity
                  style={styles.botaoEditar}
                  onPress={() => setEditando(true)}
                >
                  <Ionicons
                    name="create-outline"
                    size={17}
                    color={VERDE}
                  />
                  <Text style={styles.textoEditar}>
                    Editar
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.acoesEdicao}>
                  <TouchableOpacity
                    onPress={cancelarEdicao}
                    disabled={salvando}
                  >
                    <Text style={styles.cancelarTexto}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.botaoSalvar,
                      salvando && styles.botaoDesabilitado,
                    ]}
                    onPress={salvarPerfil}
                    disabled={salvando}
                  >
                    {salvando ? (
                      <ActivityIndicator
                        color="#fff"
                        size="small"
                      />
                    ) : (
                      <Text style={styles.salvarTexto}>
                        Salvar
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {erro ? (
              <Text style={styles.erro}>{erro}</Text>
            ) : null}

            {sucesso ? (
              <Text style={styles.sucesso}>{sucesso}</Text>
            ) : null}

            <Campo
              icone="person-outline"
              titulo="Nome Completo"
              valor={nome}
              editavel={editando}
              onChange={setNome}
            />

            <Campo
              icone="mail-outline"
              titulo="E-mail"
              valor={email}
              editavel={editando}
              onChange={setEmail}
              teclado="email-address"
            />

            <Campo
              icone="card-outline"
              titulo="CPF"
              valor={usuario?.cpf ?? ""}
              editavel={false}
            />

            <View style={styles.linhaCoordenadas}>
              <View style={styles.coordenada}>
                <Ionicons
                  name="location-outline"
                  size={23}
                  color={VERDE}
                />

                <View style={styles.flex}>
                  <Text style={styles.rotulo}>Latitude</Text>

                  <TextInput
                    value={latitude}
                    onChangeText={setLatitude}
                    editable={editando}
                    keyboardType="numbers-and-punctuation"
                    placeholder="Não informada"
                    placeholderTextColor="#98a2b3"
                    style={[
                      styles.valorCoordenada,
                      !editando && styles.valorDesabilitado,
                    ]}
                  />
                </View>
              </View>

              <View style={styles.separadorVertical} />

              <View style={styles.coordenada}>
                <Ionicons
                  name="location-outline"
                  size={23}
                  color={VERDE}
                />

                <View style={styles.flex}>
                  <Text style={styles.rotulo}>Longitude</Text>

                  <TextInput
                    value={longitude}
                    onChangeText={setLongitude}
                    editable={editando}
                    keyboardType="numbers-and-punctuation"
                    placeholder="Não informada"
                    placeholderTextColor="#98a2b3"
                    style={[
                      styles.valorCoordenada,
                      !editando && styles.valorDesabilitado,
                    ]}
                  />
                </View>
              </View>
            </View>

            {editando ? (
              <TouchableOpacity
                style={styles.botaoLocalizacao}
                onPress={usarLocalizacao}
                disabled={localizando}
              >
                {localizando ? (
                  <ActivityIndicator color={VERDE} />
                ) : (
                  <>
                    <Ionicons
                      name="navigate"
                      size={19}
                      color={VERDE}
                    />

                    <Text
                      style={styles.botaoLocalizacaoTexto}
                    >
                      Usar minha localização
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ) : null}
          </View>

          {/* RESUMO DAS OCORRÊNCIAS */}
          <View style={styles.resumoLinha}>
            <Resumo
              valor={totais.pendentes}
              titulo="Pendentes"
              icone="time-outline"
              tipo="pendente"
            />

            <Resumo
              valor={totais.andamento}
              titulo="Em Andamento"
              icone="sync-outline"
              tipo="andamento"
            />

            <Resumo
              valor={totais.resolvidas}
              titulo="Resolvidas"
              icone="checkmark-circle"
              tipo="resolvida"
            />
          </View>

          {/* MINHAS OCORRÊNCIAS */}
          <View style={styles.secaoOcorrencias}>
            <View style={styles.tituloListaLinha}>
              <Ionicons
                name="megaphone-outline"
                size={24}
                color={VERDE_ESCURO}
              />

              <Text style={styles.tituloLista}>
                Minhas Ocorrências Reportadas
              </Text>
            </View>

            {carregandoLista ? (
              <ActivityIndicator
                color={VERDE}
                style={styles.carregando}
              />
            ) : erroLista ? (
              <View style={styles.estadoLista}>
                <Text style={styles.erro}>
                  {erroLista}
                </Text>

                <TouchableOpacity
                  onPress={carregarOcorrencias}
                >
                  <Text style={styles.linkTentar}>
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              </View>
            ) : ocorrencias.length === 0 ? (
              <View style={styles.estadoLista}>
                <Ionicons
                  name="document-text-outline"
                  size={30}
                  color="#98a2b3"
                />

                <Text style={styles.textoVazio}>
                  Você ainda não reportou nenhuma ocorrência.
                </Text>
              </View>
            ) : (
              ocorrencias.map((item) => (
                <View
                  key={item.id}
                  style={styles.itemOcorrencia}
                >
                  <View
                    style={[
                      styles.iconeOcorrencia,
                      {
                        backgroundColor:
                          item.status === "pendente"
                            ? "#ffeadf"
                            : item.status === "andamento"
                              ? "#e0f2ff"
                              : "#e0f7e8",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        item.categoria === "iluminacao"
                          ? "bulb-outline"
                          : item.categoria === "lixo"
                            ? "trash-outline"
                            : item.categoria === "saneamento"
                              ? "water-outline"
                              : "warning-outline"
                      }
                      size={28}
                      color={CORES_STATUS[item.status].texto}
                    />
                  </View>

                  <View style={styles.detalhesOcorrencia}>
                    <Text
                      style={styles.nomeOcorrencia}
                      numberOfLines={1}
                    >
                      {CATEGORIAS[item.categoria] ??
                        item.categoria}
                    </Text>

                    <Text
                      style={styles.localOcorrencia}
                      numberOfLines={2}
                    >
                      {[
                        item.logradouro,
                        item.bairro,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Local não informado"}
                    </Text>

                    <View style={styles.rodapeOcorrencia}>
                      <View
                        style={[
                          styles.tagStatus,
                          {
                            backgroundColor:
                              CORES_STATUS[item.status].fundo,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tagStatusTexto,
                            {
                              color:
                                CORES_STATUS[item.status].texto,
                            },
                          ]}
                        >
                          {STATUS[item.status] ?? item.status}
                        </Text>
                      </View>

                      <Text style={styles.dataOcorrencia}>
                        {dataFormatada(item.criadoEm)}
                      </Text>
                    </View>
                  </View>

                  {item.status === "pendente" ? (
                    <TouchableOpacity
                      style={styles.botaoExcluir}
                      onPress={() =>
                        confirmarExclusao(item.id)
                      }
                      accessibilityLabel="Excluir ocorrência"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={21}
                        color="#e04444"
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Campo({
  icone,
  titulo,
  valor,
  editavel,
  onChange,
  teclado,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  valor: string;
  editavel: boolean;
  onChange?: (valor: string) => void;
  teclado?: "default" | "email-address";
}) {
  return (
    <View style={styles.campoLinha}>
      <Ionicons
        name={icone}
        size={23}
        color={VERDE}
      />

      <View style={styles.campoConteudo}>
        <Text style={styles.rotulo}>{titulo}</Text>

        <TextInput
          value={valor}
          editable={editavel}
          onChangeText={onChange}
          keyboardType={teclado ?? "default"}
          autoCapitalize={
            teclado === "email-address" ? "none" : "words"
          }
          style={[
            styles.valorCampo,
            !editavel && styles.valorDesabilitado,
          ]}
        />
      </View>
    </View>
  );
}

function Resumo({
  valor,
  titulo,
  icone,
  tipo,
}: {
  valor: number;
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  tipo: "pendente" | "andamento" | "resolvida";
}) {
  const cor = CORES_STATUS[tipo].texto;
  const fundo = CORES_STATUS[tipo].fundo;

  return (
    <View
      style={[
        styles.resumoCard,
        { backgroundColor: fundo },
      ]}
    >
      <Ionicons
        name={icone}
        size={27}
        color={cor}
      />

      <Text style={[styles.resumoValor, { color: TEXTO }]}>
        {valor}
      </Text>

      <Text style={styles.resumoTitulo}>
        {titulo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  header: {
    height: 96,
    paddingTop: Platform.OS === "android" ? 28 : 38,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e8ebef",
  },

  headerLado: {
    width: 42,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerDireita: {
    alignItems: "flex-end",
  },

  logo: {
    width: 128,
    height: 52,
  },

  conteudo: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
    gap: 16,
  },

  titulo: {
    color: VERDE_ESCURO,
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 0,
  },

  aviso: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 13,
    borderRadius: 13,
    backgroundColor: "#e6f5eb",
    borderWidth: 1,
    borderColor: "#a7d8b8",
  },

  avisoTitulo: {
    color: VERDE_ESCURO,
    fontSize: 14,
    fontWeight: "800",
  },

  avisoTexto: {
    color: SUAVE,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },

  cartaoIdentidade: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e8ebef",
    elevation: 2,
  },

  avatarArea: {
    width: 112,
    height: 112,
    marginBottom: 10,
  },

  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: VERDE_ESCURO,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarImagem: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },

  avatarTexto: {
    color: "#fff",
    fontSize: 37,
    fontWeight: "800",
  },

  camera: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f0f2f5",
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  nomeDestaque: {
    color: TEXTO,
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
  },

  selo: {
    marginTop: 9,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 30,
    backgroundColor: "#dcf8e5",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  seloTexto: {
    color: VERDE_ESCURO,
    fontWeight: "700",
    fontSize: 13,
  },

  toqueFoto: {
    color: "#98a2b3",
    fontSize: 10,
    marginTop: 7,
  },

  cartao: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8ebef",
    elevation: 2,
  },

  cabecalhoCartao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  tituloCartao: {
    color: VERDE_ESCURO,
    fontSize: 17,
    fontWeight: "800",
  },

  botaoEditar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 6,
  },

  textoEditar: {
    color: VERDE,
    fontSize: 13,
    fontWeight: "700",
  },

  acoesEdicao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cancelarTexto: {
    color: SUAVE,
    fontSize: 12,
    fontWeight: "600",
  },

  botaoSalvar: {
    backgroundColor: VERDE,
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 8,
    minWidth: 58,
    alignItems: "center",
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  salvarTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  erro: {
    color: "#c62828",
    fontSize: 12,
    marginVertical: 5,
  },

  sucesso: {
    color: "#16804a",
    fontSize: 12,
    marginVertical: 5,
  },

  campoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f3",
  },

  campoConteudo: {
    flex: 1,
  },

  rotulo: {
    color: SUAVE,
    fontSize: 12,
    marginBottom: 2,
  },

  valorCampo: {
    color: TEXTO,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 1,
  },

  valorDesabilitado: {
    color: TEXTO,
  },

  linhaCoordenadas: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 13,
    gap: 10,
  },

  coordenada: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  separadorVertical: {
    width: 1,
    height: 42,
    backgroundColor: "#d9dee5",
  },

  valorCoordenada: {
    color: TEXTO,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 2,
  },

  botaoLocalizacao: {
    borderWidth: 1.4,
    borderColor: VERDE,
    borderRadius: 28,
    minHeight: 46,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  botaoLocalizacaoTexto: {
    color: VERDE_ESCURO,
    fontSize: 14,
    fontWeight: "800",
  },

  resumoLinha: {
    flexDirection: "row",
    gap: 9,
  },

  resumoCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: 17,
    paddingVertical: 12,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },

  resumoValor: {
    fontSize: 25,
    fontWeight: "900",
    marginTop: 3,
  },

  resumoTitulo: {
    color: TEXTO,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 1,
  },

  secaoOcorrencias: {
    gap: 10,
  },

  tituloListaLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#c9dfd3",
    paddingBottom: 10,
  },

  tituloLista: {
    color: VERDE_ESCURO,
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
  },

  carregando: {
    padding: 25,
  },

  estadoLista: {
    alignItems: "center",
    padding: 22,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 8,
  },

  textoVazio: {
    color: SUAVE,
    fontSize: 13,
    textAlign: "center",
  },

  linkTentar: {
    color: VERDE,
    fontWeight: "700",
    fontSize: 13,
  },

  itemOcorrencia: {
    backgroundColor: "#fff",
    borderRadius: 17,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8ebef",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    elevation: 1,
  },

  iconeOcorrencia: {
    width: 62,
    height: 66,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  detalhesOcorrencia: {
    flex: 1,
    minWidth: 0,
  },

  nomeOcorrencia: {
    color: TEXTO,
    fontSize: 14,
    fontWeight: "800",
  },

  localOcorrencia: {
    color: SUAVE,
    fontSize: 11,
    marginTop: 2,
  },

  rodapeOcorrencia: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },

  tagStatus: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  tagStatusTexto: {
    fontSize: 10,
    fontWeight: "800",
  },

  dataOcorrencia: {
    color: SUAVE,
    fontSize: 10,
  },

  botaoExcluir: {
    padding: 5,
  },
});
