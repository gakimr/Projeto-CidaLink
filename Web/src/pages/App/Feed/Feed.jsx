import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import FeedPost from "../../../components/FeedPost/Feedpost";
import "./Feed.css";

const CATEGORIA_LABEL = {
  buraco: "🚧 Buraco na via",
  iluminacao: "💡 Iluminação Pública",
  lixo: "🗑️ Acúmulo de Lixo",
  saneamento: "🚰 Problemas de Saneamento",
  outro: "📌 Outro",
};

// o banco usa "resolvida"; o index.css e a Home usam "resolvido"
const STATUS_FEED = {
  pendente: "pendente",
  andamento: "andamento",
  resolvida: "resolvido",
};

const FILTROS = [
  { id: "todas", rotulo: "Todas" },
  { id: "pendente", rotulo: "Pendentes" },
  { id: "andamento", rotulo: "Em andamento" },
  { id: "resolvida", rotulo: "Resolvidas" },
];

function urlArquivo(caminho) {
  return caminho ? `${api.defaults.baseURL}${caminho}` : null;
}

// avatar com as iniciais, pra quem ainda não tem foto de perfil
function avatarPadrao(nome = "") {
  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .replace(/[^\p{L}]/gu, "")
    .toUpperCase();

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
    '<rect width="100" height="100" fill="#87d287"/>' +
    '<text x="50" y="50" font-family="Arial, sans-serif" font-size="40" ' +
    'font-weight="700" fill="#19732d" text-anchor="middle" ' +
    `dominant-baseline="central">${iniciais}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// converte a postagem do backend pro formato que o FeedPost já usa
function paraPost(p) {
  return {
    id: p.id,
    autor: p.autor.nome,
    local: [p.bairro, p.logradouro].filter(Boolean).join(" - "),
    categoria: CATEGORIA_LABEL[p.categoria] || p.categoria,
    status: STATUS_FEED[p.status] || p.status,
    descricao: p.descricao,
    avatar: urlArquivo(p.autor.fotoPerfil) || avatarPadrao(p.autor.nome),
    imagem: urlArquivo(p.foto),
    votos: 0, // votos ainda não existem no backend
  };
}

export default function Feed() {
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState("todas");
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro("");

    api
      .get("/postagens", {
        params: filtro === "todas" ? {} : { status: filtro },
      })
      .then((resposta) => {
        if (!cancelado) setPosts(resposta.data.data.postagens.map(paraPost));
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
      cancelado = true; // ignora resposta de um filtro antigo
    };
  }, [filtro]);

  return (
    <section className="feed-pagina">
      <div className="feed-topo">
        <h1 className="app-titulo">Feed da Comunidade</h1>
        <p>Acompanhe as ocorrências publicadas pelos cidadãos.</p>
      </div>

      <div className="feed-filtros">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`feed-filtro ${filtro === f.id ? "feed-filtro-ativo" : ""}`}
            onClick={() => setFiltro(f.id)}
          >
            {f.rotulo}
          </button>
        ))}

        <button
          type="button"
          className="feed-criar-btn"
          onClick={() => navigate("/app/criar-ocorrencia")}
        >
          Nova ocorrência
        </button>
      </div>

      <div className="feed-lista">
        {carregando && <p className="feed-aviso">Carregando ocorrências...</p>}

        {!carregando && erro && (
          <p className="feed-aviso feed-aviso-erro">{erro}</p>
        )}

        {!carregando && !erro && posts.length === 0 && (
          <p className="feed-aviso">Nenhuma ocorrência por aqui ainda.</p>
        )}

        {!carregando &&
          !erro &&
          posts.map((post) => <FeedPost key={post.id} post={post} />)}
      </div>
    </section>
  );
}
