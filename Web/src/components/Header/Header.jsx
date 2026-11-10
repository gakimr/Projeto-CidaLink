import './Header.css'
import logoCidalink from '../../assets/LogoCida.svg'
import logoCidalinkEscuro from '../../assets/LogoCidaDM.svg'
import AcessibilityMenu from '../AcessibilityMenu/AcessibilityMenu'
import { Link } from "react-router-dom";

export default function Header({ comLogo = true }){
    return(
        <header>
          {comLogo && (
            <Link to="/">
              <img src={logoCidalink} alt="Logo CidaLink" className="logo logo-claro" />
              <img src={logoCidalinkEscuro} alt="Logo CidaLink" className="logo logo-escuro" />
            </Link>
          )}

             <div className="navDireita">
                <select id="idioma">
                    <option>Português</option>
                    <option>English</option>
                    <option>Español</option>
                </select>
                <AcessibilityMenu/>
             </div>
        </header>
    )
}