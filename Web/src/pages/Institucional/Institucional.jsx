import Prefooter from "../../components/PreFooter/Prefooter";
import { useState } from "react";
import {
  Target,
  Eye,
  Handshake,
  MapPin,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserRound,
} from "lucide-react";
import "./Institucional.css";

export default function Institucional() {
  const destaques = [
    {
      icone: MapPin,
      titulo: "Cidades mais conectadas",
      descricao: "Informação, participação e colaboração em um só lugar.",
    },
    {
      icone: Users,
      titulo: "Participação do cidadão",
      descricao:
        "Incentivamos os cidadãos a participar e contribuir para as melhorias na comunidade",
    },
    {
      icone: ShieldCheck,
      titulo: "Tecnologia e transparência",
      descricao: "Acompanhamento de suas ocorrências",
    },
  ];

  const equipe = [
    {
      id: 1,
      nome: "Gabriela Kimura",
      funcao: "Equipe de desenvolvimento",
    },
    {
      id: 2,
      nome: "Eduarda Ricardo",
      funcao: "Equipe de desenvolvimento",
    },
    {
      id: 3,
      nome: "Rafaela Freitas",
      funcao: "Equipe de desenvolvimento",
    },
  ];

  const [cardAtual, setCardAtual] = useState(0);

  const nextCard = () => {
    setCardAtual((atual) => (atual + 1) % destaques.length);
  };

  const prevCard = () => {
    setCardAtual((atual) => (atual - 1 + destaques.length) % destaques.length);
  };

  return (
    <>
      <main className="institucional">
        <section className="inst-hero">
          <div className="container">
            <span className="inst-subtitulo">CONHEÇA O CIDALINK</span>

            <h1>
              Conectando cidadãos,
              <br />
              transformando cidades.
            </h1>

            <p>
              Acreditamos que a transformação das cidades começa quando a
              população tem voz e participa das mudanças.
            </p>
          </div>
        </section>

        <section className="inst-quem-somos">
          <div className="container inst-quem-layout">
            <div className="inst-quem-texto">
              <span className="inst-etiqueta">QUEM SOMOS</span>

              <h2>Uma ponte entre cidadãos e gestão pública.</h2>

              <p>
                O CidaLink é uma plataforma digital que busca aproximar cidadãos
                e administração pública, facilitando a comunicação sobre
                problemas urbanos e incentivando a participação da comunidade na
                construção de cidades melhores.
              </p>

              <p>
                Através da tecnologia, queremos tornar mais simples o registro,
                a visualização e o acompanhamento de ocorrências presentes no
                cotidiano da população.
              </p>
            </div>

            <div className="inst-quem-visual">
              <div className="inst-visual-card">
                <div className="inst-visual-icon">
                  {(() => {
                    const IconeAtual = destaques[cardAtual].icone;
                    return <IconeAtual size={30} />;
                  })()}
                </div>

                <h3>{destaques[cardAtual].titulo}</h3>

                <p>{destaques[cardAtual].descricao}</p>

                <div className="inst-carousel-controles">
                  <button
                    type="button"
                    onClick={prevCard}
                    aria-label="Card anterior"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  <div className="inst-carousel-indicadores">
                    {destaques.map((item, index) => (
                      <button
                        key={item.titulo}
                        type="button"
                        className={cardAtual === index ? "ativo" : ""}
                        onClick={() => setCardAtual(index)}
                        aria-label={`Ir para o slide ${index + 1}`}
                        aria-current={cardAtual === index ? "true" : undefined}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={nextCard}
                    aria-label="Próximo Card"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="inst-principios">
          <div className="container">
            <div className="inst-principios-header">
              <span className="inst-etiqueta">NOSSOS PRINCÍPIOS</span>

              <h2>O que nos move</h2>

              <p>
                Acreditamos que a tecnologia pode aproximar pessoas e contribuir
                para comunidades mais participativas.
              </p>
            </div>

            <div className="inst-cards">
              <article className="inst-card">
                <div className="inst-card-icon">
                  <Target size={30} />
                </div>

                <h3>Nossa missão</h3>

                <p>
                  Incentivar a participação cidadã e facilitar a comunicação
                  entre a população e a gestão pública, tornando mais acessível
                  o registro de problemas urbanos.
                </p>
              </article>

              <article className="inst-card">
                <div className="inst-card-icon">
                  <Eye size={30} />
                </div>

                <h3>Nossa visão</h3>

                <p>
                  Contribuir para cidades mais conectadas, participativas e
                  conscientes das necessidades de suas comunidades.
                </p>
              </article>

              <article className="inst-card">
                <div className="inst-card-icon">
                  <Handshake size={30} />
                </div>

                <h3>Nossos valores</h3>

                <p>
                  Transparência, acessibilidade, colaboração e compromisso com a
                  comunidade são os princípios que orientam o desenvolvimento do
                  CidaLink.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="inst-historia">
          <div className="container">
            <div className="inst-historia-header">
              <span className="inst-etiqueta">NOSSA TRAJETÓRIA</span>

              <h2>Uma ideia que continua evoluindo.</h2>

              <p>
                Conheça um pouco da jornada por trás do CidaLink, desde sua
                concepção até os próximos passos.
              </p>
            </div>

            <div className="inst-timeline">
              <article className="inst-timeline-item">
                <div className="inst-timeline-ponto">
                  <span>01</span>
                </div>

                <div className="inst-timeline-card">
                  <span className="inst-timeline-tag">O COMEÇO</span>

                  <h3>Uma ideia com propósito</h3>

                  <p>
                    O projeto surgiu da percepção de que a comunicação entre
                    cidadãos e administração pública poderia ser mais acessível
                    e organizada, especialmente na identificação de problemas
                    urbanos.
                  </p>
                </div>
              </article>

              <article className="inst-timeline-item">
                <div className="inst-timeline-ponto">
                  <span>02</span>
                </div>

                <div className="inst-timeline-card">
                  <span className="inst-timeline-tag">DESENVOLVIMENTO</span>

                  <h3>Da ideia à plataforma</h3>

                  <p>
                    Desenvolvido como projeto acadêmico por estudantes de
                    Sistemas para Internet da Fatec Taquaritinga, o CidaLink
                    começou a ganhar forma por meio do planejamento, da
                    programação e do trabalho em equipe.
                  </p>
                </div>
              </article>

              <article className="inst-timeline-item">
                <div className="inst-timeline-ponto">
                  <span>03</span>
                </div>

                <div className="inst-timeline-card">
                  <span className="inst-timeline-tag">VERSÕES</span>

                  <h3>Uma plataforma em funcionamento</h3>

                  <p>
                    A primeira versão do CidaLink foi disponibilizada online,
                    mais simples em html e css permitindo apresentar a proposta
                    e colocar em prática as funcionalidades desenvolvidas.
                    Segunda versão feita em React.
                  </p>
                </div>
              </article>

              <article className="inst-timeline-item">
                <div className="inst-timeline-ponto">
                  <span>04</span>
                </div>

                <div className="inst-timeline-card">
                  <span className="inst-timeline-tag">PRÓXIMOS PASSOS</span>

                  <h3>Um projeto em constante evolução</h3>

                  <p>
                    O objetivo é continuar aprimorando a plataforma,
                    implementando novas funcionalidades e ampliando suas
                    possibilidades de utilização. Começamos a implantar com o
                    mapa de nossa cidade, a ideia é colocar em outras
                    futuramente.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="inst-equipe">
          <div className="container">
            <div className="inst-equipe-header">
              <span className="inst-etiqueta">QUEM FAZ ACONTECER</span>

              <h2>Conheça nossa equipe</h2>

              <p>
                Por trás do CidaLink existe uma equipe de estudantes que uniu
                conhecimentos, ideias e dedicação para transformar uma proposta
                em realidade.
              </p>
            </div>

            <div className="inst-equipe-grid">
              {equipe.map((integrante) => (
                <article className="inst-equipe-card" key={integrante.id}>
                  <div className="inst-avatar">
                    <UserRound size={42} strokeWidth={1.5} />
                  </div>

                  <h3>{integrante.nome}</h3>

                  <span className="inst-equipe-funcao">
                    {integrante.funcao}
                  </span>

                  <div className="inst-equipe-detalhe"></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Prefooter />
    </>
  );
}
