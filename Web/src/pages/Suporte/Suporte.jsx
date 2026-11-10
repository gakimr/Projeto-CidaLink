import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleHelp, MessageCircle, BookOpen, ArrowRight } from "lucide-react";

import Prefooter from "../../components/PreFooter/Prefooter";
import "./Suporte.css";

export default function Suporte() {
  const [perguntaAberta, setPerguntaAberta] = useState(null);

  const perguntas = [
    {
      pergunta: "O que é o CidaLink?",
      resposta:
        "O CidaLink é uma plataforma que busca aproximar cidadãos e gestão pública, facilitando o compartilhamento de informações sobre problemas urbanos.",
    },
    {
      pergunta: "Como posso me cadastrar?",
      resposta:
        "Acesse a opção de cadastro para cidadãos, preencha as informações solicitadas e crie sua conta para começar a utilizar a plataforma.",
    },
    {
      pergunta: "Como registrar uma ocorrência?",
      resposta:
        "Após entrar na plataforma, acesse a opção de criar ocorrência. Você poderá informar a categoria, o endereço, o bairro, descrever o problema e adicionar uma imagem.",
    },
    {
      pergunta: "Preciso ter uma conta para utilizar o CidaLink?",
      resposta:
        "Para acessar as funcionalidades destinadas aos cidadãos, é necessário realizar o cadastro e entrar na plataforma.",
    },
    {
      pergunta: "Quem pode acessar a área administrativa?",
      resposta:
        "A área administrativa é destinada aos usuários que possuem credenciais de administrador.",
    },
    {
      pergunta: "O CidaLink funciona em outras cidades?",
      resposta:
        "Atualmente, o projeto possui foco inicial na cidade onde foi desenvolvido, com a proposta de ampliar sua utilização futuramente.",
    },
  ];

  return (
    <>
      <main className="suporte">
        <section className="sup-faq">
          <div className="container">
            <div className="sup-section-header">
              <span className="sup-etiqueta">PRECISA DE AJUDA?</span>
              <h2>Dúvidas frequentes</h2>
              <p>
                Reunimos algumas respostas para ajudar você a conhecer e
                utilizar o CidaLink.
              </p>
            </div>

            <div className="sup-faq-lista">
              {perguntas.map((item, index) => (
                <div className="sup-faq-item" key={index}>
                  <button
                    className="sup-faq-pergunta"
                    onClick={() =>
                      setPerguntaAberta(perguntaAberta === index ? null : index)
                    }
                    aria-expanded={perguntaAberta === index}
                  >
                    <span>{item.pergunta}</span>
                    <span className="sup-faq-sinal">
                      {perguntaAberta === index ? "−" : "+"}
                    </span>
                  </button>

                  {perguntaAberta === index && (
                    <div className="sup-faq-resposta">
                      <p>{item.resposta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sup-contato">
          <div className="container">
            <div className="sup-section-header">
              <span className="sup-etiqueta">FALE CONOSCO</span>
              <h2>Ainda precisa de ajuda?</h2>
              <p>
                Não encontrou a resposta que procurava? Envie sua dúvida para
                nossa equipe!
              </p>
            </div>

            <form
              className="sup-formulario"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="sup-campo">
                <label htmlFor="nome">Nome completo</label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Digite seu nome"
                  required
                />
              </div>

              <div className="sup-campo">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </div>

              <div className="sup-campo">
                <label htmlFor="assunto">Assunto</label>
                <input
                  type="text"
                  id="assunto"
                  placeholder="Qual é o assunto da sua dúvida?"
                  required
                />
              </div>

              <div className="sup-campo">
                <label htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem"
                  rows="5"
                  placeholder="Descreva sua dúvida ou problema..."
                  required
                />
              </div>

              <button type="submit" className="sup-btn-enviar">
                <MessageCircle size={18} />
                Enviar mensagem
              </button>
            </form>
          </div>
        </section>
      </main>

      <Prefooter />
    </>
  );
}
