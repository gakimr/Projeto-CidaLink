import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import api from "../../../services/api";
import {
  CATEGORIA_LABEL,
  STATUS_LABEL,
  STATUS_CLASSE,
  urlArquivo,
  avatarPadrao,
  iconePin,
} from "../../../utils/postagens";
import "./Ocorrencia.css";

export default function Ocorrencia() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [postagem, setPostagem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro("");
    setPostagem(null);

    api
      .get(`/postagens/${id}`)
      .then((resposta) => {
        if (!cancelado) setPostagem(resposta.data.data.postagem);
      })
      .catch((error) => {
        if (!cancelado) {
          setErro(
            error.response?.status === 404
              ? "Ocorrência não encontrada. Ela pode ter sido removida."
              : error.response?.data?.data ||
                  "Não foi possível carregar a ocorrência.",
          );
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  function voltar() {
    navigate(window.history.length > 1 ? -1 : "/app");
  }

  const lat = Number(postagem?.latitude);
  const lng = Number(postagem?.longitude);
  const temLocal =
    postagem &&
    postagem.latitude !== "" &&
    postagem.longitude !== "" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng);

  return (
    <section className="ocorrencia-detalhe">
      <button type="button" className="ocorrencia-voltar" onClick={voltar}>
        ← Voltar
      </button>

      {carregando && <p className="ocorrencia-aviso">Carregando...</p>}
      {!carregando && erro && (
        <p className="ocorrencia-aviso ocorrencia-aviso-erro">{erro}</p>
      )}

      {!carregando && postagem && (
        <article className="ocorrencia-card">
          <header className="ocorrencia-cabecalho">
            <img
              src={
                urlArquivo(postagem.autor.fotoPerfil) ||
                avatarPadrao(postagem.autor.nome)
              }
              alt={`Foto de ${postagem.autor.nome}`}
              className="ocorrencia-avatar"
            />

            <div className="ocorrencia-autor">
              <strong>{postagem.autor.nome}</strong>
              <span>
                {new Date(postagem.criadoEm).toLocaleDateString("pt-BR")}
              </span>
            </div>

            <span
              className={`status-tag status-${STATUS_CLASSE[postagem.status] || postagem.status}`}
            >
              {STATUS_LABEL[postagem.status] || postagem.status}
            </span>
          </header>

          {postagem.foto && (
            <img
              src={urlArquivo(postagem.foto)}
              alt="Foto da ocorrência"
              className="ocorrencia-foto"
            />
          )}

          <div className="ocorrencia-corpo">
            <span className="ocorrencia-categoria">
              {CATEGORIA_LABEL[postagem.categoria] || postagem.categoria}
            </span>

            <p className="ocorrencia-local">
              📍 {[postagem.logradouro, postagem.bairro].filter(Boolean).join(" - ")}
            </p>

            <p className="ocorrencia-descricao">{postagem.descricao}</p>

            {postagem.respostaAdmin && (
              <div className="ocorrencia-resposta">
                <strong>Resposta da administração</strong>
                <p>{postagem.respostaAdmin}</p>
              </div>
            )}
          </div>

          {temLocal && (
            <MapContainer
              center={[lat, lng]}
              zoom={17}
              scrollWheelZoom={false}
              className="ocorrencia-mapa"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]} icon={iconePin(postagem.status)} />
            </MapContainer>
          )}
        </article>
      )}
    </section>
  );
}