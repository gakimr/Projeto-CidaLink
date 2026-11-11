
const express = require("express");
const router = express.Router();

const controller = require("../controller/notificacoesControllers.js");
const { verificarToken } = require("../middleware/authMiddleware.js");

router.get(
  "/notificacoes",
  verificarToken,
  controller.Listar
);

router.put(
  "/notificacoes/:id/lida",
  verificarToken,
  controller.MarcarLida
);

router.put(
  "/notificacoes/lidas",
  verificarToken,
  controller.MarcarTodasLidas
);

module.exports = router;
