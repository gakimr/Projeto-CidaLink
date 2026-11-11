import { useState } from "react";
import { Link } from "react-router-dom";
import "./RecuperarSenha.css";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // Simulação até a integração com o backend.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEnviado(true);
    } catch {
      setErro("Não foi possível solicitar a recuperação. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="cardForm">
      <div className="cardlogin recuperar-card">
        {!enviado ? (
          <>
            <div className="recuperar-icone">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>

            <h2>Recuperar senha</h2>
            <h3>Vamos recuperar seu acesso!</h3>

            <p className="texto-recuperacao">
              Esqueceu sua senha? Não se preocupe!
              Informe o e-mail cadastrado na sua conta
              para receber as instruções de recuperação.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="inputgp">
                <label htmlFor="email-recuperacao">
                  E-mail cadastrado
                </label>
                <input
                  id="email-recuperacao"
                  type="email"
                  placeholder="Digite seu e-mail"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {erro && <p className="erro-form">{erro}</p>}

              <div className="ptlogin">
                <button
                  className="btnEntrar"
                  type="submit"
                  disabled={carregando}
                >
                  {carregando ? "Enviando..." : "Enviar link de recuperação"}
                </button>
              </div>
            </form>

            <div className="recuperar-dica">
              <span>ⓘ</span>
              <p>
                Confira se digitou corretamente o e-mail utilizado
                no seu cadastro.
              </p>
            </div>

            <div className="ptlogin">
              <Link className="rsenha" to="/login">
                ← Voltar para o login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="recuperar-icone sucesso-icone">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>

            <h2>Solicitação recebida!</h2>
            <h3>Estamos quase lá!</h3>

            <p className="texto-recuperacao">
              Sua solicitação foi registrada para o e-mail:
            </p>

            <div className="email-confirmacao">
              {email}
            </div>

            <p className="texto-recuperacao aviso-final">
              A recuperação por e-mail estará disponível assim que
              a integração com o servidor for implementada.
            </p>

            <div className="ptlogin">
              <Link className="btnCd" to="/login">
                Voltar para o login
              </Link>
            </div>

            <button
              className="recuperar-tentar"
              type="button"
              onClick={() => {
                setEnviado(false);
                setEmail("");
              }}
            >
              Tentar com outro e-mail
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default RecuperarSenha;
