import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { registrarNaoAutorizado, TOKEN_KEY } from "@/services/api";

const USER_KEY = "usuario";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: "cidadao" | "admin";
  cpf: string;
  bairroId?: number | null;
  latitude?: string;
  longitude?: string;
  fotoPerfil?: string | null;
};

export type DadosCadastro = {
  nome: string;
  cpf: string;
  email: string;
  password: string;
  tipo: "cidadao" | "admin";
  codigoAdmin?: string;
};

type AuthContextData = {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<Usuario>;
  cadastrar: (dados: DadosCadastro) => Promise<Usuario>;
  atualizarUsuario: (usuario: Usuario) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setUsuario(null);
  }, []);

  // restaura a sessão quando o app abre
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const salvo = await SecureStore.getItemAsync(USER_KEY);
        if (token && salvo) setUsuario(JSON.parse(salvo));
      } catch {
        // sessão começa deslogado
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  // token expirado: o interceptor avisa e desloga
  useEffect(() => {
    registrarNaoAutorizado(logout);
  }, [logout]);

  async function guardarSessao(token: string, user: Usuario) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    setUsuario(user);
  }

  async function login(email: string, senha: string) {
    const resposta = await api.post("/login", { email, password: senha });
    const { token, user } = resposta.data.data;
    await guardarSessao(token, user);
    return user as Usuario;
  }

  async function cadastrar(dados: DadosCadastro) {
    const resposta = await api.post("/cadastro", dados);
    const { token, user } = resposta.data.data;
    await guardarSessao(token, user);
    return user as Usuario;
  }

  async function atualizarUsuario(novo: Usuario) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(novo));
    setUsuario(novo);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        login,
        cadastrar,
        atualizarUsuario,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return contexto;
}
