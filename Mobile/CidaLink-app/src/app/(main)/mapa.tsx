import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OcorrenciaPopup from "@/components/OcorrenciaPopup";
import { urlArquivo } from "@/services/api";
import {
  coordenadasDaOcorrencia,
  listarOcorrencias,
  localDaOcorrencia,
  rotuloCategoria,
  type Ocorrencia,
  type StatusOcorrencia,
} from "@/services/ocorrencias";

const COR_STATUS: Record<StatusOcorrencia, string> = {
  pendente: "#d32f2f",
  andamento: "#f5a623",
  resolvida: "#2e7d32",
};

const ROTULO_STATUS: Record<StatusOcorrencia, string> = {
  pendente: "pendente",
  andamento: "em andamento",
  resolvida: "resolvida",
};

// minúsculas e sem acento
function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// O HTML fixo, os pontos são enviados depois via setMarcadores(),
const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>html, body, #map { height: 100%; margin: 0; }</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([-21.4053, -48.5124], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var cores = { pendente: '#d32f2f', andamento: '#f5a623', resolvida: '#2e7d32' };
    var camada = L.layerGroup().addTo(map);
    var enquadrou = false;

    window.setMarcadores = function (lista) {
      camada.clearLayers();
      var pontos = [];

      lista.forEach(function (o) {
        pontos.push([o.latitude, o.longitude]);
        L.circleMarker([o.latitude, o.longitude], {
          radius: 11,
          color: '#ffffff',
          weight: 3,
          fillColor: cores[o.status] || '#777777',
          fillOpacity: 1
        }).addTo(camada).on('click', function (e) {
          L.DomEvent.stopPropagation(e);
          window.ReactNativeWebView.postMessage(String(o.id));
        });
      });

      // enquadra todos os pontos só na primeira carga
      if (!enquadrou && pontos.length > 0) {
        enquadrou = true;
        map.fitBounds(pontos, { padding: [60, 60], maxZoom: 16 });
      }
    };

    // usado pela busca: voa até o ponto, deixando-o um pouco acima do centro
    // para o popup (parte de baixo da tela) não cobrir o marcador
    window.focarEm = function (lat, lng) {
      var zoom = 17;
      var alvo = map.project([lat, lng], zoom).add([0, 90]);
      map.flyTo(map.unproject(alvo, zoom), zoom, { duration: 0.8 });
    };

    map.on('click', function () {
      window.ReactNativeWebView.postMessage('close');
    });

    window.ReactNativeWebView.postMessage('pronto');
  </script>
