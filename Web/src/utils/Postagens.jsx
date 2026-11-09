import L from "leaflet";
import api from "../services/api";

export const CATEGORIA_LABEL = {
  buraco: "🚧 Buraco na via",
  iluminacao: "💡 Iluminação Pública",
  lixo: "🗑️ Acúmulo de Lixo",
  saneamento: "🚰 Problemas de Saneamento",
  outro: "📌 Outro",
};

export const STATUS_LABEL = {
  pendente: "Pendente",
  andamento: "Em andamento",
  resolvida: "Resolvido",
};

// o index.css usa "status-resolvido"; o banco guarda "resolvida"
export const STATUS_CLASSE = {
  pendente: "pendente",
  andamento: "andamento",
  resolvida: "resolvido",
};

export function urlArquivo(caminho) {
  return caminho ? `${api.defaults.baseURL}${caminho}` : null;
}

export function avatarPadrao(nome = "") {
  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .replace(/[^\p{L}]/gu, "")
    .toUpperCase();

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
    '<rect width="100" height="100" fill="#87d287"/>' +
    '<text x="50" y="50" font-family="Arial, sans-serif" font-size="40" ' +
    'font-weight="700" fill="#19732d" text-anchor="middle" ' +
    `dominant-baseline="central">${iniciais}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const pins = {};
export function iconePin(status) {
  if (!pins[status]) {
    pins[status] = L.divIcon({
      className: "",
      html: `<span class="pin-mapa pin-mapa-${status}"></span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }
  return pins[status];
}