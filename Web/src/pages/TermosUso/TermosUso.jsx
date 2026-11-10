import { Link } from "react-router-dom";
import { FileText, ShieldCheck } from "lucide-react";

import Prefooter from "../../components/PreFooter/Prefooter";
import "./TermosUso.css";

export default function TermosUso() {
  return (
    <>
      <main className="termos">
        <section className="termos-hero">
          <div className="container">
            <span className="termos-etiqueta">SUPORTE & LEGAL</span>

            <h1>Termos de Uso</h1>

            <p>Conheça as condições e orientações para utilizar o CidaLink.</p>
          </div>
        </section>

        <section className="termos-conteudo">
          <div className="container">
            <div className="termos-introducao">
              <FileText size={30} />

              <div>
                <h2>Bem-vindo ao CidaLink!</h2>
                <p>
                  Ao acessar e utilizar nossa plataforma, você concorda com as
                  condições descritas nestes Termos de Uso. Recomendamos a
                  leitura atenta deste documento antes de utilizar os recursos
                  disponíveis.
                </p>
              </div>
            </div>

            <article className="termos-secao">
              <h2>1. Sobre o CidaLink</h2>
              <p>
                O CidaLink é uma plataforma desenvolvida com o objetivo de
                aproximar cidadãos e comunidade da gestão urbana, permitindo o
                registro e a visualização de ocorrências relacionadas à
                infraestrutura e aos serviços da cidade.
              </p>
            </article>

            <article className="termos-secao">
              <h2>2. Cadastro e acesso</h2>
              <p>
                Para utilizar determinadas funcionalidades, o usuário deverá
                realizar um cadastro e fornecer informações verdadeiras e
                atualizadas.
              </p>
              <p>
                O usuário é responsável pela segurança de suas credenciais de
                acesso e pelas atividades realizadas por meio de sua conta.
              </p>
            </article>

            <article className="termos-secao">
              <h2>3. Uso da plataforma</h2>
              <p>Ao utilizar o CidaLink, o usuário concorda em:</p>

              <ul>
                <li>
                  Fornecer informações verdadeiras ao registrar ocorrências;
                </li>
                <li>
                  Utilizar a plataforma de maneira respeitosa e responsável;
                </li>
                <li>
                  Publicar conteúdos relacionados à finalidade do CidaLink;
                </li>
                <li>
                  Não utilizar o sistema para fins ilegais ou prejudiciais a
                  terceiros.
                </li>
              </ul>
            </article>

            <article className="termos-secao">
              <h2>4. Registro de ocorrências</h2>
              <p>
                As informações e imagens enviadas pelos usuários devem
                corresponder, sempre que possível, à situação relatada.
              </p>
              <p>
                O usuário deve evitar o envio de informações falsas, ofensivas,
                discriminatórias ou que exponham indevidamente dados pessoais de
                outras pessoas.
              </p>
            </article>

            <article className="termos-secao">
              <h2>5. Responsabilidades do usuário</h2>
              <p>
                Cada usuário é responsável pelo conteúdo que fornece à
                plataforma, incluindo textos, imagens e demais informações
                enviadas.
              </p>
              <p>
                O uso do CidaLink não deve comprometer a segurança, o
                funcionamento ou a finalidade da plataforma.
              </p>
            </article>

            <article className="termos-secao">
              <h2>6. Disponibilidade e limitações</h2>
              <p>
                O CidaLink é um projeto em desenvolvimento. Por esse motivo,
                algumas funcionalidades podem sofrer alterações, apresentar
                limitações ou ficar temporariamente indisponíveis.
              </p>
              <p>
                O registro de uma ocorrência na plataforma não representa, por
                si só, uma garantia de atendimento, solução ou prazo de
                resolução por parte dos órgãos responsáveis.
              </p>
            </article>

            <article className="termos-secao">
              <h2>7. Privacidade e proteção de dados</h2>
              <p>
                O tratamento das informações fornecidas pelos usuários deve
                observar as diretrizes da legislação aplicável de proteção de
                dados, especialmente a Lei Geral de Proteção de Dados Pessoais
                (LGPD).
              </p>
              <p>
                Para saber mais, consulte nossa{" "}
                <Link to="/politica-de-privacidade">
                  Política de Privacidade
                </Link>
                .
              </p>
            </article>

            <article className="termos-secao">
              <h2>8. Alterações nos termos</h2>
              <p>
                Estes Termos de Uso poderão ser atualizados para acompanhar
                mudanças na plataforma, em suas funcionalidades ou nas
                exigências legais aplicáveis.
              </p>
              <p>
                Recomendamos que os usuários consultem periodicamente esta
                página.
              </p>
            </article>

            <div className="termos-aviso">
              <ShieldCheck size={24} />
              <p>
                O uso responsável da plataforma contribui para um ambiente
                colaborativo e respeitoso para todos.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Prefooter />
    </>
  );
}
