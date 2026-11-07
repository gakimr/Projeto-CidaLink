const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Error", data: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" "); // formato: "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Error", data: "Token mal formatado." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, tipo }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Error", data: "Token inválido ou expirado." });
  }
}

function somenteAdmin(req, res, next) {
  if (req.usuario?.tipo !== "admin") {
    return res
      .status(403)
      .json({ message: "Error", data: "Acesso restrito a administradores." });
  }
  next();
}

module.exports = { verificarToken, somenteAdmin };
