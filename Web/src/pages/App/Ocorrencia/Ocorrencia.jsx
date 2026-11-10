import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import {
  CATEGORIA_LABEL,
  STATUS_LABEL,
  STATUS_CLASSE,
  urlArquivo,
  avatarPadrao,
  iconePin,
} from "../../../utils/postagens";
import "./Ocorrencia.css";

const OPCOES_STATUS = [
  { valor: "pendente", rotulo: "Pendente" },
  { valor: "andamento", rotulo: "Em andamento" },
  { valor: "resolvida", rotulo: "Concluída" },
];

export default function Ocorrencia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ehAdmin = user?.tipo === "admin";

  const [postagem, setPostagem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // painel do administrador
  const [statusEscolhido, setStatusEscolhido] = useState("pendente");
  const [resposta, setResposta] = useState("");
  const [salvandoAdmin, setSalvandoAdmin] = useState(false);
  const [erroAdmin, setErroAdmin] = useState("");
  const [sucessoAdmin, setSucessoAdmin] = useState("");

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro("");
    setPostagem(null);
    setErroAdmin("");
    setSucessoAdmin("");

    api
      .get(`/postagens/${id}`)
      .then((res) => {
        if (cancelado) return;
        const p = res.data.data.postagem;
        setPostagem(p);
        setStatusEscolhido(p.status);
        setResposta(p.respostaAdmin || "");
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

  async function handleResponder(e) {
    e.preventDefault();
    setErroAdmin("");
    setSucessoAdmin("");
    setSalvandoAdmin(true);

    try {
      const res = await api.put(`/postagens/${id}/status`, {
        status: statusEscolhido,
        respostaAdmin: resposta,
      });
      const atualizada = res.data.data.postagem;
      setPostagem(atualizada);
      setStatusEscolhido(atualizada.status);
      setResposta(atualizada.respostaAdmin || "");
      setSucessoAdmin("Ocorrência atualizada com sucesso.");
    } catch (error) {
      setErroAdmin(
        error.response?.data?.data ||
          "Não foi possível atualizar. Tente novamente.",
      );
    } finally {
      setSalvandoAdmin(false);
    }
  }

  const lat = Number(postagem?.latitude);
  const lng = Number(postagem?.longitude);
  const temLocal =
    postagem &&
    postagem.latitude !== "" &&
    postagem.longitude !== "" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng);

  const temLateral = temLocal || ehAdmin;

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
        <div
          className={`ocorrencia-grade ${temLateral ? "" : "ocorrencia-grade-unica"}`}
        >
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
                📍{" "}
                {[postagem.logradouro, postagem.bairro]
                  .filter(Boolean)
                  .join(" - ")}
              </p>

              <p className="ocorrencia-descricao">{postagem.descricao}</p>

              {postagem.respostaAdmin && (
                <div className="ocorrencia-resposta">
                  <strong>Resposta da administração</strong>
                  <p>{postagem.respostaAdmin}</p>
                </div>
              )}
            </div>
          </article>

          {temLateral && (
            <div className="ocorrencia-lateral">
              {temLocal && (
                <div className="ocorrencia-mapa-card">
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
                    <Marker
                      position={[lat, lng]}
                      icon={iconePin(postagem.status)}
                    />
                  </MapContainer>
                </div>
              )}

              {ehAdmin && (
                <form className="ocorrencia-admin" onSubmit={handleResponder}>
                  <h2>Atualizar status e responder</h2>

                  <label>Alterar status</label>
                  <div className="status-opcoes">
                    {OPCOES_STATUS.map((o) => (
                      <button
                        key={o.valor}
                        type="button"
                        className={`status-opcao ${
                          statusEscolhido === o.valor
                            ? `status-opcao-ativa-${o.valor}`
                            : ""
                        }`}
                        onClick={() => setStatusEscolhido(o.valor)}
                      >
                        {o.rotulo}
                      </button>
                    ))}
                  </div>

                  <label htmlFor="resposta-admin">
                    Resposta oficial ao cidadão
                  </label>
                  <textarea
                    id="resposta-admin"
                    value={resposta}
                    maxLength={1000}
                    onChange={(e) => setResposta(e.target.value)}
                    placeholder="Descreva as ações que serão tomadas, o prazo de resolução ou a solução final."
                  />
                  <small className="ocorrencia-admin-contador">
                    {resposta.length}/1000
                  </small>

                  {erroAdmin && (
                    <p className="ocorrencia-admin-msg ocorrencia-admin-erro">
                      {erroAdmin}
                    </p>
                  )}
                  {sucessoAdmin && (
                    <p className="ocorrencia-admin-msg ocorrencia-admin-ok">
                      {sucessoAdmin}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primario"
                    disabled={salvandoAdmin}
                  >
                    {salvandoAdmin ? "Salvando..." : "Salvar alterações"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
