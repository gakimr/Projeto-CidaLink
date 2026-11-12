
import api from "./api";

export type Notificacao = {
  id: number;
  usuario_id: number;
  postagem_id: number | null;
  mensagem_id: number | null;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida_em: string | null;
  criado_em: string;
};

export async function buscarNotificacoes(): Promise<Notificacao[]> {
  const resposta = await api.get("/notificacoes");

  return resposta.data.data.notificacoes;
}

export async function marcarNotificacaoComoLida(
  id: number
): Promise<void> {
  await api.put(`/notificacoes/${id}/lida`);
}


export async function marcarTodasComoLidas(): Promise<void> {
  await api.put("/notificacoes/lidas");
}
