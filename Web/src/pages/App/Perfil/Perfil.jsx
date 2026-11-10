import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";
import { CompleteCadastro } from "../../../utils/Cadastro";
import "./Perfil.css";

const CATEGORIA_LABEL = {
  buraco: "Buraco na Rua",
  iluminacao: "Iluminação Pública",
  lixo: "Acúmulo de Lixo",
  saneamento: "Problemas de Saneamento",
  outro: "Outro",
};

const STATUS_LABEL = {
  pendente: "Pendente",
  andamento: "Em Andamento",
  resolvida: "Resolvida",
};

function dadosIniciais(user) {
  return {
    nome: user.nome || "",
    email: user.email || "",
    latitude: user.latitude || "",
    longitude: user.longitude || "",
  };
}

export default function Perfil() {
  const { user, atualizarUser } = useAuth();

  const incompleto = !CompleteCadastro(user);

  const [editando, setEditando] = useState(incompleto);
  const [dados, setDados] = useState(() => dadosIniciais(user));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState("");

  const inputFotoRef = useRef(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const fotoUrl = user.fotoPerfil
    ? `${api.defaults.baseURL}${user.fotoPerfil}`
    : null;

  const iniciais = user.nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");

  function handleChange(campo, valor) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleCancelar() {
    setDados(dadosIniciais(user));
    setErro("");
    setEditando(false);
  }

  async function handleSalvar() {
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const resposta = await api.put("/perfil", dados);
      atualizarUser(resposta.data.data.user);
      setEditando(false);
      setSucesso("Dados atualizados com sucesso.");
    } catch (error) {
      setErro(error.response?.data?.data || "Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id) {
    if (
      !window.confirm(
        "Excluir esta ocorrência? Essa ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    setErroLista("");
    try {
      await api.delete(`/postagens/${id}`);
      setOcorrencias((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      setErroLista(
        error.response?.data?.data ||
          "Não foi possível excluir. Tente novamente.",
      );
    }
  }

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      setErro("Seu navegador não suporta geolocalização.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDados((prev) => ({
          ...prev,
          latitude: String(pos.coords.latitude),
          longitude: String(pos.coords.longitude),
        }));
        setErro("");
      },
      () =>
        setErro(
          "Não foi possível obter sua localização. Preencha manualmente.",
        ),
    );
  }

  async function handleFoto(e) {
    const arquivo = e.target.files[0];
    e.target.value = "";
    if (!arquivo) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Envie uma imagem JPG, PNG ou WEBP.");
      return;
    }
    if (arquivo.size > 2 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 2 MB.");
      return;
    }

    setErro("");
    setSucesso("");
    setEnviandoFoto(true);

    try {
      const formData = new FormData();
      formData.append("foto", arquivo);

      const resposta = await api.put("/perfil/foto", formData);
      atualizarUser(resposta.data.data.user);
      setSucesso("Foto atualizada com sucesso.");
    } catch (error) {
      setErro(error.response?.data?.data || "Erro ao enviar a foto.");
    } finally {
      setEnviandoFoto(false);
    }
  }

  const pendentes = ocorrencias.filter((o) => o.status === "pendente").length;
  const andamento = ocorrencias.filter((o) => o.status === "andamento").length;
  const resolvidas = ocorrencias.filter((o) => o.status === "resolvida").length;

  useEffect(() => {
    let cancelado = false;

    api
      .get("/postagens/minhas")
      .then((resposta) => {
        if (!cancelado) setOcorrencias(resposta.data.data.postagens);
      })
      .catch((error) => {
        if (!cancelado) {
          setErroLista(
            error.response?.data?.data ||
              "Não foi possível carregar suas ocorrências.",
          );
        }
      })
      .finally(() => {
        if (!cancelado) setCarregandoLista(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <>
      <h1 className="app-titulo">Meu Perfil</h1>

      {incompleto && (
        <div className="perfil-aviso">
          <strong>Conclua seu cadastro</strong>
          <p>
            Falta pouco! Informe sua localização para aproveitar tudo no
            CidaLink.
          </p>
        </div>
      )}

      <div className="perfil-page">
        <div className="perfil-card">
          <div className="perfil-avatar-bloco">
            <button
              type="button"
              className="perfil-avatar-botao"
              onClick={() => inputFotoRef.current.click()}
              disabled={enviandoFoto}
              title="Alterar foto"
            >
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt="Foto de perfil"
                  className="perfil-avatar-img"
                />
              ) : (
                <div className="perfil-avatar">{iniciais}</div>
              )}
              <span className="perfil-avatar-editar">
                {enviandoFoto ? "Enviando..." : "Alterar foto"}
              </span>
            </button>

            <input
              ref={inputFotoRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleFoto}
            />

            <h2>{user.nome}</h2>
            <span className="perfil-badge">
              {user.tipo === "admin" ? "Administrador" : "Cidadão Ativo"}
            </span>
          </div>

          <div className="perfil-divisor" />

          <div className="perfil-dados">
            <div className="perfil-dados-topo">
              <h3>Dados Cadastrais</h3>

              <div className="perfil-acoes">
                {editando && (
                  <button
                    type="button"
                    className="btn btn-secundario"
                    onClick={handleCancelar}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primario"
                  disabled={salvando}
                  onClick={() =>
                    editando ? handleSalvar() : setEditando(true)
                  }
                >
                  {salvando ? "Salvando..." : editando ? "Salvar" : "Editar"}
                </button>
              </div>
            </div>

            {erro && <p className="perfil-msg perfil-msg-erro">{erro}</p>}
            {sucesso && <p className="perfil-msg perfil-msg-ok">{sucesso}</p>}

            <div className="perfil-grid">
              <div className="perfil-campo">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  id="nome"
                  type="text"
                  value={dados.nome}
                  disabled={!editando}
                  onChange={(e) => handleChange("nome", e.target.value)}
                />
              </div>

              <div className="perfil-campo">
                <label htmlFor="cpf">CPF</label>
                <input id="cpf" type="text" value={user.cpf || ""} disabled />
              </div>

              <div className="perfil-campo">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={dados.email}
                  disabled={!editando}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="perfil-campo">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  type="text"
                  value={dados.latitude}
                  disabled={!editando}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                />
              </div>

              <div className="perfil-campo">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  type="text"
                  value={dados.longitude}
                  disabled={!editando}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                />
              </div>
            </div>

            {editando && (
              <button
                type="button"
                className="btn-localizacao"
                onClick={usarMinhaLocalizacao}
              >
                📍 Usar minha localização
              </button>
            )}
          </div>
        </div>

        <div className="resumo-card">
          <h3>Resumo das Ocorrências</h3>
          <div className="resumo-grid">
            <div className="resumo-item resumo-pendente">
              <strong>{pendentes}</strong>
              <span>Pendentes</span>
            </div>
            <div className="resumo-item resumo-andamento">
              <strong>{andamento}</strong>
              <span>Em Andamento</span>
            </div>
            <div className="resumo-item resumo-resolvida">
              <strong>{resolvidas}</strong>
              <span>Resolvidas</span>
            </div>
          </div>
        </div>

        <div className="lista-card">
          <h3>Minhas Ocorrências Reportadas</h3>

          {carregandoLista && <p className="lista-vazia">Carregando...</p>}

          {erroLista && (
            <p className="perfil-msg perfil-msg-erro">{erroLista}</p>
          )}

          {!carregandoLista && !erroLista && ocorrencias.length === 0 && (
            <p className="lista-vazia">
              Você ainda não reportou nenhuma ocorrência.
            </p>
          )}

          <ul className="lista-ocorrencias">
            {ocorrencias.map((o) => (
              <li key={o.id} className="lista-item">
                <div className="lista-item-info">
                  <span className={`status-ponto status-${o.status}`}></span>
                  <div>
                    <strong>
                      {CATEGORIA_LABEL[o.categoria] || o.categoria}
                    </strong>
                    <p>
                      {[o.logradouro, o.bairro].filter(Boolean).join(" - ")}
                    </p>
                  </div>
                </div>

                <div className="lista-item-acoes">
                  <span className={`status-tag status-tag-${o.status}`}>
                    {STATUS_LABEL[o.status]}
                  </span>
                  <span className="lista-item-data">
                    {new Date(o.criadoEm).toLocaleDateString("pt-BR")}
                  </span>
                  {o.status === "pendente" && (
                    <button
                      type="button"
                      className="btn-icone btn-icone-excluir"
                      title="Excluir"
                      onClick={() => handleExcluir(o.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
