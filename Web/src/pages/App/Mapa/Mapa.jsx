import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import api from "../../../services/api";
import "./Mapa.css";

const CENTRO = [-21.4041, -48.5136];

const CATEGORIA_LABEL = {
  buraco: "🚧 Buraco na via",
  iluminacao: "💡 Iluminação Pública",
  lixo: "🗑️ Acúmulo de Lixo",
  saneamento: "🚰 Problemas de Saneamento",
  outro: "📌 Outro",
};

const STATUS_LABEL = {
  pendente: "Pendente",
  andamento: "Em andamento",
  resolvida: "Resolvido",
};

const STATUS_CLASSE = {
  pendente: "pendente",
  andamento: "andamento",
  resolvida: "resolvido",
};

function criarIcone(status) {
  return L.divIcon({
    className: "",
    html: `<span class="pin-mapa pin-mapa-${status}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

const ICONES = {
  pendente: criarIcone("pendente"),
  andamento: criarIcone("andamento"),
  resolvida: criarIcone("resolvida"),
};

function urlArquivo(caminho) {
  return caminho ? `${api.defaults.baseURL}${caminho}` : null;
}

function AjustarVista({ pontos }) {
  const map = useMap();

  useEffect(() => {
    if (pontos.length === 0) return;
    const limites = L.latLngBounds(pontos.map((p) => [p.lat, p.lng]));
    map.fitBounds(limites, { padding: [40, 40], maxZoom: 17 });
  }, [pontos, map]);

  return null;
}

export default function Mapa() {
  const [postagens, setPostagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;

    api
      .get("/postagens")
      .then((resposta) => {
        if (!cancelado) setPostagens(resposta.data.data.postagens);
      })
      .catch((error) => {
        if (!cancelado) {
          setErro(
            error.response?.data?.data ||
              "Não foi possível carregar as ocorrências.",
          );
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const pontos = useMemo(
    () =>
      postagens
        .map((p) => ({
          ...p,
          lat: Number(p.latitude),
          lng: Number(p.longitude),
        }))
        .filter(
          (p) =>
            p.latitude !== "" &&
            p.longitude !== "" &&
            Number.isFinite(p.lat) &&
            Number.isFinite(p.lng),
        ),
    [postagens],
  );

  return (
    <>
      <h1 className="app-titulo">Mapa de Ocorrências na Cidade</h1>

      {carregando && <p className="mapa-aviso">Carregando ocorrências...</p>}
      {!carregando && erro && (
        <p className="mapa-aviso mapa-aviso-erro">{erro}</p>
      )}
      {!carregando && !erro && pontos.length === 0 && (
        <p className="mapa-aviso">Nenhuma ocorrência com localização ainda.</p>
      )}

      <div className="mapa-container">
        <MapContainer center={CENTRO} zoom={15} className="mapa-leaflet">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AjustarVista pontos={pontos} />

          {pontos.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={ICONES[p.status] || ICONES.pendente}
            >
              <Popup className="mapa-popup" minWidth={240} maxWidth={240}>
                {p.foto && (
                  <img
                    src={urlArquivo(p.foto)}
                    alt="Foto da ocorrência"
                    className="mapa-popup-foto"
                  />
                )}

                <div className="mapa-popup-corpo">
                  <strong>{CATEGORIA_LABEL[p.categoria] || p.categoria}</strong>
                  <span className="mapa-popup-local">
                    {[p.logradouro, p.bairro].filter(Boolean).join(" - ")}
                  </span>
                  <p>{p.descricao}</p>

                  <span
                    className={`status-tag status-${STATUS_CLASSE[p.status] || p.status}`}
                  >
                    {STATUS_LABEL[p.status] || p.status}
                  </span>

                  {p.respostaAdmin && (
                    <div className="mapa-popup-resposta">
                      <strong>Resposta da administração</strong>
                      <p>{p.respostaAdmin}</p>
                    </div>
                  )}

                  <small className="mapa-popup-autor">
                    Publicado por {p.autor.nome}
                  </small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="legenda">
        <h4>Legenda:</h4>
        <ul>
          <li>
            <span className="legenda-ponto legenda-pendente"></span>Ocorrências
            Pendentes
          </li>
          <li>
            <span className="legenda-ponto legenda-resolvido"></span>Ocorrências
            Resolvidas
          </li>
          <li>
            <span className="legenda-ponto legenda-andamento"></span>Ocorrências
            em Andamento
          </li>
        </ul>
      </div>
    </>
  );
}
