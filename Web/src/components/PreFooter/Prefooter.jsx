import { Link } from "react-router-dom";

import logoCidalink from "../../assets/LogoCida.svg";
import logoCidalinkEscuro from "../../assets/LogoCidaDM.svg";

import "./PreFooter.css";

export default function PreFooter() {
  return (
    <section className="pre-footer">
      <div className="container footer-grid">
        <div className="footer-sobre">
          <img
            src={logoCidalink}
            alt="CidaLink"
            className="footer-logo logo-claro"
          />

          <img
            src={logoCidalinkEscuro}
            alt="CidaLink"
            className="footer-logo logo-escuro"
          />

          <p>Conectando cidadãos e gestão para transformar a cidade.</p>

          <Link to="/cadastro/cidadao" className="btn btn-primario">
            Comece a usar!
          </Link>
        </div>

        <div className="footer-coluna">
          <h4>Institucional</h4>
          <ul>
            <li>
              <Link to="/institucional">Quem somos</Link>
            </li>
            <li>
              <Link to="/institucional">Nossa missão</Link>
            </li>
            <li>
              <Link to="/institucional">Nosso Projeto</Link>
            </li>
          </ul>
        </div>

        <div className="footer-coluna">
          <h4>Plataforma</h4>
          <ul>
            <li>
              <Link to="/plataforma">Mapa Interativo</Link>
            </li>
            <li>
              <Link to="/plataforma">Relatos/Ocorrências</Link>
            </li>
            <li>
              <Link to="/plataforma">Administrador</Link>
            </li>
          </ul>
        </div>

        <div className="footer-coluna">
          <h4>Suporte & Legal</h4>
          <ul>
            <li>
              <Link to="/suporte">Central de Ajuda</Link>
            </li>
            <li>
              <Link to="/termos-de-uso">Termos de uso</Link>
            </li>
            <li>
              <Link to="/politica-de-privacidade">Política de Privacidade</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
