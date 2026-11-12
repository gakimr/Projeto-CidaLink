import api from "@/services/api";

export type StatusOcorrencia = "pendente" | "andamento" | "resolvida";

export type Ocorrencia = {
  id: number;
  categoria: string;
  descricao: string;
  logradouro: string;
  bairroId: number | null;
  bairro: string;
  latitude: string;
  longitude: string;
  foto: string | null;
  status: StatusOcorrencia;
  respostaAdmin: string;
  criadoEm: string;
  autor: {
    id: number;
    nome: string;
    fotoPerfil: string | null;
  };
};

export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  const { data } = await api.get("/postagens");
  return data.data.postagens;
}

const ROTULOS_CATEGORIA: Record<string, string> = {
  buraco: "Buraco na via",
  iluminacao: "Iluminação pública",
  lixo: "Lixo e coleta",
  saneamento: "Saneamento",
  outro: "Outro problema",
};

export function rotuloCategoria(categoria: string) {
  return ROTULOS_CATEGORIA[categoria] ?? categoria;
}

export function localDaOcorrencia(o: Ocorrencia) {
  return (
    [o.logradouro, o.bairro].filter(Boolean).join(" - ") ||
    "Local não informado"
  );
}

export function coordenadasDaOcorrencia(o: Ocorrencia) {
  const latitude = Number(o.latitude);
  const longitude = Number(o.longitude);
  // "" vira 0 no Number(), então checa a string antes
  if (!o.latitude || !o.longitude) return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
}

export function tempoDecorrido(iso: string) {
  const data = new Date(iso).getTime();
  if (Number.isNaN(data)) return "";

  const minutos = Math.max(0, Math.floor((Date.now() - data) / 60000));
  if (minutos < 1) return "agora há pouco";
  if (minutos < 60) return `${minutos} min atrás`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas} h atrás`;

  const dias = Math.floor(horas / 24);
  if (dias < 30) return `${dias} ${dias === 1 ? "dia" : "dias"} atrás`;

  const meses = Math.floor(dias / 30);
  if (meses < 12) return `${meses} ${meses === 1 ? "mês" : "meses"} atrás`;

  const anos = Math.floor(meses / 12);
  return `${anos} ${anos === 1 ? "ano" : "anos"} atrás`;
}
