import { useState } from "react";
import { Link } from 'react-router-dom';
import Prefooter from "../../components/PreFooter/Prefooter";
import "./Home.css";


const OCORRENCIAS = [
  {
    id: 1,
    foto: "/ocorrencia1.jpeg",
    bairro: "Centro",
    tipo: "Iluminação Pública",
    descricao: "'poste caído perigo para os moradores",
    status: "resolvido",
    top: "58%",
    left: "18%",
  },
  {
    id: 2,
    foto: "/ocorrencia2.jpeg",
    bairro: "Centro",
    tipo: "Buraco na rua",
    descricao: "Buraco na rua atrapalhando o transito",
    status: "andamento",
    top: "48%",
    left: "58%",
  },
];

const POSTS = [
  {
    id: 1,
    nome: "Rihanna Oliveira",
    local: "Centro · Rua General Osório",
    tag: "⚠ Buraco na Rua",
    avatar: "/rihanna.jpg",
    foto: "/ocorrencia2.jpeg",
    descricao:
      "Buraco na rua atrapalhando o trânsito, precisa de reparo urgente.",
  },
  {
    id: 2,
    nome: "Zayn Macedo",
    local: "Centro · Rua Prudente de Morais",
    tag: "💡 Iluminação Pública",
    avatar: "/zayn.jpg",
    foto: "/ocorrencia1.jpeg",
    descricao: "Poste caído, risco para os moradores da rua à noite.",
  },
  {
    id: 3,
    nome: "Katia Pereira",
    local: "Vila Negri · Rua das Acácias",
    tag: "🗑 Acúmulo de Lixo",
    avatar: "/katia.jpg",
    foto: "/ocorrencia3.jpeg",
    descricao: "Lixo acumulado na esquina há mais de uma semana.",
  },
];

const RECURSOS = [
  {
    icone: '📍',
    titulo: 'Geolocalização Inteligente',
    texto: 'Mapeamento preciso de cada ocorrência para facilitar o trabalho das equipes de campo na rua.',
  },
  {
    icone: '📱',
    titulo: 'Tudo na Palma da Mão',
    texto: 'Acesse de qualquer lugar, pelo celular ou computador, com o controle das demandas urbanas sempre atualizado.',
  },
];

