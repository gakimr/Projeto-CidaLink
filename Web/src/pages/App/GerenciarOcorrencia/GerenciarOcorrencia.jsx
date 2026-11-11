
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import "./GerenciarOcorrencia.css";

const STATUS = [
  { valor: "pendente", label: "Pendente" },
  { valor: "andamento", label: "Em andamento" },
  { valor: "resolvida", label: "Resolvida" },
];

const STATUS_LABEL = {
  pendente: "Pendente",
  andamento: "Em andamento",
  resolvida: "Resolvida",
};

export default function GerenciarOcorrencia() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ocorrencia, setOcorrencia] = useState(null);
  const [status, setStatus] = useState("pendente");
  const [observacao, setObservacao] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function carregarOcorrencia() {
      try {
        setCarregando(true);
        setErro("");

        // Utiliza a rota de listagem que o Feed já utiliza.
        const resposta = await api.get("/postagens");
        const postagens = resposta.data?.data?.postagens;

        if (!Array.isArray(postagens)) {
          throw new Error("Não foi possível identificar as ocorrências.");
        }

        const encontrada = postagens.find(
          (post) => String(post.id) === String(id)
        );

        if (!encontrada) {
          throw new Error("Ocorrência não encontrada.");
        }

        if (!cancelado) {
          setOcorrencia(encontrada);
          setStatus(encontrada.status || "pendente");
        }
      } catch (error) {
        console.error("Erro ao carregar ocorrência:", error);
        if (!cancelado) {
          setErro(
            error.response?.data?.data ||
              error.message ||
              "Não foi possível carregar a ocorrência."
          );
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarOcorrencia();

    return () => {
      cancelado = true;
    };
  }, [id]);


async function salvarAlteracoes(event) {
  event.preventDefault();

  if (!ocorrencia) return;

  try {
    setSalvando(true);
    setErro("");
    setSucesso("");

    // Endpoint correto, conforme a rota cadastrada no backend.
    await api.put(`/postagens/${id}/status`, { status });

    setOcorrencia((anterior) => ({
      ...anterior,
      status,
    }));

    setSucesso("Status da ocorrência atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar ocorrência:", error);

    setErro(
      error.response?.data?.data ||
        error.response?.data?.mensagem ||
        "Não foi possível atualizar o status da ocorrência."
    );
  } finally {
    setSalvando(false);
  }
}


  function formatarData(data) {
    if (!data) return "Não informado";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) return "Não informado";

    return dataFormatada.toLocaleString("pt-BR");
  }

  if (carregando) {
    return (
      <main className="gerenciar-pagina">
        <p className="gerenciar-aviso">Carregando ocorrência...</p>
      </main>
    );
  }

  if (erro && !ocorrencia) {
    return (
      <main className="gerenciar-pagina">
        <div className="gerenciar-erro">
          <h2>Não foi possível abrir a ocorrência</h2>
          <p>{erro}</p>
        </div>
      </main>
    );
  }

  if (!ocorrencia) return null;

  const autor = ocorrencia.autor || {};

  return (
    <main className="gerenciar-pagina">
      <header className="gerenciar-topo">
        <span className="gerenciar-etiqueta">PAINEL ADMINISTRATIVO</span>
        <h1 className="app-titulo">Gerenciar ocorrência</h1>
        <p>Consulte os detalhes e atualize o andamento desta solicitação.</p>
      </header>

      <div className="gerenciar-conteudo">
        <section className="gerenciar-card">
          <div className="gerenciar-card-topo">
            <div>
              <span className="gerenciar-protocolo">
                OCORRÊNCIA #{ocorrencia.id}
              </span>
              <h2>{ocorrencia.categoria || "Ocorrência"}</h2>
            </div>

            <span className={`gerenciar-status status-${status}`}>
              {STATUS_LABEL[status] || status}
            </span>
          </div>

          <div className="gerenciar-detalhes">
            <div className="gerenciar-campo">
              <span>Solicitante</span>
              <strong>{autor.nome || "Não informado"}</strong>
            </div>

            <div className="gerenciar-campo">
              <span>Data de publicação</span>
              <strong>
                {formatarData(ocorrencia.criado_em || ocorrencia.data_criacao)}
              </strong>
            </div>

            <div className="gerenciar-campo">
              <span>Bairro</span>
              <strong>{ocorrencia.bairro || "Não informado"}</strong>
            </div>

            <div className="gerenciar-campo">
              <span>Endereço</span>
              <strong>{ocorrencia.logradouro || "Não informado"}</strong>
            </div>

            <div className="gerenciar-campo gerenciar-campo-largo">
              <span>Descrição da ocorrência</span>
              <p>{ocorrencia.descricao || "Sem descrição informada."}</p>
            </div>
          </div>

          {ocorrencia.foto && (
            <div className="gerenciar-foto">
              <span>Foto enviada pelo cidadão</span>
              <img
                src={`${api.defaults.baseURL}${ocorrencia.foto}`}
                alt="Imagem da ocorrência"
              />
            </div>
          )}
        </section>

        <form className="gerenciar-card gerenciar-form" onSubmit={salvarAlteracoes}>
          <div className="gerenciar-form-titulo">
            <div className="gerenciar-form-icone">⚙️</div>
            <div>
              <h2>Atualizar andamento</h2>
              <p>Altere o status da ocorrência.</p>
            </div>
          </div>

          <label htmlFor="status-ocorrencia">Status da ocorrência</label>
          <select
            id="status-ocorrencia"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setSucesso("");
            }}
          >
            {STATUS.map((item) => (
              <option key={item.valor} value={item.valor}>
                {item.label}
              </option>
            ))}
          </select>

          <label htmlFor="observacao-ocorrencia">
            Observação administrativa
          </label>
          <textarea
            id="observacao-ocorrencia"
            rows="4"
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            placeholder="Anote informações internas sobre o atendimento..."
          />

          <p className="gerenciar-nota">
            A observação ainda não é enviada ao banco. Para salvá-la, precisamos
            integrar o campo a uma rota e coluna existentes no seu backend.
          </p>

          {erro && <div className="gerenciar-mensagem erro">{erro}</div>}
          {sucesso && (
            <div className="gerenciar-mensagem sucesso">{sucesso}</div>
          )}

          <div className="gerenciar-acoes">
            <button
              type="button"
              className="gerenciar-cancelar"
              onClick={() => navigate("/app")}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="gerenciar-salvar"
              disabled={salvando || status === ocorrencia.status}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
