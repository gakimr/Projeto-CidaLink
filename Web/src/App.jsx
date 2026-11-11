import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import LoginCidadao from "./pages/Login/LoginCidadao";
import LoginAdmin from "./pages/Login/LoginAdmin";
import CadastroCidadao from "./pages/Login/CadastroCidadao";
import CadastroAdmin from "./pages/Login/CadastroAdmin";
import AppLayout from "./layout/Applayout";
import Mapa from "./pages/App/Mapa/Mapa";
import Feed from "./pages/App/Feed/Feed";
import CriarOcorrencia from "./pages/App/CriarOcorrencia/CriarOcorrencia";
import Perfil from "./pages/App/Perfil/Perfil";
import RotaProtegida from "./routes/RotaProtegida";
import Institucional from "./pages/Institucional/Institucional";
import Plataforma from "./pages/Plataforma/Plataforma";
import Suporte from "./pages/Suporte/Suporte";
import TermosUso from "./pages/TermosUso/TermosUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade/PoliticaPrivacidade";
import Notificacoes from "./pages/App/notificacoes/Notificacoes";
import GerenciarOcorrencia from "./pages/App/GerenciarOcorrencia/GerenciarOcorrencia";
import Chat from "./pages/App/Chat/Chat";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route
        element={
          <div>
            <Header />
            <Outlet />
            <Footer />
          </div>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginCidadao />} />
        <Route path="/loginadm" element={<LoginAdmin />} />
        <Route path="/cadastro/cidadao" element={<CadastroCidadao />} />
        <Route path="/cadastro/administrador" element={<CadastroAdmin />} />
        <Route path="/institucional" element={<Institucional />} />
        <Route path="/plataforma" element={<Plataforma />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/termos-de-uso" element={<TermosUso />} />
        <Route
          path="/politica-de-privacidade"
          element={<PoliticaPrivacidade />}
        />
      </Route>

      <Route
        element={
          <RotaProtegida>
            <AppLayout />
          </RotaProtegida>
        }
      >
        <Route path="/app" element={<Feed />} />
        <Route path="/app/mapa" element={<Mapa />} />
        <Route path="/app/criar-ocorrencia" element={<CriarOcorrencia />} />
        <Route path="/app/perfil" element={<Perfil />} />
        <Route path="/app/notificacoes" element={<Notificacoes />} />
        <Route path="/app/ocorrencia/:id" element={<GerenciarOcorrencia />} />
        <Route path="/app/bate-papo" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
