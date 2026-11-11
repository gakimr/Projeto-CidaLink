import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoCidalink from "../../assets/LogoCida.svg";
import logoCidalinkEscuro from "../../assets/LogoCidaDM.svg";
import "./Sidebar.css";

const ICONES = {
  notificacoes: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  inicio: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  criar: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  mapa: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  chat: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  perfil: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  sair: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const ITENS_MENU = [
  {
    id: "notificacoes",
    rotulo: "Notificações",
    rota: "/app/notificacoes",

  },
  { id: "inicio", rotulo: "Página Inicial", rota: "/app" },
  { id: "criar", rotulo: "Criar Ocorrência", rota: "/app/criar-ocorrencia" },
  { id: "mapa", rotulo: "Mapa", rota: "/app/mapa" },
  { id: "chat", rotulo: "Bate-papo", rota: "/app/bate-papo" },
  { id: "perfil", rotulo: "Meu Perfil", rota: "/app/perfil" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // administrador não cria ocorrências, só responde às dos cidadãos
  const itens =
    user?.tipo === "admin"
      ? ITENS_MENU.filter((item) => item.id !== "criar")
      : ITENS_MENU;

  function handleSair() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.assign("/");
}
  return (
    <aside className="sidebar">
      <NavLink to="/app" end className="sidebar-logo">
        <img src={logoCidalink} alt="CidaLink" className="logo-claro" />
        <img src={logoCidalinkEscuro} alt="CidaLink" className="logo-escuro" />
      </NavLink>

      <nav className="sidebar-nav">
        {itens.map((item) => (
          <NavLink
            key={item.id}
            to={item.rota}
            end={item.rota === "/app"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "sidebar-item-ativo" : ""}`
            }
          >
            <span className="sidebar-item-conteudo">
              {ICONES[item.id]}
              <span>{item.rotulo}</span>
            </span>
          </NavLink>
        ))}

        <button type="button" className="sidebar-item" onClick={handleSair}>
          <span className="sidebar-item-conteudo">
            {ICONES.sair}
            <span>Sair</span>
          </span>
        </button>
      </nav>
    </aside>
  );
}
