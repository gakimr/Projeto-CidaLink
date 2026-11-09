import axios, { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const TOKEN_KEY = "token";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// anexa o token salvo em toda requisição
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let aoNaoAutorizado: (() => void) | null = null;

export function registrarNaoAutorizado(fn: () => void) {
  aoNaoAutorizado = fn;
}

api.interceptors.response.use(
  (resposta) => resposta,
  (error) => {
    const url: string = error.config?.url ?? "";
    const ehAuth = url.includes("/login") || url.includes("/cadastro");

    if (error.response?.status === 401 && !ehAuth) {
      aoNaoAutorizado?.();
    }
    return Promise.reject(error);
  },
);

// o backend devolve o caminho (/uploads/foto.jpg)
export function urlArquivo(caminho?: string | null) {
  return caminho ? `${API_URL}${caminho}` : null;
}

export function mensagemDeErro(error: unknown, padrao: string) {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique a conexão.";
    }
    const dado = error.response.data?.data;
    if (typeof dado === "string") return dado;
  }
  return padrao;
}

export default api;
