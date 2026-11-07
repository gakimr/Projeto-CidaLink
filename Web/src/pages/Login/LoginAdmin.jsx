import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const usuario = await login(email, senha);

      if (usuario.tipo !== "admin") {
        setErro("Esta conta não tem acesso de administrador.");
        return;
      }

      navigate("/app"); // troque para a rota do painel admin quando ela existir
    } catch (error) {
      setErro(error.response?.data?.data || "Erro ao entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="cardForm">
      <div className="cardlogin">
        <h2>Entrar no CidaLink</h2>
        <h3>Administrador</h3>

        <form onSubmit={handleSubmit}>
          <div className="inputgp">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="inputgp">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <p className="erro-form">{erro}</p>}

          <div className="ptlogin">
            <button className="btnEntrar" type="submit" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <div className="ptlogin">
          <Link className="rsenha" to="/recuperar-senha">
            Esqueceu a senha?
          </Link>
        </div>
        <div className="ptlogin">
          <p>Ainda não tem uma conta?</p>
          <Link className="btnCd" to="/cadastro/administrador">
            Cadastre-se
          </Link>
        </div>
      </div>
    </main>
  );
}

export default LoginAdmin;
