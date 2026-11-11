import { useMemo, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import OcorrenciaPopup from "@/components/OcorrenciaPopup";

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

type Ocorrencia = (typeof MOCK_OCORRENCIAS)[0];

function gerarHtml(ocorrencias: Ocorrencia[]) {
  const dados = JSON.stringify(
    ocorrencias.map(({ id, latitude, longitude, status }) => ({
      id,
      latitude,
      longitude,
      status,
    })),
  ).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
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

    var cores = { em_andamento: '#f5a623', resolvido: '#2e7d32' };
    var ocorrencias = ${dados};

    ocorrencias.forEach(function (o) {
      L.circleMarker([o.latitude, o.longitude], {
        radius: 11,
        color: '#ffffff',
        weight: 3,
        fillColor: cores[o.status],
        fillOpacity: 1
      }).addTo(map).on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        window.ReactNativeWebView.postMessage(o.id);
      });
    });

    map.on('click', function () {
      window.ReactNativeWebView.postMessage('close');
    });
  </script>
</body>
</html>`;
}

export default function MapaScreen() {
  const [selecionada, setSelecionada] = useState<Ocorrencia | null>(null);
  const html = useMemo(() => gerarHtml(MOCK_OCORRENCIAS), []);

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        onMessage={(event) => {
          const msg = event.nativeEvent.data;
          if (msg === "close") {
            setSelecionada(null);
            return;
          }
          const item = MOCK_OCORRENCIAS.find((o) => o.id === msg);
          if (item) setSelecionada(item);
        }}
      />

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
