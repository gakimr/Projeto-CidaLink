import { Link } from "react-router-dom";
import { Map, FilePlus2, Users, ArrowRight } from "lucide-react";

import Prefooter from "../../components/PreFooter/Prefooter";
import "./Plataforma.css";

export default function Plataforma() {
  return (
    <>
      <main className="plataforma">
        {/* Apresentação */}
        <section className="plat-hero">
          <div className="container">
            <span className="plat-etiqueta">CONHEÇA A PLATAFORMA</span>

            <h1>
              Sua cidade, sua voz,
              <br />
              sua participação.
            </h1>

            <p>
              Descubra como o CidaLink utiliza a tecnologia para facilitar a
              comunicação sobre problemas urbanos e incentivar a participação
              cidadã.
            </p>

            <div className="plat-hero-acoes">
              <Link to="/cadastro/cidadao" className="plat-btn">
                Começar agora
                <ArrowRight size={18} />
              </Link>

              <a href="#funcionalidades" className="plat-btn-secundario">
                Conhecer funcionalidades
              </a>
            </div>
          </div>
        </section>

        <section className="plat-funcionalidades" id="funcionalidades">
          <div className="container">
            <div className="plat-section-header">
              <span className="plat-etiqueta">O QUE VOCÊ ENCONTRA</span>

              <h2>Uma plataforma, diferentes possibilidades.</h2>

              <p>
                O CidaLink reúne ferramentas que ajudam a organizar informações
                sobre a cidade e aproximar a comunidade.
              </p>
            </div>

            <div className="plat-cards">
              <article className="plat-card">
                <div className="plat-card-icon">
                  <Map size={30} />
                </div>

                <h3>Mapa interativo</h3>

                <p>
                  Visualize a localização das ocorrências e tenha uma visão
                  espacial dos problemas registrados na cidade.
                </p>
              </article>

              <article className="plat-card">
                <div className="plat-card-icon">
                  <FilePlus2 size={30} />
                </div>

                <h3>Registro de ocorrências</h3>

                <p>
                  Conheça o formulário para descrever problemas urbanos,
                  informar o endereço e anexar imagens.
                </p>
              </article>

              <article className="plat-card">
                <div className="plat-card-icon">
                  <Users size={30} />
                </div>

                <h3>Participação cidadã</h3>

                <p>
                  Acompanhe as publicações da comunidade e participe da
                  construção de uma cidade mais conectada.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="plat-registro">
          <div className="container">
            <div className="plat-registro-texto">
              <span className="plat-etiqueta">PARTICIPE DA MUDANÇA</span>

              <h2>Encontrou um problema na cidade?</h2>

              <p>
                Com o CidaLink, você pode registrar ocorrências urbanas,
                descrever o que está acontecendo, informar o endereço e
                adicionar uma imagem para ajudar a identificar o problema.
              </p>

              <ul>
                <li>Escolha a categoria do problema.</li>
                <li>Informe o endereço e o bairro.</li>
                <li>Descreva a situação encontrada.</li>
                <li>Adicione uma foto para complementar o registro.</li>
              </ul>

              <Link to="/cadastro/cidadao" className="plat-btn">
                Quero participar <ArrowRight size={18} />
              </Link>
            </div>

            <div className="plat-registro-visual">
              <div className="plat-registro-card">
                <div className="plat-registro-card-icon">
                  <FilePlus2 size={32} />
                </div>

                <h3>Nova ocorrência</h3>
                <p>Ajude a melhorar sua cidade compartilhando informações.</p>

                <div className="plat-campo-exemplo">
                  <span>Categoria</span>
                  <div>Selecione o problema</div>
                </div>

                <div className="plat-campo-exemplo">
                  <span>Endereço</span>
                  <div>Informe o local da ocorrência</div>
                </div>

                <div className="plat-campo-exemplo">
                  <span>Descrição</span>
                  <div className="plat-campo-descricao">
                    Conte o que aconteceu...
                  </div>
                </div>

                <div className="plat-upload-exemplo">
                  <FilePlus2 size={20} />
                  <span>Adicionar imagem</span>
                </div>

                <div className="plat-registro-aviso">
                  Prévia ilustrativa do formulário
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="plat-mapa" id="mapa">
          <div className="container">
            <div className="plat-mapa-texto">
              <span className="plat-etiqueta">VISUALIZE SUA CIDADE</span>

              <h2>Os problemas da cidade em uma visão mais ampla.</h2>

              <p>
                O mapa interativo do CidaLink foi pensado para facilitar a
                visualização das ocorrências urbanas e permitir que os cidadãos
                compreendam melhor os problemas presentes em diferentes regiões.
              </p>

              <p>
                A proposta é reunir informações geográficas em um único espaço,
                tornando a participação cidadã mais acessível e organizada.
              </p>

              <Link to="/app/mapa" className="plat-btn">
                Acessar o mapa <ArrowRight size={18} />
              </Link>
            </div>

            <div className="plat-mapa-visual">
              <img src="/mapa.jpeg" alt="Mapa de ocorrências do CidaLink" />
            </div>
          </div>
        </section>

        <section className="plat-admin" id="administrador">
          <div className="container">
            <div className="plat-admin-visual">
              <Users size={80} />
              <span>ÁREA ADMINISTRATIVA</span>
              <p>Gerenciamento da plataforma</p>
            </div>

            <div className="plat-admin-texto">
              <span className="plat-etiqueta">GESTÃO E ORGANIZAÇÃO</span>

              <h2>Uma área dedicada à administração.</h2>

              <p>
                O CidaLink também conta com acesso destinado aos
                administradores, separado da experiência dos cidadãos.
              </p>

              <p>
                Essa área foi planejada para apoiar a gestão da plataforma e
                permitir o acesso por meio de uma autenticação específica.
              </p>

              <Link to="/loginadm" className="plat-btn">
                Acesso administrativo <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="plat-cta">
          <div className="container">
            <span className="plat-etiqueta">FAÇA PARTE DESSA MUDANÇA</span>

            <h2>Uma cidade melhor começa com a participação de todos.</h2>

            <p>
              Junte-se ao CidaLink e ajude a construir uma comunidade mais
              conectada, participativa e consciente.
            </p>

            <Link to="/cadastro/cidadao" className="plat-cta-btn">
              Criar minha conta
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Prefooter />
    </>
  );
}
