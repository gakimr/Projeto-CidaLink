const express = require("express");
const router = express.Router();

const postsController = require("../controller/postsControllers.js");
const {
  verificarToken,
  somenteAdmin,
} = require("../middleware/authMiddleware.js");
const { receberImagem } = require("../utils/upload.js");

router.get("/postagens", verificarToken, postsController.Listar);
router.get("/postagens/:id", verificarToken, postsController.Buscar);
router.get("/postagens/minhas", verificarToken, postsController.ListarMinhas);
router.post(
  "/postagens",
  verificarToken,
  receberImagem("foto"),
  postsController.Criar,
);
router.put(
  "/postagens/:id/status",
  verificarToken,
  somenteAdmin,
  postsController.AtualizarStatus,
);
router.delete("/postagens/:id", verificarToken, postsController.Excluir);

module.exports = router;
