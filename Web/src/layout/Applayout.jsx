import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-envoltoria">
        <Header comLogo={false} />
        <main className="app-conteudo">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}