</body>
</html>`;

export default function MapaScreen() {
  const webViewRef = useRef<WebView>(null);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [selecionada, setSelecionada] = useState<Ocorrencia | null>(null);
  const [mapaPronto, setMapaPronto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    try {
      setOcorrencias(await listarOcorrencias());
    } catch {
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const itens = useMemo(
    () =>
      ocorrencias.flatMap((o) => {
        const coords = coordenadasDaOcorrencia(o);
        return coords ? [{ ocorrencia: o, ...coords }] : [];
      }),
    [ocorrencias],
  );

  const pontos = useMemo(
    () =>
      itens.map(({ ocorrencia, latitude, longitude }) => ({
        id: ocorrencia.id,
        status: ocorrencia.status,
        latitude,
        longitude,
      })),
    [itens],
  );

  useEffect(() => {
    if (!mapaPronto) return;
    webViewRef.current?.injectJavaScript(
      `window.setMarcadores(${JSON.stringify(pontos)}); true;`,
    );
  }, [pontos, mapaPronto]);

  const resultados = useMemo(() => {
    const termos = normalizar(busca).split(/\s+/).filter(Boolean);
    if (termos.length === 0) return [];

    return itens.filter(({ ocorrencia: o }) => {
      const texto = normalizar(
        [
          rotuloCategoria(o.categoria),
          o.categoria,
          o.descricao,
          o.logradouro,
          o.bairro,
          o.autor.nome,
          ROTULO_STATUS[o.status],
        ].join(" "),
      );
      return termos.every((termo) => texto.includes(termo));
    });
  }, [busca, itens]);

  function fecharBusca() {
    setBuscando(false);
    setBusca("");
    Keyboard.dismiss();
  }

  function escolherResultado(item: (typeof itens)[number]) {
    setSelecionada(item.ocorrencia);
    webViewRef.current?.injectJavaScript(
      `window.focarEm(${item.latitude}, ${item.longitude}); true;`,
    );
    fecharBusca();
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.map}
        originWhitelist={["*"]}
        // baseUrl evita bloqueio dos tiles do OpenStreetMap por falta de Referer
        source={{ html: HTML, baseUrl: "https://cidalink.app" }}
        javaScriptEnabled
        onMessage={(event) => {
          const msg = event.nativeEvent.data;
          if (msg === "pronto") return setMapaPronto(true);
          if (msg === "close") {
            setSelecionada(null);
            if (buscando) fecharBusca();
            return;
          }
          const item = ocorrencias.find((o) => String(o.id) === msg);
          if (item) setSelecionada(item);
        }}
      />

      <View style={styles.header}>
        {buscando ? (
          <>
            <TouchableOpacity
              onPress={fecharBusca}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TextInput
              style={styles.campoBusca}
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar por tipo, rua ou bairro"
              placeholderTextColor="#999"
              autoFocus
              returnKeyType="search"
              autoCorrect={false}
            />
            {busca.length > 0 ? (
              <TouchableOpacity
                onPress={() => setBusca("")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={22} color="#999" />
              </TouchableOpacity>
            ) : (
              <View style={styles.espacoIcone} />
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setBuscando(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="search-outline" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/LogoCida.png")}
                style={styles.logoIcon}
              />
            </View>
            <Ionicons name="person-circle-outline" size={32} color="#333" />
          </>
        )}
      </View>

      {buscando && busca.trim().length > 0 && (
        <View style={styles.resultados}>
          {resultados.length === 0 ? (
            <Text style={styles.semResultado}>
              Nenhuma ocorrência encontrada.
            </Text>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {resultados.map((item) => {
                const o = item.ocorrencia;
                return (
                  <TouchableOpacity
                    key={o.id}
                    style={styles.resultado}
                    onPress={() => escolherResultado(item)}
                  >
                    <View
                      style={[
                        styles.bolinha,
                        { backgroundColor: COR_STATUS[o.status] },
                      ]}
                    />
                    <View style={styles.resultadoTextos}>
                      <Text style={styles.resultadoTitulo} numberOfLines={1}>
                        {rotuloCategoria(o.categoria)}
                      </Text>
                      <Text style={styles.resultadoLocal} numberOfLines={1}>
                        {localDaOcorrencia(o)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}

      {carregando && (
        <ActivityIndicator
          style={styles.loading}
          size="small"
          color="#2e7d32"
        />
      )}

      {selecionada && (
        <OcorrenciaPopup
          titulo={rotuloCategoria(selecionada.categoria)}
          categoria={rotuloCategoria(selecionada.categoria)}
          local={localDaOcorrencia(selecionada)}
          descricao={selecionada.descricao}
          status={selecionada.status}
          foto={urlArquivo(selecionada.foto)}
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
  campoBusca: {
    flex: 1,
    height: 44,
    marginHorizontal: 12,
    fontSize: 15,
    color: "#222",
  },
  espacoIcone: {
    width: 22,
  },
  resultados: {
    position: "absolute",
    top: 114,
    left: 16,
    right: 16,
    maxHeight: 300,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  semResultado: {
    padding: 18,
    color: "#777",
    fontSize: 13,
    textAlign: "center",
  },
  resultado: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  bolinha: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  resultadoTextos: {
    flex: 1,
  },
  resultadoTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },
  resultadoLocal: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  loading: {
    position: "absolute",
    top: 118,
    alignSelf: "center",
  },
});
