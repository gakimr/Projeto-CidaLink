import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Database } from "lucide-react";

import Prefooter from "../../components/PreFooter/Prefooter";
import "./PoliticaPrivacidade.css";

export default function PoliticaPrivacidade() {
  return (
    <>
      <main className="privacidade">
        <section className="priv-hero">
          <div className="container">
            <span className="priv-etiqueta">SUPORTE & LEGAL</span>

            <h1>Política de Privacidade</h1>

            <p>
              Saiba como as informações dos usuários são tratadas durante a
              utilização do CidaLink.
            </p>
          </div>
        </section>

        <section className="priv-conteudo">
          <div className="container">
            <div className="priv-introducao">
              <ShieldCheck size={32} />

              <div>
                <h2>Sua privacidade é importante!</h2>
                <p>
                  Esta Política de Privacidade apresenta informações sobre o
                  tratamento de dados pessoais no CidaLink, considerando os
                  princípios da transparência, segurança e respeito à
                  privacidade dos usuários.
                </p>
              </div>
            </div>

            <article className="priv-secao">
              <h2>1. Informações coletadas</h2>
              <p>
                Durante o cadastro e a utilização da plataforma, poderão ser
                tratados dados fornecidos diretamente pelos usuários, conforme
                as funcionalidades disponíveis.
              </p>
              <p>
                Entre essas informações podem estar dados de identificação e
                contato, informações relacionadas ao perfil e conteúdos enviados
                nos registros de ocorrências.
              </p>
            </article>

            <article className="priv-secao">
              <h2>2. Finalidade do tratamento</h2>
              <p>
                As informações são utilizadas para permitir o funcionamento das
                funcionalidades do CidaLink, incluindo:
              </p>

              <ul>
                <li>Realizar e gerenciar o cadastro de usuários;</li>
                <li>Permitir o acesso às funcionalidades da plataforma;</li>
                <li>
                  Registrar e organizar ocorrências informadas pelos cidadãos;
                </li>
                <li>
                  Possibilitar a visualização das informações disponibilizadas
                  na plataforma.
                </li>
              </ul>
            </article>

            <article className="priv-secao">
              <h2>3. Compartilhamento de informações</h2>
              <p>
                As informações fornecidas pelos usuários devem ser utilizadas de
                acordo com as finalidades da plataforma e com a legislação
                aplicável.
              </p>
              <p>
                Qualquer compartilhamento de dados pessoais deverá observar uma
                finalidade legítima e uma hipótese legal adequada, conforme a
                LGPD.
              </p>
            </article>

            <article className="priv-secao">
              <h2>4. Armazenamento e segurança</h2>
              <p>
                O CidaLink busca adotar medidas técnicas e organizacionais
                adequadas para proteger as informações contra acessos não
                autorizados, perdas, alterações ou usos indevidos.
              </p>
              <p>
                O acesso às informações deve respeitar as permissões e os níveis
                de acesso definidos na plataforma.
              </p>
            </article>

            <article className="priv-secao">
              <h2>5. Direitos dos titulares</h2>
              <p>
                De acordo com a LGPD, os titulares de dados pessoais possuem
                direitos relacionados ao tratamento de suas informações,
                incluindo:
              </p>

              <ul>
                <li>Confirmação da existência de tratamento;</li>
                <li>Acesso aos dados pessoais;</li>
                <li>Correção de informações incompletas ou desatualizadas;</li>
                <li>Solicitação de eliminação de dados, quando aplicável;</li>
                <li>Informações sobre o compartilhamento de dados.</li>
              </ul>
            </article>

            <article className="priv-secao">
              <h2>6. Cookies e tecnologias semelhantes</h2>
              <p>
                Esta seção deverá refletir as tecnologias efetivamente
                utilizadas pelo CidaLink. Caso sejam utilizados cookies ou
                mecanismos semelhantes, suas finalidades deverão ser informadas
                aos usuários.
              </p>
            </article>

            <article className="priv-secao">
              <h2>7. Alterações nesta política</h2>
              <p>
                Esta Política de Privacidade poderá ser atualizada para refletir
                mudanças nas funcionalidades da plataforma ou na legislação
                aplicável.
              </p>
              <p>Recomendamos consultar esta página periodicamente.</p>
            </article>

            <article className="priv-secao">
              <h2>8. Contato</h2>
              <p>
                Em caso de dúvidas sobre esta Política de Privacidade ou sobre o
                tratamento de dados, utilize o canal de contato disponibilizado
                na nossa <Link to="/suporte">Central de Ajuda</Link>.
              </p>
            </article>

            <div className="priv-aviso">
              <Lock size={25} />

              <p>
                O CidaLink valoriza a transparência e busca tratar as
                informações dos usuários com responsabilidade e respeito à
                privacidade.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Prefooter />
    </>
  );
}
