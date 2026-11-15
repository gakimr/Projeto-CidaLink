import "./Header.css";
import logoCidalink from "../../assets/LogoCida.svg";
import logoCidalinkEscuro from "../../assets/LogoCidaDM.svg";
import AcessibilityMenu from "../AcessibilityMenu/AcessibilityMenu";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header({ comLogo = true }) {
  const { i18n, t } = useTranslation();

  function trocarIdioma(event) {
    const idioma = event.target.value;

    i18n.changeLanguage(idioma);
    localStorage.setItem("idioma", idioma);
  }

  return (
    <header>
      {comLogo && (
        <Link to="/">
          <img
            src={logoCidalink}
            alt="Logo CidaLink"
            className="logo logo-claro"
          />
          <img
            src={logoCidalinkEscuro}
            alt="Logo CidaLink"
            className="logo logo-escuro"
          />
        </Link>
      )}

      <div className="navDireita">
        <select
          id="idioma"
          aria-label={t("idioma")}
          value={i18n.resolvedLanguage || "pt"}
          onChange={trocarIdioma}
        >
          <option value="pt">Português</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>

        <AcessibilityMenu />
      </div>
    </header>
  );
}
