
const notificacoesModel = require("../model/notificacoesModel.js");

async function Listar(req, res) {
  try {
    const notificacoes = await notificacoesModel.Listar(
      req.usuario.id
    );

    return res.status(200).json({
      message: "Success",
      data: { notificacoes },
    });
  } catch (error) {
    console.error("Erro ao listar notificações:", error);

    return res.status(500).json({
      message: "Error",
      data: "Erro ao carregar notificações.",
    });
  }
}

async function MarcarLida(req, res) {
  try {
    const alteradas = await notificacoesModel.MarcarLida(
      req.params.id,
      req.usuario.id
    );

    if (!alteradas) {
      return res.status(404).json({
        message: "Error",
        data: "Notificação não encontrada ou já lida.",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: "Notificação marcada como lida.",
    });
  } catch (error) {
    console.error("Erro ao marcar notificação:", error);

    return res.status(500).json({
      message: "Error",
      data: "Erro ao atualizar notificação.",
    });
  }
}

async function MarcarTodasLidas(req, res) {
  try {
    await notificacoesModel.MarcarTodasLidas(req.usuario.id);

    return res.status(200).json({
      message: "Success",
      data: "Todas as notificações foram marcadas como lidas.",
    });
  } catch (error) {
    console.error("Erro ao marcar todas:", error);

    return res.status(500).json({
      message: "Error",
      data: "Erro ao atualizar notificações.",
    });
  }
}

module.exports = {
  Listar,
  MarcarLida,
  MarcarTodasLidas,
};
