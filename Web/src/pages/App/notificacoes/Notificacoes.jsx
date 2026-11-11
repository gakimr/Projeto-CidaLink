import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../services/api";
import "./Notificacoes.css";

const FILTROS = [
  { id: "todas", rotulo: "Todas" },
  { id: "nao-lidas", rotulo: "Não lidas" },
  { id: "lidas", rotulo: "Lidas" },
];

const ICONE_TIPO = {
  nova_ocorrencia: "🚨",
  nova_mensagem: "💬",
  status_atualizado: "📢",
};

function formatarData(data) {
  if (!data) return "";

  const dataNotificacao = new Date(data);

  if (Number.isNaN(dataNotificacao.getTime())) return "";

  return dataNotificacao.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarNotificacoes = useCallback(async (silencioso = false) => {
    try {
      if (silencioso) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }

      const resposta = await api.get("/notificacoes");

      const lista = resposta.data?.data?.notificacoes;

      if (!Array.isArray(lista)) {
        throw new Error("Formato de notificações inválido.");
      }

      setNotificacoes(lista);
      setErro("");
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);

      setErro(
        error.response?.data?.data ||
          "Não foi possível carregar suas notificações."
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarNotificacoes();

    const intervalo = setInterval(() => {
      carregarNotificacoes(true);
    }, 10000);

    return () => clearInterval(intervalo);
  }, [carregarNotificacoes]);

  const naoLidas = useMemo(
    () => notificacoes.filter((n) => !n.lida_em).length,
    [notificacoes]
  );

  const notificacoesFiltradas = useMemo(() => {
    if (filtro === "nao-lidas") {
      return notificacoes.filter((n) => !n.lida_em);
    }

    if (filtro === "lidas") {
      return notificacoes.filter((n) => n.lida_em);
    }

    return notificacoes;
  }, [notificacoes, filtro]);

  async function marcarLida(id) {
    const notificacao = notificacoes.find((n) => n.id === id);

    if (!notificacao || notificacao.lida_em) return;

    // Atualiza a tela imediatamente
    setNotificacoes((lista) =>
      lista.map((n) =>
        n.id === id
          ? { ...n, lida_em: new Date().toISOString() }
          : n
      )
    );

    try {
      await api.put(`/notificacoes/${id}/lida`);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);

      // Recupera os dados verdadeiros do servidor
      carregarNotificacoes(true);

      setErro("Não foi possível marcar a notificação como lida.");
    }
  }

  async function marcarTodasLidas() {
    if (naoLidas === 0) return;

    const listaAnterior = notificacoes;

    setNotificacoes((lista) =>
      lista.map((n) => ({
        ...n,
        lida_em: n.lida_em || new Date().toISOString(),
      }))
    );

    try {
      await api.put("/notificacoes/lidas");
      setErro("");
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);

      setNotificacoes(listaAnterior);
      setErro("Não foi possível atualizar as notificações.");
    }
  }

  return (
    <section className="notificacoes-pagina">
      <div className="notificacoes-topo">
        <h1 className="app-titulo">Notificações</h1>

        <p>
          Acompanhe as novidades e atualizações das suas ocorrências.
        </p>
      </div>

      <div className="notificacoes-resumo">
        <div className="notificacoes-resumo-icone">
          🔔
        </div>

        <div className="notificacoes-resumo-info">
          <strong>
            {naoLidas === 1
              ? "1 notificação não lida"
              : `${naoLidas} notificações não lidas`}
          </strong>

          <span>
            {naoLidas > 0
              ? "Você tem novidades para conferir."
              : "Você está em dia com suas notificações."}
          </span>
        </div>

        {naoLidas > 0 && (
          <span className="notificacoes-contador">
            {naoLidas}
          </span>
        )}
      </div>

      <div className="notificacoes-acoes">
        <div className="notificacoes-filtros">
          {FILTROS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`notificacoes-filtro ${
                filtro === item.id
                  ? "notificacoes-filtro-ativo"
                  : ""
              }`}
              onClick={() => setFiltro(item.id)}
            >
              {item.rotulo}

              {item.id === "nao-lidas" && naoLidas > 0 && (
                <span className="notificacoes-filtro-contador">
                  {naoLidas}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="notificacoes-botoes">
          <button
            type="button"
            className="notificacoes-atualizar"
            onClick={() => carregarNotificacoes(true)}
            disabled={atualizando || carregando}
          >
            <span className={atualizando ? "icone-girando" : ""}>
              ↻
            </span>
            Atualizar
          </button>

          <button
            type="button"
            className="notificacoes-marcar-todas"
            onClick={marcarTodasLidas}
            disabled={naoLidas === 0}
          >
            Marcar todas como lidas
          </button>
        </div>
      </div>

      <div className="notificacoes-lista">
        {carregando && (
          <p className="notificacoes-aviso">
            Carregando notificações...
          </p>
        )}

        {!carregando && erro && (
          <div className="notificacoes-erro">
            <p>{erro}</p>

            <button
              type="button"
              onClick={() => carregarNotificacoes()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!carregando &&
          !erro &&
          notificacoesFiltradas.length === 0 && (
            <div className="notificacoes-vazio">
              <span className="notificacoes-vazio-icone">
                🔔
              </span>

              <h3>
                {filtro === "nao-lidas"
                  ? "Nenhuma notificação não lida"
                  : filtro === "lidas"
                  ? "Nenhuma notificação lida"
                  : "Nenhuma notificação por aqui"}
              </h3>

              <p>
                Quando houver novidades, elas aparecerão aqui.
              </p>
            </div>
          )}

        {!carregando &&
          !erro &&
          notificacoesFiltradas.map((notificacao) => {
            const lida = Boolean(notificacao.lida_em);

            return (
              <article
                key={notificacao.id}
                className={`notificacao-card ${
                  lida ? "notificacao-lida" : "notificacao-nao-lida"
                }`}
              >
                <div className="notificacao-icone">
                  {ICONE_TIPO[notificacao.tipo] || "🔔"}
                </div>

                <div className="notificacao-conteudo">
                  <div className="notificacao-cabecalho">
                    <h3>{notificacao.titulo}</h3>

                    {!lida && (
                      <span className="notificacao-tag">
                        Nova
                      </span>
                    )}
                  </div>

                  <p>{notificacao.mensagem}</p>

                  <span className="notificacao-data">
                    <span>◷</span>
                    {formatarData(notificacao.criado_em)}
                  </span>

                  {notificacao.postagem_id && (
                    <span className="notificacao-referencia">
                      Ocorrência #{notificacao.postagem_id}
                    </span>
                  )}
                </div>

                {!lida && (
                  <button
                    type="button"
                    className="notificacao-marcar-lida"
                    onClick={() => marcarLida(notificacao.id)}
                    title="Marcar como lida"
                    aria-label={`Marcar ${notificacao.titulo} como lida`}
                  >
                    ✓
                  </button>
                )}
              </article>
            );
          })}
      </div>
    </section>
  );
}