export default function Home() {
  const [ativa, setAtiva] = useState(1);

  function alternar(id) {
    setAtiva(ativa === id ? null : id);
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="heropic">
            <img src="/hero.jpg" alt="Duas pessoas usando o app CidaLink" />

            <div className="hero-scrim"></div>

            <div className="balao-chat balao1">
              <img src="/lucas.jpg" alt="" />

              <div>
                <span className="nome">Lucas</span>
                <br />A praça do bairro precisa de iluminação
              </div>
            </div>

            <div className="balao-chat balao2 balao-inv">
              <div>
                <span className="nome">Admin Caio</span>
                <br />
                solicitação recebida! Vamos cuidar disso!
              </div>

              <img src="/admin.jpg" alt="" />
            </div>

            <div className="hero-content">
              <h1>
                Sua voz tem poder! <br />
                Use!
              </h1>

              <p>
                Reporte problemas urbanos, acompanhe as soluções de perto e faça
                parte da mudança!
              </p>
            </div>

<div className="herobtn">
  <Link to="/login" className="btn btn-primario">
    Sou Cidadão
  </Link>

  <Link to="/loginadm" className="btn btn-secundario">
    Sou Administrador
  </Link>
</div>
            </div>
          </div>
      </section>

      <section className="secao-mapa">
        <div className="container mapa-grid">
          <div className="mapa-imagem">
            <div className="mapaframe">
              <img
                src="/mapa.jpeg"
                alt="Mapa da cidade com ocorrências marcadas"
              />
            </div>

            {OCORRENCIAS.map((oc) => (
              <button
                key={oc.id}
                type="button"
                className={`marcador marcador-${oc.status} ${ativa === oc.id ? "marcador-ativo" : ""}`}
                style={{ top: oc.top, left: oc.left }}
                onClick={() => alternar(oc.id)}
                aria-label={`Ver detalhes: ${oc.tipo}`}
              ></button>
            ))}

            {OCORRENCIAS.filter((oc) => oc.id === ativa).map((oc) => (
              <div
                className="mapa-card"
                key={oc.id}
                style={{ top: oc.top, left: oc.left }}
              >
                <button
                  className="mapa-cardfechar"
                  onClick={() => setAtiva(null)}
                >
                  ×
                </button>
                <img src={oc.foto} alt="" />
                <div className="mapa-cardcorpo">
                  <strong className="mapa-cardbairro">{oc.bairro}</strong>
                  <span className="mapa-cardtipo">📁 ⚠ {oc.tipo}</span>
                  <p>{oc.descricao}</p>
                  <span className={`status-tag status-${oc.status}`}>
                    {oc.status === "resolvido" ? "RESOLVIDO" : "EM ANDAMENTO"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mapa-texto">
            <h2>Cidadania em tempo real</h2>

            <p>
              Navegue pelo mapa, acompanhe chamados abertos, em andamento e
              resolvidos.
            </p>
          </div>
        </div>
      </section>

      <section className="secao-comunidade-wrap">
        <div className="container">
          <div className="secao-comunidade">
            <div className="comunidade-titulo">
              <h2>A comunidade em ação</h2>
              <p>
                Conecte-se com as demandas reais postadas pelos cidadãos e apoie
                as solicitações da sua região.
              </p>
            </div>

            <div className="feed">
              {POSTS.map((post) => (
                <div className="post" key={post.id}>
                  <div className="post-cabecalho">
                    <img src={post.avatar} alt="" />
                    <div>
                      <div className="post-nome">{post.nome}</div>
                      <div className="post-local">{post.local}</div>
                    </div>
                  </div>
                  <span className="post-tag">{post.tag}</span>
                  <img className="post-foto" src={post.foto} alt="" />
                  <div className="post-corpo">{post.descricao}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="secao-ocorrencia">
        <div className="container ocorrencia-grid">
          <div className="form-card">
            <label htmlFor="categoria">Categoria</label>
            <select id="categoria">
              <option value="">Selecione o tipo</option>
              <option value="buraco">Buraco na Rua</option>
              <option value="iluminacao">Iluminação Pública</option>
              <option value="lixo">Acúmulo de Lixo</option>
              <option value="saneamento">Problemas de Saneamento</option>
              <option value="outro">Outro</option>
            </select>

            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              placeholder="Descreva o problema e informe pontos de referência (ex: próximo à praça central, buraco profundo na via)..."
            />

            <button type="button" className="btn btn-primario btn-full">
              Registrar Ocorrência
            </button>
          </div>

          <div className="ocorrencia-info">
            <h2>Contribua com a melhoria do seu bairro</h2>

            <ul className="passo-lista">
              <li>
                <span className="passo-numero">1</span>
                <div>
                  <strong>Selecione a categoria</strong>
                  <p>Escolha o tipo de problema que você quer reportar.</p>
                </div>
              </li>
              <li>
                <span className="passo-numero">2</span>
                <div>
                  <strong>Descreva o ocorrido</strong>
                  <p>Informe detalhes e pontos de referência do local.</p>
                </div>
              </li>
              <li>
                <span className="passo-numero">3</span>
                <div>
                  <strong>Acompanhe em tempo real</strong>
                  <p>Veja o status mudar de pendente para resolvido.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
               <h2 className="sec-titulo">Soluções tecnológicas para um município conectado</h2>
      <section className="secao-recursos">
  <div className="container">
    <div className="recursos-titulo">
      <p>Da precisão do mapa à tomada de decisões: descubra o que move a eficiência do CidaLink.</p>
    </div>

    <div className="recursos-grid">
      {RECURSOS.map((r) => (
        <div className="recurso-card" key={r.titulo}>
          <div className="recurso-icone">{r.icone}</div>
          <h3>{r.titulo}</h3>
          <p>{r.texto}</p>
        </div>
      ))}
    </div>
  </div>
</section>
  <Prefooter />
    </>
    
  );

}
