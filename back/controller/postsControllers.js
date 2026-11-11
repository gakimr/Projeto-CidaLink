const fs = require("fs");
const path = require("path");
const postagensModel = require("../model/postsModel.js");
const { pastaUploads } = require("../utils/upload.js");
const notificacoesModel = require("../model/notificacoesModel.js");
const CATEGORIAS = ["buraco", "iluminacao", "lixo", "saneamento", "outro"];
const STATUS = ["pendente", "andamento", "resolvida"];

function apagarArquivo(nome) {
  if (!nome) return;
  fs.unlink(path.join(pastaUploads, path.basename(nome)), () => {});
}

function lerCoordenada(valor, limite) {
  if (valor === undefined || valor === null || valor === "") {
    return { ok: true, valor: null };
  }
  const n = Number(valor);
  if (!Number.isFinite(n) || Math.abs(n) > limite) return { ok: false };
  return { ok: true, valor: String(n) };
}

function formatarPostagem(p) {
  return {
    id: p.id,
    categoria: p.categoria,
    descricao: p.descricao,
    logradouro: p.logradouro || "",
    bairroId: p.bairro_id,
    bairro: p.bairro || "",
    latitude: p.latitude || "",
    longitude: p.longitude || "",
    foto: p.foto,
    status: p.status,
    respostaAdmin: p.resposta_admin || "",
    criadoEm: p.criado_em,
    autor: {
      id: p.usuario_id,
      nome: p.autor_nome,
      fotoPerfil: p.autor_foto || null,
    },
  };
}

async function Criar(req, res) {
  const recusar = (mensagem) => {
    apagarArquivo(req.file?.filename);
    return res.status(400).json({ message: "Error", data: mensagem });
  };

  try {
    const { categoria, descricao, logradouro, bairro, latitude, longitude } =
      req.body;

    if (!CATEGORIAS.includes(categoria)) return recusar("Categoria inválida.");

    const desc = (descricao || "").trim();
    if (!desc) return recusar("A descrição é obrigatória.");
    if (desc.length > 1000)
      return recusar("A descrição deve ter no máximo 1000 caracteres.");

    const rua = (logradouro || "").trim();
    if (rua.length > 150)
      return recusar("O logradouro deve ter no máximo 150 caracteres.");

    const nomeBairro = (bairro || "").trim();
    if (nomeBairro.length > 100)
      return recusar("O bairro deve ter no máximo 100 caracteres.");

    const lat = lerCoordenada(latitude, 90);
    const lng = lerCoordenada(longitude, 180);
    if (!lat.ok || !lng.ok) return recusar("Coordenadas inválidas.");
    if (lat.valor === null || lng.valor === null)
      return recusar("Informe o local da ocorrência.");

    const bairroId = nomeBairro
      ? await postagensModel.ObterOuCriarBairro(nomeBairro)
      : null;

    const id = await postagensModel.Create({
      usuarioId: req.usuario.id,
      categoria,
      descricao: desc,
      logradouro: rua || null,
      bairroId,
      latitude: lat.valor,
      longitude: lng.valor,
      foto: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const criada = await postagensModel.GetById(id);

    // notifica os admins; se falhar, a ocorrência continua criada
    try {
      await notificacoesModel.CriarParaAdmins(
        id,
        "Nova ocorrência recebida",
        `Uma nova ocorrência de ${criada.categoria} foi publicada e precisa ser analisada.`,
      );
    } catch (erroNotificacao) {
      console.error("Falha ao notificar admins:", erroNotificacao);
    }

    return res.status(201).json({
      message: "Success",
      data: { postagem: formatarPostagem(criada) },
    });
  } catch (error) {
    apagarArquivo(req.file?.filename);
    console.error("Erro no PostagensController (Criar):", error);
    return res
      .status(500)
      .json({ message: "Error", data: "Erro interno no servidor." });
  }
}

async function Listar(req, res) {
  try {
    const { status } = req.query;
    if (status && !STATUS.includes(status)) {
      return res
        .status(400)
        .json({ message: "Error", data: "Status inválido." });
    }
    const rows = await postagensModel.List({ status });
    return res.status(200).json({
      message: "Success",
      data: { postagens: rows.map(formatarPostagem) },
    });
  } catch (error) {
    console.error("Erro no PostagensController (Listar):", error);
    return res
      .status(500)
      .json({ message: "Error", data: "Erro interno no servidor." });
  }
}

async function ListarMinhas(req, res) {
  try {
    const rows = await postagensModel.ListByUser(req.usuario.id);
    return res.status(200).json({
      message: "Success",
      data: { postagens: rows.map(formatarPostagem) },
    });
  } catch (error) {
    console.error("Erro no PostagensController (ListarMinhas):", error);
    return res
      .status(500)
      .json({ message: "Error", data: "Erro interno no servidor." });
  }
}

async function AtualizarStatus(req, res) {
  try {
    const { status, respostaAdmin } = req.body;

    if (!STATUS.includes(status)) {
      return res
        .status(400)
        .json({ message: "Error", data: "Status inválido." });
    }
    const resposta = (respostaAdmin || "").trim();
    if (resposta.length > 1000) {
      return res.status(400).json({
        message: "Error",
        data: "A resposta deve ter no máximo 1000 caracteres.",
      });
    }

    const postagem = await postagensModel.GetById(req.params.id);
    if (!postagem) {
      return res
        .status(404)
        .json({ message: "Error", data: "Postagem não encontrada." });
    }

    await postagensModel.UpdateStatus(postagem.id, status, resposta || null);
    const atualizada = await postagensModel.GetById(postagem.id);

    const mudouStatus = postagem.status !== status;

    const mudouResposta = (postagem.resposta_admin || "") !== (resposta || "");

    if (mudouStatus || mudouResposta) {
      await notificacoesModel.Criar(
        postagem.usuario_id,
        postagem.id,
        "status_atualizado",
        "Sua ocorrência foi atualizada",
        `A prefeitura atualizou sua ocorrência. Novo status: ${status}. ${
          resposta || ""
        }`,
      );
    }
    return res.status(200).json({
      message: "Success",
      data: { postagem: formatarPostagem(atualizada) },
    });
  } catch (error) {
    console.error("Erro no PostagensController (AtualizarStatus):", error);
    return res
      .status(500)
      .json({ message: "Error", data: "Erro interno no servidor." });
  }
}

async function Excluir(req, res) {
  try {
    const postagem = await postagensModel.GetById(req.params.id);
    if (!postagem) {
      return res
        .status(404)
        .json({ message: "Error", data: "Postagem não encontrada." });
    }

    const dono = postagem.usuario_id === req.usuario.id;
    if (!dono && req.usuario.tipo !== "admin") {
      return res.status(403).json({
        message: "Error",
        data: "Você não pode excluir esta postagem.",
      });
    }

    await postagensModel.Delete(postagem.id);
    apagarArquivo(postagem.foto);

    return res
      .status(200)
      .json({ message: "Success", data: "Postagem removida." });
  } catch (error) {
    console.error("Erro no PostagensController (Excluir):", error);
    return res
      .status(500)
      .json({ message: "Error", data: "Erro interno no servidor." });
  }
}

module.exports = { Criar, Listar, ListarMinhas, AtualizarStatus, Excluir };
