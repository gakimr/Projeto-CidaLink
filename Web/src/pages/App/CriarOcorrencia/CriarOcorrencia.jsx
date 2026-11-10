import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import api from "../../../services/api";
import "../../../utils/leafletIcone";
import "./CriarOcorrencia.css";

const CIDADE = "Taquaritinga";
const CENTRO = [-21.4041, -48.5136];
const NOMINATIM = "https://nominatim.openstreetmap.org";

function foraDaCidade(end = {}) {
  const municipio =
    end.city || end.town || end.village || end.municipality || "";
  return municipio && municipio.toLowerCase() !== CIDADE.toLowerCase();
}

function montarRua(end = {}) {
  return [end.road, end.house_number].filter(Boolean).join(", ");
}

// o "suburb" do OSM cobre uma área enorme na cidade, então fica de fora
function bairroOsm(end = {}) {
  return end.neighbourhood || end.quarter || "";
}

function rotuloResultado(r) {
  const end = r.address || {};
  const rua = end.road || r.display_name.split(", ")[0];
  const bairro = bairroOsm(end);
  return bairro ? `${rua}, ${bairro}` : rua;
}

function ControleMapa({ foco, onClicar }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onClicar(e.latlng);
    },
  });

  useEffect(() => {
    if (foco) map.flyTo([foco.lat, foco.lng], 17);
  }, [foco, map]);

  return null;
}

