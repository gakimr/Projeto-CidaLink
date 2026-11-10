import { useState, useEffect } from "react";
import SvgFiltrosDaltonismo from "./SvgFiltrosDaltonismo";
import "./AcessibilityMenu.css";

const OPCOESFILTRO = [
  "Protanopia",
  "Protanomalia",
  "Deuteranopia",
  "Deuteranomalia",
  "Tritanopia",
  "Tritanomalia",
  "Acromatopsia",
];

export default function AcessibilityMenu() {
  const [open, setopen] = useState(false);
  const [darkmode, setdarkmode] = useState(false);
  const [filter, setfilter] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("darkmode", darkmode);
  }, [darkmode]);

  useEffect(() => {
    const raiz = document.documentElement;

    OPCOESFILTRO.forEach((nome) => raiz.classList.remove(`filtro-${nome}`));

    if (filter) {
      raiz.classList.add(`filtro-${filter}`);
    }
  }, [filter]);

  function reset() {
    setfilter(null);
    setdarkmode(false);
  }

  return (
    <div className="acessibility">
      <SvgFiltrosDaltonismo />
      <button
        type="button"
        className="btn-acessibility"
        onClick={() => setopen(!open)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="4" r="2" />
          <path d="M19 8.5c-2.5.6-4.8.9-7 .9s-4.5-.3-7-.9c-.8-.2-1.5.4-1.5 1.2 0 .6.4 1.1 1 1.3 1.9.5 3.5.8 4.9.9l-1 8.6c-.1.7.5 1.3 1.2 1.3h.1c.6 0 1.1-.4 1.2-1l1-6.3h.2l1 6.3c.1.6.6 1 1.2 1h.1c.7 0 1.3-.6 1.2-1.3l-1-8.6c1.4-.1 3-.4 4.9-.9.6-.2 1-.7 1-1.3 0-.8-.7-1.4-1.5-1.2z" />
        </svg>
      </button>

      {open && (
        <div className="menu-acessibility">
          <button
            type="button"
            className="acessItem"
            onClick={() => setdarkmode(!darkmode)}
          >
            🌙 Modo escuro
          </button>

          <div className="div-acessibility"></div>

          {OPCOESFILTRO.map((nome) => (
            <button
              key={nome}
              type="button"
              className={`acessItem ${filter === nome ? "ativo" : ""}`}
              onClick={() => setfilter(filter === nome ? null : nome)}
            >
              {nome}
            </button>
          ))}

          <div className="div-acessibility"></div>

          <button type="button" className="acessItem" onClick={reset}>
            ↺ Restaurar cores padrão
          </button>
        </div>
      )}
    </div>
  );
}
