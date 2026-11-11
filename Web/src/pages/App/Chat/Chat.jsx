import { useState } from "react";
import "./Chat.css";

const conversasIniciais = [
  {
    id: 1,
    nome: "Mariana Oliveira",
    avatar: "MO",
    mensagem: "Obrigada pelo retorno!",
    horario: "14:32",
    naoLidas: 2,
    mensagens: [
      { id: 1, texto: "Olá! Gostaria de saber sobre a ocorrência que registrei.", hora: "14:20", enviada: false },
      { id: 2, texto: "Olá, Mariana! Claro, podemos ajudar.", hora: "14:25", enviada: true },
      { id: 3, texto: "A equipe responsável já foi informada.", hora: "14:28", enviada: true },
      { id: 4, texto: "Obrigada pelo retorno!", hora: "14:32", enviada: false },
    ],
  },
  {
    id: 2,
    nome: "João Pedro",
    avatar: "JP",
    mensagem: "Quando será resolvido?",
    horario: "13:45",
    naoLidas: 0,
    mensagens: [
      { id: 1, texto: "Registrei um problema de iluminação na minha rua.", hora: "13:30", enviada: false },
      { id: 2, texto: "Recebemos sua solicitação e estamos verificando.", hora: "13:40", enviada: true },
      { id: 3, texto: "Quando será resolvido?", hora: "13:45", enviada: false },
    ],
  },
  {
    id: 3,
    nome: "Ana Carolina",
    avatar: "AC",
    mensagem: "Certo, vou aguardar.",
    horario: "Ontem",
    naoLidas: 0,
    mensagens: [
      { id: 1, texto: "Boa tarde! Minha ocorrência foi atualizada?", hora: "16:10", enviada: false },
      { id: 2, texto: "Sim! Ela está em andamento.", hora: "16:15", enviada: true },
      { id: 3, texto: "Certo, vou aguardar.", hora: "16:18", enviada: false },
    ],
  },
];

export default function Chat() {
  const [conversas, setConversas] = useState(conversasIniciais);
  const [conversaAtiva, setConversaAtiva] = useState(1);
  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState("");

  const conversa = conversas.find((item) => item.id === conversaAtiva);

  const filtradas = conversas.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function enviarMensagem(event) {
    event.preventDefault();
    if (!mensagem.trim() || !conversa) return;

    const novaMensagem = {
      id: Date.now(),
      texto: mensagem.trim(),
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      enviada: true,
    };

    setConversas((anteriores) =>
      anteriores.map((item) =>
        item.id === conversaAtiva
          ? {
              ...item,
              mensagem: novaMensagem.texto,
              horario: novaMensagem.hora,
              mensagens: [...item.mensagens, novaMensagem],
            }
          : item
      )
    );

    setMensagem("");
  }

  return (
    <div className="chat-page">
      <div className="chat-cabecalho">
        <div>
          <span className="chat-subtitulo">COMUNICAÇÃO</span>
          <h1>Bate-papo</h1>
          <p>Converse e acompanhe seus atendimentos.</p>
        </div>
        <div className="chat-status-geral">
          <span className="chat-status-ponto" />
          Atendimento
        </div>
      </div>

      <section className="chat-painel">
        <aside className="chat-lista">
          <div className="chat-lista-topo">
            <h2>Conversas</h2>
            <span>{conversas.length}</span>
          </div>

          <div className="chat-busca">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Buscar conversa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="chat-lista-itens">
            {filtradas.map((item) => (
              <button
                key={item.id}
                className={`chat-conversa-item ${
                  conversaAtiva === item.id ? "selecionada" : ""
                }`}
                onClick={() => setConversaAtiva(item.id)}
              >
                <div className="chat-avatar">{item.avatar}</div>

                <div className="chat-conversa-info">
                  <div className="chat-conversa-linha">
                    <strong>{item.nome}</strong>
                    <span>{item.horario}</span>
                  </div>
                  <div className="chat-conversa-linha">
                    <p>{item.mensagem}</p>
                    {item.naoLidas > 0 && (
                      <span className="chat-nao-lidas">
                        {item.naoLidas}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {filtradas.length === 0 && (
              <p className="chat-vazio">Nenhuma conversa encontrada.</p>
            )}
          </div>
        </aside>

        <div className="chat-conteudo">
          {conversa ? (
            <>
              <header className="chat-conteudo-topo">
                <div className="chat-avatar">{conversa.avatar}</div>
                <div>
                  <strong>{conversa.nome}</strong>
                  <span>Conversa privada</span>
                </div>
              </header>

              <div className="chat-mensagens">
                <div className="chat-data">Hoje</div>

                {conversa.mensagens.map((item) => (
                  <div
                    key={item.id}
                    className={`chat-mensagem ${
                      item.enviada ? "mensagem-enviada" : "mensagem-recebida"
                    }`}
                  >
                    <div className="chat-balao">
                      <p>{item.texto}</p>
                      <span>{item.hora}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form className="chat-envio" onSubmit={enviarMensagem}>
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
                <button type="submit" disabled={!mensagem.trim()}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="chat-selecione">
              <span>💬</span>
              <h2>Selecione uma conversa</h2>
              <p>Escolha uma conversa para visualizar as mensagens.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
