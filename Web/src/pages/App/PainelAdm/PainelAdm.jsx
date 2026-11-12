import { useEffect, useMemo, useState } from "react";
import "./PainelAdmin.css";
import { AlertCircle, CheckCircle2, Clock3, ClipboardList,RefreshCw, TrendingUp, } from "lucide-react";
import api from "../../../services/api";

const CATEGORIAS = [
  { id: "buraco", nome: "Buracos nas vias", cor: "#D99A35" },
  { id: "iluminacao", nome: "Iluminação pública", cor: "#E7B84B" },
  { id: "lixo", nome: "Limpeza urbana", cor: "#299B78" },
  { id: "saneamento", nome: "Saneamento", cor: "#4388C7" },
  { id: "outro", nome: "Outros", cor: "#8B79B8" },
];

const STATUS = [
  { id: "pendente", nome: "Pendentes", cor: "#D95D5D" },
  { id: "andamento", nome: "Em andamento", cor: "#D99A35" },
  { id: "resolvida", nome: "Resolvidas", cor: "#299B78" },
];

function dentroDoPeriodo(post, periodo) {
  if (periodo === "todos") return true;

  const data = new Date(post.criadoEm);

  if (Number.isNaN(data.getTime())) return true;

  const agora = new Date();
  const dias = periodo === "7" ? 7 : periodo === "30" ? 30 : 365;
  const limite = new Date(agora);

  limite.setDate(agora.getDate() - dias);

  return data >= limite && data <= agora;
}

