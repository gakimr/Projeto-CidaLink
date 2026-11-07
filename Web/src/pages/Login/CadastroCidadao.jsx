import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function CadastroCidadao() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      await cadastrar({ nome, cpf, email, password: senha, tipo: "cidadao" });
      navigate("/app");
    } catch (error) {
      setErro(
        error.response?.data?.data || "Erro ao cadastrar. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="cardcadastro">
      <h2>Cadastro Cidadão</h2>
      <form onSubmit={handleSubmit}>
        <div className="inputgp">
          <label className="obrigatorio" htmlFor="nome">
            Nome Completo
          </label>
          <input
            id="nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="inputgp">
          <label className="obrigatorio" htmlFor="cpf">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            maxLength={14}
            required
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <div className="inputgp">
          <label className="obrigatorio" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
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
        <div className="inputgp">
          <label htmlFor="csenha">Confirmar Senha</label>
          <input
            id="csenha"
            type="password"
            required
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
        </div>

        {erro && <p className="erro-form">{erro}</p>}

        <button className="btnCadastro" type="submit" disabled={carregando}>
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <div className="ptlogin">
        <p>Já possui uma conta?</p>
        <Link className="btnCd" to="/login">
          Login
        </Link>
      </div>
    </main>
  );
}

export default CadastroCidadao;
