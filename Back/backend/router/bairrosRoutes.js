const express = require("express");
const router = express.Router();

const { db } = require("../databases/databaseContext.js");
const { verificarToken } = require("../middleware/authMiddleware.js");

router.get("/bairros", verificarToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, nome FROM bairros ORDER BY nome",
    );
    return res
      .status(200)
      .json({ message: "Success", data: { bairros: rows } });
  } catch (error) {
    console.error("Erro em GET /bairros:", error);
    return res
      .status(500)
      .json({ message: "Error", data: "Erro interno no servidor." });
  }
});

module.exports = router;
