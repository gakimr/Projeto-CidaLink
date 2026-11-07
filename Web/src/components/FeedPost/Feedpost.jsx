import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Feedpost.css";

const STATUS_LABEL = {
  pendente: "Pendente",
  andamento: "Em andamento",
  resolvido: "Resolvido",
};

export default function FeedPost({ post }) {
  const [curtido, setCurtido] = useState(false);
  const [votos, setVotos] = useState(post.votos);
  const navigate = useNavigate();
  const { user } = useAuth();
  const ehAdmin = user?.tipo === "admin";

  function alternarCurtida() {
    setCurtido((estadoAtual) => {
      setVotos((quantidadeAtual) =>
        estadoAtual ? quantidadeAtual - 1 : quantidadeAtual + 1,
      );

      return !estadoAtual;
    });
  }

  return (
    <article className="feed-post">
      <header className="feed-cabecalho">
        <img
          src={post.avatar}
          alt={`Foto de ${post.autor}`}
          className="feed-avatar"
        />

        <div className="feed-info">
          <span className="feed-autor">{post.autor}</span>
          <span className="feed-local">{post.local}</span>
        </div>

        <span className={`status-tag status-${post.status}`}>
          {STATUS_LABEL[post.status]}
        </span>
      </header>
      <div className="feed-corpo">
        <span className="feed-categoria">{post.categoria}</span>
        <p className="feed-descricao">{post.descricao}</p>
      </div>
      {post.imagem && (
        <img
          src={post.imagem}
          alt={`Ocorrência publicada por ${post.autor}`}
          className="feed-imagem"
        />
      )}
      <div className="feed-acoes">
        <button
          type="button"
          className={`feed-acao-btn ${curtido ? "feed-curtido" : ""}`}
          onClick={alternarCurtida}
          aria-label={curtido ? "Remover apoio" : "Apoiar ocorrência"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={curtido ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
        </button>

        <button type="button" className="feed-acao-btn" aria-label="Comentar">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        </button>

        <button
          type="button"
          className="feed-acao-btn"
          aria-label="Compartilhar"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>

        {ehAdmin && (
          <button
            type="button"
            className="feed-admin-btn"
            onClick={() => navigate(`/app/ocorrencia/${post.id}`)}
          >
            Responder / Atualizar
          </button>
        )}
      </div>
    </article>
  );
}