export default function PainelAdm() {
  const [periodo, setPeriodo] = useState("todos");
  const [postagens, setPostagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function carregarPostagens() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await api.get("/postagens");
        const lista = resposta.data?.data?.postagens;

        if (!Array.isArray(lista)) {
          throw new Error(
            "A resposta da API não contém uma lista de ocorrências."
          );
        }

        if (!cancelado) {
          setPostagens(lista);
        }
      } catch (error) {
        if (!cancelado) {
          setErro(
            error.response?.data?.data ||
              error.message ||
              "Não foi possível carregar as ocorrências."
          );
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    carregarPostagens();

    return () => {
      cancelado = true;
    };
  }, []);

  const postagensDoPeriodo = useMemo(
    () => postagens.filter((post) => dentroDoPeriodo(post, periodo)),
    [postagens, periodo]
  );

  const estatisticas = useMemo(() => {
    const total = postagensDoPeriodo.length;

    const porStatus = STATUS.map((status) => ({
      ...status,
      quantidade: postagensDoPeriodo.filter(
        (post) => post.status === status.id
      ).length,
    }));

    const porCategoria = CATEGORIAS.map((categoria) => ({
      ...categoria,
      quantidade: postagensDoPeriodo.filter(
        (post) => post.categoria === categoria.id
      ).length,
    })).sort((a, b) => b.quantidade - a.quantidade);

    const resolvidas =
      porStatus.find((item) => item.id === "resolvida")?.quantidade || 0;

    return {
      total,
      porStatus,
      porCategoria,
      percentualResolvido: total
        ? Math.round((resolvidas / total) * 100)
        : 0,
    };
  }, [postagensDoPeriodo]);

  const maiorCategoria = Math.max(
    1,
    ...estatisticas.porCategoria.map((categoria) => categoria.quantidade)
  );

  const totalStatus = Math.max(1, estatisticas.total);

  let inicio = 0;

  const gradiente = estatisticas.porStatus
    .map((item) => {
      const fim = inicio + (item.quantidade / totalStatus) * 100;
      const faixa = `${item.cor} ${inicio}% ${fim}%`;

      inicio = fim;

      return faixa;
    })
    .join(", ");

  return (
    <section className="feed-pagina feed-pagina-admin">
      <div className="feed-topo">
        <span className="feed-admin-etiqueta">
          PAINEL ADMINISTRATIVO
        </span>

        <h1 className="app-titulo">Gerenciar ocorrências</h1>

        <p>
          Acompanhe os registros da cidade e gerencie as solicitações dos
          cidadãos.
        </p>
      </div>

      <section
        className="admin-estatisticas"
        aria-label="Estatísticas das ocorrências"
      >
        <div className="admin-estatisticas-cabecalho">
          <div>
            <span className="admin-secao-legenda">
              ACOMPANHAMENTO
            </span>

            <h2>Resumo das ocorrências</h2>

            <p>
              Indicadores calculados com os registros cadastrados.
            </p>
          </div>

          <label className="admin-periodo">
            <span>Período</span>

            <select
              value={periodo}
              onChange={(event) => setPeriodo(event.target.value)}
            >
              <option value="todos">Todo o período</option>
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="365">Último ano</option>
            </select>
          </label>
        </div>

        {erro && (
          <div className="feed-aviso feed-aviso-erro">
            {erro}
          </div>
        )}

        <div className="admin-indicadores">
          <article className="admin-indicador admin-indicador-total">
            <span className="admin-indicador-icone">
              <ClipboardList size={20} />
            </span>

            <span className="admin-indicador-label">
              Total de ocorrências
            </span>

            <strong>
              {carregando ? "—" : estatisticas.total}
            </strong>

            <small>Registros no período</small>
          </article>

          <article className="admin-indicador">
            <span className="admin-indicador-icone pendente">
              <Clock3 size={20} />
            </span>

            <span className="admin-indicador-label">
              Pendentes
            </span>

            <strong>
              {carregando ? "—" : estatisticas.porStatus[0].quantidade}
            </strong>

            <small>Aguardando atendimento</small>
          </article>

          <article className="admin-indicador">
            <span className="admin-indicador-icone andamento">
              <RefreshCw size={20} />
            </span>

            <span className="admin-indicador-label">
              Em andamento
            </span>

            <strong>
              {carregando ? "—" : estatisticas.porStatus[1].quantidade}
            </strong>

            <small>Em atendimento</small>
          </article>

          <article className="admin-indicador">
            <span className="admin-indicador-icone resolvida">
              <CheckCircle2 size={20} />
            </span>

            <span className="admin-indicador-label">
              Resolvidas
            </span>

            <strong>
              {carregando ? "—" : estatisticas.porStatus[2].quantidade}
            </strong>

            <small>
              {estatisticas.percentualResolvido}% do total
            </small>
          </article>
        </div>

        <div className="admin-graficos">
          <article className="admin-grafico-card admin-categorias-card">
            <div className="admin-grafico-titulo">
              <div>
                <h3>Ocorrências por categoria</h3>
                <p>Identifique os problemas mais frequentes.</p>
              </div>

              <span className="admin-grafico-icone">
                <TrendingUp size={19} />
              </span>
            </div>

            <div className="admin-categorias-lista">
              {estatisticas.porCategoria.map((categoria) => {
                const percentual = estatisticas.total
                  ? Math.round(
                      (categoria.quantidade / estatisticas.total) * 100
                    )
                  : 0;

                return (
                  <div
                    className="admin-categoria-linha"
                    key={categoria.id}
                  >
                    <div className="admin-categoria-info">
                      <span
                        className="admin-categoria-ponto"
                        style={{ background: categoria.cor }}
                      />

                      <span>{categoria.nome}</span>

                      <strong>{categoria.quantidade}</strong>
                    </div>

                    <div className="admin-barra-fundo">
                      <span
                        className="admin-barra-preenchida"
                        style={{
                          width: `${
                            (categoria.quantidade / maiorCategoria) * 100
                          }%`,
                          background: categoria.cor,
                        }}
                      />
                    </div>

                    <small>{percentual}%</small>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="admin-grafico-card admin-status-card">
            <div className="admin-grafico-titulo">
              <div>
                <h3>Situação dos atendimentos</h3>
                <p>Distribuição por status atual.</p>
              </div>

              <span className="admin-grafico-icone">
                <AlertCircle size={19} />
              </span>
            </div>

            <div className="admin-status-conteudo">
              <div
                className="admin-grafico-rosca"
                style={{
                  background: `conic-gradient(${
                    gradiente || "#e8ecef 0% 100%"
                  })`,
                }}
                role="img"
                aria-label={`Distribuição de status: ${estatisticas.porStatus
                  .map((item) => `${item.nome}: ${item.quantidade}`)
                  .join(", ")}`}
              >
                <div className="admin-grafico-centro">
                  <strong>
                    {carregando ? "—" : estatisticas.total}
                  </strong>

                  <span>ocorrências</span>
                </div>
              </div>

              <div className="admin-legenda-status">
                {estatisticas.porStatus.map((item) => (
                  <div
                    className="admin-legenda-item"
                    key={item.id}
                  >
                    <span
                      className="admin-categoria-ponto"
                      style={{ background: item.cor }}
                    />

                    <span>{item.nome}</span>

                    <strong>{item.quantidade}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
