const express = require("express");
const router = express.Router();

const authController = require("../controller/authControllers.js");
const { verificarToken } = require("../middleware/authMiddleware.js");
const { upload } = require("../utils/upload.js");

router.post("/login", authController.Login);
router.post("/cadastro", authController.Cadastro);
router.put("/perfil", verificarToken, authController.AtualizarPerfil);
router.put(
  "/perfil/foto",
  verificarToken,
  (req, res, next) => {
    upload.single("foto")(req, res, (err) => {
      if (err) {
        const mensagem =
          err.code === "LIMIT_FILE_SIZE"
            ? "A imagem deve ter no máximo 2 MB."
            : "Envie uma imagem JPG, PNG ou WEBP.";
        return res.status(400).json({ message: "Error", data: mensagem });
      }
      next();
    });
  },
  authController.AtualizarFoto,
);

module.exports = router;