export default function CriarOcorrencia() {
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState(null);

  const [ponto, setPonto] = useState(null); // { lat, lng }
  const [foco, setFoco] = useState(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [buscandoReverso, setBuscandoReverso] = useState(false);
  const [statusLocal, setStatusLocal] = useState("");

  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [bairrosLista, setBairrosLista] = useState([]);

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const buscaReversa = useRef(0);
  const bairroEditado = useRef(false); // true se a pessoa digitou o bairro
  const navigate = useNavigate();

  function sugerirBairro(end) {
    const nome = bairroOsm(end);
    if (nome && !bairroEditado.current) setBairro(nome);
  }

  useEffect(() => {
    api
      .get("/bairros")
      .then((resposta) => setBairrosLista(resposta.data.data.bairros))
      .catch(() => {}); // sem sugestões, o campo continua funcionando
  }, []);

  // clique no mapa, marcador arrastado ou GPS: descobre o endereço do ponto
  async function selecionarPonto({ lat, lng }) {
    const id = ++buscaReversa.current;
    setMostrarMapa(true);
    setPonto({ lat, lng });
    setResultados([]);
    setBuscandoReverso(true);
    setStatusLocal("");
    setErro("");

    try {
      const resposta = await fetch(
        `${NOMINATIM}/reverse?format=json&zoom=18&addressdetails=1&lat=${lat}&lon=${lng}`,
      );
      const dados = await resposta.json();
      if (id !== buscaReversa.current) return;

      const end = dados.address || {};
      if (foraDaCidade(end)) {
        setPonto(null);
        setLogradouro("");
        setStatusLocal(
          `Esse ponto fica fora de ${CIDADE}. Escolha um local dentro da cidade.`,
        );
        return;
      }

      const rua = montarRua(end);
      setLogradouro(rua);
      sugerirBairro(end);
      if (!rua) {
        setStatusLocal(
          "Não achamos o nome da rua nesse ponto. Preencha o logradouro abaixo.",
        );
      }
    } catch {
      if (id !== buscaReversa.current) return;
      setStatusLocal(
        "Não foi possível buscar o endereço. Preencha o logradouro abaixo.",
      );
    } finally {
      if (id === buscaReversa.current) setBuscandoReverso(false);
    }
  }

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      setErro("Seu navegador não suporta geolocalização.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const alvo = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setFoco(alvo);
        selecionarPonto(alvo);
      },
      () =>
        setErro(
          "Não foi possível obter sua localização. Busque a rua ou marque no mapa.",
        ),
    );
  }

  async function buscarEndereco() {
    const termo = termoBusca.trim();
    if (termo.length < 3) {
      setStatusLocal("Digite ao menos 3 letras do nome da rua.");
      return;
    }

    setBuscandoEndereco(true);
    setStatusLocal("");
    setResultados([]);
    setErro("");

    try {
      const consulta = encodeURIComponent(`${termo}, ${CIDADE}, SP, Brasil`);
      const resposta = await fetch(
        `${NOMINATIM}/search?format=json&limit=5&addressdetails=1&countrycodes=br&q=${consulta}`,
      );
      const dados = await resposta.json();

      const daCidade = dados.filter((r) => !foraDaCidade(r.address));
      if (daCidade.length === 0) {
        setStatusLocal(
          "Nenhum endereço encontrado. Tente só o nome da rua, use sua localização ou marque no mapa.",
        );
      }

      // não repete resultados com o mesmo nome
      const vistos = new Set();
      const unicos = daCidade.filter((r) => {
        const rotulo = rotuloResultado(r);
        if (vistos.has(rotulo)) return false;
        vistos.add(rotulo);
        return true;
      });
      setResultados(unicos);
    } catch {
      setStatusLocal(
        "Não foi possível buscar agora. Tente de novo ou marque no mapa.",
      );
    } finally {
      setBuscandoEndereco(false);
    }
  }

  function escolherResultado(r) {
    const alvo = { lat: Number(r.lat), lng: Number(r.lon) };
    buscaReversa.current++; // descarta busca de endereço em andamento
    setBuscandoReverso(false);
    setPonto(alvo);
    setFoco(alvo);
    setLogradouro(montarRua(r.address) || termoBusca.trim());
    sugerirBairro(r.address);
    setResultados([]);
    setStatusLocal("");
    setErro("");
  }

  function handleFoto(e) {
    const arquivo = e.target.files[0];

    if (!arquivo) {
      setFoto(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Envie uma imagem JPG, PNG ou WEBP.");
      e.target.value = "";
      return;
    }
    if (arquivo.size > 2 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 2 MB.");
      e.target.value = "";
      return;
    }

    setErro("");
    setFoto(arquivo);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!categoria) return setErro("Selecione a categoria.");
    if (!ponto) {
      return setErro(
        "Informe o local: busque a rua, use sua localização ou marque no mapa.",
      );
    }
    if (logradouro.trim().length < 3) return setErro("Informe o logradouro.");
    if (!bairro.trim()) return setErro("Informe o bairro.");
    if (!descricao.trim()) return setErro("Descreva o problema.");

    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append("categoria", categoria);
      formData.append("descricao", descricao.trim());
      formData.append("logradouro", logradouro.trim());
      formData.append("bairro", bairro.trim());
      formData.append("latitude", String(ponto.lat));
      formData.append("longitude", String(ponto.lng));
      if (foto) formData.append("foto", foto);

      await api.post("/postagens", formData);
      navigate("/app");
    } catch (error) {
      setErro(
        error.response?.data?.data || "Erro ao registrar. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1 className="app-titulo">Criar Ocorrência</h1>

      <div className="ocorrencia-page">
        <form className="form-card" onSubmit={handleSubmit}>
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecione o tipo</option>
            <option value="buraco">Buraco na Rua</option>
            <option value="iluminacao">Iluminação Pública</option>
            <option value="lixo">Acúmulo de Lixo</option>
            <option value="saneamento">Problemas de Saneamento</option>
            <option value="outro">Outro</option>
          </select>

          <label htmlFor="busca">Local da ocorrência</label>
          <button
            type="button"
            className="btn-local"
            onClick={usarMinhaLocalizacao}
          >
            📍 Usar minha localização
          </button>

          <div className="busca-endereco">
            <input
              id="busca"
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  buscarEndereco();
                }
              }}
              placeholder="Ou busque a rua (ex: Rua General Osório)"
            />
            <button
              type="button"
              className="btn-local"
              onClick={buscarEndereco}
              disabled={buscandoEndereco}
            >
              {buscandoEndereco ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {resultados.length > 0 && (
            <ul className="resultados-busca">
              {resultados.map((r) => (
                <li key={r.place_id}>
                  <button type="button" onClick={() => escolherResultado(r)}>
                    {rotuloResultado(r)}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {buscandoReverso && (
            <p className="form-status">Buscando endereço...</p>
          )}
          {!buscandoReverso && statusLocal && (
            <p className="form-status form-status-erro">{statusLocal}</p>
          )}

          {ponto || mostrarMapa ? (
            <>
              <p className="form-dica">
                {ponto
                  ? "Local marcado. Arraste o marcador ou clique no mapa pra ajustar."
                  : "Clique no mapa pra marcar o local."}
              </p>
              <MapContainer
                center={ponto ? [ponto.lat, ponto.lng] : CENTRO}
                zoom={ponto ? 17 : 15}
                className="seletor-mapa"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ControleMapa foco={foco} onClicar={selecionarPonto} />
                {ponto && (
                  <Marker
                    position={[ponto.lat, ponto.lng]}
                    draggable
                    eventHandlers={{
                      dragend(e) {
                        const p = e.target.getLatLng();
                        selecionarPonto({ lat: p.lat, lng: p.lng });
                      },
                    }}
                  />
                )}
              </MapContainer>
            </>
          ) : (
            <button
              type="button"
              className="btn-sugestao"
              onClick={() => setMostrarMapa(true)}
            >
              🗺️ Marcar no mapa manualmente
            </button>
          )}

          <div className="form-linha">
            <div className="form-campo">
              <label htmlFor="logradouro">Logradouro</label>
              <input
                id="logradouro"
                type="text"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
                placeholder="Preenchido ao marcar o local"
              />
            </div>

            <div className="form-campo">
              <label htmlFor="bairro">Bairro</label>
              <input
                id="bairro"
                type="text"
                list="lista-bairros"
                value={bairro}
                onChange={(e) => {
                  setBairro(e.target.value);
                  bairroEditado.current = e.target.value.trim() !== "";
                }}
                placeholder="Digite ou escolha o bairro"
              />
              <datalist id="lista-bairros">
                {bairrosLista.map((b) => (
                  <option key={b.id} value={b.nome} />
                ))}
              </datalist>
            </div>
          </div>

          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o problema e informe pontos de referência (ex: próximo à praça central, buraco profundo na via)..."
          />

          <label htmlFor="foto">Anexar Foto</label>
          <input
            id="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFoto}
          />

          {erro && <p className="form-erro">{erro}</p>}

          <button
            type="submit"
            className="btn btn-primario btn-full"
            disabled={enviando || buscandoReverso}
          >
            {enviando ? "Registrando..." : "Registrar Ocorrência"}
          </button>
        </form>
      </div>
    </>
  );
}
