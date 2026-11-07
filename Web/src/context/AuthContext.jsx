import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem("user");
    return salvo ? JSON.parse(salvo) : null;
  });

  async function login(email, password) {
    const resposta = await api.post("/login", { email, password });
    const { token, user: dadosUser } = resposta.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(dadosUser));
    setUser(dadosUser);

    return dadosUser;
  }

  async function cadastrar(dados) {
    const resposta = await api.post("/cadastro", dados);
    const { token, user: dadosUser } = resposta.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(dadosUser));
    setUser(dadosUser);

    return dadosUser;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  function atualizarUser(novosDados) {
    setUser(novosDados);
    localStorage.setItem("user", JSON.stringify(novosDados));
  }

  return (
    <AuthContext.Provider
      value={{ user, login, cadastrar, logout, atualizarUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
